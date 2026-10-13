REVOKE EXECUTE ON FUNCTION public.cancel_booking(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.decide_booking(uuid, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.offer_flexstay(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.respond_flexstay(uuid, boolean) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.set_booking_payment_status(uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.can_access_booking(uuid, uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_my_role() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cancel_booking(uuid, text), public.decide_booking(uuid, text, text), public.offer_flexstay(uuid), public.respond_flexstay(uuid, boolean), public.set_booking_payment_status(uuid, text), public.can_access_booking(uuid, uuid), public.get_my_role() TO authenticated;
REVOKE EXECUTE ON FUNCTION public.compute_booking_fees(), public.handle_new_user(), public.log_agency_verification_change(), public.notify_agency_on_booking(), public.notify_customer_on_status(), public.protect_agency_verification() FROM PUBLIC, anon, authenticated;