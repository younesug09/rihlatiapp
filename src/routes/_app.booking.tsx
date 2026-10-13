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
import { commission } from "@/lib/pricing";
import { useLanguage } from "@/hooks/useLanguage";

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

function Booking() {
  const { tr } = useLanguage();
  const { id, hotel: hotelId, stay: stayId, trip: tripId } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const paymentMethods = [
    { id: "at_property", label: tr("الدفع عند الوصول", "Paiement sur place", "Pay on arrival"), note: tr("تدفع مباشرة في الإقامة عند تسجيل الدخول.", "Vous payez directement sur place lors de l'enregistrement.", "You pay directly at the stay upon check-in."), icon: Banknote, available: true },
    { id: "bank_transfer", label: tr("تحويل بنكي / CCP", "Virement bancaire / CCP", "Bank transfer / CCP"), note: tr("تتلقى معطيات التحويل بعد تأكيد الحجز.", "Vous recevrez les coordonnées de virement après confirmation de la réservation.", "You will receive transfer details after the booking is confirmed."), icon: Building2, available: true },
    { id: "online", label: tr("الدفع الإلكتروني", "Paiement en ligne", "Online payment"), note: tr("قريبًا — غير متاح حاليًا.", "Bientôt disponible — indisponible pour le moment.", "Coming soon — not available yet."), icon: Globe, available: false },
  ] as const;

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
  const base = trip ? rooms : breakdown.total;
  const fees = commission(base);
  const total = fees.customerTotal;
  const [travelerName, setTravelerName] = useState("");
  const [travelerPhone, setTravelerPhone] = useState("");
  const [travelerNotes, setTravelerNotes] = useState("");

  const title = trip?.title ?? stay?.name ?? hotel?.name ?? d.name;
  const image = trip?.cover_url ?? stay?.image ?? hotel?.image ?? d.image;
  const imageAlt = trip?.title ?? stay?.imageAlt ?? hotel?.name ?? d.name;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(tr("سجّل الدخول لإكمال الحجز", "Connectez-vous pour finaliser la réservation", "Sign in to complete the booking"));
      navigate({ to: "/auth" });
      return;
    }
    const method = paymentMethods.find((m) => m.id === payment);
    if (!method?.available) {
      toast.error(tr("طريقة الدفع هذه غير متاحة بعد", "Ce mode de paiement n'est pas encore disponible", "This payment method is not available yet"));
      return;
    }
    if (tripId && !trip) {
      toast.error(tr("هذه الرحلة غير متاحة للحجز", "Ce voyage n'est pas disponible à la réservation", "This trip is not available for booking"));
      return;
    }
    if (trip && trip.seats - trip.seats_booked < guests) {
      toast.error(tr("عدد المقاعد المتاحة غير كافٍ", "Le nombre de places disponibles est insuffisant", "Not enough available seats"));
      return;
    }
    if (!checkIn || !checkOut || checkOut < checkIn) {
      toast.error(tr("تحقق من تواريخ الحجز", "Vérifiez les dates de réservation", "Check the booking dates"));
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
        total_price: base,
        base_price: base,
        status: "pending",
        agency_id: trip?.agency_id ?? null,
        trip_id: trip?.id ?? null,
        payment_status: "unpaid",
        payment_method: payment,
        traveler_name: travelerName.trim() || null,
        traveler_phone: travelerPhone.trim() || null,
        notes: `${title} · ${method.label}${travelerNotes.trim() ? ` · ${travelerNotes.trim()}` : ""}`,
      })
      .select("booking_ref")
      .single();
    setSubmitting(false);
    if (error) {
      toast.error(tr("تعذّر إتمام الحجز: ", "Impossible de finaliser la réservation : ", "Could not complete the booking: ") + error.message);
      return;
    }
    toast.success(tr("تم إرسال طلب الحجز إلى الوكالة", "La demande de réservation a été envoyée à l'agence", "The booking request has been sent to the agency"));
    setBookingRef(data?.booking_ref ?? null);
  };

  if (bookingRef) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center animate-scale-in">
        <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-success/20">
          <CheckCircle2 className="h-10 w-10 text-success" strokeWidth={1.5} />
        </div>
        <h1 className="mb-2 text-2xl font-bold">{tr("تم إرسال طلب الحجز", "Demande de réservation envoyée", "Booking request sent")}</h1>
        <p className="mb-2 text-muted-foreground">{tr("الطلب بانتظار موافقة الوكالة، وسنرسل لك إشعارًا عند اتخاذ القرار.", "La demande est en attente d'approbation de l'agence, nous vous informerons dès la décision prise.", "The request is awaiting agency approval, and we'll notify you once a decision is made.")}</p>
        <p className="mb-6 font-mono text-lg font-black text-primary">{bookingRef}</p>
        <div className="space-y-2">
          <Link to="/profile/bookings" className="block rounded-2xl border border-border py-3 font-semibold">
            {tr("حجوزاتي", "Mes réservations", "My bookings")}
          </Link>
        </div>
      </div>
    );
  }

  if (tripLoading) return <div className="mx-auto max-w-2xl space-y-4 px-4 py-8"><div className="h-8 w-48 animate-pulse rounded bg-secondary" /><div className="h-36 animate-pulse rounded-lg bg-secondary" /><div className="h-80 animate-pulse rounded-lg bg-secondary" /></div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 animate-fade-in">
      <h1 className="mb-5 text-2xl font-bold">{tr("إكمال الحجز", "Finaliser la réservation", "Complete booking")}</h1>

      <div className="mb-5 flex gap-3 rounded-2xl border border-border bg-card p-3">
        <img src={image} alt={imageAlt} width={96} height={96} loading="lazy" className="h-24 w-24 rounded-xl object-cover" />
        <div className="min-w-0 flex-1">
          {trip ? (
            <>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">{tr("رحلة وكالة موثّقة", "Voyage d'agence vérifiée", "Verified agency trip")}</span>
              <h2 className="mt-1 truncate font-bold leading-tight">{trip.title}</h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" /> {trip.destination}</p>
              <p className="mt-1 text-xs text-muted-foreground">{tr("متاح", "Disponible :", "Available")} {trip.seats - trip.seats_booked} {tr("مقعد", "place(s)", "seat(s)")}</p>
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
          <p className="mt-2 text-sm font-semibold text-primary">{formatDZ(nightlyPrice)} {DZD} {trip ? tr("/ مسافر", "/ voyageur", "/ traveler") : tr("/ ليلة", "/ nuit", "/ night")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <label className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Calendar className="h-4 w-4 text-primary" strokeWidth={1.5} /> {tr("تواريخ الإقامة", "Dates de séjour", "Stay dates")}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" required value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="rounded-xl bg-secondary px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" />
            <input type="date" required value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="rounded-xl bg-secondary px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--ring)]" />
          </div>
           {!trip && <div className="mt-3 flex items-center justify-between">
            <span className="text-sm">{tr("عدد الليالي", "Nombre de nuits", "Number of nights")}</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setNights(Math.max(1, nights - 1))} className="h-8 w-8 rounded-full bg-secondary font-bold">-</button>
              <span className="w-6 text-center font-bold">{nights}</span>
              <button type="button" onClick={() => setNights(Math.min(30, nights + 1))} className="h-8 w-8 rounded-full bg-secondary font-bold">+</button>
            </div>
           </div>}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <Users className="h-4 w-4 text-primary" strokeWidth={1.5} /> {tr("عدد المسافرين", "Nombre de voyageurs", "Number of travelers")}
          </label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="h-8 w-8 rounded-full bg-secondary font-bold">-</button>
            <span className="w-6 text-center font-bold">{guests}</span>
            <button type="button" onClick={() => setGuests(Math.min(20, guests + 1))} className="h-8 w-8 rounded-full bg-secondary font-bold">+</button>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <label className="flex items-center gap-2 text-sm font-semibold">
            <CreditCard className="h-4 w-4 text-primary" strokeWidth={1.5} /> {tr("معلومات الاتصال", "Informations de contact", "Contact information")}
          </label>
          <input required maxLength={100} value={travelerName} onChange={(e) => setTravelerName(e.target.value)} placeholder={tr("الاسم الكامل", "Nom complet", "Full name")} className="w-full rounded-xl bg-secondary px-4 py-3 text-sm outline-none" />
          <input required type="email" maxLength={255} placeholder={tr("البريد الإلكتروني", "Adresse e-mail", "Email address")} className="w-full rounded-xl bg-secondary px-4 py-3 text-sm outline-none" />
          <input required maxLength={20} value={travelerPhone} onChange={(e) => setTravelerPhone(e.target.value)} placeholder={tr("رقم الهاتف", "Numéro de téléphone", "Phone number")} className="w-full rounded-xl bg-secondary px-4 py-3 text-sm outline-none" />
          <textarea maxLength={500} value={travelerNotes} onChange={(e) => setTravelerNotes(e.target.value)} placeholder={tr("ملاحظات للوكالة (اختياري)", "Notes pour l'agence (facultatif)", "Notes for the agency (optional)")} className="w-full rounded-xl bg-secondary px-4 py-3 text-sm outline-none" />
        </div>

        <fieldset className="rounded-2xl border border-border bg-card p-4">
          <legend className="px-1 text-sm font-semibold">{tr("طريقة الدفع", "Mode de paiement", "Payment method")}</legend>
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
                    {!m.available && <span className="mr-2 rounded-full bg-warning/20 px-2 py-0.5 text-[10px] font-bold">{tr("قريبًا", "Bientôt", "Coming soon")}</span>}
                  </span>
                  <span className="block text-xs text-muted-foreground">{m.note}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="mb-2 flex items-center gap-2 text-sm font-bold">
            <ShieldCheck className="h-4 w-4 text-primary" strokeWidth={1.5} /> {tr("تفصيل السعر", "Détail du prix", "Price breakdown")}
          </h2>
          <div className="mb-1 flex justify-between text-sm">
             <span className="text-muted-foreground">{formatDZ(nightlyPrice)} × {trip ? `${guests} ${tr("مسافر", "voyageur(s)", "traveler(s)")}` : `${nights} ${tr("ليلة", "nuit(s)", "night(s)")}`}</span>
            <span>{formatDZ(rooms)} {DZD}</span>
          </div>
           {!trip && <div className="mb-1 flex justify-between text-sm">
            <span className="text-muted-foreground">{tr("الرسوم", "Taxes", "Fees")} ({Math.round(taxRate * 100)}%)</span>
            <span>{formatDZ(taxes)} {DZD}</span>
           </div>}
          <div className="mb-3 flex justify-between text-sm">
            <span className="text-muted-foreground">{tr("رسوم خدمة رحلتي (4%)", "Frais de service Rihlaty (4%)", "Rihlaty service fee (4%)")}</span>
            <span>{formatDZ(fees.serviceFee)} {DZD}</span>
          </div>
          <div className="flex items-center justify-between border-t border-border pt-3">
            <span className="font-bold">{tr("الإجمالي", "Total", "Total")}</span>
            <span className="text-xl font-black text-primary">{formatDZ(total)} {DZD}</span>
          </div>
           <p className="mt-2 text-[11px] text-muted-foreground">{trip ? tr("سعر الرحلة × عدد المسافرين + 4% رسوم خدمة = الإجمالي", "Prix du voyage × nombre de voyageurs + 4% de frais de service = total", "Trip price × number of travelers + 4% service fee = total") : tr("(سعر الليلة × عدد الليالي) + الرسوم + 4% رسوم خدمة = الإجمالي", "(Prix de la nuit × nombre de nuits) + taxes + 4% de frais de service = total", "(Nightly price × number of nights) + fees + 4% service fee = total")}</p>
           <p className="mt-1 text-[11px] text-muted-foreground">{tr("إلغاء مجاني قبل أكثر من 48 ساعة من الانطلاق · أقل من 48 ساعة: خصم 15%.", "Annulation gratuite plus de 48 heures avant le départ · moins de 48 heures : retenue de 15%.", "Free cancellation more than 48 hours before departure · less than 48 hours: 15% deduction.")}</p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-2xl bg-primary py-4 font-bold text-primary-foreground disabled:opacity-60"
        >
           {submitting ? tr("جارٍ الإرسال…", "Envoi en cours…", "Sending…") : trip ? tr("إرسال طلب الحجز", "Envoyer la demande de réservation", "Send booking request") : tr("تأكيد الحجز", "Confirmer la réservation", "Confirm booking")}
        </button>
      </form>

      <div className="mt-8">
        <TrustGuarantees />
      </div>
    </div>
  );
}
