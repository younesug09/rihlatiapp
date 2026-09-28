CREATE POLICY "Trip media owners can read" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'trip-media' AND (
    (storage.foldername(name))[1] IN (SELECT a.id::text FROM public.agencies a WHERE a.owner_id = auth.uid())
    OR public.has_role(auth.uid(),'admin')
  )
);
CREATE POLICY "Trip media owners can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'trip-media' AND (storage.foldername(name))[1] IN (SELECT a.id::text FROM public.agencies a WHERE a.owner_id = auth.uid())
);
CREATE POLICY "Trip media owners can update" ON storage.objects FOR UPDATE TO authenticated USING (
  bucket_id = 'trip-media' AND ((storage.foldername(name))[1] IN (SELECT a.id::text FROM public.agencies a WHERE a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'))
) WITH CHECK (
  bucket_id = 'trip-media' AND ((storage.foldername(name))[1] IN (SELECT a.id::text FROM public.agencies a WHERE a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'))
);
CREATE POLICY "Trip media owners can delete" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'trip-media' AND ((storage.foldername(name))[1] IN (SELECT a.id::text FROM public.agencies a WHERE a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'))
);

CREATE POLICY "Agency document owners and admins can read" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'agency-documents' AND (
    (storage.foldername(name))[1] IN (SELECT a.id::text FROM public.agencies a WHERE a.owner_id = auth.uid())
    OR public.has_role(auth.uid(),'admin')
  )
);
CREATE POLICY "Agency document owners can upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'agency-documents' AND (storage.foldername(name))[1] IN (SELECT a.id::text FROM public.agencies a WHERE a.owner_id = auth.uid())
);
CREATE POLICY "Agency document owners and admins can delete" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'agency-documents' AND ((storage.foldername(name))[1] IN (SELECT a.id::text FROM public.agencies a WHERE a.owner_id = auth.uid()) OR public.has_role(auth.uid(),'admin'))
);