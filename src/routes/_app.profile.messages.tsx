import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageCircle, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile/messages")({
  head: () => ({
    meta: [
      { title: "رسائلي — رحلتي" },
      { name: "description", content: "محادثاتك مع الوكالات حول حجوزاتك في منصة رحلتي." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "رسائلي — رحلتي" },
      { property: "og:description", content: "تواصل مع الوكالة المسؤولة عن حجزك." },
    ],
  }),
  component: Messages,
});

type BookingRow = { id: string; booking_ref: string | null; notes: string | null; status: string };
type MessageRow = { id: string; body: string; sender_id: string; created_at: string };

function Messages() {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, booking_ref, notes, status")
        .order("created_at", { ascending: false });
      setBookings((data as BookingRow[]) ?? []);
    })();
  }, [user]);

  const loadMessages = useCallback(async (bookingId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("id, body, sender_id, created_at")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true });
    setMessages((data as MessageRow[]) ?? []);
  }, []);

  useEffect(() => {
    if (active) void loadMessages(active);
  }, [active, loadMessages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !active || !draft.trim()) return;
    const { error } = await supabase.from("messages").insert({
      booking_id: active,
      sender_id: user.id,
      body: draft.trim().slice(0, 1000),
    });
    if (error) return toast.error("تعذّر الإرسال: " + error.message);
    setDraft("");
    void loadMessages(active);
  };

  if (loading) return <p className="py-20 text-center text-muted-foreground">…</p>;

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="mb-3 text-muted-foreground">سجّل الدخول لعرض رسائلك.</p>
        <Link to="/auth" className="font-bold text-primary">تسجيل الدخول</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 animate-fade-in">
      <h1 className="mb-1 flex items-center gap-2 text-2xl font-black">
        <MessageCircle className="h-6 w-6 text-primary" strokeWidth={1.5} /> رسائلي
      </h1>
      <p className="mb-5 text-sm text-muted-foreground">كل محادثة مرتبطة بحجز، ويمكن للوكالة المعنية فقط الاطّلاع عليها.</p>

      {bookings.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
          لا توجد حجوزات بعد. <Link to="/stays" className="font-bold text-primary">تصفّح الإقامات</Link>
        </p>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-2xl border border-border bg-card">
              <button
                onClick={() => setActive(active === b.id ? null : b.id)}
                className="flex w-full items-center justify-between gap-3 p-4 text-right"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{b.notes ?? "حجز"}</span>
                  <span className="block font-mono text-xs text-muted-foreground">{b.booking_ref} · {b.status}</span>
                </span>
                <MessageCircle className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.5} />
              </button>

              {active === b.id && (
                <div className="border-t border-border p-4">
                  <ul className="mb-3 max-h-64 space-y-2 overflow-y-auto">
                    {messages.length === 0 && <li className="text-xs text-muted-foreground">لا توجد رسائل بعد.</li>}
                    {messages.map((m) => (
                      <li
                        key={m.id}
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                          m.sender_id === user.id ? "ms-auto bg-primary text-primary-foreground" : "bg-secondary"
                        }`}
                      >
                        {m.body}
                      </li>
                    ))}
                  </ul>
                  <form onSubmit={send} className="flex gap-2">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      maxLength={1000}
                      placeholder="اكتب رسالتك…"
                      className="flex-1 rounded-xl bg-secondary px-4 py-3 text-sm outline-none"
                    />
                    <button type="submit" aria-label="إرسال" className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                      <Send className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
