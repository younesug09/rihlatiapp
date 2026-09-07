import { Info } from "lucide-react";

type Props = { label?: string; className?: string };

/** Marks any content that is illustrative sample data, not verified real-world data. */
export function DemoBadge({ label = "بيانات تجريبية · Demo Data", className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-warning/15 text-warning-foreground/90 px-2 py-0.5 text-[10px] font-semibold ${className}`}
    >
      <Info className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
}

export function DemoNotice({ children }: { children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-warning/40 bg-warning/10 px-4 py-3 text-xs leading-relaxed text-foreground/80">
      <span className="font-bold">بيانات تجريبية — Demo Data. </span>
      {children ??
        "المحتوى المعروض هنا لأغراض العرض الأكاديمي فقط، والأسعار والتقييمات غير مرتبطة بمزوّدي خدمات حقيقيين."}
    </div>
  );
}
