// In-app notification centre. Until there's a dedicated notifications table,
// the bell surfaces what matters most to a reader: new chapters and books
// from the writers they follow, derived from the (cached) home feed.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGetCached } from './api';
import type { FeedStory } from './types';

const SEEN_KEY = 'novelstack_notifs_seen_at';

export type AppNotification = {
  id: string;
  title: string;
  author: string;
  slug: string;
  coverUrl: string | null;
  coverColor: string | null;
  isMature: boolean;
  at: string;
};

// Updates worth a notification — currently new work from followed writers.
export async function getNotifications(): Promise<AppNotification[]> {
  let feed: FeedStory[] = [];
  try {
    feed = await apiGetCached<FeedStory[]>('/api/feed');
  } catch {
    return [];
  }
  return feed
    .filter((s) => s._reason === 'From a writer you follow' && !!s.author)
    .slice(0, 30)
    .map((s) => ({
      id: s.id,
      title: s.title,
      author: s.author?.displayName ?? 'A writer',
      slug: s.slug,
      coverUrl: s.coverUrl,
      coverColor: s.coverColor,
      isMature: s.isMature,
      at: s.publishedAt ?? s.createdAt,
    }));
}

// How many notifications are newer than the reader last opened the bell.
export async function getUnreadCount(): Promise<number> {
  const items = await getNotifications();
  if (items.length === 0) return 0;
  let seenAt = 0;
  try {
    const stored = await AsyncStorage.getItem(SEEN_KEY);
    if (stored) seenAt = Date.parse(stored);
  } catch {
    seenAt = 0;
  }
  return items.filter((n) => {
    const t = Date.parse(n.at);
    return !Number.isNaN(t) && t > seenAt;
  }).length;
}

// Marks everything seen — called when the notifications screen opens.
export async function markNotificationsSeen(): Promise<void> {
  try {
    await AsyncStorage.setItem(SEEN_KEY, new Date().toISOString());
  } catch {
    // Best-effort — the badge simply lingers until next time.
  }
}
