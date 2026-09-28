import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { AlgeriaMap } from "@/components/AlgeriaMap";
import { Button } from "@/components/ui/button";
import { regions, wilayas, type Region } from "@/data/wilayas";
import { getTourismTypes, tourismFilters, tourismLabel, type TourismType } from "@/data/discover";

export const Route = createFileRoute("/_app/discover/")({
  head: () => ({
    meta: [
      { title: "اكتشف الجزائر — وجهات وولايات | رحلتي" },
      { name: "description", content: "استكشف ولايات الجزائر على خريطة تفاعلية، وصفِّ الوجهات حسب الشواطئ والجبال والصحراء والتراث والطبيعة والمغامرة والمدن." },
      { property: "og:title", content: "اكتشف الجزائر — رحلتي" },
      { property: "og:description", content: "خريطة تفاعلية ووجهات جزائرية حقيقية تساعدك على اختيار رحلتك القادمة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<Region | "all">("all");
  const [tourismType, setTourismType] = useState<TourismType | "all">("all");

  const filtered = useMemo(() => wilayas.filter((wilaya) => {
    const tourismTypes = getTourismTypes(wilaya);
    const text = `${wilaya.name} ${wilaya.tagline} ${wilaya.intro} ${wilaya.nature.join(" ")} ${wilaya.history.join(" ")} ${wilaya.activities.join(" ")}`;
    return (region === "all" || wilaya.region === region)
      && (tourismType === "all" || tourismTypes.includes(tourismType))
      && (!query.trim() || text.includes(query.trim()));
  }), [query, region, tourismType]);

  return (
    <div className="animate-fade-in pb-8">
      <section className="border-b border-border bg-secondary/45">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent font-latin">Discover Algeria</p>
          <div className="mt-2 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="text-3xl font-bold sm:text-5xl">اكتشف الجزائر</h1>
              <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">من زرقة المتوسط إلى صمت الطاسيلي، اختر نوع التجربة والمنطقة التي تناسبك.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-soft">
              <MapPin className="h-4 w-4 text-primary" strokeWidth={1.75} />
              {filtered.length} وجهة متاحة
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <section aria-labelledby="map-heading">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="map-heading" className="text-2xl font-bold">اختر منطقتك على الخريطة</h2>
              <p className="mt-1 text-sm text-muted-foreground">اضغط على نقطة ولاية للانتقال مباشرة إلى دليلها.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map((item) => (
                <Button key={item.id} type="button" size="sm" variant={region === item.id ? "default" : "outline"} className="rounded-full" onClick={() => setRegion(item.id)}>
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <AlgeriaMap region={region} onRegionChange={setRegion} destinationPath="/discover/$id" showRegionControls={false} />
        </section>

        <section className="mt-10" aria-labelledby="destinations-heading">
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft focus-within:ring-2 focus-within:ring-ring/30">
            <Search className="h-5 w-5 text-primary" strokeWidth={1.75} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none" placeholder="ابحث عن ولاية، معلم أو نشاط…" aria-label="ابحث في وجهات الجزائر" />
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide" aria-label="تصنيف الوجهات">
            {tourismFilters.map((item) => {
              const Icon = item.icon;
              return (
                <Button key={item.id} type="button" variant={tourismType === item.id ? "default" : "outline"} className="shrink-0 rounded-full" onClick={() => setTourismType(item.id)} aria-pressed={tourismType === item.id}>
                  {Icon && <Icon className="h-4 w-4" strokeWidth={1.75} />}{item.label}
                </Button>
              );
            })}
          </div>

          <div className="mt-7 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-accent">وجهات مختارة</p>
              <h2 id="destinations-heading" className="mt-1 text-2xl font-bold">أماكن تستحق الاكتشاف</h2>
            </div>
            <p className="text-sm text-muted-foreground">{filtered.length} نتيجة</p>
          </div>

          {filtered.length > 0 ? (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((wilaya) => {
                const types = getTourismTypes(wilaya);
                return (
                  <article key={wilaya.id} className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-card">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img src={wilaya.image} alt={wilaya.imageAlt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-x-0 top-0 flex flex-wrap gap-1.5 p-3">
                        {types.slice(0, 2).map((type) => <span key={type} className="rounded-full border border-card/30 bg-primary-glow/80 px-2.5 py-1 text-[11px] font-bold text-primary-foreground backdrop-blur">{tourismLabel(type)}</span>)}
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-xs font-bold text-accent">ولاية {wilaya.code}</p>
                      <h3 className="mt-1 text-xl font-bold">{wilaya.name}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{wilaya.intro}</p>
                      <Button asChild className="mt-5 w-full rounded-full">
                        <Link to="/discover/$id" params={{ id: wilaya.id }}>اكتشف <ArrowLeft className="h-4 w-4" strokeWidth={1.75} /></Link>
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-secondary/50 px-5 py-14 text-center">
              <p className="font-bold">لا توجد وجهات مطابقة</p>
              <p className="mt-1 text-sm text-muted-foreground">جرّب تغيير الفئة أو المنطقة أو عبارة البحث.</p>
              <Button type="button" variant="outline" className="mt-4 rounded-full" onClick={() => { setQuery(""); setRegion("all"); setTourismType("all"); }}>مسح الفلاتر</Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}