import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, ShieldX } from "lucide-react";
import { verifyBooking } from "@/lib/verify.functions";

export const Route = createFileRoute("/_app/verify/booking/$id")({
  head: () => ({
    meta: [
      { title: "التحقق من صلاحية الحجز — رحلتي" },
      { name: "description", content: "صفحة عامة للتحقق من صلاحية حجز صادر عن منصة رحلتي دون كشف أي بيانات شخصية." },
      { property: "og:title", content: "التحقق من صلاحية الحجز — رحلتي" },
      { property: "og:description", content: "تحقق من صلاحية حجز رحلتي." },
    ],
  }),
  component: VerifyBooking,
});

function VerifyBooking() {
  const { id } = Route.useParams();
  const verify = useServerFn(verifyBooking);
  const { data, isPending } = useQuery({
    queryKey: ["verify-booking", id],
    queryFn: () => verify({ data: { id } }),
  });

  return (
    <div className="mx-auto max-w-md px-4 py-12 animate-fade-in">
      <h1 className="mb-1 text-2xl font-black">التحقق من الحجز</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        تعرض هذه الصفحة صلاحية الحجز فقط، دون أي بيانات شخصية للمسافر.
      </p>

      {isPending && <p className="text-center text-muted-foreground">جارٍ التحقق…</p>}

      {data && (
        <div className="rounded-3xl border border-border bg-card p-6 text-center">
          {data.valid ? (
            <>
              <ShieldCheck className="mx-auto mb-2 h-12 w-12 text-primary" strokeWidth={1.5} />
              <p className="mb-4 text-lg font-black">حجز صالح</p>
              <dl className="space-y-1 text-sm text-muted-foreground">
                <div>رقم الحجز: <span className="font-mono text-foreground">{data.bookingRef}</span></div>
                <div>الحالة: {data.status}</div>
                <div dir="ltr">{data.checkIn} → {data.checkOut}</div>
                <div>عدد المسافرين: {data.travelers}</div>
                {data.agency && <div>الوكالة: {data.agency}</div>}
                {data.destination && <div>الوجهة: {data.destination}</div>}
              </dl>
            </>
          ) : (
            <>
              <ShieldX className="mx-auto mb-2 h-12 w-12 text-destructive" strokeWidth={1.5} />
              <p className="text-lg font-black">حجز غير صالح أو غير مؤكّد</p>
              <p className="mt-2 text-sm text-muted-foreground">تأكد من الرقم أو تواصل مع الجهة التي أصدرت الحجز.</p>
            </>
          )}
        </div>
      )}

      <Link to="/verify" className="mt-6 block text-center text-sm font-semibold text-primary">
        التحقق برقم حجز آخر
      </Link>
    </div>
  );
}
