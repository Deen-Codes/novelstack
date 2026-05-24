import { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { Cover } from '@/components/Cover';
import {
  getNotifications,
  markNotificationsSeen,
  type AppNotification,
} from '@/lib/notifications';

function ago(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (Number.isNaN(ms) || ms < 0) return 'just now';
  const m = Math.floor(ms / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return `${Math.floor(d / 7)}w ago`;
}

// The in-app notification centre — opened from the top-bar bell. Opening it
// marks everything seen, which clears the bell badge.
export default function Notifications() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getNotifications().then((n) => {
      if (!cancelled) {
        setItems(n);
        setLoading(false);
      }
    });
    markNotificationsSeen();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.head}>
        <Pressable style={styles.back} onPress={() => router.back()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 38 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.signal} style={{ marginTop: 60 }} />
      ) : items.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="notifications-outline" size={26} color={colors.signal} />
          </View>
          <Text style={styles.emptyTitle}>You&apos;re all caught up</Text>
          <Text style={styles.emptyBody}>
            New chapters and books from the writers you follow will show up here.
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          {items.map((n) => (
            <Pressable
              key={n.id}
              style={styles.row}
              onPress={() => router.push(`/story/${n.slug}`)}
            >
              <Cover
                coverUrl={n.coverUrl}
                coverColor={n.coverColor}
                title={n.title}
                mature={n.isMature}
                style={styles.cover}
              />
              <View style={styles.rowText}>
                <Text style={styles.line1} numberOfLines={2}>
                  <Text style={styles.author}>{n.author}</Text>
                  <Text style={styles.dim}> published </Text>
                  <Text style={styles.work}>{n.title}</Text>
                </Text>
                <Text style={styles.time}>{ago(n.at)}</Text>
              </View>
            </Pressable>
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

  empty: { alignItems: 'center', paddingHorizontal: 40, marginTop: spacing.xl * 2 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 19,
    color: colors.ink,
    marginTop: spacing.lg,
  },
  emptyBody: {
    fontSize: 14,
    color: colors.inkMuted,
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 8,
  },

  scroll: { paddingHorizontal: 20, paddingBottom: spacing.xl, gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: 11,
  },
  cover: { width: 44, height: 60, borderRadius: 6 },
  rowText: { flex: 1, minWidth: 0 },
  line1: { fontSize: 13.5, lineHeight: 19 },
  author: { color: colors.ink, fontWeight: '600' },
  dim: { color: colors.inkMuted },
  work: { color: colors.ink, fontWeight: '500' },
  time: { fontSize: 12, color: colors.inkFaint, marginTop: 3 },
});
