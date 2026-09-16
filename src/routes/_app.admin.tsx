import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, BarChart3, Check, Eye, Share2, ShieldAlert, Ticket, Users, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/useRole";
import { EmergencyContacts } from "@/components/EmergencyContacts";
import { DemoNotice } from "@/components/DemoBadge";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإشراف الأكاديمية — رحلتي" },
      { name: "description", content: "مركز الإشراف على المحتوى وتوثيق الوكالات ومؤشرات المنصة لأغراض البحث الأكاديمي." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "لوحة الإشراف — رحلتي" },
      { property: "og:description", content: "إشراف على المحتوى ومؤشرات المنصة." },
    ],
  }),
  component: AdminDashboard,
});

type Post = { id: string; caption: string; wilaya: string | null; status: string; created_at: string };
type AgencyRow = { id: string; name: string; slug: string; wilaya: string | null; verification_status: string };

function AdminDashboard() {
  const { isAdmin, loading } = useRole();
  const [posts, setPosts] = useState<Post[]>([]);
  const [agencies, setAgencies] = useState<AgencyRow[]>([]);
  const [stats, setStats] = useState({ users: 0, bookings: 0, views: 0, shares: 0, searches: 0, completed: 0 });

  const load = useCallback(async () => {
    const [p, a, users, bookings, completed, views, shares, searches] = await Promise.all([
      supabase.from("community_posts").select("id, caption, wilaya, status, created_at").order("created_at", { ascending: false }).limit(50),
      supabase.from("agencies").select("id, name, slug, wilaya, verification_status").order("created_at", { ascending: false }).limit(50),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true }),
      supabase.from("bookings").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
      supabase.from("analytics_events").select("*", { count: "exact", head: true }).eq("event_type", "page_view"),
      supabase.from("analytics_events").select("*", { count: "exact", head: true }).eq("event_type", "share"),
      supabase.from("analytics_events").select("*", { count: "exact", head: true }).eq("event_type", "search"),
    ]);
    setPosts((p.data as Post[]) ?? []);
    setAgencies((a.data as AgencyRow[]) ?? []);
    setStats({
      users: users.count ?? 0,
      bookings: bookings.count ?? 0,
      completed: completed.count ?? 0,
      views: views.count ?? 0,
      shares: shares.count ?? 0,
      searches: searches.count ?? 0,
    });
  }, []);

  useEffect(() => {
    if (isAdmin) void load();
  }, [isAdmin, load]);

  const moderate = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("community_posts").update({ status }).eq("id", id);
    if (error) return toast.error("تعذّر التحديث: " + error.message);
    toast.success(status === "approved" ? "تمت الموافقة على المنشور" : "تم رفض المنشور");
    void load();
  };

  const verify = async (id: string, status: "verified" | "rejected" | "under_review") => {
    const { error } = await supabase
      .from("agencies")
      .update({ verification_status: status, verified_at: status === "verified" ? new Date().toISOString() : null })
      .eq("id", id);
    if (error) return toast.error("تعذّر التحديث: " + error.message);
    toast.success("تم تحديث حالة التوثيق");
    void load();
  };

  if (loading) return <p className="py-20 text-center text-muted-foreground">جارٍ التحقق من الصلاحيات…</p>;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldAlert className="mx-auto mb-3 h-12 w-12 text-muted-foreground" strokeWidth={1.5} />
        <h1 className="text-xl font-black">هذه اللوحة مخصّصة للمشرفين</h1>
        <p className="mt-2 text-sm text-muted-foreground">إذا كنت مشرف المنصة، سجّل الدخول بحساب الإشراف.</p>
        <Link to="/home" className="mt-4 inline-block font-bold text-primary">العودة للرئيسية</Link>
      </div>
    );
  }

  const conversion = stats.views > 0 ? ((stats.bookings / stats.views) * 100).toFixed(1) : "0.0";
  const pending = posts.filter((p) => p.status === "pending");

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 animate-fade-in">
      <h1 className="mb-1 text-2xl font-black">لوحة الإشراف</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        مركز مراجعة المحتوى ومؤشرات المنصة — معدّة لتوثيق نتائج مذكرة الماستر في الإعلام والاتصال.
      </p>

      <section className="mb-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
          <BarChart3 className="h-5 w-5 text-primary" strokeWidth={1.5} /> مؤشرات المنصة
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            { icon: Users, label: "المستخدمون", value: stats.users },
            { icon: Ticket, label: "الحجوزات", value: stats.bookings },
            { icon: BadgeCheck, label: "حجوزات مؤكّدة", value: stats.completed },
            { icon: Eye, label: "مشاهدات الصفحات", value: stats.views },
            { icon: Share2, label: "المشاركات", value: stats.shares },
            { icon: BarChart3, label: "عمليات البحث", value: stats.searches },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
              <s.icon className="mb-2 h-4 w-4 text-primary" strokeWidth={1.5} />
              <p className="text-2xl font-black">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">معدّل التحويل (حجوزات ÷ مشاهدات)</p>
          <p className="text-2xl font-black text-primary">{conversion}%</p>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          المؤشرات محسوبة من نشاط حقيقي داخل المنصة منذ تفعيل التتبّع، دون جمع أي بيانات شخصية أو عناوين IP.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold">مراجعة قصص رحلتي ({pending.length} قيد الانتظار)</h2>
        {posts.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">لا توجد منشورات بعد.</p>
        ) : (
          <ul className="space-y-2">
            {posts.map((p) => (
              <li key={p.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{p.caption}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {p.wilaya ?? "—"} · {new Date(p.created_at).toISOString().slice(0, 10)} ·{" "}
                      <span className="font-bold">{p.status}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button onClick={() => moderate(p.id, "approved")} aria-label="موافقة" className="grid h-9 w-9 place-items-center rounded-xl bg-success/15 text-success">
                      <Check className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                    <button onClick={() => moderate(p.id, "rejected")} aria-label="رفض" className="grid h-9 w-9 place-items-center rounded-xl bg-destructive/10 text-destructive">
                      <X className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h2 className="mb-3 text-lg font-bold">توثيق الوكالات والإقامات</h2>
        {agencies.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">لا توجد وكالات مسجّلة بعد.</p>
        ) : (
          <ul className="space-y-2">
            {agencies.map((a) => (
              <li key={a.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{a.name}</p>
                    <p className="text-xs text-muted-foreground">{a.wilaya ?? "—"} · {a.verification_status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => verify(a.id, "verified")} className="rounded-xl bg-success/15 px-3 py-2 text-xs font-bold text-success">توثيق</button>
                    <button onClick={() => verify(a.id, "under_review")} className="rounded-xl bg-secondary px-3 py-2 text-xs font-bold">قيد الدراسة</button>
                    <button onClick={() => verify(a.id, "rejected")} className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive">رفض</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mb-6">
        <EmergencyContacts />
      </div>

      <DemoNotice>
        لوحة الإشراف تعرض بيانات حقيقية من قاعدة بيانات المنصة؛ أي محتوى تجريبي داخل التطبيق يبقى موسومًا بوضوح.
      </DemoNotice>
    </div>
  );
}
