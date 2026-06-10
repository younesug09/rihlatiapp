export type Hotel = {
  id: string;
  destinationId: string;
  name: string;
  type: "فندق" | "مرقد" | "غرفة" | "شقة" | "نُزل";
  image: string;
  rating: number;
  reviews: number;
  pricePerNight: number;
  amenities: string[];
  distance: string;
  freeCancellation?: boolean;
};

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=1200&q=70`;

export const hotels: Hotel[] = [
  // Algiers
  { id: "alg-h1", destinationId: "algiers", name: "فندق الأوراسي", type: "فندق", image: img("photo-1566073771259-6a8506099945"), rating: 4.7, reviews: 1820, pricePerNight: 18500, amenities: ["واي فاي مجاني", "مسبح", "إفطار", "موقف سيارات"], distance: "1.2 كم من المركز", freeCancellation: true },
  { id: "alg-h2", destinationId: "algiers", name: "مرقد القصبة", type: "مرقد", image: img("photo-1551882547-ff40c63fe5fa"), rating: 4.3, reviews: 412, pricePerNight: 3500, amenities: ["واي فاي", "إفطار"], distance: "وسط القصبة" },
  { id: "alg-h3", destinationId: "algiers", name: "شقة باب الواد بإطلالة بحرية", type: "شقة", image: img("photo-1502672260266-1c1ef2d93688"), rating: 4.6, reviews: 230, pricePerNight: 7800, amenities: ["مطبخ", "إطلالة بحرية", "غسالة"], distance: "300م من الكورنيش", freeCancellation: true },

  // Tassili
  { id: "tas-h1", destinationId: "tassili", name: "خيمة صحراوية فاخرة", type: "نُزل", image: img("photo-1518684079-3c830dcef090"), rating: 4.9, reviews: 320, pricePerNight: 15000, amenities: ["فطور تقليدي", "جولة بالجمل", "تخييم تحت النجوم"], distance: "تادرارت" },
  { id: "tas-h2", destinationId: "tassili", name: "نزل جانت السياحي", type: "فندق", image: img("photo-1582719508461-905c673771fd"), rating: 4.5, reviews: 180, pricePerNight: 9500, amenities: ["مطعم", "واي فاي", "مرشد سياحي"], distance: "وسط جانت", freeCancellation: true },

  // Timgad
  { id: "tim-h1", destinationId: "timgad", name: "فندق سيريتا", type: "فندق", image: img("photo-1564501049412-61c2a3083791"), rating: 4.4, reviews: 290, pricePerNight: 7200, amenities: ["إفطار", "موقف", "واي فاي"], distance: "5 كم من الموقع الأثري" },
  { id: "tim-h2", destinationId: "timgad", name: "غرفة عائلية بباتنة", type: "غرفة", image: img("photo-1505693416388-ac5ce068fe85"), rating: 4.2, reviews: 95, pricePerNight: 4000, amenities: ["واي فاي", "تكييف"], distance: "باتنة" },

  // Constantine
  { id: "con-h1", destinationId: "constantine", name: "فندق ماريوت قسنطينة", type: "فندق", image: img("photo-1542314831-068cd1dbfeeb"), rating: 4.8, reviews: 2100, pricePerNight: 22000, amenities: ["مسبح", "سبا", "صالة رياضية", "إفطار"], distance: "إطلالة على وادي الرمال", freeCancellation: true },
  { id: "con-h2", destinationId: "constantine", name: "مرقد الجسور", type: "مرقد", image: img("photo-1455587734955-081b22074882"), rating: 4.1, reviews: 140, pricePerNight: 2800, amenities: ["واي فاي"], distance: "وسط المدينة" },

  // Oran
  { id: "ora-h1", destinationId: "oran", name: "فندق الميريديان وهران", type: "فندق", image: img("photo-1571896349842-33c89424de2d"), rating: 4.7, reviews: 1600, pricePerNight: 19000, amenities: ["شاطئ خاص", "مسبح", "مطعم"], distance: "الواجهة البحرية", freeCancellation: true },
  { id: "ora-h2", destinationId: "oran", name: "شقة عين الترك", type: "شقة", image: img("photo-1522708323590-d24dbb6b0267"), rating: 4.5, reviews: 320, pricePerNight: 8500, amenities: ["مطبخ", "قرب الشاطئ", "موقف"], distance: "عين الترك" },

  // Bejaia
  { id: "bej-h1", destinationId: "bejaia", name: "فندق كاب كربون", type: "فندق", image: img("photo-1564501049412-61c2a3083791"), rating: 4.7, reviews: 540, pricePerNight: 14500, amenities: ["مسبح", "إفطار", "إطلالة بحرية"], distance: "بجوار كاب كربون", freeCancellation: true },
  { id: "bej-h2", destinationId: "bejaia", name: "مرقد تيشي", type: "مرقد", image: img("photo-1551882547-ff40c63fe5fa"), rating: 4.2, reviews: 180, pricePerNight: 3200, amenities: ["واي فاي", "إفطار"], distance: "شاطئ تيشي" },
  { id: "bej-h3", destinationId: "bejaia", name: "شقة كورنيش بجاية", type: "شقة", image: img("photo-1502672260266-1c1ef2d93688"), rating: 4.6, reviews: 210, pricePerNight: 6800, amenities: ["مطبخ", "إطلالة"], distance: "الكورنيش" },

  // Setif
  { id: "set-h1", destinationId: "setif", name: "فندق المتحف", type: "فندق", image: img("photo-1542314831-068cd1dbfeeb"), rating: 4.5, reviews: 410, pricePerNight: 11000, amenities: ["إفطار", "صالة رياضية", "واي فاي"], distance: "وسط المدينة", freeCancellation: true },
  { id: "set-h2", destinationId: "setif", name: "غرف عين الفوارة", type: "غرفة", image: img("photo-1505693416388-ac5ce068fe85"), rating: 4.3, reviews: 160, pricePerNight: 4500, amenities: ["واي فاي", "تكييف"], distance: "بجوار عين الفوارة" },
  { id: "set-h3", destinationId: "setif", name: "نزل جميلة الأثري", type: "نُزل", image: img("photo-1455587734955-081b22074882"), rating: 4.4, reviews: 95, pricePerNight: 5200, amenities: ["إفطار", "جولة سياحية"], distance: "قرب آثار جميلة" },

  // Jijel
  { id: "jij-h1", destinationId: "jijel", name: "فندق المغارات", type: "فندق", image: img("photo-1571896349842-33c89424de2d"), rating: 4.8, reviews: 690, pricePerNight: 13500, amenities: ["شاطئ خاص", "مسبح", "إفطار"], distance: "قرب المغارات", freeCancellation: true },
  { id: "jij-h2", destinationId: "jijel", name: "شقة كورنيش جيجل", type: "شقة", image: img("photo-1560448204-e02f11c3d0e2"), rating: 4.6, reviews: 280, pricePerNight: 7200, amenities: ["مطبخ", "إطلالة بحرية"], distance: "الكورنيش" },
  { id: "jij-h3", destinationId: "jijel", name: "مرقد رأس عفية", type: "مرقد", image: img("photo-1551882547-ff40c63fe5fa"), rating: 4.1, reviews: 110, pricePerNight: 2800, amenities: ["واي فاي"], distance: "رأس عفية" },

  // Skikda
  { id: "ski-h1", destinationId: "skikda", name: "فندق ستورا", type: "فندق", image: img("photo-1566073771259-6a8506099945"), rating: 4.5, reviews: 380, pricePerNight: 10500, amenities: ["إطلالة بحرية", "إفطار", "موقف"], distance: "ستورا", freeCancellation: true },
  { id: "ski-h2", destinationId: "skikda", name: "غرفة كورنيش سكيكدة", type: "غرفة", image: img("photo-1505693416388-ac5ce068fe85"), rating: 4.2, reviews: 140, pricePerNight: 3800, amenities: ["واي فاي", "تكييف"], distance: "الكورنيش" },

  // Annaba
  { id: "ann-h1", destinationId: "annaba", name: "فندق سيبوس", type: "فندق", image: img("photo-1551918120-9739cb430c6d"), rating: 4.7, reviews: 820, pricePerNight: 15500, amenities: ["مسبح", "سبا", "إفطار"], distance: "وسط المدينة", freeCancellation: true },
  { id: "ann-h2", destinationId: "annaba", name: "شقة ريزي عمر", type: "شقة", image: img("photo-1502672260266-1c1ef2d93688"), rating: 4.5, reviews: 240, pricePerNight: 7800, amenities: ["مطبخ", "قرب الشاطئ"], distance: "شاطئ ريزي عمر" },
  { id: "ann-h3", destinationId: "annaba", name: "نزل هيبون التراثي", type: "نُزل", image: img("photo-1455587734955-081b22074882"), rating: 4.3, reviews: 130, pricePerNight: 4900, amenities: ["إفطار", "واي فاي"], distance: "قرب هيبون" },

  // Santorini
  { id: "san-h1", destinationId: "santorini", name: "Caldera Suites Oia", type: "فندق", image: img("photo-1570213489059-0aac6626cade"), rating: 4.9, reviews: 3200, pricePerNight: 145000, amenities: ["جاكوزي خاص", "إفطار", "إطلالة غروب"], distance: "أويا", freeCancellation: true },
  { id: "san-h2", destinationId: "santorini", name: "Cliffside Cave Room", type: "غرفة", image: img("photo-1611892440504-42a792e24d32"), rating: 4.7, reviews: 980, pricePerNight: 88000, amenities: ["إطلالة بحرية", "إفطار"], distance: "فيرا" },

  // Istanbul
  { id: "ist-h1", destinationId: "istanbul", name: "Sultanahmet Palace Hotel", type: "فندق", image: img("photo-1551918120-9739cb430c6d"), rating: 4.6, reviews: 4500, pricePerNight: 28000, amenities: ["إفطار تركي", "حمام تركي", "واي فاي"], distance: "بجوار آيا صوفيا", freeCancellation: true },
  { id: "ist-h2", destinationId: "istanbul", name: "شقة تقسيم بإطلالة البوسفور", type: "شقة", image: img("photo-1560448204-e02f11c3d0e2"), rating: 4.5, reviews: 1200, pricePerNight: 14000, amenities: ["مطبخ", "إطلالة"], distance: "تقسيم" },

  // Dubai
  { id: "dub-h1", destinationId: "dubai", name: "برج العرب جميرا", type: "فندق", image: img("photo-1582719478250-c89cae4dc85b"), rating: 4.9, reviews: 8800, pricePerNight: 320000, amenities: ["شاطئ خاص", "بتلر", "سبا فاخر", "مطاعم نجوم"], distance: "جميرا", freeCancellation: true },
  { id: "dub-h2", destinationId: "dubai", name: "Downtown Studio بإطلالة برج خليفة", type: "شقة", image: img("photo-1545324418-cc1a3fa10c00"), rating: 4.7, reviews: 2400, pricePerNight: 42000, amenities: ["مسبح", "صالة رياضية", "إطلالة"], distance: "وسط المدينة" },
];

export const hotelsByDestination = (destinationId: string) =>
  hotels.filter((h) => h.destinationId === destinationId);
