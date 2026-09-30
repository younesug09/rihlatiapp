import type { LucideIcon } from "lucide-react";
import { RihlatyLogo } from "@/components/RihlatyLogo";
import { Menu, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

export type DashboardNavItem = {
  label: string;
  href: "/dashboard/customer" | "/dashboard/agency" | "/dashboard/admin" | "/profile" | "/discover" | "/favorites" | "/profile/bookings" | "/passport" | "/messages" | "/profile/notifications" | "/profile/settings" | "/agency" | "/agency/trips" | "/agency/bookings";
  icon: LucideIcon;
};

export function DashboardShell({
  title,
  subtitle,
  badge,
  items,
  children,
}: {
  title: string;
  subtitle: string;
  badge?: string;
  items: DashboardNavItem[];
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);

  const navigation = (
    <nav className="space-y-1" aria-label="تنقل لوحة التحكم">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            to={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-semibold transition-colors ${
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" strokeWidth={1.75} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
      <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
        <div>
          <RihlatyLogo className="mb-2 h-10 w-10" /><p className="text-xs font-bold text-primary">{subtitle}</p>
          <h1 className="text-2xl font-black">{title}</h1>
        </div>
        <Button variant="outline" size="icon" onClick={() => setOpen(true)} aria-label="فتح القائمة">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-72 bg-card p-5">
          <SheetHeader className="text-right">
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
          <div className="mt-6">{navigation}</div>
        </SheetContent>
      </Sheet>

      <div className="grid gap-7 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
          <div className="rounded-lg border border-border bg-card p-4 shadow-soft">
            <RihlatyLogo className="mb-2 h-10 w-10" /><p className="text-xs font-bold text-primary">{subtitle}</p>
            <h1 className="mt-1 text-xl font-black">{title}</h1>
            {badge && (
              <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-bold text-success">
                <ShieldCheck className="h-3.5 w-3.5" /> {badge}
              </p>
            )}
            <div className="my-4 h-px bg-border" />
            {navigation}
          </div>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}