import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, languages } from "@/hooks/useLanguage";
import { toast } from "sonner";

export function LanguageMenu() {
  const { lang, setLang, t } = useLanguage();
  const current = languages.find((l) => l.code === lang) ?? languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="h-9 px-2 rounded-full flex items-center gap-1 hover:bg-secondary transition-colors"
          aria-label={t("language")}
        >
          <Globe className="h-4 w-4 text-foreground" />
          <span className="text-[11px] font-bold uppercase">{current.code}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t("chooseLanguage")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {languages.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => {
              setLang(l.code);
              toast.success(`${l.flag} ${l.label}`);
            }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <span className="text-base">{l.flag}</span>
            <span className="flex-1 text-sm">{l.label}</span>
            {l.code === lang && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
