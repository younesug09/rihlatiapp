import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
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
  const { id, hotel: hotelId, stay: stayId } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const stay = stayId ? getStay(stayId) : undefined;
  const d = destinations.find((x) => x.id === id) ?? destinations[0];
  const hotel = hotelId ? hotels.find((h) => h.id === hotelId) : undefined;

  const nightlyPrice = stay?.pricePerNight ?? hotel?.pricePerNight ?? d.price;
  const taxRate = stay?.taxRate ?? 0.05;

  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(3);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [payment, setPayment] = useState<string>("at_property");
  const [submitting, setSubmitting] = useState(false);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const { rooms, taxes, total } = priceBreakdown(nightlyPrice, nights, taxRate);

  const title = stay?.name ?? hotel?.name ?? d.name;
  const image = stay?.image ?? hotel?.image ?? d.image;
  const imageAlt = stay?.imageAlt ?? hotel?.name ?? d.name;

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
    setSubmitting(true);
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        user_id: user.id,
        destination_id: stay?.wilayaId ?? d.id,
        check_in: checkIn || new Date().toISOString().slice(0, 10),
        check_out: checkOut || new Date(Date.now() + nights * 86400000).toISOString().slice(0, 10),
        guests,
        total_price: total,
        status: "confirmed",
        notes: `${title} · ${method.label}`,
      })
      .select("booking_ref")
      .single();
    setSubmitting(false);
    if (error) {
      toast.error("تعذّر إتمام الحجز: " + error.message);
      return;
    }
    toast.success("تم تأكيد الحجز");
    setBookingRef(data?.booking_ref ?? null);
  };

  if (bookingRef) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center animate-scale-in">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-success/20">
          <CheckCircle2 className="h-10 w-10 text-success" strokeWidth={1.5} />
        </div>
        <h1 className="mb-2 text-2xl font-bold">تم تأكيد الحجز</h1>
        <p className="mb-2 text-muted-foreground">إقامتك في {title} محفوظة باسمك.</p>
        <p className="mb-6 font-mono text-lg font-black text-primary">{bookingRef}</p>
        <div className="space-y-2">
          <Link
            to="/document"
            search={{ ref: bookingRef }}
            className="block rounded-2xl bg-primary py-3 font-bold text-primary-foreground"
          >
            عرض وثيقة السفر وطباعتها
          </Link>
          <Link to="/profile/bookings" className="block rounded-2xl border border-border py-3 font-semibold">
            حجوزاتي
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 animate-fade-in">
      <h1 className="mb-5 text-2xl font-bold">إكمال الحجز</h1>

      <div className="mb-5 flex gap-3 rounded-2xl border border-border bg-card p-3">
        <img src={image} alt={imageAlt} width={96} height={96} loading="lazy" className="h-24 w-24 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          {stay ? (
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
          <p className="mt-2 text-sm font-semibold text-primary">{formatDZ(nightlyPrice)} {DZD} / ليلة</p>
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
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm">عدد الليالي</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setNights(Math.max(1, nights - 1))} className="h-8 w-8 rounded-full bg-secondary font-bold">-</button>
              <span className="w-6 text-center font-bold">{nights}</span>
              <button type="button" onClick={() => setNights(Math.min(30, nights + 1))} className="h-8 w-8 rounded-full bg-secondary font-bold">+</button>
            </div>
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
            <span className="text-muted-foreground">{formatDZ(nightlyPrice)} × {nights} ليلة</span>
            <span>{formatDZ(rooms)} {DZD}</span>
          </div>
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">الرسوم ({Math.round(taxRate * 100)}%)</span>
            <span>{formatDZ(taxes)} {DZD}</span>
          </div>
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-muted-foreground">عمولة رحلتي</span>
            <span>0 {DZD}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-bold">الإجمالي</span>
            <span className="text-xl font-black text-primary">{formatDZ(total)} {DZD}</span>
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">(سعر الليلة × عدد الليالي) + الرسوم = الإجمالي</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-primary py-4 font-bold text-primary-foreground disabled:opacity-60"
        >
          {submitting ? "جارٍ التأكيد…" : "تأكيد الحجز"}
        </button>
      </form>

      <div className="mt-8">
        <TrustGuarantees />
      </div>
    </div>
  );
}
