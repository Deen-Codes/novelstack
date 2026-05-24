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
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '@/theme/tokens';
import { apiGet, apiSend, getSessionToken } from '@/lib/api';
import { TopBar } from '@/components/TopBar';
import { Cover } from '@/components/Cover';
import type { Shelf, Story } from '@/lib/types';

export default function Library() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [saved, setSaved] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = await getSessionToken();
    if (!token) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    try {
      const data = await apiGet<Shelf>('/api/me/shelf');
      setSaved(data.saved ?? []);
      setSignedIn(true);
    } catch {
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

  async function removeSaved(story: Story) {
    if (pendingId) return;
    setPendingId(story.id);
    try {
      await apiSend('/api/bookmarks', 'POST', { storyId: story.id, action: 'remove' });
      setSaved((list) => list.filter((s) => s.id !== story.id));
    } catch {
      // Leave the list unchanged on failure.
    }
    setPendingId(null);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar />
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (signedIn === false) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <TopBar />
        <View style={styles.body}>
          <Text style={styles.h1}>Library</Text>
          <Text style={styles.sub}>
            Sign in to keep your saved stories and reading history.
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
      <TopBar />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>Library</Text>

        <Text style={styles.section}>Saved books</Text>
        {saved.length === 0 ? (
          <View>
            <Text style={styles.empty}>
              Stories you open and start reading are saved here automatically.
            </Text>
            <Pressable style={styles.browseBtn} onPress={() => router.push('/')}>
              <Text style={styles.browseBtnText}>Browse stories</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.grid}>
            {saved.map((s) => (
              <View key={s.id} style={styles.gridItem}>
                <Pressable onPress={() => router.push(`/story/${s.slug}`)}>
                  <Cover
                    coverUrl={s.coverUrl}
                    coverColor={s.coverColor}
                    title={s.title}
                    mature={s.isMature}
                    style={styles.gridCover}
                  />
                </Pressable>
                <Pressable
                  style={[styles.removeBtn, pendingId === s.id && styles.btnBusy]}
                  onPress={() => removeSaved(s)}
                  disabled={pendingId === s.id}
                  hitSlop={8}
                >
                  {pendingId === s.id ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Ionicons name="close" size={14} color="#FFFFFF" />
                  )}
                </Pressable>
                <Text style={styles.gridTitle} numberOfLines={2}>
                  {s.title}
                </Text>
              </View>
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
  h1: { fontSize: 25, fontWeight: '500', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.sm, lineHeight: 21 },
  section: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.ink,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  empty: { fontSize: 13, color: colors.inkMuted, lineHeight: 20 },
  browseBtn: {
    alignSelf: 'flex-start',
    backgroundColor: colors.signal,
    borderRadius: radius.pill,
    paddingHorizontal: 22,
    paddingVertical: 11,
    marginTop: spacing.md,
  },
  browseBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '31%' },
  gridCover: { width: '100%', aspectRatio: 3 / 4, borderRadius: 9 },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(20,16,10,0.8)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnBusy: { opacity: 0.5 },
  gridTitle: { fontSize: 11.5, fontWeight: '500', color: colors.ink, marginTop: 6 },
  btn: {
    marginTop: spacing.lg,
    backgroundColor: colors.signal,
    paddingVertical: 12,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  btnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
});
