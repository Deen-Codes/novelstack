import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, radius } from '@/theme/tokens';

// Placeholder threads — replace with a Supabase-backed `community_threads` table.
const threads = [
  { id: '1', topic: 'Romance', title: 'What actually makes a slow-burn work?', author: 'Maya R.', replies: 142 },
  { id: '2', topic: 'Writing', title: 'Keeping readers hooked between weekly drops', author: 'J. Okafor', replies: 88 },
  { id: '3', topic: 'Fantasy', title: 'Worldbuilding club — share your maps', author: 'R. Hollis', replies: 210 },
  { id: '4', topic: 'Feedback', title: 'First 3 chapters up — brutal honesty welcome', author: 'L. Chen', replies: 37 },
];

export default function Community() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.h1}>Community</Text>
        <Text style={styles.sub}>Clubs, discussions, and feedback threads. Find your people.</Text>

        {threads.map((t) => (
          <Pressable key={t.id} style={styles.card}>
            <Text style={styles.topic}>{t.topic}</Text>
            <Text style={styles.title}>{t.title}</Text>
            <Text style={styles.meta}>{t.author} · {t.replies} replies</Text>
          </Pressable>
        ))}

        <Pressable style={styles.newBtn}>
          <Text style={styles.newBtnText}>Start a discussion</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  h1: { fontSize: 28, fontWeight: '500', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.sm, lineHeight: 21, marginBottom: spacing.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  topic: { fontSize: 11, color: colors.signal, fontWeight: '500' },
  title: { fontSize: 16, fontWeight: '500', color: colors.ink, marginTop: 4, lineHeight: 22 },
  meta: { fontSize: 13, color: colors.inkFaint, marginTop: 6 },
  newBtn: {
    backgroundColor: colors.signal,
    paddingVertical: 13,
    borderRadius: radius.pill,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  newBtnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
});
