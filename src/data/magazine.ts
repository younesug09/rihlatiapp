import { realImages } from "@/data/images";

export type MagazineCategory =
  | "news"
  | "reports"
  | "investigations"
  | "interviews"
  | "stories"
  | "heritage"
  | "culture"
  | "nature"
  | "tips"
  | "discoveries"
  | "economy";

export const magazineCategories: { id: MagazineCategory | "all"; label: string }[] = [
  { id: "all", label: "كل المواضيع" },
  { id: "news", label: "أخبار السياحة" },
  { id: "reports", label: "تقارير" },
  { id: "investigations", label: "تحقيقات" },
  { id: "interviews", label: "مقابلات" },
  { id: "stories", label: "قصص المسافرين" },
  { id: "heritage", label: "التراث" },
  { id: "culture", label: "الثقافة" },
  { id: "nature", label: "الطبيعة" },
  { id: "tips", label: "نصائح السفر" },
  { id: "discoveries", label: "اكتشافات" },
  { id: "economy", label: "اقتصاد السياحة" },
];

export type Article = {
  slug: string;
  title: string;
  dek: string;
  category: MagazineCategory;
  author: string;
  authorRole: string;
  date: string;
  readMinutes: number;
  image: string;
  imageAlt: string;
  imageCredit: string;
  body: string[];
  sources: { label: string; note: string }[];
  featured?: boolean;
};

export const articles: Article[] = [
  {
    slug: "casbah-alger-hikaya",
    title: "القصبة: مدينة تُقرأ بالخطوات لا بالخرائط",
    dek: "جولة في أزقة القصبة العتيقة، حيث تتشابك البيوت العثمانية والذاكرة الشعبية والحِرف التي تقاوم الاندثار.",
    category: "heritage",
    author: "هيئة تحرير رحلتي",
    authorRole: "قسم التراث",
    date: "سبتمبر 2026",
    readMinutes: 7,
    image: realImages.alger.src,
    imageAlt: realImages.alger.alt,
    imageCredit: realImages.alger.credit,
    featured: true,
    body: [
      "تبدأ القصبة من البحر وتصعد نحو السماء في شكل مدرّج، وهو ما يجعل التنقّل فيها تجربة جسدية قبل أن يكون تجربة بصرية. الأزقة ضيقة، والسلالم كثيرة، والبيوت تتكئ على بعضها البعض كأنها تحمي نفسها من الزمن.",
      "العمارة هنا ليست واجهة للعرض: الدويرة بفنائها المفتوح، والسقيفة التي تفصل بين الشارع والبيت، والزليج الذي يحفظ برودة الصيف. كل عنصر يؤدي وظيفة مناخية واجتماعية في آن واحد.",
      "أُدرجت القصبة على قائمة التراث العالمي لليونسكو سنة 1992، وهو تصنيف يمنحها حماية رمزية، لكنه لا يغني عن أعمال الترميم المستمرة التي يطالب بها سكانها والمختصون.",
      "نصيحة للزائر: ابدأ الجولة صباحًا، والبس حذاءً مريحًا، واستعن بمرافق محلي معتمد. الأزقة متشابهة، والدليل الجيد هو الفرق بين جولة سياحية وجولة في الذاكرة.",
    ],
    sources: [
      { label: "قائمة التراث العالمي — اليونسكو", note: "تصنيف قصبة الجزائر سنة 1992." },
      { label: "معاينة ميدانية", note: "ملاحظات تحريرية من جولة مشي في القصبة." },
    ],
  },
  {
    slug: "tassili-najjer-matahaf-maftouh",
    title: "الطاسيلي ناجر: متحف مفتوح تحت سماء بلا تلوّث ضوئي",
    dek: "نقوش صخرية عمرها آلاف السنين، وكثبان تتغيّر ألوانها مع الشمس. تقرير عن وجهة تتطلب تنظيمًا مسبقًا واحترامًا للبيئة.",
    category: "nature",
    author: "هيئة تحرير رحلتي",
    authorRole: "قسم الطبيعة والمغامرة",
    date: "سبتمبر 2026",
    readMinutes: 9,
    image: realImages.tassili.src,
    imageAlt: realImages.tassili.alt,
    imageCredit: realImages.tassili.credit,
    featured: true,
    body: [
      "الطاسيلي ناجر هضبة صخرية شاسعة في أقصى الجنوب الشرقي الجزائري، تشتهر بنقوشها ورسومها الصخرية التي توثّق حياة إنسان ما قبل التاريخ حين كانت المنطقة أكثر خضرة.",
      "الرحلة إلى المنطقة ليست نزهة عابرة: تحتاج إلى مرافقة منظّمة، وتصاريح حسب المسار، ومعدات مناسبة للتنقل والمبيت في الصحراء.",
      "أفضل فترة للزيارة عمومًا هي أشهر الخريف والشتاء والربيع، حين تكون الحرارة معتدلة نهارًا وباردة ليلًا.",
      "قاعدة ذهبية: لا تلمس النقوش، ولا تترك أي أثر خلفك. حماية الموقع مسؤولية الزائر قبل أن تكون مهمة الإدارة.",
    ],
    sources: [
      { label: "قائمة التراث العالمي — اليونسكو", note: "تصنيف الطاسيلي ناجر سنة 1982." },
      { label: "منظمو رحلات صحراوية", note: "معطيات عامة حول تنظيم الرحلات والتصاريح." },
    ],
  },
  {
    slug: "ghardaia-imara-sahrawiya",
    title: "غرداية: درس في العمارة الصحراوية المستدامة",
    dek: "قصور وادي ميزاب الخمسة تقدّم نموذجًا عمرانيًا يواجه الحرارة والندرة المائية بذكاء تخطيطي سابق لعصره.",
    category: "reports",
    author: "هيئة تحرير رحلتي",
    authorRole: "قسم التقارير",
    date: "سبتمبر 2026",
    readMinutes: 6,
    image: realImages.ghardaia.src,
    imageAlt: realImages.ghardaia.alt,
    imageCredit: realImages.ghardaia.credit,
    body: [
      "تتوزّع مدن وادي ميزاب على شكل قصور متدرّجة حول مسجد يتوسّط القمة، بحيث تضمن التهوية والظل وتقصير المسافات.",
      "نظام توزيع مياه السيول في المنطقة يُعدّ من أقدم أنظمة الهندسة المائية المحلية التي ما تزال مفهومة الاستعمال إلى اليوم.",
      "الزائر مطالب باحترام خصوصية السكان: التصوير داخل الأحياء السكنية يخضع لقواعد محلية واضحة.",
    ],
    sources: [
      { label: "قائمة التراث العالمي — اليونسكو", note: "تصنيف وادي ميزاب سنة 1982." },
    ],
  },
  {
    slug: "hiwar-mourafiq-sahrawi",
    title: "مقابلة: «المرافق المحلي هو أول ضامن لسلامة الرحلة»",
    dek: "حديث تحريري حول دور المرافقين المحليين في تنظيم الرحلات الصحراوية والجبلية.",
    category: "interviews",
    author: "هيئة تحرير رحلتي",
    authorRole: "قسم المقابلات",
    date: "سبتمبر 2026",
    readMinutes: 5,
    image: realImages.tamanrasset.src,
    imageAlt: realImages.tamanrasset.alt,
    imageCredit: realImages.tamanrasset.credit,
    body: [
      "يشرح المرافقون أن جزءًا كبيرًا من حوادث الرحلات الصحراوية سببه ضعف التحضير: ماء غير كافٍ، ملابس غير مناسبة، أو مسار غير معلن لأحد.",
      "الاتفاق المسبق على المسار والتوقيت وجهة الاتصال في حالة الطوارئ ليس إجراءً إداريًا، بل شرط أمان.",
      "هذه المقابلة صياغة تحريرية لمضمون عام متداول بين منظّمي الرحلات، وليست تصريحًا منسوبًا لشخص محدّد.",
    ],
    sources: [
      { label: "محتوى تحريري", note: "صياغة عامة غير منسوبة لمصدر مُسمّى." },
    ],
  },
  {
    slug: "nasaih-safar-dakhili",
    title: "عشر نصائح عملية لرحلة داخلية ناجحة",
    dek: "من حجز النقل إلى إدارة الميزانية اليومية: قائمة مختصرة تُختصر عليك الكثير من الوقت.",
    category: "tips",
    author: "هيئة تحرير رحلتي",
    authorRole: "قسم نصائح السفر",
    date: "سبتمبر 2026",
    readMinutes: 4,
    image: realImages.jijel.src,
    imageAlt: realImages.jijel.alt,
    imageCredit: realImages.jijel.credit,
    body: [
      "احجز النقل مبكرًا في المواسم المرتفعة، خاصة نحو الساحل صيفًا ونحو الجنوب شتاءً.",
      "احتفظ بنسخة رقمية ونسخة ورقية من وثائق الحجز.",
      "خصّص ميزانية يومية مرنة تشمل النقل المحلي والمطاعم والأنشطة.",
      "تحقق من التغطية الشبكية في الوجهات الجبلية والصحراوية قبل الانطلاق.",
      "احترم القواعد المحلية في التصوير خاصة داخل الأحياء السكنية والأسواق.",
    ],
    sources: [{ label: "محتوى تحريري", note: "إرشادات عامة من إعداد فريق رحلتي." }],
  },
  {
    slug: "iqtisad-siyaha-dakhiliya",
    title: "اقتصاد السياحة الداخلية: أين تذهب الدينارات؟",
    dek: "قراءة في سلسلة القيمة السياحية المحلية: النقل، الإقامة، الإطعام، الحرف، والمرافقة.",
    category: "economy",
    author: "هيئة تحرير رحلتي",
    authorRole: "قسم الاقتصاد",
    date: "سبتمبر 2026",
    readMinutes: 6,
    image: realImages.oran.src,
    imageAlt: realImages.oran.alt,
    imageCredit: realImages.oran.credit,
    body: [
      "كل رحلة داخلية تُوزّع إنفاقها على عدة حلقات: النقل، ثم الإقامة، ثم الإطعام، ثم الأنشطة والحرف المحلية.",
      "كلما زاد نصيب الفاعلين المحليين من هذا الإنفاق، زاد أثر السياحة على الاقتصاد الجهوي.",
      "لا تنشر رحلتي أرقامًا اقتصادية غير موثّقة؛ ما يُعرض هنا إطار تحليلي وليس إحصائيات رسمية.",
    ],
    sources: [{ label: "محتوى تحريري", note: "إطار تحليلي بدون أرقام غير موثّقة." }],
  },
  {
    slug: "tahqiq-jawdat-khadamat",
    title: "تحقيق: ما الذي يجعل الزائر يعود إلى الوجهة نفسها؟",
    dek: "جودة الاستقبال، وضوح الأسعار، ونظافة الفضاءات العمومية: ثلاثة عوامل تتكرّر في شهادات المسافرين.",
    category: "investigations",
    author: "هيئة تحرير رحلتي",
    authorRole: "قسم التحقيقات",
    date: "سبتمبر 2026",
    readMinutes: 8,
    image: realImages.bejaia.src,
    imageAlt: realImages.bejaia.alt,
    imageCredit: realImages.bejaia.credit,
    body: [
      "الاستقبال الجيد ليس ابتسامة فقط: هو معلومة صحيحة في الوقت المناسب، وسعر معلن مسبقًا، والتزام بما تم الاتفاق عليه.",
      "وضوح الأسعار من أكثر النقاط حساسية لدى الزائر الداخلي، ويؤثر مباشرة في قرار العودة.",
      "نظافة الفضاءات العمومية والشواطئ تبقى العامل الأكثر تكرارًا في ملاحظات المسافرين.",
    ],
    sources: [{ label: "محتوى تحريري", note: "ملاحظات عامة غير مدعومة بأرقام مسحية." }],
  },
  {
    slug: "qissat-musafir-setif-djemila",
    title: "قصة مسافر: من عين الفوارة إلى أعمدة جميلة",
    dek: "يومان في سطيف بين نافورة المدينة وأطلال جميلة الرومانية.",
    category: "stories",
    author: "هيئة تحرير رحلتي",
    authorRole: "قصص المسافرين",
    date: "سبتمبر 2026",
    readMinutes: 5,
    image: realImages.djemila.src,
    imageAlt: realImages.djemila.alt,
    imageCredit: realImages.djemila.credit,
    body: [
      "تبدأ الحكاية في وسط سطيف، حيث تجتمع المدينة حول نافورة عين الفوارة كأنها ساحة انتظار جماعية.",
      "على بعد عشرات الكيلومترات، تفتح جميلة مشهدًا رومانيًا كاملًا: ساحات، معابد، وفسيفساء محفوظة في المتحف.",
      "أفضل توقيت للزيارة هو الصباح الباكر، قبل أن ترتفع الحرارة وتمتلئ الممرات.",
    ],
    sources: [{ label: "قائمة التراث العالمي — اليونسكو", note: "تصنيف موقع جميلة." }],
  },
  {
    slug: "thaqafa-musiqa-rai-chaabi",
    title: "الثقافة في الطريق: الراي والشعبي كخريطة سمعية",
    dek: "كيف تروي الموسيقى المحلية جغرافيا المدن الجزائرية من وهران إلى العاصمة.",
    category: "culture",
    author: "هيئة تحرير رحلتي",
    authorRole: "قسم الثقافة",
    date: "سبتمبر 2026",
    readMinutes: 5,
    image: realImages.tlemcen.src,
    imageAlt: realImages.tlemcen.alt,
    imageCredit: realImages.tlemcen.credit,
    body: [
      "لكل مدينة إيقاعها: الراي في الغرب، الشعبي في العاصمة، الحوزي في تلمسان، والقبائلي في الجبال.",
      "حضور سهرة موسيقية محلية أحد أسرع الطرق لفهم مزاج المدينة وسكانها.",
    ],
    sources: [{ label: "محتوى تحريري", note: "قراءة ثقافية عامة." }],
  },
  {
    slug: "iktishafat-shawati-skikda",
    title: "اكتشافات: شواطئ أقل ازدحامًا على الساحل الشرقي",
    dek: "بدائل هادئة لمن يبحث عن البحر دون زحام المواسم.",
    category: "discoveries",
    author: "هيئة تحرير رحلتي",
    authorRole: "قسم الاكتشافات",
    date: "سبتمبر 2026",
    readMinutes: 4,
    image: realImages.skikda.src,
    imageAlt: realImages.skikda.alt,
    imageCredit: realImages.skikda.credit,
    body: [
      "الساحل بين سكيكدة وجيجل يضم خلجانًا صغيرة يصعب الوصول إليها بالسيارة، وهو ما يجعلها أقل ازدحامًا.",
      "تحقّق دائمًا من وجود الحراسة قبل السباحة، وتجنّب الخلجان المعزولة في الأيام العاصفة.",
    ],
    sources: [{ label: "محتوى تحريري", note: "إرشادات عامة للسلامة الشاطئية." }],
  },
  {
    slug: "akhbar-mawsim-sahrawi",
    title: "أخبار: انطلاق موسم الرحلات الصحراوية",
    dek: "الوكالات المعتمدة تفتح برامجها الشتوية نحو الجنوب الكبير.",
    category: "news",
    author: "هيئة تحرير رحلتي",
    authorRole: "قسم الأخبار",
    date: "سبتمبر 2026",
    readMinutes: 3,
    image: realImages.taghit.src,
    imageAlt: realImages.taghit.alt,
    imageCredit: realImages.taghit.credit,
    body: [
      "مع اعتدال الحرارة، تُفتح عادةً برامج الرحلات نحو الجنوب الجزائري بدءًا من الخريف.",
      "يُنصح بالتأكد من اعتماد الوكالة ومن تفاصيل البرنامج والتأمين قبل الحجز.",
    ],
    sources: [{ label: "محتوى تحريري", note: "خبر عام بدون أرقام أو أسماء وكالات." }],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
