import { useState } from "react";
import { BadgeCheck, Eye, HeartHandshake, Lock, LifeBuoy, ReceiptText, X } from "lucide-react";

const criteria = [
  {
    icon: BadgeCheck,
    title: "هوية مُتحقّق منها",
    body: "اسم صاحب الإقامة أو الوكالة ووثائق النشاط تمت مراجعتها من فريق رحلتي قبل النشر.",
  },
  {
    icon: Eye,
    title: "معلومات مطابقة للواقع",
    body: "الصور والموقع والمرافق تُقارَن بمصادر متعدّدة، وأي وصف غير دقيق يُصحَّح أو يُسحَب.",
  },
  {
    icon: ReceiptText,
    title: "سعر معروض بوضوح",
    body: "سعر الليلة والرسوم تظهر قبل التأكيد، دون رسوم مفاجئة عند الوصول.",
  },
  {
    icon: HeartHandshake,
    title: "التزام بالاستقبال",
    body: "الإقامة تلتزم باستقبال الحجوزات المؤكّدة عبر رحلتي وبسياسة إلغاء معلنة.",
  },
];

export function VerifiedBadge({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={`inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground ${className}`}
      >
        <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
        RIHLA VERIFIED
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/50 p-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
          }}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="معايير توثيق رحلتي"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-full max-w-md rounded-3xl bg-card p-5 shadow-card animate-scale-in text-right"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-lg font-black">
                  <BadgeCheck className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  ماذا يعني «موثّق من رحلتي»؟
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  توثيق داخلي من المنصة، وليس اعتمادًا رسميًا من أي جهة حكومية.
                </p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="إغلاق" className="shrink-0 text-muted-foreground">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <ul className="mt-4 space-y-3">
              {criteria.map((c) => (
                <li key={c.title} className="flex gap-3">
                  <c.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-bold">{c.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-4 rounded-2xl bg-secondary p-3 text-xs leading-relaxed text-secondary-foreground">
              إذا وجدت اختلافًا بين ما هو معروض وما وجدته على أرض الواقع، أبلغنا عبر صفحة المساعدة وستتم مراجعة التوثيق.
            </p>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground"
            >
              فهمت
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const guarantees = [
  { icon: Eye, title: "دقة المعلومات", body: "كل وصف وصورة يخضع للمراجعة، والمحتوى غير المؤكّد يُوسَم بوضوح." },
  { icon: ReceiptText, title: "شفافية السعر", body: "سعر الليلة + الرسوم = الإجمالي. لا رسوم خفية ولا مفاجآت." },
  { icon: Lock, title: "خصوصية بياناتك", body: "بياناتك تُستعمل لإتمام الحجز فقط ولا تُشارك مع أطراف إعلانية." },
  { icon: LifeBuoy, title: "دعم قبل وبعد الحجز", body: "فريق الدعم متاح لمرافقتك من الاستفسار حتى نهاية الإقامة." },
];

export function TrustGuarantees() {
  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <h2 className="text-lg font-black">ضمانات رحلتي</h2>
      <p className="mt-1 text-sm text-muted-foreground">أربعة التزامات نطبّقها على كل إقامة معروضة.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {guarantees.map((g) => (
          <div key={g.title} className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary">
              <g.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold">{g.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{g.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
