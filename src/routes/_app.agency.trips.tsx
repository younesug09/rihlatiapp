import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Map, Plus, Trash2, Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { ImageUploadButton } from "@/components/agency/AgencyUploads";

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
  cover_url: string | null;
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
  cover_url: "" as string,
};

function AgencyTrips() {
  const { user } = useAuth();
  const { tr } = useLanguage();
  const statusText: Record<TripStatus, string> = { draft: tr("مسودة","Brouillon","Draft"), pending_approval: tr("بانتظار الموافقة","En attente","Pending approval"), published: tr("منشورة","Publié","Published"), paused: tr("متوقفة","En pause","Paused"), sold_out: tr("مكتملة","Complet","Sold out"), completed: tr("منتهية","Terminé","Completed"), cancelled: tr("ملغاة","Annulé","Cancelled") };
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
      cover_url: t.cover_url ?? "",
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
      cover_url: form.cover_url || null,
      agency_id: agencyId,
    };
    try {
      if (editing) {
        const { error } = await supabase.from("trips").update(payload).eq("id", editing);
        if (error) throw error;
        setTrips((prev) => prev.map((t) => (t.id === editing ? ({ ...t, ...payload } as Trip) : t)));
        toast.success(tr("تم تحديث الرحلة","Voyage mis à jour","Trip updated"));
      } else {
        const { data, error } = await supabase.from("trips").insert(payload).select("*").single();
        if (error) throw error;
        setTrips((prev) => [data as Trip, ...prev]);
        toast.success(tr("تمت إضافة الرحلة","Voyage ajouté","Trip added"));
      }
      setOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tr("تعذّر الحفظ","Échec de l'enregistrement","Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("trips").delete().eq("id", id);
    if (error) return toast.error(tr("تعذّر الحذف","Suppression impossible","Delete failed"));
    setTrips((prev) => prev.filter((t) => t.id !== id));
    toast.success(tr("تم حذف الرحلة","Voyage supprimé","Trip deleted"));
  };

  if (loading) return <p className="text-center text-muted-foreground py-10">...</p>;

  if (!agencyId)
    return (
      <div className="rounded-3xl bg-card p-8 text-center shadow-soft">
        <Map className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">{tr("سجّل بيانات وكالتك أولًا من تبويب «اللوحة».","Enregistrez d'abord votre agence.","Register your agency first.")}</p>
      </div>
    );

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" /> {tr("رحلاتي","Mes voyages","My trips")}
        </h1>
        <button
          onClick={startNew}
          className="inline-flex items-center gap-1 rounded-2xl px-4 py-2 text-sm font-bold text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="h-4 w-4" /> {tr("رحلة جديدة","Nouveau voyage","New trip")}
        </button>
      </div>

      {!verified && (
        <p className="rounded-2xl bg-secondary p-3 text-xs text-muted-foreground">
          {tr("وكالتك غير موثّقة بعد — يمكنك تجهيز الرحلات، لكنها لن تظهر للعموم قبل التوثيق.","Agence non vérifiée : vos voyages resteront privés jusqu'à la vérification.","Your agency is not verified yet: trips stay private until verification.")}
        </p>
      )}

      {trips.length === 0 ? (
        <div className="rounded-3xl bg-card p-10 text-center shadow-soft">
          <p className="text-muted-foreground text-sm">{tr("لا توجد رحلات بعد","Aucun voyage","No trips yet")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((t) => (
            <div key={t.id} className="rounded-3xl bg-card p-4 shadow-soft">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{t.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.destination} · {t.duration_days} {tr("أيام","jours","days")} · {Number(t.price).toLocaleString("ar")} {tr("دج","DA","DZD")}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {tr("المقاعد","Places","Seats")}: {t.seats_booked}/{t.seats} · {statusText[t.status] ?? t.status}
                  </p>
                </div>
                <button onClick={() => startEdit(t)} className="rounded-xl bg-secondary p-2" aria-label={tr("تعديل","Modifier","Edit")}>
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => remove(t.id)} className="rounded-xl bg-secondary p-2 text-destructive" aria-label={tr("حذف","Supprimer","Delete")}>
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
              <h2 className="font-black text-lg">{editing ? tr("تعديل الرحلة","Modifier le voyage","Edit trip") : tr("رحلة جديدة","Nouveau voyage","New trip")}</h2>
              <button type="button" onClick={() => setOpen(false)} className="rounded-xl bg-secondary p-2">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              {form.cover_url && <img src={form.cover_url} alt="" className="aspect-[16/9] w-full rounded-2xl object-cover" />}
              {agencyId && <ImageUploadButton agencyId={agencyId} label={tr("صورة الغلاف", "Photo de couverture", "Cover photo")} onUploaded={(url) => setForm((f) => ({ ...f, cover_url: url }))} />}
            </div>
            <input
              required
              maxLength={150}
              placeholder={tr("عنوان الرحلة","Titre du voyage","Trip title")}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              required
              maxLength={100}
              placeholder={tr("الوجهة","Destination","Destination")}
              value={form.destination}
              onChange={(e) => setForm({ ...form, destination: e.target.value })}
              className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              maxLength={100}
              placeholder={tr("نقطة الانطلاق","Point de départ","Meeting point")}
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
                <label className="text-[11px] text-muted-foreground">{tr("الأيام","Jours","Days")}</label>
                <input
                  type="number"
                  min={1}
                  value={form.duration_days}
                  onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })}
                  className="w-full rounded-2xl bg-secondary px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">{tr("المقاعد","Places","Seats")}</label>
                <input
                  type="number"
                  min={0}
                  value={form.seats}
                  onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
                  className="w-full rounded-2xl bg-secondary px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">{tr("السعر (دج)","Prix (DA)","Price (DZD)")}</label>
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
              placeholder={tr("وصف الرحلة والبرنامج","Description et programme","Description & itinerary")}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as TripStatus })}
              className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              {(Object.entries(statusText) as [TripStatus, string][]).map(([k, v]) => (
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
              {saving ? "..." : tr("حفظ","Enregistrer","Save")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
