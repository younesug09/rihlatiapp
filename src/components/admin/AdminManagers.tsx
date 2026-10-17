import { useCallback, useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Pause, Pencil, Play, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { createAdminUser, updateAdminUser } from "@/lib/admin.functions";

const selectCls = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";
type TripStatus = "draft" | "pending_approval" | "published" | "paused" | "sold_out" | "completed" | "cancelled";
const tripStatuses: { v: TripStatus; l: string }[] = [
  { v: "draft", l: "مسودة" }, { v: "pending_approval", l: "بانتظار الموافقة" }, { v: "published", l: "منشورة" },
  { v: "paused", l: "موقوفة" }, { v: "sold_out", l: "مكتملة" }, { v: "completed", l: "منتهية" }, { v: "cancelled", l: "ملغاة" },
];
type Trip = { id: string; agency_id: string; title: string; destination: string; price: number; seats: number; seats_booked: number; duration_days: number; departure_date: string | null; status: TripStatus };
type AgencyOpt = { id: string; name: string };
const emptyTrip = { id: "", agency_id: "", title: "", destination: "", price: "10000", seats: "15", duration_days: "3", departure_date: "", status: "published" as TripStatus };

export function AdminTripsManager({ agencies, onChange }: { agencies: AgencyOpt[]; onChange: () => void }) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [form, setForm] = useState(emptyTrip);
  const [busy, setBusy] = useState(false);
  const load = useCallback(async () => {
    const { data, error } = await supabase.from("trips").select("id, agency_id, title, destination, price, seats, seats_booked, duration_days, departure_date, status").order("created_at", { ascending: false }).limit(200);
    if (error) toast.error("تعذّر تحميل الرحلات"); else setTrips((data as Trip[]) ?? []);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.agency_id) return toast.error("اختر الوكالة");
    setBusy(true);
    const payload = { agency_id: form.agency_id, title: form.title.trim(), destination: form.destination.trim(), price: Number(form.price), seats: Number(form.seats), duration_days: Number(form.duration_days), departure_date: form.departure_date || null, status: form.status };
    const { error } = form.id ? await supabase.from("trips").update(payload).eq("id", form.id) : await supabase.from("trips").insert(payload);
    setBusy(false);
    if (error) return toast.error("تعذّر حفظ الرحلة: " + error.message);
    toast.success(form.id ? "تم تحديث الرحلة" : "تم إنشاء الرحلة");
    setForm(emptyTrip); await load(); onChange();
  };
  const setStatus = async (id: string, status: TripStatus) => {
    const { error } = await supabase.from("trips").update({ status }).eq("id", id);
    if (error) return toast.error("تعذّر تغيير الحالة");
    toast.success(status === "paused" ? "تم إيقاف الرحلة" : "تم تفعيل الرحلة"); await load(); onChange();
  };
  const agencyName = (id: string) => agencies.find((a) => a.id === id)?.name ?? "—";

  return <div className="grid gap-5 xl:grid-cols-[22rem_1fr]">
    <form onSubmit={save} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <h2 className="font-black">{form.id ? "تعديل رحلة" : "إنشاء رحلة"}</h2>
      <select required className={selectCls} value={form.agency_id} onChange={(e) => setForm({ ...form, agency_id: e.target.value })}>
        <option value="">— الوكالة —</option>{agencies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
      </select>
      <Input required placeholder="عنوان الرحلة" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <Input required placeholder="الوجهة / الولاية" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} />
      <div className="grid grid-cols-3 gap-2">
        <label className="text-xs">السعر (دج)<Input required type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></label>
        <label className="text-xs">المقاعد<Input required type="number" min={1} value={form.seats} onChange={(e) => setForm({ ...form, seats: e.target.value })} /></label>
        <label className="text-xs">الأيام<Input required type="number" min={1} value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: e.target.value })} /></label>
      </div>
      <label className="block text-xs">تاريخ الانطلاق<Input type="date" value={form.departure_date} onChange={(e) => setForm({ ...form, departure_date: e.target.value })} /></label>
      <select className={selectCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as TripStatus })}>
        {tripStatuses.map((s) => <option key={s.v} value={s.v}>{s.l}</option>)}
      </select>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1" disabled={busy}>{form.id ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{form.id ? "حفظ" : "إنشاء"}</Button>
        {form.id && <Button type="button" variant="outline" onClick={() => setForm(emptyTrip)}><X className="h-4 w-4" /></Button>}
      </div>
    </form>
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {trips.length === 0 ? <p className="p-12 text-center text-muted-foreground">لا توجد رحلات.</p> : trips.map((t) => <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
        <div><p className="font-bold">{t.title}</p><p className="text-xs text-muted-foreground">{agencyName(t.agency_id)} · {t.destination} · {Number(t.price).toLocaleString()} دج · {t.seats_booked}/{t.seats} · {tripStatuses.find((s) => s.v === t.status)?.l}</p></div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setForm({ id: t.id, agency_id: t.agency_id, title: t.title, destination: t.destination, price: String(t.price), seats: String(t.seats), duration_days: String(t.duration_days), departure_date: t.departure_date ?? "", status: t.status })}><Pencil className="h-4 w-4" />تعديل</Button>
          {t.status === "paused"
            ? <Button size="sm" onClick={() => setStatus(t.id, "published")}><Play className="h-4 w-4" />تفعيل</Button>
            : <Button size="sm" variant="secondary" onClick={() => setStatus(t.id, "paused")}><Pause className="h-4 w-4" />إيقاف</Button>}
        </div>
      </div>)}
    </div>
  </div>;
}

type UserRow = { id: string; email: string; fullName: string; wilaya: string; roles: string[] };
type Role = "customer" | "agency" | "admin";
const topRole = (roles: string[]): Role => roles.includes("admin") ? "admin" : roles.includes("agency") ? "agency" : "customer";
const roleLabel: Record<Role, string> = { customer: "مسافر", agency: "وكالة", admin: "مدير" };

export function AdminUsersManager({ users, onChange, onDelete }: { users: UserRow[]; onChange: () => void; onDelete: (id: string) => void }) {
  const create = useServerFn(createAdminUser);
  const update = useServerFn(updateAdminUser);
  const [form, setForm] = useState({ email: "", password: "", fullName: "", role: "customer" as Role });
  const [edit, setEdit] = useState<{ id: string; fullName: string; wilaya: string; role: Role } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await create({ data: form }); toast.success("تم إنشاء المستخدم"); setForm({ email: "", password: "", fullName: "", role: "customer" }); onChange(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "تعذّر إنشاء المستخدم"); }
    setBusy(false);
  };
  const saveEdit = async () => {
    if (!edit) return; setBusy(true);
    try { await update({ data: edit }); toast.success("تم تحديث المستخدم"); setEdit(null); onChange(); }
    catch (err) { toast.error(err instanceof Error ? err.message : "تعذّر التحديث"); }
    setBusy(false);
  };

  return <div className="grid gap-5 xl:grid-cols-[20rem_1fr]">
    <form onSubmit={submit} className="space-y-3 rounded-lg border border-border bg-card p-4">
      <h2 className="font-black">إضافة مستخدم</h2>
      <Input required placeholder="الاسم الكامل" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
      <Input required type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input required type="password" minLength={8} placeholder="كلمة المرور (8 أحرف+)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <select className={selectCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
        {(Object.keys(roleLabel) as Role[]).map((r) => <option key={r} value={r}>{roleLabel[r]}</option>)}
      </select>
      <Button type="submit" className="w-full" disabled={busy}><Plus className="h-4 w-4" />إنشاء</Button>
    </form>
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {users.length === 0 ? <p className="p-12 text-center text-muted-foreground">لا يوجد مستخدمون.</p> : users.map((u) => edit?.id === u.id
        ? <div key={u.id} className="grid gap-2 border-b border-border p-4 sm:grid-cols-4">
            <Input value={edit.fullName} onChange={(e) => setEdit({ ...edit, fullName: e.target.value })} placeholder="الاسم" />
            <Input value={edit.wilaya} onChange={(e) => setEdit({ ...edit, wilaya: e.target.value })} placeholder="الولاية" />
            <select className={selectCls} value={edit.role} onChange={(e) => setEdit({ ...edit, role: e.target.value as Role })}>
              {(Object.keys(roleLabel) as Role[]).map((r) => <option key={r} value={r}>{roleLabel[r]}</option>)}
            </select>
            <div className="flex gap-2"><Button size="sm" onClick={saveEdit} disabled={busy}><Save className="h-4 w-4" />حفظ</Button><Button size="sm" variant="outline" onClick={() => setEdit(null)}><X className="h-4 w-4" /></Button></div>
          </div>
        : <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div><p className="font-bold">{u.fullName || u.email}</p><p className="text-xs text-muted-foreground">{u.email} · {u.roles.map((r) => roleLabel[r as Role] ?? r).join("، ")}</p></div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEdit({ id: u.id, fullName: u.fullName || u.email.split("@")[0], wilaya: u.wilaya, role: topRole(u.roles) })}><Pencil className="h-4 w-4" />تعديل</Button>
              <Button size="sm" variant="destructive" onClick={() => { if (confirm("حذف هذا الحساب نهائيًا؟")) onDelete(u.id); }}>حذف</Button>
            </div>
          </div>)}
    </div>
  </div>;
}

type AgencyRow = { id: string; name: string; wilaya: string | null; email: string | null; verification_status: string };
export function AgencyEditRow({ agency, onDone }: { agency: AgencyRow; onDone: () => void }) {
  const [f, setF] = useState({ name: agency.name, wilaya: agency.wilaya ?? "", email: agency.email ?? "" });
  const save = async () => {
    const { error } = await supabase.from("agencies").update({ name: f.name, wilaya: f.wilaya || null, email: f.email || null }).eq("id", agency.id);
    if (error) return toast.error("تعذّر تحديث الوكالة"); toast.success("تم تحديث بيانات الوكالة"); onDone();
  };
  return <div className="grid gap-2 border-b border-border p-4 sm:grid-cols-4">
    <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="الاسم" />
    <Input value={f.wilaya} onChange={(e) => setF({ ...f, wilaya: e.target.value })} placeholder="الولاية" />
    <Input value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="البريد" />
    <div className="flex gap-2"><Button size="sm" onClick={save}><Save className="h-4 w-4" />حفظ</Button><Button size="sm" variant="outline" onClick={onDone}><X className="h-4 w-4" /></Button></div>
  </div>;
}
