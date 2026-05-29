import { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGet, apiSend, getSessionToken } from '@/lib/api';
import { AmbientGlow } from '@/components/AmbientGlow';
import { SignInPitch } from '@/components/SignInPitch';
import { useReadingWidth } from '@/components/PageContainer';
import type { Earnings } from '@/lib/types';

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

const PAYOUT_STATUS: Record<string, { label: string; tone: 'paid' | 'wait' | 'fail' }> = {
  paid: { label: 'Paid', tone: 'paid' },
  processing: { label: 'Processing', tone: 'wait' },
  pending: { label: 'Pending', tone: 'wait' },
  failed: { label: 'Failed', tone: 'fail' },
};

// The author earnings dashboard — what you've earned, where it came from, and
// the Stripe payout connection. Reached from Profile.
export default function EarningsScreen() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [data, setData] = useState<Earnings | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  // Centres the dashboard on iPad so the balance/breakdown cards don't
  // sprawl across a 12.9" screen.
  const ipadPad = useReadingWidth();

  const load = useCallback(async () => {
    const token = await getSessionToken();
    if (!token) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    // Token present — treat as signed in. A failed earnings fetch is a
    // network/server hiccup, not an auth problem; we surface a retry rather
    // than booting an authenticated author to the SignInPitch.
    setSignedIn(true);
    try {
      const earnings = await apiGet<Earnings>('/api/me/earnings');
      setData(earnings);
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
    setLoading(false);
  }, []);

  // Reloads on focus — so returning from Stripe onboarding shows new status.
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  // Opens Stripe-hosted onboarding in an in-app browser so the writer never
  // leaves NovelStack visually — when they close it, focus returns to this
  // screen and useFocusEffect triggers a reload (so "Set up payouts" flips
  // to "Payouts active" immediately if onboarding completed).
  async function setupPayouts() {
    if (busy) return;
    setBusy(true);
    setMsg('');
    try {
      const { url } = await apiSend<{ url: string }>('/api/me/stripe/connect', 'POST');
      // openAuthSessionAsync mounts SFAuthenticationSession on iOS — Apple's
      // native in-app browser that auto-dismisses on redirect back to our
      // domain. Falls back to a plain in-app browser on Android.
      await WebBrowser.openAuthSessionAsync(url, 'novelstack://earnings');
      // No need to read the result — the focus effect reloads earnings
      // when the user returns to this screen.
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Could not start payout setup.');
    }
    setBusy(false);
  }

  // Opens the writer's Stripe Express dashboard (manage bank, view transfers).
  async function openDashboard() {
    if (busy) return;
    setBusy(true);
    setMsg('');
    try {
      const { url } = await apiGet<{ url: string }>('/api/me/stripe/dashboard');
      await WebBrowser.openAuthSessionAsync(url, 'novelstack://earnings');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Could not open the payout dashboard.');
    }
    setBusy(false);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (signedIn === false) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <AmbientGlow />
        <SignInPitch
          headline="Earnings & payouts"
          sub="Sign in to track what your stories earn and set up how you get paid."
        />
      </SafeAreaView>
    );
  }

  // Signed in but the request failed — offer a retry instead of pretending
  // there's nothing to show or treating the network blip as a sign-out.
  if (!data) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <AmbientGlow />
        <ScrollView contentContainerStyle={[styles.scroll, ipadPad]}>
          <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color={colors.ink} />
            <Text style={styles.backText}>Profile</Text>
          </Pressable>
          <Text style={styles.h1}>Earnings</Text>
          <View style={{ alignItems: 'center', paddingHorizontal: 24, marginTop: 60 }}>
            <Ionicons name="cloud-offline-outline" size={28} color={colors.signal} />
            <Text style={[styles.balanceLabel, { marginTop: 16, textAlign: 'center' }]}>
              {loadError
                ? "Couldn't load your earnings — looks like a connection hiccup."
                : 'No earnings data yet.'}
            </Text>
            {loadError && (
              <Pressable
                style={[styles.outlineBtn, { marginTop: 18 }]}
                onPress={() => {
                  setLoading(true);
                  setLoadError(false);
                  load();
                }}
              >
                <Text style={styles.outlineBtnText}>Retry</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AmbientGlow />
      <ScrollView contentContainerStyle={[styles.scroll, ipadPad]}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
          <Text style={styles.backText}>Profile</Text>
        </Pressable>

        <Text style={styles.h1}>Earnings</Text>

        {/* "Get paid to write" hero — visible only when the writer hasn't
            earned anything yet (no balance + no lifetime). Sells the value
            prop on first visit so new writers understand the system, and
            makes for a clean screenshot when nothing else fills the screen. */}
        {data.availableCents === 0 && data.lifetimeCents === 0 && !data.routesToCompany && (
          <View style={styles.heroCard}>
            <View style={styles.heroIcon}>
              <Ionicons name="cash-outline" size={22} color={colors.creamInk} />
            </View>
            <Text style={styles.heroTitle}>Get paid to write</Text>
            <Text style={styles.heroBody}>
              Readers tip your stories, and a share of every NovelStack+
              subscription + chapter ad goes into the writer pool. As soon as
              your earnings clear £10, we pay them straight to your bank.
            </Text>
            <View style={styles.heroRow}>
              <View style={styles.heroPill}>
                <Ionicons name="heart-outline" size={13} color={colors.signal} />
                <Text style={styles.heroPillText}>Reader tips</Text>
              </View>
              <View style={styles.heroPill}>
                <Ionicons name="people-outline" size={13} color={colors.signal} />
                <Text style={styles.heroPillText}>NovelStack+ share</Text>
              </View>
              <View style={styles.heroPill}>
                <Ionicons name="play-outline" size={13} color={colors.signal} />
                <Text style={styles.heroPillText}>Ad revenue</Text>
              </View>
            </View>
          </View>
        )}

        {/* Available balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available balance</Text>
          <Text style={styles.balanceValue}>{money(data.availableCents)}</Text>
          <Text style={styles.balanceHint}>
            {data.routesToCompany
              ? 'This is a NovelStack house account — earnings settle to NovelStack.'
              : 'Tips and ad earnings, paid out monthly once payouts are set up.'}
          </Text>
        </View>

        {/* Two-up: this month + lifetime */}
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{money(data.thisMonthCents)}</Text>
            <Text style={styles.statLabel}>This month so far</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{money(data.lifetimeCents)}</Text>
            <Text style={styles.statLabel}>Lifetime earned</Text>
          </View>
        </View>

        {/* Payout setup — hidden entirely when the server flags this user
            with hidePayoutSetup (App Review test account). The dashboard
            still shows balance + history but no setup/manage CTAs that
            would lead to a broken Stripe flow. */}
        {data.hidePayoutSetup ? null : data.routesToCompany ? (
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Ionicons name="business-outline" size={18} color={colors.inkMuted} />
              <Text style={styles.cardTitle}>House account</Text>
            </View>
            <Text style={styles.cardBody}>
              Earnings from this account route to NovelStack. There&apos;s no personal
              payout to set up.
            </Text>
          </View>
        ) : data.stripe.payoutsEnabled ? (
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Ionicons name="checkmark-circle" size={18} color="#7FB08A" />
              <Text style={styles.cardTitle}>Payouts active</Text>
            </View>
            <Text style={styles.cardBody}>
              Your Stripe account is connected. Earnings are paid out automatically
              each month.
            </Text>
            <Pressable
              style={[styles.outlineBtn, busy && { opacity: 0.6 }]}
              onPress={openDashboard}
              disabled={busy}
            >
              <Text style={styles.outlineBtnText}>Manage payout details</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHead}>
              <Ionicons name="cash-outline" size={18} color={colors.signal} />
              <Text style={styles.cardTitle}>
                {data.stripe.needsOnboarding ? 'Finish payout setup' : 'Set up payouts'}
              </Text>
            </View>
            <Text style={styles.cardBody}>
              Connect a bank account through Stripe to get paid what your stories
              earn. It takes a couple of minutes and is handled securely by Stripe.
            </Text>
            <Pressable
              style={[styles.primaryBtn, busy && { opacity: 0.6 }]}
              onPress={setupPayouts}
              disabled={busy}
            >
              <Text style={styles.primaryBtnText}>
                {busy
                  ? 'Just a moment…'
                  : data.stripe.needsOnboarding
                    ? 'Continue setup'
                    : 'Set up payouts'}
              </Text>
            </Pressable>
          </View>
        )}

        {!!msg && <Text style={styles.msg}>{msg}</Text>}

        {/* Where it comes from */}
        <Text style={styles.section}>Where it comes from</Text>
        <View style={styles.card}>
          <Breakdown
            icon="gift-outline"
            label="Tips from readers"
            value={money(data.breakdown.tipsCents)}
          />
          <View style={styles.divider} />
          <Breakdown
            icon="play-circle-outline"
            label="Ad revenue share"
            value={money(data.breakdown.adCents)}
          />
          <View style={styles.divider} />
          <Breakdown
            icon="sparkles-outline"
            label="NovelStack+ pool share"
            value={money(data.breakdown.subscriptionCents)}
          />
          {data.pendingAdUnlocks > 0 && (
            <>
              <View style={styles.divider} />
              <View style={styles.pendingRow}>
                <View style={styles.breakdownIcon}>
                  <Ionicons name="time-outline" size={17} color={colors.signal} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.breakdownLabel}>Pending ad revenue</Text>
                  <Text style={styles.pendingSub}>
                    {data.pendingAdUnlocks} unlocks, settles in ~48h
                  </Text>
                </View>
                <Text style={styles.pendingValue}>
                  ~{money(data.pendingAdCentsEstimate)}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Payout history */}
        {data.payouts.length > 0 && (
          <>
            <Text style={styles.section}>Payout history</Text>
            <View style={styles.card}>
              {data.payouts.map((p, i) => {
                const s = PAYOUT_STATUS[p.status] ?? PAYOUT_STATUS.pending;
                return (
                  <View key={p.id}>
                    {i > 0 && <View style={styles.divider} />}
                    <View style={styles.payoutRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.payoutMonth}>{monthLabel(p.periodMonth)}</Text>
                        <Text style={styles.payoutMeta}>{money(p.totalCents)}</Text>
                      </View>
                      <View
                        style={[
                          styles.statusPill,
                          s.tone === 'paid' && styles.statusPaid,
                          s.tone === 'fail' && styles.statusFail,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusText,
                            s.tone === 'paid' && styles.statusTextPaid,
                            s.tone === 'fail' && styles.statusTextFail,
                          ]}
                        >
                          {s.label}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Recent tips */}
        {data.recentTips.length > 0 && (
          <>
            <Text style={styles.section}>Recent tips</Text>
            <View style={styles.card}>
              {data.recentTips.map((t, i) => (
                <View key={t.id}>
                  {i > 0 && <View style={styles.divider} />}
                  <View style={styles.tipRow}>
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={styles.tipFrom}>{t.from}</Text>
                      {!!t.message && (
                        <Text style={styles.tipMsg} numberOfLines={2}>
                          “{t.message}”
                        </Text>
                      )}
                    </View>
                    <Text style={styles.tipAmount}>{money(t.amountCents)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {data.lifetimeCents === 0 && (
          <Text style={styles.empty}>
            You haven&apos;t earned anything yet. Publish stories, gather readers, and
            tips and ad revenue will start landing here.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Breakdown({
  icon,
  label,
  value,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
}) {
  return (
    <View style={styles.breakdownRow}>
      <View style={styles.breakdownIcon}>
        <Ionicons name={icon} size={17} color={colors.signal} />
      </View>
      <Text style={styles.breakdownLabel}>{label}</Text>
      <Text style={styles.breakdownValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },

  back: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  backText: { fontSize: 15, color: colors.ink, marginLeft: 2 },
  h1: {
    fontFamily: fonts.displayXl,
    fontSize: 30,
    color: colors.ink,
    letterSpacing: -0.6,
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },

  balanceCard: {
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  balanceLabel: {
    fontSize: 12,
    color: colors.inkMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    fontWeight: '700',
  },
  balanceValue: {
    fontFamily: fonts.displayXl,
    fontSize: 40,
    color: colors.ink,
    letterSpacing: -1,
    marginTop: 6,
  },
  balanceHint: { fontSize: 12.5, color: colors.inkMuted, marginTop: 6, lineHeight: 18 },

  statRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  statValue: { fontFamily: fonts.display, fontSize: 19, color: colors.ink },
  statLabel: { fontSize: 12, color: colors.inkMuted, marginTop: 3 },

  // Empty-state hero — "Get paid to write" card shown when the writer has
  // nothing in the dashboard yet. Cream surface so it stands out from the
  // dark balance card and reads as the headline of the page.
  heroCard: {
    backgroundColor: colors.cream,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  heroIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: 'rgba(21,16,14,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  heroTitle: {
    fontFamily: fonts.displayXl,
    fontSize: 24,
    color: colors.creamInk,
    letterSpacing: -0.5,
  },
  heroBody: {
    fontSize: 13.5,
    color: '#3A2A22',
    lineHeight: 19,
    marginTop: 6,
  },
  heroRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing.md,
  },
  heroPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(200,65,78,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(200,65,78,0.35)',
  },
  heroPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: colors.signal,
    letterSpacing: 0.2,
  },

  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardTitle: { fontFamily: fonts.display, fontSize: 15.5, color: colors.ink },
  cardBody: { fontSize: 13, color: colors.inkMuted, lineHeight: 19, marginTop: 7 },

  primaryBtn: {
    height: 48,
    borderRadius: 13,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  primaryBtnText: { color: colors.creamInk, fontSize: 14.5, fontWeight: '700' },
  outlineBtn: {
    height: 46,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  outlineBtnText: { color: colors.ink, fontSize: 14, fontWeight: '600' },
  msg: { fontSize: 12.5, color: colors.signal, marginTop: spacing.sm, lineHeight: 18 },

  section: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.ink,
    marginTop: spacing.xl,
  },

  divider: { height: 1, backgroundColor: colors.borderSoft, marginVertical: 4 },

  breakdownRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 9 },
  breakdownIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.signalSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  breakdownLabel: { flex: 1, fontSize: 14, color: colors.ink },
  breakdownValue: { fontSize: 14.5, fontWeight: '700', color: colors.ink },

  pendingRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 9 },
  pendingSub: { fontSize: 12, color: colors.inkFaint, marginTop: 2 },
  pendingValue: { fontSize: 13.5, fontWeight: '600', color: colors.inkMuted },

  payoutRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
  payoutMonth: { fontSize: 14, fontWeight: '600', color: colors.ink },
  payoutMeta: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2 },

  statusPill: {
    backgroundColor: colors.cardHi,
    borderRadius: radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusPaid: { backgroundColor: 'rgba(127,176,138,0.16)' },
  statusFail: { backgroundColor: colors.signalSoft },
  statusText: { fontSize: 11, fontWeight: '700', color: colors.inkMuted },
  statusTextPaid: { color: '#7FB08A' },
  statusTextFail: { color: colors.signal },

  tipRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 },
  tipFrom: { fontSize: 14, fontWeight: '600', color: colors.ink },
  tipMsg: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2, fontStyle: 'italic' },
  tipAmount: { fontSize: 14.5, fontWeight: '700', color: colors.ink },

  empty: {
    fontSize: 13,
    color: colors.inkMuted,
    lineHeight: 20,
    marginTop: spacing.lg,
    textAlign: 'center',
  },
});
