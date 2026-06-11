import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Globe } from "lucide-react";
import { languages, useLanguage } from "@/hooks/useLanguage";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile/language")({
  component: LanguagePage,
});

function LanguagePage() {
  const { lang, setLang, t } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-primary mb-4">
        <ArrowRight className="h-4 w-4" /> {t("back")}
      </Link>
      <h1 className="text-2xl font-black mb-4 flex items-center gap-2"><Globe className="h-6 w-6 text-primary" /> {t("language")}</h1>
      <div className="bg-card rounded-2xl shadow-soft divide-y divide-border overflow-hidden">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => { setLang(l.code); toast.success(`${l.flag} ${l.label}`); }}
            className="w-full flex items-center gap-3 px-4 py-4 hover:bg-secondary transition-colors text-start"
          >
            <span className="text-2xl">{l.flag}</span>
            <span className="flex-1 font-medium">{l.label}</span>
            {l.code === lang && <Check className="h-5 w-5 text-primary" />}
          </button>
        ))}
      </div>
    </div>
  );
}
