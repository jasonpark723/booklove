-- Migration: Storage bucket and policies for book covers
-- Note: The bucket 'book-covers' must be created via Supabase Dashboard or CLI first
-- Run: supabase storage create book-covers --public

-- Storage policies for book-covers bucket
-- These will only work after the bucket is created

-- Allow anyone to view book covers (public read)
CREATE POLICY "Public can view book covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'book-covers');

-- Allow authenticated admins to upload book covers
CREATE POLICY "Admins can upload book covers"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'book-covers'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Allow authenticated admins to update book covers
CREATE POLICY "Admins can update book covers"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'book-covers'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Allow authenticated admins to delete book covers
CREATE POLICY "Admins can delete book covers"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'book-covers'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);
