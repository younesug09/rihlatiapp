import { Link } from "@tanstack/react-router";
import { Mail, Send } from "lucide-react";
import logo from "@/assets/logo.png";

export function AppFooter() {
  return (
    <footer className="mt-12 bg-primary-glow text-primary-foreground">
      <div className="h-1 bg-accent" />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center gap-3">
          <img src={logo} alt="رحلتي RIHLA" width={40} height={40} className="h-10 w-10 object-contain rounded-xl bg-card p-1" />
          <div>
            <p className="font-bold text-lg leading-tight">رحلتي · RIHLA</p>
            <p className="text-xs opacity-75">اكتشف. عِش. شارك. — Découvrez. Vivez. Partagez.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8 text-sm">
          <div>
            <h3 className="font-bold mb-2 text-xs uppercase tracking-wide opacity-75">التصفح</h3>
            <ul className="space-y-1.5">
              <li><Link to="/explore" className="hover:text-accent transition-colors">اكتشف</Link></li>
              <li><Link to="/hotels" className="hover:text-accent transition-colors">الإقامات</Link></li>
              <li><Link to="/magazine" className="hover:text-accent transition-colors">مجلة رحلتي</Link></li>
              <li><Link to="/events" className="hover:text-accent transition-colors">الفعاليات</Link></li>
              <li><Link to="/community" className="hover:text-accent transition-colors">قصص رحلتي</Link></li>
              <li><Link to="/stays" className="hover:text-accent transition-colors">الإقامات</Link></li>
              <li><Link to="/passport" className="hover:text-accent transition-colors">جواز رحلتي</Link></li>
              <li><Link to="/news" className="hover:text-accent transition-colors">الأخبار</Link></li>
              <li><Link to="/media" className="hover:text-accent transition-colors">الوسائط</Link></li>
              <li><Link to="/favorites" className="hover:text-accent transition-colors">المفضلة</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-xs uppercase tracking-wide opacity-75">الثقة</h3>
            <ul className="space-y-1.5">
              <li><Link to="/trust" className="hover:text-accent transition-colors">مركز الثقة</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">من نحن</Link></li>
              <li><Link to="/profile/help" className="hover:text-accent transition-colors">المساعدة والدعم</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-card/10 border border-card/15 p-5">
          <p className="font-bold text-sm">اشترك في نشرة رحلتي</p>
          <p className="text-xs opacity-75 mt-1">أفضل الوجهات والقصص السياحية في بريدك.</p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => e.preventDefault()}
            aria-label="الاشتراك في النشرة"
          >
            <label className="sr-only" htmlFor="newsletter-email">البريد الإلكتروني</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="بريدك الإلكتروني"
              className="flex-1 bg-card text-card-foreground rounded-full px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="rounded-full bg-accent text-accent-foreground px-3 py-2 text-xs font-bold inline-flex items-center gap-1"
            >
              <Send className="h-3.5 w-3.5" /> قريبًا
            </button>
          </form>
        </div>

        <div className="mt-8 pt-6 border-t border-card/15 flex flex-wrap items-center justify-between gap-2 text-xs opacity-75">
          <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> contact@rihlati.app</span>
          <span>© {new Date().getFullYear()} رحلتي RIHLA — منصة اتصال سياحي رقمية جزائرية</span>
        </div>
      </div>
    </footer>
  );
}
