import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ShieldCheck, ShieldX, Plane, CalendarDays, Users, Building2 } from "lucide-react";
import { verifyBooking } from "@/lib/verify.functions";

export const Route = createFileRoute("/_app/verify/booking/$id")({
  head: () => ({
    meta: [
      { title: "التحقق من صلاحية الحجز — رحلتي" },
      { name: "description", content: "صفحة عامة للتحقق من صلاحية حجز صادر عن منصة رحلتي دون كشف أي بيانات شخصية." },
      { property: "og:title", content: "التحقق من صلاحية الحجز — رحلتي" },
      { property: "og:description", content: "تحقق من صلاحية حجز رحلتي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerifyBooking,
});

function VerifyBooking() {
  const { id } = Route.useParams();
  const verify = useServerFn(verifyBooking);
  const [qr, setQr] = useState<string | null>(null);

  const { data, isPending } = useQuery({
    queryKey: ["verify-booking", id],
    queryFn: () => verify({ data: { id } }),
  });

  useEffect(() => {
    const url = `${window.location.origin}/verify/booking/${id}`;
    import("qrcode")
      .then((m) => m.toDataURL(url, { margin: 1, width: 320, color: { dark: "#0f172a", light: "#ffffff" } }))
      .then(setQr)
      .catch(() => setQr(null));
  }, [id]);

  return (
    <div className="mx-auto max-w-md px-4 py-10 animate-fade-in">
      <h1 className="mb-1 text-2xl font-black">بطاقة التحقق من الحجز</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        تعرض هذه البطاقة صلاحية الحجز فقط، دون أي بيانات شخصية للمسافر.
      </p>

      {isPending && <p className="text-center text-muted-foreground">جارٍ التحقق…</p>}

      {data && (
        <div className="overflow-hidden rounded-3xl bg-card border border-border/60 shadow-2xl shadow-slate-200/60 dark:shadow-black/30">
          {/* Pass header */}
          <div className="flex items-center justify-between px-5 py-4 bg-foreground text-background">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5" strokeWidth={1.75} />
              <span className="text-sm font-black tracking-widest">RIHLA PASS</span>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                data.valid ? "bg-success text-success-foreground" : "bg-destructive text-destructive-foreground"
              }`}
            >
              {data.valid ? "RIHLA VERIFIED ✓" : "غير صالح"}
            </span>
          </div>

          {data.valid ? (
            <>
              <div className="px-5 py-5">
                <p className="text-[11px] font-semibold text-muted-foreground">رقم الحجز</p>
                <p className="font-mono text-xl font-black tracking-wider" dir="ltr">{data.bookingRef}</p>

                <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} /> التواريخ
                    </p>
                    <p className="font-bold" dir="ltr">{data.checkIn} → {data.checkOut}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" strokeWidth={1.75} /> المسافرون
                    </p>
                    <p className="font-bold">{data.travelers}</p>
                  </div>
                  {data.destination && (
                    <div>
                      <p className="text-[11px] text-muted-foreground">الوجهة</p>
                      <p className="font-bold">{data.destination}</p>
                    </div>
                  )}
                  {data.agency && (
                    <div>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" strokeWidth={1.75} /> الوكالة
                      </p>
                      <p className="font-bold">{data.agency}</p>
                    </div>
                  )}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full bg-accent/10 text-accent px-3 py-1 text-[11px] font-bold">
                    الحالة: {data.status}
                  </span>
                  <span className="rounded-full bg-success/10 text-success px-3 py-1 text-[11px] font-bold inline-flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.75} /> حجز موثّق
                  </span>
                </div>
              </div>

              {/* Perforation */}
              <div className="relative">
                <div className="border-t border-dashed border-border" />
                <span className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-background" />
                <span className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-background" />
              </div>

              <div className="px-5 py-6 flex flex-col items-center">
                <div className="rounded-3xl border border-border bg-white p-3 shadow-xl shadow-slate-200/60">
                  {qr ? (
                    <img src={qr} alt="رمز التحقق من الحجز" width={180} height={180} className="h-44 w-44" />
                  ) : (
                    <div className="h-44 w-44 animate-pulse rounded-2xl bg-muted" />
                  )}
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground text-center">
                  امسح الرمز للتحقق من صلاحية هذا الحجز في أي وقت.
                </p>
              </div>
            </>
          ) : (
            <div className="px-5 py-10 text-center">
              <ShieldX className="mx-auto mb-2 h-12 w-12 text-destructive" strokeWidth={1.75} />
              <p className="text-lg font-black">حجز غير صالح أو غير مؤكّد</p>
              <p className="mt-2 text-sm text-muted-foreground">تأكد من الرقم أو تواصل مع الجهة التي أصدرت الحجز.</p>
            </div>
          )}
        </div>
      )}

      <Link to="/verify" className="mt-6 block text-center text-sm font-semibold text-primary">
        التحقق برقم حجز آخر
      </Link>
    </div>
  );
}
