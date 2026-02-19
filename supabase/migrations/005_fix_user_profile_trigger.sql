-- Fix user profile auto-creation trigger
-- Migration: 005_fix_user_profile_trigger.sql
--
-- Problem: The handle_new_user() trigger was blocked by RLS policies
-- when users are created via the Supabase dashboard (admin context).
--
-- Solution: Recreate the function with proper RLS bypass settings.

-- Drop the old function (trigger was already dropped during debugging)
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- Recreate the function with proper security settings
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id)
  VALUES (NEW.id)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permission to the function
GRANT EXECUTE ON FUNCTION handle_new_user() TO service_role;
GRANT EXECUTE ON FUNCTION handle_new_user() TO postgres;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
