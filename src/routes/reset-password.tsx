import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RihlatyLogo } from "@/components/RihlatyLogo";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "إعادة تعيين كلمة المرور — رحلتي" }] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("كلمتا المرور غير متطابقتين");
    if (password.length < 6) return toast.error("كلمة المرور قصيرة جداً");
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("تم تحديث كلمة المرور بنجاح");
      navigate({ to: "/home" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "تعذر تحديث كلمة المرور");
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
          <RihlatyLogo className="h-12 w-12" />
          <div>
            <h1 className="text-2xl font-black">كلمة مرور جديدة</h1>
            <p className="text-xs text-muted-foreground">اختر كلمة مرور قوية</p>
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
              placeholder="كلمة المرور الجديدة"
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
              placeholder="تأكيد كلمة المرور"
              className="flex-1 bg-transparent outline-none text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl font-bold text-primary-foreground shadow-glow disabled:opacity-50"
            style={{ background: "var(--gradient-primary)" }}
          >
            {loading ? "..." : "حفظ كلمة المرور"}
          </button>
        </form>
      </div>
    </div>
  );
}
