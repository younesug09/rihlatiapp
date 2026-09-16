import { Link } from "@tanstack/react-router";
import { Heart, Star, MapPin } from "lucide-react";
import type { Destination } from "@/data/destinations";
import { useFavorites } from "@/hooks/useFavorites";

export function DestinationCard({ d, large = false }: { d: Destination; large?: boolean }) {
  const { favorites, toggle } = useFavorites();
  const isFav = favorites.has(d.id);

  return (
    <Link
      to="/destinations/$id"
      params={{ id: d.id }}
      className="group block animate-fade-in"
    >
      <div className="relative overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-card transition-all">
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
            aria-label="إضافة للمفضلة"
          >
            <Heart className={`h-4 w-4 transition-colors ${isFav ? "fill-destructive text-destructive" : "text-foreground"}`} />
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
              <p className="text-sm font-bold text-primary">{d.price.toLocaleString("ar")} دج</p>
              <p className="text-[10px] text-muted-foreground">لليلة</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
