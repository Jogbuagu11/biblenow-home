-- Ensure table exists so local environments without it don't fail
CREATE TABLE IF NOT EXISTS auth_signups (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  email text,
  birthdate date,
  gender text,
  signup_time timestamptz DEFAULT now(),
  ip_address text,
  user_agent text,
  device_type text,
  country text,
  referral_source text,
  created_at timestamptz DEFAULT now()
);

-- Add birthdate/gender columns idempotently (safe if table already had them)
ALTER TABLE auth_signups
  ADD COLUMN IF NOT EXISTS birthdate DATE;

ALTER TABLE auth_signups
  ADD COLUMN IF NOT EXISTS gender TEXT;

-- Document columns
COMMENT ON COLUMN auth_signups.birthdate IS 'User birth date stored in YYYY-MM-DD format';
COMMENT ON COLUMN auth_signups.gender IS 'User gender (e.g., male, female, other)';

-- Indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_auth_signups_birthdate ON auth_signups(birthdate);
CREATE INDEX IF NOT EXISTS idx_auth_signups_gender ON auth_signups(gender); 