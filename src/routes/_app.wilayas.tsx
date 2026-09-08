import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { wilayas, regions, tripTypes, budgets, durations, type Region, type TripType } from "@/data/wilayas";

export const Route = createFileRoute("/_app/wilayas")({
  head: () => ({
    meta: [
      { title: "اكتشف الجزائر ولايةً بولاية — رحلتي" },
      { name: "description", content: "خريطة تفاعلية للولايات الجزائرية مع فلترة حسب المنطقة ونوع الرحلة والميزانية والمدة." },
      { property: "og:title", content: "اكتشف الجزائر ولايةً بولاية — رحلتي" },
      { property: "og:description", content: "استكشف ولايات الجزائر: الطبيعة، التاريخ، الثقافة، الإقامات والأنشطة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WilayasPage,
});

function WilayasPage() {
  const [q, setQ] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [type, setType] = useState<TripType | "all">("all");
  const [budget, setBudget] = useState<string>("all");
  const [duration, setDuration] = useState<string>("all");

  const filtered = wilayas.filter((w) => {
    if (region !== "all" && w.region !== region) return false;
    if (type !== "all" && !w.tripTypes.includes(type)) return false;
    if (budget !== "all" && w.budget !== budget) return false;
    if (q && !w.name.includes(q) && !w.tagline.includes(q) && !w.code.includes(q)) return false;
    return true;
  });

  const byRegion = (r: Region) => wilayas.filter((w) => w.region === r).length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-fade-in">
      <p className="text-[11px] font-bold tracking-[0.3em] text-primary mb-2">EXPLORE ALGERIA</p>
      <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-2">اكتشف الجزائر ولايةً بولاية</h1>
      <p className="text-muted-foreground max-w-xl leading-relaxed mb-6">
        من ساحل جيجل إلى كثبان الطاسيلي — اختر منطقتك ونوع رحلتك وميزانيتك، ودع الباقي علينا.
      </p>

      {/* Schematic interactive map */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(["west", "center", "east", "south"] as Region[]).map((r) => {
            const active = region === r;
            const label = regions.find((x) => x.id === r)!.label;
            return (
              <button
                key={r}
                onClick={() => setRegion(active ? "all" : r)}
                className={`rounded-2xl px-4 py-6 text-center transition-all border ${
                  active
                    ? "bg-primary text-primary-foreground border-primary shadow-glow"
                    : "bg-secondary/50 border-border hover:border-primary"
                } ${r === "south" ? "sm:col-span-4" : ""}`}
              >
                <MapPin className="h-5 w-5 mx-auto mb-2 opacity-80" />
                <span className="block font-bold">{label}</span>
                <span className={`text-xs ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {byRegion(r)} ولاية
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          خريطة مبسّطة للمناطق — اضغط على منطقة لتصفية الولايات.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-3 mb-4 focus-within:border-primary transition-colors">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث عن ولاية…"
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      <FilterRow label="نوع الرحلة" options={tripTypes.map((t) => ({ id: t.id, label: t.label }))} value={type} onChange={(v) => setType(v as TripType | "all")} />
      <FilterRow label="الميزانية" options={budgets.map((b) => ({ id: b.id, label: b.label }))} value={budget} onChange={setBudget} />
      <FilterRow
        label="المدة"
        options={[{ id: "all", label: "أي مدة" }, ...durations.map((d) => ({ id: d.id, label: d.label }))]}
        value={duration}
        onChange={setDuration}
      />

      <div className="flex items-center justify-between mt-6 mb-3">
        <p className="text-sm text-muted-foreground">{filtered.length} ولاية</p>
        <Link to="/plan" className="text-sm font-semibold text-primary">خطّط رحلتي ←</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((w) => (
          <Link
            key={w.id}
            to="/wilayas/$id"
            params={{ id: w.id }}
            className="group relative overflow-hidden rounded-3xl aspect-[4/5] shadow-card"
          >
            <img
              src={w.image}
              alt={`منظر من ولاية ${w.name}`}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <span className="text-[10px] font-bold tracking-widest opacity-80">{w.code}</span>
              <h2 className="text-2xl font-bold leading-tight">{w.name}</h2>
              <p className="text-sm text-white/85">{w.tagline}</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center py-16 text-muted-foreground">لا توجد نتائج مطابقة. جرّب تخفيف الفلاتر.</p>
      )}
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              value === o.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
