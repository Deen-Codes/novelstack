// NovelStack — Stripe Connect (author payouts).
//
// Writers are paid via Stripe Connect Express: each writer connects (or
// creates) a Stripe account through Stripe-hosted onboarding, and NovelStack
// transfers their earnings to it.
//
// The Stripe client is null until `STRIPE_SECRET_KEY` is set — which needs
// NovelStack's own Stripe platform account to be live and verified (a
// registered business: LLC/EIN + bank). Every caller degrades gracefully so
// the rest of the app — including the read-only earnings dashboard — works
// regardless. Once the key is set, onboarding and payouts light up with no
// further code changes.
import 'server-only';
import Stripe from 'stripe';

const KEY = process.env.STRIPE_SECRET_KEY ?? '';
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://novelstack.app';

// The Stripe client, or null when no secret key is configured.
export const stripe: Stripe | null = KEY ? new Stripe(KEY) : null;

export function stripeConfigured(): boolean {
  return stripe !== null;
}

export type ConnectStatus = {
  // A Stripe Connect account exists for this writer.
  connected: boolean;
  // Onboarding is complete and the writer can receive payouts.
  payoutsEnabled: boolean;
  // The writer submitted their details (may still be under review).
  detailsSubmitted: boolean;
  // An account exists but onboarding isn't finished — resume it.
  needsOnboarding: boolean;
};

const DISABLED: ConnectStatus = {
  connected: false,
  payoutsEnabled: false,
  detailsSubmitted: false,
  needsOnboarding: false,
};

// Creates a Connect Express account for a writer. Caller stores the returned
// id on `users.stripe_connect_id`. If the NovelStack Stripe account hasn't
// yet activated Connect (one-time enrollment at dashboard.stripe.com/connect),
// Stripe returns a 400 with a recognisable message — we catch it and surface
// a writer-friendly explanation rather than a raw Stripe error string.
export async function createConnectAccount(email: string): Promise<string> {
  if (!stripe) throw new Error('Payouts are not available yet.');
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: { transfers: { requested: true } },
      business_profile: {
        product_description: 'Royalties earned from stories published on NovelStack.',
      },
      metadata: { platform: 'novelstack' },
    });
    return account.id;
  } catch (err) {
    const msg = err instanceof Error ? err.message : '';
    if (
      msg.includes('signed up for Connect') ||
      msg.includes('signed up for connect') ||
      msg.includes('dashboard.stripe.com/connect')
    ) {
      throw new Error(
        "Payouts aren't switched on yet — NovelStack is finishing Stripe Connect setup. Please try again soon.",
      );
    }
    throw err;
  }
}

// A Stripe-hosted onboarding link the writer opens to finish (or resume)
// setting up payouts. Links are single-use and short-lived.
export async function createOnboardingLink(accountId: string): Promise<string> {
  if (!stripe) throw new Error('Payouts are not available yet.');
  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: `${SITE}/payouts/refresh`,
    return_url: `${SITE}/payouts/done`,
    type: 'account_onboarding',
  });
  return link.url;
}

// A login link into the writer's Stripe Express dashboard (to view payouts,
// update their bank details). Only valid once onboarding is complete.
export async function createDashboardLink(accountId: string): Promise<string | null> {
  if (!stripe) return null;
  try {
    const link = await stripe.accounts.createLoginLink(accountId);
    return link.url;
  } catch {
    return null;
  }
}

// Triggers an actual money transfer from the NovelStack platform balance to
// the writer's connected Stripe account. amountCents is the writer share
// (already net of platform cuts). Returns the Stripe transfer id which the
// caller should stamp onto the payouts.stripe_payout_id column.
//
// Throws if Stripe isn't configured, if the connected account doesn't have
// payouts enabled, or if Stripe rejects the transfer (e.g. insufficient
// platform balance, account capability missing).
export async function createTransfer(
  accountId: string,
  amountCents: number,
  metadata?: Record<string, string>,
): Promise<string> {
  if (!stripe) throw new Error('Payouts are not available yet.');
  if (!Number.isFinite(amountCents) || amountCents <= 0) {
    throw new Error('Transfer amount must be a positive number of cents.');
  }
  const transfer = await stripe.transfers.create({
    amount: Math.round(amountCents),
    currency: 'usd',
    destination: accountId,
    description: 'NovelStack writer earnings payout',
    metadata: { platform: 'novelstack', ...(metadata ?? {}) },
  });
  return transfer.id;
}

// The current onboarding / payout-eligibility state of a Connect account.
export async function getConnectStatus(accountId: string | null): Promise<ConnectStatus> {
  if (!accountId || !stripe) return DISABLED;
  try {
    const acct = await stripe.accounts.retrieve(accountId);
    const payoutsEnabled = acct.payouts_enabled === true;
    return {
      connected: true,
      payoutsEnabled,
      detailsSubmitted: acct.details_submitted === true,
      needsOnboarding: !payoutsEnabled,
    };
  } catch {
    return DISABLED;
  }
}
