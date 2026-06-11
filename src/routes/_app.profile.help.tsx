import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, HelpCircle, Mail, MessageCircle, Phone } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/_app/profile/help")({
  component: HelpPage,
});

const faqs = [
  { q: "كيف أحجز فندقًا؟", a: "ادخل إلى صفحة الفنادق، اختر الإقامة المناسبة ثم اضغط على زر الحجز وأكمل خطوات الدفع." },
  { q: "هل يمكنني إلغاء الحجز؟", a: "نعم، يمكنك إلغاء الحجز من صفحة حجوزاتي قبل 24 ساعة من تاريخ الوصول." },
  { q: "كيف أغيّر اللغة؟", a: "اذهب إلى حسابي ← اللغة، واختر اللغة المناسبة لك." },
];

function HelpPage() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-primary mb-4">
        <ArrowRight className="h-4 w-4" /> {t("back")}
      </Link>
      <h1 className="text-2xl font-black mb-4 flex items-center gap-2"><HelpCircle className="h-6 w-6 text-primary" /> {t("help")}</h1>

      <div className="grid grid-cols-3 gap-2 mb-5">
        <a href="mailto:support@rihlati.app" className="bg-card rounded-2xl p-4 text-center shadow-soft">
          <Mail className="h-5 w-5 mx-auto text-primary mb-1" /><p className="text-xs font-semibold">البريد</p>
        </a>
        <a href="tel:+213000000000" className="bg-card rounded-2xl p-4 text-center shadow-soft">
          <Phone className="h-5 w-5 mx-auto text-primary mb-1" /><p className="text-xs font-semibold">الهاتف</p>
        </a>
        <a href="#" className="bg-card rounded-2xl p-4 text-center shadow-soft">
          <MessageCircle className="h-5 w-5 mx-auto text-primary mb-1" /><p className="text-xs font-semibold">دردشة</p>
        </a>
      </div>

      <div className="bg-card rounded-2xl shadow-soft divide-y divide-border overflow-hidden">
        {faqs.map((f, i) => (
          <details key={i} className="p-4 group">
            <summary className="cursor-pointer font-semibold text-sm">{f.q}</summary>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
