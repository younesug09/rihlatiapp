import { useEffect, useState } from "react";
import { FileText, ImagePlus, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/hooks/useLanguage";

const YEAR = 60 * 60 * 24 * 365;
const MAX = 5 * 1024 * 1024;

/** Uploads an image to the private trip-media bucket under the agency folder and returns a long-lived signed URL. */
export async function uploadAgencyImage(agencyId: string, file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("image");
  if (file.size > MAX) throw new Error("size");
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${agencyId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from("trip-media").upload(path, file, { contentType: file.type });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from("trip-media").createSignedUrl(path, YEAR);
  if (signErr || !data) throw signErr ?? new Error("sign");
  return data.signedUrl;
}

export function ImageUploadButton({ agencyId, onUploaded, label }: { agencyId: string; onUploaded: (url: string) => void; label?: string }) {
  const { tr } = useLanguage();
  const [busy, setBusy] = useState(false);
  return (
    <label className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl bg-secondary px-4 py-2 text-sm font-semibold ${busy ? "opacity-60 pointer-events-none" : ""}`}>
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4 text-primary" />}
      {label ?? tr("رفع صورة", "Téléverser une image", "Upload image")}
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          try {
            onUploaded(await uploadAgencyImage(agencyId, file));
            toast.success(tr("تم رفع الصورة", "Image téléversée", "Image uploaded"));
          } catch (err) {
            const m = err instanceof Error ? err.message : "";
            toast.error(m === "size" ? tr("الحد الأقصى 5 ميغابايت", "5 Mo maximum", "Max 5 MB") : tr("تعذّر رفع الصورة", "Échec du téléversement", "Upload failed"));
          } finally {
            setBusy(false);
          }
        }}
      />
    </label>
  );
}

type Doc = { id: string; doc_type: string; file_url: string; created_at: string };

export function AgencyUploads({ agencyId, logoUrl, onLogo }: { agencyId: string; logoUrl: string | null; onLogo: (url: string) => void }) {
  const { tr } = useLanguage();
  const [docs, setDocs] = useState<Doc[]>([]);
  const [docType, setDocType] = useState("commercial_register");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("agency_documents").select("id, doc_type, file_url, created_at").eq("agency_id", agencyId).order("created_at", { ascending: false });
    setDocs((data as Doc[]) ?? []);
  };
  useEffect(() => { void load(); }, [agencyId]);

  const types: Record<string, string> = {
    commercial_register: tr("السجل التجاري", "Registre de commerce", "Commercial register"),
    tourism_license: tr("رخصة وكالة السياحة", "Licence d'agence de tourisme", "Tourism license"),
    id_card: tr("بطاقة هوية المسيّر", "Pièce d'identité du gérant", "Manager ID"),
    other: tr("وثيقة أخرى", "Autre document", "Other document"),
  };

  const uploadDoc = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) return toast.error(tr("الحد الأقصى 10 ميغابايت", "10 Mo maximum", "Max 10 MB"));
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "pdf";
      const path = `${agencyId}/${docType}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("agency-documents").upload(path, file, { contentType: file.type });
      if (error) throw error;
      const { error: insErr } = await supabase.from("agency_documents").insert({ agency_id: agencyId, doc_type: docType, file_url: path });
      if (insErr) throw insErr;
      toast.success(tr("تم رفع الوثيقة وإرسالها للمراجعة", "Document envoyé pour vérification", "Document sent for review"));
      await load();
    } catch {
      toast.error(tr("تعذّر رفع الوثيقة", "Échec de l'envoi", "Upload failed"));
    } finally {
      setBusy(false);
    }
  };

  const open = async (path: string) => {
    const { data } = await supabase.storage.from("agency-documents").createSignedUrl(path, 300);
    if (data) window.open(data.signedUrl, "_blank", "noopener");
  };

  return (
    <section className="rounded-3xl bg-card p-5 shadow-soft space-y-5">
      <div>
        <h2 className="font-black text-lg">{tr("الشعار والوثائق", "Logo et documents", "Logo & documents")}</h2>
        <p className="text-xs text-muted-foreground mt-1">{tr("الوثائق خاصة ولا يراها إلا أنت وإدارة رحلتي.", "Les documents restent privés (vous et l'équipe Rihlaty).", "Documents are private to you and the Rihlaty team.")}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="h-16 w-16 overflow-hidden rounded-2xl bg-secondary">{logoUrl && <img src={logoUrl} alt="" className="h-full w-full object-cover" />}</div>
        <ImageUploadButton agencyId={agencyId} onUploaded={onLogo} label={tr("تغيير الشعار", "Changer le logo", "Change logo")} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select value={docType} onChange={(e) => setDocType(e.target.value)} className="min-h-11 rounded-2xl bg-secondary px-3 text-sm outline-none">
          {Object.entries(types).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-2xl bg-primary px-4 text-sm font-bold text-primary-foreground ${busy ? "opacity-60 pointer-events-none" : ""}`}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          {tr("رفع وثيقة", "Envoyer un document", "Upload document")}
          <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) void uploadDoc(f); }} />
        </label>
      </div>
      {docs.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">{tr("لم ترفع أي وثيقة بعد.", "Aucun document envoyé.", "No documents yet.")}</p>
      ) : (
        <ul className="space-y-2">
          {docs.map((d) => (
            <li key={d.id}>
              <button type="button" onClick={() => open(d.file_url)} className="flex w-full items-center gap-2 rounded-2xl bg-secondary px-3 py-2.5 text-start text-sm">
                <FileText className="h-4 w-4 text-primary" /> <span className="flex-1">{types[d.doc_type] ?? d.doc_type}</span>
                <span className="text-[11px] text-muted-foreground">{d.created_at.slice(0, 10)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
