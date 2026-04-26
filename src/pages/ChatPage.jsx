import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { marked } from 'marked';
import './ChatPage.css';

// Configure marked for the same output as the HTML mockup
marked.use({ breaks: true, gfm: true });

const languageButtons = [
  { key: 'en', label: 'EN' },
  { key: 'es', label: 'ES' },
  { key: 'zh', label: '中文' },
  { key: 'bn', label: 'বাং' },
  { key: 'ko', label: '한' },
];

const translations = {
  en: {
    // Navigation
    brand_title: 'Queens',
    brand_subtitle: 'Navigator',
    new_chat: '+ New chat',
    back_to_directory: '← Back to directory',

    // Welcome section
    welcome_title: 'Find Help in Queens',
    welcome_subtitle: 'Ask anything. Our AI assistant searches our directory and the web to find resources tailored to you.',

    // Suggested questions
    suggested_questions: [
      'Free Korean-speaking immigration lawyer',
      'ESL classes for Bengali speakers near Jackson Heights',
      'Low-cost dental care without insurance',
      'What documents do I need for a work permit?',
    ],

    // Chat interface
    input_placeholder: 'Ask a question...',
    loading_text: 'Searching and thinking...',

    // AI message elements
    sources_label: '🌐 Sources',
    error_title: '⚠️ Error',
    error_hint_prefix: 'Make sure the backend server is running (',
    error_hint_command: 'npm run dev:server',
    error_hint_suffix: ') and ',
    error_hint_env: 'NOVITA_API_KEY',
    error_hint_end: ' is set.',

    // API system messages (sent to AI but not shown to user)
    system_prompt: `You are a helpful AI assistant for One Queens, a community resource directory for immigrants in Queens, NYC.

When answering:
1. Prioritize resources from the local Queens directory when relevant.
2. Provide practical, actionable information.
3. Use citations [1], [2], etc. when referencing specific sources.
4. Be empathetic and respectful - many users may be stressed or confused.
5. Keep responses clear and organized.

Current date: ${new Date().toLocaleDateString('en-US')}`,
  },
  es: {
    // Navigation
    brand_title: 'Queens',
    brand_subtitle: 'Navigator',
    new_chat: '+ Nueva conversación',
    back_to_directory: '← Volver al directorio',

    // Welcome section
    welcome_title: 'Encuentra ayuda en Queens',
    welcome_subtitle: 'Pregunta lo que sea. Nuestro asistente de IA busca en nuestro directorio y en la web para encontrar recursos adaptados a ti.',

    // Suggested questions
    suggested_questions: [
      'Abogado de inmigración gratuito que habla coreano',
      'Clases de ESL para hablantes de bengalí cerca de Jackson Heights',
      'Atención dental de bajo costo sin seguro',
      '¿Qué documentos necesito para un permiso de trabajo?',
    ],

    // Chat interface
    input_placeholder: 'Haz una pregunta...',
    loading_text: 'Buscando y pensando...',

    // AI message elements
    sources_label: '🌐 Fuentes',
    error_title: '⚠️ Error',
    error_hint_prefix: 'Asegúrate de que el servidor backend esté ejecutándose (',
    error_hint_command: 'npm run dev:server',
    error_hint_suffix: ') y que ',
    error_hint_env: 'NOVITA_API_KEY',
    error_hint_end: ' esté configurada.',

    // API system messages
    system_prompt: `Eres un asistente de IA servicial para One Queens, un directorio de recursos comunitarios para inmigrantes en Queens, Nueva York.

Al responder:
1. Prioriza los recursos del directorio local de Queens cuando sea relevante.
2. Proporciona información práctica y accionable.
3. Usa citas [1], [2], etc. cuando hagas referencia a fuentes específicas.
4. Sé empático y respetuoso: muchos usuarios pueden estar estresados o confundidos.
5. Mantén las respuestas claras y organizadas.

Fecha actual: ${new Date().toLocaleDateString('es-ES')}`,
  },
  zh: {
    // Navigation
    brand_title: 'Queens',
    brand_subtitle: 'Navigator',
    new_chat: '+ 新对话',
    back_to_directory: '← 返回目录',

    // Welcome section
    welcome_title: '在皇后区寻找帮助',
    welcome_subtitle: '任何问题都可以问。我们的人工智能助手会搜索我们的目录和网络，为您找到量身定制的资源。',

    // Suggested questions
    suggested_questions: [
      '免费韩语移民律师',
      'Jackson Heights附近为孟加拉语使用者提供的ESL课程',
      '无保险的低成本牙科护理',
      '申请工作许可需要什么文件？',
    ],

    // Chat interface
    input_placeholder: '提出一个问题...',
    loading_text: '搜索和思考中...',

    // AI message elements
    sources_label: '🌐 来源',
    error_title: '⚠️ 错误',
    error_hint_prefix: '确保后端服务器正在运行（',
    error_hint_command: 'npm run dev:server',
    error_hint_suffix: '）并且已设置',
    error_hint_env: 'NOVITA_API_KEY',
    error_hint_end: '。',

    // API system messages
    system_prompt: `你是One Queens的AI助手，这是一个为皇后区移民提供的社区资源目录。

回答时：
1. 在相关情况下优先使用皇后区本地目录中的资源。
2. 提供实用、可操作的信息。
3. 引用具体来源时使用[1]、[2]等标注。
4. 保持同理心和尊重——许多用户可能感到压力或困惑。
5. 保持回复清晰有条理。

当前日期：${new Date().toLocaleDateString('zh-CN')}`,
  },
  ko: {
    // Navigation
    brand_title: 'Queens',
    brand_subtitle: 'Navigator',
    new_chat: '+ 새 대화',
    back_to_directory: '← 디렉토리로 돌아가기',

    // Welcome section
    welcome_title: '퀸즈에서 도움 찾기',
    welcome_subtitle: '무엇이든 물어보세요. AI 어시스턴트가 디렉토리와 웹을 검색하여 맞춤형 자원을 찾아드립니다.',

    // Suggested questions
    suggested_questions: [
      '무료 한국어 이민 변호사',
      'Jackson Heights 근처 벵골어 사용자를 위한 ESL 수업',
      '보험 없는 저비용 치과 진료',
      '근로 허가증에 필요한 서류는 무엇인가요?',
    ],

    // Chat interface
    input_placeholder: '질문을 입력하세요...',
    loading_text: '검색하고 생각 중...',

    // AI message elements
    sources_label: '🌐 출처',
    error_title: '⚠️ 오류',
    error_hint_prefix: '백엔드 서버가 실행 중인지 확인하세요 (',
    error_hint_command: 'npm run dev:server',
    error_hint_suffix: ') 그리고 ',
    error_hint_env: 'NOVITA_API_KEY',
    error_hint_end: '가 설정되었는지 확인하세요.',

    // API system messages
    system_prompt: `당신은 One Queens의 AI 어시스턴트입니다. One Queens는 뉴욕 퀸즈의 이민자를 위한 커뮤니티 자원 디렉토리입니다.

답변 시:
1. 관련된 경우 퀸즈 지역 디렉토리의 자원을 우선적으로 사용하세요.
2. 실용적이고 실행 가능한 정보를 제공하세요.
3. 특정 출처를 언급할 때 [1], [2] 등의 인용을 사용하세요.
4. 공감과 존중을 가지고 대하세요 — 많은 사용자가 스트레스를 받거나 혼란스러워할 수 있습니다.
5. 답변을 명확하고 체계적으로 유지하세요.

현재 날짜: ${new Date().toLocaleDateString('ko-KR')}`,
  },
  bn: {
    // Navigation
    brand_title: 'Queens',
    brand_subtitle: 'Navigator',
    new_chat: '+ নতুন চ্যাট',
    back_to_directory: '← ডিরেক্টরিতে ফিরুন',

    // Welcome section
    welcome_title: 'কুইন্সে সাহায্য খুঁজুন',
    welcome_subtitle: 'যা খুশি জিজ্ঞাসা করুন। আমাদের AI সহকারী আমাদের ডিরেক্টরি এবং ওয়েব অনুসন্ধান করে আপনার জন্য উপযুক্ত সম্পদ খুঁজে পেতে সাহায্য করে।',

    // Suggested questions
    suggested_questions: [
      'বিনামূল্যে কোরীয়-ভাষী ইমিগ্রেশন আইনজীবী',
      'Jackson Heights-এর কাছে বাংলা ভাষীদের জন্য ESL ক্লাস',
      'বীমা ছাড়া কম খরচের ডেন্টাল কেয়ার',
      'কাজের পারমিটের জন্য আমার কোন নথি প্রয়োজন?',
    ],

    // Chat interface
    input_placeholder: 'একটি প্রশ্ন জিজ্ঞাসা করুন...',
    loading_text: 'অনুসন্ধান ও চিন্তা করা হচ্ছে...',

    // AI message elements
    sources_label: '🌐 উৎসসমূহ',
    error_title: '⚠️ ত্রুটি',
    error_hint_prefix: 'নিশ্চিত করুন যে ব্যাকএন্ড সার্ভার চলছে (',
    error_hint_command: 'npm run dev:server',
    error_hint_suffix: ') এবং ',
    error_hint_env: 'NOVITA_API_KEY',
    error_hint_end: ' সেট করা আছে।',

    // API system messages
    system_prompt: `আপনি One Queens-এর একজন সহায়ক AI সহকারী, যা Queens, NYC-তে ইমিগ্র্যান্টদের জন্য একটি কমিউনিটি রিসোর্স ডিরেক্টরি।

উত্তর দেওয়ার সময়:
1. প্রাসঙ্গিক হলে স্থানীয় Queens ডিরেক্টরির সম্পদকে অগ্রাধিকার দিন।
2. ব্যবহারিক, কার্যকরী তথ্য প্রদান করুন।
3. নির্দিষ্ট উৎস উল্লেখ করতে [1], [2] ইত্যাদি ব্যবহার করুন।
4. সহানুভূতিশীল এবং শ্রদ্ধাশীল হোন — অনেক ব্যবহারকারী চাপে বা বিভ্রান্ত থাকতে পারেন।
5. উত্তরগুলি পরিষ্কার এবং সংগঠিত রাখুন।

বর্তমান তারিখ: ${new Date().toLocaleDateString('bn-BD')}`,
  },
};

function ChatPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [messages, setMessages] = useState([]); // UI messages with sources/followups
  const [conversationHistory, setConversationHistory] = useState([]); // For API
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Get translations for current language
  const t = translations[language] || translations.en;

  // Get suggested questions for current language
  const suggestedQuestions = t.suggested_questions || translations.en.suggested_questions;

  // Auto-resize textarea
  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  // Handle Enter key to send
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-send initial query from URL
  useEffect(() => {
    if (initialQuery && conversationHistory.length === 0) {
      setInput(initialQuery);
      // Small delay to let the page render
      setTimeout(() => {
        sendMessageWithText(initialQuery);
      }, 100);
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessageWithText = async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text.trim() };
    const updatedHistory = [...conversationHistory, userMessage];

    setConversationHistory(updatedHistory);
    setMessages((prev) => [...prev, { role: 'user', content: text.trim() }]);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setLoading(true);

    try {
      const resp = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedHistory,
          systemPrompt: t.system_prompt,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => null);
        throw new Error(errData?.error || `Server returned ${resp.status}`);
      }

      const data = await resp.json();
      const answer = data.response || 'No response received.';
      const sources = data.sources || [];
      // Add to conversation history (just the text)
      setConversationHistory((prev) => [...prev, { role: 'assistant', content: answer }]);

      // Add to UI messages with sources
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: answer, sources },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'error',
          content: err.message,
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const sendMessage = () => {
    sendMessageWithText(input);
  };

  const selectSuggestion = (text) => {
    setInput(text);
    sendMessageWithText(text);
  };

  const resetChat = () => {
    setMessages([]);
    setConversationHistory([]);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    // Clear URL query param
    if (searchParams.has('q')) {
      navigate('/chat', { replace: true });
    }
  };


  const escapeHtml = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  // Process markdown and add citation links
  const renderMarkdown = (text, sources = []) => {
    // Convert [1], [2], etc. to proper markdown links before parsing
    const preprocessed = text.replace(/\[(\d+)\]/g, (_, n) => {
      const i = parseInt(n, 10) - 1;
      const url = sources[i]?.url || `#source-${n}`;
      return `[${n}](${url})`;
    });

    const rawHtml = marked.parse(preprocessed);

    // Add citation styling + external link attributes to numeric links
    return rawHtml.replace(/<a href="([^"]+)">(\d+)<\/a>/g, (_, href, num) => {
      const isExternal = href.startsWith('http');
      const attrs = ['class="citation"'];
      if (isExternal) attrs.push('target="_blank" rel="noopener noreferrer"');
      return `<a href="${href}" ${attrs.join(' ')}>${num}</a>`;
    });
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="chat-page">

      <nav className="chat-nav">
        <h1>
          {t.brand_title} <span>{t.brand_subtitle}</span>
        </h1>
        <div className="nav-actions">
          <button className="new-chat-btn" onClick={resetChat}>
            {t.new_chat}
          </button>
          <button
            className="home-link"
            onClick={() => navigate('/')}
          >
            {t.back_to_directory}
          </button>
          <div className="lang-toggle">
            {languageButtons.map((btn) => (
              <button
                key={btn.key}
                className={`lang-btn ${language === btn.key ? 'active' : ''}`}
                onClick={() => setLanguage(btn.key)}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="chat-container">
        {!hasMessages && !loading && (
          <div className="welcome">
            <h2>{t.welcome_title}</h2>
            <p className="sub">
              {t.welcome_subtitle}
            </p>
            <div className="suggested">
              {suggestedQuestions.map((q) => (
                <button key={q} onClick={() => selectSuggestion(q)}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="messages">
          {messages.map((msg, idx) => {
            if (msg.role === 'user') {
              return (
                <div key={idx} className="message message-user">
                  <div className="bubble">{msg.content}</div>
                </div>
              );
            }

            if (msg.role === 'error') {
              return (
                <div key={idx} className="message message-ai">
                  <div className="avatar">&#10024;</div>
                  <div className="bubble">
                    <div className="error-box">
                      <strong>{t.error_title}</strong>
                      <p>{msg.content}</p>
                      <p className="error-hint">
                        {t.error_hint_prefix}<code>{t.error_hint_command}</code>{t.error_hint_suffix}
                        <code>{t.error_hint_env}</code>{t.error_hint_end}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            // AI message
            return (
              <div key={idx} className="message message-ai">
                <div className="avatar">&#10024;</div>
                <div className="bubble">
                  <div className="ai-content">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(msg.content, msg.sources),
                      }}
                    />
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="sources-section">
                        <div className="sources-label">{t.sources_label}</div>
                        {msg.sources.map((source, i) => (
                          <div key={i} className="source-item" id={`source-${i + 1}`}>
                            <a href={source.url} target="_blank" rel="noopener noreferrer">
                              {source.title || source.url}
                            </a>
                            {source.content && (
                              <div className="snippet">{source.content}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="message message-ai">
              <div className="avatar">&#10024;</div>
              <div className="bubble">
                <div className="loading">
                  <div className="spinner"></div>
                  <span>{t.loading_text}</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="input-bar">
        <div className="input-bar-inner">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={t.input_placeholder}
            rows={1}
            autoFocus
          />
          <button onClick={sendMessage} disabled={loading}>
            &#10148;
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
