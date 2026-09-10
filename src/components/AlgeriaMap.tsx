import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { wilayas, regions, type Region } from "@/data/wilayas";

const MIN_LNG = -9.5;
const MAX_LNG = 12.5;
const MIN_LAT = 18.3;
const MAX_LAT = 37.6;
const W = 620;
const H = 560;

const px = (lng: number) => ((lng - MIN_LNG) / (MAX_LNG - MIN_LNG)) * W;
const py = (lat: number) => ((MAX_LAT - lat) / (MAX_LAT - MIN_LAT)) * H;

// Simplified outline of Algeria (lng, lat) — stylized, not a survey map.
const OUTLINE: [number, number][] = [
  [-2.2, 35.1], [-1.2, 35.6], [0.0, 35.9], [1.2, 36.5], [2.4, 36.6], [3.1, 36.8],
  [4.4, 36.9], [5.6, 36.8], [6.5, 37.1], [7.6, 37.0], [8.6, 36.9], [8.2, 36.4],
  [8.3, 35.2], [7.5, 34.2], [7.8, 33.2], [9.0, 32.1], [9.5, 30.2], [9.9, 26.5],
  [11.9, 23.5], [10.0, 22.5], [8.0, 19.5], [5.8, 19.1], [4.2, 19.1], [3.1, 19.7],
  [1.2, 20.8], [-1.3, 22.8], [-4.8, 24.9], [-8.68, 27.3], [-8.68, 27.8],
  [-6.0, 29.6], [-3.7, 30.5], [-2.5, 32.1], [-1.0, 32.5], [-1.5, 33.8], [-1.8, 34.8],
];

const outlinePath =
  OUTLINE.map(([lng, lat], i) => `${i === 0 ? "M" : "L"}${px(lng).toFixed(1)},${py(lat).toFixed(1)}`).join(" ") + " Z";

export function AlgeriaMap({
  region,
  onRegionChange,
}: {
  region: Region | "all";
  onRegionChange: (r: Region | "all") => void;
}) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  const shown = wilayas.filter((w) => region === "all" || w.region === region);
  const active = hovered ? wilayas.find((w) => w.id === hovered) ?? null : null;

  return (
    <div className="rounded-3xl border border-border bg-card p-4 sm:p-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {regions.map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => onRegionChange(r.id)}
            aria-pressed={region === r.id}
            className={`rounded-full px-4 py-1.5 text-sm font-medium border transition-colors ${
              region === r.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-secondary/50 border-border text-muted-foreground hover:border-primary"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          role="img"
          aria-label="خريطة تفاعلية للجزائر — اضغط على ولاية لعرض صفحتها"
        >
          <defs>
            <linearGradient id="rihla-map" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.16" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          <path
            d={outlinePath}
            fill="url(#rihla-map)"
            stroke="hsl(var(--primary))"
            strokeOpacity="0.5"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {wilayas.map((w) => {
            const dim = !shown.includes(w);
            const isHot = hovered === w.id;
            return (
              <g
                key={w.id}
                transform={`translate(${px(w.lng).toFixed(1)},${py(w.lat).toFixed(1)})`}
                className={`cursor-pointer transition-opacity ${dim ? "opacity-25" : "opacity-100"}`}
                onMouseEnter={() => setHovered(w.id)}
                onMouseLeave={() => setHovered((c) => (c === w.id ? null : c))}
                onClick={() => navigate({ to: "/wilayas/$id", params: { id: w.id } })}
                role="button"
                tabIndex={0}
                aria-label={`ولاية ${w.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate({ to: "/wilayas/$id", params: { id: w.id } });
                  }
                }}
              >
                {isHot && <circle r="16" fill="hsl(var(--primary))" fillOpacity="0.18" />}
                <circle
                  r={isHot ? 8 : 6}
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--card))"
                  strokeWidth="2.5"
                  className="transition-all"
                />
                <text
                  y="-14"
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ fontSize: 14, fontWeight: 700, opacity: isHot ? 1 : 0 }}
                >
                  {w.name}
                </text>
              </g>
            );
          })}
        </svg>

        {active && (
          <div className="pointer-events-none absolute top-3 start-3 rounded-2xl bg-card/95 backdrop-blur border border-border px-4 py-2 shadow-card">
            <p className="text-sm font-bold">{active.name}</p>
            <p className="text-xs text-muted-foreground">{active.tagline}</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        خريطة مبسّطة للتوضيح — اضغط على أي نقطة للانتقال إلى صفحة الولاية.
      </p>
    </div>
  );
}
