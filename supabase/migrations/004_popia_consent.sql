-- Migration 004: POPIA consent columns
-- Add consent tracking to profiles table (POPIA s11 compliance)
-- Apply in Supabase dashboard SQL editor: https://rdyeimdlnueqolptkpqx.supabase.co

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS consented_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS terms_version TEXT;

COMMENT ON COLUMN public.profiles.consented_at IS 'Timestamp when user accepted Terms of Use and Privacy Notice (POPIA s11 consent)';
COMMENT ON COLUMN public.profiles.terms_version IS 'Version string of terms accepted, e.g. v1-2026-04';
