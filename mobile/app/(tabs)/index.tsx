import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, radius } from '@/theme/tokens';
import { supabase } from '@/lib/supabase';

type Item = {
  id: string;
  title: string;
  author: string;
  genre: string;
  color: string;
  firstChapter: string | null;
};

// Shown until / unless Supabase returns real stories.
const FALLBACK: Item[] = [
  { id: '1', title: 'The Long Way Home', author: 'Maya R.', genre: 'Romance', color: '#D85A30', firstChapter: null },
  { id: '2', title: 'Saltwater Kingdom', author: 'J. Okafor', genre: 'Fantasy', color: '#4F4AAA', firstChapter: null },
  { id: '3', title: 'Soft Static', author: 'L. Chen', genre: 'Sci-Fi', color: '#1D9E75', firstChapter: null },
];

export default function Home() {
  const [stories, setStories] = useState<Item[]>(FALLBACK);

  useEffect(() => {
    supabase
      .from('stories')
      .select('id, title, genre, cover_color, author:users(display_name), chapters(id, number)')
      .neq('status', 'draft')
      .order('total_reads', { ascending: false })
      .limit(12)
      .then(({ data }) => {
        if (data && data.length) {
          setStories(
            data.map((s: any) => {
              const chs = (s.chapters ?? []).sort((a: any, b: any) => a.number - b.number);
              return {
                id: s.id,
                title: s.title,
                genre: s.genre,
                color: s.cover_color ?? '#D85A30',
                author: s.author?.display_name ?? 'Unknown',
                firstChapter: chs[0]?.id ?? null,
              };
            })
          );
        }
      });
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.logo}>
          novelstack<Text style={styles.dot}>.</Text>
        </Text>
        <Text style={styles.h1}>Stories worth following.</Text>
        <Text style={styles.sub}>New chapters drop daily. Editor-picked, reader-loved.</Text>

        <Text style={styles.section}>Trending this week</Text>
        {stories.map((story) => (
          <Pressable
            key={story.id}
            style={styles.row}
            onPress={() => story.firstChapter && router.push(`/read/${story.firstChapter}`)}
          >
            <View style={[styles.cover, { backgroundColor: story.color }]}>
              <Text style={styles.coverTitle}>{story.title}</Text>
            </View>
            <View style={styles.rowText}>
              <Text style={styles.genre}>{story.genre}</Text>
              <Text style={styles.rowTitle}>{story.title}</Text>
              <Text style={styles.author}>{story.author}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  logo: { fontSize: 20, fontWeight: '500', color: colors.ink, letterSpacing: -0.5 },
  dot: { color: colors.signal },
  h1: { fontSize: 30, fontWeight: '500', color: colors.ink, marginTop: spacing.lg, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.sm, lineHeight: 21 },
  section: { fontSize: 13, color: colors.inkMuted, marginTop: spacing.xl, marginBottom: spacing.md },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
  },
  cover: { width: 76, height: 100, padding: 8, justifyContent: 'flex-end' },
  coverTitle: { color: colors.white, fontSize: 11, fontWeight: '500' },
  rowText: { flex: 1, padding: spacing.md, justifyContent: 'center' },
  genre: { fontSize: 11, color: colors.inkFaint },
  rowTitle: { fontSize: 16, fontWeight: '500', color: colors.ink, marginTop: 2 },
  author: { fontSize: 13, color: colors.inkMuted, marginTop: 4 },
});
