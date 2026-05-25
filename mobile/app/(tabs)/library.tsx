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
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGetCached, apiSend, getSessionToken } from '@/lib/api';
import { TopBar } from '@/components/TopBar';
import { Cover } from '@/components/Cover';
import { SignInPitch } from '@/components/SignInPitch';
import { AmbientGlow } from '@/components/AmbientGlow';
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

  function bookCell(s: Story, withProgress: boolean) {
    const p = s.progress;
    const total = p?.total ?? 0;
    const done = p?.completed ?? 0;
    const pct = total > 0 ? Math.max(3, Math.round((done / total) * 100)) : 0;
    return (
      <View key={s.id} style={styles.gridItem}>
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
      </View>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar page="library" />
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (signedIn === false) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <AmbientGlow />
        <TopBar page="library" />
        <SignInPitch
          headline="Build your library"
          sub="Save stories, pick up where you left off, and follow the writers you love — all kept in sync."
        />
      </SafeAreaView>
    );
  }

  const reading = saved.filter((s) => !isFinished(s));
  const finished = saved.filter(isFinished);
  const isEmpty = saved.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AmbientGlow />
      <TopBar page="library" />
      <ScrollView contentContainerStyle={isEmpty ? styles.scrollEmpty : styles.scroll}>
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
            <View style={styles.tabs}>
              <Pressable
                style={[styles.tab, tab === 'reading' && styles.tabOn]}
                onPress={() => setTab('reading')}
              >
                <Text style={[styles.tabText, tab === 'reading' && styles.tabTextOn]}>
                  In progress
                </Text>
              </Pressable>
              <Pressable
                style={[styles.tab, tab === 'finished' && styles.tabOn]}
                onPress={() => setTab('finished')}
              >
                <Text style={[styles.tabText, tab === 'finished' && styles.tabTextOn]}>
                  Completed
                </Text>
              </Pressable>
            </View>
            {(tab === 'reading' ? reading : finished).length === 0 ? (
              <Text style={styles.tabEmpty}>
                {tab === 'reading'
                  ? 'Nothing in progress right now — open a saved story to start reading.'
                  : 'No completed books yet. Finish a story and it moves here.'}
              </Text>
            ) : (
              <View style={styles.grid}>
                {(tab === 'reading' ? reading : finished).map((s) =>
                  bookCell(s, tab === 'reading'),
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
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

  // In progress / Completed switcher.
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabOn: { backgroundColor: colors.signal, borderColor: colors.signal },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.inkFaint },
  tabTextOn: { color: '#FFFFFF' },
  tabEmpty: { fontSize: 13, color: colors.inkMuted, lineHeight: 19 },

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
