import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Eye, Sparkles, ScrollText, BadgeCheck, Heart } from "lucide-react";
import { RihlatyLogo } from "@/components/RihlatyLogo";

export const Route = createFileRoute("/_app/about")({
  head: () => ({
    meta: [
      { title: "من نحن — رحلتي RIHLA" },
      { name: "description", content: "رسالة رحلتي ورؤيتها وميثاقها التحريري ومنهجية التحقق من المعلومات السياحية الجزائرية." },
      { property: "og:title", content: "من نحن — رحلتي RIHLA" },
      { property: "og:description", content: "منصة اتصال سياحي رقمية جزائرية: الرسالة، الرؤية، الميثاق التحريري ومنهجية التحقق." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const blocks = [
  {
    icon: Compass,
    title: "رسالتنا",
    body: "أن نجعل الوجهة الجزائرية مرئية ومفهومة ومغرية، عبر محتوى دقيق وتجربة رقمية بمعايير عالمية.",
  },
  {
    icon: Eye,
    title: "رؤيتنا",
    body: "منصة مرجعية تجمع الاكتشاف والإعلام والمجتمع وتخطيط الرحلات في مكان واحد، يثق بها المسافر قبل أن يحجز.",
  },
  {
    icon: Sparkles,
    title: "لماذا رحلتي؟",
    body: "لأن السياحة الجزائرية تعاني من نقص المحتوى المنظّم لا من نقص الجمال. نحن نبني طبقة الاتصال الغائبة.",
  },
  {
    icon: BadgeCheck,
    title: "منهجية التحقق",
    body: "جمع المعلومة من مصدرها، مراجعة تحريرية، وسم واضح لما هو تجريبي أو قيد التحقق، ثم تحديث دوري.",
  },
];

const charter = [
  "الدقة قبل السرعة",
  "الموضوعية وعدم الترويج المضلل",
  "احترام خصوصية الأشخاص والأماكن",
  "ذكر المصادر عند النشر",
  "تصحيح الخطأ علنًا",
  "تحديث المعلومات باستمرار",
];

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <RihlatyLogo className="h-14 w-14 object-contain" />
        <div>
          <h1 className="text-2xl font-bold">رحلتي · RIHLA</h1>
          <p className="text-sm text-muted-foreground">اكتشف. عِش. شارك.</p>
        </div>
      </div>

      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        رحلتي منصة اتصال سياحي رقمية جزائرية تجمع بين الاكتشاف، الإعلام، المجتمع، وتخطيط الرحلات — وليست مجرد موقع حجز.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {blocks.map((b) => {
          const Icon = b.icon;
          return (
            <article key={b.title} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <h2 className="font-bold flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {b.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{b.body}</p>
            </article>
          );
        })}
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-4">
        <h2 className="font-bold flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-primary" aria-hidden="true" /> ميثاقنا التحريري
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
          {charter.map((c) => (
            <li key={c} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-4">
        <h2 className="font-bold flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" aria-hidden="true" /> قيمنا
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          الصدق مع المستخدم، احترام الهوية الجزائرية بلا مبالغة، البساطة في التصميم، وإتاحة المنصة للجميع.
        </p>
      </section>

      <Link
        to="/trust"
        className="mt-6 inline-block rounded-2xl px-5 py-3 text-sm font-bold text-primary-foreground shadow-card"
        style={{ background: "var(--gradient-primary)" }}
      >
        زيارة مركز الثقة
      </Link>
    </div>
  );
}
