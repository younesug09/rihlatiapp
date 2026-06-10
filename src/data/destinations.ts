import algiers from "@/assets/dest-algiers.jpg";
import timgad from "@/assets/dest-timgad.jpg";
import constantine from "@/assets/dest-constantine.jpg";
import oran from "@/assets/dest-oran.jpg";
import sahara from "@/assets/hero-sahara.jpg";
import santorini from "@/assets/dest-santorini.jpg";
import istanbul from "@/assets/dest-istanbul.jpg";
import dubai from "@/assets/dest-dubai.jpg";

export type Destination = {
  id: string;
  name: string;
  country: string;
  region: "algeria" | "world";
  category: "beach" | "desert" | "city" | "historic" | "mountain";
  image: string;
  rating: number;
  reviews: number;
  price: number;
  description: string;
  highlights: string[];
};

export const destinations: Destination[] = [
  {
    id: "algiers",
    name: "الجزائر العاصمة",
    country: "الجزائر",
    region: "algeria",
    category: "city",
    image: algiers,
    rating: 4.8,
    reviews: 1240,
    price: 12000,
    description: "العاصمة البيضاء، جوهرة شمال إفريقيا على ضفاف البحر الأبيض المتوسط. تجمع بين عبق التاريخ في القصبة العتيقة وحداثة الواجهة البحرية.",
    highlights: ["القصبة العتيقة", "مقام الشهيد", "حديقة التجارب", "جامع كتشاوة"],
  },
  {
    id: "tassili",
    name: "صحراء الطاسيلي",
    country: "الجزائر",
    region: "algeria",
    category: "desert",
    image: sahara,
    rating: 4.9,
    reviews: 890,
    price: 25000,
    description: "متحف مفتوح في قلب الصحراء الكبرى، حيث الكثبان الذهبية والنقوش الصخرية التي يعود تاريخها لآلاف السنين.",
    highlights: ["جانت", "النقوش الصخرية", "كثبان تادرارت", "ليالي تحت النجوم"],
  },
  {
    id: "timgad",
    name: "مدينة تيمقاد الأثرية",
    country: "الجزائر",
    region: "algeria",
    category: "historic",
    image: timgad,
    rating: 4.7,
    reviews: 560,
    price: 8000,
    description: "بومبي الجزائر، مدينة رومانية مصنفة ضمن قائمة التراث العالمي لليونسكو، تحكي قرونًا من الحضارة.",
    highlights: ["قوس النصر", "المسرح الروماني", "المعبد الكابيتولي", "متحف تيمقاد"],
  },
  {
    id: "constantine",
    name: "قسنطينة",
    country: "الجزائر",
    region: "algeria",
    category: "city",
    image: constantine,
    rating: 4.6,
    reviews: 980,
    price: 10000,
    description: "مدينة الجسور المعلقة، تتربع على صخرة عملاقة وتُعدّ عاصمة الثقافة العربية الخالدة.",
    highlights: ["جسر سيدي مسيد", "قصر أحمد باي", "وادي الرمال", "جامع الأمير عبد القادر"],
  },
  {
    id: "oran",
    name: "وهران",
    country: "الجزائر",
    region: "algeria",
    category: "beach",
    image: oran,
    rating: 4.7,
    reviews: 1100,
    price: 11000,
    description: "الباهية، عروس الغرب الجزائري، حيث تلتقي الموسيقى الراي بزرقة المتوسط وحصن سانتا كروز.",
    highlights: ["حصن سانتا كروز", "كنيسة سانتا كروز", "ميناء وهران", "شاطئ عين الترك"],
  },
  {
    id: "bejaia",
    name: "بجاية",
    country: "الجزائر",
    region: "algeria",
    category: "beach",
    image: "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?auto=format&fit=crop&w=1200&q=70",
    rating: 4.8,
    reviews: 920,
    price: 9500,
    description: "لؤلؤة الساحل القبائلي، تجمع بين خضرة الجبال وزرقة البحر، وتضم شواطئ تيشي ورأس كربون الخلابة.",
    highlights: ["كاب كربون", "شاطئ تيشي", "قلعة موسى", "متحف بجاية"],
  },
  {
    id: "setif",
    name: "سطيف",
    country: "الجزائر",
    region: "algeria",
    category: "historic",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=70",
    rating: 4.5,
    reviews: 640,
    price: 7000,
    description: "عاصمة الهضاب العليا، مدينة عين الفوارة وآثار جميلة الرومانية المصنفة عالمياً.",
    highlights: ["عين الفوارة", "آثار جميلة", "متحف سطيف", "ساحة 8 ماي"],
  },
  {
    id: "jijel",
    name: "جيجل",
    country: "الجزائر",
    region: "algeria",
    category: "beach",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=70",
    rating: 4.9,
    reviews: 1340,
    price: 8500,
    description: "ساحل الكورنيش الخلاب بشواطئه الفيروزية ومغاراته البحرية ومحميات القل الطبيعية.",
    highlights: ["المغارات العجيبة", "كورنيش جيجل", "رأس عفية", "شاطئ الرابطة"],
  },
  {
    id: "skikda",
    name: "سكيكدة",
    country: "الجزائر",
    region: "algeria",
    category: "beach",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=70",
    rating: 4.6,
    reviews: 780,
    price: 8000,
    description: "مدينة الفل والياسمين، تطل على البحر بكورنيشها الجميل وشواطئها الذهبية.",
    highlights: ["كورنيش سكيكدة", "ستورا", "المسرح الروماني", "رأس بوقاروني"],
  },
  {
    id: "annaba",
    name: "عنابة",
    country: "الجزائر",
    region: "algeria",
    category: "city",
    image: "https://images.unsplash.com/photo-1601751848169-99c1bcc1d4e8?auto=format&fit=crop&w=1200&q=70",
    rating: 4.7,
    reviews: 1020,
    price: 9000,
    description: "بونة العتيقة، مدينة القديس أوغسطين، حيث تلتقي الكنائس العتيقة بأجمل شواطئ الشرق.",
    highlights: ["كاتدرائية القديس أوغسطين", "هيبون الأثرية", "كورنيش عنابة", "شاطئ ريزي عمر"],
  },
  {
    id: "santorini",
    name: "سانتوريني",
    country: "اليونان",
    region: "world",
    category: "beach",
    image: santorini,
    rating: 4.9,
    reviews: 5240,
    price: 95000,
    description: "جزيرة الأحلام بقبابها الزرقاء وبيوتها البيضاء المطلة على بحر إيجة، وجهة لا تُنسى للمسافرين.",
    highlights: ["قرية أويا", "غروب الشمس", "البحر الكالديرا", "الكنائس الزرقاء"],
  },
  {
    id: "istanbul",
    name: "إسطنبول",
    country: "تركيا",
    region: "world",
    category: "historic",
    image: istanbul,
    rating: 4.8,
    reviews: 8930,
    price: 55000,
    description: "ملتقى الشرق والغرب، مدينة المساجد العثمانية والبازارات الشرقية والمضائق الساحرة.",
    highlights: ["آيا صوفيا", "الجامع الأزرق", "البازار الكبير", "مضيق البوسفور"],
  },
  {
    id: "dubai",
    name: "دبي",
    country: "الإمارات",
    region: "world",
    category: "city",
    image: dubai,
    rating: 4.8,
    reviews: 12400,
    price: 80000,
    description: "مدينة المستقبل والعجائب المعمارية، حيث ناطحات السحاب تعانق السماء وتلتقي الصحراء بالخليج.",
    highlights: ["برج خليفة", "نخلة جميرا", "دبي مول", "صحراء دبي"],
  },
];

export const categories = [
  { id: "all", label: "الكل", icon: "🌍" },
  { id: "beach", label: "شواطئ", icon: "🏖️" },
  { id: "desert", label: "صحراء", icon: "🏜️" },
  { id: "city", label: "مدن", icon: "🏙️" },
  { id: "historic", label: "آثار", icon: "🏛️" },
  { id: "mountain", label: "جبال", icon: "⛰️" },
] as const;

export const news = [
  {
    id: "1",
    title: "الجزائر تطلق حملة ترويجية كبرى لاستقطاب السياح",
    excerpt: "أعلنت وزارة السياحة عن إطلاق حملة عالمية لإبراز المعالم السياحية الجزائرية وتعزيز قطاع السياحة الداخلية.",
    image: algiers,
    date: "منذ يومين",
    category: "أخبار محلية",
  },
  {
    id: "2",
    title: "افتتاح موسم السياحة الصحراوية في تمنراست",
    excerpt: "انطلق رسميًا الموسم السياحي الصحراوي بمشاركة مئات السياح من مختلف دول العالم لاكتشاف عجائب الطاسيلي.",
    image: sahara,
    date: "منذ 5 أيام",
    category: "الطاسيلي",
  },
  {
    id: "3",
    title: "قسنطينة تستضيف المهرجان الدولي للجاز",
    excerpt: "مدينة الجسور المعلقة تستعد لاستقبال عشاق الموسيقى في نسخة استثنائية من المهرجان الدولي للجاز.",
    image: constantine,
    date: "منذ أسبوع",
    category: "ثقافة",
  },
];
