import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useRole, type AppRole } from "@/hooks/useRole";
import { getDashboardPath } from "@/lib/roleRedirect";

/** UI-only gate. Real protection is enforced by database access rules. */
export function RoleGate({ allow, children }: { allow: AppRole[]; children: ReactNode }) {
  const { user, roles, loading } = useRole();
  const navigate = useNavigate();
  const ok = roles.some((r) => allow.includes(r));

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!ok) getDashboardPath().then((to) => navigate({ to, replace: true }));
  }, [user, ok, loading, navigate]);

  if (loading || !user || !ok) {
    return <div className="p-10 text-center text-muted-foreground">...</div>;
  }
  return <>{children}</>;
}
