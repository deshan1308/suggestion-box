create extension if not exists "pgcrypto";

create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  suggestion text not null,
  status text not null default 'New',
  created_at timestamptz not null default now()
);
