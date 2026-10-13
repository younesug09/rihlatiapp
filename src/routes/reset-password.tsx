import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "إعادة تعيين كلمة المرور — رحلتي" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const { tr } = useLanguage();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error(tr("كلمتا المرور غير متطابقتين", "Les mots de passe ne correspondent pas", "Passwords do not match"));
    if (password.length < 6) return toast.error(tr("كلمة المرور قصيرة جداً", "Le mot de passe est trop court", "Password is too short"));
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success(tr("تم تحديث كلمة المرور بنجاح", "Mot de passe mis à jour avec succès", "Password updated successfully"));
      navigate({ to: "/home" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : tr("تعذر تحديث كلمة المرور", "Impossible de mettre à jour le mot de passe", "Could not update the password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4" dir="rtl">
      <div className="absolute inset-0 -z-10" style={{ background: "var(--gradient-hero)" }} />
      <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-white/20 blur-3xl animate-blob" />

      <div className="w-full max-w-md bg-card/95 backdrop-blur-2xl rounded-3xl shadow-card p-7 animate-scale-in border border-white/40">
        <div className="flex items-center gap-3 mb-5">
          <img src={logo} alt="Rihlaty" className="h-12 w-12 object-contain" />
          <div>
            <h1 className="text-2xl font-black">{tr("كلمة مرور جديدة", "Nouveau mot de passe", "New password")}</h1>
            <p className="text-xs text-muted-foreground">{tr("اختر كلمة مرور قوية", "Choisissez un mot de passe fort", "Choose a strong password")}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              type={show ? "text" : "password"}
              minLength={6}
              placeholder={tr("كلمة المرور الجديدة", "Nouveau mot de passe", "New password")}
              className="flex-1 bg-transparent outline-none text-sm"
            />
            <button type="button" onClick={() => setShow(!show)} className="text-muted-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2 bg-secondary rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-primary">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <input
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              type={show ? "text" : "password"}
              minLength={6}
              placeholder={tr("تأكيد كلمة المرور", "Confirmer le mot de passe", "Confirm password")}
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-primary-foreground shadow-glow disabled:opacity-50"
            style={{ background: "var(--gradient-primary)" }}
          >
            {loading ? "..." : tr("حفظ كلمة المرور", "Enregistrer le mot de passe", "Save password")}
          </button>
        </form>
      </div>
    </div>
  );
}
