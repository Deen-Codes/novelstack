import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, spacing, radius } from '@/theme/tokens';
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  const locked = !chapter || chapter.locked || !chapter.body;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>

        <Text style={styles.story}>{chapter?.story?.title ?? ''}</Text>
        <Text style={styles.ch}>Chapter {chapter?.number ?? ''}</Text>
        <Text style={styles.title}>{chapter?.title ?? 'Chapter'}</Text>
        <Text style={styles.body}>{locked ? chapter?.excerpt : chapter?.body}</Text>

        {locked && (
          <View style={styles.endCard}>
            <Text style={styles.endText}>That&apos;s the preview — keep reading:</Text>
            <Pressable
              style={[styles.adBtn, unlocking && { opacity: 0.6 }]}
              onPress={watchAd}
              disabled={unlocking}
            >
              <Text style={styles.adBtnText}>
                {unlocking ? 'Loading ad…' : 'Watch a short ad to continue'}
              </Text>
            </Pressable>
            <Text style={styles.plus}>No ads with NovelStack+ — $6.99/month.</Text>
          </View>
        )}

        {!locked && (
          <View style={styles.nav}>
            <Pressable
              style={[styles.navBtn, !prevId && styles.navBtnOff]}
              disabled={!prevId}
              onPress={() => prevId && router.replace(`/read/${prevId}`)}
            >
              <Text style={[styles.navText, !prevId && styles.navTextOff]}>‹ Previous</Text>
            </Pressable>
            <Pressable
              style={[styles.navBtn, styles.navBtnPrimary, !nextId && styles.navBtnOff]}
              disabled={!nextId}
              onPress={() => nextId && router.replace(`/read/${nextId}`)}
            >
              <Text style={[styles.navTextPrimary, !nextId && styles.navTextOff]}>
                Next chapter ›
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  back: { fontSize: 14, color: colors.inkMuted, marginBottom: spacing.lg },
  story: { fontSize: 12, color: colors.signal, fontWeight: '500' },
  ch: { fontSize: 12, color: colors.inkFaint, marginTop: 4 },
  title: { fontSize: 26, fontWeight: '500', color: colors.ink, marginTop: 4, marginBottom: spacing.lg },
  body: { fontSize: 19, lineHeight: 32, color: colors.ink },
  endCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.paperSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
  },
  endText: { fontSize: 13, color: colors.inkMuted, marginBottom: spacing.md },
  adBtn: { backgroundColor: colors.signal, paddingVertical: 12, paddingHorizontal: 24, borderRadius: radius.pill },
  adBtnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
  plus: { fontSize: 12, color: colors.inkFaint, marginTop: spacing.md, textAlign: 'center' },
  nav: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xl },
  navBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
  },
  navBtnPrimary: { backgroundColor: colors.signal, borderColor: colors.signal },
  navBtnOff: { opacity: 0.4 },
  navText: { fontSize: 14, color: colors.inkMuted, fontWeight: '500' },
  navTextPrimary: { fontSize: 14, color: colors.paper, fontWeight: '500' },
  navTextOff: {},
});
