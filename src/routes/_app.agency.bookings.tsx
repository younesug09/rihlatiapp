import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CalendarCheck, Users } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_app/agency/bookings")({
  component: AgencyBookings,
});

type Booking = {
  id: string;
  booking_ref: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: string;
  notes: string | null;
  created_at: string;
  trip_id: string | null;
};

const statuses = [
  { id: "pending", label: "معلّق" },
  { id: "confirmed", label: "مؤكّد" },
  { id: "cancelled", label: "ملغى" },
  { id: "completed", label: "منتهٍ" },
];

function AgencyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: a } = await supabase.from("agencies").select("id").eq("owner_id", user.id).maybeSingle();
      if (!a) {
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("agency_id", a.id)
        .order("created_at", { ascending: false });
      setBookings((data as Booking[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast.error("تعذّر التحديث");
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    toast.success("تم تحديث حالة الحجز");
  };

  const shown = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) return <p className="text-center text-muted-foreground py-10">...</p>;

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-xl font-black flex items-center gap-2">
        <CalendarCheck className="h-5 w-5 text-primary" /> طلبات الحجز
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {[{ id: "all", label: "الكل" }, ...statuses].map((s) => (
          <button
            key={s.id}
            onClick={() => setFilter(s.id)}
            className={`rounded-2xl px-4 py-2 text-sm font-semibold whitespace-nowrap ${
              filter === s.id ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="rounded-3xl bg-card p-10 text-center shadow-soft">
          <p className="text-sm text-muted-foreground">لا توجد حجوزات في هذه الحالة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((b) => (
            <div key={b.id} className="rounded-3xl bg-card p-4 shadow-soft space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-sm">{b.booking_ref ?? "حجز"}</p>
                <span className="text-xs text-muted-foreground">
                  {new Date(b.created_at).toLocaleDateString("ar-DZ")}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {b.check_in} ← {b.check_out}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {b.guests} مسافر ·{" "}
                {Number(b.total_price).toLocaleString("ar")} دج
              </p>
              {b.notes && <p className="text-xs bg-secondary rounded-2xl p-2">{b.notes}</p>}
              <div className="flex flex-wrap gap-2 pt-1">
                {statuses.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStatus(b.id, s.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                      b.status === s.id ? "bg-primary text-primary-foreground" : "bg-secondary"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
