import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Download, Stamp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { wilayas } from "@/data/wilayas";
import { PassportStamp, type StampId } from "@/components/PassportStamp";
import { DemoNotice } from "@/components/DemoBadge";

export const Route = createFileRoute("/_app/passport")({
  head: () => ({
    meta: [
      { title: "جواز رحلتي — اكتشف 58 ولاية" },
      { name: "description", content: "جواز سفر رقمي يتتبع الولايات التي اكتشفتها عبر رحلاتك المكتملة مع أختام وبطاقة رحلتي الرقمية." },
      { property: "og:title", content: "جواز رحلتي — اكتشف 58 ولاية" },
      { property: "og:description", content: "تتبّع اكتشافاتك عبر الولايات الجزائرية واجمع أختام رحلتي." },
    ],
  }),
  component: Passport,
});

const TOTAL_WILAYAS = 58;

function Passport() {
  const { user } = useAuth();
  const [visited, setVisited] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [vip, setVip] = useState(false);

  useEffect(() => {
    if (!user) { setLoaded(true); return; }
    void (async () => {
      const { data } = await supabase
        .from("bookings")
        .select("destination_id, status")
        .eq("status", "completed");
      const ids = Array.from(new Set((data ?? []).map((b) => b.destination_id).filter(Boolean) as string[]));
      setVisited(ids);
      const { data: badges } = await supabase.from("user_badges").select("badge").eq("user_id", user.id);
      setVip((badges ?? []).some((b) => b.badge === "vip_flexstay"));
      setLoaded(true);
    })();
  }, [user]);

  const visitedWilayas = wilayas.filter((w) => visited.includes(w.id));
  const count = visitedWilayas.length;
  const pct = Math.round((count / TOTAL_WILAYAS) * 100);

  const south = visitedWilayas.filter((w) => w.region === "south").length;
  const coastal = visitedWilayas.filter((w) => w.nature.some((n) => n.includes("شاطئ") || n.includes("ساحل") || n.includes("بحر"))).length;
  const heritage = visitedWilayas.filter((w) => w.history.length > 0).length;

  const stamps: { id: StampId; label: string; earned: boolean; hint: string }[] = [
    { id: "explorer", label: "مستكشف", earned: count >= 1, hint: "أكمل رحلة واحدة" },
    { id: "coastal", label: "ابن الساحل", earned: coastal >= 2, hint: "ولايتان ساحليتان" },
    { id: "heritage", label: "صائد التراث", earned: heritage >= 3, hint: "٣ ولايات تاريخية" },
    { id: "desert", label: "مستكشف الصحراء", earned: south >= 2, hint: "ولايتان في الجنوب" },
    { id: "algeria-lover", label: "عاشق الجزائر", earned: count >= 10, hint: "١٠ ولايات" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 animate-fade-in">
      {vip && <div className="mb-4 rounded-lg border border-accent/50 bg-accent/10 p-4 text-center"><p className="text-xs font-bold tracking-widest text-accent font-latin">VIP · FLEXSTAY</p><p className="mt-1 font-black">شارة VIP — شكرًا لمرونتك مع رحلتي</p></div>}
      <header className="mb-5">
        <h1 className="flex items-center gap-2 text-2xl font-black">
          <Stamp className="h-6 w-6 text-primary" strokeWidth={1.5} /> جواز رحلتي
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          يُختم الجواز تلقائيًا عند اكتمال كل رحلة تحجزها عبر رحلتي.
        </p>
      </header>

      <section className="mb-6 rounded-3xl border border-border bg-card p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground">الولايات المكتشفة</p>
            <p className="text-4xl font-black text-primary">
              {count} <span className="text-base font-bold text-muted-foreground">/ {TOTAL_WILAYAS}</span>
            </p>
          </div>
          <Compass className="h-10 w-10 text-secondary-foreground" strokeWidth={1.5} />
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{pct}% من خريطة الجزائر</p>
      </section>

      {!user && (
        <div className="mb-6 rounded-2xl border border-border bg-card p-4 text-sm">
          <p className="mb-2">سجّل الدخول ليُفتح جوازك وتُحفظ أختامك.</p>
          <Link to="/auth" className="font-bold text-primary">تسجيل الدخول</Link>
        </div>
      )}

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold">الأختام</h2>
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-card p-5 sm:grid-cols-5">
          {stamps.map((s) => (
            <div key={s.id}>
              <PassportStamp id={s.id} label={s.label} earned={s.earned} />
              <p className="mt-1 text-center text-[10px] text-muted-foreground">{s.hint}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold">بطاقة رحلتي الرقمية</h2>
        <div className="rounded-3xl border border-border bg-primary p-6 text-primary-foreground">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.35em] opacity-80">RIHLA DIGITAL CARD</p>
              <p className="mt-2 text-xl font-black">
                {user?.user_metadata?.["full_name"] ?? "مسافر رحلتي"}
              </p>
            </div>
            <Stamp className="h-8 w-8 opacity-80" strokeWidth={1.5} />
          </div>
          <div className="mt-6 flex items-end justify-between text-sm">
            <div>
              <p className="text-[10px] opacity-80">الولايات</p>
              <p className="font-black">{count} / {TOTAL_WILAYAS}</p>
            </div>
            <div>
              <p className="text-[10px] opacity-80">الأختام</p>
              <p className="font-black">{stamps.filter((s) => s.earned).length} / {stamps.length}</p>
            </div>
            <p dir="ltr" className="font-mono text-xs opacity-80">
              RIHLA-{(user?.id ?? "GUEST0000").slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold print:hidden"
        >
          <Download className="h-4 w-4" strokeWidth={1.5} /> حفظ البطاقة (PDF)
        </button>
      </section>

      <section className="mb-6">
        <h2 className="mb-3 text-lg font-bold">ولاياتك</h2>
        {!loaded ? (
          <p className="text-sm text-muted-foreground">جارٍ التحميل…</p>
        ) : visitedWilayas.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            لا توجد رحلات مكتملة بعد. ابدأ من{" "}
            <Link to="/wilayas" className="font-bold text-primary">اكتشف الجزائر</Link>.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visitedWilayas.map((w) => (
              <li key={w.id}>
                <Link to="/wilayas/$id" params={{ id: w.id }} className="block overflow-hidden rounded-2xl border border-border bg-card">
                  <img src={w.image} alt={w.imageAlt} loading="lazy" className="h-24 w-full object-cover" />
                  <span className="block p-2 text-sm font-bold">{w.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <DemoNotice />
    </div>
  );
}
