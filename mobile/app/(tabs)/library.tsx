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
import { colors, spacing, radius } from '@/theme/tokens';
import { supabase } from '@/lib/supabase';

type Read = {
  chapterId: string;
  storyTitle: string;
  coverColor: string;
  label: string;
};
type Writer = { id: string; username: string; display_name: string };
type Saved = { id: string; title: string; coverColor: string; firstChapter: string | null };

export default function Library() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [reads, setReads] = useState<Read[]>([]);
  const [following, setFollowing] = useState<Writer[]>([]);
  const [saved, setSaved] = useState<Saved[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    setSignedIn(true);

    const { data: readsData } = await supabase
      .from('reads')
      .select('chapter_id, created_at, chapter:chapters(number, title, story:stories(title, cover_color))')
      .eq('reader_id', user.id)
      .order('created_at', { ascending: false })
      .limit(8);
    setReads(
      ((readsData ?? []) as any[]).map((r) => ({
        chapterId: r.chapter_id,
        storyTitle: r.chapter?.story?.title ?? 'Story',
        coverColor: r.chapter?.story?.cover_color ?? '#D85A30',
        label: `Chapter ${r.chapter?.number} · ${r.chapter?.title ?? ''}`,
      }))
    );

    const { data: followData } = await supabase
      .from('follows')
      .select('author:users!author_id(id, username, display_name)')
      .eq('follower_id', user.id);
    setFollowing(((followData ?? []) as any[]).map((f) => f.author).filter(Boolean));

    const { data: bmData } = await supabase
      .from('bookmarks')
      .select('story:stories(id, title, cover_color, chapters(id, number, published_at))')
      .eq('reader_id', user.id);
    setSaved(
      ((bmData ?? []) as any[])
        .map((b) => b.story)
        .filter(Boolean)
        .map((s: any) => {
          const chs = (s.chapters ?? []).filter((c: any) => c.published_at).sort((a: any, x: any) => a.number - x.number);
          return {
            id: s.id,
            title: s.title,
            coverColor: s.cover_color ?? '#4F4AAA',
            firstChapter: chs[0]?.id ?? null,
          };
        })
    );

    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

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
        <View style={styles.body}>
          <Text style={styles.h1}>Your library</Text>
          <Text style={styles.sub}>
            Sign in to keep your followed writers, saved stories, and reading history.
          </Text>
          <Pressable style={styles.btn} onPress={() => router.push('/signin')}>
            <Text style={styles.btnText}>Sign in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>Your library</Text>

        <Text style={styles.section}>Continue reading</Text>
        {reads.length === 0 ? (
          <Text style={styles.empty}>Stories you open show up here so you can pick up where you left off.</Text>
        ) : (
          reads.map((r) => (
            <Pressable
              key={r.chapterId}
              style={styles.readRow}
              onPress={() => router.push(`/read/${r.chapterId}`)}
            >
              <View style={[styles.miniCover, { backgroundColor: r.coverColor }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{r.storyTitle}</Text>
                <Text style={styles.meta}>{r.label}</Text>
              </View>
            </Pressable>
          ))
        )}

        <Text style={styles.section}>Writers you follow</Text>
        {following.length === 0 ? (
          <Text style={styles.empty}>Follow writers to keep up with their new chapters.</Text>
        ) : (
          <View style={styles.chips}>
            {following.map((w) => (
              <View key={w.id} style={styles.writerChip}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{w.display_name.slice(0, 1).toUpperCase()}</Text>
                </View>
                <Text style={styles.chipText}>{w.display_name}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.section}>Saved stories</Text>
        {saved.length === 0 ? (
          <Text style={styles.empty}>Tap “Save” on any story to keep it here.</Text>
        ) : (
          <View style={styles.grid}>
            {saved.map((s) => (
              <Pressable
                key={s.id}
                style={styles.gridItem}
                onPress={() => router.push(`/story/${s.id}`)}
              >
                <View style={[styles.gridCover, { backgroundColor: s.coverColor }]} />
                <Text style={styles.gridTitle}>{s.title}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  body: { padding: spacing.lg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  h1: { fontSize: 28, fontWeight: '500', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.sm, lineHeight: 21 },
  section: { fontSize: 16, fontWeight: '500', color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.md },
  empty: { fontSize: 13, color: colors.inkMuted, lineHeight: 20 },
  readRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  miniCover: { width: 36, height: 48, borderRadius: radius.sm },
  rowTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  meta: { fontSize: 12, color: colors.inkFaint, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  writerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    paddingLeft: 4,
    paddingRight: 14,
    paddingVertical: 4,
    backgroundColor: colors.white,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.paperSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 12, color: colors.signal, fontWeight: '500' },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.ink },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '47%' },
  gridCover: { width: '100%', aspectRatio: 3 / 4, borderRadius: radius.md },
  gridTitle: { fontSize: 13, fontWeight: '500', color: colors.ink, marginTop: 6 },
  btn: {
    marginTop: spacing.lg,
    backgroundColor: colors.signal,
    paddingVertical: 12,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  btnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
});
