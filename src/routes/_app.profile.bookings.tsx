import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CreditCard, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/_app/profile/bookings")({
  component: BookingsPage,
});

function BookingsPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    supabase.from("bookings").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { setBookings(data ?? []); setLoading(false); });
  }, [user]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <Link to="/profile" className="inline-flex items-center gap-1 text-sm text-primary mb-4">
        <ArrowRight className="h-4 w-4" /> {t("back")}
      </Link>
      <h1 className="text-2xl font-black mb-4 flex items-center gap-2"><CreditCard className="h-6 w-6 text-primary" /> {t("myBookings")}</h1>

      {loading ? (
        <p className="text-muted-foreground text-center py-10">...</p>
      ) : bookings.length === 0 ? (
        <div className="bg-card rounded-2xl p-10 text-center shadow-soft">
          <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">لا توجد حجوزات بعد</p>
          <Link to="/hotels" className="inline-block mt-4 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">احجز الآن</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="bg-card rounded-2xl p-4 shadow-soft">
              <p className="font-semibold">{b.destination_name ?? "حجز"}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(b.created_at).toLocaleDateString("ar-DZ")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
