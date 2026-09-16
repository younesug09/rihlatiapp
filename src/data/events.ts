import { realImages } from "@/data/images";

export type RihlaEvent = {
  id: string;
  title: string;
  summary: string;
  wilaya: string;
  place: string;
  /** ISO date (start) */
  start: string;
  /** ISO date (end) */
  end: string;
  category: "ثقافة" | "تراث" | "طبيعة" | "رياضة" | "معرض";
  image: string;
  imageAlt: string;
};

/** Demo programme — dates are illustrative and relative to today. */
const day = (offset: number) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
};

export const events: RihlaEvent[] = [
  {
    id: "casbah-walk",
    title: "جولة مشي في القصبة العتيقة",
    summary: "جولة ثقافية مصحوبة بمرافق محلي بين أزقة القصبة وبيوتها العثمانية.",
    wilaya: "الجزائر",
    place: "القصبة، الجزائر العاصمة",
    start: day(0),
    end: day(0),
    category: "تراث",
    image: realImages.alger.src,
    imageAlt: realImages.alger.alt,
  },
  {
    id: "djemila-open-day",
    title: "يوم مفتوح بموقع جميلة الأثري",
    summary: "زيارات موجّهة داخل الموقع الروماني مع شروحات حول الفسيفساء.",
    wilaya: "سطيف",
    place: "موقع جميلة، سطيف",
    start: day(2),
    end: day(2),
    category: "تراث",
    image: realImages.djemila.src,
    imageAlt: realImages.djemila.alt,
  },
  {
    id: "bejaia-nature-hike",
    title: "مسير جبلي في منتزه قورايا",
    summary: "مسير بمستوى متوسط نحو رأس كربون مع إطلالة على خليج بجاية.",
    wilaya: "بجاية",
    place: "منتزه قورايا الوطني، بجاية",
    start: day(5),
    end: day(5),
    category: "طبيعة",
    image: realImages.bejaia.src,
    imageAlt: realImages.bejaia.alt,
  },
  {
    id: "ghardaia-crafts",
    title: "معرض الحرف التقليدية بوادي ميزاب",
    summary: "عرض للنسيج والخزف والصناعات المحلية داخل قصور ميزاب.",
    wilaya: "غرداية",
    place: "غرداية",
    start: day(12),
    end: day(15),
    category: "معرض",
    image: realImages.ghardaia.src,
    imageAlt: realImages.ghardaia.alt,
  },
  {
    id: "tassili-season",
    title: "افتتاح الموسم الصحراوي بالطاسيلي",
    summary: "انطلاق برامج الرحلات المنظّمة نحو الطاسيلي ناجر وجانت.",
    wilaya: "جانت",
    place: "جانت",
    start: day(20),
    end: day(24),
    category: "طبيعة",
    image: realImages.tassili.src,
    imageAlt: realImages.tassili.alt,
  },
  {
    id: "oran-music-nights",
    title: "ليالي الموسيقى بوهران",
    summary: "سهرات موسيقية محلية بالقرب من الواجهة البحرية.",
    wilaya: "وهران",
    place: "وهران",
    start: day(9),
    end: day(10),
    category: "ثقافة",
    image: realImages.oran.src,
    imageAlt: realImages.oran.alt,
  },
  {
    id: "jijel-coast-cleanup",
    title: "حملة تنظيف الكورنيش الجيجلي",
    summary: "مبادرة بيئية تطوعية على طول الكورنيش مع جمعيات محلية.",
    wilaya: "جيجل",
    place: "الكورنيش الجيجلي",
    start: day(4),
    end: day(4),
    category: "طبيعة",
    image: realImages.jijel.src,
    imageAlt: realImages.jijel.alt,
  },
  {
    id: "constantine-bridges-run",
    title: "سباق الجسور المعلقة",
    summary: "سباق على الطريق يمرّ عبر أشهر جسور مدينة قسنطينة.",
    wilaya: "قسنطينة",
    place: "قسنطينة",
    start: day(27),
    end: day(27),
    category: "رياضة",
    image: realImages.constantine.src,
    imageAlt: realImages.constantine.alt,
  },
];

/** Builds a downloadable .ics calendar entry for an event. */
export function buildIcs(e: RihlaEvent) {
  const stamp = (d: string) => d.replace(/-/g, "");
  const endExclusive = (() => {
    const d = new Date(e.end);
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
  })();
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RIHLA//Events//AR",
    "BEGIN:VEVENT",
    `UID:${e.id}@rihla`,
    `DTSTART;VALUE=DATE:${stamp(e.start)}`,
    `DTEND;VALUE=DATE:${endExclusive}`,
    `SUMMARY:${e.title}`,
    `DESCRIPTION:${e.summary}`,
    `LOCATION:${e.place}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
