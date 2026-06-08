import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, BookOpen, Sparkles, Globe, Video, Camera, MessageCircle, Award } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/_app/about")({
  head: () => ({
    meta: [
      { title: "حول المشروع — رحلتي" },
      { name: "description", content: "مشروع تخرج ماستر في علوم الإعلام والاتصال — منصة سياحية تواصلية." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 animate-fade-in">
      {/* Hero */}
      <div className="rounded-3xl p-8 text-primary-foreground text-center shadow-card mb-6 relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <img src={logo} alt="رحلتي" className="h-20 w-20 mx-auto mb-3 bg-white/15 rounded-2xl p-2" width={80} height={80} />
          <h1 className="text-3xl font-bold mb-2">رحلتي</h1>
          <p className="text-sm text-white/90 leading-relaxed max-w-md mx-auto">
            منصة سياحية وتواصلية رقمية، تجمع بين روعة الوجهات وعمق الرسالة الإعلامية
          </p>
        </div>
      </div>

      {/* Project Info */}
      <section className="bg-card rounded-2xl p-6 shadow-soft mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-accent text-primary flex items-center justify-center">
            <GraduationCap className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold">مشروع تخرج أكاديمي</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-loose">
          تطبيق <span className="font-bold text-foreground">"رحلتي"</span> هو مشروع مقدم لنيل شهادة الماستر في
          تخصص <span className="font-bold text-foreground">علوم الإعلام والاتصال</span>،
          يهدف إلى توظيف الوسائط الرقمية الحديثة في الترويج للسياحة الجزائرية والعالمية،
          ودراسة أثر التواصل الإعلامي الرقمي على القرار السياحي.
        </p>
      </section>

      {/* Vision */}
      <section className="bg-card rounded-2xl p-6 shadow-soft mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-accent text-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold">رؤية المشروع</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-loose">
          إنشاء منصة عربية حديثة تُبرز جمال الوجهات السياحية، خاصة في الجزائر،
          عبر محتوى بصري ثري ولغة تواصلية جذابة، وتقديم نموذج تطبيقي يدمج بين
          <span className="font-semibold text-foreground"> الإعلام الجديد، التسويق الرقمي، والسياحة الذكية</span>.
        </p>
      </section>

      {/* Features grid */}
      <section className="mb-4">
        <h2 className="text-lg font-bold mb-3 px-1">المحاور الإعلامية والتواصلية</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Globe, title: "تسويق الوجهات", desc: "محتوى ترويجي للوجهات الجزائرية والعالمية" },
            { icon: Video, title: "الإعلام البصري", desc: "صور وفيديوهات عالية الجودة" },
            { icon: Camera, title: "السرد القصصي", desc: "حكايات ومعلومات ثقافية وتاريخية" },
            { icon: MessageCircle, title: "التفاعل والمشاركة", desc: "آراء وتقييمات المسافرين" },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-card rounded-2xl p-4 shadow-soft">
                <div className="h-10 w-10 rounded-xl bg-accent text-primary flex items-center justify-center mb-2">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-sm mb-1">{f.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Academic info */}
      <section className="bg-card rounded-2xl p-6 shadow-soft mb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-accent text-primary flex items-center justify-center">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold">المعلومات الأكاديمية</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 text-sm">
          {[
            { label: "الشهادة", value: "ماستر أكاديمي" },
            { label: "التخصص", value: "علوم الإعلام والاتصال" },
            { label: "العنوان", value: "توظيف الوسائط الرقمية في الترويج السياحي" },
            { label: "الطالب(ة)", value: "—" },
            { label: "الأستاذ المشرف", value: "—" },
            { label: "الجامعة", value: "—" },
            { label: "السنة الجامعية", value: "2025 / 2026" },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-3 pb-2 border-b border-border last:border-0">
              <span className="text-muted-foreground">{r.label}</span>
              <span className="font-semibold text-foreground text-end">{r.value}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4 text-center">
          ⓘ يمكنك تعديل اسم الطالب والمشرف والجامعة بسهولة لاحقًا
        </p>
      </section>

      {/* Footer */}
      <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
        <Award className="h-4 w-4" />
        <span className="text-xs">مشروع تخرج — جميع الحقوق محفوظة © 2026</span>
      </div>
    </div>
  );
}
