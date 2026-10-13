import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock, Link2, PenLine, Share2 } from "lucide-react";
import { toast } from "sonner";
import { articles, getArticle, magazineCategories } from "@/data/magazine";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/_app/magazine/$slug")({
  loader: ({ params }) => {
    const article = getArticle(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "المقال غير متوفر — مجلة رحلتي" }, { name: "robots", content: "noindex" }] };
    }
    const a = loaderData.article;
    return {
      meta: [
        { title: `${a.title} — مجلة رحلتي` },
        { name: "description", content: a.dek },
        { property: "og:title", content: a.title },
        { property: "og:description", content: a.dek },
        { property: "og:type", content: "article" },
        { property: "og:image", content: a.image },
        { name: "twitter:image", content: a.image },
      ],
    };
  },
  notFoundComponent: ArticleNotFound,
  errorComponent: ArticleError,
  component: ArticlePage,
});

function ArticleNotFound() {
  const { tr } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">{tr("لم نعثر على هذا المقال", "Cet article est introuvable", "We couldn't find this article")}</h1>
      <Link to="/magazine" className="mt-4 inline-block text-primary font-semibold">{tr("العودة إلى المجلة", "Retour au magazine", "Back to magazine")}</Link>
    </div>
  );
}

function ArticleError() {
  const { tr } = useLanguage();
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">{tr("تعذّر عرض المقال", "Impossible d'afficher l'article", "Unable to display the article")}</h1>
      <Link to="/magazine" className="mt-4 inline-block text-primary font-semibold">{tr("العودة إلى المجلة", "Retour au magazine", "Back to magazine")}</Link>
    </div>
  );
}

function ArticlePage() {
  const { tr } = useLanguage();
  const { article } = Route.useLoaderData();
  const related = articles.filter((a) => a.slug !== article.slug && a.category === article.category).slice(0, 3);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) await navigator.share({ title: article.title, text: article.dek, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success(tr("تم نسخ رابط المقال", "Le lien de l'article a été copié", "Article link copied"));
      }
    } catch {
      /* user cancelled sharing */
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast.success(tr("تم نسخ الرابط", "Lien copié", "Link copied"));
  };

  return (
    <article className="animate-fade-in">
      <div className="relative h-[52vh] min-h-72 w-full overflow-hidden">
        <img src={article.image} alt={article.imageAlt} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/45" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-8">
          <span className="text-xs font-semibold text-background/90">
            {magazineCategories.find((c) => c.id === article.category)?.label}
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold leading-tight text-background">{article.title}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <Link to="/magazine" className="inline-flex items-center gap-1 text-sm text-primary font-semibold">
          <ArrowRight className="h-4 w-4" strokeWidth={1.5} /> {tr("كل المقالات", "Tous les articles", "All articles")}
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-border py-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><PenLine className="h-4 w-4" strokeWidth={1.5} />{article.author} · {article.authorRole}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" strokeWidth={1.5} />{article.readMinutes} {tr("دقائق قراءة", "min de lecture", "min read")}</span>
          <span>{article.date}</span>
        </div>

        <p className="mt-6 text-lg leading-relaxed text-foreground/90">{article.dek}</p>

        <div className="mt-6 space-y-5 text-[17px] leading-loose">
          {article.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">{tr("الصورة:", "Image :", "Image:")} {article.imageCredit}</p>

        <section className="mt-10 rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <BookOpen className="h-4 w-4 text-primary" strokeWidth={1.5} />
            {tr("المصادر", "Sources", "Sources")}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {article.sources.map((s, i) => (
              <li key={i}>
                <span className="font-semibold text-foreground">{s.label}</span> — {s.note}
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={share} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            <Share2 className="h-4 w-4" strokeWidth={1.5} /> {tr("شارك المقال", "Partager l'article", "Share article")}
          </button>
          <button onClick={copyLink} className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold">
            <Link2 className="h-4 w-4" strokeWidth={1.5} /> {tr("نسخ الرابط", "Copier le lien", "Copy link")}
          </button>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="text-lg font-bold">{tr("اقرأ أيضًا", "À lire aussi", "Read also")}</h2>
            <div className="mt-4 grid gap-5 sm:grid-cols-3">
              {related.map((a) => (
                <Link key={a.slug} to="/magazine/$slug" params={{ slug: a.slug }} className="group block">
                  <div className="overflow-hidden rounded-xl aspect-[4/3]">
                    <img src={a.image} alt={a.imageAlt} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <h3 className="mt-2 text-sm font-bold leading-snug group-hover:text-primary">{a.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
