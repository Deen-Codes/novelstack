import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { Cover } from '@/components/Cover';
import type { FeedStory } from '@/lib/types';

const SLOTS = 3;

// Short relative time, e.g. "3h", "2d", "1w".
function ago(iso: string | null | undefined): string {
  if (!iso) return '';
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms) || ms < 0) return 'just now';
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return `${Math.floor(d / 7)}w`;
}

// A compact, always-fresh activity strip. Shows three rows of writer activity
// and quietly swaps one row out every few seconds with a fade-and-slide, so
// the section feels live without ever needing to scroll.
export function RecentActivity({ stories }: { stories: FeedStory[] }) {
  const pool = useMemo(() => stories.filter((s) => !!s.author), [stories]);

  const [shown, setShown] = useState<number[]>([]);
  const cursor = useRef(SLOTS);
  const slot = useRef(0);
  const op = useRef([...Array(SLOTS)].map(() => new Animated.Value(0))).current;
  const ty = useRef([...Array(SLOTS)].map(() => new Animated.Value(0))).current;
  const pulse = useRef(new Animated.Value(0)).current;

  // Seed the visible rows and stagger them in.
  useEffect(() => {
    if (pool.length === 0) return;
    const init: number[] = [];
    for (let i = 0; i < Math.min(SLOTS, pool.length); i += 1) init.push(i);
    setShown(init);
    cursor.current = init.length;
    slot.current = 0;
    op.forEach((v) => v.setValue(0));
    ty.forEach((v) => v.setValue(0));
    Animated.stagger(
      120,
      init.map((_, i) =>
        Animated.timing(op[i], { toValue: 1, duration: 360, useNativeDriver: true }),
      ),
    ).start();
  }, [pool, op, ty]);

  // Swap one row at a time, on a rolling timer.
  useEffect(() => {
    if (pool.length <= SLOTS) return;
    const timer = setInterval(() => {
      const s = slot.current;
      Animated.parallel([
        Animated.timing(op[s], { toValue: 0, duration: 320, useNativeDriver: true }),
        Animated.timing(ty[s], { toValue: -7, duration: 320, useNativeDriver: true }),
      ]).start(() => {
        setShown((prev) => {
          const next = [...prev];
          next[s] = cursor.current % pool.length;
          return next;
        });
        cursor.current += 1;
        ty[s].setValue(9);
        Animated.parallel([
          Animated.timing(op[s], { toValue: 1, duration: 420, useNativeDriver: true }),
          Animated.timing(ty[s], { toValue: 0, duration: 420, useNativeDriver: true }),
        ]).start();
      });
      slot.current = (slot.current + 1) % SLOTS;
    }, 2800);
    return () => clearInterval(timer);
  }, [pool.length, op, ty]);

  // Gentle pulse on the "Live" dot.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1100, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  if (pool.length === 0 || shown.length === 0) return null;

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Recent activity</Text>
        <View style={styles.live}>
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
                transform: [
                  { scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.35] }) },
                ],
              },
            ]}
          />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      <View style={styles.list}>
        {shown.map((poolIdx, slotIdx) => {
          const s = pool[poolIdx];
          if (!s) return null;
          const name = s.author?.displayName ?? 'A writer';
          return (
            <Animated.View
              key={slotIdx}
              style={{ opacity: op[slotIdx], transform: [{ translateY: ty[slotIdx] }] }}
            >
              <Pressable style={styles.row} onPress={() => router.push(`/story/${s.slug}`)}>
                <View style={styles.avatar}>
                  {s.author?.avatarUrl ? (
                    <Image source={{ uri: s.author.avatarUrl }} style={styles.avatarImg} />
                  ) : (
                    <Text style={styles.avatarInitial}>{name.slice(0, 1).toUpperCase()}</Text>
                  )}
                </View>
                <View style={styles.rowText}>
                  <Text style={styles.line1} numberOfLines={1}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.dim}>{'  ·  '}{ago(s.publishedAt ?? s.createdAt)}</Text>
                  </Text>
                  <Text style={styles.line2} numberOfLines={1}>
                    Published <Text style={styles.work}>{s.title}</Text>
                  </Text>
                </View>
                <Cover
                  coverUrl={s.coverUrl}
                  coverColor={s.coverColor}
                  title={s.title}
                  mature={s.isMature}
                  style={styles.thumb}
                />
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  title: { fontFamily: fonts.display, fontSize: 19, color: colors.ink },
  live: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.signal },
  liveText: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: colors.signal,
  },

  list: { paddingHorizontal: 20, gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    paddingVertical: 10,
    paddingHorizontal: 11,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 40, height: 40 },
  avatarInitial: { color: colors.ink, fontSize: 16, fontWeight: '600' },
  rowText: { flex: 1, minWidth: 0 },
  line1: { fontSize: 13.5 },
  name: { color: colors.ink, fontWeight: '600' },
  dim: { color: colors.inkFaint, fontSize: 12 },
  line2: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2 },
  work: { color: colors.ink, fontWeight: '500' },
  thumb: { width: 34, height: 47, borderRadius: 6 },
});
