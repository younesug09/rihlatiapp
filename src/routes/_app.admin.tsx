import { createFileRoute } from "@tanstack/react-router";
import { Users, MapPin, Calendar, TrendingUp, DollarSign, Eye } from "lucide-react";
import { destinations } from "@/data/destinations";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "لوحة التحكم — رحلتي" }] }),
  component: Admin,
});

const stats = [
  { icon: Users, label: "المستخدمون", value: "2,841", trend: "+12%", color: "text-primary" },
  { icon: Calendar, label: "الحجوزات", value: "1,294", trend: "+8%", color: "text-success" },
  { icon: DollarSign, label: "الإيرادات", value: "كذا د.ج", trend: "+24%", color: "text-warning" },
  { icon: Eye, label: "زيارات اليوم", value: "8,930", trend: "+3%", color: "text-accent-foreground" },
];

function Admin() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-muted-foreground">نظرة شاملة على المنصة</p>
        </div>
        <span className="px-3 py-1.5 rounded-full bg-success/15 text-success text-xs font-semibold">● مباشر</span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card rounded-2xl p-4 shadow-soft">
              <div className="flex items-center justify-between mb-2">
                <div className={`h-10 w-10 rounded-xl bg-accent flex items-center justify-center ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs text-success font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> {s.trend}
                </span>
              </div>
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart placeholder */}
      <div className="bg-card rounded-2xl p-5 shadow-soft mb-6">
        <h3 className="font-bold mb-4">الحجوزات الأسبوعية</h3>
        <div className="flex items-end justify-between h-40 gap-2">
          {[40, 65, 50, 80, 45, 90, 70].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full rounded-t-lg transition-all hover:opacity-80" style={{ height: `${h}%`, background: "var(--gradient-primary)" }} />
              <span className="text-[10px] text-muted-foreground">{["س","أ","ث","ر","خ","ج","س"][i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Destinations table */}
      <div className="bg-card rounded-2xl p-5 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> الوجهات</h3>
          <button className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold">+ إضافة وجهة</button>
        </div>
        <div className="space-y-2">
          {destinations.slice(0, 5).map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors">
              <img src={d.image} alt={d.name} width={48} height={48} loading="lazy" className="h-12 w-12 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{d.name}</p>
                <p className="text-xs text-muted-foreground">{d.country} • ⭐ {d.rating}</p>
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-primary">{d.price.toLocaleString("ar")} دج</p>
                <p className="text-xs text-muted-foreground">{d.reviews} حجز</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
