import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, Map, CalendarCheck, Clock, BadgeCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRole } from "@/hooks/useRole";
import { RoleGate } from "@/components/RoleGate";

export const Route = createFileRoute("/_app/dashboard/agency")({
  head: () => ({
    meta: [
      { title: "لوحة الوكالة — رحلتي" },
      { name: "description", content: "رحلاتك وطلبات الحجز وحالة توثيق وكالتك." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RoleGate allow={["agency", "admin"]}>
      <AgencyHome />
    </RoleGate>
  ),
});

const vLabel: Record<string, string> = {
  pending: "بانتظار المراجعة", under_review: "قيد المراجعة", verified: "موثّقة", rejected: "مرفوضة", suspended: "موقوفة",
};

function AgencyHome() {
  const { agency } = useRole();
  const [c, setC] = useState({ trips: 0, pending: 0, confirmed: 0 });

  useEffect(() => {
    if (!agency) return;
    Promise.all([
      supabase.from("trips").select("id", { count: "exact", head: true }).eq("agency_id", agency.id),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("agency_id", agency.id).eq("status", "pending"),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("agency_id", agency.id).eq("status", "confirmed"),
    ]).then(([t, p, cf]) => setC({ trips: t.count ?? 0, pending: p.count ?? 0, confirmed: cf.count ?? 0 }));
  }, [agency]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header>
        <p className="text-sm text-muted-foreground">لوحة الوكالة</p>
        <h1 className="text-3xl font-black">{agency?.name ?? "أكمل ملف وكالتك"}</h1>
        {agency && (
          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-bold">
            <BadgeCheck className="h-3.5 w-3.5 text-success" strokeWidth={1.75} /> {vLabel[agency.verification_status]}
          </span>
        )}
      </header>
      {!agency ? (
        <Link to="/agency" className="inline-flex rounded-full bg-primary text-primary-foreground px-6 py-3 font-bold gap-2"><Building2 className="h-4 w-4" /> إنشاء ملف الوكالة</Link>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Map, label: "رحلاتي", v: c.trips, to: "/agency/trips" as const },
              { icon: Clock, label: "طلبات معلّقة", v: c.pending, to: "/agency/bookings" as const },
              { icon: CalendarCheck, label: "حجوزات مؤكدة", v: c.confirmed, to: "/agency/bookings" as const },
            ].map((k) => (
              <Link key={k.label} to={k.to} className="rounded-3xl bg-card border border-border/60 p-5 shadow-card hover:-translate-y-1 transition-all">
                <k.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
                <p className="mt-3 text-3xl font-black">{k.v}</p>
                <p className="text-sm text-muted-foreground">{k.label}</p>
              </Link>
            ))}
          </div>
          <Link to="/agency" className="inline-flex rounded-full bg-secondary px-6 py-3 font-bold">إدارة ملف الوكالة</Link>
        </>
      )}
    </div>
  );
}
