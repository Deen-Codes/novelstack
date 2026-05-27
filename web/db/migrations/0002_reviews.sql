-- Reviews — one star rating + body per (reader, story). Upserted from the
-- mobile review form. Cascades with stories and users so deleting either
-- cleans these up automatically.
CREATE TABLE IF NOT EXISTS reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id    uuid NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
  rating      integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body        text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- One review per reader per story. POST upserts on this constraint.
CREATE UNIQUE INDEX IF NOT EXISTS reviews_story_user_idx ON reviews (story_id, user_id);
