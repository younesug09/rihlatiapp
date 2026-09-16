import { Ambulance, Flame, Phone, Shield, ShieldAlert } from "lucide-react";

const contacts = [
  { label: "الشرطة", sub: "Police", number: "1548", icon: Shield },
  { label: "الحماية المدنية", sub: "Protection Civile", number: "14", icon: Flame },
  { label: "الدرك الوطني", sub: "Gendarmerie", number: "1055", icon: ShieldAlert },
  { label: "الاستعجالات الطبية", sub: "SAMU", number: "115", icon: Ambulance },
];

/** Algerian emergency numbers with one-tap dialling. */
export function EmergencyContacts({ compact = false }: { compact?: boolean }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <h2 className="mb-1 flex items-center gap-2 text-lg font-bold">
        <Phone className="h-5 w-5 text-destructive" strokeWidth={1.5} /> أرقام الطوارئ في الجزائر
      </h2>
      {!compact && (
        <p className="mb-4 text-xs text-muted-foreground">
          اضغط على الرقم للاتصال مباشرة. هذه أرقام وطنية مجانية تعمل من أي هاتف.
        </p>
      )}
      <ul className="grid gap-2 sm:grid-cols-2">
        {contacts.map((c) => (
          <li key={c.number}>
            <a
              href={`tel:${c.number}`}
              className="flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 transition-colors hover:bg-secondary"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
                <c.icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{c.label}</span>
                <span className="block text-[11px] text-muted-foreground">{c.sub}</span>
              </span>
              <span dir="ltr" className="font-mono text-lg font-black text-destructive">{c.number}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
