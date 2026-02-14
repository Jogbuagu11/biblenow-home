-- Create trigger function to automatically insert signup data with birthdate and gender
-- Migration: 20241220000001_create_auth_signup_trigger

-- Function to handle new user signups and insert data into auth_signups table
CREATE OR REPLACE FUNCTION handle_new_user_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert signup data into auth_signups table
  INSERT INTO auth_signups (
    user_id,
    email,
    birthdate,
    gender,
    signup_time,
    ip_address,
    user_agent,
    device_type,
    country,
    referral_source
  ) VALUES (
    NEW.id,
    NEW.email,
    -- Extract birthdate from user metadata if available
    CASE 
      WHEN NEW.raw_user_meta_data->>'birthdate' IS NOT NULL 
      THEN (NEW.raw_user_meta_data->>'birthdate')::DATE
      ELSE NULL
    END,
    -- Extract gender from user metadata if available
    NEW.raw_user_meta_data->>'gender',
    NOW(),
    -- These fields would need to be populated by your application logic
    NULL, -- ip_address
    NULL, -- user_agent
    NULL, -- device_type
    NULL, -- country
    NULL  -- referral_source
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_signup();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON auth_signups TO authenticated; 