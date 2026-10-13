import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDZ, DZD } from "@/lib/format";
import { useLanguage } from "@/hooks/useLanguage";

type Trip = { id: string; title: string; destination: string; departure_date: string | null; price: number; cover_url: string | null; seats: number; seats_booked: number; agencies: { name: string } | null };

export function LiveTrips() {
  const { tr } = useLanguage();
  const [trips, setTrips] = useState<Trip[] | null>(null);
  useEffect(() => {
    void supabase.from("trips").select("id, title, destination, departure_date, price, cover_url, seats, seats_booked, agencies(name)")
      .eq("status", "published").order("departure_date", { ascending: true }).limit(8)
      .then(({ data }) => setTrips((data as Trip[] | null) ?? []));
  }, []);

  return (
    <section aria-labelledby="live-trips" className="mx-auto max-w-6xl px-4 pt-8">
      <h2 id="live-trips" className="text-2xl font-bold">{tr("رحلات الوكالات المتاحة الآن", "Voyages d'agences disponibles maintenant", "Agency trips available now")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{tr("رحلات منشورة من وكالات موثّقة — أرسل طلب حجز بعدد المقاعد.", "Voyages publiés par des agences vérifiées — envoyez une demande de réservation pour le nombre de places souhaité.", "Trips published by verified agencies — send a booking request for your seats.")}</p>
      {trips === null ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-56 animate-pulse rounded-lg bg-secondary" />)}</div>
      ) : trips.length === 0 ? (
        <div className="mt-4 rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">{tr("لا توجد رحلات منشورة حاليًا.", "Aucun voyage publié pour le moment.", "No trips published right now.")}</div>
      ) : (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {trips.map((t) => (
            <article key={t.id} className="min-w-[16rem] overflow-hidden rounded-lg border border-border bg-card shadow-soft">
              {t.cover_url && <img src={t.cover_url} alt={t.title} loading="lazy" className="h-32 w-full object-cover" />}
              <div className="p-4">
                <p className="text-xs text-muted-foreground">{t.agencies?.name}</p>
                <h3 className="mt-1 line-clamp-1 font-bold">{t.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{t.destination}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  {t.departure_date && <span className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{t.departure_date}</span>}
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{t.seats - t.seats_booked}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-bold text-primary">{formatDZ(Number(t.price))} {DZD}</span>
                  <Link to="/booking" search={{ trip: t.id }} className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">{tr("طلب حجز", "Demander", "Request")}</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
