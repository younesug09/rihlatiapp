import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "رحلتي — منصة السياحة والتواصل الإعلامي" },
      { name: "description", content: "اكتشف أجمل الوجهات السياحية في الجزائر والعالم مع رحلتي، منصة سياحية وإعلامية حديثة." },
    ],
  }),
  component: Splash,
});

function Splash() {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      navigate({ to: "/home" });
    }, 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center text-primary-foreground overflow-hidden"
      style={{ background: "var(--gradient-hero)" }}
      onClick={() => { setShow(false); navigate({ to: "/home" }); }}
    >
      {/* Floating circles */}
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl animate-float" />
      <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 flex flex-col items-center animate-scale-in">
        <div className="h-28 w-28 rounded-3xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-glow mb-6">
          <img src={logo} alt="رحلتي" className="h-20 w-20" width={80} height={80} />
        </div>
        <h1 className="text-5xl font-bold tracking-tight mb-3">رحلتي</h1>
        <p className="text-base text-white/85">منصة السياحة والتواصل الإعلامي</p>
        <div className="mt-12 flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-white/80 animate-pulse" />
          <span className="h-2 w-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "0.2s" }} />
          <span className="h-2 w-2 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>

      <Link to="/home" className="absolute bottom-8 text-white/70 text-sm hover:text-white transition-colors">
        تخطّي
      </Link>
    </div>
  );
}
