import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BedDouble, MapPin, Search } from "lucide-react";
import { stayCategories, stayCategoryLabel, stays, priceBreakdown, type StayCategory } from "@/data/stays";
import { TrustGuarantees, VerifiedBadge } from "@/components/RihlaVerified";
import { DemoNotice } from "@/components/DemoBadge";
import { formatDZ, DZD } from "@/lib/format";

export const Route = createFileRoute("/_app/stays")({
  head: () => ({
    meta: [
      { title: "إقامات رحلتي — فنادق ودور ضيافة ونزل بيئية في الجزائر" },
      { name: "description", content: "احجز إقامة جزائرية أصيلة: فنادق، بيوت شباب، دور ضيافة، شقق، تخييم، نزل بيئية وغرف — بسعر شفاف وتوثيق من رحلتي." },
      { property: "og:title", content: "إقامات رحلتي — ضيافة جزائرية أصيلة" },
      { property: "og:description", content: "فنادق ودور ضيافة مزابية ونزل صحراوية ومنتجعات ساحلية بسعر شفاف." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: StaysPage,
});

function StaysPage() {
  const [cat, setCat] = useState<StayCategory | "all">("all");
  const [query, setQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const list = useMemo(() => {
    const q = query.trim();
    return stays.filter((s) => {
      if (cat !== "all" && s.category !== cat) return false;
      if (verifiedOnly && !s.verified) return false;
      if (!q) return true;
      return s.name.includes(q) || s.wilaya.includes(q) || s.architecture.includes(q) || s.area.includes(q);
    });
  }, [cat, query, verifiedOnly]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-fade-in">
      <header className="border-b border-border pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">RIHLA STAYS</p>
        <h1 className="mt-2 flex items-center gap-2 text-3xl font-black sm:text-4xl">
          <BedDouble className="h-7 w-7 text-primary" strokeWidth={1.5} /> الإقامات
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          ضيافة جزائرية أصيلة: دور مزابية بغرداية، نزل صحراوية بالهقار وتاغيت، منتجعات ساحلية ببجاية وجيجل، ودور أندلسية بتلمسان.
        </p>
      </header>

      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
        <Search className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          maxLength={80}
          placeholder="ابحث باسم الإقامة أو الولاية أو الطراز المعماري"
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {stayCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
              cat === c.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 text-sm">
        <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="accent-[var(--primary)]" />
        عرض الإقامات الموثّقة من رحلتي فقط
      </label>

      <div className="mt-5">
        <DemoNotice>
          الأسعار والمرافق المعروضة نموذجية لأغراض العرض داخل النسخة التجريبية، وليست عروضًا تجارية نهائية.
        </DemoNotice>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => {
          const { rooms, taxes, total } = priceBreakdown(s.pricePerNight, 1, s.taxRate);
          return (
            <article key={s.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={s.image} alt={s.imageAlt} loading="lazy" className="h-full w-full object-cover" />
                <span className="absolute top-2 right-2 rounded-full bg-card/90 px-2 py-1 text-[10px] font-bold text-primary backdrop-blur">
                  {stayCategoryLabel(s.category)}
                </span>
                {s.verified && (
                  <span className="absolute bottom-2 right-2">
                    <VerifiedBadge />
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-sm font-bold leading-tight">{s.name}</h2>
                <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" strokeWidth={1.5} /> {s.wilaya} · {s.area}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{s.architecture}</p>
                <ul className="mt-2 flex flex-wrap gap-1">
                  {s.amenities.map((a) => (
                    <li key={a} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] text-secondary-foreground">{a}</li>
                  ))}
                </ul>
                <div className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">
                  <div className="flex justify-between"><span>سعر الليلة</span><span>{formatDZ(rooms)} {DZD}</span></div>
                  <div className="flex justify-between"><span>الرسوم</span><span>{formatDZ(taxes)} {DZD}</span></div>
                  <div className="mt-1 flex justify-between text-sm font-black text-foreground">
                    <span>الإجمالي لليلة</span><span>{formatDZ(total)} {DZD}</span>
                  </div>
                </div>
                <Link
                  to="/booking"
                  search={{ stay: s.id }}
                  className="mt-3 block rounded-xl bg-primary py-2.5 text-center text-sm font-bold text-primary-foreground"
                >
                  احجز هذه الإقامة
                </Link>
                <p className="mt-2 text-[10px] text-muted-foreground">الصورة: {s.imageCredit}</p>
              </div>
            </article>
          );
        })}
      </div>

      {list.length === 0 && <p className="py-14 text-center text-muted-foreground">لا توجد إقامات مطابقة لبحثك.</p>}

      <div className="mt-12">
        <TrustGuarantees />
      </div>
    </div>
  );
}
