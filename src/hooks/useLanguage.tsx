import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from "react";

export type Lang = "ar" | "en" | "fr" | "es" | "de" | "tr" | "it" | "ru" | "zh";

export const languages: { code: Lang; label: string; flag: string; dir: "rtl" | "ltr" }[] = [
  { code: "ar", label: "العربية", flag: "🇩🇿", dir: "rtl" },
  { code: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "es", label: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷", dir: "ltr" },
  { code: "it", label: "Italiano", flag: "🇮🇹", dir: "ltr" },
  { code: "ru", label: "Русский", flag: "🇷🇺", dir: "ltr" },
  { code: "zh", label: "中文", flag: "🇨🇳", dir: "ltr" },
];

// Core translation dictionary. Keys we use across the app.
const dict: Record<Lang, Record<string, string>> = {
  ar: {
    appName: "رحلتي", home: "الرئيسية", explore: "اكتشف", hotels: "الفنادق", favorites: "المفضلة", profile: "حسابي",
    notifications: "الإشعارات", myBookings: "حجوزاتي", myStays: "إقاماتي", language: "اللغة", settings: "الإعدادات",
    help: "المساعدة والدعم", signOut: "تسجيل الخروج", signIn: "تسجيل الدخول", signUp: "حساب جديد",
    chooseLanguage: "اختر اللغة", allNotifications: "عرض كل الإشعارات", aboutApp: "عن التطبيق",
    back: "رجوع", noNotifications: "لا توجد إشعارات", soon: "قريبًا",
  },
  en: {
    appName: "Rihlati", home: "Home", explore: "Explore", hotels: "Hotels", favorites: "Favorites", profile: "Account",
    notifications: "Notifications", myBookings: "My Bookings", myStays: "My Stays", language: "Language", settings: "Settings",
    help: "Help & Support", signOut: "Sign Out", signIn: "Sign In", signUp: "Sign Up",
    chooseLanguage: "Choose language", allNotifications: "View all notifications", aboutApp: "About app",
    back: "Back", noNotifications: "No notifications", soon: "Coming soon",
  },
  fr: {
    appName: "Rihlati", home: "Accueil", explore: "Explorer", hotels: "Hôtels", favorites: "Favoris", profile: "Compte",
    notifications: "Notifications", myBookings: "Mes réservations", myStays: "Mes séjours", language: "Langue", settings: "Paramètres",
    help: "Aide et support", signOut: "Déconnexion", signIn: "Connexion", signUp: "S'inscrire",
    chooseLanguage: "Choisir la langue", allNotifications: "Voir toutes les notifications", aboutApp: "À propos",
    back: "Retour", noNotifications: "Aucune notification", soon: "Bientôt",
  },
  es: {
    appName: "Rihlati", home: "Inicio", explore: "Explorar", hotels: "Hoteles", favorites: "Favoritos", profile: "Cuenta",
    notifications: "Notificaciones", myBookings: "Mis reservas", myStays: "Mis estancias", language: "Idioma", settings: "Ajustes",
    help: "Ayuda y soporte", signOut: "Cerrar sesión", signIn: "Iniciar sesión", signUp: "Registrarse",
    chooseLanguage: "Elegir idioma", allNotifications: "Ver todas las notificaciones", aboutApp: "Acerca de",
    back: "Atrás", noNotifications: "Sin notificaciones", soon: "Próximamente",
  },
  de: {
    appName: "Rihlati", home: "Start", explore: "Entdecken", hotels: "Hotels", favorites: "Favoriten", profile: "Konto",
    notifications: "Benachrichtigungen", myBookings: "Meine Buchungen", myStays: "Meine Aufenthalte", language: "Sprache", settings: "Einstellungen",
    help: "Hilfe & Support", signOut: "Abmelden", signIn: "Anmelden", signUp: "Registrieren",
    chooseLanguage: "Sprache wählen", allNotifications: "Alle Benachrichtigungen", aboutApp: "Über die App",
    back: "Zurück", noNotifications: "Keine Benachrichtigungen", soon: "Demnächst",
  },
  tr: {
    appName: "Rihlati", home: "Ana Sayfa", explore: "Keşfet", hotels: "Oteller", favorites: "Favoriler", profile: "Hesabım",
    notifications: "Bildirimler", myBookings: "Rezervasyonlarım", myStays: "Konaklamalarım", language: "Dil", settings: "Ayarlar",
    help: "Yardım ve Destek", signOut: "Çıkış", signIn: "Giriş Yap", signUp: "Kayıt Ol",
    chooseLanguage: "Dil seç", allNotifications: "Tüm bildirimleri gör", aboutApp: "Uygulama hakkında",
    back: "Geri", noNotifications: "Bildirim yok", soon: "Yakında",
  },
  it: {
    appName: "Rihlati", home: "Home", explore: "Esplora", hotels: "Hotel", favorites: "Preferiti", profile: "Account",
    notifications: "Notifiche", myBookings: "Prenotazioni", myStays: "Soggiorni", language: "Lingua", settings: "Impostazioni",
    help: "Aiuto e supporto", signOut: "Esci", signIn: "Accedi", signUp: "Registrati",
    chooseLanguage: "Scegli la lingua", allNotifications: "Tutte le notifiche", aboutApp: "Informazioni",
    back: "Indietro", noNotifications: "Nessuna notifica", soon: "Prossimamente",
  },
  ru: {
    appName: "Rihlati", home: "Главная", explore: "Обзор", hotels: "Отели", favorites: "Избранное", profile: "Аккаунт",
    notifications: "Уведомления", myBookings: "Мои брони", myStays: "Мои поездки", language: "Язык", settings: "Настройки",
    help: "Помощь", signOut: "Выйти", signIn: "Войти", signUp: "Регистрация",
    chooseLanguage: "Выберите язык", allNotifications: "Все уведомления", aboutApp: "О приложении",
    back: "Назад", noNotifications: "Нет уведомлений", soon: "Скоро",
  },
  zh: {
    appName: "Rihlati", home: "首页", explore: "探索", hotels: "酒店", favorites: "收藏", profile: "我的",
    notifications: "通知", myBookings: "我的预订", myStays: "我的住宿", language: "语言", settings: "设置",
    help: "帮助与支持", signOut: "退出", signIn: "登录", signUp: "注册",
    chooseLanguage: "选择语言", allNotifications: "查看全部通知", aboutApp: "关于",
    back: "返回", noNotifications: "暂无通知", soon: "即将推出",
  },
};

type LangCtx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string };
const LanguageContext = createContext<LangCtx>({ lang: "ar", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ar");

  useEffect(() => {
    const stored = (localStorage.getItem("lang") as Lang | null) ?? "ar";
    setLangState(stored);
    const cfg = languages.find((l) => l.code === stored) ?? languages[0];
    document.documentElement.lang = cfg.code;
    document.documentElement.dir = cfg.dir;
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
    const cfg = languages.find((x) => x.code === l) ?? languages[0];
    document.documentElement.lang = cfg.code;
    document.documentElement.dir = cfg.dir;
  };

  const value = useMemo(
    () => ({ lang, setLang, t: (k: string) => dict[lang]?.[k] ?? dict.ar[k] ?? k }),
    [lang]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
