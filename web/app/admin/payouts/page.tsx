import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth';
import { AppHeader } from '@/components/AppHeader';
import { ImportAdRevenueForm } from './ImportAdRevenueForm';

export const metadata = { title: 'Admin payouts — NovelStack' };

// Admin page for reconciling pending ad unlocks against the real AdMob
// payout. Reader unlocks land as `status='pending'` with a null payout cents;
// once Deen knows the per-unlock figure from the AdMob report he picks a
// date window here and stamps every pending row in it as confirmed.
export default async function AdminPayouts() {
  const user = await getSessionUser();
  if (!user) redirect('/signin');

  if (user.role !== 'admin') {
    return (
      <>
        <AppHeader />
        <main className="max-w-2xl mx-auto px-6 py-32 text-center">
          <p className="text-ink-muted">This page is for admins only.</p>
        </main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="font-display text-3xl font-medium mb-2">Admin payouts</h1>
        <p className="text-[14px] text-ink-muted mb-7">
          Reconcile pending ad unlocks against the real AdMob payout window.
          All pending unlocks created in the date range will be stamped with
          the cents-per-unlock value and flipped to confirmed.
        </p>

        <ImportAdRevenueForm />
      </main>
    </>
  );
}
