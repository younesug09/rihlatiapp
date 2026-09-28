import { Link } from "@tanstack/react-router";
import { Mail, Send } from "lucide-react";
import logo from "@/assets/logo.png";
import { useLanguage } from "@/hooks/useLanguage";

export function AppFooter() {
  const { lang } = useLanguage();
  const copy = {
    ar: { tagline: "اكتشف. عِش. شارك.", browse: "التصفح", discover: "اكتشف", stays: "الإقامات", magazine: "مجلة رحلتي", events: "الفعاليات", stories: "قصص رحلتي", passport: "جواز رحلتي", news: "الأخبار", media: "الوسائط", favorites: "المفضلة", trust: "الثقة", trustCenter: "مركز الثقة", about: "من نحن", pitch: "العرض الأكاديمي", help: "المساعدة والدعم", newsletter: "اشترك في نشرة رحلتي", newsletterBody: "أفضل الوجهات والقصص السياحية في بريدك.", email: "بريدك الإلكتروني", soon: "قريبًا", platform: "منصة اتصال سياحي رقمية جزائرية" },
    fr: { tagline: "Découvrez. Vivez. Partagez.", browse: "Explorer", discover: "Découvrir", stays: "Hébergements", magazine: "Magazine RIHLA", events: "Événements", stories: "Récits RIHLA", passport: "Passeport RIHLA", news: "Actualités", media: "Médias", favorites: "Favoris", trust: "Confiance", trustCenter: "Centre de confiance", about: "À propos", pitch: "Présentation académique", help: "Aide et support", newsletter: "Recevez la newsletter RIHLA", newsletterBody: "Les meilleures destinations et histoires dans votre boîte mail.", email: "Votre e-mail", soon: "Bientôt", platform: "Plateforme numérique algérienne de tourisme" },
    en: { tagline: "Discover. Live. Share.", browse: "Browse", discover: "Discover", stays: "Stays", magazine: "RIHLA Magazine", events: "Events", stories: "RIHLA Stories", passport: "RIHLA Passport", news: "News", media: "Media", favorites: "Favorites", trust: "Trust", trustCenter: "Trust Center", about: "About", pitch: "Academic pitch", help: "Help & Support", newsletter: "Join the RIHLA newsletter", newsletterBody: "Top destinations and travel stories, delivered.", email: "Your email", soon: "Coming soon", platform: "Algerian digital tourism platform" },
  }[lang];
  return (
    <footer className="mt-12 bg-primary-glow text-primary-foreground">
      <div className="h-1 bg-accent" />
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center gap-3">
          <img src={logo} alt="رحلتي RIHLA" width={40} height={40} className="h-10 w-10 object-contain rounded-xl bg-card p-1" />
          <div>
            <p className="font-bold text-lg leading-tight">رحلتي · RIHLA</p>
            <p className="text-xs opacity-75">{copy.tagline}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8 text-sm">
          <div>
            <h3 className="font-bold mb-2 text-xs uppercase tracking-wide opacity-75">{copy.browse}</h3>
            <ul className="space-y-1.5">
              <li><Link to="/discover" className="hover:text-accent transition-colors">{copy.discover}</Link></li>
              <li><Link to="/hotels" className="hover:text-accent transition-colors">{copy.stays}</Link></li>
              <li><Link to="/magazine" className="hover:text-accent transition-colors">{copy.magazine}</Link></li>
              <li><Link to="/events" className="hover:text-accent transition-colors">{copy.events}</Link></li>
              <li><Link to="/community" className="hover:text-accent transition-colors">{copy.stories}</Link></li>
              <li><Link to="/passport" className="hover:text-accent transition-colors">{copy.passport}</Link></li>
              <li><Link to="/news" className="hover:text-accent transition-colors">{copy.news}</Link></li>
              <li><Link to="/media" className="hover:text-accent transition-colors">{copy.media}</Link></li>
              <li><Link to="/favorites" className="hover:text-accent transition-colors">{copy.favorites}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2 text-xs uppercase tracking-wide opacity-75">{copy.trust}</h3>
            <ul className="space-y-1.5">
              <li><Link to="/trust" className="hover:text-accent transition-colors">{copy.trustCenter}</Link></li>
              <li><Link to="/about" className="hover:text-accent transition-colors">{copy.about}</Link></li>
              <li><Link to="/profile/help" className="hover:text-accent transition-colors">{copy.help}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-card/10 border border-card/15 p-5">
          <p className="font-bold text-sm">{copy.newsletter}</p>
          <p className="text-xs opacity-75 mt-1">{copy.newsletterBody}</p>
          <form
            className="mt-3 flex gap-2"
            onSubmit={(e) => e.preventDefault()}
            aria-label="الاشتراك في النشرة"
          >
            <label className="sr-only" htmlFor="newsletter-email">البريد الإلكتروني</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder={copy.email}
              className="min-w-0 flex-1 bg-card text-card-foreground rounded-full px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-accent text-accent-foreground px-3 py-2 text-xs font-bold inline-flex items-center gap-1"
            >
              <Send className="h-3.5 w-3.5" /> {copy.soon}
            </button>
          </form>
        </div>

        <div className="mt-8 pt-6 border-t border-card/15 flex flex-wrap items-center justify-between gap-2 text-xs opacity-75">
          <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> contact@rihlati.app</span>
          <span>© {new Date().getFullYear()} RIHLA — {copy.platform}</span>
        </div>
      </div>
    </footer>
  );
}
