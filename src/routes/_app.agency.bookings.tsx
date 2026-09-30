import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { CalendarCheck, Check, CreditCard, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { bookingStatusLabel, paymentStatusLabel } from "@/lib/booking-labels";

export const Route = createFileRoute("/_app/agency/bookings")({
  head: () => ({ meta: [
    { title: "طلبات الحجز — رحلتي" }, { name: "description", content: "إدارة طلبات حجز الوكالة وحالات الدفع." },
    { property: "og:title", content: "طلبات حجز الوكالة — رحلتي" }, { property: "og:description", content: "قبول أو رفض الطلبات وتحديث الدفع." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }), component: AgencyBookings,
});

type Booking = { id: string; booking_ref: string | null; check_in: string; check_out: string; guests: number; total_price: number; status: string; payment_status: string; notes: string | null; created_at: string; trips: { title: string } | null };

function AgencyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    const { data: agency } = await supabase.from("agencies").select("id").eq("owner_id", user.id).maybeSingle();
    if (!agency) { setLoading(false); return; }
    const { data, error } = await supabase.from("bookings").select("id, booking_ref, check_in, check_out, guests, total_price, status, payment_status, notes, created_at, trips(title)").eq("agency_id", agency.id).order("created_at", { ascending: false });
    if (error) toast.error("تعذّر تحميل الطلبات");
    setBookings((data as Booking[] | null) ?? []); setLoading(false);
  }, [user]);

  useEffect(() => { void load(); }, [load]);

  const decide = async (id: string, decision: "confirmed" | "rejected") => {
    const { error } = await supabase.rpc("decide_booking", { _booking_id: id, _decision: decision });
    if (error) return toast.error(error.message.includes("seats") ? "المقاعد المتاحة غير كافية" : "تعذّر اتخاذ القرار");
    toast.success(decision === "confirmed" ? "تم قبول طلب الحجز" : "تم رفض طلب الحجز");
    await load();
  };
  const setPayment = async (id: string, paymentStatus: string) => {
    const { error } = await supabase.rpc("set_booking_payment_status", { _booking_id: id, _payment_status: paymentStatus });
    if (error) return toast.error("تعذّر تحديث حالة الدفع");
    toast.success("تم تحديث حالة الدفع"); await load();
  };
  const offerFlex = async (id: string) => {
    const { error } = await supabase.rpc("offer_flexstay", { _booking_id: id });
    if (error) return toast.error("تعذّر إرسال عرض FlexStay");
    toast.success("تم إرسال عرض FlexStay للمسافر"); await load();
  };

  const statuses = ["pending", "confirmed", "rejected", "completed"];
  const shown = filter === "all" ? bookings : bookings.filter((booking) => booking.status === filter);
  return <main className="mx-auto max-w-5xl px-4 py-8">
    <h1 className="flex items-center gap-2 text-3xl font-black"><CalendarCheck className="h-7 w-7 text-primary" />طلبات الحجز</h1>
    <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{["all", ...statuses].map((status) => <Button key={status} variant={filter === status ? "default" : "outline"} size="sm" onClick={() => setFilter(status)}>{status === "all" ? "الكل" : bookingStatusLabel[status] ?? status}</Button>)}</div>
    {loading ? <div className="mt-5 space-y-3">{[1,2,3].map((item) => <div key={item} className="h-40 animate-pulse rounded-lg bg-secondary" />)}</div> : shown.length === 0 ? <div className="mt-5 border border-dashed border-border py-14 text-center text-muted-foreground">لا توجد حجوزات في هذه الحالة.</div> : <div className="mt-5 space-y-3">{shown.map((booking) => <article key={booking.id} className="rounded-lg border border-border bg-card p-5 shadow-soft"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-mono text-xs text-muted-foreground">{booking.booking_ref}</p><h2 className="mt-1 font-black">{booking.trips?.title ?? booking.notes ?? "طلب حجز"}</h2><p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground"><Users className="h-4 w-4" />{booking.guests} مسافر</p></div><div className="text-end"><p className="text-sm font-bold text-primary">{bookingStatusLabel[booking.status] ?? booking.status}</p><p className="text-xs text-muted-foreground">{paymentStatusLabel[booking.payment_status] ?? booking.payment_status}</p></div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"><p className="text-sm">{Number(booking.total_price).toLocaleString()} دج · {booking.check_in} → {booking.check_out}</p><div className="flex flex-wrap gap-2">{booking.status === "pending" && <><Button size="sm" onClick={() => decide(booking.id, "confirmed")}><Check className="h-4 w-4" />قبول</Button><Button size="sm" variant="destructive" onClick={() => decide(booking.id, "rejected")}><X className="h-4 w-4" />رفض</Button></>}{booking.status === "confirmed" && booking.payment_status !== "paid" && <Button size="sm" variant="outline" onClick={() => setPayment(booking.id, "paid")}><CreditCard className="h-4 w-4" />تأكيد الدفع</Button>}</div></div></article>)}</div>}
  </main>;
}