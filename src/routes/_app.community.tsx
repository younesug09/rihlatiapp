import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock3, ImagePlus, MapPin, ShieldCheck, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { wilayas } from "@/data/wilayas";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/_app/community")({
  head: () => ({
    meta: [
      { title: "قصص رحلتي — جدار المسافرين" },
      { name: "description", content: "شارك صور رحلاتك داخل الجزائر على جدار قصص رحلتي. كل منشور يمر بمراجعة قبل النشر." },
      { property: "og:title", content: "قصص رحلتي — جدار المسافرين" },
      { property: "og:description", content: "جدار مجتمعي لصور وقصص المسافرين في الجزائر." },
    ],
  }),
  component: Community,
});

type Post = {
  id: string;
  user_id: string;
  caption: string;
  image_url: string | null;
  wilaya: string | null;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

function Community() {
  const { tr } = useLanguage();
  const statusLabel: Record<Post["status"], string> = {
    pending: tr("قيد المراجعة", "En cours de révision", "Under review"),
    approved: tr("منشور", "Publié", "Published"),
    rejected: tr("مرفوض", "Rejeté", "Rejected"),
  };

  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [mine, setMine] = useState<Post[]>([]);
  const [caption, setCaption] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const { data } = await supabase
      .from("community_posts")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(60);
    setPosts((data as Post[]) ?? []);
    if (user) {
      const { data: own } = await supabase
        .from("community_posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setMine((own as Post[]) ?? []);
    } else {
      setMine([]);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const all = useMemo(() => [...posts, ...mine.filter((p) => p.status !== "approved")], [posts, mine]);

  // Images live in a private bucket: resolve short-lived signed URLs for signed-in viewers.
  useEffect(() => {
    const paths = all.map((p) => p.image_url).filter((p): p is string => !!p && !urls[p]);
    if (!user || paths.length === 0) return;
    void (async () => {
      const { data } = await supabase.storage.from("community").createSignedUrls(paths, 3600);
      if (!data) return;
      setUrls((prev) => {
        const next = { ...prev };
        data.forEach((d) => {
          if (d.path && d.signedUrl) next[d.path] = d.signedUrl;
        });
        return next;
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, user?.id]);

  const pickFile = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!caption.trim()) {
      toast.error(tr("اكتب نصًا مرافقًا للمنشور", "Écrivez un texte pour accompagner la publication", "Write a caption for the post"));
      return;
    }
    setSaving(true);
    try {
      let imagePath: string | null = null;
      if (file) {
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("community").upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        imagePath = path;
      }
      const { error } = await supabase.from("community_posts").insert({
        user_id: user.id,
        caption: caption.trim(),
        wilaya: wilaya || null,
        image_url: imagePath,
        status: "pending",
      });
      if (error) throw error;
      toast.success(tr("تم إرسال منشورك — سيظهر بعد المراجعة", "Votre publication a été envoyée — elle apparaîtra après révision", "Your post has been submitted — it will appear after review"));
      setCaption("");
      setWilaya("");
      pickFile(null);
      if (inputRef.current) inputRef.current.value = "";
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tr("تعذّر إرسال المنشور", "Impossible d'envoyer la publication", "Could not submit the post"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("community_posts").delete().eq("id", id);
    if (error) toast.error(tr("تعذّر حذف المنشور", "Impossible de supprimer la publication", "Could not delete the post"));
    else {
      toast.success(tr("تم حذف المنشور", "Publication supprimée", "Post deleted"));
      await load();
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 animate-fade-in">
      <header className="border-b border-border pb-6">
        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">RIHLA STORIES</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold">{tr("قصص رحلتي", "Histoires Rihlaty", "Rihlaty stories")}</h1>
        <p className="mt-3 text-muted-foreground">{tr("جدار المسافرين: شارك صورة وقصة قصيرة من رحلتك داخل الجزائر.", "Le mur des voyageurs : partagez une photo et une courte histoire de votre voyage en Algérie.", "The travelers' wall: share a photo and a short story from your trip in Algeria.")}</p>
        <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
          <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
          {tr("كل منشور يبدأ بحالة «قيد المراجعة» قبل نشره", "Chaque publication commence au statut « en cours de révision » avant publication", "Every post starts as “under review” before being published")}
        </p>
      </header>

      {!loading && !user && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5 text-sm">
          <p className="font-semibold">{tr("سجّل الدخول لمشاركة قصتك", "Connectez-vous pour partager votre histoire", "Sign in to share your story")}</p>
          <p className="mt-1 text-muted-foreground">{tr("يمكنك تصفّح الجدار، والنشر متاح للأعضاء المسجّلين.", "Vous pouvez parcourir le mur ; la publication est réservée aux membres inscrits.", "You can browse the wall; posting is available to registered members.")}</p>
          <Link to="/auth" className="mt-3 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
            {tr("تسجيل الدخول", "Se connecter", "Sign in")}
          </Link>
        </div>
      )}

      {user && (
        <form onSubmit={submit} className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 text-base font-bold">
            <Users className="h-4 w-4 text-primary" strokeWidth={1.5} />
            {tr("منشور جديد", "Nouvelle publication", "New post")}
          </h2>
          <textarea
            value={caption}
            onChange={(ev) => setCaption(ev.target.value)}
            rows={3}
            placeholder={tr("احكِ عن المكان الذي زرته…", "Racontez l'endroit que vous avez visité…", "Tell us about the place you visited…")}
            className="mt-3 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <select
              value={wilaya}
              onChange={(ev) => setWilaya(ev.target.value)}
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
            >
              <option value="">{tr("اختر الولاية (اختياري)", "Choisir la wilaya (facultatif)", "Choose wilaya (optional)")}</option>
              {wilayas.map((w) => (
                <option key={w.id} value={w.name}>{w.name}</option>
              ))}
            </select>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground hover:border-primary">
              <ImagePlus className="h-4 w-4" strokeWidth={1.5} />
              {file ? file.name : tr("أضف صورة", "Ajouter une photo", "Add a photo")}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(ev) => pickFile(ev.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          {preview && (
            <img src={preview} alt={tr("معاينة الصورة قبل النشر", "Aperçu de l'image avant publication", "Image preview before posting")} className="mt-3 h-44 w-full rounded-xl object-cover" />
          )}
          <button
            type="submit"
            disabled={saving}
            className="mt-4 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {saving ? tr("جارٍ الإرسال…", "Envoi en cours…", "Sending…") : tr("أرسل للمراجعة", "Envoyer pour révision", "Submit for review")}
          </button>
        </form>
      )}

      {mine.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold">{tr("منشوراتي", "Mes publications", "My posts")}</h2>
          <div className="mt-4 space-y-3">
            {mine.map((p) => (
              <div key={p.id} className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`rounded-full px-2 py-0.5 font-semibold ${
                        p.status === "approved"
                          ? "bg-success text-success-foreground"
                          : p.status === "rejected"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {statusLabel[p.status]}
                    </span>
                    {p.wilaya && <span className="text-muted-foreground">{p.wilaya}</span>}
                  </div>
                  <p className="mt-2 text-sm">{p.caption}</p>
                </div>
                <button onClick={() => remove(p.id)} aria-label={tr("حذف المنشور", "Supprimer la publication", "Delete post")} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-bold">{tr("الجدار", "Le mur", "The wall")}</h2>
        {posts.length === 0 ? (
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4" strokeWidth={1.5} />
            {tr("لا توجد منشورات معتمدة بعد — كن أول من يشارك قصته.", "Aucune publication approuvée pour le moment — soyez le premier à partager votre histoire.", "No approved posts yet — be the first to share your story.")}
          </p>
        ) : (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <article key={p.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                {p.image_url && urls[p.image_url] && (
                  <img src={urls[p.image_url]} alt={p.caption} loading="lazy" className="aspect-[4/3] w-full object-cover" />
                )}
                <div className="p-4">
                  {p.wilaya && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {p.wilaya}
                    </span>
                  )}
                  <p className="mt-2 text-sm leading-relaxed">{p.caption}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
