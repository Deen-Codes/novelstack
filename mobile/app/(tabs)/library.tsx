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
import { apiGet } from '@/lib/api';
import { getSessionToken } from '@/lib/api';
import type { Shelf } from '@/lib/types';

export default function Library() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [shelf, setShelf] = useState<Shelf | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = await getSessionToken();
    if (!token) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    try {
      const data = await apiGet<Shelf>('/api/me/shelf');
      setShelf(data);
      setSignedIn(true);
    } catch {
      // 401 (or any error) — treat as signed out.
      setSignedIn(false);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
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

  const following = shelf?.following ?? [];
  const saved = shelf?.saved ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>Your library</Text>

        <Text style={styles.section}>Writers you follow</Text>
        {following.length === 0 ? (
          <Text style={styles.empty}>Follow writers to keep up with their new chapters.</Text>
        ) : (
          <View style={styles.chips}>
            {following.map((w) => (
              <View key={w.id} style={styles.writerChip}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {w.displayName.slice(0, 1).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.chipText}>{w.displayName}</Text>
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
                onPress={() => router.push(`/story/${s.slug}`)}
              >
                <View
                  style={[styles.gridCover, { backgroundColor: s.coverColor ?? '#4F4AAA' }]}
                />
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
