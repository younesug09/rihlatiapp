import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, CreditCard, FileCheck2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { bookingStatusLabel, paymentStatusLabel } from "@/lib/booking-labels";

export const Route = createFileRoute("/_app/profile/bookings")({
  head: () => ({ meta: [
    { title: "حجوزاتي — رحلتي" }, { name: "description", content: "متابعة طلبات الحجز والقسائم الموثّقة." },
    { property: "og:title", content: "حجوزاتي — رحلتي" }, { property: "og:description", content: "متابعة الحجوزات وحالات الدفع." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }), component: BookingsPage,
});

type Booking = { id: string; booking_ref: string | null; status: string; payment_status: string; check_in: string; check_out: string; guests: number; total_price: number; notes: string | null; created_at: string; trips: { title: string; destination: string } | null; agencies: { name: string } | null };

function BookingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    void supabase.from("bookings").select("id, booking_ref, status, payment_status, check_in, check_out, guests, total_price, notes, created_at, trips(title, destination), agencies(name)").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data, error: queryError }) => {
      setBookings((data as Booking[] | null) ?? []); setError(Boolean(queryError)); setLoading(false);
    });
  }, [user]);

  return <main className="mx-auto max-w-3xl px-4 py-8">
    <Link to="/profile" className="mb-4 inline-flex items-center gap-1 text-sm text-primary"><ArrowRight className="h-4 w-4" />{t("back")}</Link>
    <h1 className="mb-5 flex items-center gap-2 text-3xl font-black"><CreditCard className="h-7 w-7 text-primary" />{t("myBookings")}</h1>
    {loading ? <div className="space-y-3">{[1,2,3].map((item) => <div key={item} className="h-36 animate-pulse rounded-lg bg-secondary" />)}</div> : error ? <div className="border border-destructive/30 py-12 text-center text-destructive">{t("loadingError")}</div> : bookings.length === 0 ? <div className="border border-dashed border-border py-14 text-center"><Calendar className="mx-auto h-10 w-10 text-muted-foreground" /><p className="mt-3 text-muted-foreground">لا توجد حجوزات بعد</p><Button asChild className="mt-4"><Link to="/discover">{t("exploreNow")}</Link></Button></div> : <div className="space-y-3">{bookings.map((booking) => <article key={booking.id} className="rounded-lg border border-border bg-card p-5 shadow-soft"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-mono text-muted-foreground">{booking.booking_ref}</p><h2 className="mt-1 text-lg font-black">{booking.trips?.title ?? booking.notes ?? "حجز رحلتي"}</h2><p className="mt-1 text-sm text-muted-foreground">{booking.agencies?.name ?? booking.trips?.destination ?? "رحلتي"}</p></div><div className="text-end"><p className="text-xs font-bold text-primary">{bookingStatusLabel[booking.status] ?? booking.status}</p><p className="mt-1 text-xs text-muted-foreground">{paymentStatusLabel[booking.payment_status] ?? booking.payment_status}</p></div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"><p className="text-sm text-muted-foreground">{booking.check_in} → {booking.check_out} · {booking.guests} مسافر</p>{["confirmed", "completed"].includes(booking.status) && booking.booking_ref && <Button asChild size="sm"><Link to="/document" search={{ ref: booking.booking_ref }}><FileCheck2 className="h-4 w-4" />{t("printVoucher")}</Link></Button>}</div></article>)}</div>}
  </main>;
}