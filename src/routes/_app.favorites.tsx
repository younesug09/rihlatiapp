import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { destinations } from "@/data/destinations";
import { DestinationCard } from "@/components/DestinationCard";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/_app/favorites")({
  head: () => ({ meta: [{ title: "المفضلة — رحلتي" }] }),
  component: Favorites,
});

function Favorites() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { favorites, loading } = useFavorites();
  const favs = destinations.filter((d) => favorites.has(d.id));

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center animate-fade-in">
        <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
          <Heart className="h-8 w-8 text-primary" />
        </div>
        <h2 className="font-bold text-lg mb-2">{t("signInToView")}</h2>
        <p className="text-muted-foreground text-sm mb-4">{t("saveFavs")}</p>
        <Link to="/auth" className="inline-block px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold">
          {t("signIn")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">{t("myFavorites")}</h1>
      <p className="text-sm text-muted-foreground mb-6">{favs.length} {t("savedCount")}</p>

      {loading ? (
        <div className="text-center py-10 text-muted-foreground">{t("loading")}</div>
      ) : favs.length === 0 ? (
        <div className="text-center py-20">
          <div className="h-20 w-20 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h2 className="font-bold mb-2">{t("noFavsYet")}</h2>
          <p className="text-muted-foreground text-sm mb-4">{t("tapHeart")}</p>
          <Link to="/explore" className="inline-block px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold">
            {t("exploreNow")}
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
