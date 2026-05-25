import { type ComponentProps, useEffect, useRef, useState } from 'react';
import { Animated, ScrollView, View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, fonts } from '@/theme/tokens';
import { AmbientGlow } from '@/components/AmbientGlow';
import { getCurrentUser } from '@/lib/auth';
import {
  loadPlus,
  identifyUser,
  purchasePlus,
  restorePlus,
  annualSavingsPercent,
  type PlusState,
} from '@/lib/iap';

type IconName = ComponentProps<typeof Ionicons>['name'];

// NovelStack+ — the membership upgrade screen.
const PERKS: { icon: IconName; title: string; sub: string }[] = [
  {
    icon: 'volume-mute-outline',
    title: 'Ad-free reading',
    sub: 'No ad breaks between chapters — ever.',
  },
  {
    icon: 'lock-open-outline',
    title: 'Every chapter unlocked',
    sub: 'Skip the ad gates on every story, instantly.',
  },
  {
    icon: 'cloud-offline-outline',
    title: 'Offline reading',
    sub: 'Download stories and read them anywhere.',
  },
  {
    icon: 'heart-outline',
    title: 'More for the writers',
    sub: 'A bigger share of your membership reaches the authors you read.',
  },
  {
    icon: 'ribbon-outline',
    title: 'A member badge',
    sub: 'Show your support across NovelStack.',
  },
];

type PlanKey = 'annual' | 'monthly';

export default function Plus() {
  // NovelStack+ purchase state — offering, membership status, in-flight flag.
  const [plus, setPlus] = useState<PlusState | null>(null);
  const [plan, setPlan] = useState<PlanKey>('annual'); // annual is the better deal
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const enter = useRef(new Animated.Value(0)).current; // entrance
  const float = useRef(new Animated.Value(0)).current; // badge drift

  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 520, useNativeDriver: true }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 2400, useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 2400, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [enter, float]);

  // Identify the buyer to RevenueCat, then load the offering + membership.
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) await identifyUser(user.id);
      const state = await loadPlus();
      setPlus(state);
      // If the offering only carries a monthly plan, don't strand the user
      // on an annual tab that has nothing to buy.
      if (state.annual === null && state.monthly !== null) setPlan('monthly');
    })();
  }, []);

  // The plan the user is about to buy — null until the offering loads.
  const chosen = plan === 'annual' ? plus?.annual ?? null : plus?.monthly ?? null;
  const savings = plus ? annualSavingsPercent(plus) : 0;
  // Fallback prices shown before the offering loads / if RevenueCat is offline.
  const annualPrice = plus?.annual?.priceString ?? '$69.99';
  const monthlyPrice = plus?.monthly?.priceString ?? '$6.99';

  async function buy() {
    if (busy || !plus) return;
    if (!chosen) {
      setMsg('Memberships aren’t available right now — please try again shortly.');
      return;
    }
    setBusy(true);
    setMsg('');
    const result = await purchasePlus(chosen.pkg);
    setBusy(false);
    if (result.cancelled) return;
    if (result.active) {
      setPlus({ ...plus, active: true });
      setMsg('You’re in — welcome to NovelStack+.');
    } else {
      setMsg(result.error ?? 'That didn’t go through. Please try again.');
    }
  }

  async function restore() {
    if (busy) return;
    setBusy(true);
    setMsg('');
    const result = await restorePlus();
    setBusy(false);
    if (result.active) {
      setPlus((p) => (p ? { ...p, active: true } : p));
      setMsg('Membership restored.');
    } else {
      setMsg(result.ok ? 'No membership found to restore.' : result.error ?? 'Could not restore.');
    }
  }

  // CTA label reflects the selected plan's free trial, when one exists.
  const ctaLabel = busy
    ? 'Just a moment…'
    : chosen?.hasTrial
      ? `Start your ${chosen.trialLabel} free trial`
      : 'Go NovelStack+';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AmbientGlow />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>

        <Animated.View
          style={{
            alignItems: 'center',
            width: '100%',
            opacity: enter,
            transform: [
              { translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) },
            ],
          }}
        >
        <Animated.View
          style={[
            styles.badge,
            {
              transform: [
                { scale: float.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) },
                { translateY: float.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) },
              ],
            },
          ]}
        >
          <Ionicons name="sparkles" size={26} color="#15100E" />
        </Animated.View>
        <Text style={styles.title}>
          NovelStack<Text style={{ color: colors.signal }}>+</Text>
        </Text>
        <Text style={styles.tagline}>Reading, uninterrupted.</Text>

        <View style={styles.perks}>
          {PERKS.map((p) => (
            <View key={p.title} style={styles.perk}>
              <View style={styles.perkIcon}>
                <Ionicons name={p.icon} size={19} color={colors.signal} />
              </View>
              <View style={styles.perkText}>
                <Text style={styles.perkTitle}>{p.title}</Text>
                <Text style={styles.perkSub}>{p.sub}</Text>
              </View>
            </View>
          ))}
        </View>

        {!plus?.active && (
          <View style={styles.plans}>
            <Pressable
              style={[styles.plan, plan === 'annual' && styles.planOn]}
              onPress={() => setPlan('annual')}
            >
              <View style={styles.planRadio}>
                {plan === 'annual' && <View style={styles.planRadioDot} />}
              </View>
              <View style={styles.planText}>
                <View style={styles.planTopRow}>
                  <Text style={styles.planName}>Annual</Text>
                  {savings > 0 && (
                    <View style={styles.saveTag}>
                      <Text style={styles.saveTagText}>SAVE {savings}%</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.planSub}>Billed once a year</Text>
              </View>
              <Text style={styles.planPrice}>
                {annualPrice}
                <Text style={styles.planPer}> / yr</Text>
              </Text>
            </Pressable>

            <Pressable
              style={[styles.plan, plan === 'monthly' && styles.planOn]}
              onPress={() => setPlan('monthly')}
            >
              <View style={styles.planRadio}>
                {plan === 'monthly' && <View style={styles.planRadioDot} />}
              </View>
              <View style={styles.planText}>
                <Text style={styles.planName}>Monthly</Text>
                <Text style={styles.planSub}>Billed every month</Text>
              </View>
              <Text style={styles.planPrice}>
                {monthlyPrice}
                <Text style={styles.planPer}> / mo</Text>
              </Text>
            </Pressable>
          </View>
        )}

        {plus?.active ? (
          <View style={[styles.cta, styles.ctaMember]}>
            <Ionicons name="checkmark-circle" size={19} color="#15100E" />
            <Text style={styles.ctaText}>You&apos;re a member</Text>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [styles.cta, (pressed || busy) && { opacity: 0.85 }]}
            onPress={buy}
            disabled={busy}
          >
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </Pressable>
        )}

        {!!msg && <Text style={styles.note}>{msg}</Text>}

        {!plus?.active && (
          <Text style={styles.fine}>
            {chosen?.hasTrial
              ? `Your first ${chosen.trialLabel} are free. After the trial, NovelStack+ is `
              : 'NovelStack+ is '}
            {plan === 'annual' ? `${annualPrice} per year` : `${monthlyPrice} per month`}. Payment
            is charged to your Apple ID. The subscription renews automatically unless cancelled at
            least 24 hours before the end of the period — manage or cancel any time in your Apple
            Account settings.
          </Text>
        )}

        <View style={styles.legalRow}>
          <Pressable
            onPress={() => Linking.openURL('https://novelstack.app/terms')}
            hitSlop={6}
          >
            <Text style={styles.legalLink}>Terms of Use</Text>
          </Pressable>
          <Text style={styles.legalDot}>·</Text>
          <Pressable
            onPress={() => Linking.openURL('https://novelstack.app/privacy')}
            hitSlop={6}
          >
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </Pressable>
        </View>

        <Pressable onPress={restore} disabled={busy} hitSlop={8}>
          <Text style={styles.restore}>Restore purchase</Text>
        </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingHorizontal: 24, paddingBottom: spacing.xl * 2, alignItems: 'center' },

  back: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: spacing.sm },

  badge: {
    width: 66,
    height: 66,
    borderRadius: 19,
    backgroundColor: '#F4ECDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  title: {
    fontFamily: fonts.displayXl,
    fontSize: 32,
    color: colors.ink,
    marginTop: spacing.md,
    letterSpacing: -0.6,
  },
  tagline: { fontSize: 15, color: colors.inkMuted, marginTop: 4 },

  perks: { width: '100%', marginTop: spacing.xl, gap: 16 },
  perk: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  perkIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkText: { flex: 1, minWidth: 0 },
  perkTitle: { fontSize: 14.5, fontWeight: '600', color: colors.ink },
  perkSub: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2, lineHeight: 17 },

  // --- plan picker --------------------------------------------------------
  plans: { width: '100%', marginTop: spacing.xl, gap: 10 },
  plan: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#3A302C',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  planOn: {
    borderColor: colors.signal,
    backgroundColor: colors.signalSoft,
  },
  planRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.signal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.signal,
  },
  planText: { flex: 1, minWidth: 0 },
  planTopRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  planName: { fontSize: 15.5, fontWeight: '700', color: colors.ink },
  planSub: { fontSize: 12, color: colors.inkMuted, marginTop: 2 },
  planPrice: { fontSize: 16, fontWeight: '700', color: colors.ink },
  planPer: { fontSize: 12, fontWeight: '400', color: colors.inkMuted },
  saveTag: {
    backgroundColor: colors.signal,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  saveTagText: { fontSize: 10, fontWeight: '800', color: '#15100E', letterSpacing: 0.4 },

  cta: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    backgroundColor: '#F4ECDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  ctaMember: { flexDirection: 'row', gap: 8 },
  ctaText: { color: '#15100E', fontSize: 15, fontWeight: '700' },
  restore: {
    fontSize: 13,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: spacing.md,
    textDecorationLine: 'underline',
  },
  note: {
    fontSize: 12.5,
    color: colors.signal,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
  },
  fine: {
    fontSize: 12,
    color: colors.inkFaint,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 17,
  },
  legalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  legalLink: {
    fontSize: 12.5,
    color: colors.inkMuted,
    textDecorationLine: 'underline',
  },
  legalDot: { fontSize: 12.5, color: colors.inkFaint },
});
