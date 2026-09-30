import { useId } from "react";

// Official Rihlaty logo: emerald "R" with a gold flight trail and plane, optional Arabic name below.
export function RihlatyLogo({ className = "h-10 w-10", withText = false, plate = false, title = "رحلتي" }: { className?: string; withText?: boolean; plate?: boolean; title?: string }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox={withText ? "0 0 120 150" : "0 0 120 120"} className={className} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1B4D3E" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>
        <linearGradient id={`o${id}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
      {plate && <rect x="2" y="2" width="116" height={withText ? 146 : 116} rx="26" fill="#FDFBF7" />}
      {/* R */}
      <path
        fill={`url(#g${id})`}
        d="M22 104V22h34c18 0 30 10 30 25 0 11-6 19-16 23l20 34H69L52 73H40v31H22Zm18-47h15c8 0 13-4 13-10s-5-10-13-10H40v20Z"
      />
      {/* flight trail */}
      <path d="M58 100 C 80 96, 92 70, 100 40" fill="none" stroke={`url(#o${id})`} strokeWidth="5" strokeLinecap="round" strokeDasharray="1 9" />
      <path d="M40 104 C 70 104, 92 80, 101 36" fill="none" stroke={`url(#o${id})`} strokeWidth="4" strokeLinecap="round" />
      {/* plane */}
      <g transform="translate(103 24) rotate(-20)" fill={`url(#o${id})`}>
        <path d="M0 -12 L3 -3 L13 2 L13 5 L3 3 L2 10 L6 13 L6 15 L0 13 L-6 15 L-6 13 L-2 10 L-3 3 L-13 5 L-13 2 L-3 -3 Z" />
      </g>
      {withText && (
        <text x="60" y="142" textAnchor="middle" fontFamily="'IBM Plex Sans Arabic', sans-serif" fontWeight="700" fontSize="30" fill={`url(#g${id})`}>
          رحلتي
        </text>
      )}
    </svg>
  );
}
