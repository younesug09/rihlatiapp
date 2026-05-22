import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Calendar, Users, CreditCard, CheckCircle2 } from "lucide-react";
import { destinations } from "@/data/destinations";

export const Route = createFileRoute("/_app/booking")({
  validateSearch: z.object({ id: z.string().optional() }),
  head: () => ({ meta: [{ title: "احجز رحلتك — رحلتي" }] }),
  component: Booking,
});

function Booking() {
  const { id } = Route.useSearch();
  const d = destinations.find((x) => x.id === id) ?? destinations[0];
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(3);
  const [done, setDone] = useState(false);

  const total = d.price * nights * guests;

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center animate-scale-in">
        <div className="h-20 w-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="h-10 w-10 text-success" />
        </div>
        <h1 className="text-2xl font-bold mb-2">تم تأكيد الحجز!</h1>
        <p className="text-muted-foreground mb-6">سنرسل لك تفاصيل رحلتك إلى {d.name} عبر البريد الإلكتروني.</p>
        <Link to="/home" className="inline-block px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-5">إكمال الحجز</h1>

      {/* Destination summary */}
      <div className="bg-card rounded-2xl shadow-soft p-3 flex gap-3 mb-5">
        <img src={d.image} alt={d.name} width={96} height={96} loading="lazy" className="h-24 w-24 rounded-xl object-cover" />
        <div className="flex-1">
          <h3 className="font-bold">{d.name}</h3>
          <p className="text-sm text-muted-foreground">{d.country}</p>
          <p className="text-sm text-primary font-semibold mt-2">{d.price.toLocaleString("ar")} دج / ليلة</p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); setDone(true); }}
        className="space-y-4"
      >
        <div className="bg-card rounded-2xl p-4 shadow-soft">
          <label className="text-sm font-semibold flex items-center gap-2 mb-3">
            <Calendar className="h-4 w-4 text-primary" /> تواريخ الإقامة
          </label>
          <div className="grid grid-cols-2 gap-3">
            <input type="date" required className="bg-secondary rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
            <input type="date" required className="bg-secondary rounded-xl px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm">عدد الليالي</span>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setNights(Math.max(1, nights - 1))} className="h-8 w-8 rounded-full bg-secondary font-bold">-</button>
              <span className="font-bold w-6 text-center">{nights}</span>
              <button type="button" onClick={() => setNights(nights + 1)} className="h-8 w-8 rounded-full bg-secondary font-bold">+</button>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-soft flex items-center justify-between">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" /> عدد المسافرين
          </label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setGuests(Math.max(1, guests - 1))} className="h-8 w-8 rounded-full bg-secondary font-bold">-</button>
            <span className="font-bold w-6 text-center">{guests}</span>
            <button type="button" onClick={() => setGuests(guests + 1)} className="h-8 w-8 rounded-full bg-secondary font-bold">+</button>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-soft space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" /> معلومات الاتصال
          </label>
          <input required placeholder="الاسم الكامل" className="w-full bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
          <input required type="email" placeholder="البريد الإلكتروني" className="w-full bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
          <input required placeholder="رقم الهاتف" className="w-full bg-secondary rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div className="bg-card rounded-2xl p-4 shadow-soft">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">{d.price.toLocaleString("ar")} × {nights} × {guests}</span>
            <span>{total.toLocaleString("ar")} دج</span>
          </div>
          <div className="flex justify-between text-sm mb-3">
            <span className="text-muted-foreground">رسوم الخدمة</span>
            <span>مجانًا</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between items-center">
            <span className="font-bold">الإجمالي</span>
            <span className="text-xl font-bold text-primary">{total.toLocaleString("ar")} دج</span>
          </div>
        </div>

        <button type="submit" className="w-full py-4 rounded-2xl font-bold text-primary-foreground shadow-glow hover:scale-[1.02] transition-transform" style={{ background: "var(--gradient-primary)" }}>
          تأكيد الحجز
        </button>
      </form>
    </div>
  );
}
