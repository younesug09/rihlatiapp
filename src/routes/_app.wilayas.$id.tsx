import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Landmark, Mountain, Palette, UtensilsCrossed, Bike, CalendarDays, MapPin } from "lucide-react";
import { getWilaya, wilayas } from "@/data/wilayas";
import { hotels } from "@/data/hotels";
import { DemoNotice } from "@/components/DemoBadge";

export const Route = createFileRoute("/_app/wilayas/$id")({
  loader: ({ params }) => {
    const w = getWilaya(params.id);
    if (!w) throw notFound();
    return { w };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "الولاية غير متوفرة — رحلتي" }, { name: "robots", content: "noindex" }] };
    }
    const { w } = loaderData;
    const title = `${w.name} — ${w.tagline} | رحلتي`;
    return {
      meta: [
        { title },
        { name: "description", content: w.intro },
        { property: "og:title", content: title },
        { property: "og:description", content: w.intro },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: WilayaDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-6xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold mb-2">لم نجد هذه الولاية</h1>
      <Link to="/wilayas" className="text-primary font-semibold">العودة إلى الولايات</Link>
    </div>
  ),
});

function WilayaDetail() {
  const { w } = Route.useLoaderData();
  const stays = hotels.filter((h) => h.destinationId === w.id).slice(0, 3);
  const nearbyWilayas = wilayas.filter((x) => w.nearby.includes(x.name));

  const sections = [
    { icon: Mountain, title: "الطبيعة", items: w.nature },
    { icon: Landmark, title: "التاريخ", items: w.history },
    { icon: Palette, title: "الثقافة", items: w.culture },
    { icon: UtensilsCrossed, title: "المطاعم والمأكولات", items: w.food },
    { icon: Bike, title: "الأنشطة", items: w.activities },
    { icon: CalendarDays, title: "الفعاليات", items: w.events },
  ];

  return (
    <div className="animate-fade-in">
      <section className="relative h-[22rem] sm:h-[28rem] overflow-hidden">
        <img src={w.image} alt={`منظر من ولاية ${w.name}`} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
        <div className="relative h-full mx-auto max-w-6xl px-4 flex flex-col justify-end pb-8 text-white">
          <Link to="/wilayas" className="inline-flex items-center gap-1 text-sm text-white/80 mb-3 w-fit">
            <ArrowRight className="h-4 w-4" /> كل الولايات
          </Link>
          <span className="text-[11px] font-bold tracking-[0.3em] text-white/70">ولاية رقم {w.code}</span>
          <h1 className="text-4xl sm:text-5xl font-bold">{w.name}</h1>
          <p className="text-white/85 mt-1">{w.tagline}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-lg leading-relaxed max-w-2xl mb-6">{w.intro}</p>
        <DemoNotice />

        <div className="grid gap-5 sm:grid-cols-2 mt-8">
          {sections.map((s) => (
            <div key={s.title} className="rounded-3xl border border-border bg-card p-5">
              <h2 className="flex items-center gap-2 font-bold mb-3">
                <s.icon className="h-5 w-5 text-primary" />
                {s.title}
              </h2>
              <ul className="space-y-1.5">
                {s.items.map((i) => (
                  <li key={i} className="text-sm text-muted-foreground flex gap-2">
                    <span className="text-primary">•</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {stays.length > 0 && (
          <section className="mt-10">
            <h2 className="text-xl font-bold mb-3">إقامات في {w.name}</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {stays.map((h) => (
                <div key={h.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                  <img src={h.image} alt={h.name} loading="lazy" className="h-32 w-full object-cover" />
                  <div className="p-3">
                    <p className="font-semibold text-sm">{h.name}</p>
                    <p className="text-xs text-muted-foreground">{h.price.toLocaleString()} دج / ليلة</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" /> أماكن قريبة
          </h2>
          <div className="flex flex-wrap gap-2">
            {w.nearby.map((n) => {
              const target = nearbyWilayas.find((x) => x.name === n);
              return target ? (
                <Link
                  key={n}
                  to="/wilayas/$id"
                  params={{ id: target.id }}
                  className="px-4 py-2 rounded-full border border-border bg-card text-sm hover:border-primary transition-colors"
                >
                  {n}
                </Link>
              ) : (
                <span key={n} className="px-4 py-2 rounded-full border border-border bg-card text-sm text-muted-foreground">
                  {n}
                </span>
              );
            })}
          </div>
        </section>

        <div className="mt-10 rounded-3xl p-6 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
          <h3 className="text-xl font-bold mb-2">خطّط رحلتك إلى {w.name}</h3>
          <p className="text-sm text-white/85 mb-4">برنامج يومي مقترح حسب أيامك وميزانيتك ونوع رحلتك.</p>
          <Link to="/plan" search={{ to: w.id }} className="inline-flex bg-white text-primary px-4 py-2 rounded-xl text-sm font-bold">
            ابدأ التخطيط
          </Link>
        </div>
      </div>
    </div>
  );
}
