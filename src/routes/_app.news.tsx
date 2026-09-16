import { createFileRoute, Link } from "@tanstack/react-router";
import { Calendar, ArrowLeft, Camera } from "lucide-react";
import { news } from "@/data/destinations";

export const Route = createFileRoute("/_app/news")({
  head: () => ({ meta: [{ title: "أخبار السياحة — رحلتي" }] }),
  component: News,
});

function News() {
  const [featured, ...rest] = news;
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-1">أخبار السياحة</h1>
      <p className="text-sm text-muted-foreground mb-6">آخر المستجدات السياحية والإعلامية</p>

      <article className="rounded-3xl overflow-hidden bg-card shadow-card mb-6 group cursor-pointer">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img src={featured.image} alt={featured.title} loading="lazy" width={1600} height={900} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <span className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full">عاجل</span>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
            <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md font-medium">{featured.category}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {featured.date}</span>
          </div>
          <h2 className="text-xl font-bold mb-2">{featured.title}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed">{featured.excerpt}</p>
          <button className="mt-4 inline-flex items-center gap-1 text-primary font-semibold text-sm">
            اقرأ المزيد <ArrowLeft className="h-4 w-4" />
          </button>
        </div>
      </article>

      <div className="grid sm:grid-cols-2 gap-4">
        {rest.map((n) => (
          <article key={n.id} className="rounded-2xl bg-card shadow-soft overflow-hidden group cursor-pointer hover:shadow-card transition-all">
            <div className="aspect-[4/3] overflow-hidden">
              <img src={n.image} alt={n.title} loading="lazy" width={800} height={600} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-md font-medium">{n.category}</span>
                <span>{n.date}</span>
              </div>
              <h3 className="font-bold leading-tight mb-2">{n.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{n.excerpt}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 rounded-3xl p-6 bg-primary text-primary-foreground">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
          <Camera className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          معرض الوسائط
        </h3>
        <p className="text-sm opacity-85 mb-4">شاهد مجموعتنا من الصور والفيديوهات السياحية</p>
        <Link to="/media" className="inline-block bg-background text-primary px-4 py-2 rounded-xl text-sm font-semibold">استكشف المعرض</Link>
      </div>
    </div>
  );
}
