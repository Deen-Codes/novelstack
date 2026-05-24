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
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '@/theme/tokens';
import { apiGet } from '@/lib/api';
import { GENRES, genreLabel } from '@/lib/genres';
import { TopBar } from '@/components/TopBar';
import { Cover } from '@/components/Cover';
import type { Story } from '@/lib/types';

// Decorative browse rails shown when there is no query or genre. Tapping a
// collection just applies a related genre filter (or is a no-op for `null`).
type Collection = {
  title: string;
  caption: string;
  color: string;
  genre: string | null;
};

const COLLECTIONS: Collection[] = [
  { title: 'Finish in one sitting', caption: 'Short reads', color: '#6b3b1f', genre: 'short_story' },
  { title: 'Slow-burn romance', caption: 'Take your time', color: '#7a2f47', genre: 'romance' },
  { title: "Can't put it down", caption: 'Page-turners', color: '#2d3e63', genre: 'thriller' },
  { title: 'Cosy mysteries', caption: 'Curl up & solve', color: '#26505c', genre: 'mystery' },
  { title: 'Fresh voices', caption: 'New on NovelStack', color: '#3c5a2c', genre: null },
  { title: 'Worlds to get lost in', caption: 'Epic fantasy', color: '#503a66', genre: 'fantasy' },
];

export default function Search() {
  const [q, setQ] = useState('');
  const [genre, setGenre] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Text search hits /api/search; a genre filter hits /api/feed?genre= since
  // that endpoint does server-side genre filtering and age-gating.
  async function run(term: string, g: string | null) {
    if (!term.trim() && !g) {
      setStories([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const path = g
        ? `/api/feed?genre=${encodeURIComponent(g)}`
        : `/api/search?q=${encodeURIComponent(term.trim())}`;
      const results = await apiGet<Story[]>(path);
      setStories(results);
    } catch {
      setStories([]);
    }
    setSearched(true);
    setLoading(false);
  }

  // Debounce text query changes. A typed query takes precedence over genre.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => run(q, q.trim() ? null : genre), 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q, genre]);

  function pickGenre(value: string | null) {
    setGenre(value);
    setPickerOpen(false);
    if (value) setQ('');
  }

  const hasResultsView = q.trim().length > 0 || genre !== null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {/* Search field */}
        <View style={styles.searchField}>
          <Ionicons name="search" size={18} color={colors.inkFaint} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search story titles…"
            placeholderTextColor={colors.inkFaint}
            autoCapitalize="none"
            style={styles.input}
          />
          {q.length > 0 && (
            <Pressable hitSlop={8} onPress={() => setQ('')}>
              <Ionicons name="close-circle" size={18} color={colors.inkFaint} />
            </Pressable>
          )}
        </View>

        {/* Filter row */}
        <View style={styles.filterRow}>
          <Pressable
            style={[styles.filterBtn, genre !== null && styles.filterBtnActive]}
            onPress={() => setPickerOpen((o) => !o)}
          >
            <Ionicons
              name="funnel-outline"
              size={14}
              color={genre !== null ? '#FFFFFF' : colors.inkMuted}
            />
            <Text style={[styles.filterText, genre !== null && styles.filterTextActive]}>
              {genre !== null ? genreLabel(genre) : 'Genre'}
            </Text>
            <Ionicons
              name={pickerOpen ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={genre !== null ? '#FFFFFF' : colors.inkMuted}
            />
          </Pressable>
        </View>

        {/* Inline genre picker */}
        {pickerOpen && (
          <View style={styles.picker}>
            <Pressable
              style={[styles.gChip, genre === null && styles.gChipActive]}
              onPress={() => pickGenre(null)}
            >
              <Text style={[styles.gChipText, genre === null && styles.gChipTextActive]}>All</Text>
            </Pressable>
            {GENRES.map((g) => {
              const active = genre === g.value;
              return (
                <Pressable
                  key={g.value}
                  style={[styles.gChip, active && styles.gChipActive]}
                  onPress={() => pickGenre(g.value)}
                >
                  <Text style={[styles.gChipText, active && styles.gChipTextActive]}>
                    {g.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {loading && <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.lg }} />}

        {/* Browse state: no query and no genre */}
        {!loading && !hasResultsView && (
          <View style={styles.browse}>
            <Text style={styles.section}>Collections</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
            >
              {COLLECTIONS.slice(0, 3).map((c) => (
                <CollectionCard key={c.title} collection={c} onPress={() => pickGenre(c.genre)} />
              ))}
            </ScrollView>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
            >
              {COLLECTIONS.slice(3).map((c) => (
                <CollectionCard key={c.title} collection={c} onPress={() => pickGenre(c.genre)} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Results list */}
        {!loading && hasResultsView && searched && stories.length > 0 && (
          <View style={styles.results}>
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
                  <Text style={styles.genre}>{genreLabel(s.genre)}</Text>
                  <Text style={styles.rowTitle} numberOfLines={2}>
                    {s.title}
                  </Text>
                  <Text style={styles.meta}>{s.author?.displayName ?? 'Unknown'}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {!loading && hasResultsView && searched && stories.length === 0 && (
          <Text style={styles.empty}>No matches. Try a different word or genre.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function CollectionCard({
  collection,
  onPress,
}: {
  collection: Collection;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.collCard, { backgroundColor: collection.color }]}
      onPress={onPress}
    >
      <Text style={styles.collTitle}>{collection.title}</Text>
      <Text style={styles.collCaption}>{collection.caption}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },

  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.ink,
    padding: 0,
  },

  filterRow: { flexDirection: 'row', marginTop: spacing.md },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.card,
  },
  filterBtnActive: {
    backgroundColor: colors.signal,
    borderColor: colors.signal,
  },
  filterText: { fontSize: 13, color: colors.inkMuted, fontWeight: '500' },
  filterTextActive: { color: '#FFFFFF' },

  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: spacing.md,
  },
  gChip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.card,
  },
  gChipActive: {
    backgroundColor: colors.signal,
    borderColor: colors.signal,
  },
  gChipText: { fontSize: 12, color: colors.inkMuted },
  gChipTextActive: { color: '#FFFFFF', fontWeight: '500' },

  browse: { marginTop: spacing.lg },
  rail: { gap: spacing.md, paddingRight: spacing.lg, marginBottom: spacing.md },
  collCard: {
    width: 210,
    height: 116,
    borderRadius: 15,
    padding: spacing.md,
    justifyContent: 'flex-end',
  },
  collTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  collCaption: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 3,
  },

  results: { marginTop: spacing.sm },
  section: {
    fontSize: 13,
    color: colors.inkMuted,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    backgroundColor: colors.card,
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
