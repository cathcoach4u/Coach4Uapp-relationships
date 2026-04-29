-- Creates the users table used for membership gating.
-- Run against: https://eekefsuaefgpqmjdyniy.supabase.co

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  membership_status TEXT NOT NULL DEFAULT 'inactive'
);

-- To add a new active member:
-- INSERT INTO users (id, email, membership_status)
-- SELECT id, email, 'active'
-- FROM auth.users
-- WHERE LOWER(email) = LOWER('email@here.com');
