import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, Lock, User as UserIcon, ArrowLeft, Eye, EyeOff, Sparkles, MapPin, Plane } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useLanguage } from "@/hooks/useLanguage";
import logo from "@/assets/logo.png";
import { getDashboardPath } from "@/lib/roleRedirect";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — رحلتي" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<"customer" | "agency">("customer");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const go = async () => navigate({ to: await getDashboardPath(), replace: true });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) go();
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) go();
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { data: { full_name: name, account_type: accountType }, emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success(t("accountCreated"));
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t("welcomeBackToast"));
        navigate({ to: await getDashboardPath() });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      toast.error(msg.includes("Invalid login") ? t("invalidCreds") : msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) { toast.error(t("googleFail")); setLoading(false); return; }
    if (result.redirected) return;
    navigate({ to: await getDashboardPath() });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col lg:flex-row">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/20 blur-3xl animate-blob" />
      <div className="absolute -bottom-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-primary-glow/30 blur-3xl animate-blob" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/3 left-1/3 h-72 w-72 rounded-full bg-accent/20 blur-3xl animate-blob" style={{ animationDelay: "6s" }} />

      <div className="hidden lg:flex flex-col justify-between p-12 w-1/2 text-white relative">
        <Link to="/home" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white w-fit">
          <ArrowLeft className="h-4 w-4" /> {t("browseNoSignin")}
        </Link>
        <div className="space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs">
            <Sparkles className="h-3.5 w-3.5" /> {t("platformBadge")}
          </div>
          <h2 className="text-5xl font-black leading-tight">
            {t("discoverAlgWorld")}
            <span className="block text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg,#fff,#a5d8ff,#fff)", backgroundSize: "200% 100%", animation: "shine 4s linear infinite" }}>
              {t("inOneJourney")}
            </span>
          </h2>
          <p className="text-white/85 text-lg max-w-md">{t("authPara")}</p>
          <div className="flex gap-3">
            {[
              { icon: MapPin, t: t("badge150") },
              { icon: Plane, t: t("instantBook") },
              { icon: Sparkles, t: t("luxuryExp") },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-sm">
                <b.icon className="h-4 w-4" /> {b.t}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-white/60">{t("appName")} © 2026</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10 relative">
        <Link to="/home" className="lg:hidden absolute top-4 right-4 text-xs text-white/90 inline-flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> {t("skip")}
        </Link>

        <div className="w-full max-w-md">
          <div className="text-center mb-5 lg:hidden animate-fade-in">
            <div className="h-24 w-24 mx-auto rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-glow mb-3 border border-white/20">
              <img src={logo} alt={t("appName")} className="h-16 w-16" />
            </div>
            <h1 className="text-3xl font-black text-white">{t("appName")}</h1>
          </div>

          <div className="bg-card/95 backdrop-blur-2xl rounded-3xl shadow-card p-7 animate-scale-in border border-white/40">
            <div className="hidden lg:flex items-center gap-3 mb-5">
              <img src={logo} alt={t("appName")} className="h-12 w-12" />
              <div>
                <h1 className="text-2xl font-black">{mode === "signin" ? t("welcomeBack") : t("startJourney")}</h1>
                <p className="text-xs text-muted-foreground">{mode === "signin" ? t("continueExp") : t("createGo")}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 bg-secondary rounded-2xl p-1 mb-5 text-sm font-semibold">
              <button onClick={() => setMode("signin")} className={`py-2 rounded-xl transition-all ${mode === "signin" ? "bg-card shadow-soft text-primary" : "text-muted-foreground"}`}>{t("signIn")}</button>
              <button onClick={() => setMode("signup")} className={`py-2 rounded-xl transition-all ${mode === "signup" ? "bg-card shadow-soft text-primary" : "text-muted-foreground"}`}>{t("signUp")}</button>
            </div>

            <button onClick={handleGoogle} disabled={loading} className="w-full py-3 rounded-2xl bg-secondary hover:bg-accent font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mb-4 border border-border">
              <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              {t("continueGoogle")}
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{t("orEmail")}</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <form onSubmit={handleEmailAuth} className="space-y-3">
              {mode === "signup" && (
                <div>
                  <p className="text-sm font-bold mb-2 text-center">ماذا تريد أن تفعل على RIHLA؟</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "customer" as const, emoji: "👤", label: "أنا مسافر", sub: "حساب مسافر" },
                      { id: "agency" as const, emoji: "🏢", label: "أنا وكالة سياحية", sub: "حساب وكالة" },
                    ].map((o) => (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setAccountType(o.id)}
                        aria-pressed={accountType === o.id}
                        className={`rounded-3xl p-4 text-center transition border-2 ${
                          accountType === o.id
                            ? "border-primary bg-primary/10 shadow-soft"
                            : "border-border bg-secondary text-muted-foreground"
                        }`}
                      >
                        <span className="block text-2xl">{o.emoji}</span>
                        <span className="block text-sm font-bold mt-1 text-foreground">{o.label}</span>
                        <span className="block text-[11px]">{o.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {mode === "signup" && (
                <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary transition">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <input value={name} onChange={(e) => setName(e.target.value)} required placeholder={t("fullName")} className="flex-1 bg-transparent outline-none text-sm" />
                </div>
              )}
              <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary transition">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} required type="email" placeholder={t("email")} className="flex-1 bg-transparent outline-none text-sm" />
              </div>
              <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary transition">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} required type={show ? "text" : "password"} minLength={6} placeholder={t("password")} className="flex-1 bg-transparent outline-none text-sm" />
                <button type="button" onClick={() => setShow(!show)} className="text-muted-foreground hover:text-foreground">
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl font-bold text-primary-foreground shadow-glow disabled:opacity-50 transition-transform hover:scale-[1.01] active:scale-[0.99] relative overflow-hidden" style={{ background: "var(--gradient-primary)" }}>
                <span className="relative z-10">{loading ? "..." : mode === "signin" ? t("signIn") : t("signUp")}</span>
              </button>

              {mode === "signin" && (
                <Link to="/forgot-password" className="block text-center text-xs text-primary font-semibold hover:underline mt-1">
                  {t("forgotPwd")}
                </Link>
              )}
            </form>

            <p className="text-center text-[11px] text-muted-foreground mt-5">
              {t("agreeTerms")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
