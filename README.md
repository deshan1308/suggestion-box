# Anonymous HR Suggestion Box

Full-stack anonymous HR suggestion box built with Next.js App Router, Supabase (PostgreSQL), Tailwind CSS, and ready for Vercel deployment.

## Features

- Public anonymous suggestion form at `/`
- Admin panel at `/admin` with simple password protection
- Filter by status
- Latest-first sorting by submission date
- Inline status updates (`New`, `Reviewed`, `Actioned`)
- Loading states, empty states, error handling, and toast notifications
- No IP or hidden tracking fields stored

## Project Structure

- `app/page.tsx`: public suggestion form
- `app/admin/page.tsx`: admin panel UI
- `app/api/suggestions/route.ts`: POST + GET suggestions
- `app/api/suggestions/[id]/route.ts`: PATCH status updates
- `lib/supabase.ts`: Supabase server client
- `supabase/schema.sql`: database schema

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run:

```sql
-- from supabase/schema.sql
create extension if not exists "pgcrypto";

create table if not exists public.suggestions (
  id uuid primary key default gen_random_uuid(),
  suggestion text not null,
  status text not null default 'New',
  created_at timestamptz not null default now()
);
```

3. Ensure your API key has access to insert/select/update on `suggestions` (configure RLS policies if RLS is enabled).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
ADMIN_PASSWORD=your_admin_panel_password
```

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push your repository to GitHub/GitLab/Bitbucket.
2. Import project into Vercel.
3. Add the environment variables from `.env.example` in Vercel Project Settings.
4. Deploy.

After deployment:
- Public users submit at `/`
- HR admins access `/admin` using `ADMIN_PASSWORD`
