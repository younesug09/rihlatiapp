import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type AppRole = "customer" | "agency" | "admin";

export type Agency = {
  id: string;
  slug: string;
  name: string;
  verification_status: "pending" | "under_review" | "verified" | "rejected" | "suspended";
};

export function useRole() {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setRoles([]);
      setAgency(null);
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      const [{ data: r }, { data: a }] = await Promise.all([
        supabase.from("user_roles").select("role").eq("user_id", user.id),
        supabase
          .from("agencies")
          .select("id, slug, name, verification_status")
          .eq("owner_id", user.id)
          .maybeSingle(),
      ]);
      if (!active) return;
      setRoles(((r ?? []).map((x) => x.role) as AppRole[]) ?? []);
      setAgency((a as Agency) ?? null);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [user, authLoading]);

  return {
    user,
    roles,
    agency,
    loading: loading || authLoading,
    isAgency: roles.includes("agency"),
    isAdmin: roles.includes("admin"),
    isCustomer: roles.includes("customer"),
  };
}
