import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings, Bell, CreditCard, HelpCircle, LogOut, ChevronLeft, Globe, Info, Sparkles, MapPin, BedDouble, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  head: () => ({ meta: [{ title: "حسابي — رحلتي" }] }),
  component: Profile,
});

const items = [
  { icon: Bell, label: "الإشعارات", to: "/profile" as const },
  { icon: CreditCard, label: "حجوزاتي", to: "/profile" as const },
  { icon: BedDouble, label: "إقاماتي", to: "/hotels" as const },
  { icon: Globe, label: "اللغة", to: "/profile" as const },
  { icon: Settings, label: "الإعدادات", to: "/profile" as const },
  { icon: HelpCircle, label: "المساعدة والدعم", to: "/profile" as const },
];

function Profile() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ bookings: 0, favorites: 0, reviews: 0 });
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ count: b }, { count: f }, { count: r }, { data: p }] = await Promise.all([
        supabase.from("bookings").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("favorites").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("reviews").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      ]);
      setStats({ bookings: b ?? 0, favorites: f ?? 0, reviews: r ?? 0 });
      setProfile(p ?? null);
    })();
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("تم تسجيل الخروج");
    navigate({ to: "/home" });
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "ضيف رحلتي";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 animate-fade-in">
      <div className="rounded-3xl p-6 text-primary-foreground text-center shadow-card mb-6 relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur mx-auto mb-3 flex items-center justify-center text-3xl font-bold">
            {initial}
          </div>
          {loading ? (
            <p className="text-white/80">...</p>
          ) : user ? (
            <>
              <h2 className="text-xl font-bold">{displayName}</h2>
              <p className="text-sm text-white/80 mb-4">{user.email}</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold">ضيف رحلتي</h2>
              <p className="text-sm text-white/80 mb-4">سجّل الدخول للوصول إلى كامل المزايا</p>
              <div className="flex gap-2 justify-center">
                <Link to="/auth" className="px-5 py-2 rounded-xl bg-white text-primary text-sm font-bold">تسجيل الدخول</Link>
                <Link to="/auth" className="px-5 py-2 rounded-xl bg-white/15 backdrop-blur border border-white/30 text-sm font-bold">حساب جديد</Link>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { v: stats.bookings, l: "حجوزات" },
          { v: stats.favorites, l: "مفضلة" },
          { v: stats.reviews, l: "مراجعات" },
        ].map((s) => (
          <div key={s.l} className="bg-card rounded-2xl p-4 text-center shadow-soft">
            <p className="text-2xl font-bold text-primary">{s.v}</p>
            <p className="text-xs text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

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

      {user && (
        <button onClick={handleSignOut} className="w-full mt-4 py-4 rounded-2xl bg-destructive/10 text-destructive font-semibold flex items-center justify-center gap-2">
          <LogOut className="h-4 w-4" /> تسجيل الخروج
        </button>
      )}

      {/* About the app */}
      <div className="mt-8 bg-card rounded-3xl shadow-soft overflow-hidden border border-border">
        <div className="p-5 text-primary-foreground relative overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/15 blur-xl" />
          <div className="relative flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center">
              <Info className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-black text-lg">عن تطبيق رحلتي</h3>
              <p className="text-xs text-white/85">منصتك الذكية للسفر والاكتشاف</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <b className="text-foreground">رحلتي</b> منصة سياحية وإعلامية حديثة تتيح لك اكتشاف أجمل الوجهات في الجزائر والعالم، وحجز الفنادق والمراقد والشقق والغرف بسهولة، ومتابعة آخر الأخبار والمحتوى المرئي حول السفر والسياحة.
          </p>

          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: MapPin, label: "+13 وجهة" },
              { icon: BedDouble, label: "إقامات متنوعة" },
              { icon: Sparkles, label: "تجربة عربية" },
            ].map((f) => (
              <div key={f.label} className="bg-secondary rounded-2xl p-3 text-center">
                <f.icon className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-[11px] font-semibold">{f.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-secondary rounded-xl p-3">
              <p className="text-muted-foreground">الإصدار</p>
              <p className="font-bold mt-0.5">1.0.0</p>
            </div>
            <div className="bg-secondary rounded-xl p-3">
              <p className="text-muted-foreground">اللغات المدعومة</p>
              <p className="font-bold mt-0.5">9 لغات</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground border-t border-border pt-3">
            <Shield className="h-3.5 w-3.5" />
            بياناتك محمية ومشفّرة بالكامل
          </div>
        </div>
      </div>
    </div>
  );
}
