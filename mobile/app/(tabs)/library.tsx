import { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { colors, spacing, radius } from '@/theme/tokens';
import { apiGet, apiSend, getSessionToken } from '@/lib/api';
import { Cover } from '@/components/Cover';
import type { Shelf, Story, User } from '@/lib/types';

export default function Library() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [following, setFollowing] = useState<User[]>([]);
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
      setFollowing(data.following ?? []);
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

  // Unfollow — POST /api/follows toggles; we only call it on a followed
  // writer so the toggle always lands on "unfollowed".
  async function unfollow(writer: User) {
    if (pendingId) return;
    setPendingId(writer.id);
    try {
      await apiSend('/api/follows', 'POST', { authorId: writer.id });
      setFollowing((list) => list.filter((w) => w.id !== writer.id));
    } catch {
      // Leave the list unchanged on failure.
    }
    setPendingId(null);
  }

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

        <Text style={styles.section}>Writers you follow</Text>
        {following.length === 0 ? (
          <Text style={styles.empty}>Follow writers to keep up with their new chapters.</Text>
        ) : (
          following.map((w) => (
            <View key={w.id} style={styles.writerRow}>
              <View style={styles.avatar}>
                {w.avatarUrl ? (
                  <Image source={{ uri: w.avatarUrl }} style={styles.avatarImg} />
                ) : (
                  <Text style={styles.avatarText}>
                    {(w.displayName || '?').slice(0, 1).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.writerName} numberOfLines={1}>
                  {w.displayName}
                </Text>
                <Text style={styles.writerMeta} numberOfLines={1}>
                  {w.bio ? w.bio : `@${w.username}`}
                </Text>
              </View>
              <Pressable
                style={[styles.unfollowBtn, pendingId === w.id && styles.btnBusy]}
                onPress={() => unfollow(w)}
                disabled={pendingId === w.id}
              >
                <Text style={styles.unfollowText}>
                  {pendingId === w.id ? '…' : 'Unfollow'}
                </Text>
              </Pressable>
            </View>
          ))
        )}

        <Text style={styles.section}>Saved stories</Text>
        {saved.length === 0 ? (
          <Text style={styles.empty}>
            Stories you open and start reading are saved here automatically.
          </Text>
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
                  style={styles.removeBtn}
                  onPress={() => removeSaved(s)}
                  disabled={pendingId === s.id}
                  hitSlop={8}
                >
                  <Text style={styles.removeText}>{pendingId === s.id ? '·' : '✕'}</Text>
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
  h1: { fontSize: 28, fontWeight: '500', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.sm, lineHeight: 21 },
  section: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.ink,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  empty: { fontSize: 13, color: colors.inkMuted, lineHeight: 20 },

  writerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: 12,
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.paperSoft,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 44, height: 44 },
  avatarText: { fontSize: 17, color: colors.signal, fontWeight: '500' },
  writerName: { fontSize: 15, fontWeight: '500', color: colors.ink },
  writerMeta: { fontSize: 12, color: colors.inkFaint, marginTop: 2 },
  unfollowBtn: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  btnBusy: { opacity: 0.5 },
  unfollowText: { fontSize: 12, fontWeight: '500', color: colors.inkMuted },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '47%' },
  gridCover: { width: '100%', aspectRatio: 3 / 4, borderRadius: radius.md },
  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(20,16,10,0.78)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', lineHeight: 16 },
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
