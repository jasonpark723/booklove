-- Migration: Character schema updates for multiple images and soft delete
-- Issue: #13 - Build character CRUD operations

-- Add images column (JSONB array for multiple images)
-- Structure: [{ url: string, is_primary: boolean, sort_order: number }]
ALTER TABLE characters ADD COLUMN images JSONB DEFAULT '[]';

-- Migrate existing profile_image_url data to images array
UPDATE characters
SET images = CASE
  WHEN profile_image_url IS NOT NULL AND profile_image_url != ''
  THEN jsonb_build_array(jsonb_build_object('url', profile_image_url, 'is_primary', true, 'sort_order', 0))
  ELSE '[]'::jsonb
END;

-- Drop the old profile_image_url column
ALTER TABLE characters DROP COLUMN profile_image_url;

-- Add soft delete columns
ALTER TABLE characters ADD COLUMN is_deleted BOOLEAN DEFAULT false;
ALTER TABLE characters ADD COLUMN deleted_at TIMESTAMPTZ;

-- Create index for filtering out deleted characters
CREATE INDEX idx_characters_is_deleted ON characters(is_deleted) WHERE is_deleted = false;

-- Update RLS policies to exclude deleted characters for non-admin users
-- First, drop existing select policy
DROP POLICY IF EXISTS "Anyone can view published characters" ON characters;

-- Recreate with is_deleted check
CREATE POLICY "Anyone can view published characters" ON characters
  FOR SELECT USING (
    is_published = true
    AND is_deleted = false
  );

-- Admin policy already allows all access, but let's ensure it includes deleted for management
DROP POLICY IF EXISTS "Admins can manage all characters" ON characters;

CREATE POLICY "Admins can manage all characters" ON characters
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );
