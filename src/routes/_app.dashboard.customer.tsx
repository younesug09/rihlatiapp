import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, CalendarCheck, Compass, Heart, LayoutDashboard, Map, MessageCircle, Settings, SlidersHorizontal, Stamp, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardShell, type DashboardNavItem } from "@/components/dashboard/DashboardShell";
import { RoleGate } from "@/components/RoleGate";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";
import { bookingStatusLabel } from "@/lib/booking-labels";
import { getWilaya } from "@/data/wilayas";

export const Route = createFileRoute("/_app/dashboard/customer")({
  head: () => ({ meta: [
    { title: "لوحة المسافر — رحلتي" }, { name: "description", content: "رحلات المسافر وحجوزاته ومفضلاته وتفضيلاته." },
    { property: "og:title", content: "لوحة المسافر — رحلتي" }, { property: "og:description", content: "إدارة تجربة السفر في مكان واحد." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: () => <RoleGate allow={["customer", "admin"]}><CustomerDashboard /></RoleGate>,
});

type Booking = { id: string; booking_ref: string | null; check_in: string; check_out: string; status: string; notes: string | null; total_price: number };
type Trip = { id: string; title: string; destination: string; departure_date: string | null; price: number; cover_url: string | null };

function CustomerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [unread, setUnread] = useState(0);
  const [preferences, setPreferences] = useState<string[]>([]);
  const [budget, setBudget] = useState("medium");

  useEffect(() => {
    if (!user) return;
    void Promise.all([
      supabase.from("bookings").select("id, booking_ref, check_in, check_out, status, notes, total_price").order("check_in").limit(8),
      supabase.from("favorites").select("destination_id").eq("user_id", user.id),
      supabase.from("trips").select("id, title, destination, departure_date, price, cover_url").eq("status", "published").order("departure_date").limit(6),
      supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", user.id).is("read_at", null),
      supabase.from("profiles").select("travel_preferences, budget_level").eq("id", user.id).maybeSingle(),
    ]).then(([bookingResult, favoriteResult, tripResult, notificationResult, profileResult]) => {
      setBookings((bookingResult.data as Booking[] | null) ?? []);
      setFavoriteIds(favoriteResult.data?.map((row) => row.destination_id) ?? []);
      setTrips((tripResult.data as Trip[] | null) ?? []);
      setUnread(notificationResult.count ?? 0);
      setPreferences(profileResult.data?.travel_preferences ?? []);
      setBudget(profileResult.data?.budget_level ?? "medium");
      setLoading(false);
    });
  }, [user]);

  const togglePreference = (preference: string) => setPreferences((current) => current.includes(preference) ? current.filter((item) => item !== preference) : [...current, preference]);
  const savePreferences = async () => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ travel_preferences: preferences, budget_level: budget }).eq("id", user.id);
    error ? toast.error(t("loadingError")) : toast.success(t("saved"));
  };

  const nav: DashboardNavItem[] = [
    { href: "/dashboard/customer", label: t("dashboard"), icon: LayoutDashboard }, { href: "/profile", label: t("profile"), icon: User },
    { href: "/discover", label: t("discover"), icon: Compass }, { href: "/favorites", label: t("favorites"), icon: Heart },
    { href: "/profile/bookings", label: t("myBookings"), icon: CalendarCheck }, { href: "/passport", label: t("myTrips"), icon: Stamp },
    { href: "/messages", label: t("messages"), icon: MessageCircle }, { href: "/profile/notifications", label: t("notifications"), icon: Bell },
    { href: "/profile/settings", label: t("settings"), icon: Settings },
  ];
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter((booking) => booking.check_in >= today && ["pending", "confirmed"].includes(booking.status));

  return <DashboardShell title={user?.user_metadata?.full_name ?? t("customerDashboard")} subtitle={t("customerDashboard")} items={nav}>
    {loading ? <DashboardSkeleton /> : <div className="space-y-10">
      <section><h2 className="text-3xl font-black">{t("upcomingTrips")}</h2>{upcoming.length === 0 ? <Empty text={t("noUpcoming")} /> : <div className="mt-4 grid gap-3 sm:grid-cols-2">{upcoming.map((booking) => <Link key={booking.id} to="/profile/bookings" className="rounded-lg border border-border bg-card p-5 shadow-soft"><div className="flex justify-between gap-3"><p className="font-bold">{booking.notes ?? booking.booking_ref}</p><span className="text-xs font-bold text-primary">{bookingStatusLabel[booking.status]}</span></div><p className="mt-3 text-sm text-muted-foreground">{booking.check_in} → {booking.check_out}</p></Link>)}</div>}</section>
      <section><div className="flex items-end justify-between"><div><p className="text-xs font-bold text-accent">FOR YOU</p><h2 className="text-2xl font-black">{t("recommendedTrips")}</h2></div><Button asChild variant="ghost"><Link to="/discover">{t("viewAll")}</Link></Button></div>{trips.length === 0 ? <Empty text={t("noRecommendations")} /> : <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{trips.map((trip) => <article key={trip.id} className="overflow-hidden rounded-lg border border-border bg-card"><div className="aspect-video bg-secondary">{trip.cover_url && <img src={trip.cover_url} alt={trip.title} className="h-full w-full object-cover" />}</div><div className="p-4"><p className="text-xs text-muted-foreground">{trip.destination}</p><h3 className="mt-1 font-bold">{trip.title}</h3><Button asChild size="sm" className="mt-4 w-full"><Link to="/booking" search={{ trip: trip.id }}>{t("requestBooking")}</Link></Button></div></article>)}</div>}</section>
      <section><div className="flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /><h2 className="text-2xl font-black">{t("favorites")}</h2></div>{favoriteIds.length === 0 ? <Empty text={t("noFavsYet")} /> : <div className="mt-4 flex gap-3 overflow-x-auto pb-2">{favoriteIds.map((id) => { const destination = getWilaya(id); return destination ? <Link key={id} to="/discover/$id" params={{ id }} className="min-w-48 rounded-lg border border-border bg-card p-4"><p className="font-bold">{destination.name}</p><p className="text-xs text-muted-foreground">{destination.tagline}</p></Link> : null; })}</div>}</section>
      <section className="border-t border-border pt-8"><div className="flex items-center gap-2"><SlidersHorizontal className="h-5 w-5 text-primary" /><h2 className="text-2xl font-black">{t("travelPreferences")}</h2></div><div className="mt-4 flex flex-wrap gap-2">{["beaches", "sahara", "mountains", "heritage", "nature", "adventure", "cities"].map((preference) => <Button key={preference} type="button" variant={preferences.includes(preference) ? "default" : "outline"} onClick={() => togglePreference(preference)}>{preference}</Button>)}</div><div className="mt-4 flex flex-wrap items-center gap-3"><select value={budget} onChange={(event) => setBudget(event.target.value)} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="low">اقتصادي</option><option value="medium">متوسط</option><option value="premium">مميز</option></select><Button onClick={savePreferences}>{t("save")}</Button><span className="text-xs text-muted-foreground">{unread} {t("notifications")}</span></div></section>
    </div>}
  </DashboardShell>;
}

function Empty({ text }: { text: string }) { return <div className="mt-4 border border-dashed border-border py-10 text-center text-sm text-muted-foreground">{text}</div>; }
function DashboardSkeleton() { return <div className="space-y-6">{[1, 2, 3].map((item) => <div key={item} className="h-40 animate-pulse rounded-lg bg-secondary" />)}</div>; }