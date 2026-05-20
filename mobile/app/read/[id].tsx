import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { colors, spacing, radius } from '@/theme/tokens';
import { supabase } from '@/lib/supabase';

// Mirrors the web reader: shows the full body if entitled, otherwise the
// excerpt preview + a (simulated) rewarded-ad gate that records an ad_unlock.
export default function Reader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [chapter, setChapter] = useState<any>(null);
  const [body, setBody] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);

  async function load() {
    const { data: ch } = await supabase
      .from('chapters')
      .select('*, story:stories(title)')
      .eq('id', id)
      .single();
    setChapter(ch);
    const { data: content } = await supabase
      .from('chapter_content')
      .select('body')
      .eq('chapter_id', id)
      .single();
    setBody(content?.body ?? null);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function watchAd() {
    setUnlocking(true);
    await new Promise((r) => setTimeout(r, 2000)); // simulated rewarded ad
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('ad_unlocks').insert({ reader_id: user.id, chapter_id: id });
      await load();
    }
    setUnlocking(false);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  const locked = !body;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>

        <Text style={styles.ch}>Chapter {chapter?.number ?? ''}</Text>
        <Text style={styles.title}>{chapter?.title ?? 'Chapter'}</Text>
        <Text style={styles.body}>{locked ? chapter?.excerpt : body}</Text>

        {locked && (
          <View style={styles.endCard}>
            <Text style={styles.endText}>That's the preview — keep reading:</Text>
            <Pressable style={[styles.adBtn, unlocking && { opacity: 0.6 }]} onPress={watchAd} disabled={unlocking}>
              <Text style={styles.adBtnText}>
                {unlocking ? 'Loading ad…' : 'Watch a short ad to continue'}
              </Text>
            </Pressable>
            <Text style={styles.plus}>No ads with NovelStack+ — $6.99/month.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  back: { fontSize: 14, color: colors.inkMuted, marginBottom: spacing.lg },
  ch: { fontSize: 12, color: colors.inkFaint },
  title: { fontSize: 26, fontWeight: '500', color: colors.ink, marginTop: 4, marginBottom: spacing.lg },
  body: { fontSize: 19, lineHeight: 32, color: colors.ink },
  endCard: {
    marginTop: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.paperSoft,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
  },
  endText: { fontSize: 13, color: colors.inkMuted, marginBottom: spacing.md },
  adBtn: { backgroundColor: colors.signal, paddingVertical: 12, paddingHorizontal: 24, borderRadius: radius.pill },
  adBtnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
  plus: { fontSize: 12, color: colors.inkFaint, marginTop: spacing.md, textAlign: 'center' },
});
