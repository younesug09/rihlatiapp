import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Settings as SettingsIcon, Moon, Bell, Lock, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_app/profile/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const { t } = useLanguage();
  const [dark, setDark] = useState(false);
  const [notif, setNotif] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = (v: boolean) => {
    setDark(v);
    document.documentElement.classList.toggle("dark", v);
    localStorage.setItem("theme", v ? "dark" : "light");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-primary mb-4">
        <ArrowRight className="h-4 w-4" /> {t("back")}
      </Link>
      <h1 className="text-2xl font-black mb-4 flex items-center gap-2"><SettingsIcon className="h-6 w-6 text-primary" /> {t("settings")}</h1>

      <div className="bg-card rounded-2xl shadow-soft divide-y divide-border overflow-hidden">
        <Row icon={Moon} label="الوضع الداكن"><Switch checked={dark} onCheckedChange={toggleDark} /></Row>
        <Row icon={Bell} label={t("notifications")}><Switch checked={notif} onCheckedChange={setNotif} /></Row>
        <Row icon={Lock} label="الخصوصية"><span className="text-xs text-muted-foreground">{t("soon")}</span></Row>
        <Row icon={Trash2} label="حذف الحساب"><span className="text-xs text-destructive">{t("soon")}</span></Row>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <div className="h-9 w-9 rounded-xl bg-accent text-primary flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </div>
      <span className="flex-1 font-medium text-sm">{label}</span>
      {children}
    </div>
  );
}
