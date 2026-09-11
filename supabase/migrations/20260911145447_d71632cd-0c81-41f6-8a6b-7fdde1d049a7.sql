-- 1. ROLES
CREATE TYPE public.app_role AS ENUM ('customer', 'agency', 'admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- 2. PROFILES extra fields
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS wilaya text,
  ADD COLUMN IF NOT EXISTS language text NOT NULL DEFAULT 'ar',
  ADD COLUMN IF NOT EXISTS budget_level text,
  ADD COLUMN IF NOT EXISTS travel_preferences text[] NOT NULL DEFAULT '{}';

-- default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  requested text;
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;

  requested := COALESCE(NEW.raw_user_meta_data->>'account_type', 'customer');
  IF requested NOT IN ('customer','agency') THEN
    requested := 'customer';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, requested::public.app_role)
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END; $$;

-- 3. AGENCIES
CREATE TYPE public.verification_status AS ENUM ('pending','under_review','verified','rejected','suspended');

CREATE TABLE public.agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  commercial_name text,
  email text,
  phone text,
  address text,
  wilaya text,
  website text,
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  description text,
  logo_url text,
  cover_url text,
  verification_status public.verification_status NOT NULL DEFAULT 'pending',
  verification_notes text,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.agencies TO authenticated;
GRANT SELECT ON public.agencies TO anon;
GRANT ALL ON public.agencies TO service_role;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Verified agencies are public" ON public.agencies FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Owners read own agency" ON public.agencies FOR SELECT TO authenticated USING (auth.uid() = owner_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Agency owners create own agency" ON public.agencies FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(),'agency'));
CREATE POLICY "Agency owners update own agency" ON public.agencies FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Admins manage agencies" ON public.agencies FOR ALL TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER agencies_updated_at BEFORE UPDATE ON public.agencies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- verification fields are admin-only
CREATE OR REPLACE FUNCTION public.protect_agency_verification()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(),'admin') THEN
    NEW.verification_status := OLD.verification_status;
    NEW.verification_notes := OLD.verification_notes;
    NEW.verified_at := OLD.verified_at;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER agencies_protect_verification BEFORE UPDATE ON public.agencies FOR EACH ROW EXECUTE FUNCTION public.protect_agency_verification();

CREATE TABLE public.agency_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  doc_type text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.agency_documents TO authenticated;
GRANT ALL ON public.agency_documents TO service_role;
ALTER TABLE public.agency_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Agency manages own documents" ON public.agency_documents FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agencies a WHERE a.id = agency_id AND a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.agencies a WHERE a.id = agency_id AND a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'));

-- 4. TRIPS
CREATE TYPE public.trip_status AS ENUM ('draft','pending_approval','published','paused','sold_out','completed','cancelled');

CREATE TABLE public.trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  title text NOT NULL,
  destination text NOT NULL,
  description text,
  cover_url text,
  gallery text[] NOT NULL DEFAULT '{}',
  duration_days integer NOT NULL DEFAULT 1,
  departure_date date,
  return_date date,
  departure_location text,
  seats integer NOT NULL DEFAULT 0,
  seats_booked integer NOT NULL DEFAULT 0,
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'DZD',
  included text[] NOT NULL DEFAULT '{}',
  not_included text[] NOT NULL DEFAULT '{}',
  transport text,
  accommodation text,
  activities text[] NOT NULL DEFAULT '{}',
  cancellation_policy text,
  contact text,
  status public.trip_status NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trips TO authenticated;
GRANT SELECT ON public.trips TO anon;
GRANT ALL ON public.trips TO service_role;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published trips are public" ON public.trips FOR SELECT
  USING (status = 'published' AND EXISTS (SELECT 1 FROM public.agencies a WHERE a.id = agency_id AND a.verification_status = 'verified'));
CREATE POLICY "Agency reads own trips" ON public.trips FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agencies a WHERE a.id = agency_id AND a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Agency manages own trips" ON public.trips FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agencies a WHERE a.id = agency_id AND a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.agencies a WHERE a.id = agency_id AND a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'));

CREATE TRIGGER trips_updated_at BEFORE UPDATE ON public.trips FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.trip_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  time_label text,
  activity text NOT NULL,
  location text,
  image_url text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.trip_days TO authenticated;
GRANT SELECT ON public.trip_days TO anon;
GRANT ALL ON public.trip_days TO service_role;
ALTER TABLE public.trip_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trip days follow public trips" ON public.trip_days FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.trips t JOIN public.agencies a ON a.id = t.agency_id
                 WHERE t.id = trip_id AND t.status = 'published' AND a.verification_status = 'verified'));
CREATE POLICY "Agency manages own trip days" ON public.trip_days FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.trips t JOIN public.agencies a ON a.id = t.agency_id WHERE t.id = trip_id AND a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.trips t JOIN public.agencies a ON a.id = t.agency_id WHERE t.id = trip_id AND a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'));

-- 5. BOOKINGS (extend existing)
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS agency_id uuid REFERENCES public.agencies(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS booking_ref text UNIQUE DEFAULT ('RH-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  ADD COLUMN IF NOT EXISTS notes text;

ALTER TABLE public.bookings ALTER COLUMN destination_id DROP NOT NULL;

CREATE POLICY "Agency reads own bookings" ON public.bookings FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agencies a WHERE a.id = agency_id AND a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Agency updates own bookings" ON public.bookings FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.agencies a WHERE a.id = agency_id AND a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.agencies a WHERE a.id = agency_id AND a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'));

-- 6. MESSAGES
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.can_access_booking(_booking_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookings b
    LEFT JOIN public.agencies a ON a.id = b.agency_id
    WHERE b.id = _booking_id AND (b.user_id = _user_id OR a.owner_id = _user_id)
  )
$$;

CREATE POLICY "Booking parties read messages" ON public.messages FOR SELECT TO authenticated
  USING (public.can_access_booking(booking_id, auth.uid()) OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Booking parties send messages" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND public.can_access_booking(booking_id, auth.uid()));
CREATE POLICY "Booking parties mark read" ON public.messages FOR UPDATE TO authenticated
  USING (public.can_access_booking(booking_id, auth.uid()))
  WITH CHECK (public.can_access_booking(booking_id, auth.uid()));

-- 7. NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notifications" ON public.notifications FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System inserts notifications for booking parties" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));

-- notify agency on new booking
CREATE OR REPLACE FUNCTION public.notify_agency_on_booking()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE owner uuid;
BEGIN
  IF NEW.agency_id IS NOT NULL THEN
    SELECT owner_id INTO owner FROM public.agencies WHERE id = NEW.agency_id;
    IF owner IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, body, link)
      VALUES (owner, 'طلب حجز جديد', 'لديك طلب حجز جديد رقم ' || COALESCE(NEW.booking_ref,''), '/agency/bookings');
    END IF;
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER bookings_notify_agency AFTER INSERT ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.notify_agency_on_booking();

-- notify customer on status change
CREATE OR REPLACE FUNCTION public.notify_customer_on_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.notifications (user_id, title, body, link)
    VALUES (NEW.user_id, 'تحديث حالة الحجز', 'أصبحت حالة حجزك ' || COALESCE(NEW.booking_ref,'') || ': ' || NEW.status, '/profile/bookings');
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER bookings_notify_customer AFTER UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.notify_customer_on_status();

-- 8. REVIEWS extension
ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS agency_id uuid REFERENCES public.agencies(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS trip_id uuid REFERENCES public.trips(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS rating_organization integer,
  ADD COLUMN IF NOT EXISTS rating_transport integer,
  ADD COLUMN IF NOT EXISTS rating_accommodation integer,
  ADD COLUMN IF NOT EXISTS rating_guide integer,
  ADD COLUMN IF NOT EXISTS rating_value integer,
  ADD COLUMN IF NOT EXISTS verified_trip boolean NOT NULL DEFAULT false;

ALTER TABLE public.reviews ALTER COLUMN destination_id DROP NOT NULL;