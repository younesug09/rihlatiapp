import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BadgeCheck, Building2, Clock, Map, CalendarCheck, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { wilayas } from "@/data/wilayas";

export const Route = createFileRoute("/_app/agency/")({
  component: AgencyDashboard,
});

type AgencyRow = {
  id: string;
  slug: string;
  name: string;
  commercial_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  wilaya: string | null;
  website: string | null;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  verification_status: string;
  verification_notes: string | null;
};

const statusLabel: Record<string, string> = {
  pending: "بانتظار المراجعة",
  under_review: "قيد المراجعة",
  verified: "موثّقة",
  rejected: "مرفوضة",
  suspended: "موقوفة",
};

function slugify(name: string) {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "") || "agency"
  );
}

function AgencyDashboard() {
  const { user } = useAuth();
  const [agency, setAgency] = useState<AgencyRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [counts, setCounts] = useState({ trips: 0, pending: 0, confirmed: 0 });
  const [form, setForm] = useState({
    name: "",
    commercial_name: "",
    email: "",
    phone: "",
    address: "",
    wilaya: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("agencies")
        .select("*")
        .eq("owner_id", user.id)
        .maybeSingle();
      setAgency((data as AgencyRow) ?? null);
      if (data) {
        setForm({
          name: data.name ?? "",
          commercial_name: data.commercial_name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
          wilaya: data.wilaya ?? "",
          website: data.website ?? "",
          description: data.description ?? "",
        });
        const [{ count: trips }, { count: pending }, { count: confirmed }] = await Promise.all([
          supabase.from("trips").select("*", { count: "exact", head: true }).eq("agency_id", data.id),
          supabase.from("bookings").select("*", { count: "exact", head: true }).eq("agency_id", data.id).eq("status", "pending"),
          supabase.from("bookings").select("*", { count: "exact", head: true }).eq("agency_id", data.id).eq("status", "confirmed"),
        ]);
        setCounts({ trips: trips ?? 0, pending: pending ?? 0, confirmed: confirmed ?? 0 });
      }
      setLoading(false);
    })();
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      if (agency) {
        const { error } = await supabase.from("agencies").update(form).eq("id", agency.id);
        if (error) throw error;
        toast.success("تم حفظ بيانات الوكالة");
      } else {
        const { data, error } = await supabase
          .from("agencies")
          .insert({ ...form, owner_id: user.id, slug: `${slugify(form.name)}-${Math.random().toString(36).slice(2, 6)}` })
          .select("*")
          .single();
        if (error) throw error;
        setAgency(data as AgencyRow);
        toast.success("تم إنشاء ملف الوكالة — بانتظار مراجعة الإدارة");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذّر الحفظ");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center text-muted-foreground py-10">...</p>;

  return (
    <div className="space-y-6 animate-fade-in">
      {agency && (
        <div className="rounded-3xl bg-card p-5 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black">{agency.name}</h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                {agency.verification_status === "verified" ? (
                  <BadgeCheck className="h-4 w-4 text-primary" />
                ) : (
                  <Clock className="h-4 w-4" />
                )}
                {statusLabel[agency.verification_status]}
              </p>
            </div>
            {agency.verification_status === "verified" && (
              <Link to="/agencies/$slug" params={{ slug: agency.slug }} className="text-xs font-semibold text-primary">
                الصفحة العامة
              </Link>
            )}
          </div>

          {agency.verification_notes && (
            <p className="mt-3 flex items-start gap-2 rounded-2xl bg-secondary p-3 text-xs text-muted-foreground">
              <ShieldAlert className="h-4 w-4 shrink-0 text-primary" /> {agency.verification_notes}
            </p>
          )}

          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { icon: Map, label: "الرحلات", value: counts.trips },
              { icon: Clock, label: "طلبات معلّقة", value: counts.pending },
              { icon: CalendarCheck, label: "حجوزات مؤكدة", value: counts.confirmed },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-secondary p-3 text-center">
                <s.icon className="h-4 w-4 mx-auto text-primary mb-1" />
                <p className="text-lg font-black">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={save} className="rounded-3xl bg-card p-5 shadow-soft space-y-3">
        <h2 className="font-black text-lg">{agency ? "بيانات الوكالة" : "تسجيل الوكالة"}</h2>
        {!agency && (
          <p className="text-xs text-muted-foreground">
            أكمل البيانات لإرسال طلب التوثيق. لا تُنشر رحلاتك قبل موافقة إدارة رحلتي.
          </p>
        )}
        {[
          { k: "name", label: "اسم الوكالة", required: true },
          { k: "commercial_name", label: "الاسم التجاري" },
          { k: "email", label: "البريد الإلكتروني", type: "email" },
          { k: "phone", label: "الهاتف" },
          { k: "address", label: "العنوان" },
          { k: "website", label: "الموقع الإلكتروني" },
        ].map((f) => (
          <div key={f.k}>
            <label className="text-xs font-semibold text-muted-foreground">{f.label}</label>
            <input
              type={f.type ?? "text"}
              required={f.required}
              maxLength={200}
              value={form[f.k as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
              className="mt-1 w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ))}
        <div>
          <label className="text-xs font-semibold text-muted-foreground">الولاية</label>
          <select
            value={form.wilaya}
            onChange={(e) => setForm({ ...form, wilaya: e.target.value })}
            className="mt-1 w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">اختر الولاية</option>
            {wilayas.map((w) => (
              <option key={w.id} value={w.name}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">نبذة عن الوكالة</label>
          <textarea
            rows={4}
            maxLength={1500}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-2xl py-3 font-bold text-primary-foreground disabled:opacity-50"
          style={{ background: "var(--gradient-primary)" }}
        >
          {saving ? "..." : agency ? "حفظ" : "إرسال طلب التسجيل"}
        </button>
        <p className="text-[11px] text-muted-foreground text-center">
          وثائق التحقق تُستخدم داخل رحلتي فقط ولا تعني اعتمادًا حكوميًا.
        </p>
      </form>
    </div>
  );
}
