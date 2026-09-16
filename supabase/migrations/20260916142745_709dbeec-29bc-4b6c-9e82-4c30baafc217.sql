CREATE POLICY "Community read for signed in"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'community');

CREATE POLICY "Community upload own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'community' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Community update own folder"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'community' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'community' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Community delete own folder"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'community' AND (storage.foldername(name))[1] = auth.uid()::text);