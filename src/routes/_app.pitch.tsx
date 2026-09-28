import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BadgeCheck, Building2, CheckCircle2, Database, Globe2, LockKeyhole, QrCode, ShieldCheck, Smartphone, Sparkles, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/_app/pitch")({
  head: () => ({ meta: [
    { title: "RIHLA 2.0 — عرض مشروع ماستر 2" },
    { name: "description", content: "عرض مشروع RIHLA 2.0: منصة جزائرية موحّدة لاكتشاف الرحلات والحجز الموثّق." },
    { property: "og:title", content: "RIHLA 2.0 — Master 2 Pitch" },
    { property: "og:description", content: "منصة TravelTech جزائرية تربط المسافر بالوكالة والإدارة ضمن حجز موثّق." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: PitchPage,
});

const copy = {
  ar: {
    overline: "مشروع تخرج ماستر 2 · إعلام واتصال", title: "رحلتي 2.0", subtitle: "من التشتّت السياحي إلى منظومة جزائرية موحّدة وموثوقة.", cta: "استكشف المنصة",
    problem: "المشكلة", problemTitle: "رحلة جميلة… تبدأ غالبًا بتجربة رقمية مشتّتة", problemBody: "المعلومات موزّعة، الثقة في العروض محدودة، والحجز والتواصل والتحقق تتم في قنوات منفصلة.",
    solution: "الحل", solutionTitle: "منصة واحدة من الاكتشاف إلى إثبات الحجز", solutionBody: "RIHLA تجمع الوجهات الجزائرية، الوكالات الموثّقة، الرحلات، الطلبات، الرسائل، والإشعارات في تجربة واحدة.",
    ecosystem: "منظومة بثلاثة أدوار", traveler: "المسافر", agency: "الوكالة", admin: "الإدارة", travelerText: "يكتشف، يحفظ، يطلب الحجز ويتابع القسيمة.", agencyText: "تنشر الرحلات وتدير العملاء والطلبات.", adminText: "توثّق الوكالات وتحمي جودة المنصة.",
    flow: "دورة الحجز الموثّق", future: "الرؤية المستقبلية", futureTitle: "بنية رقمية للسياحة الجزائرية", futureBody: "توصيات أذكى، دفع محلي، شراكات مع الفاعلين، وبيانات أفضل لصناعة القرار السياحي.", stack: "البنية التقنية",
  },
  fr: {
    overline: "Projet de fin d’études Master 2 · Communication", title: "RIHLA 2.0", subtitle: "De la fragmentation touristique à un écosystème algérien unifié et fiable.", cta: "Explorer la plateforme",
    problem: "Le problème", problemTitle: "Un beau voyage commence souvent par une expérience numérique fragmentée", problemBody: "L’information est dispersée, la confiance limitée, et réservation, communication et vérification utilisent des canaux séparés.",
    solution: "La solution", solutionTitle: "Une plateforme, de la découverte à la preuve de réservation", solutionBody: "RIHLA réunit destinations algériennes, agences vérifiées, voyages, demandes, messages et notifications.",
    ecosystem: "Un écosystème à trois rôles", traveler: "Voyageur", agency: "Agence", admin: "Administration", travelerText: "Découvre, sauvegarde, réserve et reçoit son voucher.", agencyText: "Publie les voyages et gère clients et demandes.", adminText: "Vérifie les agences et protège la qualité.",
    flow: "Parcours de réservation vérifiée", future: "Vision future", futureTitle: "Une infrastructure numérique pour le tourisme algérien", futureBody: "Recommandations intelligentes, paiement local, partenariats et meilleures données pour la décision touristique.", stack: "Socle technique",
  },
  en: {
    overline: "Master 2 Graduation Project · Mass Communication", title: "RIHLA 2.0", subtitle: "From tourism fragmentation to one trusted Algerian travel ecosystem.", cta: "Explore the platform",
    problem: "The problem", problemTitle: "A great trip often starts with a fragmented digital experience", problemBody: "Information is scattered, offer trust is limited, and booking, communication and verification happen across separate channels.",
    solution: "The solution", solutionTitle: "One platform from discovery to verified booking proof", solutionBody: "RIHLA connects Algerian destinations, verified agencies, trips, requests, messages and notifications in one experience.",
    ecosystem: "A three-role ecosystem", traveler: "Traveler", agency: "Agency", admin: "Administration", travelerText: "Discovers, saves, requests bookings and receives a voucher.", agencyText: "Publishes trips and manages customers and requests.", adminText: "Verifies agencies and safeguards platform quality.",
    flow: "Verified booking flow", future: "Future vision", futureTitle: "Digital infrastructure for Algerian tourism", futureBody: "Smarter recommendations, local payments, industry partnerships and better tourism decision data.", stack: "Technology foundation",
  },
};

function PitchPage() {
  const { lang } = useLanguage();
  const text = copy[lang === "fr" ? "fr" : lang === "en" ? "en" : "ar"];
  const roles = [{ icon: UserRound, title: text.traveler, body: text.travelerText }, { icon: Building2, title: text.agency, body: text.agencyText }, { icon: ShieldCheck, title: text.admin, body: text.adminText }];
  const steps = ["Discover", "Request", "Agency decision", "Notification", "QR voucher", "Public verification"];
  return <main className="overflow-hidden bg-background">
    <section className="relative bg-primary py-20 text-primary-foreground sm:py-28"><div className="absolute inset-x-0 top-0 h-1 bg-accent" /><div className="mx-auto max-w-6xl px-4"><p className="text-sm font-bold text-accent">{text.overline}</p><div className="mt-6 grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-end"><div><h1 className="text-6xl font-black sm:text-8xl">{text.title}</h1><p className="mt-5 max-w-3xl text-xl leading-9 opacity-85 sm:text-3xl sm:leading-[1.5]">{text.subtitle}</p></div><div className="border-s border-primary-foreground/25 ps-6"><p className="text-5xl font-black text-accent">01</p><p className="mt-2 text-sm opacity-75">ALGERIA · TRAVELTECH · TRUST</p><Button asChild variant="secondary" size="lg" className="mt-6 w-full"><Link to="/discover">{text.cta}<ArrowLeft className="h-4 w-4" /></Link></Button></div></div></div></section>

    <section className="mx-auto grid max-w-6xl gap-14 px-4 py-20 lg:grid-cols-2"><div><p className="text-sm font-black text-destructive">01 · {text.problem}</p><h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{text.problemTitle}</h2><p className="mt-5 text-lg leading-8 text-muted-foreground">{text.problemBody}</p></div><div className="border-s-4 border-primary ps-6"><p className="text-sm font-black text-primary">02 · {text.solution}</p><h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">{text.solutionTitle}</h2><p className="mt-5 text-lg leading-8 text-muted-foreground">{text.solutionBody}</p></div></section>

    <section className="border-y border-border bg-card py-20"><div className="mx-auto max-w-6xl px-4"><p className="text-sm font-black text-accent">03 · ECOSYSTEM</p><h2 className="mt-2 text-4xl font-black">{text.ecosystem}</h2><div className="mt-10 grid gap-4 md:grid-cols-3">{roles.map((role, index) => <article key={role.title} className="rounded-lg border border-border p-6"><div className="flex items-center justify-between"><role.icon className="h-8 w-8 text-primary" /><span className="font-mono text-sm text-muted-foreground">0{index + 1}</span></div><h3 className="mt-8 text-2xl font-black">{role.title}</h3><p className="mt-3 leading-7 text-muted-foreground">{role.body}</p></article>)}</div></div></section>

    <section className="mx-auto max-w-6xl px-4 py-20"><div className="flex items-center gap-3"><QrCode className="h-8 w-8 text-primary" /><div><p className="text-sm font-black text-accent">04 · TRUST FLOW</p><h2 className="text-4xl font-black">{text.flow}</h2></div></div><div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">{steps.map((step, index) => <div key={step} className="bg-card p-5"><span className="font-mono text-xs text-primary">0{index + 1}</span><CheckCircle2 className="mt-8 h-5 w-5 text-success" /><p className="mt-3 text-sm font-bold">{step}</p></div>)}</div></section>

    <section className="bg-foreground py-20 text-background"><div className="mx-auto max-w-6xl px-4"><p className="text-sm font-black text-accent">05 · TECHNOLOGY</p><h2 className="mt-2 text-4xl font-black">{text.stack}</h2><div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{[{ icon: Sparkles, name: "Lovable", text: "Product creation" }, { icon: Smartphone, name: "React", text: "Responsive interface" }, { icon: Database, name: "Cloud Database", text: "Live structured data" }, { icon: LockKeyhole, name: "RLS Security", text: "Role-level protection" }].map((item) => <div key={item.name} className="border-t border-background/25 pt-5"><item.icon className="h-6 w-6 text-accent" /><h3 className="mt-4 text-xl font-black">{item.name}</h3><p className="mt-1 text-sm opacity-65">{item.text}</p></div>)}</div></div></section>

    <section className="mx-auto max-w-6xl px-4 py-24"><Globe2 className="h-10 w-10 text-primary" /><p className="mt-6 text-sm font-black text-accent">06 · {text.future}</p><h2 className="mt-2 max-w-3xl text-4xl font-black sm:text-6xl">{text.futureTitle}</h2><p className="mt-6 max-w-3xl text-xl leading-9 text-muted-foreground">{text.futureBody}</p><div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border pt-6 text-sm font-bold"><BadgeCheck className="h-5 w-5 text-success" /> RIHLA 2.0 · MADE FOR ALGERIA</div></section>
  </main>;
}