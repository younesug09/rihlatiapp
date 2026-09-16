import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { BadgeCheck, Printer, QrCode } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDZ, DZD } from "@/lib/format";

export const Route = createFileRoute("/_app/document")({
  validateSearch: z.object({ ref: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "وثيقة سفر رحلتي — نسخة قابلة للطباعة" },
      { name: "description", content: "وثيقة سفر رحلتي القابلة للطباعة مع رمز QR للتحقق من صحة الحجز." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "وثيقة سفر رحلتي" },
      { property: "og:description", content: "وثيقة سفر قابلة للطباعة مع رمز تحقق." },
    ],
  }),
  component: TravelDocument,
});

type Booking = {
  id: string;
  booking_ref: string | null;
  status: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  notes: string | null;
  destination_id: string | null;
};

function TravelDocument() {
  const { ref } = Route.useSearch();
  const { user, loading } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!user || !ref) {
      if (!loading) setFetched(true);
      return;
    }
    void (async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, booking_ref, status, check_in, check_out, guests, total_price, notes, destination_id")
        .eq("booking_ref", ref)
        .maybeSingle();
      setBooking((data as Booking) ?? null);
      setFetched(true);
    })();
  }, [user, ref, loading]);

  // QR is rendered in the browser only; it encodes the public verification URL.
  useEffect(() => {
    if (!booking?.id) return;
    void (async () => {
      const QRCode = (await import("qrcode")).default;
      const url = `${window.location.origin}/verify/booking/${booking.id}`;
      setQr(await QRCode.toDataURL(url, { width: 320, margin: 1 }));
    })();
  }, [booking?.id]);

  if (!ref) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-muted-foreground">لم يُحدَّد رقم الحجز.</p>
        <Link to="/profile/bookings" className="mt-4 inline-block font-semibold text-primary">حجوزاتي</Link>
      </div>
    );
  }

  if (!fetched) return <p className="py-20 text-center text-muted-foreground">جارٍ تحميل الوثيقة…</p>;

  if (!booking) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-muted-foreground">لم نعثر على هذا الحجز في حسابك.</p>
        <Link to="/profile/bookings" className="mt-4 inline-block font-semibold text-primary">حجوزاتي</Link>
      </div>
    );
  }

  const nights = Math.max(
    1,
    Math.round((new Date(booking.check_out).getTime() - new Date(booking.check_in).getTime()) / 86400000),
  );

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 animate-fade-in">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <h1 className="text-2xl font-black">وثيقة سفر رحلتي</h1>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          <Printer className="h-4 w-4" strokeWidth={1.5} /> طباعة / حفظ PDF
        </button>
      </div>

      <article className="rounded-3xl border border-border bg-card p-6">
        <header className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">RIHLA TRAVEL DOCUMENT</p>
            <h2 className="mt-1 text-xl font-black">وثيقة سفر رحلتي</h2>
            <p className="mt-1 text-xs text-muted-foreground">وثيقة صادرة عن منصة رحلتي — ليست وثيقة رسمية حكومية.</p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-primary-foreground">
            <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.5} /> رحلتي
          </span>
        </header>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div><dt className="text-xs text-muted-foreground">رقم الحجز</dt><dd className="font-mono font-black">{booking.booking_ref}</dd></div>
          <div><dt className="text-xs text-muted-foreground">الحالة</dt><dd className="font-semibold">{booking.status}</dd></div>
          <div><dt className="text-xs text-muted-foreground">الإقامة / الرحلة</dt><dd className="font-semibold">{booking.notes ?? "—"}</dd></div>
          <div><dt className="text-xs text-muted-foreground">الوجهة</dt><dd className="font-semibold">{booking.destination_id ?? "—"}</dd></div>
          <div><dt className="text-xs text-muted-foreground">تاريخ الدخول</dt><dd className="font-semibold">{booking.check_in}</dd></div>
          <div><dt className="text-xs text-muted-foreground">تاريخ الخروج</dt><dd className="font-semibold">{booking.check_out}</dd></div>
          <div><dt className="text-xs text-muted-foreground">عدد الليالي</dt><dd className="font-semibold">{nights}</dd></div>
          <div><dt className="text-xs text-muted-foreground">عدد المسافرين</dt><dd className="font-semibold">{booking.guests}</dd></div>
          <div className="sm:col-span-2">
            <dt className="text-xs text-muted-foreground">الإجمالي المدفوع / المستحق</dt>
            <dd className="text-lg font-black text-primary">{formatDZ(Number(booking.total_price))} {DZD}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-col items-center gap-2 border-t border-border pt-5">
          {qr ? (
            <img src={qr} alt={`رمز التحقق من الحجز ${booking.booking_ref}`} className="h-40 w-40" />
          ) : (
            <div className="grid h-40 w-40 place-items-center rounded-xl bg-secondary">
              <QrCode className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
            </div>
          )}
          <p className="text-center text-xs text-muted-foreground">
            امسح الرمز للتحقق من صلاحية الحجز عبر صفحة التحقق العامة.
          </p>
          <p dir="ltr" className="text-center text-[10px] text-muted-foreground">/verify/booking/{booking.id}</p>
        </div>
      </article>

      <p className="mt-4 text-xs text-muted-foreground print:hidden">
        نصيحة: اختر «حفظ بصيغة PDF» في نافذة الطباعة للحصول على نسخة رقمية.
      </p>
    </div>
  );
}
