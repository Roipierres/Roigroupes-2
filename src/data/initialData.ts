import { AppItem, ReviewItem, UserAccount, AdBannerItem, DownloadLog, SiteSettings, FloatingAdItem } from '../types';

export const initialApps: AppItem[] = [
  // --- الفئة التجارية (Commercial Category) ---
  {
    id: 'app-comm-1',
    title: 'سجل الأعمال المحاسبي SmartPOS',
    titleFr: 'Registre Commercial SmartPOS',
    slug: 'smart-pos-business',
    category: 'commercial',
    shortDesc: 'نقطة بيع ومحاسبة شاملة للمتاجر والمؤسسات التجارية مع إدارة الفواتير والديون.',
    shortDescFr: 'Caisse enregistreuse et gestion comptable complète pour magasins et PME.',
    fullDesc: 'تطبيق تجاري متكامل مصمم خصيصاً للمحلات والمؤسسات التجارية. يتيح لك إدارة الفواتير اليومية، تتبع حركة المخزون، حساب الأرباح والخسائر تلقائياً، وإدارة ديون العملاء مع تنبيهات آليه وتصدير تقارير PDF وإكسل.',
    fullDescFr: 'Application commerciale complète conçue pour les magasins et PME. Permet de gérer la facturation quotidienne, suivre les stocks en temps réel, calculer le chiffre d\'affaires et générer des rapports financiers.',
    icon: 'Briefcase',
    badge: 'الأكثر مبيعاً',
    badgeFr: 'Best-Seller',
    downloadsCount: 0,
    rating: 4.9,
    reviewsCount: 1280,
    size: '32.5 MB',
    version: '3.4.1',
    updatedDate: '2026-03-20',
    developer: 'ProTrade Systems',
    screenshots: [
      'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'طباعة الفواتير حرارياً عبر البلوتوث والـ USB',
      'إدارة المخزون وتنبيه بإنفاد المواد',
      'قاعدة بيانات سحابية مع إمكانية العمل بدون إنترنت',
      'تقارير ضريبية وأرباح ختامية بضغطة زر'
    ],
    featuresFr: [
      'Impression de factures via Bluetooth et USB',
      'Gestion des stocks avec alertes automatiques',
      'Base de données cloud synchronisée et mode hors-ligne',
      'Rapports financiers et fiscaux exportables'
    ],
    downloadLinks: {
      androidUrl: 'https://example.com/downloads/smartpos.apk',
      iosUrl: 'https://apple.com/app/smartpos',
      apkSize: '32.5 MB'
    },
    isFeatured: true,
    pinnedExpiry: Date.now() + 1000 * 60 * 60 * 24, // 24h
    pinnedPosition: 1,
    status: 'published'
  },
  {
    id: 'app-comm-2',
    title: 'مسيّر المبيعات والعملاء CRM Pro',
    titleFr: 'Gestionnaire de Ventes CRM Pro',
    slug: 'crm-pro-sales',
    category: 'commercial',
    shortDesc: 'تتبع المبيعات والصفقات، إدارة موظفي الميدان وتتبع طلبات التوصيل.',
    shortDescFr: 'Suivi des ventes, gestion de la force commerciale et des livraisons.',
    fullDesc: 'تطبيق ينظم عمل الفرق التجارية وإدارة علاقات العملاء (CRM). يقدم تتبعاً حياً لمندوبي المبيعات عبر الخريطة، تسجيل الصفقات ومراحل المفاوضات، وإرسال عروض الأسعار التلقائية.',
    fullDescFr: 'Application de gestion des relations clients (CRM) et suivi des équipes commerciales terrain avec géolocalisation et devis automatiques.',
    icon: 'TrendingUp',
    badge: 'تطوير ممتاز',
    badgeFr: 'Pro Choice',
    downloadsCount: 0,
    rating: 4.7,
    reviewsCount: 640,
    size: '28.1 MB',
    version: '2.8.0',
    updatedDate: '2026-02-18',
    developer: 'Enterprise Solutions Inc.',
    screenshots: [
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'جدولة المواعيد وتنبيهات زيارات العملاء',
      'مزامنة فورية مع منصات التجارة الإلكترونية',
      'تحليلات التنبؤ بالمبيعات الشهرية'
    ],
    featuresFr: [
      'Planification des rendez-vous et rappels clients',
      'Synchronisation e-commerce en temps réel',
      'Analyse prédictive des ventes mensuelles'
    ],
    downloadLinks: {
      androidUrl: 'https://example.com/downloads/crmpro.apk',
      iosUrl: 'https://apple.com/app/crmpro',
      apkSize: '28.1 MB'
    },
    status: 'published'
  },
  {
    id: 'app-comm-3',
    title: 'المحاسب المالي السريع QuickTax',
    titleFr: 'Comptable Financier QuickTax',
    slug: 'quicktax-financial',
    category: 'commercial',
    shortDesc: 'حساب الضرائب، القوائم المالية والتحليل المالي اليومي للشركات.',
    shortDescFr: 'Calcul de taxes, bilans financiers et suivi de trésorerie.',
    fullDesc: 'أداة محاسبية ذكية لحساب القيمة المضافة، الإقرارات الضريبية، ومراقبة التدفقات النقدية يومياً مع إشعارات الاستحقاقات المالية.',
    fullDescFr: 'Outil comptable intelligent pour le calcul de la TVA, déclarations fiscales et suivi quotidien de la trésorerie.',
    icon: 'Calculator',
    badge: 'حديث',
    badgeFr: 'Nouveau',
    downloadsCount: 0,
    rating: 4.6,
    reviewsCount: 310,
    size: '21.0 MB',
    version: '1.9.5',
    updatedDate: '2026-03-10',
    developer: 'FinTech Digital',
    screenshots: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'حساب ضريبة القيمة المضافة التلقائي',
      'تصدير ملفات الميزانية المعتمدة'
    ],
    featuresFr: [
      'Calcul automatique de la TVA',
      'Exportation des bilans certifiés'
    ],
    downloadLinks: {
      androidUrl: 'https://example.com/downloads/quicktax.apk',
      iosUrl: 'https://apple.com/app/quicktax',
      apkSize: '21.0 MB'
    },
    status: 'published'
  },

  // --- الفئة العائلية (Family Category) ---
  {
    id: 'app-fam-1',
    title: 'مسيّر ميزانية المنزل والعائلة HomeBudget',
    titleFr: 'Budget Familial & Maison HomeBudget',
    slug: 'home-budget-family',
    category: 'family',
    shortDesc: 'إدارة مصاريف العائلة، مشتريات المنزل، والادخار للرحلات المناسبات.',
    shortDescFr: 'Gestion des dépenses du foyer, achats ménagers et épargne familiale.',
    fullDesc: 'تطبيق عائلي ممتع يتيح لجميع أفراد الأسرة مشاركة ومتابعة الميزانية الشهرية. يحتوي على قائمة تسوق منزلية مشتركة تتحدث لحظياً، تتبع فواتير الكهرباء والماء والإنترنت، وحاسبة ادخار ذكية.',
    fullDescFr: 'Application familiale permettant d\'organiser le budget mensuel de la maison. Liste de courses partagée en temps réel, suivi des factures et calculateur d\'épargne.',
    icon: 'Users',
    badge: 'اختيار العائلات',
    badgeFr: 'Choix des Familles',
    downloadsCount: 0,
    rating: 4.9,
    reviewsCount: 2150,
    size: '19.4 MB',
    version: '4.1.2',
    updatedDate: '2026-03-15',
    developer: 'FamilyLife Apps',
    screenshots: [
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'قائمة مشتريات منزلية متزامنة بين جميع الهواتف',
      'تحديد سقف الإنفاق لكل فئة (طعام، تعليم، ترفيه)',
      'تنبيه بإنفاد الميزانية قبل نهاية الشهر'
    ],
    featuresFr: [
      'Liste de courses synchronisée entre tous les téléphones',
      'Plafonds de dépenses par catégorie',
      'Alerte de dépassement de budget'
    ],
    downloadLinks: {
      androidUrl: 'https://example.com/downloads/homebudget.apk',
      iosUrl: 'https://apple.com/app/homebudget',
      apkSize: '19.4 MB'
    },
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'app-fam-2',
    title: 'مربّي الأسرة والأطفال KidGuard Safe',
    titleFr: 'Guide Parental & Sécurité Enfants',
    slug: 'kidguard-parental-safe',
    category: 'family',
    shortDesc: 'تنظيم أوقات الشاشة، تتبع موقع الأبناء بالأقمار الصناعية ورسائل SOS.',
    shortDescFr: 'Contrôle du temps d\'écran, géolocalisation des enfants et alerte SOS.',
    fullDesc: 'يقدم للأولياء راحة البال الكاملة عبر تحديد مكان الأبناء المباشر، إرسال تنبيه في حال الخروج من المنطقة الآمنة (المدرسة أو البيت)، وتحديد ساعات استبدال الشاشة بالدراسة.',
    fullDescFr: 'Offre aux parents une tranquillité d\'esprit grâce au suivi GPS en temps réel des enfants, zones de sécurité personnalisées et contrôle du temps d\'écran.',
    icon: 'HeartHandshake',
    badge: 'حماية معتمدة',
    badgeFr: 'Certifié Sécurisé',
    downloadsCount: 0,
    rating: 4.8,
    reviewsCount: 1890,
    size: '26.8 MB',
    version: '3.0.4',
    updatedDate: '2026-03-01',
    developer: 'SafeKids Labs',
    screenshots: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'تتبع GPS سريع وموفر للبطارية',
      'زر طوارئ SOS يرسل موقع الطفل للأبوين فوراً',
      'جدولة أوقات النوم واستخدام الألعاب'
    ],
    featuresFr: [
      'Suivi GPS précis et économe en batterie',
      'Bouton d\'urgence SOS avec alerte immédiate',
      'Planification des heures de sommeil et de jeu'
    ],
    downloadLinks: {
      androidUrl: 'https://example.com/downloads/kidguard.apk',
      iosUrl: 'https://apple.com/app/kidguard',
      apkSize: '26.8 MB'
    },
    status: 'published'
  },
  {
    id: 'app-fam-3',
    title: 'منظم الرحلات والوجبات العائلية FamilyPlanner',
    titleFr: 'Planificateur de Sorties & Repas',
    slug: 'family-planner-meals',
    category: 'family',
    shortDesc: 'جدولة وجبات الأسبوع، تنظيم رحلات العطلات وألبوم الصور العائلي الخاص.',
    shortDescFr: 'Planification des repas hebdomadaires, sorties et album photo privé.',
    fullDesc: 'المكان المفضل لجمع الذكريات وتنسيق مواعيد العائلة، جدول الوجبات اليومية ومشاركة الصور العائلية في بيئة آمنة تماماً وخاصة.',
    fullDescFr: 'L\'application idéale pour planifier les repas de la semaine, organiser les vacances en famille et partager un album photo 100% privé.',
    icon: 'Calendar',
    badge: 'مفضل',
    badgeFr: 'Populaire',
    downloadsCount: 0,
    rating: 4.7,
    reviewsCount: 420,
    size: '16.5 MB',
    version: '1.8.0',
    updatedDate: '2026-01-25',
    developer: 'FamilyLife Apps',
    screenshots: [
      'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'جدول وجبات ذكي واقتراح وصفات صحية',
      'ألبوم صور مشفر خاص بالأسرة فقط'
    ],
    featuresFr: [
      'Planning de repas intelligent et recettes équilibrées',
      'Album privé entièrement chiffré'
    ],
    downloadLinks: {
      androidUrl: 'https://example.com/downloads/familyplanner.apk',
      iosUrl: 'https://apple.com/app/familyplanner',
      apkSize: '16.5 MB'
    },
    status: 'published'
  },

  // --- الفئة الأمنية (Security Category) ---
  {
    id: 'app-sec-1',
    title: 'درع الخصوصية والـ VPN المشفر ShieldVPN',
    titleFr: 'Bouclier de Confidentialité ShieldVPN',
    slug: 'shield-vpn-privacy',
    category: 'security',
    shortDesc: 'حماية الاتصالات، تشفير البيانات، ومنع تتبع الإعلانات والبرمجيات الخبيثة.',
    shortDescFr: 'Protection des connexions, chiffrement des données et anti-traçage.',
    fullDesc: 'تطبيق أمني عالي الكفاءة يوفر اتصالاً مشفراً بدرجة عسكرية (AES-256). يمنع اختراق الشبكات العامة الـ Wi-Fi، يحجب الإعلانات المزعجة ومحاولات التجسس، ويضمن لك تصفحاً آمناً وسريعاً.',
    fullDescFr: 'Application de sécurité haut de gamme offrant un chiffrement de niveau militaire (AES-256). Protège vos données sur le Wi-Fi public, bloque le traçage et garantit un anonymat total.',
    icon: 'ShieldCheck',
    badge: 'حماية قصوى',
    badgeFr: 'Sécurité Maximale',
    downloadsCount: 0,
    rating: 4.9,
    reviewsCount: 3420,
    size: '22.0 MB',
    version: '5.2.0',
    updatedDate: '2026-03-22',
    developer: 'CyberGuard Security Ltd',
    screenshots: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1510511459019-5dee997dd1db?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'تشفير عسكري AES-256 للشبكة بأكملها',
      'حظر برامج التجسس والمواقع الخبيثة تلقائياً',
      'سيرفرات فائقة السرعة بدون تسجيل سجلات تصفح (No-Logs Policy)'
    ],
    featuresFr: [
      'Chiffrement réseau AES-256 complet',
      'Blocage automatique des logiciels malveillants',
      'Serveurs ultra-rapides sans journalisation (No-Logs)'
    ],
    downloadLinks: {
      androidUrl: 'https://example.com/downloads/shieldvpn.apk',
      iosUrl: 'https://apple.com/app/shieldvpn',
      apkSize: '22.0 MB'
    },
    isFeatured: true,
    status: 'published'
  },
  {
    id: 'app-sec-2',
    title: 'قفل التطبيقات بالبصمة AppLock Vault',
    titleFr: 'Verrouillage d\'Apps AppLock Vault',
    slug: 'applock-vault-biometric',
    category: 'security',
    shortDesc: 'قفل الصور، المحادثات، والتطبيقات ببصمة الاصبع أو الوجه وسرية كاملة.',
    shortDescFr: 'Verrouillage par empreinte et coffre-fort d\'images confidentiel.',
    fullDesc: 'يحمي تطبيق AppLock صورك الخاصة، مقاطع الفيديو، ومحادثات واتساب وتليجرام بكلمة سر أو بصمة الإصبع. يلتقط صورة ذاتية سريعة لأي شخص يحاول فتح هاتفك بكلمة سر خاطئة.',
    fullDescFr: 'Protège vos photos, vidéos et applications par empreinte digitale ou code PIN. Capture une photo de tout intrus tentant de déverrouiller vos applications sans autorisation.',
    icon: 'Lock',
    badge: 'أعلى تقييم',
    badgeFr: 'Mieux Noté',
    downloadsCount: 0,
    rating: 4.8,
    reviewsCount: 2890,
    size: '14.2 MB',
    version: '3.6.1',
    updatedDate: '2026-02-28',
    developer: 'CyberGuard Security Ltd',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'التقاط صورة الدخيل المتجسس تلقائياً مع الوقت',
      'خزنة سرية للصور تنفي وجودها على الجهاز',
      'أيقونة مموهة تبدو كآلة حاسبة عادية'
    ],
    featuresFr: [
      'Prise de photo automatique de l\'intrus',
      'Coffre-fort photo masqué',
      'Icône camouflée en calculatrice classique'
    ],
    downloadLinks: {
      androidUrl: 'https://example.com/downloads/applock.apk',
      iosUrl: 'https://apple.com/app/applock',
      apkSize: '14.2 MB'
    },
    status: 'published'
  },
  {
    id: 'app-sec-3',
    title: 'إنذار ضد السرقة وفاحص الفيروسات AntiTheft Guard',
    titleFr: 'Alarme Anti-Vol & Antivirus',
    slug: 'antitheft-guard-scanner',
    category: 'security',
    shortDesc: 'جرس إنذار مرتفع عند تحريك الهاتف أو فصل الشاحن مع فحص التطبيقات.',
    shortDescFr: 'Alarme antivol sonore et scanner de sécurité en arrière-plan.',
    fullDesc: 'تطبيق إنذار ذكي يصدر صوتاً صاخباً إذا حاول أي شخص لمس هاتفك أو فصله من الشاحن في الأماكن العامة، بالإضافة إلى فحص كفاءة النظام واكتشاف التطبيقات الضارة.',
    fullDescFr: 'Application d\'alarme intelligente qui déclenche une sirène si quelqu\'un déplace votre téléphone ou débranche le chargeur en public, couplée à un scanner antivirus.',
    icon: 'BellRing',
    badge: 'ضروري',
    badgeFr: 'Indispensable',
    downloadsCount: 0,
    rating: 4.7,
    reviewsCount: 980,
    size: '17.8 MB',
    version: '2.1.0',
    updatedDate: '2026-03-05',
    developer: 'SecuTech Labs',
    screenshots: [
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=800&q=80'
    ],
    features: [
      'إنذار فصل الشاحن وإنذار جيب المحفظة',
      'فحص التطبيقات والملحقات الضارة'
    ],
    featuresFr: [
      'Alarme de déconnexion du chargeur et alarme anti-pickpocket',
      'Scanner complet d\'applications et fichiers'
    ],
    downloadLinks: {
      androidUrl: 'https://example.com/downloads/antitheft.apk',
      iosUrl: 'https://apple.com/app/antitheft',
      apkSize: '17.8 MB'
    },
    status: 'published'
  }
];

export const initialReviews: ReviewItem[] = [
  {
    id: 'rev-1',
    appId: 'app-comm-1',
    userName: 'ياسين بن علي (Yassine Benali)',
    userEmail: 'yassine.benali@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    authProvider: 'google',
    rating: 5,
    comment: 'تطبيق المحاسبة ممتاز جداً وسهل الاستخدام، ساعدني كثيراً في تنظيم فواتير محلي التجاري وطباعة المبيعات بسرعة.',
    date: '2026-03-24',
    isVerified: true,
    developerReply: 'شكراً لك ياسين! يسعدنا جداً أن التطبيق يساهم في نماء تجارتك.',
    status: 'approved'
  },
  {
    id: 'rev-2',
    appId: 'app-comm-1',
    userName: 'Amina Mansouri',
    userEmail: 'amina.m@facebook.com',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    authProvider: 'facebook',
    rating: 5,
    comment: 'Très bonne application pour la gestion des stocks et factures. Très rapide et fluide.',
    date: '2026-03-21',
    isVerified: true,
    status: 'approved'
  },
  {
    id: 'rev-3',
    appId: 'app-fam-1',
    userName: 'فاطمة الزهراء (Fatima)',
    userEmail: 'fatima.z@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    authProvider: 'google',
    rating: 5,
    comment: 'تطبيق ميزانية العائلة ممتاز! الآن أستطيع مزامنة قائمة المشتريات مع زوجي لحظة بلحظة.',
    date: '2026-03-25',
    isVerified: true,
    status: 'approved'
  },
  {
    id: 'rev-4',
    appId: 'app-sec-1',
    userName: 'Karim Brahimi',
    userEmail: 'k.brahimi@google.com',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    authProvider: 'google',
    rating: 5,
    comment: 'ShieldVPN est le meilleur VPN que j\'ai utilisé. Connexion très rapide et sécurisée.',
    date: '2026-03-26',
    isVerified: true,
    status: 'approved'
  }
];

export const initialUsers: UserAccount[] = [
  {
    id: 'user-manager',
    name: 'المدير العام (Manager)',
    email: 'manager@roigroupes.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    provider: 'admin',
    role: 'admin',
    joinedDate: '2026-01-01',
    status: 'active'
  },
  {
    id: 'user-1',
    name: 'ياسين بن علي',
    email: 'yassine.benali@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    provider: 'google',
    role: 'user',
    joinedDate: '2026-02-10',
    status: 'active'
  },
  {
    id: 'user-2',
    name: 'Amina Mansouri',
    email: 'amina.m@facebook.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    provider: 'facebook',
    role: 'user',
    joinedDate: '2026-02-14',
    status: 'active'
  },
  {
    id: 'user-3',
    name: 'Karim Brahimi',
    email: 'k.brahimi@google.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    provider: 'google',
    role: 'user',
    joinedDate: '2026-03-01',
    status: 'active'
  }
];

export const initialAds: AdBannerItem[] = [
  {
    id: 'ad-1',
    title: 'عرض ترويجي: خادم الحماية الأمنية المتقدمة',
    titleFr: 'Sponsorisé: Serveur Sécurisé Enterprise',
    placement: 'header',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    targetUrl: '#',
    isActive: true,
    impressions: 14500,
    clicks: 1240,
    type: 'sponsored_app',
    sponsorName: 'CyberGuard Enterprise',
    sponsorBadge: 'إعلان موثق'
  },
  {
    id: 'ad-2',
    title: 'تطبيق الحلول التجارية المتكاملة CloudPos',
    titleFr: 'Solution CloudPos pour Boutiques',
    placement: 'sidebar',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    targetUrl: '#',
    isActive: true,
    impressions: 9800,
    clicks: 820,
    type: 'image'
  }
];

export const initialDownloadLogs: DownloadLog[] = [
  { id: 'dl-1', appId: 'app-comm-1', appName: 'سجل الأعمال المحاسبي SmartPOS', timestamp: '2026-10-27 18:45', device: 'Android', ipLocation: 'الجزائر (Algeria)' },
  { id: 'dl-2', appId: 'app-sec-1', appName: 'درع الخصوصية ShieldVPN', timestamp: '2026-10-27 18:32', device: 'Android', ipLocation: 'فرنسا (France)' },
  { id: 'dl-3', appId: 'app-fam-1', appName: 'مسيّر ميزانية المنزل HomeBudget', timestamp: '2026-10-27 18:10', device: 'iOS', ipLocation: 'تونس (Tunisia)' },
  { id: 'dl-4', appId: 'app-comm-2', appName: 'مسيّر المبيعات CRM Pro', timestamp: '2026-10-27 17:50', device: 'Android', ipLocation: 'المغرب (Morocco)' },
  { id: 'dl-5', appId: 'app-sec-2', appName: 'قفل التطبيقات AppLock Vault', timestamp: '2026-10-27 17:15', device: 'Android', ipLocation: 'مصر (Egypt)' }
];

import { CategoryItem } from '../types';

export const initialCategories: CategoryItem[] = [
  { id: 'commercial', nameAr: 'الفئة التجارية', nameFr: 'Commercial', icon: 'Briefcase', color: 'emerald' },
  { id: 'family', nameAr: 'الفئة العائلية', nameFr: 'Famille', icon: 'Users', color: 'pink' },
  { id: 'security', nameAr: 'الأمنية', nameFr: 'Sécurité', icon: 'Shield', color: 'amber' }
];

export const initialSiteSettings: SiteSettings = {
  siteTitleAr: 'متجر تطبيقات RoiGroupeS',
  siteTitleFr: 'Boutique RoiGroupeS',
  defaultLang: 'ar',
  enableGoogleLogin: true,
  enableFacebookLogin: true,
  adSenseCode: '<!-- Google AdSense Script -->\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>',
  maintenanceMode: false,
  contactEmail: 'contact@roigroupes.com',
  whatsappNumber: '+213797152590',
  facebookLink: 'https://facebook.com/roigroupes',
  instagramLink: 'https://instagram.com/roigroupes',
  tiktokLink: 'https://tiktok.com/@roigroupes',
  featuredAppId: 'app-comm-1',
  adminUsername: 'admin',
  adminPassword: '123456',
  pwaTitle: 'متجر تطبيقات RoiGroupeS الرسمي',
  pwaShortName: 'RoiGroupeS',
  pwaStartUrl: '/',
  pwaIcon: '/assets/aistudio/1793173133604_a080e212.jpg',
  appFeatures: {
    enableMemberChat: true,
    enableNotifications: true,
    enableAppReviews: true,
    enableAIStoreAssistant: true,
    enableLiveSupport: true,
    enableUserProfiles: true
  }
};

import { ProjectRequestItem } from '../types';

export const initialProjectRequests: ProjectRequestItem[] = [
  {
    id: 'req-101',
    projectType: 'mobile_app',
    projectTitle: 'تطبيق توصيل طلبات محلي ومتاجر',
    userIdea: 'أريد تطبيق هاتف للعملاء والمندوبين لطلب وتوصيل الوجبات والمواد الغذائية في مدينتي مع إشعارات مباشرة وتتبع بالخريطة.',
    aiSummary: 'دراسة استشارية: يتطلب التطبيق 3 واجهات (تطبيق العميل، تطبيق السائق، ولوحة تحكم الإدارة). يوصى باستخدام React Native للهواتف و Node.js/Firestore للباك إند مع Google Maps API لتتبع المندوبين.',
    suggestedTech: 'React Native, Node.js, Firebase Firestore, Google Maps Platform',
    estimatedTimeline: '3 إلى 5 أسابيع',
    userName: 'سفيان بن علي',
    userEmail: 'sofiane.client@gmail.com',
    userPhone: '+213661234567',
    userId: 'user-sample-1',
    ipAddress: '105.101.44.18',
    createdAt: '2026-10-27 15:30',
    status: 'pending'
  }
];

export const initialFloatingAds: FloatingAdItem[] = [
  {
    id: 'floating-1',
    titleAr: 'تطبيق سجل الأعمال المحاسبي SmartPOS 2026',
    titleFr: 'SmartPOS Commercial 2026',
    subtitleAr: 'حل متكامل لنقاط البيع وإدارة المحلات والمحاسبة مع طباعة الفواتير حرارياً فورياً.',
    subtitleFr: 'Logiciel complet de caisse et facturation pour commerces et PME.',
    imageUrl: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=800&q=80',
    badgeAr: 'إعلان 1 من 3 - الفئة التجارية',
    badgeFr: 'Pub 1 sur 3 - Commercial',
    buttonTextAr: 'عرض التفاصيل والتحميل المباشر',
    buttonTextFr: 'Voir Détails & Télécharger',
    targetUrl: '#',
    appId: 'app-comm-1',
    isActive: true
  },
  {
    id: 'floating-2',
    titleAr: 'تطبيق تنظيم ميزانية العائلة HomeBudget Safe',
    titleFr: 'HomeBudget - Dépenses Familiales',
    subtitleAr: 'إدارة مصاريف المنزل وقائمة مشتريات مشتركة ومزامنة حية بين أفراد الأسرة.',
    subtitleFr: 'Gestion des dépenses du foyer et liste de courses partagée en temps réel.',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=800&q=80',
    badgeAr: 'إعلان 2 من 3 - الفئة العائلية',
    badgeFr: 'Pub 2 sur 3 - Famille',
    buttonTextAr: 'تثبيت التطبيق الآن',
    buttonTextFr: 'Installer l\'Application',
    targetUrl: '#',
    appId: 'app-fam-1',
    isActive: true
  },
  {
    id: 'floating-3',
    titleAr: 'درع الخصوصية والاتصال المشفر ShieldVPN Enterprise',
    titleFr: 'ShieldVPN - Chiffrement Absolu',
    subtitleAr: 'تشفير عسكري لحماية اتصالاتك وحجب التجسس والإعلانات المزعجة في جميع الشبكات.',
    subtitleFr: 'Chiffrement AES-256 pour sécuriser vos connexions Wi-Fi et protéger votre vie privée.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    badgeAr: 'إعلان 3 من 3 - الفئة الأمنية',
    badgeFr: 'Pub 3 sur 3 - Sécurité',
    buttonTextAr: 'حماية هاتفك مجاناً',
    buttonTextFr: 'Protéger Votre Appareil',
    targetUrl: '#',
    appId: 'app-sec-1',
    isActive: true
  }
];
