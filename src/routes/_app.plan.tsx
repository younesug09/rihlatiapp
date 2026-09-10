import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Printer, Share2, Sparkles, Save, Trash2, Route as RouteIcon, Wallet, Users } from "lucide-react";
import { wilayas, tripTypes, durations, type TripType } from "@/data/wilayas";
import { hotels } from "@/data/hotels";
import { DemoNotice } from "@/components/DemoBadge";

type PlanSearch = { to?: string };

const transports = [
  { id: "car", label: "سيارة", perKm: 12, speed: 70 },
  { id: "bus", label: "حافلة", perKm: 5, speed: 55 },
  { id: "train", label: "قطار", perKm: 6, speed: 80 },
  { id: "plane", label: "طائرة", perKm: 22, speed: 500 },
] as const;

type TransportId = (typeof transports)[number]["id"];

type SavedTrip = {
  id: string;
  from: string;
  to: string;
  people: number;
  days: number;
  budget: number;
  type: TripType;
  transport: TransportId;
  createdAt: string;
};

const STORAGE_KEY = "rihlaty:trips";

function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}

export const Route = createFileRoute("/_app/plan")({
  validateSearch: (search: Record<string, unknown>): PlanSearch => ({
    to: typeof search.to === "string" ? search.to : undefined,
  }),
  head: () => ({
    meta: [
      { title: "خطّط رحلتي — برنامج يومي وميزانية تقديرية | رحلتي RIHLATY" },
      { name: "description", content: "خطط رحلتك داخل الجزائر: نقطة الانطلاق، الوجهة، عدد الأشخاص والأيام، الميزانية ووسيلة النقل — مع برنامج يومي قابل للحفظ والمشاركة والطباعة." },
      { property: "og:title", content: "خطّط رحلتي — برنامج يومي وميزانية تقديرية | رحلتي" },
      { property: "og:description", content: "برنامج رحلة يومي داخل الجزائر مع المسافات والنقل والإقامة والمطاعم والميزانية التقديرية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlanPage,
});

function PlanPage() {
  const { to } = Route.useSearch();
  const [fromId, setFromId] = useState("setif");
  const [wilayaId, setWilayaId] = useState(to ?? "jijel");
  const [people, setPeople] = useState(2);
  const [days, setDays] = useState<number>(3);
  const [budget, setBudget] = useState(30000);
  const [type, setType] = useState<TripType>("nature");
  const [transport, setTransport] = useState<TransportId>("car");
  const [saved, setSaved] = useState<SavedTrip[]>([]);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSaved(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const origin = wilayas.find((w) => w.id === fromId) ?? wilayas[0];
  const wilaya = wilayas.find((w) => w.id === wilayaId) ?? wilayas[1];
  const mode = transports.find((t) => t.id === transport)!;
  const stays = hotels.filter((h) => h.destinationId === wilaya.id).slice(0, 3);

  const km = distanceKm(origin, wilaya);
  const travelHours = Math.max(0.5, Math.round((km / mode.speed) * 10) / 10);

  const cost = useMemo(() => {
    const nightly = stays.length
      ? Math.round(stays.reduce((s, h) => s + h.pricePerNight, 0) / stays.length)
      : 6000;
    const rooms = Math.max(1, Math.ceil(people / 2));
    const stay = nightly * rooms * Math.max(1, days - 1);
    const travel = Math.round(km * 2 * mode.perKm * (mode.id === "car" ? 1 : people));
    const food = 1800 * people * days;
    const activities = 1200 * people * days;
    return { stay, travel, food, activities, total: stay + travel + food + activities };
  }, [stays, people, days, km, mode]);

  const itinerary = useMemo(() => {
    const pick = (arr: string[], i: number, fb: string) => (arr.length ? arr[i % arr.length] : fb);
    return Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      morning: i === 0
        ? `الانطلاق من ${origin.name} نحو ${wilaya.name} (${km} كم ≈ ${travelHours} سا بـ${mode.label})`
        : pick([...wilaya.nature, ...wilaya.activities], i, "وقت حر لاستكشاف المدينة"),
      afternoon: pick([...wilaya.history, ...wilaya.culture], i, "جولة في وسط المدينة"),
      evening: i === days - 1
        ? `عشاء وداعي ثم العودة إلى ${origin.name}`
        : pick([...wilaya.food, ...wilaya.events], i, "سهرة هادئة قرب الإقامة"),
      food: pick(wilaya.food, i, "مطاعم محلية في وسط المدينة"),
      activity: pick(wilaya.activities, i, "نشاط حر"),
      stay: stays.length ? stays[i % stays.length].name : "إقامة داخل المدينة",
      dayBudget: Math.round(cost.total / days),
    }));
  }, [wilaya, origin, days, km, travelHours, mode, stays, cost]);

  const summaryText = () =>
    `رحلتي: ${origin.name} → ${wilaya.name}\n${days} أيام • ${people} أشخاص • ${mode.label} • ${km} كم\n` +
    `ميزانية تقديرية: ${cost.total.toLocaleString()} دج\n` +
    itinerary.map((d) => `اليوم ${d.day}: ${d.morning} / ${d.afternoon} / ${d.evening}`).join("\n");

  const share = async () => {
    const text = summaryText();
    if (navigator.share) {
      try { await navigator.share({ title: `رحلتي إلى ${wilaya.name}`, text }); return; } catch { /* cancelled */ }
    }
    await navigator.clipboard.writeText(text);
    setFlash("تم نسخ تفاصيل الرحلة");
  };

  const saveTrip = () => {
    const trip: SavedTrip = {
      id: `${Date.now()}`,
      from: origin.id, to: wilaya.id, people, days, budget, type, transport,
      createdAt: new Date().toISOString(),
    };
    const next = [trip, ...saved].slice(0, 12);
    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setFlash("تم حفظ الرحلة على هذا الجهاز");
  };

  const removeTrip = (id: string) => {
    const next = saved.filter((t) => t.id !== id);
    setSaved(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const loadTrip = (t: SavedTrip) => {
    setFromId(t.from); setWilayaId(t.to); setPeople(t.people);
    setDays(t.days); setBudget(t.budget); setType(t.type); setTransport(t.transport);
  };

  const overBudget = cost.total > budget;

  useEffect(() => {
    if (!flash) return;
    const id = setTimeout(() => setFlash(""), 2500);
    return () => clearTimeout(id);
  }, [flash]);

  return (
    <div className="animate-fade-in mx-auto max-w-5xl px-4 py-8">
      <header className="mb-6">
        <p className="text-sm font-semibold text-primary mb-1">RIHLATY PLANNER</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">خطّط رحلتي</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          حدّد نقطة الانطلاق والوجهة وعدد الأشخاص والأيام والميزانية ووسيلة النقل — ونقترح لك برنامجًا يوميًا كاملًا.
        </p>
      </header>

      <DemoNotice />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 print:hidden">
        <Field label="أنطلق من">
          <select value={fromId} onChange={(e) => setFromId(e.target.value)} className={selectCls}>
            {wilayas.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </Field>

        <Field label="الوجهة">
          <select value={wilayaId} onChange={(e) => setWilayaId(e.target.value)} className={selectCls}>
            {wilayas.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </Field>

        <Field label="عدد الأشخاص">
          <input type="number" min={1} max={20} value={people}
            onChange={(e) => setPeople(Math.max(1, Number(e.target.value) || 1))} className={selectCls} />
        </Field>

        <Field label="عدد الأيام">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className={selectCls}>
            {durations.map((d) => <option key={d.id} value={d.days}>{d.label}</option>)}
          </select>
        </Field>

        <Field label="الميزانية (دج)">
          <input type="number" min={0} step={1000} value={budget}
            onChange={(e) => setBudget(Math.max(0, Number(e.target.value) || 0))} className={selectCls} />
        </Field>

        <Field label="نوع الرحلة">
          <select value={type} onChange={(e) => setType(e.target.value as TripType)} className={selectCls}>
            {tripTypes.filter((t) => t.id !== "all").map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </Field>

        <Field label="وسيلة النقل">
          <select value={transport} onChange={(e) => setTransport(e.target.value as TransportId)} className={selectCls}>
            {transports.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
          </select>
        </Field>

        <div className="flex items-end gap-2">
          <button onClick={saveTrip} className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold">
            <Save className="h-4 w-4" /> احفظ الرحلة
          </button>
        </div>
      </section>

      {flash && <p className="mt-3 text-sm font-medium text-primary print:hidden">{flash}</p>}

      {/* Summary */}
      <section className="mt-8 rounded-3xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">{origin.name} ← {wilaya.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {days} أيام • {people} أشخاص • {mode.label} • {km} كم ≈ {travelHours} سا
            </p>
          </div>
          <div className="flex gap-2 print:hidden">
            <button onClick={share} className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-2 text-sm">
              <Share2 className="h-4 w-4" /> شارك
            </button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1 rounded-xl bg-primary text-primary-foreground px-3 py-2 text-sm font-semibold">
              <Printer className="h-4 w-4" /> اطبع PDF
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-4 text-sm">
          <Stat icon={<RouteIcon className="h-4 w-4" />} label="النقل" value={`${cost.travel.toLocaleString()} دج`} />
          <Stat icon={<Users className="h-4 w-4" />} label="الإقامة" value={`${cost.stay.toLocaleString()} دج`} />
          <Stat icon={<Sparkles className="h-4 w-4" />} label="مطاعم وأنشطة" value={`${(cost.food + cost.activities).toLocaleString()} دج`} />
          <Stat icon={<Wallet className="h-4 w-4" />} label="الإجمالي التقديري" value={`${cost.total.toLocaleString()} دج`} />
        </div>

        <p className={`mt-3 text-sm font-medium ${overBudget ? "text-destructive" : "text-primary"}`}>
          {overBudget
            ? `التقدير يتجاوز ميزانيتك بـ ${(cost.total - budget).toLocaleString()} دج — جرّب تقليل الأيام أو اختيار إقامة أوفر.`
            : `ضمن ميزانيتك، ويتبقى نحو ${(budget - cost.total).toLocaleString()} دج.`}
        </p>
      </section>

      {/* Itinerary */}
      <section className="mt-8">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" /> برنامج {days} أيام في {wilaya.name}
        </h2>

        <ol className="space-y-3">
          {itinerary.map((d) => (
            <li key={d.day} className="rounded-2xl border border-border bg-card p-4">
              <p className="flex items-center gap-2 font-bold mb-3">
                <CalendarDays className="h-4 w-4 text-primary" />
                DAY {String(d.day).padStart(2, "0")}
              </p>
              <div className="grid gap-2 sm:grid-cols-3 text-sm">
                <p><span className="text-muted-foreground">08:00 صباحًا — </span>{d.morning}</p>
                <p><span className="text-muted-foreground">13:00 ظهرًا — </span>{d.afternoon}</p>
                <p><span className="text-muted-foreground">19:00 مساءً — </span>{d.evening}</p>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-4 text-xs text-muted-foreground">
                <p>النقل: {mode.label}</p>
                <p>الإقامة: {d.stay}</p>
                <p>المطاعم: {d.food}</p>
                <p>ميزانية اليوم: {d.dayBudget.toLocaleString()} دج</p>
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

      {saved.length > 0 && (
        <section className="mt-10 print:hidden">
          <h2 className="text-xl font-bold mb-3">رحلاتي المحفوظة</h2>
          <ul className="grid gap-2 sm:grid-cols-2">
            {saved.map((t) => {
              const f = wilayas.find((w) => w.id === t.from)?.name ?? t.from;
              const d = wilayas.find((w) => w.id === t.to)?.name ?? t.to;
              return (
                <li key={t.id} className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
                  <button onClick={() => loadTrip(t)} className="text-start">
                    <p className="text-sm font-semibold">{f} ← {d}</p>
                    <p className="text-xs text-muted-foreground">{t.days} أيام • {t.people} أشخاص</p>
                  </button>
                  <button onClick={() => removeTrip(t.id)} aria-label="حذف الرحلة" className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
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

const selectCls = "mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      {children}
    </label>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-secondary/50 px-4 py-3">
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">{icon}{label}</p>
      <p className="font-bold mt-1">{value}</p>
    </div>
  );
}
