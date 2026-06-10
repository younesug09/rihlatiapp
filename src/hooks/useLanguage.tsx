import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "ar" | "en" | "fr" | "es" | "de" | "tr" | "it" | "ru" | "zh";

export const languages: { code: Lang; label: string; flag: string; dir: "rtl" | "ltr" }[] = [
  { code: "ar", label: "العربية", flag: "🇩🇿", dir: "rtl" },
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "it", label: "Italiano", flag: "🇮🇹", dir: "ltr" },
  { code: "ru", label: "Русский", flag: "🇷🇺", dir: "ltr" },
  { code: "zh", label: "中文", flag: "🇨🇳", dir: "ltr" },
];

type LangCtx = { lang: Lang; setLang: (l: Lang) => void };
const LanguageContext = createContext<LangCtx>({ lang: "ar", setLang: () => {} });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const stored = (localStorage.getItem("lang") as Lang | null) ?? "ar";
    setLangState(stored);
    const cfg = languages.find((l) => l.code === stored) ?? languages[0];
    document.documentElement.lang = cfg.code;
    document.documentElement.dir = cfg.dir;
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    const cfg = languages.find((x) => x.code === l) ?? languages[0];
    document.documentElement.lang = cfg.code;
    document.documentElement.dir = cfg.dir;
  };

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
