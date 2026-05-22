import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { destinations } from "@/data/destinations";
import { DestinationCard } from "@/components/DestinationCard";

export const Route = createFileRoute("/_app/favorites")({
  head: () => ({ meta: [{ title: "المفضلة — رحلتي" }] }),
  component: Favorites,
});

function Favorites() {
  const favs = destinations.slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">وجهاتي المفضلة</h1>
      <p className="text-sm text-muted-foreground mb-6">{favs.length} وجهة محفوظة</p>

      {favs.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-bold mb-2">لا توجد وجهات مفضلة</h2>
          <p className="text-muted-foreground text-sm mb-4">ابدأ بحفظ الأماكن التي تحبها</p>
          <Link to="/explore" className="inline-block px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold">
            استكشف الآن
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {favs.map((d) => <DestinationCard key={d.id} d={d} />)}
        </div>
      )}
    </div>
  );
}
