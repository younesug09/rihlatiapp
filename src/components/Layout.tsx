import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, Compass, Heart, Newspaper, User } from "lucide-react";
import logo from "@/assets/logo.png";

const tabs = [
  { to: "/home", label: "الرئيسية", icon: Home },
  { to: "/explore", label: "اكتشف", icon: Compass },
  { to: "/favorites", label: "المفضلة", icon: Heart },
  { to: "/news", label: "الأخبار", icon: Newspaper },
  { to: "/profile", label: "حسابي", icon: User },
];

export function Layout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <img src={logo} alt="رحلتي" className="h-8 w-8" width={32} height={32} />
            <span className="text-lg font-bold text-primary">رحلتي</span>
          </Link>
          <span className="text-xs text-muted-foreground">منصة سياحية تواصلية</span>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 inset-x-0 z-40 bg-background/95 backdrop-blur-xl border-t border-border">
        <div className="mx-auto max-w-6xl px-2 grid grid-cols-5 h-16">
          {tabs.map((t) => {
            const active = pathname.startsWith(t.to);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className="flex flex-col items-center justify-center gap-1 transition-colors"
              >
                <Icon
                  className={`h-5 w-5 transition-all ${active ? "text-primary scale-110" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-[11px] ${active ? "text-primary font-semibold" : "text-muted-foreground"}`}
                >
                  {t.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
