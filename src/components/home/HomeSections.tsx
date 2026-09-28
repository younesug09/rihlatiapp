import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { MapPin, CalendarDays, Compass, Search, Building2, BadgeCheck, Star, ShieldCheck, Users, Route as RouteIcon, Quote, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { wilayas } from "@/data/wilayas";
import { formatDZ } from "@/lib/format";

const S = 1.75;

export function HeroSearch() {
  const navigate = useNavigate();
  const [dest, setDest] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("all");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = dest.trim();
    if (type === "stay") navigate({ to: "/stays" });
    else navigate({ to: "/explore", search: q ? { q } : {} });
  };
  return (
    <form
      onSubmit={submit}
      className="mt-10 mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr_auto] gap-2 rounded-3xl sm:rounded-full bg-card text-card-foreground p-2 shadow-2xl text-start"
    >
      <label className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-secondary transition-colors">
        <MapPin className="h-4 w-4 text-primary shrink-0" strokeWidth={S} />
        <input value={dest} onChange={(e) => setDest(e.target.value)} placeholder="الوجهة" aria-label="الوجهة" className="w-full bg-transparent outline-none text-sm" />
      </label>
      <label className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-secondary transition-colors">
        <CalendarDays className="h-4 w-4 text-primary shrink-0" strokeWidth={S} />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} aria-label="التاريخ" className="w-full bg-transparent outline-none text-sm" />
      </label>
      <label className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-secondary transition-colors">
        <Compass className="h-4 w-4 text-primary shrink-0" strokeWidth={S} />
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label="النوع" className="w-full bg-transparent outline-none text-sm">
          <option value="all">كل الأنواع</option>
          <option value="trip">رحلة</option>
          <option value="stay">إقامة</option>
          <option value="experience">تجربة</option>
        </select>
      </label>
      <button type="submit" className="rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-bold inline-flex items-center justify-center gap-2 hover:bg-primary-glow transition-colors">
        <Search className="h-4 w-4" strokeWidth={S} /> بحث
      </button>
    </form>
  );
}

function Head({ kicker, title, to }: { kicker: string; title: string; to?: "/discover" | "/wilayas" | "/explore" | "/stays" }) {
  return (
    <div className="flex items-end justify-between mb-5">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-accent uppercase font-latin">{kicker}</p>
        <h2 className="text-2xl sm:text-3xl font-bold mt-1">{title}</h2>
      </div>
      {to && (
        <Link to={to} className="text-sm font-semibold text-primary inline-flex items-center gap-1">
          عرض الكل <ArrowLeft className="h-4 w-4" strokeWidth={S} />
        </Link>
      )}
    </div>
  );
}

export function PopularDestinations() {
  const list = wilayas.slice(0, 6);
  return (
    <section className="mx-auto max-w-6xl px-4 mt-14">
      <Head kicker="Destinations populaires" title="الوجهات الأكثر طلبًا" to="/discover" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {list.map((w, i) => (
          <Link
            key={w.id}
            to="/discover/$id"
            params={{ id: w.id }}
            className={`group relative overflow-hidden rounded-2xl shadow-card hover:-translate-y-1 transition-all duration-300 ${i === 0 ? "md:row-span-2 aspect-[3/4] md:aspect-auto" : "aspect-[4/3]"}`}
          >
            <img src={w.image} alt={w.imageAlt ?? w.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-glow/90 via-primary-glow/20 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-4 text-primary-foreground">
              <p className="font-bold text-lg">{w.name}</p>
              <p className="text-xs opacity-85 inline-flex items-center gap-1"><MapPin className="h-3 w-3" strokeWidth={S} /> الجزائر</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

type Trip = { id: string; title: string; destination: string; cover_url: string | null; duration_days: number; price: number; agencies: { name: string; slug: string } | null };

export function FeaturedTrips() {
  const [trips, setTrips] = useState<Trip[] | null>(null);
  useEffect(() => {
    supabase
      .from("trips")
      .select("id, title, destination, cover_url, duration_days, price, agencies(name, slug)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => setTrips((data as unknown as Trip[]) ?? []));
  }, []);
  return (
    <section className="mx-auto max-w-6xl px-4 mt-14">
      <Head kicker="Featured Trips" title="رحلات مميزة من وكالات موثّقة" />
      {trips === null ? (
        <div className="grid sm:grid-cols-3 gap-4">{[0, 1, 2].map((i) => <div key={i} className="h-64 rounded-2xl bg-secondary animate-pulse" />)}</div>
      ) : trips.length === 0 ? (
        <Empty icon={RouteIcon} text="لا توجد رحلات منشورة بعد. ستظهر هنا رحلات الوكالات الموثّقة فور نشرها." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((t) => (
            <article key={t.id} className="group rounded-2xl bg-card border border-border overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300">
              <div className="aspect-[16/10] overflow-hidden bg-secondary">
                {t.cover_url && <img src={t.cover_url} alt={t.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />}
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground inline-flex items-center gap-1"><MapPin className="h-3 w-3" strokeWidth={S} /> {t.destination} · {t.duration_days} أيام</p>
                <h3 className="font-bold mt-1 line-clamp-1">{t.title}</h3>
                <div className="mt-3 flex items-center justify-between">
                  {t.agencies ? (
                    <Link to="/agencies/$slug" params={{ slug: t.agencies.slug }} className="text-xs font-semibold text-primary inline-flex items-center gap-1">
                      <BadgeCheck className="h-3.5 w-3.5 text-accent" strokeWidth={S} /> {t.agencies.name}
                    </Link>
                  ) : <span />}
                  <span className="font-bold text-primary">{formatDZ(t.price)} دج</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

type Agency = { id: string; slug: string; name: string; wilaya: string | null; logo_url: string | null; description: string | null };

export function TravelAgencies() {
  const [list, setList] = useState<Agency[] | null>(null);
  useEffect(() => {
    supabase
      .from("agencies")
      .select("id, slug, name, wilaya, logo_url, description")
      .eq("verification_status", "verified")
      .limit(8)
      .then(({ data }) => setList((data as Agency[]) ?? []));
  }, []);
  return (
    <section className="mx-auto max-w-6xl px-4 mt-14">
      <Head kicker="Travel Agencies" title="وكالات سياحية موثّقة" />
      {list === null ? (
        <div className="h-28 rounded-2xl bg-secondary animate-pulse" />
      ) : list.length === 0 ? (
        <Empty icon={Building2} text="لا توجد وكالات موثّقة بعد. هل أنت وكالة سياحية؟ أنشئ حسابًا وقدّم ملفك للتوثيق." cta />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {list.map((a) => (
            <Link key={a.id} to="/agencies/$slug" params={{ slug: a.slug }} className="rounded-2xl bg-card border border-border p-4 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all">
              <div className="h-12 w-12 rounded-xl bg-secondary overflow-hidden flex items-center justify-center">
                {a.logo_url ? <img src={a.logo_url} alt={a.name} className="h-full w-full object-cover" /> : <Building2 className="h-5 w-5 text-primary" strokeWidth={S} />}
              </div>
              <p className="mt-3 font-bold inline-flex items-center gap-1">{a.name} <BadgeCheck className="h-4 w-4 text-accent" strokeWidth={S} /></p>
              {a.wilaya && <p className="text-xs text-muted-foreground">{a.wilaya}</p>}
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export function WhyRihla() {
  const items = [
    { icon: Compass, t: "وجهات حقيقية", d: "ولايات ومواقع جزائرية بصور ومعلومات دقيقة." },
    { icon: ShieldCheck, t: "وكالات موثّقة", d: "نراجع وثائق كل وكالة قبل ظهورها للمسافرين." },
    { icon: RouteIcon, t: "تخطيط ذكي", d: "خطّط رحلتك يومًا بيوم مع تقدير واضح للتكاليف." },
    { icon: Users, t: "مجتمع مسافرين", d: "قصص وتجارب يشاركها مسافرون حقيقيون." },
  ];
  return (
    <section className="mt-16 bg-primary-glow text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-xs font-bold tracking-[0.2em] text-accent uppercase font-latin">Why RIHLA?</p>
        <h2 className="text-2xl sm:text-3xl font-bold mt-1 mb-8">لماذا رحلتي؟</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((i) => (
            <div key={i.t} className="rounded-2xl bg-card/10 border border-card/15 p-5 hover:bg-card/15 transition-colors">
              <i.icon className="h-6 w-6 text-accent" strokeWidth={S} />
              <p className="mt-3 font-bold">{i.t}</p>
              <p className="mt-1 text-sm opacity-80 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type Review = { id: string; rating: number; comment: string | null; created_at: string };

export function Testimonials() {
  const [list, setList] = useState<Review[] | null>(null);
  useEffect(() => {
    supabase
      .from("reviews")
      .select("id, rating, comment, created_at")
      .not("comment", "is", null)
      .gte("rating", 4)
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setList((data as Review[]) ?? []));
  }, []);
  return (
    <section className="mx-auto max-w-6xl px-4 mt-14 mb-6">
      <Head kicker="Testimonials" title="ماذا يقول المسافرون" />
      {list === null ? (
        <div className="h-32 rounded-2xl bg-secondary animate-pulse" />
      ) : list.length === 0 ? (
        <Empty icon={Quote} text="لا توجد آراء بعد. ستظهر هنا تقييمات المسافرين الحقيقية بعد رحلاتهم." />
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {list.map((r) => (
            <figure key={r.id} className="rounded-2xl bg-card border border-border p-5 shadow-soft">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-accent text-accent" : "text-border"}`} strokeWidth={S} />
                ))}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed">«{r.comment}»</blockquote>
              <figcaption className="mt-3 text-xs text-muted-foreground">مسافر على رحلتي</figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

function Empty({ icon: Icon, text, cta }: { icon: typeof Quote; text: string; cta?: boolean }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-secondary/50 p-8 text-center">
      <Icon className="h-6 w-6 text-primary mx-auto" strokeWidth={S} />
      <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">{text}</p>
      {cta && <Link to="/auth" className="mt-4 inline-flex rounded-full bg-primary text-primary-foreground px-5 py-2.5 text-sm font-bold">سجّل وكالتك</Link>}
    </div>
  );
}
