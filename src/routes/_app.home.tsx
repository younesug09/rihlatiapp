import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Bell, Sparkles, TrendingUp } from "lucide-react";
import { destinations, categories } from "@/data/destinations";
import { DestinationCard } from "@/components/DestinationCard";
import { useLanguage } from "@/hooks/useLanguage";
import heroSahara from "@/assets/hero-sahara.jpg";

export const Route = createFileRoute("/_app/home")({
  head: () => ({
    meta: [
      { title: "الرئيسية — رحلتي" },
      { name: "description", content: "ابدأ رحلتك من هنا. وجهات مميزة وعروض حصرية في الجزائر والعالم." },
    ],
  }),
  component: Home,
});

function Home() {
  const { t } = useLanguage();
  const featured = destinations.slice(0, 4);
  const algeria = destinations.filter((d) => d.region === "algeria");
  const world = destinations.filter((d) => d.region === "world");

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative h-[26rem] sm:h-[32rem] overflow-hidden">
        <img
          src={heroSahara}
          alt="كثبان الصحراء الجزائرية عند الغروب"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/45 to-primary/20" />
        <div className="relative h-full mx-auto max-w-6xl px-4 flex flex-col justify-end pb-8 text-primary-foreground">
          <p className="text-[11px] font-bold tracking-[0.3em] text-white/70 mb-3">RIHLA — اكتشف. عِش. شارك.</p>
          <h1 className="text-4xl sm:text-6xl font-bold leading-[1.15] mb-3">الجزائر… أقرب مما تتخيل.</h1>
          <p className="text-white/85 mb-5 max-w-md leading-relaxed">
            وجهات، قصص، وإقامات من كل ولاية — منصة اتصال سياحي رقمية جزائرية.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/explore" className="rounded-2xl bg-card text-primary px-5 py-3 text-sm font-bold shadow-card hover:scale-[1.03] transition-transform">
              اكتشف الجزائر
            </Link>
            <Link to="/hotels" className="rounded-2xl border border-white/50 px-5 py-3 text-sm font-bold hover:bg-white/15 transition-colors">
              خطّط رحلتي
            </Link>
          </div>
        </div>
      </section>

      {/* Search */}
      <div className="mx-auto max-w-6xl px-4 -mt-7 relative z-10">
        <Link
          to="/explore"
          className="flex items-center gap-3 bg-card rounded-2xl shadow-card px-4 py-4 hover:shadow-glow transition-all"
        >
          <Search className="h-5 w-5 text-primary" />
          <span className="text-muted-foreground flex-1">{t("searchPlaceholder")}</span>
          <span className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-semibold">{t("search")}</span>
        </Link>
      </div>

      <div className="mx-auto max-w-6xl px-4 mt-5">
        <DemoNotice />
      </div>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 mt-8">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {t("exploreByCategory")}
        </h2>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/explore"
              search={{ category: c.id }}
              className="shrink-0 flex flex-col items-center gap-2 px-4 py-3 rounded-2xl bg-card border border-border hover:border-primary hover:shadow-soft transition-all min-w-20"
            >
              <span className="text-2xl">{c.icon}</span>
              <span className="text-xs font-medium">{c.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            {t("featuredDestinations")}
          </h2>
          <Link to="/explore" className="text-sm text-primary font-semibold">{t("viewAll")}</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {featured.map((d) => <DestinationCard key={d.id} d={d} />)}
        </div>
      </section>

      {/* Algeria */}
      <section className="mx-auto max-w-6xl px-4 mt-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold">{t("algeriaGems")}</h2>
            <p className="text-xs text-muted-foreground">{t("discoverCountry")}</p>
          </div>
          <Link to="/explore" className="text-sm text-primary font-semibold">{t("viewAll")}</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {algeria.map((d) => (
            <div key={d.id} className="w-64 shrink-0">
              <DestinationCard d={d} />
            </div>
          ))}
        </div>
      </section>

      {/* World */}
      <section className="mx-auto max-w-6xl px-4 mt-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-bold">{t("worldDestinations")}</h2>
            <p className="text-xs text-muted-foreground">{t("aroundWorld")}</p>
          </div>
          <Link to="/explore" className="text-sm text-primary font-semibold">{t("viewAll")}</Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {world.map((d) => <DestinationCard key={d.id} d={d} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 mt-10">
        <div className="rounded-3xl p-6 text-primary-foreground shadow-card overflow-hidden relative" style={{ background: "var(--gradient-primary)" }}>
          <div className="absolute -left-8 -bottom-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <h3 className="text-xl font-bold mb-2">{t("mediaPlatform")}</h3>
          <p className="text-sm text-white/85 mb-4">{t("mediaDesc")}</p>
          <Link to="/news" className="inline-flex bg-white text-primary px-4 py-2 rounded-xl text-sm font-semibold hover:scale-105 transition-transform">
            {t("browseTourismNews")}
          </Link>
        </div>
      </section>
    </div>
  );
}
