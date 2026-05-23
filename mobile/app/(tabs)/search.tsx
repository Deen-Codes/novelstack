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
import { apiGet } from '@/lib/api';
import { GENRES } from '@/lib/genres';
import { Cover } from '@/components/Cover';
import type { Story } from '@/lib/types';

export default function Search() {
  const [q, setQ] = useState('');
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Text search hits /api/search; a genre chip hits /api/feed?genre= since
  // that endpoint does server-side genre filtering and age-gating.
  async function run(term: string, genre?: string) {
    if (!term.trim() && !genre) {
      setStories([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const path = genre
        ? `/api/feed?genre=${encodeURIComponent(genre)}`
        : `/api/search?q=${encodeURIComponent(term.trim())}`;
      const results = await apiGet<Story[]>(path);
      setStories(results);
    } catch {
      setStories([]);
    }
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
          placeholder="Search story titles…"
          placeholderTextColor={colors.inkFaint}
          autoCapitalize="none"
          style={styles.input}
        />

        <View style={styles.chips}>
          {GENRES.map((g) => (
            <Pressable
              key={g.value}
              style={styles.chip}
              onPress={() => {
                setQ('');
                run('', g.value);
              }}
            >
              <Text style={styles.chipText}>{g.label}</Text>
            </Pressable>
          ))}
        </View>

        {loading && <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.lg }} />}

        {!loading && searched && stories.length > 0 && (
          <>
            <Text style={styles.section}>Stories</Text>
            {stories.map((s) => (
              <Pressable
                key={s.id}
                style={styles.row}
                onPress={() => router.push(`/story/${s.slug}`)}
              >
                <Cover
                  coverUrl={s.coverUrl}
                  coverColor={s.coverColor}
                  title={s.title}
                  mature={s.isMature}
                  style={styles.cover}
                />
                <View style={styles.rowText}>
                  <Text style={styles.genre}>{s.genre}</Text>
                  <Text style={styles.rowTitle}>{s.title}</Text>
                  <Text style={styles.meta}>{s.author?.displayName ?? 'Unknown'}</Text>
                </View>
              </Pressable>
            ))}
          </>
        )}

        {!loading && searched && stories.length === 0 && (
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
  empty: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.lg },
});
