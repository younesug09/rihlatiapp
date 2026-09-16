/**
 * Real, verified photographs of Algerian destinations.
 * Source: Wikimedia Commons (freely licensed). Each entry is an accurate
 * photograph of the place it represents — no generic stock imagery.
 */
const wm = (file: string, width = 1400) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(
    file.replace(/ /g, "_"),
  )}?width=${width}`;

export type RealImage = { src: string; alt: string; credit: string };

export const realImages = {
  alger: {
    src: wm("La casbah d'Alger.jpg"),
    alt: "أزقة القصبة العتيقة في الجزائر العاصمة بعمارتها العثمانية",
    credit: "Wikimedia Commons",
  },
  algerBasilica: {
    src: wm("Algiers Notre Dame d'Afrique.jpg"),
    alt: "كاتدرائية السيدة الإفريقية المطلة على خليج الجزائر العاصمة",
    credit: "Wikimedia Commons",
  },
  bejaia: {
    src: wm("Cap Carbon (Béjaïa).jpg"),
    alt: "رأس كربون ببجاية وجرفه الصخري المطل على البحر الأبيض المتوسط",
    credit: "Wikimedia Commons",
  },
  setif: {
    src: wm("Ain El Fouara Fountain, Sétif, Algérie.jpg"),
    alt: "نافورة عين الفوارة في وسط مدينة سطيف",
    credit: "Wikimedia Commons",
  },
  djemila: {
    src: wm("Roman Ruins of Djemila in Sétif, Algeria.jpg"),
    alt: "آثار جميلة الرومانية بولاية سطيف المصنفة تراثًا عالميًا",
    credit: "Wikimedia Commons",
  },
  jijel: {
    src: wm("Corniche jijelienne.jpg"),
    alt: "الكورنيش الجيجلي بمياهه الفيروزية وصخوره الساحلية",
    credit: "Wikimedia Commons",
  },
  constantine: {
    src: wm("Pont de Sidi M'Cid 01.jpg"),
    alt: "جسر سيدي مسيد المعلق فوق وادي الرمال بقسنطينة",
    credit: "Wikimedia Commons",
  },
  annaba: {
    src: wm("Annaba, Algeria.jpg"),
    alt: "مدينة عنابة الساحلية بشرق الجزائر",
    credit: "Wikimedia Commons",
  },
  skikda: {
    src: wm("Plage la carrière (Skikda).jpg"),
    alt: "شاطئ لاكارّيير بسكيكدة على الساحل الشرقي الجزائري",
    credit: "Wikimedia Commons",
  },
  batna: {
    src: wm("Balcons du Ghoufi – Berber Heritage 12.jpg"),
    alt: "شرفات غوفي بولاية باتنة ومساكنها الأمازيغية المنحوتة في الصخر",
    credit: "Wikimedia Commons",
  },
  timgad: {
    src: wm("Timgad Ruins Panorama.jpg"),
    alt: "أطلال مدينة تيمقاد الرومانية بولاية باتنة",
    credit: "Wikimedia Commons",
  },
  oran: {
    src: wm("Oran Santa Cruz.JPG"),
    alt: "حصن سانتا كروز المطل على خليج وهران",
    credit: "Wikimedia Commons",
  },
  tlemcen: {
    src: wm("Tlemcen-ville-d'art-et-d'histoire.jpg"),
    alt: "مدينة تلمسان بعمارتها الأندلسية المغاربية",
    credit: "Wikimedia Commons",
  },
  mostaganem: {
    src: wm("Sunset in Mostaganem beach.jpg"),
    alt: "غروب الشمس على شاطئ مستغانم غرب الجزائر",
    credit: "Wikimedia Commons",
  },
  tipaza: {
    src: wm("Tipasa Roman Ruins.jpg"),
    alt: "الآثار الرومانية بتيبازة على ساحل البحر الأبيض المتوسط",
    credit: "Wikimedia Commons",
  },
  tiziOuzou: {
    src: wm("Hauteur Tizi ouzou Djurdjura.jpg"),
    alt: "مرتفعات جرجرة بولاية تيزي وزو",
    credit: "Wikimedia Commons",
  },
  ghardaia: {
    src: wm("Vue Ghardaia Melika.jpg"),
    alt: "قصور وادي ميزاب بغرداية وعمارتها الصحراوية المتدرجة",
    credit: "Wikimedia Commons",
  },
  tamanrasset: {
    src: wm("Asskrem Hoggar 2.jpg"),
    alt: "قمم أسكرام بجبال الهقار في تمنراست",
    credit: "Wikimedia Commons",
  },
  tassili: {
    src: wm("Dunes at Tassili n'Ajjer.jpg"),
    alt: "كثبان الطاسيلي ناجر الرملية قرب جانت",
    credit: "Wikimedia Commons",
  },
  biskra: {
    src: wm("View of Biskra 06.jpg"),
    alt: "واحات النخيل بمدينة بسكرة بوابة الصحراء",
    credit: "Wikimedia Commons",
  },
  taghit: {
    src: wm("Vue de Taghit.jpg"),
    alt: "قصر تاغيت وسط الكثبان الرملية بولاية بشار",
    credit: "Wikimedia Commons",
  },
} satisfies Record<string, RealImage>;

export type RealImageKey = keyof typeof realImages;
