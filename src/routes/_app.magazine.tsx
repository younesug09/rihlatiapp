import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, PenLine } from "lucide-react";
import { articles, magazineCategories, type MagazineCategory } from "@/data/magazine";

export const Route = createFileRoute("/_app/magazine")({
  head: () => ({
    meta: [
      { title: "مجلة رحلتي — تقارير وقصص سفر من الجزائر" },
      { name: "description", content: "مجلة رحلتي: تقارير وتحقيقات ومقابلات وقصص مسافرين حول التراث والثقافة والطبيعة والسياحة في الجزائر." },
      { property: "og:title", content: "مجلة رحلتي — تقارير وقصص سفر من الجزائر" },
      { property: "og:description", content: "تقارير وتحقيقات ومقابلات وقصص مسافرين حول السياحة الجزائرية." },
    ],
  }),
  component: Magazine,
});

function Magazine() {
  const [cat, setCat] = useState<MagazineCategory | "all">("all");
  const list = useMemo(() => (cat === "all" ? articles : articles.filter((a) => a.category === cat)), [cat]);
  const [lead, ...rest] = list;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 animate-fade-in">
      <header className="border-b border-border pb-6">
        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">RIHLA MAGAZINE</p>
        <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold leading-tight">مجلة رحلتي</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground leading-relaxed">
          تقارير وتحقيقات ومقابلات وقصص مسافرين — قراءة متأنّية في السياحة والتراث والثقافة الجزائرية.
        </p>
      </header>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {magazineCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              cat === c.id
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground border-border hover:border-primary"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {lead && (
        <Link
          to="/magazine/$slug"
          params={{ slug: lead.slug }}
          className="group mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] items-center"
        >
          <div className="overflow-hidden rounded-3xl aspect-[16/10]">
            <img
              src={lead.image}
              alt={lead.imageAlt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <div className="min-w-0">
            <span className="text-xs font-semibold text-accent">
              {magazineCategories.find((c) => c.id === lead.category)?.label}
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold leading-snug">{lead.title}</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">{lead.dek}</p>
            <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><PenLine className="h-3.5 w-3.5" strokeWidth={1.5} />{lead.author}</span>
              <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" strokeWidth={1.5} />{lead.readMinutes} دقائق قراءة</span>
            </div>
            <span className="mt-5 inline-flex items-center gap-1 text-primary font-semibold text-sm">
              اقرأ المقال <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </span>
          </div>
        </Link>
      )}

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((a) => (
          <Link key={a.slug} to="/magazine/$slug" params={{ slug: a.slug }} className="group block">
            <div className="overflow-hidden rounded-2xl aspect-[4/3]">
              <img
                src={a.image}
                alt={a.imageAlt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <span className="mt-4 block text-xs font-semibold text-accent">
              {magazineCategories.find((c) => c.id === a.category)?.label}
            </span>
            <h3 className="mt-1 text-lg font-bold leading-snug group-hover:text-primary transition-colors">{a.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">{a.dek}</p>
            <div className="mt-3 flex items-center gap-3 text-[11px] text-muted-foreground">
              <span>{a.author}</span>
              <span>·</span>
              <span>{a.readMinutes} دقائق</span>
            </div>
          </Link>
        ))}
      </div>

      {list.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">لا توجد مقالات في هذا القسم بعد.</p>
      )}
    </div>
  );
}
