import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, Map, CalendarCheck } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/_app/agency")({
  head: () => ({
    meta: [
      { title: "لوحة الوكالة — رحلتي" },
      { name: "description", content: "أدر رحلاتك وحجوزاتك وملف وكالتك على منصة رحلتي." },
      { property: "og:title", content: "لوحة الوكالة — رحلتي" },
      { property: "og:description", content: "أدر رحلاتك وحجوزاتك وملف وكالتك على منصة رحلتي." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AgencyLayout,
});

function AgencyLayout() {
  const { tr } = useLanguage();
  const { user, isAgency, isAdmin, loading } = useRole();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAgency && !isAdmin) navigate({ to: "/home" });
  }, [user, isAgency, isAdmin, loading, navigate]);

  if (loading || !user) {
    return <div className="p-10 text-center text-muted-foreground">...</div>;
  }

  const tabs = [
    { to: "/agency" as const, icon: LayoutDashboard, label: tr("اللوحة", "Tableau de bord", "Dashboard") },
    { to: "/agency/trips" as const, icon: Map, label: tr("الرحلات", "Voyages", "Trips") },
    { to: "/agency/bookings" as const, icon: CalendarCheck, label: tr("الحجوزات", "Réservations", "Bookings") },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <nav className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {tabs.map((tab) => (
          <Link
            key={tab.to}
            to={tab.to}
            activeOptions={{ exact: tab.to === "/agency" }}
            activeProps={{ className: "bg-primary text-primary-foreground" }}
            className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-sm font-semibold whitespace-nowrap"
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </Link>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
