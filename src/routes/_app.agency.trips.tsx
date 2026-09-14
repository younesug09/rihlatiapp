import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Map, Plus, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_app/agency/trips")({
  component: AgencyTrips,
});

type Trip = {
  id: string;
  title: string;
  destination: string;
  description: string | null;
  duration_days: number;
  departure_date: string | null;
  return_date: string | null;
  departure_location: string | null;
  seats: number;
  seats_booked: number;
  price: number;
  status: TripStatus;
};

type TripStatus =
  | "draft"
  | "pending_approval"
  | "published"
  | "paused"
  | "sold_out"
  | "completed"
  | "cancelled";

const statusLabel: Record<TripStatus, string> = {
  draft: "مسودة",
  pending_approval: "بانتظار الموافقة",
  published: "منشورة",
  paused: "متوقفة",
  sold_out: "مكتملة",
  completed: "منتهية",
  cancelled: "ملغاة",
};

const empty = {
  title: "",
  destination: "",
  description: "",
  duration_days: 3,
  departure_date: "",
  return_date: "",
  departure_location: "",
  seats: 20,
  price: 0,
  status: "draft" as TripStatus,
};

function AgencyTrips() {
  const { user } = useAuth();
  const [agencyId, setAgencyId] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ ...empty });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: a } = await supabase
        .from("agencies")
        .select("id, verification_status")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (!a) {
        setLoading(false);
        return;
      }
      setAgencyId(a.id);
      setVerified(a.verification_status === "verified");
      const { data } = await supabase
        .from("trips")
        .select("*")
        .eq("agency_id", a.id)
        .order("created_at", { ascending: false });
      setTrips((data as Trip[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  const startNew = () => {
    setEditing(null);
    setForm({ ...empty });
    setOpen(true);
  };

  const startEdit = (t: Trip) => {
    setEditing(t.id);
    setForm({
      title: t.title,
      destination: t.destination,
      description: t.description ?? "",
      duration_days: t.duration_days,
      departure_date: t.departure_date ?? "",
      return_date: t.return_date ?? "",
      departure_location: t.departure_location ?? "",
      seats: t.seats,
      price: Number(t.price),
      status: t.status as TripStatus,
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyId) return;
    setSaving(true);
    const payload = {
      ...form,
      departure_date: form.departure_date || null,
      return_date: form.return_date || null,
      agency_id: agencyId,
    };
    try {
      if (editing) {
        const { error } = await supabase.from("trips").update(payload).eq("id", editing);
        if (error) throw error;
        setTrips((prev) => prev.map((t) => (t.id === editing ? ({ ...t, ...payload } as Trip) : t)));
        toast.success("تم تحديث الرحلة");
      } else {
        const { data, error } = await supabase.from("trips").insert(payload).select("*").single();
        if (error) throw error;
        setTrips((prev) => [data as Trip, ...prev]);
        toast.success("تمت إضافة الرحلة");
      }
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) return toast.error("تعذّر الحذف");
    setTrips((prev) => prev.filter((t) => t.id !== id));
    toast.success("تم حذف الرحلة");
  };

  if (loading) return <p className="text-center text-muted-foreground py-10">...</p>;

  if (!agencyId)
    return (
      <div className="rounded-3xl bg-card p-8 text-center shadow-soft">
        <Map className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">سجّل بيانات وكالتك أولًا من تبويب «اللوحة».</p>
      </div>
    );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" /> رحلاتي
        </h1>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-1 rounded-2xl px-4 py-2 text-sm font-bold text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="h-4 w-4" /> رحلة جديدة
        </button>
      </div>

      {!verified && (
        <p className="rounded-2xl bg-secondary p-3 text-xs text-muted-foreground">
          وكالتك غير موثّقة بعد — يمكنك تجهيز الرحلات، لكنها لن تظهر للعموم قبل التوثيق.
        </p>
      )}

      {trips.length === 0 ? (
        <div className="rounded-3xl bg-card p-10 text-center shadow-soft">
          <p className="text-muted-foreground text-sm">لا توجد رحلات بعد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((t) => (
            <div key={t.id} className="rounded-3xl bg-card p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{t.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.destination} · {t.duration_days} أيام · {Number(t.price).toLocaleString("ar")} دج
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    المقاعد: {t.seats_booked}/{t.seats} · {statusLabel[t.status] ?? t.status}
                  </p>
                </div>
                <button onClick={() => startEdit(t)} className="rounded-xl bg-secondary p-2" aria-label="تعديل">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(t.id)} className="rounded-xl bg-secondary p-2 text-destructive" aria-label="حذف">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/40 p-0 sm:p-4">
          <form
            onSubmit={save}
            className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-card p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-black text-lg">{editing ? "تعديل الرحلة" : "رحلة جديدة"}</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl bg-secondary p-2">
                <X className="h-4 w-4" />
              </button>
            </div>

            <input
              required
              maxLength={150}
              placeholder="عنوان الرحلة"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              required
              maxLength={100}
              placeholder="الوجهة"
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              maxLength={100}
              placeholder="نقطة الانطلاق"
              value={form.departure_location}
              onChange={(e) => setForm({ ...form, departure_location: e.target.value })}
              className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                value={form.departure_date}
                onChange={(e) => setForm({ ...form, departure_date: e.target.value })}
                className="rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="date"
                value={form.return_date}
                onChange={(e) => setForm({ ...form, return_date: e.target.value })}
                className="rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground">الأيام</label>
                <input
                  type="number"
                  min={1}
                  value={form.duration_days}
                  onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })}
                  className="w-full rounded-2xl bg-secondary px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">المقاعد</label>
                <input
                  type="number"
                  min={0}
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
                  className="w-full rounded-2xl bg-secondary px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">السعر (دج)</label>
                <input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full rounded-2xl bg-secondary px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <textarea
              rows={4}
              maxLength={2000}
              placeholder="وصف الرحلة والبرنامج"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TripStatus })}
              className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {(Object.entries(statusLabel) as [TripStatus, string][]).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-2xl py-3 font-bold text-primary-foreground disabled:opacity-50"
              style={{ background: "var(--gradient-primary)" }}
            >
              {saving ? "..." : "حفظ"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
