'use server';

import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { users } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';
import {
  stripeConfigured,
  createConnectAccount,
  createOnboardingLink,
  createDashboardLink,
} from '@/lib/stripe';

// Begins (or resumes) Stripe Connect onboarding, then sends the writer to
// Stripe's hosted setup page.
export async function startPayoutSetup() {
  const user = await getSessionUser();
  if (!user || user.isSeed || !stripeConfigured()) redirect('/earnings');

  let accountId = user.stripeConnectId;
  if (!accountId) {
    accountId = await createConnectAccount(user.email);
    await db.update(users).set({ stripeConnectId: accountId }).where(eq(users.id, user.id));
  }
  const url = await createOnboardingLink(accountId);
  redirect(url);
}

// Opens the writer's Stripe Express dashboard (manage bank, view transfers).
export async function openStripeDashboard() {
  const user = await getSessionUser();
  if (!user || !user.stripeConnectId) redirect('/earnings');
  const url = await createDashboardLink(user.stripeConnectId);
  redirect(url ?? '/earnings');
}
