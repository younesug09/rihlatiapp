import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarCheck, Heart, Stamp, Bell, User, Map } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { RoleGate } from "@/components/RoleGate";

export const Route = createFileRoute("/_app/dashboard/customer")({
  head: () => ({
    meta: [
      { title: "لوحة المسافر — رحلتي" },
      { name: "description", content: "حجوزاتك ومفضلاتك وجواز رحلتي في مكان واحد." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RoleGate allow={["customer", "admin"]}>
      <CustomerDashboard />
    </RoleGate>
  ),
});

function CustomerDashboard() {
  const { user } = useAuth();
  const [c, setC] = useState({ bookings: 0, upcoming: 0, favorites: 0, unread: 0 });

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("bookings").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("check_in", today).in("status", ["pending", "confirmed"]),
      supabase.from("favorites").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).is("read_at", null),
    ]).then(([b, u, f, n]) =>
      setC({ bookings: b.count ?? 0, upcoming: u.count ?? 0, favorites: f.count ?? 0, unread: n.count ?? 0 }),
    );
  }, [user]);

  const cards = [
    { to: "/profile/bookings" as const, icon: CalendarCheck, label: "حجوزاتي", value: c.bookings },
    { to: "/profile/bookings" as const, icon: Map, label: "رحلات قادمة", value: c.upcoming },
    { to: "/favorites" as const, icon: Heart, label: "المفضلة", value: c.favorites },
    { to: "/profile/notifications" as const, icon: Bell, label: "إشعارات جديدة", value: c.unread },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header>
        <p className="text-sm text-muted-foreground">لوحة المسافر</p>
        <h1 className="text-3xl font-black">مرحبًا بك في رحلتي</h1>
      </header>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((k) => (
          <Link key={k.label} to={k.to} className="rounded-3xl bg-card border border-border/60 p-5 shadow-card hover:-translate-y-1 transition-all">
            <k.icon className="h-5 w-5 text-primary" strokeWidth={1.75} />
            <p className="mt-3 text-3xl font-black">{k.value}</p>
            <p className="text-sm text-muted-foreground">{k.label}</p>
          </Link>
        ))}
      </div>
      <div className="grid sm:grid-cols-3 gap-3">
        <Link to="/passport" className="rounded-full bg-primary text-primary-foreground px-5 py-3 font-bold inline-flex items-center justify-center gap-2"><Stamp className="h-4 w-4" strokeWidth={1.75} /> جواز رحلتي</Link>
        <Link to="/stays" className="rounded-full bg-secondary px-5 py-3 font-bold inline-flex items-center justify-center gap-2"><Map className="h-4 w-4" strokeWidth={1.75} /> احجز إقامة</Link>
        <Link to="/profile" className="rounded-full bg-secondary px-5 py-3 font-bold inline-flex items-center justify-center gap-2"><User className="h-4 w-4" strokeWidth={1.75} /> ملفي الشخصي</Link>
      </div>
    </div>
  );
}
