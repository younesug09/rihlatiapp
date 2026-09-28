import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const roleSchema = z.enum(["customer", "agency", "admin"]);

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (error || !data) throw new Error("Forbidden");
}

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: users, error }, { data: profiles }, { data: roles }] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 }),
      supabaseAdmin.from("profiles").select("id, full_name, phone, wilaya, created_at"),
      supabaseAdmin.from("user_roles").select("user_id, role"),
    ]);
    if (error) throw error;
    return users.users.map((user) => ({
      id: user.id,
      email: user.email ?? "",
      createdAt: user.created_at,
      fullName: profiles?.find((profile) => profile.id === user.id)?.full_name ?? "",
      wilaya: profiles?.find((profile) => profile.id === user.id)?.wilaya ?? "",
      roles: roles?.filter((role) => role.user_id === user.id).map((role) => role.role) ?? [],
    }));
  });

export const createAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ email: z.string().email(), password: z.string().min(8), fullName: z.string().min(2).max(100), role: roleSchema }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({ email: data.email, password: data.password, email_confirm: true, user_metadata: { full_name: data.fullName, account_type: data.role === "agency" ? "agency" : "customer" } });
    if (error || !created.user) throw error ?? new Error("تعذّر إنشاء المستخدم");
    await supabaseAdmin.from("profiles").update({ full_name: data.fullName }).eq("id", created.user.id);
    await supabaseAdmin.from("user_roles").upsert({ user_id: created.user.id, role: data.role });
    return { id: created.user.id };
  });

export const updateAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid(), fullName: z.string().min(2).max(100), wilaya: z.string().max(100), role: roleSchema }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.id === context.userId && data.role !== "admin") throw new Error("لا يمكنك إزالة صلاحية المدير من حسابك الحالي");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: profileError } = await supabaseAdmin.from("profiles").update({ full_name: data.fullName, wilaya: data.wilaya || null }).eq("id", data.id);
    if (profileError) throw profileError;
    const { error: clearError } = await supabaseAdmin.from("user_roles").delete().eq("user_id", data.id);
    if (clearError) throw clearError;
    const { error: roleError } = await supabaseAdmin.from("user_roles").insert({ user_id: data.id, role: data.role });
    if (roleError) throw roleError;
    return { ok: true };
  });

export const deleteAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (data.id === context.userId) throw new Error("لا يمكنك حذف حسابك الحالي");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.id);
    if (error) throw error;
    return { ok: true };
  });