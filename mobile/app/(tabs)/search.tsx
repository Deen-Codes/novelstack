import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
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
import { colors, spacing, fonts } from '@/theme/tokens';
import { apiGet, apiGetCached } from '@/lib/api';
import { Cover } from '@/components/Cover';
import { TopBar } from '@/components/TopBar';
import { AmbientGlow } from '@/components/AmbientGlow';
import type { Story } from '@/lib/types';

export default function Search() {
  const [q, setQ] = useState('');
  const [recommended, setRecommended] = useState<Story[]>([]);
  const [results, setResults] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);

  const recList = useMemo(() => recommended.slice(0, 20), [recommended]);

  // One animated value per recommended row, so they can fade in one by one.
  const rowAnims = useMemo(
    () => recList.map(() => new Animated.Value(0)),
    [recList],
  );

  // Recommended titles fill the screen before the reader types anything.
  const loadRecommended = useCallback(async () => {
    try {
      setRecommended(await apiGetCached<Story[]>('/api/feed'));
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

  // Stagger the recommended rows in — quick, so they're all settled fast.
  useEffect(() => {
    if (rowAnims.length === 0) return;
    Animated.stagger(
      55,
      rowAnims.map((v) =>
        Animated.timing(v, { toValue: 1, duration: 280, useNativeDriver: true }),
      ),
    ).start();
  }, [rowAnims]);

  async function run(term: string) {
    const t = term.trim();
    if (!t) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setResults(await apiGet<Story[]>(`/api/search?q=${encodeURIComponent(t)}`));
    } catch {
      setResults([]);
    }
    setLoading(false);
  }

  // Debounce typing. Flip to the loading state the moment the reader types,
  // so a stale "no results" never flashes before the search has run.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (q.trim()) setLoading(true);
    timer.current = setTimeout(() => run(q), 350);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [q]);

  const hasQuery = q.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AmbientGlow />
      <TopBar page="search" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="never"
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

        {/* No query — recommended titles, fading in one by one */}
        {!hasQuery && (
          <>
            <Text style={styles.section}>Recommended for you</Text>
            {recList.length === 0 ? (
              <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.lg }} />
            ) : (
              recList.map((s, i) => (
                <Animated.View
                  key={s.id}
                  style={{
                    opacity: rowAnims[i],
                    transform: [
                      {
                        translateY: rowAnims[i].interpolate({
                          inputRange: [0, 1],
                          outputRange: [12, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <Pressable
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
                    <Text style={styles.rowTitle} numberOfLines={2}>
                      {s.title}
                    </Text>
                  </Pressable>
                </Animated.View>
              ))
            )}
          </>
        )}

        {/* Query — spinner while loading, results, or a soft fallback */}
        {hasQuery && (
          <>
            {loading ? (
              <ActivityIndicator color={colors.signal} style={{ marginTop: spacing.xl }} />
            ) : results.length === 0 ? (
              <>
                <Text style={styles.empty}>No matches for &ldquo;{q.trim()}&rdquo;.</Text>
                <Text style={styles.section}>You might like these</Text>
                <View style={styles.grid}>
                  {recList.slice(0, 12).map((s) => (
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
  rowTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.ink },

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
