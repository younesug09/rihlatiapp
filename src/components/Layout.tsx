import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, Compass, Heart, BedDouble, User, Bell, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { LanguageMenu } from "@/components/LanguageMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tabs = [
  { to: "/home", label: "الرئيسية", icon: Home },
  { to: "/explore", label: "اكتشف", icon: Compass },
  { to: "/hotels", label: "الفنادق", icon: BedDouble },
  { to: "/favorites", label: "المفضلة", icon: Heart },
  { to: "/profile", label: "حسابي", icon: User },
];

const notifications = [
  { id: 1, title: "عرض خاص على وهران", body: "خصم 20% على الرحلات هذا الأسبوع", time: "قبل ساعة", unread: true },
  { id: 2, title: "موسم الصحراء انطلق!", body: "احجز رحلتك إلى الطاسيلي الآن", time: "أمس", unread: true },
  { id: 3, title: "مرحبًا بك في رحلتي", body: "اكتشف أجمل الوجهات حول العالم", time: "منذ 3 أيام", unread: false },
];

export function Layout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const isDark = stored === "dark" || (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const unreadCount = notifications.filter((n) => n.unread).length;
  const activeIndex = Math.max(0, tabs.findIndex((t) => pathname.startsWith(t.to)));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <img src={logo} alt="رحلتي" className="h-8 w-8" width={32} height={32} />
            <span className="text-lg font-bold text-primary">رحلتي</span>
          </Link>

          <div className="flex items-center gap-1">
            <LanguageMenu />

            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="تبديل الوضع"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                  aria-label="الإشعارات"
                >
                  <Bell className="h-4 w-4 text-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 left-1.5 h-4 min-w-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="text-right">الإشعارات</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((n) => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-1 py-3 cursor-pointer">
                    <div className="flex items-center gap-2 w-full">
                      {n.unread && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                      <span className="font-semibold text-sm flex-1">{n.title}</span>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary font-semibold">
                  عرض كل الإشعارات
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-24">
        <Outlet />
      </main>

      {/* Liquid-glass bottom navigation */}
      <nav className="fixed bottom-3 inset-x-0 z-40 px-3 pointer-events-none">
        <div className="mx-auto max-w-md pointer-events-auto">
          <div className="relative rounded-[28px] border border-white/20 dark:border-white/10 bg-card/70 backdrop-blur-2xl shadow-card overflow-hidden">
            {/* Glass highlights */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/30 to-transparent dark:from-white/5" />
            {/* Liquid pill that follows the active tab */}
            <div
              className="liquid-pill absolute top-1.5 bottom-1.5 rounded-2xl shadow-glow"
              style={{
                width: `calc((100% - 12px) / ${tabs.length})`,
                right: `calc(6px + ${activeIndex} * ((100% - 12px) / ${tabs.length}))`,
                background: "var(--gradient-primary)",
              }}
            />
            <div className="relative grid grid-cols-5 h-16">
              {tabs.map((t) => {
                const active = pathname.startsWith(t.to);
                const Icon = t.icon;
                return (
                  <Link
                    key={t.to}
                    to={t.to}
                    className="flex flex-col items-center justify-center gap-0.5 relative z-10"
                  >
                    <Icon
                      className={`h-5 w-5 transition-all duration-500 ${active ? "text-primary-foreground scale-110" : "text-muted-foreground"}`}
                    />
                    <span
                      className={`text-[10px] transition-all duration-500 ${active ? "text-primary-foreground font-bold" : "text-muted-foreground"}`}
                    >
                      {t.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
