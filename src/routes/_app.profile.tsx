import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings, Bell, CreditCard, HelpCircle, LogOut, ChevronLeft, Shield, Globe } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "حسابي — رحلتي" }] }),
  component: Profile,
});

const items = [
  { icon: Bell, label: "الإشعارات", to: "/profile" },
  { icon: CreditCard, label: "حجوزاتي", to: "/profile" },
  { icon: Globe, label: "اللغة", to: "/profile" },
  { icon: Settings, label: "الإعدادات", to: "/profile" },
  { icon: HelpCircle, label: "المساعدة والدعم", to: "/profile" },
  { icon: Shield, label: "لوحة المشرف", to: "/admin" },
];

function Profile() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6 animate-fade-in">
      {/* Profile header */}
      <div className="rounded-3xl p-6 text-primary-foreground text-center shadow-card mb-6 relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur mx-auto mb-3 flex items-center justify-center text-3xl font-bold">
            ض
          </div>
          <h2 className="text-xl font-bold">ضيف رحلتي</h2>
          <p className="text-sm text-white/80 mb-4">سجّل الدخول للوصول إلى كامل المزايا</p>
          <div className="flex gap-2 justify-center">
            <button className="px-5 py-2 rounded-xl bg-white text-primary text-sm font-bold">تسجيل الدخول</button>
            <button className="px-5 py-2 rounded-xl bg-white/15 backdrop-blur border border-white/30 text-sm font-bold">حساب جديد</button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { v: "0", l: "حجوزات" },
          { v: "3", l: "مفضلة" },
          { v: "0", l: "مراجعات" },
        ].map((s) => (
          <div key={s.l} className="bg-card rounded-2xl p-4 text-center shadow-soft">
            <p className="text-2xl font-bold text-primary">{s.v}</p>
            <p className="text-xs text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="bg-card rounded-2xl shadow-soft divide-y divide-border overflow-hidden">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <Link key={it.label} to={it.to} className="flex items-center gap-3 px-4 py-4 hover:bg-secondary transition-colors">
              <div className="h-9 w-9 rounded-xl bg-accent text-primary flex items-center justify-center">
                <Icon className="h-4 w-4" />
              </div>
              <span className="flex-1 font-medium text-sm">{it.label}</span>
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </Link>
          );
        })}
      </div>

      <button className="w-full mt-4 py-4 rounded-2xl bg-destructive/10 text-destructive font-semibold flex items-center justify-center gap-2">
        <LogOut className="h-4 w-4" /> تسجيل الخروج
      </button>

      <p className="text-center text-xs text-muted-foreground mt-8">
        رحلتي — مشروع تخرج ماستر علوم الإعلام والاتصال
      </p>
    </div>
  );
}
