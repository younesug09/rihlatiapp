ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS payment_method text,
  ADD COLUMN IF NOT EXISTS verification_token uuid NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN IF NOT EXISTS decided_at timestamptz,
  ADD COLUMN IF NOT EXISTS decision_notes text;

CREATE UNIQUE INDEX IF NOT EXISTS bookings_verification_token_key ON public.bookings(verification_token);
CREATE INDEX IF NOT EXISTS bookings_agency_status_idx ON public.bookings(agency_id, status);
CREATE INDEX IF NOT EXISTS bookings_user_status_idx ON public.bookings(user_id, status);

ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_payment_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_payment_status_check CHECK (payment_status IN ('unpaid','pending','paid','refunded','failed')) NOT VALID;
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check CHECK (status IN ('pending','confirmed','rejected','cancelled','completed')) NOT VALID;

CREATE TABLE public.destinations_catalog (
  id text PRIMARY KEY,
  name text NOT NULL,
  wilaya text NOT NULL,
  tourism_type text NOT NULL DEFAULT 'cities',
  short_description text,
  overview text,
  image_url text,
  gallery text[] NOT NULL DEFAULT '{}',
  activities text[] NOT NULL DEFAULT '{}',
  best_time text,
  recommended_duration text,
  latitude numeric,
  longitude numeric,
  is_published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.destinations_catalog TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.destinations_catalog TO authenticated;
GRANT ALL ON public.destinations_catalog TO service_role;
ALTER TABLE public.destinations_catalog ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published destinations are public" ON public.destinations_catalog FOR SELECT USING (is_published = true OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage destinations" ON public.destinations_catalog FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER destinations_catalog_updated_at BEFORE UPDATE ON public.destinations_catalog FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "Users manage own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers read own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers request own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Customers cancel own pending bookings" ON public.bookings;
DROP POLICY IF EXISTS "Agency updates own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins manage all bookings" ON public.bookings;
CREATE POLICY "Customers read own bookings" ON public.bookings FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Customers request own bookings" ON public.bookings FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'pending');
CREATE POLICY "Customers cancel own pending bookings" ON public.bookings FOR UPDATE TO authenticated USING (auth.uid() = user_id AND status = 'pending') WITH CHECK (auth.uid() = user_id AND status = 'cancelled');
CREATE POLICY "Admins manage all bookings" ON public.bookings FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.decide_booking(_booking_id uuid, _decision text, _notes text DEFAULT NULL)
RETURNS public.bookings LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE current_booking public.bookings; related_trip public.trips; agency_owner uuid;
BEGIN
  IF _decision NOT IN ('confirmed','rejected') THEN RAISE EXCEPTION 'Invalid booking decision'; END IF;
  SELECT * INTO current_booking FROM public.bookings WHERE id = _booking_id FOR UPDATE;
  IF current_booking.id IS NULL THEN RAISE EXCEPTION 'Booking not found'; END IF;
  SELECT owner_id INTO agency_owner FROM public.agencies WHERE id = current_booking.agency_id;
  IF auth.uid() IS NULL OR (auth.uid() <> agency_owner AND NOT public.has_role(auth.uid(),'admin')) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF current_booking.status <> 'pending' THEN RAISE EXCEPTION 'Booking already decided'; END IF;
  IF _decision = 'confirmed' AND current_booking.trip_id IS NOT NULL THEN
    SELECT * INTO related_trip FROM public.trips WHERE id = current_booking.trip_id FOR UPDATE;
    IF related_trip.id IS NULL OR related_trip.seats_booked + current_booking.guests > related_trip.seats THEN RAISE EXCEPTION 'Not enough seats'; END IF;
    UPDATE public.trips SET seats_booked = seats_booked + current_booking.guests,
      status = CASE WHEN seats_booked + current_booking.guests >= seats THEN 'sold_out'::public.trip_status ELSE status END
    WHERE id = current_booking.trip_id;
  END IF;
  UPDATE public.bookings SET status = _decision, decision_notes = _notes, decided_at = now() WHERE id = _booking_id RETURNING * INTO current_booking;
  INSERT INTO public.audit_logs(actor_id, action, entity_type, entity_id, metadata) VALUES (auth.uid(), 'booking_' || _decision, 'booking', _booking_id::text, jsonb_build_object('notes', _notes));
  RETURN current_booking;
END; $$;
GRANT EXECUTE ON FUNCTION public.decide_booking(uuid,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.set_booking_payment_status(_booking_id uuid, _payment_status text)
RETURNS public.bookings LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE current_booking public.bookings; agency_owner uuid;
BEGIN
  IF _payment_status NOT IN ('unpaid','pending','paid','refunded','failed') THEN RAISE EXCEPTION 'Invalid payment status'; END IF;
  SELECT * INTO current_booking FROM public.bookings WHERE id = _booking_id FOR UPDATE;
  SELECT owner_id INTO agency_owner FROM public.agencies WHERE id = current_booking.agency_id;
  IF auth.uid() IS NULL OR (auth.uid() <> agency_owner AND NOT public.has_role(auth.uid(),'admin')) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  UPDATE public.bookings SET payment_status = _payment_status WHERE id = _booking_id RETURNING * INTO current_booking;
  INSERT INTO public.audit_logs(actor_id, action, entity_type, entity_id, metadata) VALUES (auth.uid(), 'payment_status_changed', 'booking', _booking_id::text, jsonb_build_object('payment_status', _payment_status));
  RETURN current_booking;
END; $$;
GRANT EXECUTE ON FUNCTION public.set_booking_payment_status(uuid,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.verify_booking_token(_token uuid)
RETURNS TABLE(booking_ref text, status text, payment_status text, check_in date, check_out date, guests integer, agency_name text, trip_title text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT b.booking_ref, b.status, b.payment_status, b.check_in, b.check_out, b.guests, a.name, t.title
  FROM public.bookings b LEFT JOIN public.agencies a ON a.id = b.agency_id LEFT JOIN public.trips t ON t.id = b.trip_id
  WHERE b.verification_token = _token AND b.status IN ('confirmed','completed') LIMIT 1
$$;
GRANT EXECUTE ON FUNCTION public.verify_booking_token(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.log_agency_verification_change()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.verification_status IS DISTINCT FROM OLD.verification_status THEN
    INSERT INTO public.audit_logs(actor_id, action, entity_type, entity_id, metadata)
    VALUES (auth.uid(), 'agency_status_changed', 'agency', NEW.id::text, jsonb_build_object('from', OLD.verification_status, 'to', NEW.verification_status, 'notes', NEW.verification_notes));
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER agencies_audit_verification AFTER UPDATE ON public.agencies FOR EACH ROW EXECUTE FUNCTION public.log_agency_verification_change();