import { useCallback, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGetCached, apiSend, getSessionToken } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { TopBar } from '@/components/TopBar';
import { useTabScroll } from '@/lib/useTabScroll';
import { Cover } from '@/components/Cover';
import { SignInPitch } from '@/components/SignInPitch';
import { AmbientGlow } from '@/components/AmbientGlow';
import { StaggerIn } from '@/components/StaggerIn';
import type { Shelf, Story } from '@/lib/types';

// A saved book counts as finished once every published chapter is read.
function isFinished(s: Story): boolean {
  const p = s.progress;
  return !!p && p.total > 0 && p.completed >= p.total;
}

export default function Library() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [saved, setSaved] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [tab, setTab] = useState<'reading' | 'finished'>('reading');

  const load = useCallback(async () => {
    const token = await getSessionToken();
    if (!token) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    // Verify the stored token is actually valid — a rejected token (server
    // signed out, AUTH_SECRET rotated, JWT expired) should fall back to the
    // SignInPitch instead of pretending we're signed in with empty data.
    const user = await getCurrentUser();
    if (!user) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    try {
      const data = await apiGetCached<Shelf>('/api/me/shelf');
      setSaved(data.saved ?? []);
      setSignedIn(true);
    } catch {
      setSignedIn(false);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  async function removeSaved(story: Story) {
    if (pendingId) return;
    setPendingId(story.id);
    try {
      await apiSend('/api/bookmarks', 'POST', { storyId: story.id, action: 'remove' });
      setSaved((list) => list.filter((s) => s.id !== story.id));
    } catch {
      // Leave the list unchanged on failure.
    }
    setPendingId(null);
  }

  function bookCell(s: Story, withProgress: boolean, index: number) {
    const p = s.progress;
    const total = p?.total ?? 0;
    const done = p?.completed ?? 0;
    const pct = total > 0 ? Math.max(3, Math.round((done / total) * 100)) : 0;
    return (
      <StaggerIn key={s.id} index={index} style={styles.gridItem}>
        <Pressable onPress={() => router.push(`/story/${s.slug}`)}>
          <Cover
            coverUrl={s.coverUrl}
            coverColor={s.coverColor}
            title={s.title}
            mature={s.isMature}
            style={styles.gridCover}
          />
        </Pressable>
        <Pressable
          style={[styles.removeBtn, pendingId === s.id && styles.btnBusy]}
          onPress={() => removeSaved(s)}
          disabled={pendingId === s.id}
          hitSlop={8}
        >
          {pendingId === s.id ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="close" size={14} color="#FFFFFF" />
          )}
        </Pressable>
        {withProgress && total > 0 && (
          <>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${pct}%` }]} />
            </View>
            <Text style={styles.progressText}>
              {done} of {total} chapter{total === 1 ? '' : 's'}
            </Text>
          </>
        )}
        <Text style={styles.gridTitle} numberOfLines={2}>
          {s.title}
        </Text>
      </StaggerIn>
    );
  }

  const { scrollRef, scrollY, topPad, onScroll } = useTabScroll();
  const insets = useSafeAreaInsets();

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 + topPad }} />
        <TopBar page="library" />
      </SafeAreaView>
    );
  }

  if (signedIn === false) {
    return (
      <SafeAreaView style={styles.safe} edges={[]}>
        <AmbientGlow />
        <View style={{ paddingTop: topPad }}>
          <SignInPitch
            headline="Build your library"
            sub="Save stories, pick up where you left off, and follow the writers you love — all kept in sync."
          />
        </View>
        <TopBar page="library" />
      </SafeAreaView>
    );
  }

  const reading = saved.filter((s) => !isFinished(s));
  const finished = saved.filter(isFinished);
  const isEmpty = saved.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <AmbientGlow />
      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          isEmpty ? styles.scrollEmpty : styles.scroll,
          { paddingTop: topPad },
        ]}
        scrollEventThrottle={16}
        onScroll={onScroll}
      >
        {isEmpty ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIcon}>
              <Ionicons name="bookmark" size={28} color={colors.signal} />
            </View>
            <Text style={styles.emptyTitle}>Your library is empty</Text>
            <Text style={styles.emptyBody}>
              Save a story and it lands here — every book you start reading is
              kept in sync, ready to pick back up.
            </Text>
            <Pressable style={styles.browseBtn} onPress={() => router.push('/')}>
              <Ionicons name="compass-outline" size={18} color="#15100E" />
              <Text style={styles.browseBtnText}>Browse stories</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {(tab === 'reading' ? reading : finished).length === 0 ? (
              <Text style={styles.tabEmpty}>
                {tab === 'reading'
                  ? 'Nothing in progress right now — open a saved story to start reading.'
                  : 'No completed books yet. Finish a story and it moves here.'}
              </Text>
            ) : (
              <View style={styles.grid}>
                {(tab === 'reading' ? reading : finished).map((s, i) =>
                  bookCell(s, tab === 'reading', i),
                )}
              </View>
            )}
          </>
        )}
      </Animated.ScrollView>

      {/* Floating segmented control — selected pill on top with a cream
          box, deselected sits beneath as plain grey text. Tapping the
          deselected one promotes it to the top. */}
      {!isEmpty && (
        <View
          style={[
            styles.floatTabs,
            { bottom: insets.bottom + 78 + 16, right: 16 },
          ]}
          pointerEvents="box-none"
        >
          {(tab === 'reading'
            ? (['reading', 'finished'] as const)
            : (['finished', 'reading'] as const)
          ).map((t) => {
            const selected = tab === t;
            const label = t === 'reading' ? 'In progress' : 'Completed';
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                style={[styles.floatPill, selected && styles.floatPillOn]}
                hitSlop={6}
              >
                <Text
                  style={[
                    styles.floatPillText,
                    selected && styles.floatPillTextOn,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      <TopBar page="library" scrollY={scrollY} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  scrollEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    paddingBottom: 90,
  },
  section: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  completedHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: spacing.xl,
  },

  tabEmpty: { fontSize: 13, color: colors.inkMuted, lineHeight: 19, marginTop: spacing.lg },

  // Floating segmented control on bottom-right. Stacked vertically with the
  // selected pill always on top (cream box, dark text), the deselected one
  // sits beneath as plain grey text — taps on it swap positions.
  floatTabs: {
    position: 'absolute',
    alignItems: 'flex-end',
    gap: 6,
  },
  floatPill: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  floatPillOn: {
    backgroundColor: '#F4ECDF',
    shadowColor: '#000',
    shadowOpacity: 0.32,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  // Subtitle-sized — reads clearly near the thumb without competing with
  // the topbar title.
  floatPillText: { fontSize: 16, fontWeight: '600', color: colors.inkFaint, letterSpacing: -0.2 },
  floatPillTextOn: { color: '#15100E', fontWeight: '700' },

  emptyWrap: { alignItems: 'center', paddingHorizontal: 16 },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 21,
    color: colors.ink,
    marginTop: spacing.lg,
  },
  emptyBody: {
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F4ECDF',
    borderRadius: 13,
    paddingHorizontal: 22,
    height: 50,
    marginTop: spacing.xl,
  },
  browseBtnText: { fontSize: 14, fontWeight: '700', color: '#15100E' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '31%' },
  gridCover: { width: '100%', aspectRatio: 3 / 4, borderRadius: 9 },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(20,16,10,0.8)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBusy: { opacity: 0.5 },
  track: {
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.borderSoft,
    marginTop: 7,
  },
  fill: { height: 3, borderRadius: radius.pill, backgroundColor: colors.signal },
  progressText: { fontSize: 10, color: colors.inkFaint, marginTop: 4 },
  gridTitle: { fontSize: 11.5, fontWeight: '500', color: colors.ink, marginTop: 5 },
});
