import { useLanguage } from "@/hooks/useLanguage";

export type StampId = "explorer" | "algeria-lover" | "desert" | "heritage" | "coastal";

type Props = { id: StampId; label: string; earned: boolean; className?: string };

/**
 * Hand-drawn style SVG passport stamp. Earned stamps use the ink color,
 * unearned ones stay faint so the wall reads as a progress map.
 */
export function PassportStamp({ id, label, earned, className = "" }: Props) {
  const { tr } = useLanguage();
  const stroke = earned ? "var(--primary)" : "var(--muted-foreground)";
  const fill = earned ? "var(--accent)" : "transparent";

  return (
    <figure className={`flex flex-col items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 120 120"
        className={`h-24 w-24 ${earned ? "" : "opacity-35"}`}
        role="img"
        aria-label={`${label}${earned ? tr(" — تم الحصول عليه", " — obtenu", " — earned") : tr(" — لم يُفتح بعد", " — non débloqué", " — not unlocked yet")}`}
      >
        <circle cx="60" cy="60" r="54" fill={fill} fillOpacity={earned ? 0.25 : 0} stroke={stroke} strokeWidth="2.5" strokeDasharray="6 5" />
        <circle cx="60" cy="60" r="44" fill="none" stroke={stroke} strokeWidth="1.5" />
        {id === "explorer" && (
          <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="60" cy="60" r="22" />
            <path d="M70 50 L64 68 L50 70 L56 52 Z" />
          </g>
        )}
        {id === "algeria-lover" && (
          <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M60 78c-12-8-20-16-20-25a11 11 0 0 1 20-6 11 11 0 0 1 20 6c0 9-8 17-20 25Z" />
            <path d="M46 44a18 18 0 0 0 28 0" opacity="0.5" />
          </g>
        )}
        {id === "desert" && (
          <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="60" cy="48" r="8" />
            <path d="M36 72c6-8 12-8 18 0 5-10 12-12 18-4 4-4 8-4 12 0" />
            <path d="M34 80h52" />
          </g>
        )}
        {id === "heritage" && (
          <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 78V52l20-14 20 14v26" />
            <path d="M34 78h52" />
            <path d="M52 78V62h16v16" />
          </g>
        )}
        {id === "coastal" && (
          <g fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M34 66c6-6 12-6 18 0s12 6 18 0 12-6 16 0" />
            <path d="M34 78c6-6 12-6 18 0s12 6 18 0 12-6 16 0" />
            <circle cx="60" cy="44" r="8" />
          </g>
        )}
      </svg>
      <figcaption className={`text-center text-xs font-bold ${earned ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </figcaption>
    </figure>
  );
}
