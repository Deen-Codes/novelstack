-- Migration 003 — genre taxonomy expansion + seed-account flag
-- ------------------------------------------------------------
-- Run in the Supabase SQL editor after migration 002.
--
-- 1) Expands the story_genre enum to the full NovelStack taxonomy
--    (researched against Wattpad / Royal Road / Inkitt / Webnovel).
-- 2) Adds an internal-only users.is_seed flag. Seed/house accounts are
--    presented as ordinary writers; their ad + tip earnings settle to the
--    company, not to a payout-eligible author balance. The payout system,
--    when built, MUST check this flag. The flag is never exposed in the UI.

-- ---- 1. Genre taxonomy ----
-- ADD VALUE IF NOT EXISTS is idempotent. Existing values (romance, fantasy,
-- scifi, thriller, mystery, drama, horror, poetry, fanfiction, other) stay.
alter type story_genre add value if not exists 'crime';
alter type story_genre add value if not exists 'paranormal';
alter type story_genre add value if not exists 'werewolf';
alter type story_genre add value if not exists 'vampire';
alter type story_genre add value if not exists 'young_adult';
alter type story_genre add value if not exists 'teen_fiction';
alter type story_genre add value if not exists 'contemporary';
alter type story_genre add value if not exists 'historical';
alter type story_genre add value if not exists 'adventure';
alter type story_genre add value if not exists 'action';
alter type story_genre add value if not exists 'dystopian';
alter type story_genre add value if not exists 'lgbtq';
alter type story_genre add value if not exists 'humor';
alter type story_genre add value if not exists 'short_story';
alter type story_genre add value if not exists 'nonfiction';

-- ---- 2. Seed-account flag ----
alter table public.users add column if not exists is_seed boolean not null default false;

-- Mark the existing seed authors: catalog seed batch 1 (id prefix 5eed…)
-- plus the original three demo writers from seed.sql.
update public.users set is_seed = true
where id::text like '5eed%'
   or id in (
     '11111111-1111-1111-1111-111111111111',
     '22222222-2222-2222-2222-222222222222',
     '33333333-3333-3333-3333-333333333333'
   );
