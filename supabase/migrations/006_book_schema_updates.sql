-- BookLove Schema Updates for Book CRUD
-- Migration: 006_book_schema_updates.sql

-- ============================================
-- TAGS TABLE (Master list of all tags)
-- ============================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast tag lookups
CREATE INDEX idx_tags_name ON tags(name);

-- ============================================
-- BOOKS TABLE MODIFICATIONS
-- ============================================

-- 1. Rename content_tags to tags
ALTER TABLE books RENAME COLUMN content_tags TO tags;

-- 2. Drop sub_genres column (no longer needed)
ALTER TABLE books DROP COLUMN sub_genres;

-- 3. Make amazon_affiliate_link nullable
ALTER TABLE books ALTER COLUMN amazon_affiliate_link DROP NOT NULL;

-- ============================================
-- GIN INDEX FOR TAGS ARRAY (for efficient overlap queries)
-- ============================================
CREATE INDEX idx_books_tags ON books USING GIN (tags);

-- ============================================
-- SEED STARTER TAGS
-- ============================================
INSERT INTO tags (name) VALUES
  -- Tropes
  ('enemies-to-lovers'),
  ('friends-to-lovers'),
  ('second-chance'),
  ('fake-dating'),
  ('forced-proximity'),
  ('slow-burn'),
  ('grumpy-sunshine'),
  ('forbidden-love'),
  ('age-gap'),
  ('workplace-romance'),
  ('small-town'),
  ('billionaire'),
  ('royal'),
  ('arranged-marriage'),
  -- Sub-categories
  ('paranormal'),
  ('historical'),
  ('contemporary'),
  ('urban-fantasy'),
  ('dystopian'),
  ('cozy'),
  ('dark'),
  ('suspense'),
  -- Themes
  ('found-family'),
  ('healing'),
  ('redemption'),
  ('adventure'),
  ('steamy'),
  ('clean'),
  ('HEA')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- RLS POLICIES FOR TAGS TABLE
-- ============================================
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Anyone can read tags
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT
  USING (true);

-- Only admins can insert/update/delete tags
CREATE POLICY "Admins can manage tags"
  ON tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );
