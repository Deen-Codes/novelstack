import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payout setup complete — NovelStack',
  robots: { index: false },
};

// Stripe Connect `return_url` — the writer lands here after finishing (or
// pausing) hosted onboarding. The app re-checks payout status when reopened.
export default function PayoutsDonePage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink">You&apos;re all set</h1>
        <p className="text-[15px] text-ink-muted leading-relaxed mt-3">
          Your payout details have been submitted to Stripe. Once Stripe finishes
          verifying them, your NovelStack earnings will be paid out automatically
          each month.
        </p>
        <p className="text-[15px] text-ink-muted leading-relaxed mt-4">
          You can close this page and head back to the NovelStack app — your
          Earnings screen will show the updated status.
        </p>
        <Link href="/" className="inline-block mt-8 text-sm text-ink-muted">
          ‹ NovelStack
        </Link>
      </div>
    </main>
  );
}
