-- Migration: Storage bucket and policies for character images
-- Note: The bucket 'character-images' must be created via Supabase Dashboard or CLI first
-- Run: supabase storage create character-images --public

-- Storage policies for character-images bucket
-- These will only work after the bucket is created

-- Allow anyone to view images (public read)
CREATE POLICY "Public can view character images"
ON storage.objects FOR SELECT
USING (bucket_id = 'character-images');

-- Allow authenticated admins to upload images
CREATE POLICY "Admins can upload character images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'character-images'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Allow authenticated admins to update images
CREATE POLICY "Admins can update character images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'character-images'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);

-- Allow authenticated admins to delete images
CREATE POLICY "Admins can delete character images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'character-images'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND user_profiles.is_admin = true
  )
);
