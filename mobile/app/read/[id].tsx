import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, paperMode, spacing, radius } from '@/theme/tokens';
import { apiGet, apiSend } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import type { ChapterDetail, StoryDetail } from '@/lib/types';

// Mirrors the web reader: full body if entitled, otherwise the excerpt
// preview + a (simulated) rewarded-ad gate. Records reading progress so the
// Home feed's genre affinity stays current, and offers prev/next navigation.
export default function Reader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);
  // Local-only reading-mode toggle: false = dark theme, true = light "paper".
  const [paper, setPaper] = useState(false);

  // When a signed-in reader opens a chapter they can read: record progress
  // (keeps the feed's genre affinity fresh) and auto-save the story to their
  // library, so opening a book and reading a bit shelves it automatically.
  async function recordOpen(ch: ChapterDetail) {
    const user = await getCurrentUser();
    if (!user) return;
    try {
      await apiSend('/api/reads', 'POST', {
        chapterId: ch.id,
        progressPct: 100,
        completed: true,
      });
    } catch {
      // Best-effort — ignore failures.
    }
    try {
      await apiSend('/api/bookmarks', 'POST', { storyId: ch.story.id, action: 'add' });
    } catch {
      // Best-effort — ignore failures.
    }
  }

  async function load() {
    setLoading(true);
    let ch: ChapterDetail;
    try {
      ch = await apiGet<ChapterDetail>(`/api/chapters/${id}`);
    } catch {
      setChapter(null);
      setLoading(false);
      return;
    }
    setChapter(ch);

    // Prev / next within the story (published chapters only).
    try {
      const story = await apiGet<StoryDetail>(`/api/stories/${ch.story.slug}`);
      const list = story.chapters
        .filter((c) => c.publishedAt)
        .sort((a, b) => a.number - b.number);
      const idx = list.findIndex((c) => c.id === id);
      setPrevId(idx > 0 ? list[idx - 1].id : null);
      setNextId(idx >= 0 && idx < list.length - 1 ? list[idx + 1].id : null);
    } catch {
      setPrevId(null);
      setNextId(null);
    }

    // Entitled read → record progress, interest signal, and auto-save.
    if (!ch.locked && ch.body) recordOpen(ch);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function watchAd() {
    setUnlocking(true);
    await new Promise((r) => setTimeout(r, 2000)); // simulated rewarded ad
    // The ad-unlock endpoint is not part of the current API; re-fetch so the
    // chapter reflects any entitlement the viewer already has.
    await load();
    setUnlocking(false);
  }

  // Active palette derived from the reading-mode toggle.
  const theme = paper
    ? {
        bg: paperMode.bg,
        surface: paperMode.surface,
        ink: paperMode.ink,
        inkMuted: paperMode.inkMuted,
        inkFaint: paperMode.inkMuted,
        border: paperMode.border,
        track: paperMode.border,
      }
    : {
        bg: colors.paper,
        surface: colors.card,
        ink: colors.ink,
        inkMuted: colors.inkMuted,
        inkFaint: colors.inkFaint,
        border: colors.border,
        track: colors.borderSoft,
      };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (!chapter) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
        <View style={styles.topBar}>
          <Pressable style={[styles.circleBtn, { backgroundColor: theme.surface }]} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color={theme.ink} />
          </Pressable>
          <View style={{ flex: 1 }} />
          <View style={{ width: 46 }} />
        </View>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: theme.inkMuted }]}>Chapter not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const locked = chapter.locked || !chapter.body;
  // Progress is full once an entitled chapter is open; preview-only otherwise.
  const progress = locked ? 0.12 : 1;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      {/* Top bar: back / story title / Aa reading-mode toggle */}
      <View style={styles.topBar}>
        <Pressable
          style={[styles.circleBtn, { backgroundColor: theme.surface }]}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={theme.ink} />
        </Pressable>

        <Text style={[styles.topTitle, { color: theme.inkMuted }]} numberOfLines={1}>
          {chapter.story?.title ?? ''}
        </Text>

        <Pressable
          style={[styles.circleBtn, { backgroundColor: theme.surface }]}
          onPress={() => setPaper((p) => !p)}
          hitSlop={8}
        >
          <Text style={[styles.aa, { color: theme.ink }]}>Aa</Text>
        </Pressable>
      </View>

      {/* Body */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.chLabel}>Chapter {chapter.number ?? ''}</Text>
        <Text style={[styles.chTitle, { color: theme.ink }]}>{chapter.title ?? 'Chapter'}</Text>

        <Text style={[styles.prose, { color: theme.ink }]}>
          {locked ? chapter.excerpt : chapter.body}
        </Text>

        {locked && (
          <View style={[styles.endCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.endText, { color: theme.inkMuted }]}>
              That&apos;s the preview — keep reading:
            </Text>
            <Pressable
              style={[styles.adBtn, unlocking && { opacity: 0.6 }]}
              onPress={watchAd}
              disabled={unlocking}
            >
              <Text style={styles.adBtnText}>
                {unlocking ? 'Loading ad…' : 'Watch a short ad to continue'}
              </Text>
            </Pressable>
            <Text style={[styles.plus, { color: theme.inkFaint }]}>
              No ads with NovelStack+ — $6.99/month.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer: progress bar + big prev / next buttons */}
      <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
        <View style={[styles.track, { backgroundColor: theme.track }]}>
          <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
        </View>

        <View style={styles.navRow}>
          <Pressable
            style={[
              styles.navBtn,
              styles.navSecondary,
              { backgroundColor: theme.surface, borderColor: theme.border },
              !prevId && styles.navOff,
            ]}
            disabled={!prevId}
            onPress={() => prevId && router.replace(`/read/${prevId}`)}
          >
            <Ionicons name="chevron-back" size={18} color={theme.ink} />
            <Text style={[styles.navSecondaryText, { color: theme.ink }]}>Previous</Text>
          </Pressable>

          <Pressable
            style={[styles.navBtn, styles.navPrimary, !nextId && styles.navOff]}
            disabled={!nextId}
            onPress={() => nextId && router.replace(`/read/${nextId}`)}
          >
            <Text style={styles.navPrimaryText}>Next chapter</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.ink} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  circleBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: { flex: 1, fontSize: 13, textAlign: 'center', fontWeight: '500' },
  aa: { fontFamily: 'serif', fontSize: 18, fontWeight: '600' },

  scroll: { padding: spacing.lg, paddingBottom: spacing.xl },
  chLabel: {
    fontSize: 12,
    letterSpacing: 1,
    color: colors.signal,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  chTitle: {
    fontFamily: 'serif',
    fontSize: 27,
    fontWeight: '500',
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  prose: { fontFamily: 'serif', fontSize: 18, lineHeight: 31 },

  endCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  endText: { fontSize: 13, marginBottom: spacing.md },
  adBtn: {
    backgroundColor: colors.signal,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
  },
  adBtnText: { color: colors.ink, fontSize: 14, fontWeight: '500' },
  plus: { fontSize: 12, marginTop: spacing.md, textAlign: 'center' },

  notFound: { alignItems: 'center', marginTop: 80 },
  notFoundText: { fontSize: 15 },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
  },
  track: {
    height: 3,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  fill: { height: 3, backgroundColor: colors.signal, borderRadius: radius.pill },

  navRow: { flexDirection: 'row', gap: spacing.sm },
  navBtn: {
    height: 54,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  navSecondary: {
    flex: 1,
    borderWidth: 1,
  },
  navSecondaryText: { fontSize: 15, fontWeight: '500' },
  navPrimary: {
    flex: 1.5,
    backgroundColor: colors.signal,
  },
  navPrimaryText: { fontSize: 15, fontWeight: '600', color: colors.ink },
  navOff: { opacity: 0.35 },
});
