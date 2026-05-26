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
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGet, apiSend } from '@/lib/api';

type BlockedUser = {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
};

// The user's blocked-users list, opened from Profile. One row per blocked
// user, each with an unblock button.
export default function BlockedUsersScreen() {
  const [list, setList] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const rows = await apiGet<BlockedUser[]>('/api/me/blocks');
      setList(rows);
    } catch {
      setList([]);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function unblock(u: BlockedUser) {
    if (pendingId) return;
    setPendingId(u.id);
    try {
      await apiSend(`/api/blocks/${u.id}`, 'DELETE');
      setList((l) => l.filter((x) => x.id !== u.id));
    } catch {
      // Leave the row in place on failure.
    }
    setPendingId(null);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.head}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Blocked users</Text>
        <View style={{ width: 38 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.signal} style={{ marginTop: 60 }} />
      ) : list.length === 0 ? (
        <Text style={styles.empty}>
          You haven&apos;t blocked anyone. Blocked writers are hidden across NovelStack
          for both of you.
        </Text>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {list.map((u) => (
            <View key={u.id} style={styles.row}>
              <View style={styles.avatar}>
                {u.avatarUrl ? (
                  <Image source={{ uri: u.avatarUrl }} style={styles.avatarImg} />
                ) : (
                  <Text style={styles.avatarInitial}>
                    {(u.displayName ?? '?').slice(0, 1).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={styles.rowText}>
                <Text style={styles.name} numberOfLines={1}>
                  {u.displayName}
                </Text>
                <Text style={styles.handle} numberOfLines={1}>
                  @{u.username}
                </Text>
              </View>
              <Pressable
                style={[styles.unblock, pendingId === u.id && { opacity: 0.5 }]}
                onPress={() => unblock(u)}
                disabled={pendingId === u.id}
              >
                <Text style={styles.unblockText}>Unblock</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
  },
  back: { width: 38, height: 38, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.display, fontSize: 18, color: colors.ink },
  empty: {
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: spacing.xl,
    paddingHorizontal: 40,
  },
  scroll: { paddingHorizontal: 20, paddingBottom: spacing.xl, gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 9 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 48, height: 48 },
  avatarInitial: { color: colors.ink, fontSize: 18, fontWeight: '600' },
  rowText: { flex: 1, minWidth: 0 },
  name: { fontSize: 15, fontWeight: '600', color: colors.ink },
  handle: { fontSize: 12.5, color: colors.inkFaint, marginTop: 1 },
  unblock: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 15,
    paddingVertical: 7,
  },
  unblockText: { fontSize: 12.5, fontWeight: '600', color: colors.inkMuted },
});
