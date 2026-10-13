import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BadgeCheck, Building2, Globe, Mail, MapPin, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

export const Route = createFileRoute("/_app/agencies/$slug")({
  head: () => ({
    meta: [
      { title: "وكالة سياحية موثّقة — رحلتي" },
      { name: "description", content: "تعرّف على الوكالة السياحية ورحلاتها المنشورة على منصة رحلتي." },
      { property: "og:title", content: "وكالة سياحية موثّقة — رحلتي" },
      { property: "og:description", content: "تعرّف على الوكالة السياحية ورحلاتها المنشورة على منصة رحلتي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AgencyPublic,
});

type Agency = {
  id: string;
  name: string;
  commercial_name: string | null;
  description: string | null;
  wilaya: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  verification_status: string;
};

type Trip = {
  id: string;
  title: string;
  destination: string;
  duration_days: number;
  price: number;
  departure_date: string | null;
};

function AgencyPublic() {
  const { tr } = useLanguage();
  const { slug } = Route.useParams();
  const [agency, setAgency] = useState<Agency | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("agencies")
        .select("id, name, commercial_name, description, wilaya, phone, email, website, verification_status")
        .eq("slug", slug)
        .maybeSingle();
      setAgency((data as Agency) ?? null);
      if (data) {
        const { data: t } = await supabase
          .from("trips")
          .select("id, title, destination, duration_days, price, departure_date")
          .eq("agency_id", data.id)
          .eq("status", "published")
          .order("departure_date", { ascending: true });
        setTrips((t as Trip[]) ?? []);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) return <p className="text-center text-muted-foreground py-16">...</p>;

  if (!agency)
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <Building2 className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <h1 className="text-xl font-black mb-2">{tr("الوكالة غير متاحة", "Agence indisponible", "Agency unavailable")}</h1>
        <p className="text-sm text-muted-foreground mb-5">{tr("قد تكون غير موثّقة أو تم تعديل الرابط.", "Elle n'est peut-être pas vérifiée ou le lien a été modifié.", "It may not be verified or the link has been changed.")}</p>
        <Link to="/home" className="inline-block rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          {tr("العودة للرئيسية", "Retour à l'accueil", "Back to home")}
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 space-y-5 animate-fade-in">
      <header className="rounded-3xl bg-card p-5 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-2xl bg-secondary flex items-center justify-center">
            <Building2 className="h-7 w-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-black flex items-center gap-2">
              {agency.name}
              {agency.verification_status === "verified" && <BadgeCheck className="h-5 w-5 text-primary" />}
            </h1>
            {agency.commercial_name && <p className="text-xs text-muted-foreground">{agency.commercial_name}</p>}
          </div>
        </div>
        {agency.description && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{agency.description}</p>}
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
          {agency.wilaya && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {agency.wilaya}
            </span>
          )}
          {agency.phone && (
            <span className="inline-flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" /> {agency.phone}
            </span>
          )}
          {agency.email && (
            <span className="inline-flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" /> {agency.email}
            </span>
          )}
          {agency.website && (
            <a href={agency.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary">
              <Globe className="h-3.5 w-3.5" /> {tr("الموقع", "Site web", "Website")}
            </a>
          )}
        </div>
        <p className="mt-4 text-[11px] text-muted-foreground">
          {tr(
            "التوثيق داخل منصة رحلتي يعني مراجعة الملف والوثائق المقدَّمة، ولا يمثّل اعتمادًا حكوميًا.",
            "La vérification sur la plateforme Rihlaty signifie que le dossier et les documents fournis ont été examinés, et ne constitue pas un agrément gouvernemental.",
            "Verification on the Rihlaty platform means the profile and submitted documents have been reviewed, and does not represent government approval."
          )}
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-black">{tr("الرحلات المنشورة", "Voyages publiés", "Published trips")}</h2>
        {trips.length === 0 ? (
          <div className="rounded-3xl bg-card p-8 text-center shadow-soft">
            <p className="text-sm text-muted-foreground">{tr("لا توجد رحلات منشورة حاليًا", "Aucun voyage publié pour le moment", "No published trips currently")}</p>
          </div>
        ) : (
          trips.map((t) => (
            <article key={t.id} className="rounded-3xl bg-card p-4 shadow-soft">
              <h3 className="font-bold">{t.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {t.destination} · {t.duration_days} {tr("أيام", "jours", "days")}
                {t.departure_date ? ` · ${tr("انطلاق", "départ", "departure")} ${t.departure_date}` : ""}
              </p>
              <p className="text-sm font-semibold text-primary mt-2">
                {Number(t.price).toLocaleString("ar")} {tr("دج / شخص", "DZD / personne", "DZD / person")}
              </p>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
