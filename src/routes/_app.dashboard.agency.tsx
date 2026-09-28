import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart3, Bell, Building2, CalendarCheck, LayoutDashboard, Map, MessageCircle, Plus, Settings, Users } from "lucide-react";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/dashboard/agency")({
  head: () => ({ meta: [
    { title: "لوحة الوكالة — رحلتي" }, { name: "description", content: "إدارة ملف الوكالة والرحلات والحجوزات والعملاء." },
    { property: "og:title", content: "لوحة الوكالة — رحلتي" }, { property: "og:description", content: "مركز تشغيل الوكالة السياحية." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: () => <RoleGate allow={["agency", "admin"]}><AgencyHome /></RoleGate>,
});

function AgencyHome() {
  const { agency } = useRole();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ trips: 0, pending: 0, confirmed: 0, customers: 0, revenue: 0 });
  const [recent, setRecent] = useState<{ id: string; booking_ref: string | null; status: string; total_price: number; created_at: string }[]>([]);

  useEffect(() => {
    if (!agency) { setLoading(false); return; }
    void Promise.all([
      supabase.from("trips").select("id", { count: "exact", head: true }).eq("agency_id", agency.id),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("agency_id", agency.id).eq("status", "pending"),
      supabase.from("bookings").select("id, booking_ref, status, total_price, created_at, user_id").eq("agency_id", agency.id).order("created_at", { ascending: false }),
    ]).then(([tripResult, pendingResult, bookingResult]) => {
      const rows = bookingResult.data ?? [];
      setStats({ trips: tripResult.count ?? 0, pending: pendingResult.count ?? 0, confirmed: rows.filter((row) => row.status === "confirmed").length, customers: new Set(rows.map((row) => row.user_id)).size, revenue: rows.filter((row) => row.status === "confirmed").reduce((sum, row) => sum + Number(row.total_price), 0) });
      setRecent(rows.slice(0, 5));
      setLoading(false);
    });
  }, [agency]);

  const nav: DashboardNavItem[] = [
    { href: "/dashboard/agency", label: t("dashboard"), icon: LayoutDashboard }, { href: "/agency", label: t("agencyProfile"), icon: Building2 },
    { href: "/agency/trips", label: t("myTrips"), icon: Map }, { href: "/agency/trips", label: t("addTrip"), icon: Plus },
    { href: "/agency/bookings", label: t("myBookings"), icon: CalendarCheck }, { href: "/agency/bookings", label: t("customers"), icon: Users },
    { href: "/messages", label: t("messages"), icon: MessageCircle }, { href: "/dashboard/agency", label: t("statistics"), icon: BarChart3 },
    { href: "/profile/settings", label: t("settings"), icon: Settings },
  ];

  return <DashboardShell title={agency?.name ?? t("agencyDashboard")} subtitle={t("agencyDashboard")} badge={agency?.verification_status === "verified" ? "RIHLA VERIFIED" : undefined} items={nav}>
    {!agency ? <div className="border border-dashed border-border py-16 text-center"><Building2 className="mx-auto h-10 w-10 text-muted-foreground" /><h2 className="mt-3 text-xl font-black">أكمل ملف وكالتك</h2><Button asChild className="mt-5"><Link to="/agency">إنشاء الملف</Link></Button></div> : loading ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-32 animate-pulse rounded-lg bg-secondary" />)}</div> : <div className="space-y-9">
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-muted-foreground">RIHLA PARTNER</p><h2 className="text-3xl font-black">نظرة تشغيلية</h2></div><Button asChild><Link to="/agency/trips"><Plus className="h-4 w-4" />{t("addTrip")}</Link></Button></div>
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">{[{label:t("myTrips"),value:stats.trips,icon:Map},{label:"طلبات معلّقة",value:stats.pending,icon:Bell},{label:"حجوزات مؤكدة",value:stats.confirmed,icon:CalendarCheck},{label:t("customers"),value:stats.customers,icon:Users},{label:"قيمة مؤكدة",value:`${stats.revenue.toLocaleString()} دج`,icon:BarChart3}].map((item) => <div key={item.label} className="rounded-lg border border-border bg-card p-4"><item.icon className="h-5 w-5 text-primary" /><p className="mt-4 text-2xl font-black">{item.value}</p><p className="text-xs text-muted-foreground">{item.label}</p></div>)}</div>
      <section><div className="flex items-center justify-between"><h2 className="text-2xl font-black">أحدث الطلبات</h2><Button asChild variant="ghost"><Link to="/agency/bookings">عرض الكل</Link></Button></div>{recent.length === 0 ? <div className="mt-4 border border-dashed border-border py-12 text-center text-muted-foreground">لا توجد طلبات حجز بعد.</div> : <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[36rem] text-sm"><thead><tr className="border-b border-border text-muted-foreground"><th className="p-3 text-start">المرجع</th><th className="p-3 text-start">الحالة</th><th className="p-3 text-start">القيمة</th><th className="p-3 text-start">التاريخ</th></tr></thead><tbody>{recent.map((booking) => <tr key={booking.id} className="border-b border-border"><td className="p-3 font-mono font-bold">{booking.booking_ref}</td><td className="p-3">{booking.status}</td><td className="p-3">{Number(booking.total_price).toLocaleString()} دج</td><td className="p-3">{new Date(booking.created_at).toLocaleDateString()}</td></tr>)}</tbody></table></div>}</section>
    </div>}
  </DashboardShell>;
}