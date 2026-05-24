import { useCallback, useEffect, useRef, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGet } from '@/lib/api';
import { genreLabel } from '@/lib/genres';
import { Cover } from '@/components/Cover';
import { TopBar } from '@/components/TopBar';
import type { Story } from '@/lib/types';

export default function Search() {
  const [q, setQ] = useState('');
  const [recommended, setRecommended] = useState<Story[]>([]);
  const [results, setResults] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  // Recommended titles fill the screen before the reader types anything.
  const loadRecommended = useCallback(async () => {
    try {
      setRecommended(await apiGet<Story[]>('/api/feed'));
    } catch {
      setRecommended([]);
    }
  }, []);

  // Open the keyboard as soon as Search is entered, so you can type right
  // away — the recommended list stays visible above it.
  useFocusEffect(
    useCallback(() => {
      loadRecommended();
      const t = setTimeout(() => inputRef.current?.focus(), 350);
      return () => clearTimeout(t);
    }, [loadRecommended]),
  );

  async function run(term: string) {
    if (!term.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      setResults(await apiGet<Story[]>(`/api/search?q=${encodeURIComponent(term.trim())}`));
    } catch {
      setResults([]);
    }
    setSearched(true);
    setLoading(false);
  }

  // Debounce typing.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => run(q), 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q]);

  const hasQuery = q.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <TopBar />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <View style={styles.field}>
          <Ionicons name="search" size={18} color={colors.inkFaint} />
          <TextInput
            ref={inputRef}
            value={q}
            onChangeText={setQ}
            placeholder="Search stories and authors…"
            placeholderTextColor={colors.inkFaint}
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
          />
          {q.length > 0 && (
            <Pressable hitSlop={8} onPress={() => setQ('')}>
              <Ionicons name="close-circle" size={18} color={colors.inkFaint} />
            </Pressable>
          )}
        </View>

        {/* No query — recommended titles as a list */}
        {!hasQuery && (
          <>
            <Text style={styles.section}>Recommended for you</Text>
            {recommended.length === 0 ? (
              <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.lg }} />
            ) : (
              recommended.slice(0, 20).map((s) => (
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
                    style={styles.rowCover}
                  />
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {s.title}
                    </Text>
                    <Text style={styles.rowMeta} numberOfLines={1}>
                      {s.author?.displayName ?? 'A writer'} · {genreLabel(s.genre)}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
                </Pressable>
              ))
            )}
          </>
        )}

        {/* Query — results as a 3-up grid */}
        {hasQuery && (
          <>
            {loading ? (
              <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.xl }} />
            ) : searched && results.length === 0 ? (
              <Text style={styles.empty}>No matches for &ldquo;{q.trim()}&rdquo;.</Text>
            ) : (
              <>
                <Text style={styles.section}>
                  {results.length} result{results.length === 1 ? '' : 's'}
                </Text>
                <View style={styles.grid}>
                  {results.map((s) => (
                    <Pressable
                      key={s.id}
                      style={styles.gridItem}
                      onPress={() => router.push(`/story/${s.slug}`)}
                    >
                      <Cover
                        coverUrl={s.coverUrl}
                        coverColor={s.coverColor}
                        title={s.title}
                        mature={s.isMature}
                        style={styles.gridCover}
                      />
                      <Text style={styles.gridTitle} numberOfLines={2}>
                        {s.title}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}
          </>
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingBottom: spacing.xl },

  pageTitle: {
    fontFamily: fonts.displayXl,
    fontSize: 27,
    color: colors.ink,
    paddingHorizontal: 20,
    paddingTop: 4,
    letterSpacing: -0.6,
  },

  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginTop: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  input: { flex: 1, fontSize: 15, color: colors.ink, padding: 0 },

  section: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
    paddingHorizontal: 20,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  empty: { fontSize: 14, color: colors.inkMuted, paddingHorizontal: 20, marginTop: spacing.xl },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  rowCover: { width: 52, height: 72, borderRadius: 7 },
  rowText: { flex: 1, minWidth: 0 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: colors.ink },
  rowMeta: { fontSize: 12, color: colors.inkFaint, marginTop: 3 },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
  },
  gridItem: { width: '31%' },
  gridCover: { width: '100%', aspectRatio: 3 / 4, borderRadius: 10 },
  gridTitle: { fontSize: 12, fontWeight: '600', color: colors.ink, marginTop: 7 },
});
