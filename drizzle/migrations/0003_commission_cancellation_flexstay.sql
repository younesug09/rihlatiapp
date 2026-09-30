ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS base_price numeric,
  ADD COLUMN IF NOT EXISTS service_fee numeric,
  ADD COLUMN IF NOT EXISTS agency_fee numeric,
  ADD COLUMN IF NOT EXISTS platform_revenue numeric,
  ADD COLUMN IF NOT EXISTS agency_payout numeric,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancellation_reason text,
  ADD COLUMN IF NOT EXISTS refund_amount numeric,
  ADD COLUMN IF NOT EXISTS penalty_amount numeric,
  ADD COLUMN IF NOT EXISTS agency_compensation numeric,
  ADD COLUMN IF NOT EXISTS platform_penalty_fee numeric,
  ADD COLUMN IF NOT EXISTS flexstay_status text,
  ADD COLUMN IF NOT EXISTS traveler_name text,
  ADD COLUMN IF NOT EXISTS traveler_phone text;

CREATE OR REPLACE FUNCTION public.compute_booking_fees()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE t_price numeric; base numeric;
BEGIN
  IF NEW.trip_id IS NOT NULL THEN
    SELECT price INTO t_price FROM public.trips WHERE id = NEW.trip_id;
    base := COALESCE(t_price, 0) * NEW.guests;
  ELSE
    base := COALESCE(NEW.base_price, NEW.total_price);
  END IF;
  NEW.base_price := round(base, 2);
  NEW.service_fee := round(base * 0.04, 2);
  NEW.agency_fee := round(base * 0.08, 2);
  NEW.platform_revenue := round(base * 0.12, 2);
  NEW.agency_payout := round(base * 0.92, 2);
  NEW.total_price := round(base * 1.04, 2);
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS bookings_compute_fees ON public.bookings;
CREATE TRIGGER bookings_compute_fees BEFORE INSERT ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.compute_booking_fees();

CREATE TABLE public.flexstay_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  offered_by uuid,
  status text NOT NULL DEFAULT 'pending',
  shift_days integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz
);
GRANT SELECT ON public.flexstay_offers TO authenticated;
GRANT ALL ON public.flexstay_offers TO service_role;
ALTER TABLE public.flexstay_offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Booking parties read flexstay offers" ON public.flexstay_offers FOR SELECT TO authenticated
USING (public.can_access_booking(booking_id, auth.uid()) OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.discount_vouchers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  code text NOT NULL UNIQUE,
  percent integer NOT NULL DEFAULT 20,
  source text NOT NULL DEFAULT 'flexstay',
  perks text[] NOT NULL DEFAULT '{}',
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.discount_vouchers TO authenticated;
GRANT ALL ON public.discount_vouchers TO service_role;
ALTER TABLE public.discount_vouchers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own vouchers" ON public.discount_vouchers FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  badge text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, badge)
);
GRANT SELECT ON public.user_badges TO authenticated;
GRANT ALL ON public.user_badges TO service_role;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own badges" ON public.user_badges FOR SELECT TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.cancel_booking(_booking_id uuid, _reason text DEFAULT NULL)
RETURNS public.bookings LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE b public.bookings; dep date; base numeric; pen numeric := 0; comp numeric := 0; pfee numeric := 0; owner uuid;
BEGIN
  SELECT * INTO b FROM public.bookings WHERE id = _booking_id FOR UPDATE;
  IF b.id IS NULL THEN RAISE EXCEPTION 'Booking not found'; END IF;
  IF auth.uid() IS NULL OR (auth.uid() <> b.user_id AND NOT public.has_role(auth.uid(),'admin')) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF b.status NOT IN ('pending','confirmed') THEN RAISE EXCEPTION 'Booking cannot be cancelled'; END IF;
  SELECT departure_date INTO dep FROM public.trips WHERE id = b.trip_id;
  dep := COALESCE(dep, b.check_in);
  base := COALESCE(b.base_price, b.total_price);
  IF b.status = 'confirmed' AND dep::timestamptz - now() < interval '48 hours' THEN
    comp := round(base * 0.10, 2); pfee := round(base * 0.05, 2); pen := comp + pfee;
  END IF;
  IF b.status = 'confirmed' AND b.trip_id IS NOT NULL THEN
    UPDATE public.trips SET seats_booked = GREATEST(0, seats_booked - b.guests),
      status = CASE WHEN status = 'sold_out' THEN 'published'::public.trip_status ELSE status END
    WHERE id = b.trip_id;
  END IF;
  UPDATE public.bookings SET status = 'cancelled', cancelled_at = now(), cancellation_reason = _reason,
    penalty_amount = pen, agency_compensation = comp, platform_penalty_fee = pfee,
    refund_amount = GREATEST(0, b.total_price - pen),
    payment_status = CASE WHEN b.payment_status = 'paid' THEN 'refunded' ELSE b.payment_status END
  WHERE id = _booking_id RETURNING * INTO b;
  SELECT owner_id INTO owner FROM public.agencies WHERE id = b.agency_id;
  IF owner IS NOT NULL THEN
    INSERT INTO public.notifications(user_id, title, body, link)
    VALUES (owner, 'إلغاء حجز', 'ألغى المسافر الحجز ' || COALESCE(b.booking_ref,'') || ' — تعويض الوكالة: ' || comp || ' دج', '/agency/bookings');
  END IF;
  INSERT INTO public.audit_logs(actor_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), 'booking_cancelled', 'booking', _booking_id::text, jsonb_build_object('penalty', pen, 'agency', comp, 'platform', pfee, 'refund', b.refund_amount));
  RETURN b;
END; $$;

CREATE OR REPLACE FUNCTION public.offer_flexstay(_booking_id uuid)
RETURNS public.flexstay_offers LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE b public.bookings; owner uuid; o public.flexstay_offers;
BEGIN
  SELECT * INTO b FROM public.bookings WHERE id = _booking_id;
  IF b.id IS NULL THEN RAISE EXCEPTION 'Booking not found'; END IF;
  SELECT owner_id INTO owner FROM public.agencies WHERE id = b.agency_id;
  IF auth.uid() IS NULL OR (auth.uid() IS DISTINCT FROM owner AND NOT public.has_role(auth.uid(),'admin')) THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF b.status <> 'confirmed' THEN RAISE EXCEPTION 'Booking must be confirmed'; END IF;
  IF EXISTS (SELECT 1 FROM public.flexstay_offers WHERE booking_id = _booking_id AND status = 'pending') THEN RAISE EXCEPTION 'Offer already pending'; END IF;
  INSERT INTO public.flexstay_offers(booking_id, offered_by) VALUES (_booking_id, auth.uid()) RETURNING * INTO o;
  UPDATE public.bookings SET flexstay_status = 'offered' WHERE id = _booking_id;
  INSERT INTO public.notifications(user_id, title, body, link)
  VALUES (b.user_id, 'عرض FlexStay من رحلتي', 'هل تقبل تأجيل إقامتك يومًا واحدًا؟ تحصل على قسيمة خصم 20% + ترقية مجانية/فطور + شارة VIP.', '/profile/bookings');
  RETURN o;
END; $$;

CREATE OR REPLACE FUNCTION public.respond_flexstay(_offer_id uuid, _accept boolean)
RETURNS public.flexstay_offers LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE o public.flexstay_offers; b public.bookings; owner uuid;
BEGIN
  SELECT * INTO o FROM public.flexstay_offers WHERE id = _offer_id FOR UPDATE;
  IF o.id IS NULL THEN RAISE EXCEPTION 'Offer not found'; END IF;
  SELECT * INTO b FROM public.bookings WHERE id = o.booking_id FOR UPDATE;
  IF auth.uid() IS NULL OR auth.uid() <> b.user_id THEN RAISE EXCEPTION 'Forbidden'; END IF;
  IF o.status <> 'pending' THEN RAISE EXCEPTION 'Offer already answered'; END IF;
  UPDATE public.flexstay_offers SET status = CASE WHEN _accept THEN 'accepted' ELSE 'declined' END, responded_at = now()
  WHERE id = _offer_id RETURNING * INTO o;
  IF _accept THEN
    UPDATE public.bookings SET check_in = check_in + o.shift_days, check_out = check_out + o.shift_days, flexstay_status = 'accepted' WHERE id = b.id;
    INSERT INTO public.discount_vouchers(user_id, code, percent, source, perks)
    VALUES (b.user_id, 'FLEX-' || upper(substr(md5(random()::text), 1, 8)), 20, 'flexstay', ARRAY['free_upgrade_or_breakfast']);
    INSERT INTO public.user_badges(user_id, badge) VALUES (b.user_id, 'vip_flexstay') ON CONFLICT DO NOTHING;
  ELSE
    UPDATE public.bookings SET flexstay_status = 'declined' WHERE id = b.id;
  END IF;
  SELECT owner_id INTO owner FROM public.agencies WHERE id = b.agency_id;
  IF owner IS NOT NULL THEN
    INSERT INTO public.notifications(user_id, title, body, link)
    VALUES (owner, 'رد على عرض FlexStay', 'الحجز ' || COALESCE(b.booking_ref,'') || CASE WHEN _accept THEN ': قبل المسافر التأجيل' ELSE ': رفض المسافر التأجيل' END, '/agency/bookings');
  END IF;
  RETURN o;
END; $$;