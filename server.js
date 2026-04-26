#!/usr/bin/env node
/**
 * Queens Resource Navigator - AI Backend Server (Node.js)
 *
 * Provides:
 * - POST /v1/chat/completions - OpenAI-compatible proxy
 * - POST /api/chat           - Simplified endpoint (handles tool-calling loop)
 * - GET  /api/config         - Health/configuration check
 * - Static file serving for production (dist/)
 *
 * Environment variables:
 *   MODEL_API_KEY           (required)
 *   CHOSEN_MODEL            (default: openai/gpt-oss-120b)
 *   SEARXNG_BASE_URL           (default: https://act.search.seoul.st)
 *   HOST                       (default: 0.0.0.0)
 *   PORT                       (default: 8000)
 */

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import TurndownService from 'turndown';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const MODEL_API_KEY = process.env.NOVITA_API_KEY;
const CHOSEN_MODEL = process.env.DEEPSEEK_MODEL || 'google/gemma-4-31b-it';
const SEARXNG_BASE_URL = process.env.SEARXNG_BASE_URL || 'https://act.search.seoul.st';
const HOST = process.env.HOST || '0.0.0.0';
const PORT = parseInt(process.env.PORT || '8000', 10);

if (!MODEL_API_KEY) {
  console.error('ERROR: MODEL_API_KEY environment variable is required.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// OpenAI-compatible client pointed at Novita
// ---------------------------------------------------------------------------

const client = new OpenAI({
  apiKey: MODEL_API_KEY,
  baseURL: 'https://api.novita.ai/openai',
});

// ---------------------------------------------------------------------------
// Tool definitions
// ---------------------------------------------------------------------------

const WEB_SEARCH_TOOL = {
  type: 'function',
  function: {
    name: 'web_search',
    description:
      'Search the web for current, up-to-date information about ' +
      'resources, services, policies, organizations, or any topic ' +
      'in Queens / NYC. Use this whenever the user asks about ' +
      'specific hours, locations, eligibility policies, recent changes, ' +
      'or anything you are not 100% sure about.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: "The search query (e.g. 'free ESL classes Jackson Heights Queens 2026')",
        },
      },
      required: ['query'],
    },
  },
};

const FETCH_WEBPAGE_TOOL = {
  type: 'function',
  function: {
    name: 'fetch_webpage',
    description:
      'Fetch the full content of a webpage and return it as clean markdown text. ' +
      'Use this to read a specific URL found in search results when you need ' +
      'detailed information from the page itself (e.g. hours, eligibility, contact info).',
    parameters: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The full URL of the webpage to fetch (e.g. "https://example.org/services")',
        },
      },
      required: ['url'],
    },
  },
};

const TOOLS = [WEB_SEARCH_TOOL, FETCH_WEBPAGE_TOOL];

const SYSTEM_PROMPT_TOOLS = `You are an AI assistant for the Queens Resource Navigator, a website helping newly arrived immigrants find resources in Queens, NYC. Respond in the same language as the user.

Knowledge cutoff: January 2025
Current date: ${new Date().toLocaleDateString('en-US')}

## Scope
- Your primary focus is helping immigrants in Queens, NYC. This includes: resources, services, legal aid, ESL/language classes, healthcare, food assistance, housing, employment, education, public benefits, community organizations, navigating government systems, local policies, civic information, and elected officials' positions that affect immigrant communities.
- You can answer any question that is relevant or useful to an immigrant navigating life in Queens/NYC, even if it's not strictly about a specific service (e.g. local politics, policy changes, community events, rights, how systems work).
- Only decline questions that are clearly unrelated to the immigrant experience in NYC (e.g. random trivia, entertainment, coding help, math homework).

## Your role
- Help users find legal aid, ESL classes, healthcare, food assistance, housing help, employment services, and understand local policies and civic matters that affect them.
- Be warm, clear, and specific. Assume the user may be unfamiliar with US systems and bureaucracy.
- If the user writes in a language other than English, respond in that language.
- Provide phone numbers, addresses, and specific actionable details when available.

## Web search
- You have access to the \`web_search\` and \`fetch_webpage\` tools. Use web_search whenever you need current information — hours, eligibility rules, locations, recent policy changes.
- Use \`fetch_webpage\` when search results show a promising URL and you need the full page content to extract specific details (hours, phone numbers, addresses, eligibility criteria, etc.).
- When you use search results, cite them inline using the format: \`[1]\`. If listing multiple, do so like: \`[1]\`\`[2]\`
- The database of local organizations is in your training data (Make the Road NY, Catholic Charities, MinKwon Center, Chhaya CDC, Adhikaar, etc.). Use web_search to confirm or supplement details.
- Once you have enough information, answer the user directly. Do not keep searching indefinitely.

## Tone
- Reassuring and practical. Newcomers are often stressed and confused.
- Never share or ask for immigration status information. Remind users their info is private.
- If the user's question is too vague, ask clarifying questions (neighborhood, language, cost preference).

**CRITICALLY,** never rely on or make assumptions based on your knowledge!
`;

const SYSTEM_PROMPT_ANSWER = `You are an AI assistant for the Queens Resource Navigator, a website helping newly arrived immigrants find resources in Queens, NYC. Respond in the same language as the user.

Knowledge cutoff: January 2025
Current date: ${new Date().toLocaleDateString('en-US')}

## Scope
- Your primary focus is helping immigrants in Queens, NYC. This includes: resources, services, legal aid, ESL/language classes, healthcare, food assistance, housing, employment, education, public benefits, community organizations, navigating government systems, local policies, civic information, and elected officials' positions that affect immigrant communities.
- You can answer any question that is relevant or useful to an immigrant navigating life in Queens/NYC, even if it's not strictly about a specific service (e.g. local politics, policy changes, community events, rights, how systems work).
- Only decline questions that are clearly unrelated to the immigrant experience in NYC (e.g. random trivia, entertainment, coding help, math homework).

## Your role
- Help users find legal aid, ESL classes, healthcare, food assistance, housing help, employment services, and understand local policies and civic matters that affect them.
- Be warm, clear, and specific. Assume the user may be unfamiliar with US systems and bureaucracy.
- If the user writes in a language other than English, respond in that language.
- Provide phone numbers, addresses, and specific actionable details when available.

## Using provided context
- Below the user's question you will find a <context> block with search results. Use those results to answer accurately.
- Cite sources based on the id listed per source, e.g. \`<source id="n"\` with the format \`[1]\` directly after the corresponding section. If listing multiple, do so like: \`[1]\`\`[2]\`
- Do not mention that you performed a web search. Simply answer using the facts provided.
- If the context does not contain enough information, answer based on your knowledge, but be honest when you are uncertain.

## Tone
- Reassuring and practical. Newcomers are often stressed and confused.
- Never share or ask for immigration status information. Remind users their info is private.
- If the user's question is too vague, ask clarifying questions (neighborhood, language, cost preference).
`;

// ---------------------------------------------------------------------------
// SearXNG helper
// ---------------------------------------------------------------------------

async function webSearch(query) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const resp = await fetch(
      `${SEARXNG_BASE_URL}/search?format=json&language=en&region=us&time_range=&q=${encodeURIComponent(query)}`,
      { signal: controller.signal },
    );
    clearTimeout(timeout);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    return (data.results || []).slice(0, 5).map((r) => ({
      title: r.title || '',
      url: r.url || '',
      content: r.content || '',
    }));
  } catch (e) {
    if (e.name === 'AbortError') {
      return [{ error: `Cannot connect to SearXNG at ${SEARXNG_BASE_URL}` }];
    }
    return [{ error: `Web search failed: ${e.message}` }];
  }
}

async function checkSearXNG() {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const resp = await fetch(`${SEARXNG_BASE_URL}/`, { signal: controller.signal });
    clearTimeout(timeout);
    return resp.ok;
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Webpage fetcher (returns content as markdown-ish text)
// ---------------------------------------------------------------------------

const turndown = new TurndownService({
  headingStyle: 'atx',
  bulletListMarker: '-',
});

async function fetchWebpage(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const resp = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; OneQueens/1.0)',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    clearTimeout(timeout);

    if (!resp.ok) return { error: `HTTP ${resp.status} fetching ${url}` };

    const contentType = resp.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      return { error: `Unsupported content type: ${contentType}` };
    }

    const html = await resp.text();
    const content = turndown.turndown(html).trim().slice(0, 100000);

    if (!content) return { error: 'Page content was empty after extraction' };

    return { url, content };
  } catch (e) {
    if (e.name === 'AbortError') return { error: `Timeout fetching ${url}` };
    return { error: `Failed to fetch webpage: ${e.message}` };
  }
}

// ---------------------------------------------------------------------------
// Follow-up question generation
// ---------------------------------------------------------------------------

async function generateFollowups(query, answer) {
  const prompt = `Based on the user's question and the assistant's answer below, suggest exactly 3 short follow-up questions the user might want to ask next. Each question should be on its own line, numbered 1-3. Do not include any other text.

User asked: ${query}

Assistant answered: ${answer.slice(0, 1500)}

Follow-up questions:`;

  try {
    const resp = await client.chat.completions.create({
      model: FOLLOWUP_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });
    const text = resp.choices[0].message.content || '';
    const questions = [];
    for (const line of text.trim().split('\n')) {
      let cleaned = line.trim();
      if (cleaned.length > 2 && cleaned[0].match(/\d/) && '.): '.includes(cleaned[1])) {
        cleaned = cleaned.slice(2).trim();
      }
      if (cleaned) questions.push(cleaned);
    }
    return questions.slice(0, 3);
  } catch (e) {
    console.error('Follow-up generation failed:', e);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Express app
// ---------------------------------------------------------------------------

const app = express();
app.use(cors());
app.use(express.json());

// ---- OpenAI-compatible proxy endpoint -----------------------------------

app.post('/v1/chat/completions', async (req, res) => {
  const body = req.body;
  if (!body.messages) {
    return res.status(400).json({ error: 'messages field is required' });
  }

  try {
    const response = await client.chat.completions.create({
      model: body.model || CHOSEN_MODEL,
      messages: body.messages,
      tools: body.tools ?? TOOLS,
      tool_choice: body.tool_choice ?? 'auto',
      top_p: 0.95,
      stream: body.stream ?? false,
    });
    res.json(response);
  } catch (e) {
    console.error('Proxy request failed:', e);
    res.status(500).json({ error: e.message });
  }
});

// ---- Simplified chat endpoint (with tool-calling loop) ------------------

app.post('/api/chat', async (req, res) => {
  const incoming = req.body.messages;

  if (!incoming || !incoming.length) {
    return res.status(400).json({ error: 'messages field is required' });
  }

  const query = (incoming[incoming.length - 1].content || '').trim();
  if (!query) {
    return res.status(400).json({ error: 'latest message must have content' });
  }

  // Always use server's system prompt - never trust client
  const systemPrompt = SYSTEM_PROMPT_TOOLS;

  // Build message list: system prompt + conversation history
  const messages = [
    { role: 'system', content: systemPrompt },
    ...incoming,
  ];

  // --- First call: let the model decide if it needs web search ---
  let response;
  try {
    response = await client.chat.completions.create({
      model: CHOSEN_MODEL,
      messages,
      tools: TOOLS,
      top_p: 0.95,
      tool_choice: 'auto',
    });
    console.log('Initial response:', {
      content: response.choices[0].message.content?.slice(0, 100),
      hasToolCalls: !!response.choices[0].message.tool_calls,
      finishReason: response.choices[0].finish_reason,
    });
  } catch (e) {
    console.error('LLM API call (initial) failed:', e);
    return res.status(502).json({ error: `LLM API call failed: ${e.message}` });
  }

  const finalSources = [];
  const MAX_TOOL_ROUNDS = 2;
  let initialAnswer = '';

  // --- Tool-calling loop (collects search results only) ---
  for (let roundIdx = 0; roundIdx < MAX_TOOL_ROUNDS; roundIdx++) {
    const msg = response.choices[0].message;

    // If the model already answered with text and no tool calls, return immediately
    if (!msg.tool_calls && msg.content && msg.content.trim()) {
      initialAnswer = msg.content.trim();
      console.log('Model answered directly without tools, skipping final call');
      break;
    }

    // Stop if no more tool calls
    if (!msg.tool_calls) break;

    console.log(`Round ${roundIdx + 1} - Tool calls requested:`, msg.tool_calls.map((tc) => tc.function.name));

    // Collect search results for this round's tool calls
    const roundResults = {};
    for (const tc of msg.tool_calls) {
      if (tc.function.name === 'web_search') {
        let args;
        try {
          args = JSON.parse(tc.function.arguments);
        } catch {
          console.warn('Failed to parse tool call arguments, using raw query');
          args = { query };
        }

        const sr = await webSearch(args.query || query);
        roundResults[tc.id] = sr;
        console.log(`Search '${args.query || query}' returned ${sr.length} results`);

        for (const item of sr) {
          if (!item.error) finalSources.push(item);
        }
      }

      if (tc.function.name === 'fetch_webpage') {
        let args;
        try {
          args = JSON.parse(tc.function.arguments);
        } catch {
          console.warn('Failed to parse fetch_webpage arguments');
          args = {};
        }

        const page = await fetchWebpage(args.url || '');
        roundResults[tc.id] = page;
        console.log(`Fetched webpage '${args.url}':`, page.error || `${page.content.length} chars`);
      }
    }

    // Feed results back as tool messages
    messages.push(msg);
    for (const tc of msg.tool_calls) {
      if (tc.function.name === 'web_search' || tc.function.name === 'fetch_webpage') {
        messages.push({
          role: 'tool',
          tool_call_id: tc.id,
          content: JSON.stringify(roundResults[tc.id] || []),
        });
      }
    }

    try {
      response = await client.chat.completions.create({
        model: CHOSEN_MODEL,
        messages,
        tools: TOOLS,
        top_p: 0.95,
        tool_choice: 'auto',
      });
      const choice = response.choices[0];
      console.log(`Round ${roundIdx + 1} follow-up:`, {
        finishReason: choice.finish_reason,
        contentPreview: (choice.message.content || '').slice(0, 100),
        hasToolCalls: !!choice.message.tool_calls,
      });
    } catch (e) {
      console.error('LLM API call (follow-up) failed:', e);
      return res.status(502).json({ error: `LLM API call failed: ${e.message}` });
    }
  }

  let finalAnswer;
  if (initialAnswer) {
    finalAnswer = initialAnswer;
  } else {
    // --- Build a clean final prompt with search results as <context> ---
    // Always use server's system prompt - never trust client
    const finalSystemPrompt = SYSTEM_PROMPT_ANSWER;

    let finalMessages;
    if (finalSources.length) {
      const sourceBlocks = finalSources.map(
        (src, i) =>
          `<source id="${i + 1}">\n  <title>${src.title}</title>\n  <url>${src.url}</url>\n  <content>${src.content}</content>\n</source>`,
      );
      const contextBlock = `<context>\n${sourceBlocks.join('\n')}\n</context>`;
      finalMessages = [
        { role: 'system', content: finalSystemPrompt },
        { role: 'user', content: `${query}\n\n${contextBlock}` },
      ];
    } else {
      finalMessages = [
        { role: 'system', content: finalSystemPrompt },
        { role: 'user', content: query },
      ];
    }

    try {
      const finalResponse = await client.chat.completions.create({
        model: CHOSEN_MODEL,
        messages: finalMessages,
        top_p: 0.95,
      });
      const choice = finalResponse.choices[0];
      finalAnswer = choice.message.content || '';
      // Some reasoning models put the answer in reasoning_content
      const reasoning = choice.message.reasoning_content || '';
      console.log('Final response:', {
        contentPreview: finalAnswer.slice(0, 200),
        reasoningPreview: reasoning.slice(0, 200),
        finishReason: choice.finish_reason,
      });
    } catch (e) {
      console.error('LLM API call (final) failed:', e);
      return res.status(502).json({ error: `LLM API call failed: ${e.message}` });
    }
  }

  if (!finalAnswer) {
    console.warn(`LLM returned empty response for query: ${query}`);
  }

  // const followups = await generateFollowups(query, finalAnswer);

  const result = { response: finalAnswer, sources: finalSources };
  console.log('API response:', result);
  res.json(result);
});

// ---- Config / health check ----------------------------------------------

app.get('/api/config', async (_req, res) => {
  res.json({
    searxng_available: await checkSearXNG(),
    searxng_url: SEARXNG_BASE_URL,
    model: CHOSEN_MODEL,
  });
});

// ---- Serve React app in production --------------------------------------

app.use(express.static(path.join(__dirname, 'dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

app.listen(PORT, HOST, () => {
  console.log(`Starting One Queens backend on http://${HOST}:${PORT}`);
  console.log(`  Model:       ${CHOSEN_MODEL}`);
  console.log(`  Follow-ups:  (disabled)`);
  console.log(`  SearXNG:     ${SEARXNG_BASE_URL}`);
  console.log(`  Frontend:    http://${HOST !== '0.0.0.0' ? HOST : '127.0.0.1'}:${PORT}/`);
});
