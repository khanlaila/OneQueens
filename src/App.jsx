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
    checklist_descs: {
      'Get an ID / CityKey': 'La tarjeta NYC ID está disponible para todos los residentes sin importar su estatus. Visita un centro de inscripción.',
      'Open a Bank Account': 'Muchos bancos aceptan ITIN o identificación extranjera. Capital One y Chase tienen sucursales por todo Queens.',
      'Enroll Kids in School': 'Todos los niños tienen derecho a asistir a las escuelas públicas de NYC. Visita tu Family Welcome Center local.',
      'Find a Doctor': 'Los hospitales NYC H+H atienden a todos sin importar seguro o estatus migratorio. Solicita NYC Care.',
      'Get a MetroCard / OMNY': 'Toca tu teléfono o compra una tarjeta en cualquier estación de metro. Hay tarifa reducida para quienes califican.',
      'Apply for an ITIN': 'El ITIN te permite presentar impuestos y abrir cuentas bancarias. Visita un sitio VITA para ayuda gratis.',
    },
    rights_descs: {
      'If ICE Comes to Your Door': 'Tienes derecho a no abrir la puerta. Pide ver una orden firmada por un juez. Tienes derecho a guardar silencio y a un abogado.',
      'Tenant Rights': 'Los propietarios no pueden desalojarte sin una orden judicial. Tienes derecho a calefacción, agua caliente y condiciones seguras. Reporta violaciones al 311.',
      'Workers Rights': 'Todos los trabajadores tienen derechos sin importar su estatus migratorio: salario mínimo, condiciones seguras y derecho a denunciar sin represalias.',
    },
    transport_descs: {
      Subway: 'Usa los mapas de líneas del MTA para ver cada ruta y sus transferencias. La tarifa base actual es de $3.00 por viaje.',
      Bus: 'Transit ayuda a seguir autobuses y trenes en tiempo real. Para rutas oficiales, usa MTA Bus Time.',
      OMNY: 'OMNY es el sistema de pago por toque del MTA para el metro y el autobús. Puede haber opciones de tarifa reducida o Fair Fares según elegibilidad.',
      'Citi Bike': 'Citi Bike es el sistema oficial de bicicletas compartidas de la ciudad con estaciones en todo Queens.',
    },
    resource_descs: {
      'Make the Road New York': 'Servicios legales gratuitos, clases de ESL, ayuda con derechos laborales y organización comunitaria.',
      'Catholic Charities Immigration Legal Services': 'Abogados de inmigración pro bono, solicitudes de visa, ayuda de asilo y preparación para la ciudadanía.',
      'Chhaya CDC': 'Asesoría de vivienda, educación sobre derechos de inquilinos, alfabetización financiera y desarrollo comunitario.',
      Adhikaar: 'Organización comunitaria, referencias legales, acceso a la salud y derechos laborales para la comunidad nepalí.',
      'Queens Public Library - ESOL Program': 'Clases gratuitas de inglés para personas que hablan otros idiomas. Varios niveles y horarios por la mañana y la tarde.',
      'NYC Health + Hospitals / Elmhurst': 'Hospital de servicio completo. Atiende a todos sin importar seguro o estatus migratorio. Inscripción a NYC Care.',
      'World Central Kitchen - Queens': 'Distribución gratuita de comida para familias recién llegadas. Comidas frescas y culturalmente apropiadas.',
      'La Jornada Food Pantry': 'Distribución semanal de alimentos. Productos frescos, despensa básica. Lleva una bolsa. No se necesita identificación.',
      'New Immigrant Community Empowerment (NICE)': 'Sirve específicamente a inmigrantes con apoyo comunitario y recursos de acceso a alimentos.',
      'SACSS Food Pantry': 'Ofrece alimentos familiares culturalmente y apoyo de personal multilingüe.',
      'Buddhist Tzu Chi Foundation': 'Apoyo alimentario comunitario y servicios de ayuda en Flushing.',
      'Korean Community Services': 'Asistencia alimentaria y servicios comunitarios para la comunidad coreana.',
      'Queens Community House': 'Apoyo alimentario y servicios vecinales para familias locales.',
      'Greater Ridgewood Youth Council': 'Servicios para jóvenes y familias que incluyen apoyo alimentario y referencias.',
      'Haitian Americans United for Progress': 'Organización comunitaria que apoya a residentes haitianos con recursos y referencias.',
      YMCA: 'Las sucursales locales del YMCA pueden ofrecer apoyo alimentario, despensas o referencias de comidas.',
      'Center for Employment Training (CET)': 'Capacitación vocacional en salud, tecnología y mantenimiento de edificios. Ayuda para colocación laboral.',
      'South Asian Youth Action (SAYA)': 'Programas para jóvenes, preparación universitaria, desarrollo de liderazgo y apoyo de salud mental para jóvenes del sur de Asia.',
      'MinKwon Center for Community Action': 'Servicios legales de inmigración, participación cívica, ayuda de vivienda y derechos laborales para la comunidad coreana.',
    },
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
    checklist_descs: {
      'Get an ID / CityKey': 'NYC ID 卡向所有居民开放，不论身份如何。前往注册中心办理。',
      'Open a Bank Account': '许多银行接受 ITIN 或外国证件。Capital One 和 Chase 在皇后区各地都有网点。',
      'Enroll Kids in School': '所有儿童都有权就读纽约市公立学校。前往你附近的 Family Welcome Center。',
      'Find a Doctor': 'NYC H+H 医院为所有人提供服务，不论保险或移民身份。可申请 NYC Care。',
      'Get a MetroCard / OMNY': '可刷手机或在地铁站购买卡片。符合条件者可享受优惠票价。',
      'Apply for an ITIN': 'ITIN 可用于报税和开设银行账户。可前往 VITA 网点获取免费帮助。',
    },
    rights_descs: {
      'If ICE Comes to Your Door': '你有权不打开门。要求查看由法官签署的令状。你有权保持沉默并要求律师。',
      'Tenant Rights': '房东不能在没有法院命令的情况下驱逐你。你有权获得暖气、热水和安全的居住条件。可拨打 311 报告违规。',
      'Workers Rights': '所有工人无论移民身份如何都享有权利：最低工资、安全条件，以及在不受报复的情况下举报违规的权利。',
    },
    transport_descs: {
      Subway: '使用 MTA 地铁线路图查看每条线路及换乘信息。目前基础票价为每次 3.00 美元。',
      Bus: 'Transit 可以实时追踪公交和地铁。官方路线查询请使用 MTA Bus Time。',
      OMNY: 'OMNY 是 MTA 的刷卡支付系统，适用于地铁和公交。符合条件者可能享受优惠票价或 Fair Fares。',
      'Citi Bike': 'Citi Bike 是纽约市官方共享单车系统，在皇后区有很多站点。',
    },
    resource_descs: {
      'Make the Road New York': '提供免费法律服务、ESL 课程、劳工权益帮助和社区组织支持。',
      'Catholic Charities Immigration Legal Services': '公益移民律师、签证申请、庇护协助和入籍准备。',
      'Chhaya CDC': '住房咨询、租客权益教育、金融知识和社区发展。',
      Adhikaar: '面向尼泊尔语社区的社区组织、法律转介、医疗服务和劳工权益支持。',
      'Queens Public Library - ESOL Program': '面向其他语言使用者的免费英语课程，提供多个等级和上午/晚间时段。',
      'NYC Health + Hospitals / Elmhurst': '综合医院，不论保险或移民身份都可就诊，并可申请 NYC Care。',
      'World Central Kitchen - Queens': '为新来家庭提供免费餐食发放，食物新鲜且符合文化习惯。',
      'La Jornada Food Pantry': '每周提供食品分发，新鲜农产品和基本食品，无需身份证明。',
      'New Immigrant Community Empowerment (NICE)': '专门为移民提供社区支持和食品获取资源。',
      'SACSS Food Pantry': '提供符合南亚饮食习惯的食品，并有多语种工作人员。',
      'Buddhist Tzu Chi Foundation': '在法拉盛提供社区食品援助和救助服务。',
      'Korean Community Services': '为韩裔社区提供食品援助和社区服务。',
      'Queens Community House': '为当地家庭提供食品支持和社区服务。',
      'Greater Ridgewood Youth Council': '为年轻人和家庭提供食品支持和转介服务。',
      'Haitian Americans United for Progress': '支持海地居民的社区组织，提供资源和转介。',
      YMCA: '本地 YMCA 分支可能提供食品支持、食品储藏或餐食转介。',
      'Center for Employment Training (CET)': '在医疗、IT 和建筑维护方面提供职业培训，并协助就业安置。',
      'South Asian Youth Action (SAYA)': '面向南亚青少年的项目、大学准备、领导力发展和心理健康支持。',
      'MinKwon Center for Community Action': '为韩裔社区提供移民法律服务、选民参与、住房帮助和劳工权益支持。',
    },
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
    checklist_descs: {
      'Get an ID / CityKey': 'NYC ID 카드는 신분과 상관없이 모든 주민에게 제공됩니다. 등록 센터를 방문하세요.',
      'Open a Bank Account': '많은 은행이 ITIN 또는 외국 신분증을 स्वीकार합니다. Capital One과 Chase 지점이 퀸즈 전역에 있습니다.',
      'Enroll Kids in School': '모든 아이들은 NYC 공립학교에 다닐 권리가 있습니다. 가까운 Family Welcome Center를 방문하세요.',
      'Find a Doctor': 'NYC H+H 병원은 보험이나 이민 신분과 상관없이 모두를 진료합니다. NYC Care를 신청할 수 있습니다.',
      'Get a MetroCard / OMNY': '휴대폰을 태그하거나 지하철역에서 카드를 구매하세요. 자격이 되면 할인 요금이 가능합니다.',
      'Apply for an ITIN': 'ITIN은 세금 신고와 은행 계좌 개설에 사용할 수 있습니다. 무료 도움은 VITA 사이트를 방문하세요.',
    },
    rights_descs: {
      'If ICE Comes to Your Door': '문을 열지 않을 권리가 있습니다. 판사가 서명한 영장을 보여 달라고 하세요. 침묵할 권리와 변호사를 요청할 권리가 있습니다.',
      'Tenant Rights': '집주인은 법원 명령 없이 퇴거시킬 수 없습니다. 난방, 온수, 안전한 주거 환경을 요구할 권리가 있습니다. 위반은 311에 신고하세요.',
      'Workers Rights': '모든 노동자는 이민 신분과 관계없이 최저임금, 안전한 조건, 보복 없이 위반을 신고할 권리가 있습니다.',
    },
    transport_descs: {
      Subway: 'MTA 지하철 노선도를 사용해 각 노선과 환승 정보를 확인하세요. 현재 기본 요금은 1회당 3.00달러입니다.',
      Bus: 'Transit은 버스와 열차를 실시간으로 추적합니다. 공식 노선 조회는 MTA Bus Time을 사용하세요.',
      OMNY: 'OMNY는 MTA의 터치 결제 시스템으로 지하철과 버스에 사용됩니다. 자격에 따라 할인 요금이나 Fair Fares를 이용할 수 있습니다.',
      'Citi Bike': 'Citi Bike는 퀸즈 전역에 정류장이 있는 뉴욕시 공식 공유 자전거 시스템입니다.',
    },
    resource_descs: {
      'Make the Road New York': '무료 법률 서비스, ESL 수업, 노동권 지원, 커뮤니티 조직 활동을 제공합니다.',
      'Catholic Charities Immigration Legal Services': '무료 이민 변호사, 비자 신청, 망명 도움, 시민권 준비를 지원합니다.',
      'Chhaya CDC': '주거 상담, 세입자 권리 교육, 금융 교육, 커뮤니티 개발을 제공합니다.',
      Adhikaar: '네팔어 공동체를 위한 커뮤니티 조직, 법률 안내, 의료 접근, 노동권 지원.',
      'Queens Public Library - ESOL Program': '다른 언어 사용자에게 무료 영어 수업을 제공합니다. 여러 수준과 오전/저녁 수업이 있습니다.',
      'NYC Health + Hospitals / Elmhurst': '보험이나 이민 신분과 상관없이 누구나 진료받을 수 있는 종합병원입니다. NYC Care 등록 가능.',
      'World Central Kitchen - Queens': '새로 도착한 가족을 위한 무료 식사 배포. 문화적으로 익숙한 음식을 제공합니다.',
      'La Jornada Food Pantry': '주간 식품 배급, 신선한 농산물과 기본 식료품 제공. 가방을 가져오세요. 신분증 불필요.',
      'New Immigrant Community Empowerment (NICE)': '이민자를 위한 커뮤니티 지원과 식품 접근 자원을 제공합니다.',
      'SACSS Food Pantry': '남아시아 지역사회에 익숙한 음식을 제공하며 다국어 직원이 있습니다.',
      'Buddhist Tzu Chi Foundation': '플러싱에서 커뮤니티 식품 지원과 구호 서비스를 제공합니다.',
      'Korean Community Services': '한인 커뮤니티를 위한 식품 지원과 커뮤니티 서비스를 제공합니다.',
      'Queens Community House': '지역 가정을 위한 식품 지원과 동네 서비스를 제공합니다.',
      'Greater Ridgewood Youth Council': '청소년과 가족을 위한 식품 지원 및 안내를 제공합니다.',
      'Haitian Americans United for Progress': '아이티 주민을 위한 자원과 안내를 제공하는 커뮤니티 조직입니다.',
      YMCA: '지역 YMCA 지점에서 식품 지원, 팬트리 프로그램 또는 식사 안내를 제공할 수 있습니다.',
      'Center for Employment Training (CET)': '의료, IT, 건물 유지보수 분야의 직업 훈련과 취업 지원을 제공합니다.',
      'South Asian Youth Action (SAYA)': '남아시아 청소년을 위한 프로그램, 대학 준비, 리더십 개발, 정신 건강 지원을 제공합니다.',
      'MinKwon Center for Community Action': '한인 커뮤니티를 위한 이민 법률 서비스, 투표 참여, 주거 도움, 노동권 지원을 제공합니다.',
    },
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
    checklist_descs: {
      'Get an ID / CityKey': 'NYC ID কার্ড স্ট্যাটাস নির্বিশেষে সব বাসিন্দার জন্য উপলভ্য। রেজিস্ট্রেশন সেন্টারে যান।',
      'Open a Bank Account': 'অনেক ব্যাংক ITIN বা বিদেশি আইডি গ্রহণ করে। Capital One ও Chase-এর শাখা পুরো Queens জুড়ে আছে।',
      'Enroll Kids in School': 'সব শিশুর NYC পাবলিক স্কুলে পড়ার অধিকার আছে। আপনার নিকটস্থ Family Welcome Center-এ যান।',
      'Find a Doctor': 'NYC H+H হাসপাতাল বীমা বা অভিবাসন স্ট্যাটাস নির্বিশেষে সবাইকে সেবা দেয়। NYC Care-এর জন্য আবেদন করতে পারেন।',
      'Get a MetroCard / OMNY': 'ফোন ট্যাপ করুন বা যেকোনো সাবওয়ে স্টেশনে কার্ড কিনুন। যোগ্য হলে কম ভাড়া পাওয়া যায়।',
      'Apply for an ITIN': 'ITIN দিয়ে ট্যাক্স ফাইল করা ও ব্যাংক অ্যাকাউন্ট খোলা যায়। বিনামূল্যে সাহায্যের জন্য VITA সাইটে যান।',
    },
    rights_descs: {
      'If ICE Comes to Your Door': 'দরজা না খোলার অধিকার আপনার আছে। বিচারকের স্বাক্ষরিত ওয়ারেন্ট দেখতে চান। আপনার নীরব থাকার এবং আইনজীবী পাওয়ার অধিকার আছে।',
      'Tenant Rights': 'আদালতের আদেশ ছাড়া বাড়িওয়ালা আপনাকে উচ্ছেদ করতে পারে না। তাপ, গরম পানি এবং নিরাপদ অবস্থার অধিকার আছে। 311-এ অভিযোগ করুন।',
      'Workers Rights': 'সব শ্রমিকেরই অধিকার আছে, অভিবাসন স্ট্যাটাস যাই হোক না কেন: ন্যূনতম মজুরি, নিরাপদ পরিবেশ, এবং প্রতিশোধ ছাড়াই অভিযোগ করার অধিকার।',
    },
    transport_descs: {
      Subway: 'MTA সাবওয়ে লাইন ম্যাপ ব্যবহার করে প্রতিটি রুট ও ট্রান্সফার দেখুন। বর্তমান বেস ভাড়া প্রতি যাত্রা 3.00 ডলার।',
      Bus: 'Transit রিয়েল-টাইমে বাস ও ট্রেন ট্র্যাক করে। অফিসিয়াল রুট দেখার জন্য MTA Bus Time ব্যবহার করুন।',
      OMNY: 'OMNY হলো MTA-এর ট্যাপ-টু-পে সিস্টেম, যা সাবওয়ে ও বাসে ব্যবহৃত হয়। যোগ্যতার ভিত্তিতে কম ভাড়া বা Fair Fares পাওয়া যেতে পারে।',
      'Citi Bike': 'Citi Bike হলো শহরের অফিসিয়াল বাইক শেয়ার সিস্টেম, Queens জুড়ে স্টেশন রয়েছে।',
    },
    resource_descs: {
      'Make the Road New York': 'বিনামূল্যে আইনি সেবা, ESL ক্লাস, শ্রমিক অধিকার সহায়তা এবং কমিউনিটি সংগঠনের কাজ করে।',
      'Catholic Charities Immigration Legal Services': 'প্রো বোনো ইমিগ্রেশন আইনজীবী, ভিসা আবেদন, আশ্রয় সহায়তা এবং নাগরিকত্ব প্রস্তুতি দেয়।',
      'Chhaya CDC': 'বাসস্থান পরামর্শ, ভাড়াটে অধিকার শিক্ষা, আর্থিক সাক্ষরতা এবং কমিউনিটি উন্নয়ন।',
      Adhikaar: 'নেপালি-ভাষী সম্প্রদায়ের জন্য কমিউনিটি সংগঠন, আইনি রেফারেল, স্বাস্থ্যসেবা প্রবেশ এবং শ্রমিক অধিকার সহায়তা।',
      'Queens Public Library - ESOL Program': 'অন্যান্য ভাষাভাষীদের জন্য বিনামূল্যে ইংরেজি ক্লাস। বিভিন্ন স্তর এবং সকাল/সন্ধ্যার সেশন রয়েছে।',
      'NYC Health + Hospitals / Elmhurst': 'পূর্ণ-সেবা হাসপাতাল। বীমা বা ইমিগ্রেশন স্ট্যাটাস না দেখেই সবাইকে চিকিৎসা দেয়। NYC Care নিবন্ধন রয়েছে।',
      'World Central Kitchen - Queens': 'নতুন আসা পরিবারের জন্য বিনামূল্যে খাবার বিতরণ। সাংস্কৃতিকভাবে উপযুক্ত খাবার দেয়।',
      'La Jornada Food Pantry': 'সাপ্তাহিক খাবার বিতরণ। তাজা সবজি ও মৌলিক মুদিখানা। ব্যাগ আনুন। আইডি লাগে না।',
      'New Immigrant Community Empowerment (NICE)': 'ইমিগ্র্যান্টদের জন্য বিশেষভাবে কমিউনিটি সহায়তা ও খাবার পাওয়ার উৎস দেয়।',
      'SACSS Food Pantry': 'দক্ষিণ এশীয়দের পরিচিত খাবার এবং বহুভাষিক কর্মী সহায়তা।',
      'Buddhist Tzu Chi Foundation': 'ফ্লাশিং-এ কমিউনিটি খাবার সহায়তা ও ত্রাণ সেবা দেয়।',
      'Korean Community Services': 'কোরিয়ান সম্প্রদায়ের জন্য খাবার সহায়তা ও কমিউনিটি সেবা দেয়।',
      'Queens Community House': 'স্থানীয় পরিবারের জন্য খাবার সহায়তা ও পাড়ার সেবা দেয়।',
      'Greater Ridgewood Youth Council': 'তরুণ ও পরিবারের জন্য খাবার সহায়তা ও রেফারেল দেয়।',
      'Haitian Americans United for Progress': 'হাইতিয়ান বাসিন্দাদের জন্য সম্পদ ও রেফারেল সহায়তা করা কমিউনিটি সংগঠন।',
      YMCA: 'স্থানীয় YMCA শাখাগুলো খাবার সহায়তা, প্যান্ট্রি প্রোগ্রাম বা খাবারের রেফারেল দিতে পারে।',
      'Center for Employment Training (CET)': 'স্বাস্থ্য, IT এবং বিল্ডিং মেইনটেনেন্সে বৃত্তিমূলক প্রশিক্ষণ ও চাকরি সহায়তা।',
      'South Asian Youth Action (SAYA)': 'দক্ষিণ এশীয় তরুণদের জন্য প্রোগ্রাম, কলেজ প্রস্তুতি, নেতৃত্ব বিকাশ এবং মানসিক স্বাস্থ্য সহায়তা।',
      'MinKwon Center for Community Action': 'কোরিয়ান সম্প্রদায়ের জন্য অভিবাসন আইন সেবা, ভোটার সম্পৃক্ততা, বাসস্থানের সহায়তা এবং শ্রমিক অধিকার।',
    },
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
    url: 'https://www.nyc.gov/knowyourrights',
  },
  {
    title: 'Tenant Rights',
    desc: 'Landlords cannot evict you without a court order. You have the right to heat, hot water, and safe conditions. Report violations to 311.',
    phone: 'Met Council: 212-693-0553',
    url: 'https://www.nyc.gov/site/buildings/tenant/tenants-rights.page',
  },
  {
    title: 'Workers Rights',
    desc: 'All workers have rights regardless of immigration status: minimum wage, safe conditions, and the right to report violations without retaliation.',
    phone: 'DOL: 888-4-NYSDOL',
    url: 'https://dol.ny.gov/labor-standards-0',
  },
];

const transport = [
  {
    title: 'Subway',
    label: 'Transit',
    url: 'https://www.mta.info/maps/subway-line-maps',
    desc: 'Use the MTA subway line maps to see each route and its transfers. Current base fare is $3.00 per ride.',
  },
  {
    title: 'Bus',
    label: 'Transit',
    url: 'https://transitapp.com/',
    desc: 'Transit helps track buses and trains in real time. For official route lookup, use MTA Bus Time.',
  },
  {
    title: 'OMNY',
    label: 'Transit',
    url: 'https://www.mta.info/fares/omny',
    desc: 'OMNY is MTA’s tap-to-pay system for subway and bus fares. Reduced-fare and Fair Fares options may be available depending on eligibility.',
  },
  {
    title: 'Citi Bike',
    label: 'Transit',
    url: 'https://citibikenyc.com/',
    desc: 'Citi Bike is the city’s official bike share system with stations across Queens.',
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

const categoryOrder = filters.filter((item) => item.key !== 'all');

const langTags = new Set(['Spanish', 'Mandarin', 'Bengali', 'Hindi', 'Nepali', 'Korean', 'Multiple Languages']);
const queensSealUrl = 'https://commons.wikimedia.org/wiki/Special:FilePath/Seal_of_Borough_of_Queens.svg';

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
  const resourceDescs = copy.resource_descs || {};
  const checklistDescs = copy.checklist_descs || {};
  const rightsDescs = copy.rights_descs || {};
  const transportDescs = copy.transport_descs || {};
  const filteredResources = resources.filter((resource) => {
    const matchesFilter = filter === 'all' || resource.category === filter;
    const haystack = `${resource.name} ${resource.org} ${resource.desc} ${resource.tags.join(' ')}`.toLowerCase();
    const matchesQuery = query.trim() === '' || haystack.includes(query.trim().toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const groupedResources = categoryOrder
    .map((category) => ({
      ...category,
      items: filteredResources.filter((resource) => resource.category === category.key),
    }))
    .filter((group) => group.items.length > 0);

  const toggleDone = (index) => {
    setDone((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return [...next];
    });
  };

  const jumpToCategory = (category) => {
    setFilter(category);
    requestAnimationFrame(() => {
      document.getElementById(category)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  return (
    <div className="app-shell" id="top">
      <header className="nav">
        <div className="inner">
          <h1 className="brand">
            <img
              className="brand-mark"
              src={queensSealUrl}
              alt="Seal of the Borough of Queens"
            />
            <span>One</span> Queens
          </h1>
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
        <p>{copy.hero_sub || 'New to Queens? We are here to help with free and low-cost resources. Search by service, language, or neighborhood.'}</p>
        <div className="search-box">
          <span className="icon" aria-hidden="true">Search</span>
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
            <button type="button" className="quick-card" onClick={() => jumpToCategory('legal')}><span className="label">{copy.cat_legal || 'Legal Aid'}</span></button>
            <button type="button" className="quick-card" onClick={() => jumpToCategory('esl')}><span className="label">{copy.cat_esl || 'ESL Classes'}</span></button>
            <button type="button" className="quick-card" onClick={() => jumpToCategory('health')}><span className="label">{copy.cat_health || 'Healthcare'}</span></button>
            <button type="button" className="quick-card" onClick={() => jumpToCategory('food')}><span className="label">{copy.cat_food || 'Food Help'}</span></button>
            <button type="button" className="quick-card" onClick={() => jumpToCategory('housing')}><span className="label">{copy.cat_housing || 'Housing'}</span></button>
            <button type="button" className="quick-card" onClick={() => jumpToCategory('jobs')}><span className="label">{copy.cat_jobs || 'Employment'}</span></button>
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
                    <div className="step-desc">{checklistDescs[step.title] || step.desc}</div>
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
            {groupedResources.map((group) => (
              <section key={group.key} className="resource-group" id={group.key}>
                <div className="resource-group-header">
                  <h4>{group.label}</h4>
                </div>
                <div className="resource-group-list">
                  {group.items.map((resource) => (
                    <article key={`${resource.category}-${resource.name}`} className={`resource-card ${resource.tags.includes('Free') ? 'free' : ''}`}>
                      <h5>{resource.name}</h5>
                      <div className="org">{resource.org}</div>
                      <div className="desc">{resourceDescs[resource.name] || resource.desc}</div>
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
                <p>{rightsDescs[item.title] || item.desc}</p>
                <span className="phone">{item.phone}</span>
                <a className="resource-link" href={item.url} target="_blank" rel="noreferrer">
                  Open resource
                </a>
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
              <a
                key={item.title}
                className="transport-card transport-link"
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="transport-label">{item.label}</span>
                <h4>{item.title}</h4>
                <p>{transportDescs[item.title] || item.desc}</p>
                {item.title === 'OMNY' ? (
                  <span className="transport-subnote">Eligibility details for reduced fares and discounts.</span>
                ) : null}
              </a>
            ))}
          </div>
          <p className="transport-note">
            Transfers are encoded when you tap the same card or device. With OMNY or a Pay-Per-Ride MetroCard, you get one free transfer within two hours between subway and bus, bus and subway, or bus and bus. If you switch to an express bus, you pay the difference unless you have an express-bus unlimited option. Reduced-fare and Fair Fares programs may offer discounts if you qualify.
          </p>
        </section>
      </main>

      <footer className="footer">
        <p>One Queens - Built for the community, by the community.</p>
        <p>Emergency: Call <span className="hotline">911</span> | NYC Info: Call <span className="hotline">311</span></p>
      </footer>
    </div>
  );
}

export default App;
