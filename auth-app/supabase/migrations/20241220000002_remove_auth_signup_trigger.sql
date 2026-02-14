-- Remove the auth signup trigger that's causing signup errors
-- Migration: 20241220000002_remove_auth_signup_trigger

-- Drop the trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS handle_new_user_signup();

-- Remove the function from the auth schema if it exists there
DROP FUNCTION IF EXISTS auth.handle_new_user_signup(); 