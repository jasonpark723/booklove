-- BookLove Indexes
-- Migration: 002_indexes.sql

-- ============================================
-- BOOKS INDEXES
-- ============================================
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_spice_level ON books(spice_level);
CREATE INDEX idx_books_published ON books(is_published);
CREATE INDEX idx_books_series ON books(series_name) WHERE series_name IS NOT NULL;

-- ============================================
-- CHARACTERS INDEXES
-- ============================================
CREATE INDEX idx_characters_book_id ON characters(book_id);
CREATE INDEX idx_characters_published ON characters(is_published);
CREATE INDEX idx_characters_gender ON characters(gender);

-- Composite index for common query pattern (published characters from published books)
CREATE INDEX idx_characters_published_book ON characters(book_id, is_published)
  WHERE is_published = true;

-- ============================================
-- USER MATCHES INDEXES
-- ============================================
CREATE INDEX idx_user_matches_user_id ON user_matches(user_id);
CREATE INDEX idx_user_matches_character_id ON user_matches(character_id);

-- ============================================
-- USER PASSES INDEXES
-- ============================================
CREATE INDEX idx_user_passes_user_id ON user_passes(user_id);
CREATE INDEX idx_user_passes_character_id ON user_passes(character_id);

-- ============================================
-- USER READ BOOKS INDEXES
-- ============================================
CREATE INDEX idx_user_read_books_user_id ON user_read_books(user_id);
CREATE INDEX idx_user_read_books_book_id ON user_read_books(book_id);
