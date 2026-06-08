import { createFileRoute } from "@tanstack/react-router";
import { Play, Camera, Headphones, MapPin } from "lucide-react";
import { destinations } from "@/data/destinations";

export const Route = createFileRoute("/_app/media")({
  head: () => ({
    meta: [
      { title: "الإعلام البصري — رحلتي" },
      { name: "description", content: "فيديوهات ومعرض صور للوجهات السياحية في الجزائر والعالم." },
    ],
  }),
  component: Media,
});

const videos = [
  { id: "K1QICrgxTjA", title: "الجزائر — جوهرة شمال إفريقيا", region: "الجزائر" },
  { id: "GsDqsXkXmuU", title: "الطاسيلي ناجر — سحر الصحراء", region: "تمنراست" },
  { id: "rcfAlNxBOl0", title: "قسنطينة — مدينة الجسور المعلقة", region: "قسنطينة" },
  { id: "VrHQAfWakgY", title: "إسطنبول — ملتقى الشرق والغرب", region: "تركيا" },
];

const podcasts = [
  { title: "حلقة 1: مستقبل السياحة في الجزائر", duration: "32 دقيقة", host: "أحمد بن علي" },
  { title: "حلقة 2: التسويق الرقمي للوجهات السياحية", duration: "28 دقيقة", host: "سارة محمد" },
  { title: "حلقة 3: السياحة الصحراوية وتجارب لا تُنسى", duration: "45 دقيقة", host: "كريم بوزيد" },
];

function Media() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 animate-fade-in space-y-8">
      <header>
        <h1 className="text-2xl font-bold mb-1">الإعلام البصري والرقمي</h1>
        <p className="text-sm text-muted-foreground">فيديوهات، صور، وبودكاست لاكتشاف الوجهات</p>
      </header>

      {/* Videos */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-9 w-9 rounded-xl bg-accent text-primary flex items-center justify-center">
            <Play className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold">فيديوهات سياحية</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.map((v) => (
            <div key={v.id} className="bg-card rounded-2xl overflow-hidden shadow-soft">
              <div className="aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${v.id}`}
                  title={v.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm">{v.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" /> {v.region}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Photo gallery */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-9 w-9 rounded-xl bg-accent text-primary flex items-center justify-center">
            <Camera className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold">معرض الصور</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {destinations.map((d) => (
            <div key={d.id} className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer">
              <img src={d.image} alt={d.name} loading="lazy" width={400} height={400} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <p className="text-white text-xs font-bold">{d.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Podcasts */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-9 w-9 rounded-xl bg-accent text-primary flex items-center justify-center">
            <Headphones className="h-4 w-4" />
          </div>
          <h2 className="text-lg font-bold">بودكاست سياحي</h2>
        </div>
        <div className="space-y-3">
          {podcasts.map((p, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 shadow-soft flex items-center gap-3">
              <button className="h-12 w-12 rounded-full text-primary-foreground flex items-center justify-center shrink-0 shadow-glow" style={{ background: "var(--gradient-primary)" }}>
                <Play className="h-5 w-5 mr-0.5" fill="currentColor" />
              </button>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{p.title}</h3>
                <p className="text-xs text-muted-foreground">{p.host} · {p.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
