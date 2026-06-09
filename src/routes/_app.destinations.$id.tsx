import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Star, MapPin, Heart, Share2, Check, Wifi, Coffee, Car, Waves } from "lucide-react";
import { destinations } from "@/data/destinations";
import { hotelsByDestination, type Hotel } from "@/data/hotels";

export const Route = createFileRoute("/_app/destinations/$id")({
  loader: ({ params }) => {
    const d = destinations.find((x) => x.id === params.id);
    if (!d) throw notFound();
    return d;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.name} — رحلتي` },
      { name: "description", content: loaderData.description },
      { property: "og:title", content: `${loaderData.name} — رحلتي` },
      { property: "og:description", content: loaderData.description },
      { property: "og:image", content: loaderData.image },
    ] : [],
  }),
  component: Details,
  notFoundComponent: () => <div className="p-8 text-center">الوجهة غير موجودة</div>,
  errorComponent: ({ reset }) => (
    <div className="p-8 text-center">
      <p>حدث خطأ</p>
      <button onClick={reset} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl">إعادة المحاولة</button>
    </div>
  ),
});

const reviews = [
  { name: "أمينة بن علي", rating: 5, text: "تجربة لا تُنسى! المكان ساحر والخدمة ممتازة.", date: "منذ شهر" },
  { name: "كريم محمدي", rating: 5, text: "أنصح بشدة بزيارة هذا المكان. صور لا تُوصف الجمال الحقيقي.", date: "منذ 3 أشهر" },
  { name: "سارة بوزيد", rating: 4, text: "رحلة رائعة، التنظيم كان ممتازًا والمرشد محترف جدًا.", date: "منذ 6 أشهر" },
];

function Details() {
  const d = Route.useLoaderData();

  return (
    <div className="animate-fade-in">
      <div className="relative h-80 sm:h-[28rem] overflow-hidden">
        <img src={d.image} alt={d.name} width={1600} height={1200} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        <div className="absolute top-4 inset-x-4 flex justify-between">
          <Link to="/explore" className="h-10 w-10 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-soft" aria-label="رجوع">
            <ArrowRight className="h-5 w-5" />
          </Link>
          <div className="flex gap-2">
            <button className="h-10 w-10 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-soft" aria-label="مشاركة">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="h-10 w-10 rounded-full bg-background/90 backdrop-blur flex items-center justify-center shadow-soft" aria-label="حفظ">
              <Heart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 -mt-12 relative z-10">
        <div className="bg-card rounded-3xl p-6 shadow-card">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div>
              <h1 className="text-2xl font-bold">{d.name}</h1>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-4 w-4" /> {d.country}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-warning/20 text-warning-foreground px-3 py-1.5 rounded-full text-sm font-bold">
              <Star className="h-4 w-4 fill-warning text-warning" />
              {d.rating}
              <span className="text-muted-foreground font-normal">({d.reviews})</span>
            </div>
          </div>

          <p className="text-foreground/85 leading-relaxed mt-4">{d.description}</p>

          <div className="mt-6">
            <h3 className="font-bold mb-3">أبرز المعالم</h3>
            <div className="grid grid-cols-2 gap-2">
              {d.highlights.map((h: string) => (
                <div key={h} className="flex items-center gap-2 text-sm bg-secondary rounded-xl p-3">
                  <Check className="h-4 w-4 text-success shrink-0" />
                  {h}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">أماكن الإقامة المتاحة</h3>
              <span className="text-xs text-muted-foreground">{hotelsByDestination(d.id).length} خيار</span>
            </div>
            <div className="space-y-3">
              {hotelsByDestination(d.id).map((h) => (
                <HotelCard key={h.id} hotel={h} destId={d.id} />
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <h3 className="font-bold mb-4">آراء المسافرين</h3>
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={i} className="bg-secondary/50 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                        {r.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.date}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3 w-3 ${j < r.rating ? "fill-warning text-warning" : "text-border"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-16 inset-x-0 z-30 bg-background/95 backdrop-blur-xl border-t border-border">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">يبدأ من</p>
            <p className="text-xl font-bold text-primary">{d.price.toLocaleString("ar")} <span className="text-sm font-normal">دج / ليلة</span></p>
          </div>
          <Link
            to="/booking"
            search={{ id: d.id }}
            className="px-6 py-3 rounded-2xl font-bold text-primary-foreground shadow-glow hover:scale-105 transition-transform"
            style={{ background: "var(--gradient-primary)" }}
          >
            احجز الآن
          </Link>
        </div>
      </div>
    </div>
  );
}

function amenityIcon(a: string) {
  if (a.includes("واي")) return <Wifi className="h-3 w-3" />;
  if (a.includes("فطار") || a.includes("مطعم")) return <Coffee className="h-3 w-3" />;
  if (a.includes("موقف") || a.includes("سيارات")) return <Car className="h-3 w-3" />;
  if (a.includes("مسبح") || a.includes("شاطئ") || a.includes("بحر")) return <Waves className="h-3 w-3" />;
  return <Check className="h-3 w-3" />;
}

function HotelCard({ hotel, destId }: { hotel: Hotel; destId: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-card transition-all group">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative sm:w-48 h-40 sm:h-auto shrink-0">
          <img src={hotel.image} alt={hotel.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">{hotel.type}</span>
        </div>
        <div className="flex-1 p-3 sm:p-4 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-bold leading-tight">{hotel.name}</h4>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {hotel.distance}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-lg text-xs font-bold shrink-0">
              <Star className="h-3 w-3 fill-primary" /> {hotel.rating}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {hotel.amenities.slice(0, 4).map((a) => (
              <span key={a} className="inline-flex items-center gap-1 text-[10px] bg-secondary text-muted-foreground px-2 py-1 rounded-full">
                {amenityIcon(a)} {a}
              </span>
            ))}
          </div>
          {hotel.freeCancellation && (
            <p className="text-[11px] text-success font-semibold mt-2 flex items-center gap-1">
              <Check className="h-3 w-3" /> إلغاء مجاني
            </p>
          )}
          <div className="mt-auto pt-3 flex items-end justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground">{hotel.reviews.toLocaleString("ar")} تقييم</p>
              <p className="font-black text-primary text-lg leading-none">
                {hotel.pricePerNight.toLocaleString("ar")}<span className="text-[11px] font-normal text-muted-foreground"> دج/ليلة</span>
              </p>
            </div>
            <Link
              to="/booking"
              search={{ id: destId, hotel: hotel.id }}
              className="px-4 py-2 rounded-xl text-sm font-bold text-primary-foreground hover:scale-105 transition-transform"
              style={{ background: "var(--gradient-primary)" }}
            >
              احجز
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
