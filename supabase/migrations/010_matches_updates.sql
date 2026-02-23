-- Migration: 010_matches_updates.sql
-- Add opening_line to characters and is_read to user_matches for chat log feature

-- Add opening_line to characters table
ALTER TABLE characters ADD COLUMN IF NOT EXISTS opening_line VARCHAR(200) NULL;

COMMENT ON COLUMN characters.opening_line IS 'Character opening line shown in matches list preview';

-- Add is_read to user_matches table
ALTER TABLE user_matches ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN user_matches.is_read IS 'Whether the match has been viewed by the user';
