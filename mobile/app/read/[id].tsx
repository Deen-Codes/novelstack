import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, spacing, radius } from '@/theme/tokens';
import { supabase } from '@/lib/supabase';

// Mirrors the web reader: full body if entitled, otherwise the excerpt
// preview + a (simulated) rewarded-ad gate. Records reading progress and
// a reading_event so the Home feed's genre affinity stays current (Q3),
// and offers prev/next navigation within the story.
export default function Reader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [chapter, setChapter] = useState<any>(null);
  const [body, setBody] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [prevId, setPrevId] = useState<string | null>(null);
  const [nextId, setNextId] = useState<string | null>(null);

  async function markProgress(chapterId: string, storyId: string, genre: string | null) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    // Snapshot subscriber status — it drives the writer-payout pool split.
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('reader_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    await supabase.from('reads').upsert(
      {
        reader_id: user.id,
        chapter_id: chapterId,
        progress_pct: 100,
        completed_at: new Date().toISOString(),
        is_subscriber: !!sub,
      },
      { onConflict: 'reader_id,chapter_id' }
    );
    await supabase.from('reading_events').insert({
      user_id: user.id,
      story_id: storyId,
      genre,
      event: 'read',
    });
  }

  async function load() {
    setLoading(true);
    const { data: ch } = await supabase
      .from('chapters')
      .select('*, story:stories(id, title, genre)')
      .eq('id', id)
      .single();
    setChapter(ch);

    const { data: content } = await supabase
      .from('chapter_content')
      .select('body')
      .eq('chapter_id', id)
      .single();
    const fullBody = (content as { body: string } | null)?.body ?? null;
    setBody(fullBody);

    // Prev / next within the story (published chapters only).
    if (ch?.story?.id) {
      const { data: sibs } = await supabase
        .from('chapters')
        .select('id, number')
        .eq('story_id', ch.story.id)
        .not('published_at', 'is', null)
        .order('number');
      const list = (sibs ?? []) as { id: string; number: number }[];
      const idx = list.findIndex((c) => c.id === id);
      setPrevId(idx > 0 ? list[idx - 1].id : null);
      setNextId(idx >= 0 && idx < list.length - 1 ? list[idx + 1].id : null);

      // Entitled read → record progress + interest signal.
      if (fullBody) markProgress(String(id), ch.story.id, ch.story.genre ?? null);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function watchAd() {
    setUnlocking(true);
    await new Promise((r) => setTimeout(r, 2000)); // simulated rewarded ad
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('ad_unlocks').insert({ reader_id: user.id, chapter_id: id });
      await load();
    }
    setUnlocking(false);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  const locked = !body;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>

        <Text style={styles.story}>{chapter?.story?.title ?? ''}</Text>
        <Text style={styles.ch}>Chapter {chapter?.number ?? ''}</Text>
        <Text style={styles.title}>{chapter?.title ?? 'Chapter'}</Text>
        <Text style={styles.body}>{locked ? chapter?.excerpt : body}</Text>

        {locked && (
          <View style={styles.endCard}>
            <Text style={styles.endText}>That's the preview — keep reading:</Text>
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
