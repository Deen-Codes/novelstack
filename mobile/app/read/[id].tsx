import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { colors, paperMode, spacing, radius, fonts } from '@/theme/tokens';
import { AdBanner } from '@/components/AdBanner';
import { apiGet, apiGetCached, apiSend } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { MarkdownText } from '@/components/MarkdownText';
import { useReadingWidth } from '@/components/PageContainer';
import type { ChapterDetail, StoryDetail } from '@/lib/types';

// Strips the fiction-Markdown down to clean prose for text-to-speech, so the
// narrator never reads out "asterisk asterisk" or an image URL.
function plainText(md: string): string {
  return (md ?? '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s{0,3}>\s?/gm, '')
    .replace(/^\s*(?:\*\s*){3,}\s*$/gm, ' ')
    .replace(/^\s*[-_]{3,}\s*$/gm, ' ')
    .replace(/\*\*|__/g, '')
    .replace(/[*_]/g, '')
    .trim();
}

// Reader: full body if entitled, otherwise the excerpt preview + a (simulated)
// rewarded-ad gate. The top progress bar tracks position through the WHOLE
// book — (chapters done + scroll within this chapter) / total chapters — so it
// stays meaningful on both long and short chapters.
export default function Reader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [chapter, setChapter] = useState<ChapterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  // Cap line length on iPad — fiction past ~70ch is fatiguing.
  const ipadPad = useReadingWidth();
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);
  // True when the next chapter is a paid chapter — reading on costs an ad.
  const [nextNeedsAd, setNextNeedsAd] = useState(false);
  // Position of this chapter within the book, and the book's chapter count.
  const [chapterPos, setChapterPos] = useState(0);
  const [chapterCount, setChapterCount] = useState(0);
  // 0..1 scroll fraction within the current chapter.
  const [scrollFrac, setScrollFrac] = useState(0);
  // Local-only reading-mode toggle: false = dark theme, true = light "paper".
  const [paper, setPaper] = useState(false);
  // True while the chapter is being read aloud (on-device text-to-speech).
  const [speaking, setSpeaking] = useState(false);
  // Document-order index of the word being narrated, for read-along highlight.
  const [activeWord, setActiveWord] = useState<number | null>(null);
  // Char offset of every word in the spoken text — maps onBoundary to a word.
  const wordStarts = useRef<number[]>([]);

  // When a signed-in reader opens a chapter they can read: record progress
  // (keeps the feed's genre affinity fresh) and auto-save the story.
  async function recordOpen(ch: ChapterDetail) {
    const user = await getCurrentUser();
    if (!user) return;
    try {
      // Register that the chapter was opened — keeps the feed's genre affinity
      // fresh and puts the story in "Continue reading". The Finish button at
      // the end of a book is what flips `completed: true`.
      await apiSend('/api/reads', 'POST', { chapterId: ch.id, progressPct: 1, completed: false });
    } catch {
      // Best-effort.
    }
    try {
      await apiSend('/api/bookmarks', 'POST', { storyId: ch.story.id, action: 'add' });
    } catch {
      // Best-effort.
    }
  }

  async function load() {
    setLoading(true);
    setScrollFrac(0);
    // Stop any narration carried over from the previous chapter.
    Speech.stop();
    setSpeaking(false);
    setActiveWord(null);
    let ch: ChapterDetail;
    try {
      ch = await apiGet<ChapterDetail>(`/api/chapters/${id}`);
    } catch {
      setChapter(null);
      setLoading(false);
      return;
    }
    setChapter(ch);

    // Prev / next + this chapter's position within the book.
    try {
      // Cached — moving Next/Previous through a book reuses the chapter list
      // instead of refetching the whole story each hop.
      const story = await apiGetCached<StoryDetail>(`/api/stories/${ch.story.slug}`);
      const list = story.chapters
        .filter((c) => c.publishedAt)
        .sort((a, b) => a.number - b.number);
      const idx = list.findIndex((c) => c.id === id);
      const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
      setPrevId(idx > 0 ? list[idx - 1].id : null);
      setNextId(next ? next.id : null);
      setNextNeedsAd(!!next && next.isFree === false);
      setChapterPos(idx >= 0 ? idx : 0);
      setChapterCount(list.length);
    } catch {
      setPrevId(null);
      setNextId(null);
      setNextNeedsAd(false);
      setChapterPos(0);
      setChapterCount(0);
    }

    if (!ch.locked && ch.body) recordOpen(ch);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // Always stop narration when leaving the reader.
    return () => {
      Speech.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Read-aloud: narrates the chapter with on-device TTS and highlights each
  // word as it is spoken. onBoundary reports the character index of the word
  // being voiced; we map that to a word index the renderer can light up.
  function toggleReadAloud() {
    if (speaking) {
      Speech.stop();
      setSpeaking(false);
      setActiveWord(null);
      return;
    }
    if (!chapter) return;
    const lockedNow = chapter.locked || !chapter.body;
    const source = lockedNow ? chapter.excerpt ?? '' : chapter.body ?? '';
    const text = plainText(source);
    if (!text) return;

    // Record where every word starts so a boundary char-index maps to a word.
    const starts: number[] = [];
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) starts.push(m.index);
    if (starts.length === 0) return;
    wordStarts.current = starts;

    setSpeaking(true);
    setActiveWord(0);
    Speech.speak(text, {
      onBoundary: (ev: { charIndex?: number } | null) => {
        const ci = ev?.charIndex ?? 0;
        const arr = wordStarts.current;
        // Binary search for the largest word-start <= the spoken char index.
        let lo = 0;
        let hi = arr.length - 1;
        let idx = 0;
        while (lo <= hi) {
          const mid = (lo + hi) >> 1;
          if (arr[mid] <= ci) {
            idx = mid;
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }
        setActiveWord(idx);
      },
      onDone: () => {
        setSpeaking(false);
        setActiveWord(null);
      },
      onStopped: () => setActiveWord(null),
      onError: () => {
        setSpeaking(false);
        setActiveWord(null);
      },
    });
  }

  // "Finish book" / "All caught up" — marks every chapter read so the book
  // moves to the Completed & up-to-date shelf, then returns to the story.
  async function finishBook() {
    if (!chapter) return;
    try {
      await apiSend(`/api/me/stories/${chapter.story.id}/finish`, 'POST');
    } catch {
      // Return to the story even if recording failed.
    }
    router.replace(`/story/${chapter.story.slug}`);
  }

  // Track scroll position within the current chapter. A chapter that doesn't
  // scroll contributes 0, so the bar simply rests at this chapter's mark.
  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const scrollable = contentSize.height - layoutMeasurement.height;
    const frac = scrollable > 4 ? Math.min(1, Math.max(0, contentOffset.y / scrollable)) : 0;
    setScrollFrac((prev) => (Math.abs(frac - prev) > 0.004 ? frac : prev));
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

  // Primary-button palette — cream on the dark theme, ink on paper, so the
  // call to action stays high-contrast in either reading mode.
  const primaryBg = paper ? paperMode.ink : colors.cream;
  const primaryInk = paper ? paperMode.bg : colors.creamInk;

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
          <Pressable
            style={[styles.circleBtn, { backgroundColor: theme.surface }]}
            onPress={() => router.back()}
            hitSlop={8}
          >
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
  // Whole-book progress: chapters fully behind us + scroll through this one.
  const bookProgress =
    chapterCount > 0
      ? Math.min(1, Math.max(0, (chapterPos + scrollFrac) / chapterCount))
      : 0;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.bg }]} edges={['top']}>
      {/* Top bar: back / story title + chapter count / Aa toggle */}
      <View style={styles.topBar}>
        <Pressable
          style={[styles.circleBtn, { backgroundColor: theme.surface }]}
          onPress={() => router.back()}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color={theme.ink} />
        </Pressable>

        <View style={styles.topCenter}>
          <Text style={[styles.topTitle, { color: theme.ink }]} numberOfLines={1}>
            {chapter.story?.title ?? ''}
          </Text>
          <Text style={[styles.topSub, { color: theme.inkMuted }]} numberOfLines={1}>
            Chapter {chapter.number ?? ''}
            {chapterCount > 0 ? ` of ${chapterCount}` : ''}
            {chapterCount > 0 ? `  ·  ${Math.round(bookProgress * 100)}% read` : ''}
          </Text>
        </View>

        <Pressable
          style={[styles.circleBtn, { backgroundColor: theme.surface }]}
          onPress={toggleReadAloud}
          hitSlop={8}
        >
          <Ionicons
            name={speaking ? 'stop' : 'headset-outline'}
            size={19}
            color={speaking ? colors.signal : theme.ink}
          />
        </Pressable>

        <Pressable
          style={[styles.circleBtn, { backgroundColor: theme.surface }]}
          onPress={() => setPaper((p) => !p)}
          hitSlop={8}
        >
          <Text style={[styles.aa, { color: theme.ink }]}>Aa</Text>
        </Pressable>
      </View>

      {/* Whole-book progress bar */}
      <View style={[styles.progressTrack, { backgroundColor: theme.track }]}>
        <View style={[styles.progressFill, { width: `${bookProgress * 100}%` }]} />
      </View>

      {/* Body */}
      <ScrollView
        contentContainerStyle={[styles.scroll, ipadPad]}
        onScroll={onScroll}
        scrollEventThrottle={32}
      >
        <Text style={styles.chLabel}>Chapter {chapter.number ?? ''}</Text>
        <Text style={[styles.chTitle, { color: theme.ink }]}>{chapter.title ?? 'Chapter'}</Text>

        <MarkdownText
          body={locked ? chapter.excerpt ?? '' : chapter.body ?? ''}
          color={theme.ink}
          faint={theme.inkFaint}
          activeWord={speaking && activeWord !== null ? activeWord : undefined}
        />

      </ScrollView>

      {/* Ad banner — anchored above the nav buttons, hidden for NovelStack+
          members. AdBanner hides itself entirely if AdMob can't fill,
          so the reader sees the chapter close to the nav buttons instead
          of an awkward "ad did not load" stripe. */}
      {chapter.showAds && (
        <AdBanner style={{ borderTopWidth: 1, borderTopColor: theme.border }} />
      )}

      {/* Footer: big prev / next buttons */}
      <View style={[styles.footer, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
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

          {nextId ? (
            <Pressable
              style={[styles.navBtn, styles.navPrimary, { backgroundColor: primaryBg }]}
              onPress={() =>
                router.replace(
                  nextNeedsAd ? `/watch-ad?chapterId=${nextId}` : `/read/${nextId}`,
                )
              }
            >
              {nextNeedsAd && (
                <Ionicons name="play-circle" size={17} color={primaryInk} />
              )}
              <Text style={[styles.navPrimaryText, { color: primaryInk }]}>
                {nextNeedsAd ? 'Watch ad · Next' : 'Next chapter'}
              </Text>
              {!nextNeedsAd && (
                <Ionicons name="chevron-forward" size={18} color={primaryInk} />
              )}
            </Pressable>
          ) : (
            <Pressable
              style={[styles.navBtn, styles.navPrimary, { backgroundColor: primaryBg }]}
              onPress={finishBook}
            >
              <Ionicons
                name={chapter.story?.status === 'complete' ? 'checkmark' : 'sparkles'}
                size={17}
                color={primaryInk}
              />
              <Text style={[styles.navPrimaryText, { color: primaryInk }]}>
                {chapter.story?.status === 'complete' ? 'Finish book' : 'All caught up'}
              </Text>
            </Pressable>
          )}
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
  topCenter: { flex: 1, alignItems: 'center' },
  topTitle: { fontSize: 13, fontWeight: '600' },
  topSub: { fontSize: 11, marginTop: 1 },
  aa: { fontFamily: 'serif', fontSize: 18, fontWeight: '600' },

  progressTrack: { height: 3, width: '100%' },
  progressFill: { height: 3, backgroundColor: colors.signal },

  adBar: { alignItems: 'center', borderTopWidth: 1, paddingVertical: 4 },

  scroll: { padding: spacing.lg, paddingBottom: spacing.xl },
  chLabel: {
    fontSize: 12,
    letterSpacing: 1,
    color: colors.signal,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  chTitle: {
    fontFamily: fonts.display,
    fontSize: 26,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 13,
  },
  adBtnText: { fontSize: 14, fontWeight: '700' },
  plus: { fontSize: 12.5, fontWeight: '600', marginTop: spacing.md, textAlign: 'center' },

  notFound: { alignItems: 'center', marginTop: 80 },
  notFoundText: { fontSize: 15 },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderTopWidth: 1,
  },
  navRow: { flexDirection: 'row', gap: spacing.sm },
  navBtn: {
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  navSecondary: { flex: 1, borderWidth: 1 },
  navSecondaryText: { fontSize: 15, fontWeight: '600' },
  navPrimary: { flex: 1.5 },
  navPrimaryText: { fontSize: 15, fontWeight: '700' },
  navOff: { opacity: 0.35 },
});
