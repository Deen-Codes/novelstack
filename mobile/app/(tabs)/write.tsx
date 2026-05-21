import { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { colors, spacing, radius } from '@/theme/tokens';
import { supabase } from '@/lib/supabase';
import { GENRES } from '@/lib/genres';

type Story = {
  id: string;
  title: string;
  genre: string;
  status: string;
  chapterCount: number;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export default function Write() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('romance');
  const [desc, setDesc] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    setSignedIn(true);
    const { data } = await supabase
      .from('stories')
      .select('id, title, genre, status, chapters(id)')
      .eq('author_id', user.id)
      .order('updated_at', { ascending: false });
    setStories(
      ((data ?? []) as any[]).map((s) => ({
        id: s.id,
        title: s.title,
        genre: s.genre,
        status: s.status,
        chapterCount: (s.chapters ?? []).length,
      }))
    );
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  async function createStory() {
    if (!title.trim() || busy) return;
    setBusy(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setBusy(false);
      return;
    }
    const slug = `${slugify(title)}-${Math.random().toString(36).slice(2, 7)}`;
    const { data, error } = await supabase
      .from('stories')
      .insert({
        author_id: user.id,
        title: title.trim(),
        slug,
        description: desc.trim(),
        genre,
        status: 'draft',
      })
      .select('id')
      .single();
    setBusy(false);
    if (error || !data) return;
    setTitle('');
    setDesc('');
    setCreating(false);
    router.push(`/write/${data.id}`);
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
          <Text style={styles.h1}>Write</Text>
          <Text style={styles.sub}>Sign in to start a story and publish chapters.</Text>
          <Pressable style={styles.primaryBtn} onPress={() => router.push('/signin')}>
            <Text style={styles.primaryBtnText}>Sign in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.h1}>Write</Text>
        <Text style={styles.sub}>Draft and publish chapters. Tap a story to manage it.</Text>

        {!creating ? (
          <Pressable style={styles.primaryBtn} onPress={() => setCreating(true)}>
            <Text style={styles.primaryBtnText}>+ New story</Text>
          </Pressable>
        ) : (
          <View style={styles.form}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Story title"
              placeholderTextColor={colors.inkFaint}
              style={styles.input}
            />
            <View style={styles.chips}>
              {GENRES.map((g) => (
                <Pressable
                  key={g.value}
                  style={[styles.chip, genre === g.value && styles.chipActive]}
                  onPress={() => setGenre(g.value)}
                >
                  <Text style={[styles.chipText, genre === g.value && styles.chipTextActive]}>
                    {g.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Short description"
              placeholderTextColor={colors.inkFaint}
              multiline
              style={[styles.input, { height: 72, textAlignVertical: 'top' }]}
            />
            <View style={styles.formBtns}>
              <Pressable style={styles.ghostBtn} onPress={() => setCreating(false)}>
                <Text style={styles.ghostBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.primaryBtn, { flex: 1 }, busy && { opacity: 0.6 }]}
                onPress={createStory}
                disabled={busy}
              >
                <Text style={styles.primaryBtnText}>{busy ? 'Creating…' : 'Create story'}</Text>
              </Pressable>
            </View>
          </View>
        )}

        <Text style={styles.section}>Your stories</Text>
        {stories.length === 0 ? (
          <Text style={styles.empty}>No stories yet. Start your first one above.</Text>
        ) : (
          stories.map((s) => (
            <Pressable key={s.id} style={styles.card} onPress={() => router.push(`/write/${s.id}`)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{s.title}</Text>
                <Text style={styles.cardMeta}>
                  {s.genre} · {s.chapterCount} chapter{s.chapterCount === 1 ? '' : 's'}
                </Text>
              </View>
              <Text style={[styles.badge, s.status === 'draft' && styles.badgeDraft]}>
                {s.status}
              </Text>
            </Pressable>
          ))
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
  sub: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.sm, lineHeight: 21, marginBottom: spacing.lg },
  section: { fontSize: 16, fontWeight: '500', color: colors.ink, marginTop: spacing.xl, marginBottom: spacing.md },
  empty: { fontSize: 13, color: colors.inkMuted },
  primaryBtn: {
    backgroundColor: colors.signal,
    paddingVertical: 13,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  primaryBtnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
  ghostBtn: {
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  ghostBtnText: { color: colors.inkMuted, fontSize: 14, fontWeight: '500' },
  form: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: colors.paperSoft,
    color: colors.ink,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  chipActive: { backgroundColor: colors.signal, borderColor: colors.signal },
  chipText: { fontSize: 12, color: colors.inkMuted, textTransform: 'capitalize' },
  chipTextActive: { color: colors.paper },
  formBtns: { flexDirection: 'row', gap: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  cardTitle: { fontSize: 16, fontWeight: '500', color: colors.ink },
  cardMeta: { fontSize: 12, color: colors.inkFaint, marginTop: 3, textTransform: 'capitalize' },
  badge: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.signal,
    textTransform: 'capitalize',
  },
  badgeDraft: { color: colors.inkFaint },
});
