import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, CreditCard, FileCheck2, Gift, Sparkles, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";
import { bookingStatusLabel, paymentStatusLabel } from "@/lib/booking-labels";
import { cancellationPreview } from "@/lib/pricing";

export const Route = createFileRoute("/_app/profile/bookings")({
  head: () => ({ meta: [
    { title: "حجوزاتي — رحلتي" }, { name: "description", content: "متابعة طلبات الحجز والقسائم الموثّقة." },
    { property: "og:title", content: "حجوزاتي — رحلتي" }, { property: "og:description", content: "متابعة الحجوزات وحالات الدفع." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }), component: BookingsPage,
});

type Booking = { id: string; booking_ref: string | null; status: string; payment_status: string; check_in: string; check_out: string; guests: number; total_price: number; base_price: number | null; service_fee: number | null; refund_amount: number | null; penalty_amount: number | null; flexstay_status: string | null; notes: string | null; created_at: string; trips: { title: string; destination: string; departure_date: string | null } | null; agencies: { name: string } | null };
type Offer = { id: string; booking_id: string; status: string };
type Voucher = { id: string; code: string; percent: number; used_at: string | null };

function BookingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    const [b, o, v] = await Promise.all([
      supabase.from("bookings").select("id, booking_ref, status, payment_status, check_in, check_out, guests, total_price, base_price, service_fee, refund_amount, penalty_amount, flexstay_status, notes, created_at, trips(title, destination, departure_date), agencies(name)").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("flexstay_offers").select("id, booking_id, status").eq("status", "pending"),
      supabase.from("discount_vouchers").select("id, code, percent, used_at").eq("user_id", user.id),
    ]);
    setBookings((b.data as Booking[] | null) ?? []); setOffers(o.data ?? []); setVouchers(v.data ?? []);
    setError(Boolean(b.error)); setLoading(false);
  }, [user]);
  useEffect(() => { void load(); }, [load]);

  const cancel = async (id: string) => {
    const { error: e } = await supabase.rpc("cancel_booking", { _booking_id: id });
    setCancelling(null);
    if (e) return toast.error("تعذّر إلغاء الحجز");
    toast.success("تم إلغاء الحجز وحساب المبلغ المسترجع"); await load();
  };
  const respond = async (offerId: string, accept: boolean) => {
    const { error: e } = await supabase.rpc("respond_flexstay", { _offer_id: offerId, _accept: accept });
    if (e) return toast.error("تعذّر إرسال الرد");
    toast.success(accept ? "تم التأجيل! حصلت على قسيمة 20% وشارة VIP" : "تم رفض العرض"); await load();
  };

  return <main className="mx-auto max-w-3xl px-4 py-8">
    <Link to="/profile" className="mb-4 inline-flex items-center gap-1 text-sm text-primary"><ArrowRight className="h-4 w-4" />{t("back")}</Link>
    <h1 className="mb-5 flex items-center gap-2 text-3xl font-black"><CreditCard className="h-7 w-7 text-primary" />{t("myBookings")}</h1>
    {vouchers.length > 0 && <div className="mb-5 rounded-lg border border-accent/40 bg-accent/10 p-4"><p className="flex items-center gap-2 font-bold"><Gift className="h-4 w-4 text-accent" />قسائم الخصم</p><div className="mt-2 flex flex-wrap gap-2">{vouchers.map((v) => <span key={v.id} className={`rounded-full border border-border bg-card px-3 py-1 font-mono text-sm ${v.used_at ? "line-through opacity-60" : ""}`}>{v.code} · {v.percent}%</span>)}</div></div>}
    {loading ? <div className="space-y-3">{[1,2,3].map((item) => <div key={item} className="h-36 animate-pulse rounded-lg bg-secondary" />)}</div> : error ? <div className="border border-destructive/30 py-12 text-center text-destructive">{t("loadingError")}</div> : bookings.length === 0 ? <div className="border border-dashed border-border py-14 text-center"><Calendar className="mx-auto h-10 w-10 text-muted-foreground" /><p className="mt-3 text-muted-foreground">لا توجد حجوزات بعد</p><Button asChild className="mt-4"><Link to="/discover">{t("exploreNow")}</Link></Button></div> : <div className="space-y-3">{bookings.map((booking) => {
      const offer = offers.find((o) => o.booking_id === booking.id);
      const preview = cancellationPreview({ base: Number(booking.base_price ?? booking.total_price), total: Number(booking.total_price), departure: booking.trips?.departure_date ?? booking.check_in, confirmed: booking.status === "confirmed" });
      return <article key={booking.id} className="rounded-lg border border-border bg-card p-5 shadow-soft">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-mono text-muted-foreground">{booking.booking_ref}</p><h2 className="mt-1 text-lg font-black">{booking.trips?.title ?? booking.notes ?? "حجز رحلتي"}</h2><p className="mt-1 text-sm text-muted-foreground">{booking.agencies?.name ?? booking.trips?.destination ?? "رحلتي"}</p></div><div className="text-end"><p className="text-xs font-bold text-primary">{bookingStatusLabel[booking.status] ?? booking.status}</p><p className="mt-1 text-xs text-muted-foreground">{paymentStatusLabel[booking.payment_status] ?? booking.payment_status}</p>{booking.flexstay_status === "accepted" && <p className="mt-1 text-xs font-bold text-accent">FlexStay VIP</p>}</div></div>
        {offer && <div className="mt-4 rounded-lg border border-accent/40 bg-accent/10 p-4"><p className="flex items-center gap-2 font-bold"><Sparkles className="h-4 w-4 text-accent" />عرض RIHLA FlexStay</p><p className="mt-1 text-sm text-muted-foreground">التواريخ محجوزة بالكامل. أجّل إقامتك يومًا واحدًا واحصل على: قسيمة خصم 20% لرحلتك القادمة + ترقية مجانية للغرفة أو فطور + شارة VIP في جوازك الرقمي.</p><div className="mt-3 flex gap-2"><Button size="sm" onClick={() => respond(offer.id, true)}>أقبل التأجيل</Button><Button size="sm" variant="outline" onClick={() => respond(offer.id, false)}>لا شكرًا</Button></div></div>}
        {booking.status === "cancelled" && booking.refund_amount != null && <p className="mt-3 text-sm">المبلغ المسترجع: <b>{Number(booking.refund_amount).toLocaleString()} دج</b>{Number(booking.penalty_amount) > 0 && <> · غرامة إلغاء: {Number(booking.penalty_amount).toLocaleString()} دج</>}</p>}
        {cancelling === booking.id && <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm"><p className="font-bold">{preview.late ? "إلغاء متأخر (أقل من 48 ساعة): خصم 15%" : "إلغاء مجاني: استرجاع كامل 100%"}</p>{preview.late && <p className="mt-1 text-muted-foreground">10% تعويض للوكالة ({preview.agency.toLocaleString()} دج) + 5% رسوم المنصة ({preview.platform.toLocaleString()} دج)</p>}<p className="mt-1">سيُسترجع لك: <b>{preview.refund.toLocaleString()} دج</b></p><div className="mt-3 flex gap-2"><Button size="sm" variant="destructive" onClick={() => cancel(booking.id)}>تأكيد الإلغاء</Button><Button size="sm" variant="outline" onClick={() => setCancelling(null)}>تراجع</Button></div></div>}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"><p className="text-sm text-muted-foreground">{booking.check_in} → {booking.check_out} · {booking.guests} مسافر · {Number(booking.total_price).toLocaleString()} دج</p><div className="flex flex-wrap gap-2">{["pending", "confirmed"].includes(booking.status) && cancelling !== booking.id && <Button size="sm" variant="outline" onClick={() => setCancelling(booking.id)}><XCircle className="h-4 w-4" />إلغاء</Button>}{["confirmed", "completed"].includes(booking.status) && booking.booking_ref && <Button asChild size="sm"><Link to="/document" search={{ ref: booking.booking_ref }}><FileCheck2 className="h-4 w-4" />{t("printVoucher")}</Link></Button>}</div></div>
      </article>;
    })}</div>}
  </main>;
}
