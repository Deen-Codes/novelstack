// NovelStack — in-app purchases (NovelStack+ membership + tip products) via
// RevenueCat. The public SDK key lives in app.json `extra.revenueCatKey`;
// until it's set, every function here degrades gracefully so the rest of the
// app is unaffected.
import Constants from 'expo-constants';
import Purchases, { type PurchasesPackage } from 'react-native-purchases';
import { apiSend } from '@/lib/api';

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

// ============================================================
// TIP PRODUCTS — non-renewing consumables, one per price tier
// ============================================================

// Apple product identifiers, set up in App Store Connect as
// "non-renewing subscriptions / consumables" against the four tiers below.
export const TIP_PRODUCT_IDS = {
  spark: 'novelstack.tip.099',
  cheer: 'novelstack.tip.199',
  ovation: 'novelstack.tip.499',
  patron: 'novelstack.tip.999',
} as const;

export type TipProductId =
  | typeof TIP_PRODUCT_IDS.spark
  | typeof TIP_PRODUCT_IDS.cheer
  | typeof TIP_PRODUCT_IDS.ovation
  | typeof TIP_PRODUCT_IDS.patron;

// Cents value for each tip product — used both by the bottom-sheet UI and by
// the backend split when crediting the writer.
export const TIP_PRODUCT_CENTS: Record<TipProductId, number> = {
  [TIP_PRODUCT_IDS.spark]: 99,
  [TIP_PRODUCT_IDS.cheer]: 199,
  [TIP_PRODUCT_IDS.ovation]: 499,
  [TIP_PRODUCT_IDS.patron]: 999,
};

// Display copy for each tier — kept here so the screen and any future
// re-themes pick the same name.
export type TipTier = {
  productId: TipProductId;
  name: string;
  priceLabel: string;
  description: string;
};

// Fallback price labels — only ever shown if the StoreKit fetch fails or
// hasn't completed yet. The live `priceString` from RevenueCat is the truth
// (it's localised to the user's App Store region — €, ¥, $, ₹, etc.) and
// gets used in the UI as soon as it lands. The fallback uses GBP because
// the tiers were sized to UK pricing — it's a sensible-looking holdover,
// not what we want a US/EU user to actually see.
export const TIP_TIERS: TipTier[] = [
  {
    productId: TIP_PRODUCT_IDS.spark,
    name: 'Spark',
    priceLabel: '£0.99',
    description: 'A small thank-you for a chapter you loved.',
  },
  {
    productId: TIP_PRODUCT_IDS.cheer,
    name: 'Cheer',
    priceLabel: '£1.99',
    description: 'Say the writing made your day.',
  },
  {
    productId: TIP_PRODUCT_IDS.ovation,
    name: 'Standing ovation',
    priceLabel: '£4.99',
    description: 'For a writer you keep coming back to.',
  },
  {
    productId: TIP_PRODUCT_IDS.patron,
    name: 'Patron',
    priceLabel: '£9.99',
    description: 'A real lift — proper patronage of a story you adore.',
  },
];

// Loads the live, locale-correct App Store price strings for every tip
// product. Returns a `productId → priceString` map (e.g. "$0.99", "€0,99",
// "¥120"). Empty object on failure — call sites fall back to the hardcoded
// GBP label so the tip sheet still renders.
export async function loadTipPriceLabels(): Promise<Partial<Record<TipProductId, string>>> {
  configurePurchases();
  if (!configured) return {};
  try {
    const ids = Object.values(TIP_PRODUCT_IDS);
    // RN purchases supports product-id lookup directly for consumables.
    const products = await Purchases.getProducts(ids);
    const out: Partial<Record<TipProductId, string>> = {};
    for (const p of products) {
      const id = p.identifier as TipProductId;
      if (id && p.priceString) out[id] = p.priceString;
    }
    return out;
  } catch {
    return {};
  }
}

export type TipPurchaseResult = {
  ok: boolean;
  cancelled: boolean;
  alreadyCredited?: boolean;
  error?: string;
};

// Purchases a tip product through the App Store, then asks the backend to
// credit the writer's earnings ledger. The transactionId carried back from
// StoreKit (via RevenueCat) is the dedup key — the backend stamps it on the
// tips row so a retry never double-credits.
export async function purchaseTip(
  productId: TipProductId | string,
  recipientUserId: string,
  storyId?: string | null,
): Promise<TipPurchaseResult> {
  configurePurchases();
  if (!configured) {
    return { ok: false, cancelled: false, error: 'Purchases are not available.' };
  }
  try {
    // `purchaseProduct` consumes a non-subscription product directly. We use
    // it for tips because they are non-renewing consumables set up outside
    // the subscription offerings in App Store Connect. INAPP tells the SDK
    // to treat them as in-app purchases rather than subscriptions.
    const result = await Purchases.purchaseProduct(String(productId), null);

    const transactionId =
      result.transaction?.transactionIdentifier ||
      // Fall back to a synthesized id so the backend still has a dedup key.
      `${String(productId)}:${result.customerInfo.originalAppUserId}:${Date.now()}`;

    const credit = await apiSend<{ ok: boolean; alreadyCredited?: boolean }>(
      '/api/tips/iap-credit',
      'POST',
      {
        productId: String(productId),
        recipientUserId,
        storyId: storyId ?? null,
        transactionId,
      },
    );

    return {
      ok: !!credit.ok,
      cancelled: false,
      alreadyCredited: !!credit.alreadyCredited,
    };
  } catch (e) {
    const err = e as { userCancelled?: boolean; message?: string };
    if (err.userCancelled) return { ok: false, cancelled: true };
    return { ok: false, cancelled: false, error: err.message ?? 'Tip failed.' };
  }
}
