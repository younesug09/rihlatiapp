import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { destinations, categories } from "@/data/destinations";
import { DestinationCard } from "@/components/DestinationCard";
import { z } from "zod";

const search = z.object({ category: z.string().optional() });

export const Route = createFileRoute("/_app/explore")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: "اكتشف الوجهات — رحلتي" },
      { name: "description", content: "تصفح وجهات سياحية مذهلة في الجزائر والعالم. ابحث وفلتر حسب الفئة." },
    ],
  }),
  component: Explore,
});

function Explore() {
  const { category } = Route.useSearch();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(category ?? "all");
  const [region, setRegion] = useState<"all" | "algeria" | "world">("all");

  const filtered = destinations.filter((d) => {
    if (cat !== "all" && d.category !== cat) return false;
    if (region !== "all" && d.region !== region) return false;
    if (q && !d.name.includes(q) && !d.country.includes(q)) return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">اكتشف الوجهات</h1>
      <p className="text-sm text-muted-foreground mb-5">ابحث عن مغامرتك القادمة</p>

      <div className="flex gap-2 mb-4">
        <div className="flex-1 flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-3 focus-within:border-primary transition-colors">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث عن مدينة أو بلد..."
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <button className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-soft" aria-label="فلاتر">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Region tabs */}
      <div className="flex gap-2 mb-4 p-1 bg-muted rounded-2xl">
        {[
          { id: "all", label: "الكل" },
          { id: "algeria", label: "🇩🇿 الجزائر" },
          { id: "world", label: "🌍 العالم" },
        ].map((r) => (
          <button
            key={r.id}
            onClick={() => setRegion(r.id as never)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              region === r.id ? "bg-card shadow-soft text-primary" : "text-muted-foreground"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 -mx-4 px-4 scrollbar-hide">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
              cat === c.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border"
            }`}
          >
            <span className="mr-1">{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground mb-3">{filtered.length} وجهة</p>

      <div className="grid grid-cols-2 gap-3">
        {filtered.map((d) => <DestinationCard key={d.id} d={d} />)}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p>لا توجد نتائج مطابقة</p>
        </div>
      )}
    </div>
  );
}
