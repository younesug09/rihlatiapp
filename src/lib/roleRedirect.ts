import { supabase } from "@/integrations/supabase/client";

export type DashboardPath = "/dashboard/customer" | "/dashboard/agency" | "/dashboard/admin";

/** Reads the caller's role from the database (server-enforced) and returns the dashboard path. */
export async function getDashboardPath(): Promise<DashboardPath> {
  const { data } = await supabase.rpc("get_my_role");
  if (data === "admin") return "/dashboard/admin";
  if (data === "agency") return "/dashboard/agency";
  return "/dashboard/customer";
}
