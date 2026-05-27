import { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Image,
  Pressable,
  ActivityIndicator,
  Alert,
  Share,
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

const SITE = 'https://novelstack.app';

type ProfileResponse = AuthorProfile & {
  blockedByMe?: boolean;
  followedByMe?: boolean;
  followingCount?: number;
};

// "12,400" / "1.2k" / "12.4k" — quick compactor for stat numbers so the
// row stays balanced across small phones.
function compact(n: number): string {
  if (n >= 100_000) return `${Math.round(n / 1000)}k`;
  if (n >= 10_000) return `${(n / 1000).toFixed(1)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString('en-US');
}

// Writer's public profile screen. Instagram-style top card: avatar on the
// left, name + handle next to it, bio below, then a stat row (stories ·
// reads · following — never follower count), Follow + Share buttons, and a
// stories grid. Block lives top-right as a small icon.
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

  async function toggleFollow() {
    if (!profile || followBusy) return;
    setFollowBusy(true);
    const next = !following;
    setFollowing(next);
    try {
      await apiSend('/api/follows', 'POST', { authorId: profile.id });
    } catch {
      setFollowing(!next);
    }
    setFollowBusy(false);
  }

  async function shareProfile() {
    if (!profile) return;
    try {
      await Share.share({
        message: `${profile.displayName} on NovelStack — ${SITE}/u/${profile.username}`,
      });
    } catch {
      // Cancelled.
    }
  }

  function confirmBlock() {
    if (!profile) return;
    if (blocked) {
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
      if (next) router.back();
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
          <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={colors.ink} />
          </Pressable>
        </View>
        <Text style={styles.empty}>Writer not found.</Text>
      </SafeAreaView>
    );
  }

  const isOwn = me?.id === profile.id;
  const totalReads = profile.stories.reduce(
    (sum, s) => sum + (s.totalReads ?? 0),
    0,
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top bar — back left, block right (when not your own profile). */}
        <View style={styles.head}>
          <Pressable style={styles.back} onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={22} color={colors.ink} />
          </Pressable>
          {!isOwn && me && (
            <Pressable
              style={styles.blockIcon}
              onPress={confirmBlock}
              disabled={busy}
              hitSlop={10}
            >
              <Ionicons
                name={blocked ? 'lock-open-outline' : 'ban-outline'}
                size={20}
                color={blocked ? colors.inkMuted : colors.signal}
              />
            </Pressable>
          )}
        </View>

        {/* Instagram-style top card — avatar left, name + handle right of it,
            stats row below. */}
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.avatar}>
              {profile.avatarUrl ? (
                <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarInitial}>
                  {(profile.displayName ?? '?').slice(0, 1).toUpperCase()}
                </Text>
              )}
            </View>
            <View style={styles.cardMain}>
              <Text style={styles.name} numberOfLines={1}>
                {profile.displayName}
              </Text>
              <Text style={styles.handle} numberOfLines={1}>
                @{profile.username}
              </Text>
            </View>
          </View>

          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statN}>{profile.stories.length}</Text>
              <Text style={styles.statL}>
                {profile.stories.length === 1 ? 'story' : 'stories'}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statN}>{compact(totalReads)}</Text>
              <Text style={styles.statL}>reads</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statN}>{compact(profile.followingCount ?? 0)}</Text>
              <Text style={styles.statL}>following</Text>
            </View>
          </View>

          {!!profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

          {!isOwn && me && (
            <View style={styles.ctaRow}>
              <Pressable
                style={[
                  styles.followBtn,
                  following ? styles.followBtnOn : styles.followBtnOff,
                  followBusy && { opacity: 0.6 },
                ]}
                onPress={toggleFollow}
                disabled={followBusy}
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
              <Pressable style={styles.shareBtn} onPress={shareProfile} hitSlop={6}>
                <Ionicons name="arrow-redo-outline" size={18} color={colors.ink} />
              </Pressable>
            </View>
          )}
        </View>

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
    paddingBottom: 12,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(200,65,78,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Top card — Instagram-style.
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 18,
    padding: 16,
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 78, height: 78 },
  avatarInitial: { color: '#FFFFFF', fontSize: 30, fontWeight: '700' },
  cardMain: { flex: 1, minWidth: 0 },
  name: { fontFamily: fonts.displayXl, fontSize: 22, color: colors.ink },
  handle: { fontSize: 13.5, color: colors.inkFaint, marginTop: 2 },

  stats: {
    flexDirection: 'row',
    marginTop: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  stat: { flex: 1, alignItems: 'center' },
  statN: { fontSize: 17, fontWeight: '700', color: colors.ink },
  statL: { fontSize: 11.5, color: colors.inkMuted, marginTop: 2 },

  bio: {
    fontSize: 14,
    color: colors.inkMuted,
    lineHeight: 20,
    marginTop: 14,
  },

  ctaRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  followBtn: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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

  shareBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.cardHi,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
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
