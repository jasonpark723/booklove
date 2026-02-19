-- Fix infinite recursion in user_profiles RLS policy
-- The admin check was querying user_profiles from within user_profiles policy

-- Drop the problematic policy
DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;

-- Create a security definer function to check admin status
-- This avoids RLS recursion by using SECURITY DEFINER
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM user_profiles WHERE id = auth.uid()),
    false
  )
$$;

-- Recreate admin policy using the function
CREATE POLICY "Admins can read all profiles" ON user_profiles
  FOR SELECT
  USING (is_admin());

-- Also update books and characters admin policies to use the function
DROP POLICY IF EXISTS "Admins have full access to books" ON books;
CREATE POLICY "Admins have full access to books" ON books
  FOR ALL
  USING (is_admin());

DROP POLICY IF EXISTS "Admins have full access to characters" ON characters;
CREATE POLICY "Admins have full access to characters" ON characters
  FOR ALL
  USING (is_admin());
