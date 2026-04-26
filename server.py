#!/usr/bin/env python3
"""
Queens Resource Navigator - AI Backend Server

Provides:
- POST /v1/chat/completions - OpenAI-compatible proxy to DeepSeek API
- POST /api/chat          - Simplified endpoint for the frontend (handles tool-calling loop)
- GET  /api/config        - Health/configuration check
- GET  /                  - Serves the AI search mockup HTML

Environment variables:
  DEEPSEEK_API_KEY  (required) - DeepSeek API key
  DEEPSEEK_MODEL              - Model name (default: deepseek-chat)
  SEARXNG_BASE_URL            - SearXNG instance URL (default: http://localhost:4000)
  HOST                        - Server host (default: 0.0.0.0)
  PORT                        - Server port (default: 8000)
"""

from __future__ import annotations

import json
import logging
import os
import sys
from typing import Any

import requests
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from openai import OpenAI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

DEEPSEEK_API_KEY = os.environ.get("NOVITA_API_KEY")
DEEPSEEK_MODEL = os.environ.get("DEEPSEEK_MODEL", "openai/gpt-oss-120b")
FOLLOWUP_MODEL = os.environ.get("FOLLOWUP_MODEL", "openai/gpt-oss-120b")
SEARXNG_BASE_URL = os.environ.get("SEARXNG_BASE_URL", "https://act.search.seoul.st")
HOST = os.environ.get("HOST", "0.0.0.0")
PORT = int(os.environ.get("PORT", "8000"))

if not DEEPSEEK_API_KEY:
    print("ERROR: NOVITA_API_KEY environment variable is required.", file=sys.stderr)
    sys.exit(1)

# ---------------------------------------------------------------------------
# OpenAI-compatible client pointed at DeepSeek
# ---------------------------------------------------------------------------

client = OpenAI(
    api_key=DEEPSEEK_API_KEY,
    base_url="https://api.novita.ai/openai",
)

REASONING_EXTRA_BODY = {
    "chat_template_kwargs": {
        "enable_reasoning": True,
    },
}

# ---------------------------------------------------------------------------
# Tool definitions
# ---------------------------------------------------------------------------

WEB_SEARCH_TOOL: dict[str, Any] = {
    "type": "function",
    "function": {
        "name": "web_search",
        "description": (
            "Search the web for current, up-to-date information about "
            "resources, services, policies, organizations, or any topic "
            "in Queens / NYC. Use this whenever the user asks about "
            "specific hours, locations, eligibility policies, recent changes, "
            "or anything you are not 100% sure about."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query (e.g. 'free ESL classes Jackson Heights Queens 2026')",
                }
            },
            "required": ["query"],
        },
    },
}

TOOLS = [WEB_SEARCH_TOOL]

SYSTEM_PROMPT_TOOLS = """You are an AI assistant for the Queens Resource Navigator, a website helping newly arrived immigrants find resources in Queens, NYC.

## Your role
- Help users find legal aid, ESL classes, healthcare, food assistance, housing help, and employment services.
- Be warm, clear, and specific. Assume the user may be unfamiliar with US systems and bureaucracy.
- If the user writes in a language other than English, respond in that language.
- Provide phone numbers, addresses, and specific actionable details when available.

## Web search
- You have access to the `web_search` tool. Use it whenever you need current information — hours, eligibility rules, locations, recent policy changes.
- When you use search results, cite them inline (e.g. "according to NYC.gov...").
- The database of local organizations is in your training data (Make the Road NY, Catholic Charities, MinKwon Center, Chhaya CDC, Adhikaar, etc.). Use web_search to confirm or supplement details.
- Once you have enough information, answer the user directly. Do not keep searching indefinitely.

## Tone
- Reassuring and practical. Newcomers are often stressed and confused.
- Never share or ask for immigration status information. Remind users their info is private.
- If the user's question is too vague, ask clarifying questions (neighborhood, language, cost preference).
"""

SYSTEM_PROMPT_ANSWER = """You are an AI assistant for the Queens Resource Navigator, a website helping newly arrived immigrants find resources in Queens, NYC.

## Your role
- Help users find legal aid, ESL classes, healthcare, food assistance, housing help, and employment services.
- Be warm, clear, and specific. Assume the user may be unfamiliar with US systems and bureaucracy.
- If the user writes in a language other than English, respond in that language.
- Provide phone numbers, addresses, and specific actionable details when available.

## Using provided context
- Below the user's question you will find a <context> block with search results. Use those results to answer accurately.
- Cite sources based on the id listed per source, e.g. `<source id="n"` with the format `[1]` directly after the corresponding section.
- Do not mention that you performed a web search. Simply answer using the facts provided.
- If the context does not contain enough information, answer based on your knowledge, but be honest when you are uncertain.

## Tone
- Reassuring and practical. Newcomers are often stressed and confused.
- Never share or ask for immigration status information. Remind users their info is private.
- If the user's question is too vague, ask clarifying questions (neighborhood, language, cost preference).
"""

# ---------------------------------------------------------------------------
# SearXNG helper
# ---------------------------------------------------------------------------


def web_search(query: str) -> list[dict[str, str]]:
    """Execute a search via SearXNG JSON API. Returns up to 5 results."""
    try:
        resp = requests.get(
            f"{SEARXNG_BASE_URL}/search",
            params={"format": "json", "q": query},
            timeout=15,
        )
        resp.raise_for_status()
        data = resp.json()
        results = []
        for r in data.get("results", [])[:5]:
            results.append(
                {
                    "title": r.get("title", ""),
                    "url": r.get("url", ""),
                    "content": r.get("content", ""),
                }
            )
        return results
    except requests.ConnectionError:
        return [{"error": f"Cannot connect to SearXNG at {SEARXNG_BASE_URL}"}]
    except Exception as e:
        return [{"error": f"Web search failed: {e}"}]


def check_searxng() -> bool:
    """Ping SearXNG to see if it's reachable."""
    try:
        resp = requests.get(f"{SEARXNG_BASE_URL}/", timeout=5)
        return resp.ok
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Flask app
# ---------------------------------------------------------------------------

app = Flask(__name__)
CORS(app)


# ---- OpenAI-compatible proxy endpoint -----------------------------------


@app.route("/v1/chat/completions", methods=["POST"])
def openai_proxy():
    """
    Pass-through proxy to DeepSeek API.
    Accepts the same request body as OpenAI's chat completions endpoint.
    """
    body = request.get_json(force=True)

    # Inject system prompt if not present
    if "messages" not in body:
        return jsonify({"error": "messages field is required"}), 400

    # Forward to the LLM API
    try:
        response = client.chat.completions.create(
            model=body.get("model", DEEPSEEK_MODEL),
            messages=body["messages"],
            tools=body.get("tools", TOOLS),
            tool_choice=body.get("tool_choice", "auto"),
            top_p=0.95,
            stream=body.get("stream", False),
        )
        return jsonify(json.loads(response.model_dump_json()))
    except Exception as e:
        logger.exception("Proxy request failed")
        return jsonify({"error": str(e)}), 500


# ---- Simplified chat endpoint (with tool-calling loop) ------------------


@app.route("/api/chat", methods=["POST"])
def chat():
    """
    Multi-turn chat endpoint.

    Request:  { "messages": [{"role":"user","content":"..."}, ...] }
              - Client sends the full conversation history each time.
              - Only the latest message needs to be new.
    Response: { "response": "...", "sources": [...], "followups": ["...", "...", "..."] }
    """
    data = request.get_json(force=True)
    incoming = data.get("messages", [])
    if not incoming:
        return jsonify({"error": "messages field is required"}), 400

    # Extract the latest user message for search/context purposes
    query = incoming[-1].get("content", "").strip()
    if not query:
        return jsonify({"error": "latest message must have content"}), 400

    # Build message list: system prompt + conversation history
    messages: list[dict[str, Any]] = [
        {"role": "system", "content": SYSTEM_PROMPT_TOOLS},
        *incoming,
    ]

    # --- First call: let the model decide if it needs web search ---
    try:
        response = client.chat.completions.create(
            model=DEEPSEEK_MODEL,
            messages=messages,
            tools=TOOLS,
            top_p=0.95,
            tool_choice="auto",
        )
        logger.info("Raw LLM response (initial): choices=%s", response.choices)
        if response.choices:
            logger.info("Initial response: content=%s, tool_calls=%s, finish_reason=%s",
                        response.choices[0].message.content,
                        response.choices[0].message.tool_calls,
                        response.choices[0].finish_reason)
    except Exception as e:
        logger.exception("LLM API call (initial) failed")
        return jsonify({"error": f"LLM API call failed: {e}"}), 502

    final_sources: list[dict[str, str]] = []
    MAX_TOOL_ROUNDS = 2

    # --- Tool-calling loop (collects search results only) ---
    initial_answer = ""
    for round_idx in range(MAX_TOOL_ROUNDS):
        msg = response.choices[0].message

        # If the model already answered with text and no tool calls, we can return immediately
        if not msg.tool_calls and msg.content and msg.content.strip():
            initial_answer = msg.content.strip()
            logger.info("Model answered directly without tools, skipping final call")
            break

        # Stop if the model produced content (answer) and no more tool calls
        if not msg.tool_calls:
            break

        logger.info("Round %d - Tool calls requested: %s", round_idx + 1, msg.tool_calls)

        # Collect search results for this round's tool calls
        round_results: dict[str, list[dict[str, str]]] = {}
        for tc in msg.tool_calls:
            if tc.function.name == "web_search":
                try:
                    args = json.loads(tc.function.arguments)
                except json.JSONDecodeError:
                    logger.warning("Failed to parse tool call arguments, using raw query")
                    args = {"query": query}

                sr = web_search(args.get("query", query))
                round_results[tc.id] = sr
                logger.info("Search '%s' returned %d results", args.get("query", query), len(sr))

                for item in sr:
                    if "error" not in item:
                        final_sources.append(item)

        # Feed results back as tool messages
        messages.append(msg.model_dump())
        for tc in msg.tool_calls:
            if tc.function.name == "web_search":
                messages.append(
                    {
                        "role": "tool",
                        "tool_call_id": tc.id,
                        "content": json.dumps(round_results.get(tc.id, [])),
                    }
                )

        try:
            response = client.chat.completions.create(
                model=DEEPSEEK_MODEL,
                messages=messages,
                tools=TOOLS,
                top_p=0.95,
                tool_choice="auto",
            )
            if response.choices:
                choice = response.choices[0]
                content_preview = (choice.message.content or "")[:100]
                logger.info("Round %d follow-up: finish_reason=%s, content_preview=%r, has_tool_calls=%s",
                            round_idx + 1, choice.finish_reason, content_preview, bool(choice.message.tool_calls))
        except Exception as e:
            logger.exception("LLM API call (follow-up) failed")
            return jsonify({"error": f"LLM API call failed: {e}"}), 502

    if initial_answer and not final_sources:
        # Model answered without tools and no sources — use as-is
        final_answer = initial_answer
    else:
        # --- Build a clean final prompt with search results as <context> ---
        if final_sources:
            source_blocks = []
            for i, src in enumerate(final_sources, 1):
                source_blocks.append(
                    f'<source id="{i}">\n'
                    f'  <title>{src["title"]}</title>\n'
                    f'  <url>{src["url"]}</url>\n'
                    f'  <content>{src["content"]}</content>\n'
                    f'</source>'
                )
            context_block = "<context>\n" + "\n".join(source_blocks) + "\n</context>"
            final_messages = [
                {"role": "system", "content": SYSTEM_PROMPT_ANSWER},
                {"role": "user", "content": f"{query}\n\n{context_block}"},
            ]
        else:
            final_messages = [
                {"role": "system", "content": SYSTEM_PROMPT_ANSWER},
                {"role": "user", "content": query},
            ]

        try:
            final_response = client.chat.completions.create(
                model=DEEPSEEK_MODEL,
                messages=final_messages,
                top_p=0.95,
            )
            if final_response.choices:
                choice = final_response.choices[0]
                final_answer = choice.message.content or ""
                # Some reasoning models put the answer in reasoning_content
                reasoning = getattr(choice.message, "reasoning_content", None) or ""
                logger.info("Final response: content=%r, reasoning_content=%r, finish_reason=%s",
                            final_answer[:200] if final_answer else final_answer,
                            reasoning[:200] if reasoning else reasoning,
                            choice.finish_reason)
            else:
                final_answer = ""
        except Exception as e:
            logger.exception("LLM API call (final) failed")
            return jsonify({"error": f"LLM API call failed: {e}"}), 502

    if not final_answer:
        logger.warning("LLM returned empty response for query: %s — content and reasoning_content both empty", query)

    # --- Generate follow-up questions using smaller model ---
    followups = _generate_followups(query, final_answer)

    result = {"response": final_answer, "sources": final_sources, "followups": followups}
    logger.info("API response: %s", result)
    return jsonify(result)


def _generate_followups(query: str, answer: str) -> list[str]:
    """Use a smaller model to suggest 3 relevant follow-up questions."""
    prompt = f"""Based on the user's question and the assistant's answer below, suggest exactly 3 short follow-up questions the user might want to ask next. Each question should be on its own line, numbered 1-3. Do not include any other text.

User asked: {query}

Assistant answered: {answer[:1500]}

Follow-up questions:"""
    try:
        resp = client.chat.completions.create(
            model=FOLLOWUP_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=200,
            temperature=0.7,
        )
        text = resp.choices[0].message.content or ""
        questions: list[str] = []
        for line in text.strip().splitlines():
            line = line.strip()
            # Strip leading "1. ", "1) ", etc.
            if len(line) > 2 and line[0].isdigit() and line[1] in ".): ":
                line = line[2:].strip()
            if line:
                questions.append(line)
        return questions[:3]
    except Exception:
        logger.exception("Follow-up generation failed")
        return []


# ---- Config / health check ----------------------------------------------


@app.route("/api/config", methods=["GET"])
def config():
    return jsonify(
        {
            "searxng_available": check_searxng(),
            "searxng_url": SEARXNG_BASE_URL,
            "model": DEEPSEEK_MODEL,
        }
    )


# ---- Serve the frontend -------------------------------------------------


@app.route("/")
def index():
    return send_from_directory(".", "ai-search-mockup.html")


@app.route("/<path:path>")
def static_files(path):
    """Serve static files from the project root."""
    try:
        return send_from_directory(".", path)
    except Exception:
        return jsonify({"error": "File not found"}), 404


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print(
        f"Starting One Queens backend on http://{HOST}:{PORT}",
        flush=True,
    )
    print(f"  Model:       {DEEPSEEK_MODEL}", flush=True)
    print(f"  Follow-ups:  {FOLLOWUP_MODEL}", flush=True)
    print(f"  SearXNG:     {SEARXNG_BASE_URL}", flush=True)
    print(f"  Frontend:    http://{HOST if HOST != '0.0.0.0' else '127.0.0.1'}:{PORT}/", flush=True)
    app.run(host=HOST, port=PORT, debug=True)
