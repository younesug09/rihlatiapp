import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useState } from "react";
import { Building2, CalendarCheck, Check, Compass, LayoutDashboard, Map, Pause, Plus, Settings, ShieldCheck, Trash2, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { supabase } from "@/integrations/supabase/client";
import { deleteAdminUser, listAdminUsers } from "@/lib/admin.functions";

export const Route = createFileRoute("/_app/dashboard/admin")({
  head: () => ({ meta: [
    { title: "لوحة الإدارة — رحلتي" }, { name: "description", content: "إدارة المستخدمين والوكالات والرحلات والوجهات والحجوزات." },
    { property: "og:title", content: "لوحة الإدارة — رحلتي" }, { property: "og:description", content: "مركز إدارة منصة رحلتي." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }), component: () => <RoleGate allow={["admin"]}><AdminDashboard /></RoleGate>,
});

type AgencyRow = { id: string; name: string; wilaya: string | null; email: string | null; verification_status: string; created_at: string };
type DestinationRow = { id: string; name: string; wilaya: string; tourism_type: string; short_description: string | null; is_published: boolean };
type TripRow = { id: string; title: string; destination: string; status: string; created_at: string };
type UserRow = { id: string; email: string; fullName: string; wilaya: string; roles: string[]; createdAt: string };
type Section = "overview" | "agencies" | "destinations" | "trips" | "users";
type VStatus = "verified" | "rejected" | "suspended" | "under_review";

function AdminDashboard() {
  const fetchUsers = useServerFn(listAdminUsers);
  const removeUser = useServerFn(deleteAdminUser);
  const [section, setSection] = useState<Section>("overview");
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({ customers: 0, agencies: 0, verified: 0, activeTrips: 0, bookings: 0 });
  const [agencies, setAgencies] = useState<AgencyRow[]>([]);
  const [destinations, setDestinations] = useState<DestinationRow[]>([]);
  const [trips, setTrips] = useState<TripRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [destinationForm, setDestinationForm] = useState({ id: "", name: "", wilaya: "", tourism_type: "nature", short_description: "", is_published: true });

  const load = useCallback(async () => {
    setLoading(true);
    const [profiles, agencyCount, verifiedCount, tripCount, bookingCount, agencyRows, destinationRows, tripRows] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }), supabase.from("agencies").select("id", { count: "exact", head: true }),
      supabase.from("agencies").select("id", { count: "exact", head: true }).eq("verification_status", "verified"), supabase.from("trips").select("id", { count: "exact", head: true }).in("status", ["published", "sold_out"]),
      supabase.from("bookings").select("id", { count: "exact", head: true }), supabase.from("agencies").select("id, name, wilaya, email, verification_status, created_at").order("created_at", { ascending: false }),
      supabase.from("destinations_catalog").select("id, name, wilaya, tourism_type, short_description, is_published").order("name"), supabase.from("trips").select("id, title, destination, status, created_at").order("created_at", { ascending: false }).limit(100),
    ]);
    setCounts({ customers: profiles.count ?? 0, agencies: agencyCount.count ?? 0, verified: verifiedCount.count ?? 0, activeTrips: tripCount.count ?? 0, bookings: bookingCount.count ?? 0 });
    setAgencies((agencyRows.data as AgencyRow[] | null) ?? []); setDestinations((destinationRows.data as DestinationRow[] | null) ?? []); setTrips((tripRows.data as TripRow[] | null) ?? []);
    try { setUsers((await fetchUsers()) as UserRow[]); } catch { toast.error("تعذّر تحميل المستخدمين"); }
    setLoading(false);
  }, [fetchUsers]);
  useEffect(() => { void load(); }, [load]);

  const setAgencyStatus = async (id: string, status: VStatus) => {
    const { error } = await supabase.from("agencies").update({ verification_status: status, verified_at: status === "verified" ? new Date().toISOString() : null }).eq("id", id);
    if (error) return toast.error("تعذّر تحديث الوكالة"); toast.success("تم تحديث حالة الوكالة"); await load();
  };
  const saveDestination = async (event: React.FormEvent) => {
    event.preventDefault();
    const payload = { ...destinationForm, id: destinationForm.id.trim().toLowerCase().replace(/\s+/g, "-"), short_description: destinationForm.short_description || null };
    const { error } = await supabase.from("destinations_catalog").upsert(payload);
    if (error) return toast.error("تعذّر حفظ الوجهة"); toast.success("تم حفظ الوجهة"); setDestinationForm({ id: "", name: "", wilaya: "", tourism_type: "nature", short_description: "", is_published: true }); await load();
  };
  const removeDestination = async (id: string) => { const { error } = await supabase.from("destinations_catalog").delete().eq("id", id); if (error) return toast.error("تعذّر حذف الوجهة"); toast.success("تم حذف الوجهة"); await load(); };
  const removeTrip = async (id: string) => { const { error } = await supabase.from("trips").delete().eq("id", id); if (error) return toast.error("تعذّر حذف الرحلة"); toast.success("تم حذف الرحلة"); await load(); };
  const removeAccount = async (id: string) => { try { await removeUser({ data: { id } }); toast.success("تم حذف الحساب"); await load(); } catch { toast.error("تعذّر حذف الحساب"); } };

  const nav: DashboardNavItem[] = [{ href: "/dashboard/admin", label: "لوحة التحكم", icon: LayoutDashboard }, { href: "/discover", label: "الوجهات العامة", icon: Compass }, { href: "/profile/settings", label: "الإعدادات", icon: Settings }];
  const tabs: { id: Section; label: string }[] = [{ id: "overview", label: "نظرة عامة" }, { id: "agencies", label: "توثيق الوكالات" }, { id: "destinations", label: "الوجهات" }, { id: "trips", label: "الرحلات" }, { id: "users", label: "المستخدمون" }];
  return <DashboardShell title="مركز إدارة رحلتي" subtitle="ADMIN CONTROL" badge="ADMIN" items={nav}>
    <div className="mb-6 flex gap-2 overflow-x-auto pb-2">{tabs.map((tab) => <Button key={tab.id} variant={section === tab.id ? "default" : "outline"} size="sm" onClick={() => setSection(tab.id)}>{tab.label}</Button>)}</div>
    {loading ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="h-32 animate-pulse rounded-lg bg-secondary" />)}</div> : <>
      {section === "overview" && <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">{[{ icon: Users, label: "العملاء", value: counts.customers }, { icon: Building2, label: "الوكالات", value: counts.agencies }, { icon: ShieldCheck, label: "وكالات موثّقة", value: counts.verified }, { icon: Map, label: "رحلات نشطة", value: counts.activeTrips }, { icon: CalendarCheck, label: "الحجوزات", value: counts.bookings }].map((item) => <div key={item.label} className="rounded-lg border border-border bg-card p-5"><item.icon className="h-5 w-5 text-primary" /><p className="mt-4 text-3xl font-black">{item.value}</p><p className="text-sm text-muted-foreground">{item.label}</p></div>)}</div>}
      {section === "agencies" && <DataList empty="لا توجد وكالات بعد.">{agencies.map((agency) => <div key={agency.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4"><div><p className="font-bold">{agency.name}</p><p className="text-xs text-muted-foreground">{[agency.wilaya, agency.email].filter(Boolean).join(" · ")} · {agency.verification_status}</p></div><div className="flex gap-2"><Button size="sm" onClick={() => setAgencyStatus(agency.id, "verified")}><Check className="h-4 w-4" />توثيق</Button><Button size="sm" variant="destructive" onClick={() => setAgencyStatus(agency.id, "rejected")}><X className="h-4 w-4" />رفض</Button><Button size="icon" variant="outline" onClick={() => setAgencyStatus(agency.id, "suspended")} aria-label="إيقاف"><Pause className="h-4 w-4" /></Button></div></div>)}</DataList>}
      {section === "destinations" && <div className="grid gap-5 xl:grid-cols-[20rem_1fr]"><form onSubmit={saveDestination} className="space-y-3 rounded-lg border border-border bg-card p-4"><h2 className="font-black">إضافة أو تحديث وجهة</h2><Input required placeholder="المعرّف: djanet" value={destinationForm.id} onChange={(event) => setDestinationForm({ ...destinationForm, id: event.target.value })} /><Input required placeholder="اسم الوجهة" value={destinationForm.name} onChange={(event) => setDestinationForm({ ...destinationForm, name: event.target.value })} /><Input required placeholder="الولاية" value={destinationForm.wilaya} onChange={(event) => setDestinationForm({ ...destinationForm, wilaya: event.target.value })} /><Input required placeholder="النوع السياحي" value={destinationForm.tourism_type} onChange={(event) => setDestinationForm({ ...destinationForm, tourism_type: event.target.value })} /><Input placeholder="وصف قصير" value={destinationForm.short_description} onChange={(event) => setDestinationForm({ ...destinationForm, short_description: event.target.value })} /><Button type="submit" className="w-full"><Plus className="h-4 w-4" />حفظ الوجهة</Button></form><DataList empty="لا توجد وجهات في الكتالوج.">{destinations.map((destination) => <div key={destination.id} className="flex items-center justify-between gap-3 border-b border-border p-4"><div><p className="font-bold">{destination.name}</p><p className="text-xs text-muted-foreground">{destination.wilaya} · {destination.tourism_type} · {destination.is_published ? "منشورة" : "مخفية"}</p></div><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setDestinationForm({ ...destination, short_description: destination.short_description ?? "" })}>تعديل</Button><Button size="icon" variant="destructive" onClick={() => removeDestination(destination.id)} aria-label="حذف"><Trash2 className="h-4 w-4" /></Button></div></div>)}</DataList></div>}
      {section === "trips" && <DataList empty="لا توجد رحلات.">{trips.map((trip) => <div key={trip.id} className="flex items-center justify-between gap-3 border-b border-border p-4"><div><p className="font-bold">{trip.title}</p><p className="text-xs text-muted-foreground">{trip.destination} · {trip.status}</p></div><Button size="icon" variant="destructive" onClick={() => removeTrip(trip.id)} aria-label="حذف الرحلة"><Trash2 className="h-4 w-4" /></Button></div>)}</DataList>}
      {section === "users" && <DataList empty="لا يوجد مستخدمون.">{users.map((user) => <div key={user.id} className="flex items-center justify-between gap-3 border-b border-border p-4"><div><p className="font-bold">{user.fullName || user.email}</p><p className="text-xs text-muted-foreground">{user.email} · {user.roles.join("، ")}</p></div><Button size="icon" variant="destructive" onClick={() => removeAccount(user.id)} aria-label="حذف الحساب"><Trash2 className="h-4 w-4" /></Button></div>)}</DataList>}
    </>}
  </DashboardShell>;
}

function DataList({ children, empty }: { children: React.ReactNode; empty: string }) { return <div className="overflow-hidden rounded-lg border border-border bg-card">{Array.isArray(children) && children.length === 0 ? <p className="p-12 text-center text-muted-foreground">{empty}</p> : children}</div>; }