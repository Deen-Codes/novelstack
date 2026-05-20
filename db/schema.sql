-- NovelStack — Postgres / Supabase schema
-- Run in the Supabase SQL editor, or via: supabase db push
-- Canonical model: see ../../monetization.md

-- ============================================================
-- ENUMS
-- ============================================================
create type user_role     as enum ('reader', 'writer', 'both', 'admin');
create type story_genre   as enum ('romance','fantasy','scifi','thriller','mystery','drama','horror','poetry','fanfiction','other');
create type story_status  as enum ('draft','ongoing','complete','paused');
create type sub_status    as enum ('active','canceled','past_due');
create type payout_status as enum ('pending','processing','paid','failed');

-- ============================================================
-- USERS  (profile layer on top of auth.users)
-- ============================================================
create table public.users (
  id                 uuid primary key references auth.users(id) on delete cascade,
  username           text unique not null,
  display_name       text not null,
  bio                text,
  avatar_url         text,
  role               user_role not null default 'reader',
  is_verified        boolean not null default false,
  stripe_customer_id text,            -- reader: NovelStack+ subscription
  stripe_connect_id  text,            -- writer: payouts via Connect Express
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ============================================================
-- STORIES
-- ============================================================
create table public.stories (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid not null references public.users(id) on delete cascade,
  title           text not null,
  slug            text unique not null,
  description     text,
  cover_url       text,
  cover_color     text default '#D85A30',  -- fallback solid cover
  genre           story_genre not null default 'other',
  tags            text[] default '{}',
  status          story_status not null default 'draft',
  is_mature       boolean not null default false,
  total_reads     integer not null default 0,
  total_followers integer not null default 0,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- CHAPTERS
-- ============================================================
create table public.chapters (
  id            uuid primary key default gen_random_uuid(),
  story_id      uuid not null references public.stories(id) on delete cascade,
  number        integer not null,
  title         text not null,
  excerpt       text not null default '',     -- first ~200 words — always public, powers SEO preview
  word_count    integer not null default 0,
  page_count    integer not null default 0,   -- word_count / 250 — unit for subscription pool payout
  is_free       boolean not null default false, -- first 3 chapters: true
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (story_id, number)
);

-- Full chapter body, split out so the chapters row (title + excerpt + metadata)
-- can be fully public for SEO while the body itself stays gated.
create table public.chapter_content (
  chapter_id uuid primary key references public.chapters(id) on delete cascade,
  body       text not null default ''   -- full markdown
);

-- ============================================================
-- SUBSCRIPTIONS  — NovelStack+ ($6.99/mo all-access, reader -> platform)
-- ============================================================
create table public.subscriptions (
  id                     uuid primary key default gen_random_uuid(),
  reader_id              uuid not null references public.users(id) on delete cascade,
  stripe_subscription_id text,
  status                 sub_status not null default 'active',
  price_cents            integer not null default 699,
  started_at             timestamptz not null default now(),
  ends_at                timestamptz
);

-- ============================================================
-- AD UNLOCKS  — one row per rewarded ad a free reader watched
-- ============================================================
create table public.ad_unlocks (
  id                  uuid primary key default gen_random_uuid(),
  reader_id           uuid not null references public.users(id) on delete cascade,
  chapter_id          uuid not null references public.chapters(id) on delete cascade,
  ad_revenue_cents    numeric(10,4) not null default 0,  -- net revenue from this view
  author_payout_cents numeric(10,4) not null default 0,  -- 70% of ad_revenue_cents
  created_at          timestamptz not null default now()
);

-- ============================================================
-- TIPS  — optional reader -> writer gifts (70/30 split, min $3)
-- ============================================================
create table public.tips (
  id           uuid primary key default gen_random_uuid(),
  sender_id    uuid not null references public.users(id) on delete cascade,
  recipient_id uuid not null references public.users(id) on delete cascade,
  story_id     uuid references public.stories(id) on delete set null,
  amount_cents integer not null check (amount_cents >= 300),
  message      text,
  created_at   timestamptz not null default now()
);

-- ============================================================
-- READS  — reading progress; subscriber reads drive the pool split
-- ============================================================
create table public.reads (
  id           uuid primary key default gen_random_uuid(),
  reader_id    uuid not null references public.users(id) on delete cascade,
  chapter_id   uuid not null references public.chapters(id) on delete cascade,
  progress_pct integer not null default 0,
  is_subscriber boolean not null default false,  -- snapshot: was reader a subscriber at read time
  completed_at timestamptz,
  created_at   timestamptz not null default now(),
  unique (reader_id, chapter_id)
);

-- ============================================================
-- SOCIAL
-- ============================================================
create table public.follows (
  follower_id uuid not null references public.users(id) on delete cascade,
  author_id   uuid not null references public.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (follower_id, author_id)
);

create table public.bookmarks (
  reader_id  uuid not null references public.users(id) on delete cascade,
  story_id   uuid not null references public.stories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reader_id, story_id)
);

create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.users(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  parent_id  uuid references public.comments(id) on delete cascade,
  content    text not null,
  created_at timestamptz not null default now()
);

create table public.likes (
  user_id    uuid not null references public.users(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, chapter_id)
);

-- ============================================================
-- PAYOUTS  — monthly writer earnings (subscription pool + ads + tips)
-- ============================================================
create table public.payouts (
  id               uuid primary key default gen_random_uuid(),
  writer_id        uuid not null references public.users(id) on delete cascade,
  period_month     date not null,                 -- first day of the month
  subscription_cents integer not null default 0,
  ad_cents         integer not null default 0,
  tip_cents        integer not null default 0,
  total_cents      integer not null default 0,
  status           payout_status not null default 'pending',
  stripe_payout_id text,
  created_at       timestamptz not null default now(),
  unique (writer_id, period_month)
);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_stories_genre_published    on public.stories(genre, published_at desc);
create index idx_stories_author             on public.stories(author_id);
create index idx_chapters_story_number      on public.chapters(story_id, number);
create index idx_reads_reader_chapter       on public.reads(reader_id, chapter_id);
create index idx_reads_subscriber_period    on public.reads(is_subscriber, created_at);
create index idx_ad_unlocks_chapter_period  on public.ad_unlocks(chapter_id, created_at);
create index idx_subscriptions_reader_active on public.subscriptions(reader_id) where status = 'active';

-- ============================================================
-- NEW USER TRIGGER  — create public.users row when auth.users gets one
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, username, display_name)
  values (
    new.id,
    'user_' || substr(new.id::text, 1, 8),
    coalesce(new.raw_user_meta_data->>'display_name', 'New reader')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.users         enable row level security;
alter table public.stories       enable row level security;
alter table public.chapters      enable row level security;
alter table public.chapter_content enable row level security;
alter table public.subscriptions enable row level security;
alter table public.ad_unlocks    enable row level security;
alter table public.tips          enable row level security;
alter table public.reads         enable row level security;
alter table public.follows       enable row level security;
alter table public.bookmarks     enable row level security;
alter table public.comments      enable row level security;
alter table public.likes         enable row level security;
alter table public.payouts       enable row level security;

-- Users: public read, self write
create policy "users public read"  on public.users for select using (true);
create policy "users self update"  on public.users for update using (auth.uid() = id);

-- Stories: anyone reads published; author manages own
create policy "stories public read" on public.stories for select using (status <> 'draft' or author_id = auth.uid());
create policy "stories author write" on public.stories for all using (author_id = auth.uid()) with check (author_id = auth.uid());

-- Chapters: the row (title, excerpt, metadata) is fully public — powers SEO previews.
create policy "chapters public read" on public.chapters for select using (true);
create policy "chapters author write" on public.chapters for all using (
  exists (select 1 from public.stories s where s.id = story_id and s.author_id = auth.uid())
);

-- Chapter body: gated. Readable if the chapter is free, the reader has an active
-- subscription, an ad_unlock exists, or the reader is the author.
create policy "chapter_content gated read" on public.chapter_content for select using (
  exists (select 1 from public.chapters c where c.id = chapter_id and c.is_free)
  or exists (
    select 1 from public.chapters c
    join public.stories s on s.id = c.story_id
    where c.id = chapter_id and s.author_id = auth.uid()
  )
  or exists (select 1 from public.subscriptions sub where sub.reader_id = auth.uid() and sub.status = 'active')
  or exists (select 1 from public.ad_unlocks au where au.chapter_id = chapter_id and au.reader_id = auth.uid())
);
create policy "chapter_content author write" on public.chapter_content for all using (
  exists (
    select 1 from public.chapters c
    join public.stories s on s.id = c.story_id
    where c.id = chapter_id and s.author_id = auth.uid()
  )
);

-- Subscriptions / ad_unlocks / reads / payouts: owner read
create policy "subs self read"     on public.subscriptions for select using (reader_id = auth.uid());
create policy "ad_unlocks self"    on public.ad_unlocks for select using (reader_id = auth.uid());
create policy "ad_unlocks self insert" on public.ad_unlocks for insert with check (reader_id = auth.uid());
create policy "reads self"         on public.reads for all using (reader_id = auth.uid()) with check (reader_id = auth.uid());
create policy "payouts self read"  on public.payouts for select using (writer_id = auth.uid());

-- Tips: sender and recipient can read; sender creates
create policy "tips read"   on public.tips for select using (sender_id = auth.uid() or recipient_id = auth.uid());
create policy "tips create" on public.tips for insert with check (sender_id = auth.uid());

-- Social: public read, owner write
create policy "follows read"    on public.follows for select using (true);
create policy "follows write"   on public.follows for all using (follower_id = auth.uid()) with check (follower_id = auth.uid());
create policy "bookmarks rw"    on public.bookmarks for all using (reader_id = auth.uid()) with check (reader_id = auth.uid());
create policy "comments read"   on public.comments for select using (true);
create policy "comments write"  on public.comments for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "likes read"      on public.likes for select using (true);
create policy "likes write"     on public.likes for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- NOTE: ad_unlocks, subscriptions and payouts are written by service-role
-- Edge Functions only (Stripe webhooks, ad callbacks, monthly payout cron),
-- which bypass RLS. No public insert policies on those tables by design.
