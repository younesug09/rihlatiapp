import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, ShieldX, Search } from "lucide-react";
import { verifyBooking } from "@/lib/verify.functions";

export const Route = createFileRoute("/_app/verify")({
  validateSearch: z.object({ id: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "التحقق من الحجز — رحلتي" },
      { name: "description", content: "تحقق من صحة رقم الحجز الصادر عن منصة رحلتي." },
      { property: "og:title", content: "التحقق من الحجز — رحلتي" },
      { property: "og:description", content: "تحقق من صحة رقم الحجز الصادر عن منصة رحلتي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const search = Route.useSearch();
  const [value, setValue] = useState(search.id ?? "");
  const [query, setQuery] = useState(search.id ?? "");
  const verify = useServerFn(verifyBooking);

  const { data, isFetching } = useQuery({
    queryKey: ["verify", query],
    queryFn: () => verify({ data: { id: query } }),
    enabled: query.length >= 4,
  });

  return (
    <div className="mx-auto max-w-md px-4 py-10 animate-fade-in">
      <h1 className="text-2xl font-black mb-2">التحقق من الحجز</h1>
      <p className="text-sm text-muted-foreground mb-5">أدخل رقم الحجز (مثال: RH-XXXXXXXX) للتأكد من صحته.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuery(value.trim().toUpperCase());
        }}
        className="flex gap-2 mb-5"
      >
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="RH-XXXXXXXX"
          className="flex-1 rounded-2xl bg-secondary px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          className="rounded-2xl px-4 font-bold text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
          aria-label="تحقق"
        >
          <Search className="h-4 w-4" />
        </button>
      </form>

      {isFetching && <p className="text-center text-muted-foreground">...</p>}

      {data && !isFetching && (
        <div className="rounded-3xl bg-card p-5 shadow-soft text-center">
          {data.valid ? (
            <>
              <ShieldCheck className="h-12 w-12 mx-auto text-primary mb-2" />
              <p className="font-black text-lg mb-3">حجز صالح</p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>الرقم: {data.bookingRef}</p>
                <p>الحالة: {data.status}</p>
                <p>
                  {data.checkIn} ← {data.checkOut}
                </p>
                <p>عدد المسافرين: {data.travelers}</p>
                {data.agency && <p>الوكالة: {data.agency}</p>}
                {data.destination && <p>الوجهة: {data.destination}</p>}
              </div>
            </>
          ) : (
            <>
              <ShieldX className="h-12 w-12 mx-auto text-destructive mb-2" />
              <p className="font-black text-lg">لا يوجد حجز مؤكد بهذا الرقم</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
