import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, Lock, User as UserIcon, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — رحلتي" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/home" });
    });
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("تم إنشاء الحساب! تحقق من بريدك لتأكيد التسجيل.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("مرحبًا بعودتك!");
        navigate({ to: "/home" });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "حدث خطأ";
      toast.error(msg.includes("Invalid login") ? "بريد أو كلمة مرور غير صحيحة" : msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error("فشل تسجيل الدخول عبر Google");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/home" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col" dir="rtl">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-sky)" }} />

      <Link to="/home" className="m-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary w-fit">
        <ArrowLeft className="h-4 w-4" /> العودة
      </Link>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6 animate-fade-in">
            <img src={logo} alt="رحلتي" className="h-16 w-16 mx-auto mb-3" width={64} height={64} />
            <h1 className="text-2xl font-bold">{mode === "signin" ? "أهلًا بعودتك" : "إنشاء حساب جديد"}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "signin" ? "سجّل الدخول لمتابعة رحلتك" : "انضم لاكتشاف وجهات لا تُنسى"}
            </p>
          </div>

          <div className="bg-card rounded-3xl shadow-card p-6 animate-scale-in">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-secondary hover:bg-accent font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mb-4"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              المتابعة بحساب Google
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">أو</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-3">
              {mode === "signup" && (
                <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="الاسم الكامل" className="flex-1 bg-transparent outline-none text-sm" />
                </div>
              )}
              <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder="البريد الإلكتروني" className="flex-1 bg-transparent outline-none text-sm" />
              </div>
              <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} required type="password" minLength={6} placeholder="كلمة المرور" className="flex-1 bg-transparent outline-none text-sm" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl font-bold text-primary-foreground shadow-glow disabled:opacity-50 transition-transform hover:scale-[1.01]"
                style={{ background: "var(--gradient-primary)" }}
              >
                {loading ? "..." : mode === "signin" ? "تسجيل الدخول" : "إنشاء الحساب"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-5">
              {mode === "signin" ? "ليس لديك حساب؟" : "لديك حساب؟"}{" "}
              <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-bold">
                {mode === "signin" ? "أنشئ حسابًا" : "سجّل الدخول"}
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            رحلتي — مشروع تخرج ماستر علوم الإعلام والاتصال
          </p>
        </div>
      </div>
    </div>
  );
}
