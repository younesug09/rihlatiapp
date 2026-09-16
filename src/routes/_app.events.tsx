import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, CalendarDays, MapPin } from "lucide-react";
import { buildIcs, events, type RihlaEvent } from "@/data/events";
import { DemoNotice } from "@/components/DemoBadge";

export const Route = createFileRoute("/_app/events")({
  head: () => ({
    meta: [
      { title: "الفعاليات السياحية في الجزائر — رحلتي" },
      { name: "description", content: "أجندة الفعاليات السياحية والثقافية والتراثية عبر الولايات الجزائرية مع إمكانية الإضافة إلى التقويم." },
      { property: "og:title", content: "الفعاليات السياحية في الجزائر — رحلتي" },
      { property: "og:description", content: "أجندة فعاليات ثقافية وتراثية وطبيعية عبر الولايات الجزائرية." },
    ],
  }),
  component: Events,
});

type RangeId = "today" | "week" | "month" | "all";

const ranges: { id: RangeId; label: string }[] = [
  { id: "today", label: "اليوم" },
  { id: "week", label: "هذا الأسبوع" },
  { id: "month", label: "هذا الشهر" },
  { id: "all", label: "كل الفعاليات" },
];

function inRange(e: RihlaEvent, range: RangeId) {
  if (range === "all") return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const limit = new Date(today);
  if (range === "today") limit.setDate(limit.getDate());
  if (range === "week") limit.setDate(limit.getDate() + 7);
  if (range === "month") limit.setDate(limit.getDate() + 30);
  const start = new Date(e.start);
  const end = new Date(e.end);
  return end >= today && start <= limit;
}

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("ar-DZ", { day: "numeric", month: "long", year: "numeric" });

function addToCalendar(e: RihlaEvent) {
  const blob = new Blob([buildIcs(e)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${e.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

function Events() {
  const [range, setRange] = useState<RangeId>("all");
  const list = useMemo(
    () => events.filter((e) => inRange(e, range)).sort((a, b) => a.start.localeCompare(b.start)),
    [range],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in">
      <header className="border-b border-border pb-6">
        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">EVENTS</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">الفعاليات</h1>
        <p className="mt-3 text-muted-foreground">مواعيد ثقافية وتراثية وطبيعية عبر الولايات الجزائرية.</p>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        {ranges.map((r) => (
          <button
            key={r.id}
            onClick={() => setRange(r.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              range === r.id ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border hover:border-primary"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <DemoNotice>مواعيد الفعاليات المعروضة نموذجية لأغراض العرض، وليست جدولًا رسميًا معتمدًا.</DemoNotice>
      </div>

      <div className="mt-8 space-y-5">
        {list.map((e) => (
          <article key={e.id} className="grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)] rounded-2xl border border-border bg-card overflow-hidden">
            <div className="aspect-[4/3] sm:aspect-auto sm:h-full overflow-hidden">
              <img src={e.image} alt={e.imageAlt} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="p-5 min-w-0">
              <span className="text-xs font-semibold text-accent">{e.category}</span>
              <h2 className="mt-1 text-lg font-bold leading-snug">{e.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{e.summary}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {e.start === e.end ? fmt(e.start) : `${fmt(e.start)} — ${fmt(e.end)}`}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {e.place}
                </span>
              </div>
              <button
                onClick={() => addToCalendar(e)}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                <CalendarPlus className="h-4 w-4" strokeWidth={1.5} /> أضف إلى التقويم
              </button>
            </div>
          </article>
        ))}
        {list.length === 0 && <p className="py-16 text-center text-muted-foreground">لا توجد فعاليات في هذه الفترة.</p>}
      </div>
    </div>
  );
}
