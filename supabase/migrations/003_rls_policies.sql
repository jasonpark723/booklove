-- BookLove Row Level Security Policies
-- Migration: 003_rls_policies.sql

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_read_books ENABLE ROW LEVEL SECURITY;

-- ============================================
-- BOOKS POLICIES
-- ============================================

-- Anyone can read published books
CREATE POLICY "Public can read published books" ON books
  FOR SELECT
  USING (is_published = true);

-- Admins have full access to books
CREATE POLICY "Admins have full access to books" ON books
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- CHARACTERS POLICIES
-- ============================================

-- Anyone can read published characters from published books
CREATE POLICY "Public can read published characters" ON characters
  FOR SELECT
  USING (
    is_published = true AND
    EXISTS (
      SELECT 1 FROM books
      WHERE books.id = characters.book_id
      AND books.is_published = true
    )
  );

-- Admins have full access to characters
CREATE POLICY "Admins have full access to characters" ON characters
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- ============================================
-- USER PROFILES POLICIES
-- ============================================

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (except is_admin)
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Profile created on signup via trigger (allow insert for own id)
CREATE POLICY "Enable insert for authenticated users" ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can read all profiles" ON user_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles admin_check
      WHERE admin_check.id = auth.uid() AND admin_check.is_admin = true
    )
  );

-- ============================================
-- USER MATCHES POLICIES
-- ============================================

-- Users can manage their own matches
CREATE POLICY "Users manage own matches" ON user_matches
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- USER PASSES POLICIES
-- ============================================

-- Users can manage their own passes
CREATE POLICY "Users manage own passes" ON user_passes
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- USER READ BOOKS POLICIES
-- ============================================

-- Users can manage their own read books
CREATE POLICY "Users manage own read books" ON user_read_books
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
