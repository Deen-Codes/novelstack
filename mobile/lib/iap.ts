// NovelStack — in-app purchases (NovelStack+ membership) via RevenueCat.
// The public SDK key lives in app.json `extra.revenueCatKey`; until it's set,
// every function here degrades gracefully so the rest of the app is unaffected.
import Constants from 'expo-constants';
import Purchases, { type PurchasesPackage } from 'react-native-purchases';

// RevenueCat entitlement identifier — must match the entitlement configured
// in the RevenueCat dashboard.
const ENTITLEMENT = 'plus';

function apiKey(): string {
  const extra = Constants.expoConfig?.extra as { revenueCatKey?: string } | undefined;
  return extra?.revenueCatKey ?? '';
}

let configured = false;

// Configures RevenueCat once per app launch. No-op until a key is set.
export function configurePurchases(): void {
  if (configured) return;
  const key = apiKey();
  if (!key) return;
  try {
    Purchases.configure({ apiKey: key });
    configured = true;
  } catch {
    // Best-effort.
  }
}

// Ties RevenueCat's customer record to the NovelStack user id so the
// server webhook can map a purchase back to the right account.
export async function identifyUser(userId: string): Promise<void> {
  configurePurchases();
  if (!configured) return;
  try {
    await Purchases.logIn(userId);
  } catch {
    // Best-effort.
  }
}

// A single membership plan as presented on the NovelStack+ screen.
export type PlusPlan = {
  // RevenueCat package — what purchasePlus() needs.
  pkg: PurchasesPackage;
  // Localized recurring price, e.g. "$6.99" or "£5.99".
  priceString: string;
  // Whether this plan carries a free-trial introductory offer.
  hasTrial: boolean;
  // Localized length of the free trial, e.g. "7 days" — empty when no trial.
  trialLabel: string;
};

export type PlusState = {
  // Whether at least one purchasable plan is available (RevenueCat reachable).
  available: boolean;
  // Whether the user already holds the NovelStack+ entitlement.
  active: boolean;
  monthly: PlusPlan | null;
  annual: PlusPlan | null;
};

const EMPTY: PlusState = { available: false, active: false, monthly: null, annual: null };

// Apple period-unit codes → a human label. RevenueCat reports the intro
// period as a unit + a count (e.g. DAY x 7, WEEK x 1).
function trialLabel(pkg: PurchasesPackage): { hasTrial: boolean; label: string } {
  const intro = pkg.product.introPrice;
  // A free trial is an introductory offer priced at zero.
  if (!intro || intro.price > 0) return { hasTrial: false, label: '' };
  const n = intro.periodNumberOfUnits;
  const unit = String(intro.periodUnit ?? '').toUpperCase();
  const word =
    unit === 'DAY' ? 'day' : unit === 'WEEK' ? 'week' : unit === 'MONTH' ? 'month' : 'day';
  // Apple delivers a 1-week trial as WEEK x 1 — say "7 days", it reads better.
  if (word === 'week') {
    const days = n * 7;
    return { hasTrial: true, label: `${days} day${days === 1 ? '' : 's'}` };
  }
  return { hasTrial: true, label: `${n} ${word}${n === 1 ? '' : 's'}` };
}

function toPlan(pkg: PurchasesPackage | null | undefined): PlusPlan | null {
  if (!pkg) return null;
  const { hasTrial, label } = trialLabel(pkg);
  return {
    pkg,
    priceString: pkg.product.priceString,
    hasTrial,
    trialLabel: label,
  };
}

// Loads the current NovelStack+ offering (monthly + annual) and whether the
// user is already a member.
export async function loadPlus(): Promise<PlusState> {
  configurePurchases();
  if (!configured) return EMPTY;
  try {
    const info = await Purchases.getCustomerInfo();
    const active = !!info.entitlements.active[ENTITLEMENT];
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;
    const monthly = toPlan(current?.monthly);
    const annual = toPlan(current?.annual);
    return {
      available: !!(monthly || annual),
      active,
      monthly,
      annual,
    };
  } catch {
    return EMPTY;
  }
}

// The percentage an annual plan saves over twelve monthly payments, rounded.
// Returns 0 when it can't be computed (missing prices or different currencies).
export function annualSavingsPercent(state: PlusState): number {
  const m = state.monthly?.pkg.product.price;
  const a = state.annual?.pkg.product.price;
  if (!m || !a || m <= 0 || a <= 0) return 0;
  const pct = Math.round((1 - a / (m * 12)) * 100);
  return pct > 0 && pct < 100 ? pct : 0;
}

export type PurchaseResult = {
  ok: boolean;
  active: boolean;
  cancelled: boolean;
  error?: string;
};

// Buys a NovelStack+ package (monthly or annual) through the App Store.
export async function purchasePlus(pkg: PurchasesPackage): Promise<PurchaseResult> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return {
      ok: true,
      active: !!customerInfo.entitlements.active[ENTITLEMENT],
      cancelled: false,
    };
  } catch (e) {
    const err = e as { userCancelled?: boolean; message?: string };
    if (err.userCancelled) return { ok: false, active: false, cancelled: true };
    return { ok: false, active: false, cancelled: false, error: err.message ?? 'Purchase failed.' };
  }
}

// Restores a previous purchase — Apple requires this to be reachable.
export async function restorePlus(): Promise<PurchaseResult> {
  configurePurchases();
  if (!configured) {
    return { ok: false, active: false, cancelled: false, error: 'Purchases are not available.' };
  }
  try {
    const info = await Purchases.restorePurchases();
    return {
      ok: true,
      active: !!info.entitlements.active[ENTITLEMENT],
      cancelled: false,
    };
  } catch (e) {
    const err = e as { message?: string };
    return { ok: false, active: false, cancelled: false, error: err.message ?? 'Restore failed.' };
  }
}
