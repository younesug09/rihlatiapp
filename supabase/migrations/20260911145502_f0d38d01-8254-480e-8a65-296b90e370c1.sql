REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.protect_agency_verification() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_agency_on_booking() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_customer_on_status() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.can_access_booking(uuid, uuid) FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.can_access_booking(uuid, uuid) TO authenticated;