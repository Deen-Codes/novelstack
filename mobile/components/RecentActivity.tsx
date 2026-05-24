import { useMemo } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { Cover } from '@/components/Cover';
import type { FeedStory } from '@/lib/types';

// Short relative time, e.g. "3h", "2d", "1w".
function ago(iso: string | null | undefined): string {
  if (!iso) return '';
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

// A calm, scrollable feed of writer activity — the social side of Community.
// Each entry is a post: who did what, and the book it's about.
export function RecentActivity({ stories }: { stories: FeedStory[] }) {
  const posts = useMemo(() => stories.filter((s) => !!s.author).slice(0, 18), [stories]);

  if (posts.length === 0) return null;

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Recent activity</Text>
      </View>
      <View style={styles.feed}>
        {posts.map((s) => {
          const name = s.author?.displayName ?? 'A writer';
          return (
            <Pressable
              key={s.id}
              style={styles.post}
              onPress={() => router.push(`/story/${s.slug}`)}
            >
              <View style={styles.postHead}>
                <View style={styles.avatar}>
                  {s.author?.avatarUrl ? (
                    <Image source={{ uri: s.author.avatarUrl }} style={styles.avatarImg} />
                  ) : (
                    <Text style={styles.avatarInitial}>
                      {name.slice(0, 1).toUpperCase()}
                    </Text>
                  )}
                </View>
                <View style={styles.headText}>
                  <Text style={styles.name} numberOfLines={1}>
                    {name}
                  </Text>
                  <Text style={styles.time}>
                    Published a story · {ago(s.publishedAt ?? s.createdAt)}
                  </Text>
                </View>
              </View>

              <View style={styles.body}>
                <Cover
                  coverUrl={s.coverUrl}
                  coverColor={s.coverColor}
                  title={s.title}
                  mature={s.isMature}
                  style={styles.cover}
                />
                <View style={styles.bookText}>
                  <Text style={styles.bookTitle} numberOfLines={2}>
                    {s.title}
                  </Text>
                  <Text style={styles.bookGenre}>{s.genre}</Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  title: { fontFamily: fonts.display, fontSize: 19, color: colors.ink },

  feed: { paddingHorizontal: 20, gap: 10 },
  post: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: 12,
  },
  postHead: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 38, height: 38 },
  avatarInitial: { color: colors.ink, fontSize: 15, fontWeight: '600' },
  headText: { flex: 1, minWidth: 0 },
  name: { fontSize: 14, fontWeight: '600', color: colors.ink },
  time: { fontSize: 12, color: colors.inkFaint, marginTop: 1 },

  body: { flexDirection: 'row', gap: 11, marginTop: 11 },
  cover: { width: 46, height: 62, borderRadius: 6 },
  bookText: { flex: 1, minWidth: 0, justifyContent: 'center' },
  bookTitle: { fontFamily: fonts.display, fontSize: 14.5, color: colors.ink },
  bookGenre: {
    fontSize: 12,
    color: colors.inkFaint,
    marginTop: 3,
    textTransform: 'capitalize',
  },
});
