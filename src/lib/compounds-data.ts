// Compound comparison data for the real estate comparison guide.
// Region: القاهرة الجديدة (New Cairo) — 2026 delivery cycle.

export interface Compound {
  id: string;
  name: string;
  developer: string;
  location: string;
  pricePerMeter: number; // EGP per m²
  minArea: number; // m²
  maxArea: number; // m²
  deliveryDate: string; // human readable Arabic
  deliveryQuarter: string;
  greenSpacePercent: number;
  downPaymentPercent: number;
  installmentYears: number;
  totalUnits: number;
  rating: number; // 1 - 5
  highlight: string;
  bestFor: string;
  amenities: string[];
  verdict: string;
  accent: "emerald" | "amber" | "teal" | "rose" | "violet";
  image: string;
}

export const compounds: Compound[] = [
  {
    id: "montage",
    name: "مونتاج ريزيدنس",
    developer: "تطوير القمة العقارية",
    location: "التجمع الخامس — المنطقة الأولى",
    pricePerMeter: 32000,
    minArea: 150,
    maxArea: 420,
    deliveryDate: "ديسمبر 2026",
    deliveryQuarter: "Q4 2026",
    greenSpacePercent: 72,
    downPaymentPercent: 10,
    installmentYears: 8,
    totalUnits: 1200,
    rating: 5,
    highlight: "الأعلى في نسبة المساحات الخضراء والفخامة",
    bestFor: "الباحث عن الفخامة والهدوء",
    amenities: ["نادي صحي متكامل", "بحيرات صناعية", "ملاعب تنس", "مول تجاري", "حراسة 24/7"],
    verdict:
      "خيار مثالي لمن يضع جودة الحياة والمساحات المفتوحة في مقدمة أولوياته، مع ميزانية تتحمل السعر الأعلى للمتر.",
    accent: "emerald",
    image: "/images/compound-montage.png",
  },
  {
    id: "greenplaza",
    name: "جرين بلازا",
    developer: "مجموعة الأرض العقارية",
    location: "التجمع الأول — أمام الجامعة الأمريكية",
    pricePerMeter: 27500,
    minArea: 120,
    maxArea: 300,
    deliveryDate: "يونيو 2026",
    deliveryQuarter: "Q2 2026",
    greenSpacePercent: 65,
    downPaymentPercent: 15,
    installmentYears: 7,
    totalUnits: 1850,
    rating: 4.5,
    highlight: "أفضل توازن بين السعر والموقع والتسليم القريب",
    bestFor: "العائلات الشابة والمستثمر الأول",
    amenities: ["مدارس دولية", "نادي رياضي", "مناطق تجارية", "مسجد كبير", "حدائق أطفال"],
    verdict:
      "الأنسب لمن يريد قرباً من الخدمات التعليمية والتجارية بسعر منافس وتسليم خلال عام — قيمة عادلة مقابل السعر.",
    accent: "teal",
    image: "/images/compound-greenplaza.png",
  },
  {
    id: "skylife",
    name: "سكاي لايف",
    developer: "سما للتعمير",
    location: "التجمع الخامس — المنطقة الخامسة",
    pricePerMeter: 24800,
    minArea: 100,
    maxArea: 240,
    deliveryDate: "مارس 2026",
    deliveryQuarter: "Q1 2026",
    greenSpacePercent: 55,
    downPaymentPercent: 20,
    installmentYears: 6,
    totalUnits: 2400,
    rating: 4,
    highlight: "أسرع موعد تسليم وأقل مقدم",
    bestFor: "من يريد الاستلام الفوري والإيجار السريع",
    amenities: ["استلام مفروش", "منطقة مكاتب", "جراج underground", "أمن ذكي", "وحدات استثمارية"],
    verdict:
      "ممتاز للمستثمر الذي يستهدف العائد الإيجاري السريع، لكن المساحات الخضراء أقل من المنافسين الأكثر فخامة.",
    accent: "amber",
    image: "/images/compound-skylife.png",
  },
  {
    id: "palmgardens",
    name: "بالم جاردنز",
    developer: "واحة العقارية",
    location: "التجمع الخامس — المنطقة الثانية",
    pricePerMeter: 29500,
    minArea: 135,
    maxArea: 360,
    deliveryDate: "سبتمبر 2026",
    deliveryQuarter: "Q3 2026",
    greenSpacePercent: 68,
    downPaymentPercent: 12,
    installmentYears: 9,
    totalUnits: 1500,
    rating: 4.5,
    highlight: "أطول فترة سداد وأكبر مساحة وحدات",
    bestFor: "العائلات الكبيرة والاستقرار طويل الأمد",
    amenities: ["نادي اجتماعي", "ملاعب متعددة", "بحيرات", "محلات خدمات", "مدرسة ابتدائية"],
    verdict:
      "تجربة سكن عائلي متكاملة بأطول فترة تقسيط في القائمة، ما يخفف الضغط الشهري ويرفع جاذبية الاستقرار.",
    accent: "violet",
    image: "/images/compound-palmgardens.png",
  },
  {
    id: "orchidhills",
    name: "أوركيد هيلز",
    developer: "إعمار مصر",
    location: "التجمع الخامس — المنطقة السابعة",
    pricePerMeter: 34500,
    minArea: 180,
    maxArea: 500,
    deliveryDate: "ديسمبر 2026",
    deliveryQuarter: "Q4 2026",
    greenSpacePercent: 78,
    downPaymentPercent: 10,
    installmentYears: 8,
    totalUnits: 950,
    rating: 5,
    highlight: "الأعلى سعراً والأكثر حصرية وأقل كثافة",
    bestFor: "الباحث عن الحصرية والخصوصية",
    amenities: ["فلل مستقلة", "نادي جولف", "خدمات كونسيرج", "بوابات ذكية", "مارينا صغيرة"],
    verdict:
      "الخيار الأكثر حصرية وخصوصية بكثافة وحدات منخفضة جداً (950 وحدة فقط). السعر الأعلى يعكس مستوى التميز.",
    accent: "rose",
    image: "/images/compound-orchidhills.png",
  },
];

export const comparisonMetrics = [
  { key: "pricePerMeter", label: "متوسط سعر المتر", unit: "ج.م", icon: "banknote" },
  { key: "deliveryDate", label: "موعد التسليم", unit: "", icon: "calendar" },
  { key: "greenSpacePercent", label: "المساحات الخضراء", unit: "%", icon: "trees" },
  { key: "downPaymentPercent", label: "المقدم", unit: "%", icon: "wallet" },
  { key: "installmentYears", label: "سنوات السداد", unit: "سنة", icon: "clock" },
  { key: "minArea", label: "أصغر مساحة", unit: "م²", icon: "ruler" },
] as const;

export interface FaqItem {
  q: string;
  a: string;
}

export const faqs: FaqItem[] = [
  {
    q: "هل هذه المقارنة محايدة فعلاً؟",
    a: "نعم. نعتمد على بيانات مطورين متعددين، تقارير سوق رسمية، وزيارات ميدانية لكل مشروع. لا نرتب المجمعات حسب عمولة المطور، بل حسب قيمة العميل: السعر مقابل المميزات والموقع وموعد التسليم. كل رقم في الجدول قابل للتحقق من مصدره.",
  },
  {
    q: "كيف تحددون متوسط سعر المتر؟",
    a: "نجمع أسعار الوحدات المتاحة فعلياً من مكاتب المبيعات الرسمية لكل مطور خلال آخر 30 يوماً، ثم نستخرج المتوسط المرجَّح حسب المساحة. لا نعتمد على أسعار «الإطلاق» الترويجية بل على العقود الفعلية الموقعة.",
  },
  {
    q: "ماذا لو لم أكن متأكداً أي مجمع يناسبني؟",
    a: "هذه بالضبط فائدة الاستشارة المجانية. خبير عقاري سيتصل بك خلال 24 ساعة، يطرح 5 أسئلة فقط عن ميزانيتك وغرضك (سكن/استثمار) وتوقيتك، ثم يرشح لك 2 إلى 3 مجمعات بأسباب واضحة — بدون أي التزام.",
  },
  {
    q: "هل ملف PDF المجاني يحتوي على معلومات أكثر من الصفحة؟",
    a: "نعم. الملف يتضمن: تحليل تفصيلي لكل مجمع، مخططات مساحات خضراء، مقارنة عوائد إيجار متوقعة 2026-2028، نقاط قوة وضعف لكل مشروع، قائمة تحقق (Checklist) لزيارة الموقع، وخريطة مواقع تفاعلية. كل ذلك في 12 صفحة.",
  },
  {
    q: "هل تتعاملون بالعمولة من المطوّر أم من العميل؟",
    a: "نحن نتلقى عمولة من المطوّر عند إتمام البيع — لا يدفع العميل أي رسوم استشارية. لكن التزامنا الأول هو مصلحة العميل: نرشح الأنسب لك حتى لو كانت عمولتنا أقل، لأن سمعتنا تستند إلى عملاء راضين يرجعون ويحيلون غيرهم.",
  },
  {
    q: "ما الفرق بين «موعد التسليم» و«الاستلام الفعلي»؟",
    a: "موعد التسليم هو الموعد التعاقدي مع المطور. الاستلام الفعلي يعني استلامك للوحدة جاهزة بالتشطيب. بعض المشاريع تتعثر 3-6 أشهر. في الجدول نشير إلى الموعد التعاقدي، وفي ملف PDF نضيف هامش المخاطر لكل مطور بناءً على سجل تسليماته السابقة.",
  },
];

export interface BuyerProfile {
  id: string;
  title: string;
  icon: string;
  description: string;
  recommendedId: string;
  reason: string;
}

export const buyerProfiles: BuyerProfile[] = [
  {
    id: "luxury",
    title: "الباحث عن الفخامة",
    icon: "crown",
    description: "ميزانية مفتوحة ويريد أقل كثافة وأعلى خصوصية",
    recommendedId: "orchidhills",
    reason: "أقل كثافة (950 وحدة) وأعلى مساحات خضراء (78%) مع خدمات كونسيرج.",
  },
  {
    id: "family",
    title: "العائلة الشابة",
    icon: "users",
    description: "ميزانية متوسطة وأولوية للمدارس والخدمات",
    recommendedId: "greenplaza",
    reason: "أمام الجامعة الأمريكية بمدارس دولية وسعر منافس وتسليم قريب.",
  },
  {
    id: "investor",
    title: "المستثمر",
    icon: "trending-up",
    description: "يستهدف العائد الإيجاري السريع والاستلام الفوري",
    recommendedId: "skylife",
    reason: "أسرع تسليم (Q1 2026) ووحدات جاهزة للإيجار بمنطقة مكاتب مجاورة.",
  },
  {
    id: "longterm",
    title: "الاستقرار طويل الأمد",
    icon: "home",
    description: "عائلة كبيرة تريد أطول تقسيط ومساحات أكبر",
    recommendedId: "palmgardens",
    reason: "9 سنوات سداد وأكبر مساحة وحدات (حتى 360 م²) مع نادٍ اجتماعي متكامل.",
  },
];

export const trustStats = [
  { value: "+4,200", label: "عميل ساعده خبيرنا", icon: "users" },
  { value: "15", label: "عاماً في سوق القاهرة الجديدة", icon: "award" },
  { value: "94%", label: "نسبة رضا العملاء", icon: "heart" },
  { value: "24h", label: "متوسط وقت الرد على الاستشارة", icon: "clock" },
];

export const methodology = [
  {
    step: "01",
    title: "جمع البيانات الميدانية",
    description:
      "زيارات أسبوعية لمكاتب مبيعات كل مطور، تسجيل الأسعار الفعلية للوحدات المتاحة، والتحقق من تقدم الأعمال الإنشائية على الطبيعة.",
  },
  {
    step: "02",
    title: "تحليل السوق والمقارنة",
    description:
      "مقارنة كل مشروع مع 12 معياراً موحداً: السعر، الموقع، التسليم، الخدمات، الكثافة، سمعة المطور، والعائد على الاستثمار المتوقع.",
  },
  {
    step: "03",
    title: "تقييم محايد ومراجعة",
    description:
      "لجنة من 3 خبراء عقاريين تراجع التقييم وتصوت على الترتيب النهائي، بدون أي تواصل مع المطور خلال مرحلة التقييم.",
  },
];

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  compoundId: string;
  rating: number;
  quote: string;
  initials: string;
  accent: "emerald" | "amber" | "teal" | "rose" | "violet";
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "م. عمرو السيد",
    role: "اشتعل فيلا — مونتاج ريزيدنس",
    compoundId: "montage",
    rating: 5,
    quote:
      "كنت محتاراً بين 4 مشاريع، الاستشارة المجانية رشّحتلي مونتاج لأنه الأنسب لعيلتي. وفّرت عليّ شهرين بحث وقرار نهائي مريح.",
    initials: "ع.س",
    accent: "emerald",
  },
  {
    id: "t2",
    name: "د. منى عبد الرحمن",
    role: "استثمار شقة — جرين بلازا",
    compoundId: "greenplaza",
    rating: 5,
    quote:
      "الخبير ما ضغطش عليّ أبداً. شرحلي الفرق بين العائد الإيجاري لكل مشروع بوضوح، واخترت جرين بلازا وأنا مطمئنة. عائد فعلي 8.5%.",
    initials: "م.ع",
    accent: "teal",
  },
  {
    id: "t3",
    name: "أ. خالد فؤاد",
    role: "شقة استثمارية — سكاي لايف",
    compoundId: "skylife",
    rating: 4.5,
    quote:
      "ملف المقارنة PDF كان مرجعي قبل ما أكلّم أي حد. لما اتواصلت معاهم كانوا عارفين تفاصيل أدق من اللي قريتها. ناس محترمة وشغّالة صح.",
    initials: "خ.ف",
    accent: "amber",
  },
];

export interface MapLocation {
  compoundId: string;
  name: string;
  // position on the stylized map (percentage 0-100)
  x: number;
  y: number;
  accent: "emerald" | "amber" | "teal" | "rose" | "violet";
  area: string;
}

// Stylized positions on a New Cairo map (relative coordinates)
export const mapLocations: MapLocation[] = [
  { compoundId: "montage", name: "مونتاج ريزيدنس", x: 68, y: 32, accent: "emerald", area: "المنطقة الأولى" },
  { compoundId: "greenplaza", name: "جرين بلازا", x: 42, y: 28, accent: "teal", area: "أمام الجامعة الأمريكية" },
  { compoundId: "skylife", name: "سكاي لايف", x: 58, y: 58, accent: "amber", area: "المنطقة الخامسة" },
  { compoundId: "palmgardens", name: "بالم جاردنز", x: 50, y: 44, accent: "violet", area: "المنطقة الثانية" },
  { compoundId: "orchidhills", name: "أوركيد هيلز", x: 76, y: 70, accent: "rose", area: "المنطقة السابعة" },
];
