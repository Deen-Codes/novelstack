import { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, radius } from '@/theme/tokens';
import { supabase } from '@/lib/supabase';
import { viewerIsAdult } from '@/lib/age';

type StoryHit = {
  id: string;
  title: string;
  genre: string;
  cover_color: string;
  author: string;
  firstChapter: string | null;
};
type WriterHit = { id: string; username: string; display_name: string };

const GENRES = ['romance', 'fantasy', 'scifi', 'thriller', 'mystery', 'horror'];

export default function Search() {
  const [q, setQ] = useState('');
  const [stories, setStories] = useState<StoryHit[]>([]);
  const [writers, setWriters] = useState<WriterHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function run(term: string, genre?: string) {
    if (!term.trim() && !genre) {
      setStories([]);
      setWriters([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    const adult = await viewerIsAdult();

    let sq = supabase
      .from('stories')
      .select('id, title, genre, cover_color, is_mature, author:users(display_name), chapters(id, number)')
      .neq('status', 'draft')
      .limit(25);
    if (!adult) sq = sq.eq('is_mature', false);
    if (genre) sq = sq.eq('genre', genre);
    if (term.trim()) sq = sq.ilike('title', `%${term.trim()}%`);

    const wq = term.trim()
      ? supabase
          .from('users')
          .select('id, username, display_name')
          .or(`display_name.ilike.%${term.trim()}%,username.ilike.%${term.trim()}%`)
          .limit(15)
      : Promise.resolve({ data: [] as any[] });

    const [{ data: sd }, { data: wd }] = await Promise.all([sq, wq as any]);

    setStories(
      ((sd ?? []) as any[]).map((s) => {
        const chs = (s.chapters ?? []).sort((a: any, b: any) => a.number - b.number);
        return {
          id: s.id,
          title: s.title,
          genre: s.genre,
          cover_color: s.cover_color ?? '#D85A30',
          author: s.author?.display_name ?? 'Unknown',
          firstChapter: chs[0]?.id ?? null,
        };
      })
    );
    setWriters((wd ?? []) as WriterHit[]);
    setSearched(true);
    setLoading(false);
  }

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => run(q), 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>Search</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Titles and writers…"
          placeholderTextColor={colors.inkFaint}
          autoCapitalize="none"
          style={styles.input}
        />

        <View style={styles.chips}>
          {GENRES.map((g) => (
            <Pressable
              key={g}
              style={styles.chip}
              onPress={() => {
                setQ('');
                run('', g);
              }}
            >
              <Text style={styles.chipText}>{g}</Text>
            </Pressable>
          ))}
        </View>

        {loading && <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.lg }} />}

        {!loading && searched && writers.length > 0 && (
          <>
            <Text style={styles.section}>Writers</Text>
            {writers.map((w) => (
              <Pressable key={w.id} style={styles.writerRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{w.display_name.slice(0, 1).toUpperCase()}</Text>
                </View>
                <View>
                  <Text style={styles.rowTitle}>{w.display_name}</Text>
                  <Text style={styles.meta}>@{w.username}</Text>
                </View>
              </Pressable>
            ))}
          </>
        )}

        {!loading && searched && stories.length > 0 && (
          <>
            <Text style={styles.section}>Stories</Text>
            {stories.map((s) => (
              <Pressable
                key={s.id}
                style={styles.row}
                onPress={() => s.firstChapter && router.push(`/read/${s.firstChapter}`)}
              >
                <View style={[styles.cover, { backgroundColor: s.cover_color }]} />
                <View style={styles.rowText}>
                  <Text style={styles.genre}>{s.genre}</Text>
                  <Text style={styles.rowTitle}>{s.title}</Text>
                  <Text style={styles.meta}>{s.author}</Text>
                </View>
              </Pressable>
            ))}
          </>
        )}

        {!loading && searched && stories.length === 0 && writers.length === 0 && (
          <Text style={styles.empty}>No matches. Try a different word or genre.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  h1: { fontSize: 28, fontWeight: '500', color: colors.ink, letterSpacing: -0.5 },
  input: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: colors.white,
    color: colors.ink,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: spacing.md },
  chip: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  chipText: { fontSize: 12, color: colors.inkMuted, textTransform: 'capitalize' },
  section: { fontSize: 13, color: colors.inkMuted, marginTop: spacing.lg, marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
  },
  cover: { width: 60, height: 84 },
  rowText: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  genre: { fontSize: 11, color: colors.inkFaint, textTransform: 'capitalize' },
  rowTitle: { fontSize: 16, fontWeight: '500', color: colors.ink, marginTop: 2 },
  meta: { fontSize: 13, color: colors.inkMuted, marginTop: 2 },
  writerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.paperSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 16, color: colors.signal, fontWeight: '500' },
  empty: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.lg },
});
