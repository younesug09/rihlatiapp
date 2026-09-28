import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Banknote, Building2, Calendar, CheckCircle2, CreditCard, Globe, MapPin, ShieldCheck, Star, Users } from "lucide-react";
import { destinations } from "@/data/destinations";
import { hotels } from "@/data/hotels";
import { getStay, priceBreakdown, stayCategoryLabel } from "@/data/stays";
import { TrustGuarantees, VerifiedBadge } from "@/components/RihlaVerified";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDZ, DZD } from "@/lib/format";

export const Route = createFileRoute("/_app/booking")({
  validateSearch: z.object({
    id: z.string().optional(),
    hotel: z.string().optional(),
    stay: z.string().optional(),
    trip: z.string().uuid().optional(),
  }),
  head: () => ({
    meta: [
      { title: "إكمال الحجز — رحلتي" },
      { name: "description", content: "أكمل حجزك عبر رحلتي بسعر شفاف: سعر الليلة × عدد الليالي + الرسوم = الإجمالي." },
      { property: "og:title", content: "إكمال الحجز — رحلتي" },
      { property: "og:description", content: "حجز بسعر شفاف ووثيقة سفر قابلة للطباعة." },
    ],
  }),
  component: Booking,
});

const paymentMethods = [
  { id: "at_property", label: "الدفع عند الوصول", note: "تدفع مباشرة في الإقامة عند تسجيل الدخول.", icon: Banknote, available: true },
  { id: "bank_transfer", label: "تحويل بنكي / CCP", note: "تتلقى معطيات التحويل بعد تأكيد الحجز.", icon: Building2, available: true },
  { id: "online", label: "الدفع الإلكتروني", note: "قريبًا — غير متاح حاليًا.", icon: Globe, available: false },
] as const;

function Booking() {
  const { id, hotel: hotelId, stay: stayId, trip: tripId } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const stay = stayId ? getStay(stayId) : undefined;
  const d = destinations.find((x) => x.id === id) ?? destinations[0];
  const hotel = hotelId ? hotels.find((h) => h.id === hotelId) : undefined;

  type TripBooking = { id: string; agency_id: string; title: string; destination: string; departure_date: string | null; return_date: string | null; price: number; cover_url: string | null; seats: number; seats_booked: number };
  const [trip, setTrip] = useState<TripBooking | null>(null);
  const [tripLoading, setTripLoading] = useState(Boolean(tripId));

  useEffect(() => {
    if (!tripId) return;
    void supabase.from("trips").select("id, agency_id, title, destination, departure_date, return_date, price, cover_url, seats, seats_booked").eq("id", tripId).eq("status", "published").maybeSingle().then(({ data }) => {
      setTrip(data as TripBooking | null);
      if (data?.departure_date) setCheckIn(data.departure_date);
      if (data?.return_date) setCheckOut(data.return_date);
      setTripLoading(false);
    });
  }, [tripId]);

  const nightlyPrice = trip ? Number(trip.price) : stay?.pricePerNight ?? hotel?.pricePerNight ?? d.price;
  const taxRate = stay?.taxRate ?? 0.05;

  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(3);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [payment, setPayment] = useState<string>("at_property");
  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const breakdown = priceBreakdown(nightlyPrice, nights, taxRate);
  const rooms = trip ? nightlyPrice * guests : breakdown.rooms;
  const taxes = trip ? 0 : breakdown.taxes;
  const total = trip ? rooms : breakdown.total;

  const title = trip?.title ?? stay?.name ?? hotel?.name ?? d.name;
  const image = trip?.cover_url ?? stay?.image ?? hotel?.image ?? d.image;
  const imageAlt = trip?.title ?? stay?.imageAlt ?? hotel?.name ?? d.name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("سجّل الدخول لإكمال الحجز");
      navigate({ to: "/auth" });
      return;
    }
    const method = paymentMethods.find((m) => m.id === payment);
    if (!method?.available) {
      toast.error("طريقة الدفع هذه غير متاحة بعد");
      return;
    }
    if (tripId && !trip) {
      toast.error("هذه الرحلة غير متاحة للحجز");
      return;
    }
    if (trip && trip.seats - trip.seats_booked < guests) {
      toast.error("عدد المقاعد المتاحة غير كافٍ");
      return;
    }
    if (!checkIn || !checkOut || checkOut < checkIn) {
      toast.error("تحقق من تواريخ الحجز");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        destination_id: trip?.destination ?? stay?.wilayaId ?? d.id,
        check_in: checkIn,
        check_out: checkOut,
        guests,
        total_price: total,
        status: "pending",
        agency_id: trip?.agency_id ?? null,
        trip_id: trip?.id ?? null,
        payment_status: "unpaid",
        payment_method: payment,
        notes: `${title} · ${method.label}`,
      })
      .select("booking_ref")
      .single();
    setSubmitting(false);
    if (error) {
      toast.error("تعذّر إتمام الحجز: " + error.message);
      return;
    }
    toast.success("تم إرسال طلب الحجز إلى الوكالة");
    setBookingRef(data?.booking_ref ?? null);
  };

  if (bookingRef) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center animate-scale-in">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-success/20">
          <CheckCircle2 className="h-10 w-10 text-success" strokeWidth={1.5} />
        </div>
        <h1 className="mb-2 text-2xl font-bold">تم إرسال طلب الحجز</h1>
        <p className="mb-2 text-muted-foreground">الطلب بانتظار موافقة الوكالة، وسنرسل لك إشعارًا عند اتخاذ القرار.</p>
        <p className="mb-6 font-mono text-lg font-black text-primary">{bookingRef}</p>
        <div className="space-y-2">
          <Link to="/profile/bookings" className="block rounded-2xl border border-border py-3 font-semibold">
            حجوزاتي
          </Link>
        </div>
      </div>
    );
  }

  if (tripLoading) return <div className="mx-auto max-w-2xl space-y-4 px-4 py-8"><div className="h-8 w-48 animate-pulse rounded bg-secondary" /><div className="h-36 animate-pulse rounded-lg bg-secondary" /><div className="h-80 animate-pulse rounded-lg bg-secondary" /></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 animate-fade-in">
      <h1 className="mb-5 text-2xl font-bold">إكمال الحجز</h1>

      <div className="mb-5 flex gap-3 rounded-2xl border border-border bg-card p-3">
        <img src={image} alt={imageAlt} width={96} height={96} loading="lazy" className="h-24 w-24 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          {trip ? (
            <>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">رحلة وكالة موثّقة</span>
              <h2 className="mt-1 truncate font-bold leading-tight">{trip.title}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {trip.destination}</p>
              <p className="mt-1 text-xs text-muted-foreground">متاح {trip.seats - trip.seats_booked} مقعد</p>
            </>
          ) : stay ? (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold text-secondary-foreground">
                  {stayCategoryLabel(stay.category)}
                </span>
                {stay.verified && <VerifiedBadge />}
              </div>
              <h2 className="mt-1 truncate font-bold leading-tight">{stay.name}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" strokeWidth={1.5} /> {stay.wilaya} — {stay.area}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{stay.architecture}</p>
            </>
          ) : hotel ? (
            <>
              <span className="mb-1 inline-block rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold">{hotel.type}</span>
              <h2 className="truncate font-bold leading-tight">{hotel.name}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" strokeWidth={1.5} /> {d.name} — {hotel.distance}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-warning">
                <Star className="h-3 w-3 fill-warning" strokeWidth={1.5} /> {hotel.rating}
              </p>
            </>
          ) : (
            <>
              <h2 className="font-bold">{d.name}</h2>
              <p className="text-sm text-muted-foreground">{d.country}</p>
            </>
          )}
          <p className="mt-2 text-sm font-semibold text-primary">{formatDZ(nightlyPrice)} {DZD} {trip ? "/ مسافر" : "/ ليلة"}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <label className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Calendar className="h-4 w-4 text-primary" strokeWidth={1.5} /> تواريخ الإقامة
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="rounded-xl bg-secondary px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" />
            <input type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="rounded-xl bg-secondary px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" />
          </div>
           {!trip && <div className="mt-3 flex items-center justify-between">
            <span className="text-sm">عدد الليالي</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setNights(Math.max(1, nights - 1))} className="h-8 w-8 rounded-full bg-secondary font-bold">-</button>
              <span className="w-6 text-center font-bold">{nights}</span>
              <button type="button" onClick={() => setNights(Math.min(30, nights + 1))} className="h-8 w-8 rounded-full bg-secondary font-bold">+</button>
           </div>}
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-primary" strokeWidth={1.5} /> عدد المسافرين
          </label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="h-8 w-8 rounded-full bg-secondary font-bold">-</button>
            <span className="w-6 text-center font-bold">{guests}</span>
            <button type="button" onClick={() => setGuests(Math.min(20, guests + 1))} className="h-8 w-8 rounded-full bg-secondary font-bold">+</button>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <CreditCard className="h-4 w-4 text-primary" strokeWidth={1.5} /> معلومات الاتصال
          </label>
          <input required maxLength={100} placeholder="الاسم الكامل" className="w-full rounded-xl bg-secondary px-4 py-3 text-sm outline-none" />
          <input required type="email" maxLength={255} placeholder="البريد الإلكتروني" className="w-full rounded-xl bg-secondary px-4 py-3 text-sm outline-none" />
          <input required maxLength={20} placeholder="رقم الهاتف" className="w-full rounded-xl bg-secondary px-4 py-3 text-sm outline-none" />
        </div>

        <fieldset className="rounded-2xl border border-border bg-card p-4">
          <legend className="px-1 text-sm font-semibold">طريقة الدفع</legend>
          <div className="mt-2 space-y-2">
            {paymentMethods.map((m) => (
              <label
                key={m.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                  payment === m.id ? "border-primary bg-secondary" : "border-border"
                } ${m.available ? "" : "opacity-60"}`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={m.id}
                  checked={payment === m.id}
                  disabled={!m.available}
                  onChange={() => setPayment(m.id)}
                  className="mt-1 accent-[var(--primary)]"
                />
                <m.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
                <span className="min-w-0">
                  <span className="block text-sm font-bold">
                    {m.label}
                    {!m.available && <span className="mr-2 rounded-full bg-warning/20 px-2 py-0.5 text-[10px] font-bold">قريبًا</span>}
                  </span>
                  <span className="block text-xs text-muted-foreground">{m.note}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold">
            <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.5} /> تفصيل السعر
          </h2>
          <div className="mb-1 flex justify-between text-sm">
             <span className="text-muted-foreground">{formatDZ(nightlyPrice)} × {trip ? `${guests} مسافر` : `${nights} ليلة`}</span>
            <span>{formatDZ(rooms)} {DZD}</span>
          </div>
           {!trip && <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">الرسوم ({Math.round(taxRate * 100)}%)</span>
            <span>{formatDZ(taxes)} {DZD}</span>
           </div>}
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-muted-foreground">عمولة رحلتي</span>
            <span>0 {DZD}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-bold">الإجمالي</span>
            <span className="text-xl font-black text-primary">{formatDZ(total)} {DZD}</span>
          </div>
           <p className="mt-2 text-[11px] text-muted-foreground">{trip ? "سعر الرحلة × عدد المسافرين = الإجمالي" : "(سعر الليلة × عدد الليالي) + الرسوم = الإجمالي"}</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-primary py-4 font-bold text-primary-foreground disabled:opacity-60"
        >
           {submitting ? "جارٍ الإرسال…" : trip ? "إرسال طلب الحجز" : "تأكيد الحجز"}
        </button>
      </form>

      <div className="mt-8">
        <TrustGuarantees />
      </div>
    </div>
  );
}
