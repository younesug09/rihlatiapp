import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Sparkles, TrendingUp } from "lucide-react";
import { destinations, categories } from "@/data/destinations";
import { DestinationCard } from "@/components/DestinationCard";
import { useLanguage } from "@/hooks/useLanguage";
import { DemoNotice } from "@/components/DemoBadge";
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
      {/* Hero — cinematic */}
      <section className="relative min-h-[32rem] sm:min-h-[40rem] overflow-hidden">
        <img
          src={heroSahara}
          alt="كثبان الصحراء الجزائرية عند الغروب"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover scale-105 animate-[fade-in_1.2s_ease-out]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-5xl px-4 pt-24 sm:pt-32 pb-10 text-center">
          <p className="text-[11px] font-bold tracking-[0.4em] text-primary mb-5">RIHLATY — اكتشف. عِش. شارك.</p>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
            الجزائر… أقرب مما تتخيل.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            اكتشف الأماكن، خطط رحلتك، وعِش التجربة بطريقتك.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/wilayas"
              className="rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-bold shadow-card hover:scale-[1.03] transition-transform"
            >
              اكتشف الجزائر
            </Link>
            <Link
              to="/plan"
              className="rounded-full border border-foreground/20 px-7 py-3.5 text-sm font-bold text-foreground hover:bg-foreground/5 transition-colors"
            >
              خطط رحلتي
            </Link>
          </div>

          <SmartSearch />
        </div>
      </section>

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
