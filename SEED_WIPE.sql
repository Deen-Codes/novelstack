-- NovelStack — wipe the seed catalogue
-- Run this in the Render Postgres console (psql or the dashboard SQL shell).
-- Real user data is NOT touched: only rows owned by accounts flagged
-- is_seed = true are removed. Cascading foreign keys handle the rest.
--
-- DO THIS FIRST: run the PREVIEW block to see what would be deleted.
-- DO THIS SECOND: only if the preview looks right, run the WIPE block.
-- DO THIS THIRD: confirm with the verify block.
--
-- This script is idempotent — running it twice on an already-wiped DB
-- is a no-op.

-- ============================================================
-- PREVIEW — read-only, run this first.
-- Tells you (a) how many seed users you have, (b) how many stories
-- they own, (c) how many chapters those stories have. If those
-- numbers look surprising, STOP and check with Deen.
-- ============================================================

SELECT
  (SELECT count(*) FROM users WHERE is_seed = true)                    AS seed_users,
  (SELECT count(*) FROM stories
     WHERE author_id IN (SELECT id FROM users WHERE is_seed = true))   AS seed_stories,
  (SELECT count(*) FROM chapters
     WHERE story_id IN (
       SELECT id FROM stories
         WHERE author_id IN (SELECT id FROM users WHERE is_seed = true)
     ))                                                                AS seed_chapters,
  (SELECT count(*) FROM users WHERE is_seed = false)                   AS real_users_kept,
  (SELECT count(*) FROM stories
     WHERE author_id IN (SELECT id FROM users WHERE is_seed = false))  AS real_stories_kept;

-- Also: list the seed users by display name so you can sanity-check
-- they're all bots and not anyone real.
SELECT id, username, display_name, email
FROM users
WHERE is_seed = true
ORDER BY display_name;


-- ============================================================
-- WIPE — destructive. Run only after the preview looks right.
-- Wrapped in a transaction — if anything fails, nothing is deleted.
-- ============================================================

BEGIN;

-- Delete the seed users. CASCADE on the foreign keys removes:
--   * their stories         (ON DELETE CASCADE on stories.author_id)
--   * those stories' chapters + chapter_content
--   * bookmarks / reads / follows / likes / reviews tied to those rows
--   * posts and post_comments by those users
--   * notifications referencing them
-- The schema is designed to fan-out cleanly so this single statement
-- is the whole job.
DELETE FROM users WHERE is_seed = true;

-- Optional belt-and-braces: if you have stories with NULL author_id
-- (orphans from a previous half-migration), they'd survive the cascade.
-- Sweep them too:
DELETE FROM stories WHERE author_id IS NULL;

COMMIT;


-- ============================================================
-- VERIFY — should all be zero.
-- ============================================================

SELECT
  (SELECT count(*) FROM users WHERE is_seed = true)                    AS seed_users_remaining,
  (SELECT count(*) FROM stories
     WHERE author_id IN (SELECT id FROM users WHERE is_seed = true))   AS seed_stories_remaining;

-- And confirm your real account survived:
SELECT id, username, display_name, email, is_seed
FROM users
WHERE email = 'YOUR_EMAIL_HERE';  -- replace before running
