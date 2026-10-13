import { createFileRoute, Link } from "@tanstack/react-router";
import { Compass, Eye, Sparkles, ScrollText, BadgeCheck, Heart } from "lucide-react";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/_app/about")({
  head: () => ({
    meta: [
      { title: "من نحن — رحلتي RIHLA" },
      { name: "description", content: "رسالة رحلتي ورؤيتها وميثاقها التحريري ومنهجية التحقق من المعلومات السياحية الجزائرية." },
      { property: "og:title", content: "من نحن — رحلتي RIHLA" },
      { property: "og:description", content: "منصة اتصال سياحي رقمية جزائرية: الرسالة، الرؤية، الميثاق التحريري ومنهجية التحقق." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  const { tr } = useLanguage();

  const blocks = [
    {
      icon: Compass,
      title: tr("رسالتنا", "Notre mission", "Our mission"),
      body: tr(
        "أن نجعل الوجهة الجزائرية مرئية ومفهومة ومغرية، عبر محتوى دقيق وتجربة رقمية بمعايير عالمية.",
        "Rendre la destination algérienne visible, compréhensible et attrayante, grâce à un contenu rigoureux et une expérience numérique aux standards internationaux.",
        "Making the Algerian destination visible, understandable and appealing, through accurate content and a world-class digital experience."
      ),
    },
    {
      icon: Eye,
      title: tr("رؤيتنا", "Notre vision", "Our vision"),
      body: tr(
        "منصة مرجعية تجمع الاكتشاف والإعلام والمجتمع وتخطيط الرحلات في مكان واحد، يثق بها المسافر قبل أن يحجز.",
        "Une plateforme de référence qui réunit découverte, information, communauté et planification de voyage en un seul endroit, à laquelle le voyageur fait confiance avant de réserver.",
        "A reference platform bringing discovery, media, community and trip planning together in one place, trusted by travelers before they book."
      ),
    },
    {
      icon: Sparkles,
      title: tr("لماذا رحلتي؟", "Pourquoi Rihlaty ?", "Why Rihlaty?"),
      body: tr(
        "لأن السياحة الجزائرية تعاني من نقص المحتوى المنظّم لا من نقص الجمال. نحن نبني طبقة الاتصال الغائبة.",
        "Parce que le tourisme algérien manque de contenu organisé, pas de beauté. Nous construisons la couche de communication manquante.",
        "Because Algerian tourism lacks organized content, not beauty. We are building the missing communication layer."
      ),
    },
    {
      icon: BadgeCheck,
      title: tr("منهجية التحقق", "Méthodologie de vérification", "Verification methodology"),
      body: tr(
        "جمع المعلومة من مصدرها، مراجعة تحريرية، وسم واضح لما هو تجريبي أو قيد التحقق، ثم تحديث دوري.",
        "Collecte de l'information à la source, révision éditoriale, étiquetage clair de ce qui est expérimental ou en cours de vérification, puis mise à jour régulière.",
        "Gathering information at the source, editorial review, clear labeling of what is experimental or under verification, then regular updates."
      ),
    },
  ];

  const charter = [
    tr("الدقة قبل السرعة", "L'exactitude avant la rapidité", "Accuracy before speed"),
    tr("الموضوعية وعدم الترويج المضلل", "Objectivité et absence de promotion trompeuse", "Objectivity and no misleading promotion"),
    tr("احترام خصوصية الأشخاص والأماكن", "Respect de la vie privée des personnes et des lieux", "Respecting the privacy of people and places"),
    tr("ذكر المصادر عند النشر", "Citation des sources lors de la publication", "Citing sources when publishing"),
    tr("تصحيح الخطأ علنًا", "Correction publique des erreurs", "Correcting mistakes publicly"),
    tr("تحديث المعلومات باستمرار", "Mise à jour continue des informations", "Continuously updating information"),
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-3">
        <img src={logo} alt="Rihlaty" className="h-14 w-14 object-contain" />
        <div>
          <h1 className="text-2xl font-bold">رحلتي · RIHLA</h1>
          <p className="text-sm text-muted-foreground">{tr("اكتشف. عِش. شارك.", "Découvrez. Vivez. Partagez.", "Discover. Live. Share.")}</p>
        </div>
      </div>

      <p className="mt-5 text-base leading-relaxed text-muted-foreground">
        {tr(
          "رحلتي منصة اتصال سياحي رقمية جزائرية تجمع بين الاكتشاف، الإعلام، المجتمع، وتخطيط الرحلات — وليست مجرد موقع حجز.",
          "Rihlaty est une plateforme de communication touristique numérique algérienne qui réunit découverte, information, communauté et planification de voyage — et non un simple site de réservation.",
          "Rihlaty is an Algerian digital tourism communication platform combining discovery, media, community and trip planning — not just a booking site."
        )}
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {blocks.map((b) => {
          const Icon = b.icon;
          return (
            <article key={b.title} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <h2 className="font-bold flex items-center gap-2">
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {b.title}
              </h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{b.body}</p>
            </article>
          );
        })}
      </div>

      <section className="mt-6 rounded-2xl border border-border bg-card p-4">
        <h2 className="font-bold flex items-center gap-2">
          <ScrollText className="h-4 w-4 text-primary" aria-hidden="true" /> {tr("ميثاقنا التحريري", "Notre charte éditoriale", "Our editorial charter")}
        </h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
          {charter.map((c) => (
            <li key={c} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              {c}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-4">
        <h2 className="font-bold flex items-center gap-2">
          <Heart className="h-4 w-4 text-primary" aria-hidden="true" /> {tr("قيمنا", "Nos valeurs", "Our values")}
        </h2>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
          {tr(
            "الصدق مع المستخدم، احترام الهوية الجزائرية بلا مبالغة، البساطة في التصميم، وإتاحة المنصة للجميع.",
            "Honnêteté envers l'utilisateur, respect de l'identité algérienne sans exagération, simplicité du design et accessibilité pour tous.",
            "Honesty with the user, respecting Algerian identity without exaggeration, simplicity in design, and accessibility for everyone."
          )}
        </p>
      </section>

      <Link
        to="/trust"
        className="mt-6 inline-block rounded-2xl px-5 py-3 text-sm font-bold text-primary-foreground shadow-card"
        style={{ background: "var(--gradient-primary)" }}
      >
        {tr("زيارة مركز الثقة", "Visiter le centre de confiance", "Visit the trust center")}
      </Link>
    </div>
  );
}
