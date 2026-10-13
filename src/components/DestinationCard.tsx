import { Link } from "@tanstack/react-router";
import { Heart, Star, MapPin } from "lucide-react";
import type { Destination } from "@/data/destinations";
import { useFavorites } from "@/hooks/useFavorites";
import { useLanguage } from "@/hooks/useLanguage";

export function DestinationCard({ d, large = false }: { d: Destination; large?: boolean }) {
  const { favorites, toggle } = useFavorites();
  const isFav = favorites.has(d.id);
  const { tr } = useLanguage();

  return (
    <Link
      to="/destinations/$id"
      params={{ id: d.id }}
      className="group block animate-fade-in"
    >
      <div className="relative overflow-hidden rounded-3xl bg-card border border-border/60 shadow-xl shadow-slate-200/50 dark:shadow-black/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
        <div className={`relative overflow-hidden ${large ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
          <img
            src={d.image}
            alt={d.imageAlt ?? `${d.name} — ${d.country}`}
            loading="lazy"
            width={800}
            height={600}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(d.id); }}
            className="absolute top-3 left-3 h-9 w-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center hover:scale-110 transition-transform"
            aria-label={tr("إضافة للمفضلة", "Ajouter aux favoris", "Add to favorites")}
          >
            <Heart strokeWidth={1.75} className={`h-4 w-4 transition-colors ${isFav ? "fill-destructive text-destructive" : "text-foreground"}`} />
          </button>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-background/90 backdrop-blur flex items-center gap-1 text-xs font-semibold">
            <Star className="h-3 w-3 fill-warning text-warning" />
            {d.rating}
          </div>
        </div>
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-foreground leading-tight">{d.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {d.country}
              </p>
            </div>
            <div className="text-left shrink-0">
              <p className="text-sm font-bold text-primary">{d.price.toLocaleString("ar")} {tr("دج", "DZD", "DZD")}</p>
              <p className="text-[10px] text-muted-foreground">{tr("لليلة", "par nuit", "per night")}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
