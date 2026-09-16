CREATE TYPE public.post_status AS ENUM ('pending','approved','rejected');

CREATE TABLE public.community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  caption text NOT NULL,
  image_url text,
  wilaya text,
  status public.post_status NOT NULL DEFAULT 'pending',
  moderation_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.community_posts TO authenticated;
GRANT SELECT ON public.community_posts TO anon;
GRANT ALL ON public.community_posts TO service_role;

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Approved posts are public"
  ON public.community_posts FOR SELECT TO anon, authenticated
  USING (status = 'approved');

CREATE POLICY "Users read own posts"
  ON public.community_posts FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users create own posts"
  ON public.community_posts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Users update own posts"
  ON public.community_posts FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own posts"
  ON public.community_posts FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins moderate posts"
  ON public.community_posts FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();