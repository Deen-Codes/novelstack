-- 0003 — Monthly subscription pool audit trail.
--
-- Adds `payout_periods` table (one row per month-run) and links each
-- `payouts` row back to it via `payout_period_id`. Also tracks the
-- subscriber-minutes basis on the writer's per-month row so the writer can
-- audit the calculation themselves.
--
-- See PAYOUTS_DESIGN.md for the full system spec and the pool math.
--
-- Safe to apply against existing data: payout_period_id and
-- subscriber_minutes default to NULL/0 on existing rows; no destructive
-- changes.

BEGIN;

CREATE TABLE IF NOT EXISTS payout_periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_month date NOT NULL UNIQUE,
  gross_revenue_cents bigint NOT NULL,
  apple_fees_cents bigint NOT NULL,
  apple_net_cents bigint NOT NULL,
  platform_cut_cents bigint NOT NULL,
  distributable_cents bigint NOT NULL,
  total_subscriber_minutes bigint NOT NULL,
  natural_rate_cents_per_min numeric(14, 6) NOT NULL,
  cap_cents_per_min integer NOT NULL,
  per_minute_rate_cents_per_min numeric(14, 6) NOT NULL,
  total_paid_cents bigint NOT NULL,
  surplus_cents bigint NOT NULL,
  ad_unlocks_confirmed_cents bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'calculated',
  calculated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payouts
  ADD COLUMN IF NOT EXISTS payout_period_id uuid REFERENCES payout_periods(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS subscriber_minutes bigint NOT NULL DEFAULT 0;

COMMIT;
