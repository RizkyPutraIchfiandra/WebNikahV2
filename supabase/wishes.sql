-- Guestbook table for RSVP + wishes. Run once in Supabase: SQL Editor > New query > Run.
-- The anon key ships in the public bundle, so RLS only allows reading and inserting.
-- Nobody can update or delete rows with the anon key; moderate from the dashboard.

create table if not exists public.wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 80),
  attendance text not null check (attendance in ('hadir', 'tidak-hadir')),
  guests smallint not null default 0 check (guests between 0 and 5),
  message text not null check (char_length(trim(message)) between 1 and 500),
  created_at timestamptz not null default now()
);

create index if not exists wishes_created_at_idx on public.wishes (created_at desc);

-- Explicit grants, so the table works even when "Automatically expose new tables" is off.
grant select, insert on public.wishes to anon, authenticated;

alter table public.wishes enable row level security;

drop policy if exists "wishes are public" on public.wishes;
create policy "wishes are public" on public.wishes
  for select to anon, authenticated using (true);

drop policy if exists "guests can add wishes" on public.wishes;
create policy "guests can add wishes" on public.wishes
  for insert to anon, authenticated with check (true);
