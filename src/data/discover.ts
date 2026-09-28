import { Mountain, Waves, Sun, Landmark, Leaf, TentTree, Building2, type LucideIcon } from "lucide-react";
import { getWilaya, wilayas, type Wilaya } from "@/data/wilayas";
import { realImages, type RealImage } from "@/data/images";

export type TourismType = "beaches" | "mountains" | "sahara" | "heritage" | "nature" | "adventure" | "cities";

export const tourismFilters: { id: TourismType | "all"; label: string; icon?: LucideIcon }[] = [
  { id: "all", label: "الكل" },
  { id: "beaches", label: "الشواطئ", icon: Waves },
  { id: "mountains", label: "الجبال", icon: Mountain },
  { id: "sahara", label: "الصحراء", icon: Sun },
  { id: "heritage", label: "التراث", icon: Landmark },
  { id: "nature", label: "الطبيعة", icon: Leaf },
  { id: "adventure", label: "المغامرة", icon: TentTree },
  { id: "cities", label: "المدن", icon: Building2 },
];

const beachIds = new Set(["alger", "bejaia", "jijel", "annaba", "skikda", "oran", "mostaganem", "tipaza"]);
const mountainIds = new Set(["bejaia", "setif", "batna", "tlemcen", "tizi-ouzou", "tamanrasset"]);
const saharaIds = new Set(["ghardaia", "tamanrasset", "djanet", "biskra"]);
const heritageIds = new Set(["alger", "setif", "constantine", "annaba", "batna", "oran", "tlemcen", "tipaza", "ghardaia", "djanet"]);
const cityIds = new Set(["alger", "setif", "constantine", "annaba", "oran", "tlemcen", "biskra"]);

const bestTimes: Record<string, string> = {
  alger: "من أبريل إلى يونيو، ومن سبتمبر إلى أكتوبر",
  bejaia: "من مايو إلى سبتمبر",
  setif: "من أبريل إلى يونيو، ومن سبتمبر إلى أكتوبر",
  jijel: "من يونيو إلى سبتمبر",
  constantine: "من مارس إلى يونيو، ومن سبتمبر إلى نوفمبر",
  annaba: "من مايو إلى أكتوبر",
  skikda: "من مايو إلى سبتمبر",
  batna: "من أبريل إلى يونيو، ومن سبتمبر إلى أكتوبر",
  oran: "من أبريل إلى أكتوبر",
  tlemcen: "من مارس إلى يونيو، ومن سبتمبر إلى نوفمبر",
  mostaganem: "من يونيو إلى سبتمبر",
  tipaza: "من أبريل إلى أكتوبر",
  "tizi-ouzou": "من أبريل إلى يونيو، ومن سبتمبر إلى نوفمبر",
  ghardaia: "من أكتوبر إلى أبريل",
  tamanrasset: "من أكتوبر إلى مارس",
  djanet: "من أكتوبر إلى مارس",
  biskra: "من أكتوبر إلى أبريل",
};

const durations: Record<string, string> = {
  alger: "3–4 أيام", bejaia: "3 أيام", setif: "يومان", jijel: "3–4 أيام",
  constantine: "2–3 أيام", annaba: "3 أيام", skikda: "2–3 أيام", batna: "3 أيام",
  oran: "3–4 أيام", tlemcen: "3 أيام", mostaganem: "2–3 أيام", tipaza: "يومان",
  "tizi-ouzou": "3 أيام", ghardaia: "3–4 أيام", tamanrasset: "5–7 أيام", djanet: "5–7 أيام", biskra: "3 أيام",
};

const extraGallery: Partial<Record<string, RealImage[]>> = {
  alger: [realImages.algerBasilica],
  setif: [realImages.djemila],
  batna: [realImages.timgad],
};

export function getTourismTypes(wilaya: Wilaya): TourismType[] {
  const result = new Set<TourismType>();
  if (beachIds.has(wilaya.id)) result.add("beaches");
  if (mountainIds.has(wilaya.id)) result.add("mountains");
  if (saharaIds.has(wilaya.id)) result.add("sahara");
  if (heritageIds.has(wilaya.id)) result.add("heritage");
  if (cityIds.has(wilaya.id)) result.add("cities");
  if (wilaya.tripTypes.includes("nature")) result.add("nature");
  if (wilaya.tripTypes.includes("adventure")) result.add("adventure");
  if (result.size === 0) result.add("cities");
  return [...result];
}

export function getDiscoverDestination(id: string) {
  const wilaya = getWilaya(id);
  if (!wilaya) return undefined;
  return {
    ...wilaya,
    tourismTypes: getTourismTypes(wilaya),
    bestTime: bestTimes[wilaya.id] ?? "على مدار العام حسب نوع النشاط",
    recommendedDuration: durations[wilaya.id] ?? "2–3 أيام",
    exactLocation: `${wilaya.name}، ${wilaya.region === "south" ? "الجنوب الجزائري" : wilaya.region === "east" ? "شرق الجزائر" : wilaya.region === "west" ? "غرب الجزائر" : "وسط الجزائر"} · ${wilaya.lat.toFixed(2)}°N، ${wilaya.lng.toFixed(2)}°E`,
    gallery: [{ src: wilaya.image, alt: wilaya.imageAlt, credit: "Wikimedia Commons" }, ...(extraGallery[wilaya.id] ?? [])],
  };
}

export function tourismLabel(id: TourismType) {
  return tourismFilters.find((item) => item.id === id)?.label ?? id;
}