import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, ArrowLeft, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RihlatyLogo } from "@/components/RihlatyLogo";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "نسيت كلمة المرور — رحلتي" }] }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("تم إرسال رابط الاستعادة إلى بريدك");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر إرسال الرابط");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4" dir="rtl">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/20 blur-3xl animate-blob" />
      <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-primary-glow/30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />

      <div className="w-full max-w-md">
        <Link to="/auth" className="inline-flex items-center gap-1 text-white/90 text-sm mb-4">
          <ArrowLeft className="h-4 w-4" /> عودة لتسجيل الدخول
        </Link>
        <div className="bg-card/95 backdrop-blur-2xl rounded-3xl shadow-card p-7 animate-scale-in border border-white/40">
          <div className="flex items-center gap-3 mb-5">
            <RihlatyLogo className="h-12 w-12" />
            <div>
              <h1 className="text-2xl font-black">نسيت كلمة المرور؟</h1>
              <p className="text-xs text-muted-foreground">سنرسل لك رابطاً لإعادة تعيينها</p>
            </div>
          </div>

          {sent ? (
            <div className="text-center py-6 space-y-4">
              <div className="h-16 w-16 rounded-full bg-success/15 mx-auto flex items-center justify-center">
                <KeyRound className="h-7 w-7 text-success" />
              </div>
              <div>
                <h2 className="font-bold text-lg">تحقق من بريدك الإلكتروني</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  أرسلنا رابط إعادة تعيين كلمة المرور إلى <b>{email}</b>
                </p>
              </div>
              <button
                onClick={() => navigate({ to: "/auth" })}
                className="w-full py-3 rounded-2xl font-bold text-primary-foreground"
                style={{ background: "var(--gradient-primary)" }}
              >
                العودة لتسجيل الدخول
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary transition">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl font-bold text-primary-foreground shadow-glow disabled:opacity-50"
                style={{ background: "var(--gradient-primary)" }}
              >
                {loading ? "..." : "إرسال رابط الاستعادة"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
