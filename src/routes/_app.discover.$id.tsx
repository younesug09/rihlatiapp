import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Building2, CalendarDays, Clock3, Compass, MapPin, Route as RouteIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDiscoverDestination, tourismLabel } from "@/data/discover";
import { Button } from "@/components/ui/button";
import { formatDZ } from "@/lib/format";

type Agency = { id: string; slug: string; name: string; wilaya: string | null; logo_url: string | null; description: string | null; verification_status: string };
type Trip = { id: string; title: string; destination: string; cover_url: string | null; duration_days: number; departure_date: string | null; price: number; currency: string; agencies: Agency | null };

export const Route = createFileRoute("/_app/discover/$id")({
  loader: ({ params }) => {
    const destination = getDiscoverDestination(params.id);
    if (!destination) throw notFound();
    return { destination };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "الوجهة غير متوفرة — رحلتي" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.destination.name} — دليل السفر | رحلتي`;
    return { meta: [
      { title },
      { name: "description", content: loaderData.destination.intro },
      { property: "og:title", content: title },
      { property: "og:description", content: loaderData.destination.intro },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ] };
  },
  component: DiscoverDetailPage,
  notFoundComponent: () => <div className="mx-auto max-w-xl px-4 py-20 text-center"><h1 className="text-2xl font-bold">لم نجد هذه الوجهة</h1><Button asChild className="mt-5 rounded-full"><Link to="/discover">العودة إلى اكتشف الجزائر</Link></Button></div>,
});

function DiscoverDetailPage() {
  const { destination } = Route.useLoaderData();
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [agencies, setAgencies] = useState<Agency[] | null>(null);

  useEffect(() => {
    let active = true;
    async function loadLiveContent() {
      const [tripResult, agencyResult] = await Promise.all([
        supabase.from("trips").select("id, title, destination, cover_url, duration_days, departure_date, price, currency, agencies(id, slug, name, wilaya, logo_url, description, verification_status)").eq("status", "published").ilike("destination", `%${destination.name}%`).order("departure_date", { ascending: true }).limit(6),
        supabase.from("agencies").select("id, slug, name, wilaya, logo_url, description, verification_status").eq("verification_status", "verified").ilike("wilaya", `%${destination.name}%`).limit(6),
      ]);
      if (!active) return;
      const loadedTrips = (tripResult.data as unknown as Trip[] | null) ?? [];
      setTrips(loadedTrips);
      const byId = new Map<string, Agency>();
      ((agencyResult.data as Agency[] | null) ?? []).forEach((agency) => byId.set(agency.id, agency));
      loadedTrips.forEach((trip) => { if (trip.agencies?.verification_status === "verified") byId.set(trip.agencies.id, trip.agencies); });
      setAgencies([...byId.values()]);
    }
    loadLiveContent();
    return () => { active = false; };
  }, [destination.name]);

  return (
    <div className="animate-fade-in pb-10">
      <section className="relative min-h-[28rem] overflow-hidden sm:min-h-[36rem]">
        <img src={destination.image} alt={destination.imageAlt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-glow via-primary-glow/35 to-primary-glow/10" />
        <div className="relative mx-auto flex min-h-[28rem] max-w-6xl flex-col justify-between px-4 py-7 text-primary-foreground sm:min-h-[36rem] sm:py-10">
          <Button asChild variant="secondary" size="sm" className="w-fit rounded-full bg-card/90 backdrop-blur">
            <Link to="/discover"><ArrowRight className="h-4 w-4" /> كل الوجهات</Link>
          </Button>
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2">{destination.tourismTypes.map((type) => <span key={type} className="rounded-full border border-card/30 bg-card/15 px-3 py-1 text-xs font-bold backdrop-blur">{tourismLabel(type)}</span>)}</div>
            <p className="mt-5 text-xs font-bold tracking-[0.2em] text-accent">ولاية {destination.code}</p>
            <h1 className="mt-2 text-4xl font-bold sm:text-6xl">{destination.name}</h1>
            <p className="mt-3 text-lg opacity-90">{destination.tagline}</p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-9">
        <section className="grid gap-4 sm:grid-cols-3" aria-label="معلومات الزيارة">
          <Info icon={MapPin} label="الموقع" value={destination.exactLocation} />
          <Info icon={CalendarDays} label="أفضل وقت للزيارة" value={destination.bestTime} />
          <Info icon={Clock3} label="المدة المقترحة" value={destination.recommendedDuration} />
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold text-accent">نظرة عامة</p>
            <h2 className="mt-1 text-3xl font-bold">تجربة {destination.name}</h2>
            <p className="mt-4 text-base leading-8 text-muted-foreground">{destination.intro}</p>
            <div className="mt-6 rounded-2xl border border-border bg-secondary/50 p-5">
              <h3 className="flex items-center gap-2 font-bold"><Compass className="h-5 w-5 text-primary" strokeWidth={1.75} /> أبرز الأنشطة</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">{destination.activities.map((activity) => <li key={activity} className="flex items-start gap-2 text-sm"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{activity}</li>)}</ul>
            </div>
          </div>
          <Gallery images={destination.gallery} />
        </section>

        <section className="mt-14" aria-labelledby="trips-heading">
          <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold text-accent">Available Trips</p><h2 id="trips-heading" className="mt-1 text-2xl font-bold">رحلات متاحة إلى {destination.name}</h2></div><RouteIcon className="h-6 w-6 text-primary" strokeWidth={1.75} /></div>
          {trips === null ? <LoadingGrid /> : trips.length === 0 ? <EmptyState icon={RouteIcon} text="لا توجد رحلات منشورة لهذه الوجهة حاليًا. يمكنك العودة لاحقًا أو تخطيط رحلتك بنفسك." action="خطط رحلتك" to="/plan" /> : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{trips.map((trip) => <article key={trip.id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"><div className="aspect-[16/9] bg-secondary">{trip.cover_url && <img src={trip.cover_url} alt={trip.title} className="h-full w-full object-cover" loading="lazy" />}</div><div className="p-4"><p className="text-xs text-muted-foreground">{trip.duration_days} أيام{trip.departure_date ? ` · ${trip.departure_date}` : ""}</p><h3 className="mt-1 font-bold">{trip.title}</h3><div className="mt-4 flex items-center justify-between gap-2"><span className="font-bold text-primary">{formatDZ(trip.price)} {trip.currency}</span>{trip.agencies && <Link to="/agencies/$slug" params={{ slug: trip.agencies.slug }} className="text-xs font-semibold text-primary">{trip.agencies.name}</Link>}</div></div></article>)}</div>
          )}
        </section>

        <section className="mt-14" aria-labelledby="agencies-heading">
          <div><p className="text-xs font-bold text-accent">Verified Agencies</p><h2 id="agencies-heading" className="mt-1 text-2xl font-bold">وكالات موثّقة تعمل في المنطقة</h2></div>
          {agencies === null ? <LoadingGrid /> : agencies.length === 0 ? <EmptyState icon={Building2} text="لا توجد وكالة موثّقة مرتبطة بهذه المنطقة حاليًا." /> : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{agencies.map((agency) => <Link key={agency.id} to="/agencies/$slug" params={{ slug: agency.slug }} className="rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card"><div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-secondary">{agency.logo_url ? <img src={agency.logo_url} alt={agency.name} className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5 text-primary" />}</div><div><h3 className="flex items-center gap-1 font-bold">{agency.name}<BadgeCheck className="h-4 w-4 text-accent" /></h3>{agency.wilaya && <p className="text-xs text-muted-foreground">{agency.wilaya}</p>}</div></div>{agency.description && <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{agency.description}</p>}</Link>)}</div>
          )}
        </section>
      </main>
    </div>
  );
}

function Info({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) { return <div className="rounded-2xl border border-border bg-card p-5 shadow-soft"><Icon className="h-5 w-5 text-primary" strokeWidth={1.75} /><p className="mt-3 text-xs text-muted-foreground">{label}</p><p className="mt-1 text-sm font-bold leading-6">{value}</p></div>; }
function Gallery({ images }: { images: { src: string; alt: string }[] }) { return <section aria-labelledby="gallery-heading"><h2 id="gallery-heading" className="sr-only">معرض الصور</h2><div className={`grid h-[24rem] gap-3 overflow-hidden rounded-2xl ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>{images.map((image, index) => <img key={image.src} src={image.src} alt={image.alt} loading={index === 0 ? "eager" : "lazy"} className={`h-full w-full object-cover ${index === 0 && images.length > 1 ? "row-span-2" : ""}`} />)}</div></section>; }
function LoadingGrid() { return <div className="mt-5 grid gap-4 sm:grid-cols-3">{[0, 1, 2].map((item) => <div key={item} className="h-48 animate-pulse rounded-2xl bg-secondary" />)}</div>; }
function EmptyState({ icon: Icon, text, action, to }: { icon: typeof RouteIcon; text: string; action?: string; to?: "/plan" }) { return <div className="mt-5 rounded-2xl border border-dashed border-border bg-secondary/50 p-8 text-center"><Icon className="mx-auto h-7 w-7 text-primary" strokeWidth={1.75} /><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{text}</p>{action && to && <Button asChild className="mt-4 rounded-full"><Link to={to}>{action}</Link></Button>}</div>; }