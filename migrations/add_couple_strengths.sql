-- Creates the couple_strengths table in the development Supabase project
-- Project URL: https://eekefsuaefgpqmjdyniy.supabase.co
-- Run in Supabase SQL Editor before using the Strengths Profile feature.

CREATE TABLE IF NOT EXISTS couple_strengths (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_a_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  user_b_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  name_a        TEXT,
  name_b        TEXT,
  couple_label  TEXT,
  strengths_a   JSONB NOT NULL DEFAULT '[]',
  strengths_b   JSONB NOT NULL DEFAULT '[]',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE couple_strengths ENABLE ROW LEVEL SECURITY;

-- Partners can read their own couple profile
CREATE POLICY "Partners can read couple strengths"
  ON couple_strengths FOR SELECT
  USING (user_a_id = auth.uid() OR user_b_id = auth.uid());

-- Authenticated users (admin) can insert, update, delete
CREATE POLICY "Authenticated can manage couple strengths"
  ON couple_strengths FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
