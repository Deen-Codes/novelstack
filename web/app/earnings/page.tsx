import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { getAuthorEarnings } from '@/lib/earnings';
import { getConnectStatus, stripeConfigured } from '@/lib/stripe';
import { AppHeader } from '@/components/AppHeader';
import { startPayoutSetup, openStripeDashboard } from './actions';

export const metadata = { title: 'Earnings — NovelStack' };

// Cents → "$1,234.56".
function money(cents: number): string {
  const v = Math.max(0, Math.round(cents)) / 100;
  return '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// "2026-05-01" → "May 2026".
function monthLabel(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

const STATUS_LABEL: Record<string, string> = {
  paid: 'Paid',
  processing: 'Processing',
  pending: 'Pending',
  failed: 'Failed',
};

export default async function EarningsPage() {
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  const [earnings, stripe] = await Promise.all([
    getAuthorEarnings(user.id, user.isSeed),
    getConnectStatus(user.stripeConnectId),
  ]);
  const stripeOn = stripeConfigured();

  return (
    <>
      <AppHeader />
      <main className="max-w-xl mx-auto px-6 py-10">
        <h1 className="font-serif text-3xl font-medium">Earnings</h1>
        <p className="text-[14px] text-ink-muted mt-1 mb-7">
          What your stories earn, and how you get paid.
        </p>

        {/* Available balance */}
        <div className="rounded-2xl border border-border-soft bg-white p-6">
          <p className="text-[12px] uppercase tracking-wide font-semibold text-ink-muted">
            Available balance
          </p>
          <p className="font-serif text-4xl text-ink mt-1">{money(earnings.availableCents)}</p>
          <p className="text-[13px] text-ink-muted mt-2">
            {earnings.routesToCompany
              ? 'This is a NovelStack house account — earnings settle to NovelStack.'
              : 'Tips and ad earnings, paid out monthly once payouts are set up.'}
          </p>
        </div>

        {/* This month + lifetime */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="rounded-xl border border-border-soft bg-white p-4">
            <p className="font-serif text-xl text-ink">{money(earnings.thisMonthCents)}</p>
            <p className="text-[12px] text-ink-muted mt-0.5">This month so far</p>
          </div>
          <div className="rounded-xl border border-border-soft bg-white p-4">
            <p className="font-serif text-xl text-ink">{money(earnings.lifetimeCents)}</p>
            <p className="text-[12px] text-ink-muted mt-0.5">Lifetime earned</p>
          </div>
        </div>

        {/* Payout setup */}
        <section className="rounded-2xl border border-border-soft bg-white p-5 mt-3">
          {earnings.routesToCompany ? (
            <>
              <h2 className="font-serif text-lg text-ink">House account</h2>
              <p className="text-[13px] text-ink-muted mt-1.5">
                Earnings from this account route to NovelStack. There&apos;s no personal
                payout to set up.
              </p>
            </>
          ) : stripe.payoutsEnabled ? (
            <>
              <h2 className="font-serif text-lg text-ink">Payouts active</h2>
              <p className="text-[13px] text-ink-muted mt-1.5">
                Your Stripe account is connected. Earnings are paid out automatically
                each month.
              </p>
              <form action={openStripeDashboard} className="mt-4">
                <button className="rounded-lg border border-border-soft px-4 py-2.5 text-[14px] font-medium text-ink">
                  Manage payout details
                </button>
              </form>
            </>
          ) : !stripeOn ? (
            <>
              <h2 className="font-serif text-lg text-ink">Payouts coming soon</h2>
              <p className="text-[13px] text-ink-muted mt-1.5">
                Payout setup is being switched on shortly. Your tips and ad earnings
                are already being tracked here and will be waiting for you.
              </p>
            </>
          ) : (
            <>
              <h2 className="font-serif text-lg text-ink">
                {stripe.needsOnboarding ? 'Finish payout setup' : 'Set up payouts'}
              </h2>
              <p className="text-[13px] text-ink-muted mt-1.5">
                Connect a bank account through Stripe to get paid what your stories
                earn. It takes a couple of minutes and is handled securely by Stripe.
              </p>
              <form action={startPayoutSetup} className="mt-4">
                <button className="rounded-lg bg-[#15100E] text-white px-4 py-2.5 text-[14px] font-semibold">
                  {stripe.needsOnboarding ? 'Continue setup' : 'Set up payouts'}
                </button>
              </form>
            </>
          )}
        </section>

        {/* Where it comes from */}
        <h2 className="font-serif text-lg text-ink mt-8 mb-2">Where it comes from</h2>
        <div className="rounded-2xl border border-border-soft bg-white divide-y divide-border-soft">
          {[
            { label: 'Tips from readers', value: earnings.breakdown.tipsCents },
            { label: 'Ad revenue share', value: earnings.breakdown.adCents },
            { label: 'NovelStack+ pool share', value: earnings.breakdown.subscriptionCents },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between px-5 py-3.5">
              <span className="text-[14px] text-ink">{row.label}</span>
              <span className="text-[14px] font-semibold text-ink">{money(row.value)}</span>
            </div>
          ))}
        </div>

        {/* Payout history */}
        {earnings.payouts.length > 0 && (
          <>
            <h2 className="font-serif text-lg text-ink mt-8 mb-2">Payout history</h2>
            <div className="rounded-2xl border border-border-soft bg-white divide-y divide-border-soft">
              {earnings.payouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-[14px] font-medium text-ink">
                      {monthLabel(p.periodMonth)}
                    </p>
                    <p className="text-[12.5px] text-ink-muted">{money(p.totalCents)}</p>
                  </div>
                  <span className="text-[12px] font-semibold text-ink-muted">
                    {STATUS_LABEL[p.status] ?? p.status}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Recent tips */}
        {earnings.recentTips.length > 0 && (
          <>
            <h2 className="font-serif text-lg text-ink mt-8 mb-2">Recent tips</h2>
            <div className="rounded-2xl border border-border-soft bg-white divide-y divide-border-soft">
              {earnings.recentTips.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-ink">{t.from}</p>
                    {t.message && (
                      <p className="text-[12.5px] text-ink-muted italic truncate">
                        “{t.message}”
                      </p>
                    )}
                  </div>
                  <span className="text-[14px] font-semibold text-ink">
                    {money(t.amountCents)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {earnings.lifetimeCents === 0 && (
          <p className="text-[13px] text-ink-muted leading-relaxed mt-6 text-center">
            You haven&apos;t earned anything yet. Publish stories, gather readers, and
            tips and ad revenue will start landing here.
          </p>
        )}
      </main>
    </>
  );
}
