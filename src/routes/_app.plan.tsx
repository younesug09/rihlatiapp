import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Printer, Share2, Sparkles } from "lucide-react";
import { wilayas, tripTypes, durations, type TripType } from "@/data/wilayas";
import { hotels } from "@/data/hotels";
import { DemoNotice } from "@/components/DemoBadge";

type PlanSearch = { to?: string };

export const Route = createFileRoute("/_app/plan")({
  validateSearch: (search: Record<string, unknown>): PlanSearch => ({
    to: typeof search.to === "string" ? search.to : undefined,
  }),
  head: () => ({
    meta: [
      { title: "خطّط رحلتي — برنامج يومي مقترح | رحلتي RIHLATY" },
      { name: "description", content: "أنشئ برنامجًا يوميًا لرحلتك داخل الجزائر حسب الولاية وعدد الأيام ونوع الرحلة، مع إمكانية الطباعة والمشاركة." },
      { property: "og:title", content: "خطّط رحلتي — برنامج يومي مقترح | رحلتي" },
      { property: "og:description", content: "برنامج رحلة يومي داخل الجزائر حسب اهتماماتك ومدة إقامتك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const { to } = Route.useSearch();
  const [wilayaId, setWilayaId] = useState(to ?? wilayas[0].id);
  const [days, setDays] = useState<number>(3);
  const [type, setType] = useState<TripType>("cultural");

  const wilaya = wilayas.find((w) => w.id === wilayaId) ?? wilayas[0];
  const stays = hotels.filter((h) => h.destinationId === wilaya.id).slice(0, 2);

  const itinerary = useMemo(() => {
    const pools: Record<string, string[]> = {
      morning: [...wilaya.nature, ...wilaya.activities],
      afternoon: [...wilaya.history, ...wilaya.culture],
      evening: [...wilaya.food, ...wilaya.events, ...wilaya.culture],
    };
    const pick = (arr: string[], i: number) => (arr.length ? arr[i % arr.length] : "وقت حر لاستكشاف المدينة");
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      morning: pick(pools.morning, i),
      afternoon: pick(pools.afternoon, i),
      evening: pick(pools.evening, i),
    }));
  }, [wilaya, days]);

  const share = async () => {
    const text = `برنامج رحلتي إلى ${wilaya.name} — ${days} أيام\n` +
      itinerary.map((d) => `اليوم ${d.day}: ${d.morning} / ${d.afternoon} / ${d.evening}`).join("\n");
    if (navigator.share) {
      try { await navigator.share({ title: `رحلتي إلى ${wilaya.name}`, text }); return; } catch { /* cancelled */ }
    }
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <p className="text-sm font-semibold text-primary mb-1">RIHLATY PLANNER</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">خطّط رحلتي</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          اختر الولاية وعدد الأيام ونوع الرحلة، وسنقترح لك برنامجًا يوميًا قابلًا للطباعة والمشاركة.
        </p>
      </header>

      <DemoNotice />

      <section className="mt-6 grid gap-4 sm:grid-cols-3 print:hidden">
        <label className="block">
          <span className="text-sm font-semibold">الولاية</span>
          <select
            value={wilayaId}
            onChange={(e) => setWilayaId(e.target.value)}
            className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
          >
            {wilayas.map((w) => (
              <option key={w.id} value={w.id}>{w.name}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold">المدة</span>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
          >
            {durations.map((d) => (
              <option key={d.id} value={d.days}>{d.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-semibold">نوع الرحلة</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TripType)}
            className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
          >
            {tripTypes.filter((t) => t.id !== "all").map((t) => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            برنامج {days} أيام في {wilaya.name}
          </h2>
          <div className="flex gap-2 print:hidden">
            <button onClick={share} className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm">
              <Share2 className="h-4 w-4" /> مشاركة
            </button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1 rounded-xl bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold">
              <Printer className="h-4 w-4" /> طباعة
            </button>
          </div>
        </div>

        <ol className="space-y-3">
          {itinerary.map((d) => (
            <li key={d.day} className="rounded-2xl border border-border bg-card p-4">
              <p className="flex items-center gap-2 font-bold mb-2">
                <CalendarDays className="h-4 w-4 text-primary" /> اليوم {d.day}
              </p>
              <div className="grid gap-2 sm:grid-cols-3 text-sm">
                <p><span className="text-muted-foreground">صباحًا: </span>{d.morning}</p>
                <p><span className="text-muted-foreground">ظهرًا: </span>{d.afternoon}</p>
                <p><span className="text-muted-foreground">مساءً: </span>{d.evening}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {stays.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-3">اقتراحات إقامة</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {stays.map((h) => (
              <div key={h.id} className="flex gap-3 rounded-2xl border border-border bg-card overflow-hidden">
                <img src={h.image} alt={h.name} loading="lazy" className="h-24 w-28 object-cover" />
                <div className="py-3 pe-3">
                  <p className="font-semibold text-sm">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{h.pricePerNight.toLocaleString()} دج / ليلة</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-10 print:hidden">
        <Link to="/wilayas/$id" params={{ id: wilaya.id }} className="text-sm font-semibold text-primary">
          اكتشف {wilaya.name} بالتفصيل ←
        </Link>
      </div>
    </div>
  );
}
