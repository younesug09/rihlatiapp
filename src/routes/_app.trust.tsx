import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Lock, FileText, BadgeCheck, XCircle, Mail, Phone } from "lucide-react";
import { DemoNotice } from "@/components/DemoBadge";

export const Route = createFileRoute("/_app/trust")({
  head: () => ({
    meta: [
      { title: "مركز الثقة — رحلتي RIHLA" },
      { name: "description", content: "كيف نتحقق من المعلومات في رحلتي، وسياسات الخصوصية والحجز والإلغاء وحماية البيانات." },
      { property: "og:title", content: "مركز الثقة — رحلتي RIHLA" },
      { property: "og:description", content: "شفافية كاملة حول التحقق من المعلومات وحماية بيانات مستخدمي منصة رحلتي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrustCenter,
});

const sections = [
  {
    icon: BadgeCheck,
    title: "كيف نتحقق من المعلومات",
    body: "كل وجهة أو إقامة تُعرض في رحلتي تمرّ بثلاث مراحل: جمع المعلومة من مصدرها، مراجعتها تحريريًا، ثم تحديثها دوريًا. أي معلومة لم تُراجَع بعد تُعرَض بوسم «معلومة قيد التحقق».",
  },
  {
    icon: ShieldCheck,
    title: "شارة RIHLA VERIFIED",
    body: "تُمنح فقط للإقامات والمحتوى الذي تم التأكد من صحة بياناته الأساسية (الموقع، نوع الإقامة، وسيلة الاتصال). غياب الشارة لا يعني عدم الجودة، بل يعني أن التحقق لم يكتمل بعد.",
  },
  {
    icon: Lock,
    title: "حماية البيانات",
    body: "يتم إنشاء الحسابات وتخزين بياناتها عبر خدمة استضافة مؤمّنة مع تشفير الاتصال. لا نبيع بياناتك ولا نشاركها مع أطراف إعلانية. يمكنك طلب حذف حسابك في أي وقت.",
  },
  {
    icon: FileText,
    title: "سياسة الحجز",
    body: "الحجز في نسخة العرض الحالية تسجيل طلب فقط، ولا يُنشئ التزامًا تعاقديًا مع أي فندق أو مزوّد خدمة حقيقي. الدفع الإلكتروني غير مفعّل (قريبًا).",
  },
  {
    icon: XCircle,
    title: "سياسة الإلغاء",
    body: "يمكنك إلغاء أي طلب حجز من «حجوزاتي» دون أي رسوم، ما دام النظام غير مرتبط بمزوّد دفع حقيقي.",
  },
];

function TrustCenter() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 animate-fade-in">
      <p className="text-xs font-bold tracking-widest text-primary uppercase">RIHLA TRUST</p>
      <h1 className="text-3xl font-bold mt-1">مركز الثقة</h1>
      <p className="text-muted-foreground mt-2 leading-relaxed">
        الشفافية شرط أساسي في الاتصال السياحي. هنا نشرح بوضوح ما هو حقيقي في المنصة وما هو تجريبي.
      </p>

      <div className="mt-5">
        <DemoNotice />
      </div>

      <div className="mt-6 space-y-3">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <article key={s.title} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <h2 className="font-bold flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {s.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.body}</p>
            </article>
          );
        })}
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-4">
        <h2 className="font-bold">ما لا نَعِد به</h2>
        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground list-disc ps-5">
          <li>لا نقدّم تأمينًا ماليًا ولا تعويضًا قانونيًا على الحجوزات.</li>
          <li>لا نعرض تقييمات مُختلقة؛ التقييم يُقبل فقط ممن أتمّ إقامة مسجّلة.</li>
          <li>لا ننشر أرقامًا أو إحصائيات دون مصدر.</li>
        </ul>
      </section>

      <section className="mt-6 rounded-2xl p-5 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
        <h2 className="font-bold text-lg">التواصل</h2>
        <p className="text-sm text-white/85 mt-1">لأي بلاغ عن معلومة خاطئة أو طلب حذف بيانات.</p>
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <span className="inline-flex items-center gap-1 bg-white/15 rounded-xl px-3 py-1.5"><Mail className="h-4 w-4" /> contact@rihlati.app</span>
          <span className="inline-flex items-center gap-1 bg-white/15 rounded-xl px-3 py-1.5"><Phone className="h-4 w-4" /> عبر نموذج المساعدة</span>
        </div>
        <Link to="/profile/help" className="mt-4 inline-block rounded-xl bg-card text-primary px-4 py-2 text-sm font-bold">
          مركز المساعدة
        </Link>
      </section>
    </div>
  );
}
