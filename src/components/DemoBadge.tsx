import { Info } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

type Props = { label?: string; className?: string };

/** Marks any content that is illustrative sample data, not verified real-world data. */
export function DemoBadge({ label, className = "" }: Props) {
  const { tr } = useLanguage();
  const text = label ?? tr("بيانات تجريبية · Demo Data", "Données de démonstration · Demo Data", "Demo Data");
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-warning/15 text-warning-foreground/90 px-2 py-0.5 text-[10px] font-semibold ${className}`}
    >
      <Info className="h-3 w-3" aria-hidden="true" />
      {text}
    </span>
  );
}

export function DemoNotice({ children }: { children?: React.ReactNode }) {
  const { tr } = useLanguage();
  return (
    <div className="rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-xs leading-relaxed text-foreground/80">
      <span className="font-bold">{tr("بيانات تجريبية — Demo Data. ", "Données de démonstration — Demo Data. ", "Demo Data. ")}</span>
      {children ??
        tr(
          "المحتوى المعروض هنا لأغراض العرض الأكاديمي فقط، والأسعار والتقييمات غير مرتبطة بمزوّدي خدمات حقيقيين.",
          "Le contenu affiché ici est à des fins de présentation académique uniquement ; les prix et les évaluations ne sont liés à aucun prestataire réel.",
          "The content shown here is for academic demo purposes only; prices and ratings are not tied to real providers."
        )}
    </div>
  );
}
