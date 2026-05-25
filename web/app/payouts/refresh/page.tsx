import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Payout setup — NovelStack',
  robots: { index: false },
};

// Stripe Connect `refresh_url` — reached when an onboarding link expires
// before it's used. The writer simply restarts setup from the app.
export default function PayoutsRefreshPage() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="font-serif text-3xl text-ink">This link expired</h1>
        <p className="text-[15px] text-ink-muted leading-relaxed mt-3">
          Payout setup links are only valid for a short time. To carry on, reopen
          the NovelStack app, go to your Earnings screen, and tap{' '}
          <span className="text-ink">Set up payouts</span> again — it only takes a
          moment.
        </p>
        <Link href="/" className="inline-block mt-8 text-sm text-ink-muted">
          ‹ NovelStack
        </Link>
      </div>
    </main>
  );
}
