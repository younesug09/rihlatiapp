import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, Compass, Heart, BedDouble, User, Bell, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { LanguageMenu } from "@/components/LanguageMenu";
import { AppFooter } from "@/components/AppFooter";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Layout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { t } = useLanguage();
  const [dark, setDark] = useState(false);

  const tabs = [
    { to: "/home", label: t("home"), icon: Home },
    { to: "/explore", label: t("explore"), icon: Compass },
    { to: "/hotels", label: t("hotels"), icon: BedDouble },
    { to: "/favorites", label: t("favorites"), icon: Heart },
    { to: "/profile", label: t("profile"), icon: User },
  ];

  const notifications = [
    { id: 1, title: "عرض خاص على وهران", body: "خصم 20% على الرحلات هذا الأسبوع", time: "1h", unread: true },
    { id: 2, title: "موسم الصحراء انطلق!", body: "احجز رحلتك إلى الطاسيلي الآن", time: "1d", unread: true },
    { id: 3, title: t("appName"), body: "اكتشف أجمل الوجهات حول العالم", time: "3d", unread: false },
  ];

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-card/70 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <img src={logo} alt={t("appName")} className="h-9 w-9 object-contain" width={36} height={36} />
            <span className="text-lg font-bold text-primary">{t("appName")}</span>
          </Link>

          <div className="flex items-center gap-1">
            <LanguageMenu />
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
              aria-label="theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="relative h-9 w-9 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
                  aria-label={t("notifications")}
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
                <DropdownMenuLabel>{t("notifications")}</DropdownMenuLabel>
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
                <DropdownMenuItem asChild className="justify-center text-primary font-semibold">
                  <Link to="/profile/notifications">{t("allNotifications")}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
        <AppFooter />
        <div className="h-24" />
      </main>

      {/* Clean glass bottom navigation */}
      <nav className="fixed bottom-3 inset-x-0 z-40 px-3 pointer-events-none">
        <div className="mx-auto max-w-md pointer-events-auto">
          <div className="relative rounded-[28px] border border-border/60 bg-card/85 backdrop-blur-2xl shadow-card">
            <div className="grid grid-cols-5 h-16 px-1.5">
              {tabs.map((tab) => {
                const active = pathname.startsWith(tab.to);
                const Icon = tab.icon;
                return (
                  <Link
                    key={tab.to}
                    to={tab.to}
                    className="flex flex-col items-center justify-center gap-0.5 relative group"
                  >
                    <span
                      className={`flex items-center justify-center h-9 w-12 rounded-2xl transition-all duration-300 ${
                        active ? "bg-primary text-primary-foreground shadow-glow scale-105" : "text-muted-foreground group-hover:bg-secondary"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span
                      className={`text-[10px] mt-0.5 transition-colors ${
                        active ? "text-primary font-bold" : "text-muted-foreground"
                      }`}
                    >
                      {tab.label}
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
