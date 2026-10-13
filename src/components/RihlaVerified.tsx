import { useState } from "react";
import { BadgeCheck, Eye, HeartHandshake, Lock, LifeBuoy, ReceiptText, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function VerifiedBadge({ className = "" }: { className?: string }) {
  const { tr } = useLanguage();
  const [open, setOpen] = useState(false);

  const criteria = [
    {
      icon: BadgeCheck,
      title: tr("هوية مُتحقّق منها", "Identité vérifiée", "Verified identity"),
      body: tr(
        "اسم صاحب الإقامة أو الوكالة ووثائق النشاط تمت مراجعتها من فريق رحلتي قبل النشر.",
        "Le nom du propriétaire de l'hébergement ou de l'agence et ses documents d'activité ont été vérifiés par l'équipe RIHLA avant publication.",
        "The name of the stay owner or agency and their activity documents were reviewed by the RIHLA team before publishing."
      ),
    },
    {
      icon: Eye,
      title: tr("معلومات مطابقة للواقع", "Informations conformes à la réalité", "Information matches reality"),
      body: tr(
        "الصور والموقع والمرافق تُقارَن بمصادر متعدّدة، وأي وصف غير دقيق يُصحَّح أو يُسحَب.",
        "Les photos, l'emplacement et les équipements sont comparés à plusieurs sources ; toute description inexacte est corrigée ou retirée.",
        "Photos, location, and amenities are cross-checked against multiple sources; any inaccurate description is corrected or removed."
      ),
    },
    {
      icon: ReceiptText,
      title: tr("سعر معروض بوضوح", "Prix affiché clairement", "Clearly displayed price"),
      body: tr(
        "سعر الليلة والرسوم تظهر قبل التأكيد، دون رسوم مفاجئة عند الوصول.",
        "Le prix de la nuitée et les frais apparaissent avant la confirmation, sans frais surprise à l'arrivée.",
        "The nightly price and fees are shown before confirmation, with no surprise charges on arrival."
      ),
    },
    {
      icon: HeartHandshake,
      title: tr("التزام بالاستقبال", "Engagement d'accueil", "Commitment to hosting"),
      body: tr(
        "الإقامة تلتزم باستقبال الحجوزات المؤكّدة عبر رحلتي وبسياسة إلغاء معلنة.",
        "L'hébergement s'engage à honorer les réservations confirmées via RIHLA, avec une politique d'annulation annoncée.",
        "The stay commits to honoring bookings confirmed via RIHLA, with a stated cancellation policy."
      ),
    },
  ];

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={`inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground ${className}`}
      >
        <BadgeCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
        RIHLA VERIFIED
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-foreground/50 p-4"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(false);
          }}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={tr("معايير توثيق رحلتي", "Critères de certification RIHLA", "RIHLA verification criteria")}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="w-full max-w-md rounded-3xl bg-card p-5 shadow-card animate-scale-in text-right"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-lg font-black">
                  <BadgeCheck className="h-5 w-5 text-primary" strokeWidth={1.5} />
                  {tr("ماذا يعني «موثّق من رحلتي»؟", "Que signifie « vérifié par RIHLA » ?", "What does \"RIHLA Verified\" mean?")}
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  {tr(
                    "توثيق داخلي من المنصة، وليس اعتمادًا رسميًا من أي جهة حكومية.",
                    "Une certification interne de la plateforme, et non une accréditation officielle d'un organisme gouvernemental.",
                    "An internal platform certification, not an official accreditation from any government body."
                  )}
                </p>
              </div>
              <button onClick={() => setOpen(false)} aria-label={tr("إغلاق", "Fermer", "Close")} className="shrink-0 text-muted-foreground">
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <ul className="mt-4 space-y-3">
              {criteria.map((c) => (
                <li key={c.title} className="flex gap-3">
                  <c.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} />
                  <div>
                    <p className="text-sm font-bold">{c.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{c.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="mt-4 rounded-2xl bg-secondary p-3 text-xs leading-relaxed text-secondary-foreground">
              {tr(
                "إذا وجدت اختلافًا بين ما هو معروض وما وجدته على أرض الواقع، أبلغنا عبر صفحة المساعدة وستتم مراجعة التوثيق.",
                "Si vous constatez une différence entre ce qui est affiché et ce que vous avez trouvé sur place, signalez-le via la page d'aide ; la certification sera réexaminée.",
                "If you notice a difference between what's shown and what you find on site, report it via the help page and the verification will be reviewed."
              )}
            </p>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 w-full rounded-2xl bg-primary py-3 text-sm font-bold text-primary-foreground"
            >
              {tr("فهمت", "Compris", "Got it")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function TrustGuarantees() {
  const { tr } = useLanguage();
  const guarantees = [
    { icon: Eye, title: tr("دقة المعلومات", "Exactitude des informations", "Information accuracy"), body: tr("كل وصف وصورة يخضع للمراجعة، والمحتوى غير المؤكّد يُوسَم بوضوح.", "Chaque description et photo est vérifiée ; le contenu non confirmé est clairement signalé.", "Every description and photo is reviewed; unconfirmed content is clearly flagged.") },
    { icon: ReceiptText, title: tr("شفافية السعر", "Transparence des prix", "Price transparency"), body: tr("سعر الليلة + الرسوم = الإجمالي. لا رسوم خفية ولا مفاجآت.", "Prix de la nuitée + frais = total. Pas de frais cachés ni de surprises.", "Nightly price + fees = total. No hidden fees, no surprises.") },
    { icon: Lock, title: tr("خصوصية بياناتك", "Confidentialité de vos données", "Your data privacy"), body: tr("بياناتك تُستعمل لإتمام الحجز فقط ولا تُشارك مع أطراف إعلانية.", "Vos données ne servent qu'à finaliser la réservation et ne sont pas partagées à des fins publicitaires.", "Your data is used only to complete the booking and is not shared with advertisers.") },
    { icon: LifeBuoy, title: tr("دعم قبل وبعد الحجز", "Support avant et après la réservation", "Support before and after booking"), body: tr("فريق الدعم متاح لمرافقتك من الاستفسار حتى نهاية الإقامة.", "L'équipe de support vous accompagne de la demande jusqu'à la fin du séjour.", "The support team is available to assist you from inquiry through the end of your stay.") },
  ];
  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <h2 className="text-lg font-black">{tr("ضمانات رحلتي", "Les garanties RIHLA", "RIHLA guarantees")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{tr("أربعة التزامات نطبّقها على كل إقامة معروضة.", "Quatre engagements que nous appliquons à chaque hébergement proposé.", "Four commitments we apply to every listed stay.")}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {guarantees.map((g) => (
          <div key={g.title} className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary">
              <g.icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold">{g.title}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{g.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
