-- NovelStack — migration 001: Q1-Q4 direction decisions
-- Run in the Supabase SQL editor AFTER schema.sql + seed.sql.

-- ============================================================
-- Q1 — Mature content + age-gating (date of birth at signup)
-- ============================================================
alter table public.users add column if not exists date_of_birth date;

-- Is the signed-in user 18+? Used to gate is_mature content.
create or replace function public.is_adult()
returns boolean language sql stable as $$
  select coalesce(
    (select date_of_birth is not null
            and date_of_birth <= (current_date - interval '18 years')
     from public.users where id = auth.uid()),
    false
  );
$$;

-- ============================================================
-- Q2 — Content moderation
-- ============================================================
create type report_target as enum ('story', 'chapter', 'comment', 'user');
create type report_reason as enum (
  'csam', 'harassment', 'hate', 'graphic_abuse',
  'spam', 'copyright', 'self_harm', 'other'
);
create type report_status as enum ('open', 'reviewing', 'actioned', 'dismissed');

create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.users(id) on delete set null,
  target_type report_target not null,
  target_id   uuid not null,
  reason      report_reason not null,
  detail      text,
  status      report_status not null default 'open',
  created_at  timestamptz not null default now()
);
create index idx_reports_status on public.reports(status, created_at desc);

create table public.blocks (
  blocker_id uuid not null references public.users(id) on delete cascade,
  blocked_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id)
);

-- Takedown: soft-removal flag, plus an admin flag for the review queue.
alter table public.stories add column if not exists is_removed boolean not null default false;
alter table public.users   add column if not exists is_admin   boolean not null default false;

-- ============================================================
-- Q3 — Interest tracking (powers the home feed ranking)
-- ============================================================
create table public.reading_events (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  story_id   uuid references public.stories(id) on delete cascade,
  genre      story_genre,
  event      text not null,            -- 'read' | 'like' | 'follow_author'
  created_at timestamptz not null default now()
);
create index idx_reading_events_user on public.reading_events(user_id, created_at desc);

-- ============================================================
-- RLS for the new tables
-- ============================================================
alter table public.reports        enable row level security;
alter table public.blocks         enable row level security;
alter table public.reading_events enable row level security;

create policy "reports insert own" on public.reports
  for insert with check (reporter_id = auth.uid());
create policy "reports admin read" on public.reports
  for select using (exists (select 1 from public.users u where u.id = auth.uid() and u.is_admin));
create policy "reports admin update" on public.reports
  for update using (exists (select 1 from public.users u where u.id = auth.uid() and u.is_admin));

create policy "blocks rw" on public.blocks
  for all using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());

create policy "reading_events own" on public.reading_events
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ============================================================
-- Story visibility — exclude removed stories from public reads
-- ============================================================
drop policy if exists "stories public read" on public.stories;
create policy "stories public read" on public.stories for select using (
  (status <> 'draft' and not is_removed) or author_id = auth.uid()
);

-- ============================================================
-- New-user trigger — also capture date_of_birth from signup metadata
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, username, display_name, date_of_birth)
  values (
    new.id,
    'user_' || substr(new.id::text, 1, 8),
    coalesce(new.raw_user_meta_data->>'display_name', 'New reader'),
    (new.raw_user_meta_data->>'date_of_birth')::date
  );
  return new;
end;
$$;
