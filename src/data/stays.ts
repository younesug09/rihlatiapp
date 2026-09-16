import { realImages } from "@/data/images";

/** Stay categories offered on RIHLA. */
export type StayCategory =
  | "hotel"
  | "hostel"
  | "guesthouse"
  | "apartment"
  | "camping"
  | "ecolodge"
  | "room";

export const stayCategories: { id: StayCategory | "all"; label: string }[] = [
  { id: "all", label: "كل الإقامات" },
  { id: "hotel", label: "فندق" },
  { id: "hostel", label: "بيت شباب" },
  { id: "guesthouse", label: "دار ضيافة" },
  { id: "apartment", label: "شقة" },
  { id: "camping", label: "تخييم" },
  { id: "ecolodge", label: "نزل بيئي" },
  { id: "room", label: "غرفة" },
];

export const stayCategoryLabel = (id: StayCategory) =>
  stayCategories.find((c) => c.id === id)?.label ?? id;

export type Stay = {
  id: string;
  name: string;
  category: StayCategory;
  wilayaId: string;
  wilaya: string;
  /** Regional architectural style / hospitality character. */
  architecture: string;
  image: string;
  imageAlt: string;
  imageCredit: string;
  pricePerNight: number;
  /** Local accommodation tax applied per stay, as a fraction of the room total. */
  taxRate: number;
  amenities: string[];
  area: string;
  verified: boolean;
  freeCancellation?: boolean;
};

const from = (key: keyof typeof realImages) => {
  const i = realImages[key];
  return { image: i.src, imageAlt: i.alt, imageCredit: i.credit };
};

export const stays: Stay[] = [
  {
    id: "st-alger-casbah-guesthouse",
    name: "دار ضيافة القصبة",
    category: "guesthouse",
    wilayaId: "alger",
    wilaya: "الجزائر",
    architecture: "دار عثمانية تقليدية بوسط الدار (وسط الدار) وأقواس خشبية",
    ...from("alger"),
    pricePerNight: 7500,
    taxRate: 0.05,
    amenities: ["إفطار جزائري", "سطح بإطلالة على الميناء", "واي فاي"],
    area: "القصبة السفلى",
    verified: true,
    freeCancellation: true,
  },
  {
    id: "st-alger-bay-apartment",
    name: "شقة خليج الجزائر",
    category: "apartment",
    wilayaId: "alger",
    wilaya: "الجزائر",
    architecture: "عمارة كولونيالية مُرمّمة بشرفات مطلّة على الواجهة البحرية",
    ...from("algerBasilica"),
    pricePerNight: 9200,
    taxRate: 0.05,
    amenities: ["مطبخ مجهّز", "غسالة", "مصعد"],
    area: "باب الواد",
    verified: true,
  },
  {
    id: "st-alger-hostel",
    name: "بيت شباب الميناء",
    category: "hostel",
    wilayaId: "alger",
    wilaya: "الجزائر",
    architecture: "بناية وسط المدينة بأسقف عالية وأرضيات بلاط أندلسي",
    ...from("alger"),
    pricePerNight: 2600,
    taxRate: 0.03,
    amenities: ["أسرّة مشتركة", "مطبخ مشترك", "واي فاي"],
    area: "وسط المدينة",
    verified: false,
  },
  {
    id: "st-ghardaia-mzab",
    name: "دار المزاب التقليدية",
    category: "guesthouse",
    wilayaId: "ghardaia",
    wilaya: "غرداية",
    architecture: "بيت مزابي بجدران طينية سميكة وفتحات تهوية وسطوح متدرجة",
    ...from("ghardaia"),
    pricePerNight: 6400,
    taxRate: 0.04,
    amenities: ["ضيافة عائلية", "جولة في القصر العتيق", "شاي وتمر"],
    area: "قصر بني يزقن",
    verified: true,
    freeCancellation: true,
  },
  {
    id: "st-ghardaia-room",
    name: "غرفة بقصر غرداية",
    category: "room",
    wilayaId: "ghardaia",
    wilaya: "غرداية",
    architecture: "غرفة داخل دار مزابية بقبو مقوّس ونوافذ صغيرة تحفظ البرودة",
    ...from("ghardaia"),
    pricePerNight: 3200,
    taxRate: 0.03,
    amenities: ["تكييف", "إفطار", "قرب السوق"],
    area: "السوق القديم",
    verified: false,
  },
  {
    id: "st-tassili-camp",
    name: "مخيم تادرارت الصحراوي",
    category: "camping",
    wilayaId: "djanet",
    wilaya: "جانت",
    architecture: "خيام طوارقية من وبر الإبل منصوبة بين الكثبان والهضاب الصخرية",
    ...from("tassili"),
    pricePerNight: 8800,
    taxRate: 0.04,
    amenities: ["مرشد محلي", "عشاء تقليدي", "مبيت تحت النجوم"],
    area: "تادرارت",
    verified: true,
  },
  {
    id: "st-tamanrasset-ecolodge",
    name: "نزل الهقار البيئي",
    category: "ecolodge",
    wilayaId: "tamanrasset",
    wilaya: "تمنراست",
    architecture: "نزل حجري صحراوي بطاقة شمسية وتصميم منخفض الأثر البيئي",
    ...from("tamanrasset"),
    pricePerNight: 11000,
    taxRate: 0.04,
    amenities: ["طاقة شمسية", "رحلة أسكرام", "مطبخ محلي"],
    area: "طريق أسكرام",
    verified: true,
    freeCancellation: true,
  },
  {
    id: "st-taghit-guesthouse",
    name: "دار ضيافة تاغيت",
    category: "guesthouse",
    wilayaId: "biskra",
    wilaya: "بشار — تاغيت",
    architecture: "بناء طيني صحراوي (طوب لبن) بفناء داخلي وسعف النخيل",
    ...from("taghit"),
    pricePerNight: 5400,
    taxRate: 0.03,
    amenities: ["إطلالة على العرق الغربي", "إفطار", "جولة كثبان"],
    area: "قصر تاغيت",
    verified: true,
  },
  {
    id: "st-biskra-hotel",
    name: "فندق واحة بسكرة",
    category: "hotel",
    wilayaId: "biskra",
    wilaya: "بسكرة",
    architecture: "فندق واحة بأقواس وحدائق نخيل ومسابح مظللة",
    ...from("biskra"),
    pricePerNight: 9800,
    taxRate: 0.05,
    amenities: ["مسبح", "إفطار", "موقف سيارات"],
    area: "طريق الواحات",
    verified: true,
  },
  {
    id: "st-bejaia-coastal",
    name: "منتجع كاب كربون",
    category: "hotel",
    wilayaId: "bejaia",
    wilaya: "بجاية",
    architecture: "منتجع ساحلي متوسطي بشرفات بيضاء مطلّة على الجرف",
    ...from("bejaia"),
    pricePerNight: 13500,
    taxRate: 0.05,
    amenities: ["إطلالة بحرية", "مسبح", "مطعم سمك"],
    area: "كاب كربون",
    verified: true,
    freeCancellation: true,
  },
  {
    id: "st-jijel-apartment",
    name: "شقة الكورنيش الجيجلي",
    category: "apartment",
    wilayaId: "jijel",
    wilaya: "جيجل",
    architecture: "شقة ساحلية حديثة بواجهة زجاجية على الكورنيش",
    ...from("jijel"),
    pricePerNight: 7000,
    taxRate: 0.04,
    amenities: ["مطبخ", "شرفة", "قرب المغارات"],
    area: "الكورنيش",
    verified: false,
  },
  {
    id: "st-skikda-room",
    name: "غرفة ستورا البحرية",
    category: "room",
    wilayaId: "skikda",
    wilaya: "سكيكدة",
    architecture: "منزل ساحلي بقرميد أحمر ونوافذ خشبية على خليج ستورا",
    ...from("skikda"),
    pricePerNight: 3600,
    taxRate: 0.03,
    amenities: ["إفطار", "واي فاي", "قرب الشاطئ"],
    area: "ستورا",
    verified: false,
  },
  {
    id: "st-constantine-hotel",
    name: "فندق الجسور المعلقة",
    category: "hotel",
    wilayaId: "constantine",
    wilaya: "قسنطينة",
    architecture: "فندق صخري مطل على وادي الرمال بديكور قسنطيني منقوش",
    ...from("constantine"),
    pricePerNight: 15200,
    taxRate: 0.05,
    amenities: ["إطلالة على الوادي", "سبا", "إفطار"],
    area: "سيدي مسيد",
    verified: true,
  },
  {
    id: "st-setif-hostel",
    name: "بيت شباب عين الفوارة",
    category: "hostel",
    wilayaId: "setif",
    wilaya: "سطيف",
    architecture: "بناية هضاب عليا بحجارة محلية وأفنية داخلية",
    ...from("setif"),
    pricePerNight: 2400,
    taxRate: 0.03,
    amenities: ["أسرّة مشتركة", "مطبخ", "قرب المحطة"],
    area: "وسط المدينة",
    verified: false,
  },
  {
    id: "st-djemila-ecolodge",
    name: "نزل جميلة البيئي",
    category: "ecolodge",
    wilayaId: "setif",
    wilaya: "سطيف — جميلة",
    architecture: "نزل ريفي حجري قرب الموقع الأثري بمواد بناء محلية",
    ...from("djemila"),
    pricePerNight: 6100,
    taxRate: 0.04,
    amenities: ["مرشد آثار", "إفطار مزرعة", "مسارات مشي"],
    area: "قرب آثار جميلة",
    verified: true,
  },
  {
    id: "st-tlemcen-guesthouse",
    name: "دار ضيافة تلمسان الأندلسية",
    category: "guesthouse",
    wilayaId: "tlemcen",
    wilaya: "تلمسان",
    architecture: "دار أندلسية بزليج وأقواس مفصصة ونافورة وسط الفناء",
    ...from("tlemcen"),
    pricePerNight: 7800,
    taxRate: 0.05,
    amenities: ["فناء أندلسي", "إفطار", "قرب المنصورة"],
    area: "المدينة العتيقة",
    verified: true,
    freeCancellation: true,
  },
  {
    id: "st-oran-hotel",
    name: "فندق سانتا كروز",
    category: "hotel",
    wilayaId: "oran",
    wilaya: "وهران",
    architecture: "فندق واجهة بحرية بطراز وهراني كولونيالي مُرمّم",
    ...from("oran"),
    pricePerNight: 14200,
    taxRate: 0.05,
    amenities: ["إطلالة على الميناء", "مطعم", "صالة رياضية"],
    area: "الواجهة البحرية",
    verified: true,
  },
  {
    id: "st-tipaza-camping",
    name: "تخييم شنوة البحري",
    category: "camping",
    wilayaId: "tipaza",
    wilaya: "تيبازة",
    architecture: "موقع تخييم بين غابة الصنوبر والخليج قرب الآثار الرومانية",
    ...from("tipaza"),
    pricePerNight: 2200,
    taxRate: 0.03,
    amenities: ["مواقع خيام", "مرافق مشتركة", "قرب الموقع الأثري"],
    area: "جبل شنوة",
    verified: false,
  },
  {
    id: "st-tizi-ecolodge",
    name: "نزل جرجرة البيئي",
    category: "ecolodge",
    wilayaId: "tizi-ouzou",
    wilaya: "تيزي وزو",
    architecture: "بيت قبائلي حجري بسقف قرميدي وموقد تقليدي",
    ...from("tiziOuzou"),
    pricePerNight: 5600,
    taxRate: 0.04,
    amenities: ["مأكولات قبائلية", "مسارات جبلية", "موقد حطب"],
    area: "أعالي جرجرة",
    verified: true,
  },
  {
    id: "st-batna-ghoufi",
    name: "دار ضيافة بلكونات غوفي",
    category: "guesthouse",
    wilayaId: "batna",
    wilaya: "باتنة",
    architecture: "بيوت أوراسية محفورة في المنحدرات الصخرية فوق الوادي",
    ...from("batna"),
    pricePerNight: 5200,
    taxRate: 0.04,
    amenities: ["إطلالة على الوادي", "إفطار أوراسي", "جولة تيمقاد"],
    area: "غوفي",
    verified: true,
  },
  {
    id: "st-annaba-apartment",
    name: "شقة كورنيش عنابة",
    category: "apartment",
    wilayaId: "annaba",
    wilaya: "عنابة",
    architecture: "شقة ساحلية بشرفة واسعة على خليج عنابة",
    ...from("annaba"),
    pricePerNight: 6900,
    taxRate: 0.04,
    amenities: ["مطبخ", "شرفة بحرية", "موقف"],
    area: "الكورنيش",
    verified: false,
  },
  {
    id: "st-mostaganem-room",
    name: "غرفة صالامندر",
    category: "room",
    wilayaId: "mostaganem",
    wilaya: "مستغانم",
    architecture: "منزل ساحلي أبيض بأقواس زرقاء على الطراز الغربي الجزائري",
    ...from("mostaganem"),
    pricePerNight: 3400,
    taxRate: 0.03,
    amenities: ["قرب الشاطئ", "إفطار", "واي فاي"],
    area: "صالامندر",
    verified: false,
  },
];

export const getStay = (id: string) => stays.find((s) => s.id === id);

/** Transparent price breakdown: (room price × nights) + taxes = total. */
export function priceBreakdown(pricePerNight: number, nights: number, taxRate: number) {
  const rooms = pricePerNight * Math.max(1, nights);
  const taxes = Math.round(rooms * taxRate);
  return { rooms, taxes, total: rooms + taxes };
}
