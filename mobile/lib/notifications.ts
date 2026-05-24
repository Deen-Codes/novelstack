// In-app notification centre — backed by the real /api/notifications feed:
// likes, comments, follows and tips on your content, plus new chapters from
// writers you follow and books you've saved.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiGetCached } from './api';

const SEEN_KEY = 'novelstack_notifs_seen_at';

export type AppNotification = {
  id: string;
  kind: string; // post_comment · post_like · follow · tip · chapter
  at: string;
  text: string;
  storySlug: string | null;
  postId: string | null;
};

export async function getNotifications(): Promise<AppNotification[]> {
  try {
    return await apiGetCached<AppNotification[]>('/api/notifications');
  } catch {
    return [];
  }
}

// How many notifications are newer than the last time the bell was opened.
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
