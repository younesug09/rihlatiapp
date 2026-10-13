import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/messages")({
  head: () => ({ meta: [
    { title: "الرسائل — رحلتي" },
    { name: "description", content: "محادثات الحجز بين المسافر والوكالة على رحلتي." },
    { property: "og:title", content: "الرسائل — رحلتي" },
    { property: "og:description", content: "تابع محادثات حجوزاتك بأمان." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: MessagesPage,
});

type BookingThread = { id: string; booking_ref: string | null; status: string; notes: string | null };
type Message = { id: string; booking_id: string; sender_id: string; body: string; created_at: string };

function MessagesPage() {
  const { user } = useAuth();
  const { tr } = useLanguage();
  const [threads, setThreads] = useState<BookingThread[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    void supabase.from("bookings").select("id, booking_ref, status, notes").order("updated_at", { ascending: false }).then(({ data }) => {
      const rows = (data as BookingThread[] | null) ?? [];
      setThreads(rows);
      setSelected(rows[0]?.id ?? null);
      setLoading(false);
    });
  }, [user]);

  useEffect(() => {
    if (!selected) return;
    void supabase.from("messages").select("id, booking_id, sender_id, body, created_at").eq("booking_id", selected).order("created_at").then(({ data }) => setMessages((data as Message[] | null) ?? []));
  }, [selected]);

  const send = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !selected || !body.trim()) return;
    const { data, error } = await supabase.from("messages").insert({ booking_id: selected, sender_id: user.id, body: body.trim() }).select("id, booking_id, sender_id, body, created_at").single();
    if (error) return toast.error(tr("تعذّر إرسال الرسالة", "Impossible d'envoyer le message", "Could not send message"));
    setMessages((current) => [...current, data as Message]);
    setBody("");
    toast.success(tr("تم إرسال الرسالة", "Message envoyé", "Message sent"));
  };

  if (!user) return <div className="mx-auto max-w-md px-4 py-16 text-center"><p>{tr("سجّل الدخول لعرض الرسائل.", "Connectez-vous pour voir les messages.", "Sign in to view messages.")}</p><Button asChild className="mt-4"><Link to="/auth">{tr("تسجيل الدخول", "Se connecter", "Sign in")}</Link></Button></div>;

  return <main className="mx-auto max-w-5xl px-4 py-8">
    <div className="mb-5"><p className="text-xs font-bold text-primary">RIHLA CONNECT</p><h1 className="text-3xl font-black">{tr("الرسائل", "Messages", "Messages")}</h1></div>
    {loading ? <div className="grid gap-4 md:grid-cols-[18rem_1fr]"><div className="h-96 animate-pulse rounded-lg bg-secondary" /><div className="h-96 animate-pulse rounded-lg bg-secondary" /></div> : threads.length === 0 ? <div className="border border-dashed border-border py-16 text-center"><MessageCircle className="mx-auto h-9 w-9 text-muted-foreground" /><p className="mt-3 text-muted-foreground">{tr("تظهر المحادثات بعد إرسال أول طلب حجز.", "Les conversations apparaissent après votre première demande de réservation.", "Conversations appear after you send your first booking request.")}</p></div> : <div className="grid min-h-[32rem] overflow-hidden rounded-lg border border-border bg-card md:grid-cols-[18rem_1fr]">
      <aside className="border-b border-border md:border-b-0 md:border-l"><div className="flex gap-2 overflow-x-auto p-3 md:block md:space-y-2">{threads.map((thread) => <Button key={thread.id} type="button" variant={selected === thread.id ? "default" : "ghost"} onClick={() => setSelected(thread.id)} className="h-auto min-w-44 justify-start p-3 text-start md:w-full"><span><span className="block font-mono text-xs">{thread.booking_ref}</span><span className="block truncate text-xs opacity-70">{thread.notes ?? thread.status}</span></span></Button>)}</div></aside>
      <section className="flex min-h-[26rem] flex-col"><div className="flex-1 space-y-3 overflow-y-auto p-4">{messages.length === 0 ? <p className="py-16 text-center text-sm text-muted-foreground">{tr("ابدأ المحادثة حول هذا الحجز.", "Démarrez la conversation sur cette réservation.", "Start the conversation about this booking.")}</p> : messages.map((message) => <div key={message.id} className={`max-w-[80%] rounded-lg p-3 text-sm ${message.sender_id === user.id ? "me-auto bg-primary text-primary-foreground" : "ms-auto bg-secondary"}`}><p>{message.body}</p><p className="mt-1 text-[10px] opacity-65">{new Date(message.created_at).toLocaleString()}</p></div>)}</div><form onSubmit={send} className="flex gap-2 border-t border-border p-3"><Input value={body} onChange={(event) => setBody(event.target.value)} maxLength={2000} placeholder={tr("اكتب رسالة…", "Écrivez un message…", "Write a message…")} aria-label={tr("نص الرسالة", "Texte du message", "Message text")} /><Button type="submit" size="icon" aria-label={tr("إرسال", "Envoyer", "Send")}><Send className="h-4 w-4" /></Button></form></section>
    </div>}
  </main>;
}
