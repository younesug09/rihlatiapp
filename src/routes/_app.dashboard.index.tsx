import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getDashboardPath } from "@/lib/roleRedirect";

export const Route = createFileRoute("/_app/dashboard/")({
  head: () => ({ meta: [{ title: "لوحتي — رحلتي" }, { name: "robots", content: "noindex" }] }),
  component: DashboardRedirect,
});

function DashboardRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return navigate({ to: "/auth", replace: true });
      navigate({ to: await getDashboardPath(), replace: true });
    });
  }, [navigate]);
  return <div className="p-10 text-center text-muted-foreground">...</div>;
}
