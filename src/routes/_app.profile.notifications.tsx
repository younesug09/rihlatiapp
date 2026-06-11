import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/_app/profile/notifications")({
  component: NotificationsPage,
});

const items = [
  { title: "عرض خاص على وهران", body: "خصم 20% على الرحلات هذا الأسبوع", time: "قبل ساعة" },
  { title: "موسم الصحراء انطلق!", body: "احجز رحلتك إلى الطاسيلي الآن", time: "أمس" },
  { title: "مرحبًا بك في رحلتي", body: "اكتشف أجمل الوجهات حول العالم", time: "منذ 3 أيام" },
];

function NotificationsPage() {
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-primary mb-4">
        <ArrowRight className="h-4 w-4" /> {t("back")}
      </Link>
      <h1 className="text-2xl font-black mb-4 flex items-center gap-2"><Bell className="h-6 w-6 text-primary" /> {t("notifications")}</h1>
      <div className="bg-card rounded-2xl shadow-soft divide-y divide-border overflow-hidden">
        {items.map((n, i) => (
          <div key={i} className="p-4">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold text-sm">{n.title}</h3>
              <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
