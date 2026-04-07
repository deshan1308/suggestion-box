-- Run once in Supabase SQL Editor if your table was created with tracking_code.
-- The app no longer sends this column on insert.

alter table public.suggestions
  drop column if exists tracking_code;
