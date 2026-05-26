-- 0001_blocks_iap_pending — three additive changes for the App Store build:
--   1. blocks table — user-to-user blocking (mutual hide).
--   2. ad_unlocks: status + nullable author_payout_cents — pending-payout model.
--   3. tips: transactionId — unique IAP transaction id for tip credits.
--
-- All changes are additive and safe to run against existing data.

CREATE TABLE "blocks" (
	"blocker_id" uuid NOT NULL,
	"blocked_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blocks_blocker_id_blocked_id_pk" PRIMARY KEY("blocker_id","blocked_id")
);
--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_blocker_id_users_id_fk" FOREIGN KEY ("blocker_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_blocked_id_users_id_fk" FOREIGN KEY ("blocked_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- Ad unlocks: add status + make author_payout_cents nullable.
ALTER TABLE "ad_unlocks" ALTER COLUMN "author_payout_cents" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ad_unlocks" ALTER COLUMN "author_payout_cents" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "ad_unlocks" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
-- Existing rows came in pre-pending-model with a hardcoded zero payout. Treat
-- them as confirmed so the historical earnings figure stays exactly the same.
UPDATE "ad_unlocks" SET "status" = 'confirmed' WHERE "status" = 'pending' AND "created_at" < now();--> statement-breakpoint

-- Tips: IAP transaction id (unique) for credit-once semantics.
ALTER TABLE "tips" ADD COLUMN "transaction_id" text;--> statement-breakpoint
ALTER TABLE "tips" ADD CONSTRAINT "tips_transaction_id_unique" UNIQUE("transaction_id");
