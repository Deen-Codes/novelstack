import { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGet, apiSend } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { Cover } from '@/components/Cover';
import type { AuthorProfile, User } from '@/lib/types';

type ProfileResponse = AuthorProfile & {
  blockedByMe?: boolean;
  followedByMe?: boolean;
};

// Writer's public profile screen. Shows their bio + stories, plus the
// follow/block actions a signed-in reader can take. Reached from anywhere
// an author byline is rendered.
export default function WriterProfile() {
  const { username } = useLocalSearchParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [me, setMe] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await apiGet<ProfileResponse>(`/api/users/${username}`);
      setProfile(data);
      setBlocked(!!data.blockedByMe);
      setFollowing(!!data.followedByMe);
    } catch {
      setNotFound(true);
    }
    const u = await getCurrentUser();
    setMe(u ?? null);
    setLoading(false);
  }, [username]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setNotFound(false);
      load();
    }, [load]),
  );

  function confirmBlock() {
    if (!profile) return;
    if (blocked) {
      // No confirmation needed to unblock.
      void doToggleBlock();
      return;
    }
    Alert.alert(
      `Block @${profile.username}?`,
      "You won't see their stories, posts or comments — and they won't see yours. You can unblock them later.",
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Block', style: 'destructive', onPress: doToggleBlock },
      ],
    );
  }

  async function toggleFollow() {
    if (!profile || followBusy) return;
    setFollowBusy(true);
    // Optimistic — flip immediately, revert on failure. The API is the same
    // single endpoint that toggles in either direction server-side.
    const next = !following;
    setFollowing(next);
    try {
      await apiSend('/api/follows', 'POST', { authorId: profile.id });
    } catch {
      setFollowing(!next);
    }
    setFollowBusy(false);
  }

  async function doToggleBlock() {
    if (!profile || busy) return;
    setBusy(true);
    try {
      const method = blocked ? 'DELETE' : 'POST';
      const { blocked: next } = await apiSend<{ blocked: boolean }>(
        `/api/blocks/${profile.id}`,
        method,
      );
      setBlocked(next);
      if (next) {
        // After a block the rest of the screen is no longer relevant — go back.
        router.back();
      }
    } catch (e) {
      Alert.alert('Could not update block', e instanceof Error ? e.message : 'Try again.');
    }
    setBusy(false);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (notFound || !profile) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.head}>
          <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color={colors.ink} />
          </Pressable>
        </View>
        <Text style={styles.empty}>Writer not found.</Text>
      </SafeAreaView>
    );
  }

  const isOwn = me?.id === profile.id;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.head}>
          <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={22} color={colors.ink} />
          </Pressable>
          {!isOwn && me && (
            <Pressable
              style={[styles.blockBtn, blocked && styles.blockBtnOn, busy && { opacity: 0.5 }]}
              onPress={confirmBlock}
              disabled={busy}
              hitSlop={6}
            >
              <Ionicons
                name={blocked ? 'lock-open-outline' : 'ban-outline'}
                size={14}
                color={blocked ? colors.inkMuted : colors.signal}
              />
              <Text style={[styles.blockBtnText, blocked && styles.blockBtnTextOn]}>
                {blocked ? 'Unblock' : 'Block'}
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.avatar}>
          {profile.avatarUrl ? (
            <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImg} />
          ) : (
            <Text style={styles.avatarInitial}>
              {(profile.displayName ?? '?').slice(0, 1).toUpperCase()}
            </Text>
          )}
        </View>

        <Text style={styles.name}>{profile.displayName}</Text>
        <Text style={styles.handle}>@{profile.username}</Text>
        {!isOwn && me && (
          <Pressable
            style={[
              styles.followBtn,
              following ? styles.followBtnOn : styles.followBtnOff,
              followBusy && { opacity: 0.6 },
            ]}
            onPress={toggleFollow}
            disabled={followBusy}
            hitSlop={6}
          >
            <Text
              style={[
                styles.followBtnText,
                following ? styles.followBtnTextOn : styles.followBtnTextOff,
              ]}
            >
              {following ? 'Following' : 'Follow'}
            </Text>
          </Pressable>
        )}
        {!!profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

        <Text style={styles.section}>Stories</Text>
        {profile.stories.length === 0 ? (
          <Text style={styles.empty}>No published stories yet.</Text>
        ) : (
          <View style={styles.grid}>
            {profile.stories.map((s) => (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { paddingHorizontal: 20, paddingBottom: spacing.xl * 2 },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    paddingBottom: 6,
  },
  back: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  blockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(200,65,78,0.55)',
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  blockBtnOn: { borderColor: colors.border, backgroundColor: colors.card },
  blockBtnText: { fontSize: 12.5, fontWeight: '600', color: colors.signal },
  blockBtnTextOn: { color: colors.inkMuted },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: spacing.md,
  },
  avatarImg: { width: 88, height: 88 },
  avatarInitial: { color: colors.ink, fontSize: 34, fontWeight: '700' },
  name: {
    fontFamily: fonts.displayXl,
    fontSize: 24,
    color: colors.ink,
    textAlign: 'center',
    marginTop: 12,
  },
  handle: { fontSize: 13, color: colors.inkFaint, textAlign: 'center', marginTop: 2 },
  // Follow button sits centred just below the handle. Cream when you're
  // not following (primary CTA); ember-tinted "Following" once you are,
  // tapping again unfollows.
  followBtn: {
    alignSelf: 'center',
    marginTop: 14,
    paddingHorizontal: 26,
    paddingVertical: 11,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  followBtnOff: {
    backgroundColor: '#F4ECDF',
    borderColor: '#F4ECDF',
  },
  followBtnOn: {
    backgroundColor: 'rgba(200,65,78,0.15)',
    borderColor: colors.signal,
  },
  followBtnText: { fontSize: 14, fontWeight: '700' },
  followBtnTextOff: { color: '#15100E' },
  followBtnTextOn: { color: colors.signal },
  bio: {
    fontSize: 14,
    color: colors.inkMuted,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 12,
    paddingHorizontal: 20,
  },
  section: {
    fontFamily: fonts.display,
    fontSize: 16,
    color: colors.ink,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  empty: {
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gridItem: { width: '31%' },
  gridCover: { width: '100%', aspectRatio: 3 / 4, borderRadius: 10 },
  gridTitle: { fontSize: 12, fontWeight: '600', color: colors.ink, marginTop: 7 },
});
