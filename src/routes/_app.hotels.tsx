import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Star, MapPin, BedDouble } from "lucide-react";
import { hotels, type Hotel } from "@/data/hotels";
import { destinations } from "@/data/destinations";

export const Route = createFileRoute("/_app/hotels")({
  head: () => ({ meta: [{ title: "الفنادق والمراقد — رحلتي" }] }),
  component: HotelsPage,
});

const types: Array<Hotel["type"] | "الكل"> = ["الكل", "فندق", "مرقد", "غرفة", "شقة", "نُزل"];

function HotelsPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof types)[number]>("الكل");

  const destName = (id: string) => destinations.find((d) => d.id === id)?.name ?? "";

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      const matchType = type === "الكل" || h.type === type;
      const q = query.trim();
      const matchQ =
        !q ||
        h.name.includes(q) ||
        destName(h.destinationId).includes(q) ||
        h.type.includes(q);
      return matchType && matchQ;
    });
  }, [query, type]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-black flex items-center gap-2">
          <BedDouble className="h-6 w-6 text-primary" /> الفنادق والمراقد
        </h1>
        <p className="text-sm text-muted-foreground">احجز إقامتك المثالية — فنادق، مراقد، شقق وغرف</p>
      </div>

      <div className="flex items-center gap-2 bg-card rounded-2xl px-4 py-3 shadow-soft border border-border mb-4">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن فندق أو مدينة..."
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-1 px-1">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition ${
              type === t
                ? "bg-primary text-primary-foreground shadow-soft"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((h) => (
          <Link
            key={h.id}
            to="/destinations/$id"
            params={{ id: h.destinationId }}
            className="group bg-card rounded-2xl shadow-soft overflow-hidden hover:shadow-card transition-all hover:-translate-y-0.5"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={h.image} alt={h.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <span className="absolute top-2 right-2 px-2 py-1 rounded-full bg-card/90 backdrop-blur text-[10px] font-bold text-primary">
                {h.type}
              </span>
              {h.freeCancellation && (
                <span className="absolute bottom-2 right-2 px-2 py-1 rounded-full bg-success text-success-foreground text-[10px] font-bold">
                  إلغاء مجاني
                </span>
              )}
            </div>
            <div className="p-3">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm leading-tight flex-1 line-clamp-1">{h.name}</h3>
                <div className="flex items-center gap-0.5 shrink-0">
                  <Star className="h-3 w-3 fill-warning text-warning" />
                  <span className="text-xs font-semibold">{h.rating}</span>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" /> {destName(h.destinationId)} · {h.distance}
              </p>
              <div className="flex items-end justify-between mt-2 pt-2 border-t border-border">
                <span className="text-[10px] text-muted-foreground">{h.reviews} تقييم</span>
                <div className="text-left">
                  <p className="text-base font-black text-primary leading-none">{h.pricePerNight.toLocaleString()} دج</p>
                  <p className="text-[10px] text-muted-foreground">الليلة</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">لا توجد نتائج مطابقة</p>
      )}
    </div>
  );
}
