import { Link } from "@tanstack/react-router";
import { Plane, Compass, Mountain, ShieldCheck } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function FeatureCards() {
  const { tr } = useLanguage();
  const items = [
    { icon: Plane, to: "/discover", label: tr("السفر", "Voyage", "Travel") },
    { icon: Compass, to: "/discover", label: tr("استكشف", "Explorer", "Explore") },
    { icon: Mountain, to: "/discover", label: tr("مغامرة", "Aventure", "Adventure") },
    { icon: ShieldCheck, to: "/trust", label: tr("الأمان", "Sécurité", "Safety") },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map(({ icon: Icon, to, label }) => (
          <Link key={label} to={to} className="group rounded-3xl border border-border bg-card p-5 shadow-soft hover:shadow-card transition-all flex flex-col items-center gap-3">
            <span className="h-14 w-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <Icon className="h-7 w-7" strokeWidth={2} />
            </span>
            <span className="font-bold text-foreground">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
