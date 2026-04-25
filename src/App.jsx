import { useEffect, useState } from 'react';

const resources = [
  {
    name: 'Make the Road New York',
    org: 'Jackson Heights & Staten Island',
    desc: "Free legal services, ESL classes, workers' rights help, and community organizing.",
    category: 'legal',
    tags: ['Free', 'Spanish', 'Legal Aid', "Workers' Rights"],
  },
  {
    name: 'Catholic Charities Immigration Legal Services',
    org: 'Multiple Queens locations',
    desc: 'Pro bono immigration attorneys, visa applications, asylum help, and citizenship preparation.',
    category: 'legal',
    tags: ['Free', 'Spanish', 'Mandarin', 'Legal Aid'],
  },
  {
    name: 'Chhaya CDC',
    org: 'Jackson Heights',
    desc: 'Housing counseling, tenant rights education, financial literacy, and community development.',
    category: 'housing',
    tags: ['Free', 'Bengali', 'Hindi', 'Housing'],
  },
  {
    name: 'Adhikaar',
    org: 'Woodside',
    desc: 'Community organizing, legal referrals, health access, and workers rights for the Nepali-speaking community.',
    category: 'legal',
    tags: ['Free', 'Nepali', 'Hindi', 'Legal Aid'],
  },
  {
    name: 'Queens Public Library - ESOL Program',
    org: 'Branches across Queens',
    desc: 'Free English classes for speakers of other languages. Multiple levels, morning and evening sessions.',
    category: 'esl',
    tags: ['Free', 'ESL', 'Multiple Languages'],
  },
  {
    name: 'NYC Health + Hospitals / Elmhurst',
    org: 'Elmhurst',
    desc: 'Full-service hospital. Accepts all patients regardless of insurance or immigration status. NYC Care enrollment.',
    category: 'health',
    tags: ['Free/Low-Cost', 'Healthcare', 'Walk-ins Welcome'],
  },
  {
    name: 'World Central Kitchen - Queens',
    org: 'Various locations',
    desc: 'Free meal distribution for newly arrived families. Fresh, culturally appropriate meals.',
    category: 'food',
    url: 'https://wck.org/',
    tags: ['Free', 'Food', 'No Docs Needed'],
  },
  {
    name: 'La Jornada Food Pantry',
    org: 'Queens Village',
    desc: 'Weekly food distribution. Fresh produce, pantry staples. Bring a bag. No ID required.',
    category: 'food',
    url: 'https://www.lajornadany.org/',
    tags: ['Free', 'Food', 'Spanish', 'No Docs Needed'],
  },
  {
    name: 'New Immigrant Community Empowerment (NICE)',
    org: '71-29 Roosevelt Ave, Jackson Heights | (718) 565-8500',
    desc: 'Specifically serves immigrants with community support and food access resources.',
    category: 'food',
    url: 'https://www.nynice.org/',
    tags: ['Free', 'Food', 'Immigrant Support', 'Jackson Heights', 'No Docs Needed'],
  },
  {
    name: 'SACSS Food Pantry',
    org: 'South Asian community',
    desc: 'Stocks culturally familiar foods with multilingual staff support.',
    category: 'food',
    url: 'https://www.sacssny.org/',
    tags: ['Free', 'Food', 'South Asian', 'Multilingual', 'No Docs Needed'],
  },
  {
    name: 'Buddhist Tzu Chi Foundation',
    org: '137-77 Northern Blvd, Flushing | (718) 888-0866',
    desc: 'Community food support and relief services in Flushing.',
    category: 'food',
    url: 'https://tzuchi.us/ny',
    tags: ['Free', 'Food', 'Flushing', 'Community Support', 'No Docs Needed'],
  },
  {
    name: 'Korean Community Services',
    org: '203-05 32nd Ave, Bayside | (718) 939-6137',
    desc: 'Food assistance and community services for the Korean community.',
    category: 'food',
    url: 'https://www.kcsny.org/',
    tags: ['Free', 'Food', 'Korean', 'Bayside', 'No Docs Needed'],
  },
  {
    name: 'Queens Community House',
    org: '108-25 62nd Dr, Forest Hills | (718) 592-5757',
    desc: 'Food support and neighborhood services for local families.',
    category: 'food',
    url: 'https://www.qchnyc.org/',
    tags: ['Free', 'Food', 'Forest Hills', 'Community', 'No Docs Needed'],
  },
  {
    name: 'Greater Ridgewood Youth Council',
    org: '5903 Summerfield St, Ridgewood | (718) 456-5437',
    desc: 'Youth and family services that include food support and referrals.',
    category: 'food',
    url: 'https://www.greaterridgewoodyouthcouncil.org/',
    tags: ['Free', 'Food', 'Ridgewood', 'Youth', 'No Docs Needed'],
  },
  {
    name: 'Haitian Americans United for Progress',
    org: '19717 Hillside Ave, Hollis | (718) 527-3776',
    desc: 'Community organization supporting Haitian residents with resources and referrals.',
    category: 'food',
    url: 'https://www.haupinc.org/',
    tags: ['Free', 'Food', 'Haitian', 'Hollis', 'No Docs Needed'],
  },
  {
    name: 'YMCA',
    org: 'Queens branches',
    desc: 'Local YMCA branches may offer food support, pantry programs, or meal referrals.',
    category: 'food',
    url: 'https://ymcanyc.org/',
    tags: ['Free', 'Food', 'Community', 'No Docs Needed'],
  },
  {
    name: 'Queens Community House',
    org: 'Forest Hills & satellite sites',
    desc: 'Job readiness training, career counseling, resume workshops, and connections to employers.',
    category: 'jobs',
    tags: ['Free', 'Employment', 'Job Training'],
  },
  {
    name: 'Center for Employment Training (CET)',
    org: 'Jamaica',
    desc: 'Vocational training in healthcare, IT, and building maintenance. Job placement assistance.',
    category: 'jobs',
    tags: ['Free', 'Employment', 'Vocational Training'],
  },
  {
    name: 'South Asian Youth Action (SAYA)',
    org: 'Elmhurst',
    desc: 'Youth programs, college prep, leadership development, and mental health support for South Asian youth.',
    category: 'esl',
    tags: ['Free', 'Youth', 'Bengali', 'Hindi'],
  },
  {
    name: 'MinKwon Center for Community Action',
    org: 'Flushing',
    desc: 'Immigration legal services, voter engagement, housing help, and workers rights for the Korean community.',
    category: 'legal',
    tags: ['Free', 'Korean', 'Legal Aid', 'Housing'],
  },
];

const translations = {
  es: {
    hero_title: 'Encuentra ayuda en Queens',
    hero_sub: 'Recursos gratuitos y de bajo costo para recién llegados. Busca por servicio, idioma o vecindario.',
    search_placeholder: 'Busca ayuda legal, clases de inglés, despensas de comida...',
    cat_legal: 'Ayuda legal',
    cat_esl: 'Clases de inglés',
    cat_health: 'Salud',
    cat_food: 'Comida',
    cat_housing: 'Vivienda',
    cat_jobs: 'Empleo',
    checklist_title: '¿Recién llegado? Empieza aquí',
    step1: 'Obtén una identificación / CityKey',
    step2: 'Abre una cuenta bancaria',
    step3: 'Inscribir niños en la escuela',
    step4: 'Encuentra un doctor',
    step5: 'Obtén una MetroCard / OMNY',
    step6: 'Solicita un ITIN',
    resources_title: 'Directorio de recursos',
    rights_title: 'Conoce tus derechos',
    transport_title: 'Moverse por Queens',
  },
  zh: {
    hero_title: '在皇后区寻找帮助',
    hero_sub: '为新移民提供免费和低成本资源。按服务、语言或社区搜索。',
    search_placeholder: '搜索法律援助、ESL课程、食品发放...',
    cat_legal: '法律援助',
    cat_esl: '英语课程',
    cat_health: '医疗',
    cat_food: '食物',
    cat_housing: '住房',
    cat_jobs: '工作',
    checklist_title: '刚到吗？先从这里开始',
    step1: '获取身份证 / CityKey',
    step2: '开设银行账户',
    step3: '给孩子报名上学',
    step4: '找一位医生',
    step5: '获取 MetroCard / OMNY',
    step6: '申请 ITIN',
    resources_title: '资源目录',
    rights_title: '了解你的权利',
    transport_title: '在皇后区出行',
  },
  ko: {
    hero_title: '퀸즈에서 도움 찾기',
    hero_sub: '새로 온 이주민을 위한 무료 및 저비용 자원입니다. 서비스, 언어, 동네별로 검색하세요.',
    search_placeholder: '법률 지원, ESL 수업, 식품 배급 검색...',
    cat_legal: '법률 지원',
    cat_esl: '영어 수업',
    cat_health: '의료',
    cat_food: '식품',
    cat_housing: '주거',
    cat_jobs: '일자리',
    checklist_title: '막 도착했나요? 여기서 시작하세요',
    step1: '신분증 / CityKey 받기',
    step2: '은행 계좌 열기',
    step3: '아이 학교 등록하기',
    step4: '의사 찾기',
    step5: 'MetroCard / OMNY 받기',
    step6: 'ITIN 신청하기',
    resources_title: '자원 안내',
    rights_title: '권리 안내',
    transport_title: '퀸즈 이동 방법',
  },
  bn: {
    hero_title: 'কুইন্সে সাহায্য খুঁজুন',
    hero_sub: 'নতুন আসা মানুষদের জন্য বিনামূল্যে এবং কম খরচের সহায়তা। সেবা, ভাষা, বা এলাকাভিত্তিক খুঁজুন।',
    search_placeholder: 'আইনি সাহায্য, ESL ক্লাস, খাবার বিতরণ খুঁজুন...',
    cat_legal: 'আইনি সাহায্য',
    cat_esl: 'ইংরেজি ক্লাস',
    cat_health: 'স্বাস্থ্য',
    cat_food: 'খাবার',
    cat_housing: 'বাসস্থান',
    cat_jobs: 'চাকরি',
    checklist_title: 'নতুন এসেছেন? এখান থেকে শুরু করুন',
    step1: 'আইডি / CityKey নিন',
    step2: 'ব্যাংক অ্যাকাউন্ট খুলুন',
    step3: 'শিশুদের স্কুলে ভর্তি করুন',
    step4: 'ডাক্তার খুঁজুন',
    step5: 'MetroCard / OMNY নিন',
    step6: 'ITIN আবেদন করুন',
    resources_title: 'রিসোর্স ডিরেক্টরি',
    rights_title: 'আপনার অধিকার জানুন',
    transport_title: 'কুইন্সে চলাফেরা',
  },
};

const checklist = [
  {
    title: 'Get an ID / CityKey',
    desc: 'NYC ID card available to all residents regardless of status. Visit an enrollment center.',
  },
  {
    title: 'Open a Bank Account',
    desc: 'Many banks accept ITIN or foreign ID. Capital One and Chase have branches throughout Queens.',
  },
  {
    title: 'Enroll Kids in School',
    desc: 'All children have the right to attend NYC public schools. Visit your local Family Welcome Center.',
  },
  {
    title: 'Find a Doctor',
    desc: 'NYC H+H hospitals serve everyone regardless of insurance or immigration status. Apply for NYC Care.',
  },
  {
    title: 'Get a MetroCard / OMNY',
    desc: 'Tap your phone or buy a card at any subway station. Reduced fare available for qualifying residents.',
  },
  {
    title: 'Apply for an ITIN',
    desc: 'Individual Taxpayer Identification Number lets you file taxes and open bank accounts. Visit a VITA site for free help.',
  },
];

const rights = [
  {
    title: 'If ICE Comes to Your Door',
    desc: 'You have the right to not open the door. Ask to see a warrant signed by a judge. You have the right to remain silent and to a lawyer.',
    phone: 'ACLUF: 212-549-2500',
  },
  {
    title: 'Tenant Rights',
    desc: 'Landlords cannot evict you without a court order. You have the right to heat, hot water, and safe conditions. Report violations to 311.',
    phone: 'Met Council: 212-693-0553',
  },
  {
    title: 'Workers Rights',
    desc: 'All workers have rights regardless of immigration status: minimum wage, safe conditions, and the right to report violations without retaliation.',
    phone: 'DOL: 888-4-NYSDOL',
  },
];

const transport = [
  {
    emoji: '🚇',
    title: 'Subway',
    desc: 'E, F, 7, N, W, R lines connect major Queens hubs. $2.90 per ride.',
  },
  {
    emoji: '🚌',
    title: 'Bus',
    desc: 'Extensive bus network. Q44, Q58, Q60 are key crosstown routes. Free transfers.',
  },
  {
    emoji: '📱',
    title: 'OMNY',
    desc: 'Tap phone or card at any reader. No MetroCard needed. Install the OMNY app.',
  },
  {
    emoji: '🚲',
    title: 'Citi Bike',
    desc: 'Bike share in western Queens. $4.49/single ride. E-bikes available.',
  },
];

const languageButtons = [
  { key: 'en', label: 'EN' },
  { key: 'es', label: 'ES' },
  { key: 'zh', label: '中文' },
  { key: 'bn', label: 'বাং' },
  { key: 'ko', label: '한' },
];

const filters = [
  { key: 'all', label: 'All' },
  { key: 'legal', label: 'Legal' },
  { key: 'esl', label: 'ESL' },
  { key: 'health', label: 'Health' },
  { key: 'food', label: 'Food' },
  { key: 'housing', label: 'Housing' },
  { key: 'jobs', label: 'Jobs' },
];

const langTags = new Set(['Spanish', 'Mandarin', 'Bengali', 'Hindi', 'Nepali', 'Korean', 'Multiple Languages']);

function App() {
  const [language, setLanguage] = useState('en');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [done, setDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('queens-checklist') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('queens-checklist', JSON.stringify(done));
  }, [done]);

  const copy = translations[language] || {};
  const filteredResources = resources.filter((resource) => {
    const matchesFilter = filter === 'all' || resource.category === filter;
    const haystack = `${resource.name} ${resource.org} ${resource.desc} ${resource.tags.join(' ')}`.toLowerCase();
    const matchesQuery = query.trim() === '' || haystack.includes(query.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const toggleDone = (index) => {
    setDone((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return [...next];
    });
  };

  return (
    <div className="app-shell">
      <header className="nav">
        <div className="inner">
          <h1>Queens <span>Navigator</span></h1>
          <div className="lang-toggle" aria-label="Language selector">
            {languageButtons.map((button) => (
              <button
                key={button.key}
                className={`lang-btn ${language === button.key ? 'active' : ''}`}
                onClick={() => setLanguage(button.key)}
                type="button"
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="hero">
        <h2>{copy.hero_title || 'Find Help in Queens'}</h2>
        <p>{copy.hero_sub || 'Free and low-cost resources for newcomers. Search by service, language, or neighborhood.'}</p>
        <div className="search-box">
          <span className="icon" aria-hidden="true">🔎</span>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.search_placeholder || 'Search for legal help, ESL classes, food pantries...'}
          />
        </div>
      </section>

      <main>
        <section className="quick-nav">
          <div className="quick-nav-grid">
            <a href="#resources" className="quick-card"><span className="emoji">⚖</span><span className="label">{copy.cat_legal || 'Legal Aid'}</span></a>
            <a href="#resources" className="quick-card"><span className="emoji">📚</span><span className="label">{copy.cat_esl || 'ESL Classes'}</span></a>
            <a href="#rights" className="quick-card"><span className="emoji">🏥</span><span className="label">{copy.cat_health || 'Healthcare'}</span></a>
            <a href="#resources" className="quick-card"><span className="emoji">🍲</span><span className="label">{copy.cat_food || 'Food Help'}</span></a>
            <a href="#resources" className="quick-card"><span className="emoji">🏠</span><span className="label">{copy.cat_housing || 'Housing'}</span></a>
            <a href="#resources" className="quick-card"><span className="emoji">💼</span><span className="label">{copy.cat_jobs || 'Employment'}</span></a>
          </div>
        </section>

        <section className="section" id="checklist">
          <div className="section-header">
            <h3>{copy.checklist_title || 'Just Arrived? Start Here'}</h3>
          </div>
          <ul className="checklist">
            {checklist.map((step, index) => {
              const isDone = done.includes(index);
              return (
                <li key={step.title} className={isDone ? 'done' : ''} onClick={() => toggleDone(index)}>
                  <div className="check" aria-hidden="true">{isDone ? '✓' : ''}</div>
                  <div>
                    <div className="step-title">{copy[`step${index + 1}`] || step.title}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="section" id="resources">
          <div className="section-header">
            <h3>{copy.resources_title || 'Resource Directory'}</h3>
            <a href="#top">Back to top</a>
          </div>

          <div className="filter-bar">
            {filters.map((item) => (
              <button
                key={item.key}
                className={`filter-btn ${filter === item.key ? 'active' : ''}`}
                onClick={() => setFilter(item.key)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="resource-list">
            {filteredResources.map((resource) => (
              <article key={`${resource.category}-${resource.name}`} className={`resource-card ${resource.tags.includes('Free') ? 'free' : ''}`}>
                <h4>{resource.name}</h4>
                <div className="org">{resource.org}</div>
                <div className="desc">{resource.desc}</div>
                {resource.url ? (
                  <a className="resource-link" href={resource.url} target="_blank" rel="noreferrer">
                    Visit website
                  </a>
                ) : null}
                <div className="tags">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`tag ${tag === 'Free' ? 'free' : ''} ${langTags.has(tag) ? 'lang' : ''}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="rights">
          <div className="section-header">
            <h3>{copy.rights_title || 'Know Your Rights'}</h3>
          </div>
          <div className="rights-grid">
            {rights.map((item) => (
              <article key={item.title} className="rights-card">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
                <span className="phone">{item.phone}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="section" id="transport">
          <div className="section-header">
            <h3>{copy.transport_title || 'Getting Around Queens'}</h3>
          </div>
          <div className="transport-grid">
            {transport.map((item) => (
              <article key={item.title} className="transport-card">
                <span className="emoji" aria-hidden="true">{item.emoji}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Queens Resource Navigator - Built for the community, by the community.</p>
        <p>Emergency: Call <span className="hotline">911</span> | NYC Info: Call <span className="hotline">311</span></p>
      </footer>
    </div>
  );
}

export default App;
