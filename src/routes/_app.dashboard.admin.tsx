import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { Users, Building2, Map, CalendarCheck, Check, X, Pause } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { RoleGate } from "@/components/RoleGate";

export const Route = createFileRoute("/_app/dashboard/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة — رحلتي" },
      { name: "description", content: "إدارة المستخدمين والوكالات والرحلات والحجوزات." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RoleGate allow={["admin"]}>
      <AdminDashboard />
    </RoleGate>
  ),
});

type AgencyRow = { id: string; name: string; wilaya: string | null; email: string | null; verification_status: string; created_at: string };
type VStatus = "verified" | "rejected" | "suspended" | "under_review";

function AdminDashboard() {
  const [c, setC] = useState({ users: 0, agencies: 0, trips: 0, bookings: 0 });
  const [agencies, setAgencies] = useState<AgencyRow[]>([]);

  const load = useCallback(async () => {
    const [u, a, t, b, list] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("agencies").select("id", { count: "exact", head: true }),
      supabase.from("trips").select("id", { count: "exact", head: true }),
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase.from("agencies").select("id, name, wilaya, email, verification_status, created_at").order("created_at", { ascending: false }),
    ]);
    setC({ users: u.count ?? 0, agencies: a.count ?? 0, trips: t.count ?? 0, bookings: b.count ?? 0 });
    setAgencies((list.data as AgencyRow[]) ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const setStatus = async (id: string, status: VStatus) => {
    const { error } = await supabase
      .from("agencies")
      .update({ verification_status: status, verified_at: status === "verified" ? new Date().toISOString() : null })
      .eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("تم التحديث");
    load();
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <header>
        <p className="text-sm text-muted-foreground">لوحة الإدارة</p>
        <h1 className="text-3xl font-black">مركز إدارة رحلتي</h1>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Users, label: "المستخدمون", v: c.users },
          { icon: Building2, label: "الوكالات", v: c.agencies },
          { icon: Map, label: "الرحلات", v: c.trips },
          { icon: CalendarCheck, label: "الحجوزات", v: c.bookings },
        ].map((k) => (
          <div key={k.label} className="rounded-3xl bg-card border border-border/60 p-5 shadow-card">
            <k.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
            <p className="mt-3 text-3xl font-black">{k.v}</p>
            <p className="text-sm text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>
      <section className="rounded-3xl bg-card border border-border/60 p-5 shadow-card">
        <h2 className="text-xl font-black mb-4">توثيق الوكالات</h2>
        {agencies.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا توجد وكالات بعد.</p>
        ) : (
          <ul className="divide-y divide-border">
            {agencies.map((a) => (
              <li key={a.id} className="py-3 flex flex-wrap items-center gap-3 justify-between">
                <div>
                  <p className="font-bold">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{[a.wilaya, a.email].filter(Boolean).join(" · ")} — {a.verification_status}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStatus(a.id, "verified")} className="rounded-full bg-success/15 text-success px-3 py-1.5 text-xs font-bold inline-flex gap-1"><Check className="h-3.5 w-3.5" /> توثيق</button>
                  <button onClick={() => setStatus(a.id, "rejected")} className="rounded-full bg-destructive/10 text-destructive px-3 py-1.5 text-xs font-bold inline-flex gap-1"><X className="h-3.5 w-3.5" /> رفض</button>
                  <button onClick={() => setStatus(a.id, "suspended")} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold inline-flex gap-1"><Pause className="h-3.5 w-3.5" /> إيقاف</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
