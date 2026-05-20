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
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
import { colors, spacing, radius } from '@/theme/tokens';
import { supabase } from '@/lib/supabase';

type Chapter = {
  id: string;
  number: number;
  title: string;
  is_free: boolean;
  published_at: string | null;
};

function makeExcerpt(body: string) {
  return body.trim().split(/\s+/).slice(0, 200).join(' ');
}

export default function StoryWriter() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const [story, setStory] = useState<any>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  // Inline editor state — which chapter is open + its draft fields.
  const [editing, setEditing] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    const { data: s } = await supabase
      .from('stories')
      .select('id, title, genre, status')
      .eq('id', storyId)
      .single();
    setStory(s);
    const { data: chs } = await supabase
      .from('chapters')
      .select('id, number, title, is_free, published_at')
      .eq('story_id', storyId)
      .order('number');
    setChapters((chs ?? []) as Chapter[]);
    setLoading(false);
  }, [storyId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  async function addChapter() {
    if (busy) return;
    setBusy(true);
    const number = chapters.length + 1;
    const { data, error } = await supabase
      .from('chapters')
      .insert({ story_id: storyId, number, title: `Chapter ${number}`, is_free: number <= 3 })
      .select('id')
      .single();
    if (!error && data) {
      await supabase.from('chapter_content').insert({ chapter_id: data.id, body: '' });
      await load();
      openEditor({ id: data.id, number, title: `Chapter ${number}`, is_free: number <= 3, published_at: null });
    }
    setBusy(false);
  }

  async function openEditor(ch: Chapter) {
    setEditing(ch.id);
    setDraftTitle(ch.title);
    setStatus('');
    const { data } = await supabase
      .from('chapter_content')
      .select('body')
      .eq('chapter_id', ch.id)
      .single();
    setDraftBody((data as { body: string } | null)?.body ?? '');
  }

  async function save(ch: Chapter) {
    setBusy(true);
    setStatus('Saving…');
    const words = draftBody.trim() ? draftBody.trim().split(/\s+/).length : 0;
    await supabase
      .from('chapters')
      .update({
        title: draftTitle.trim() || `Chapter ${ch.number}`,
        excerpt: makeExcerpt(draftBody),
        word_count: words,
        page_count: Math.max(1, Math.round(words / 250)),
        updated_at: new Date().toISOString(),
      })
      .eq('id', ch.id);
    await supabase.from('chapter_content').upsert({ chapter_id: ch.id, body: draftBody });
    setStatus('Saved');
    setBusy(false);
    await load();
  }

  async function publish(ch: Chapter) {
    setBusy(true);
    await save(ch);
    await supabase
      .from('chapters')
      .update({ published_at: new Date().toISOString() })
      .eq('id', ch.id);
    await supabase
      .from('stories')
      .update({ status: 'ongoing', published_at: new Date().toISOString() })
      .eq('id', storyId)
      .is('published_at', null);
    setStatus('Published');
    setBusy(false);
    setEditing(null);
    await load();
  }

  async function toggleFree(ch: Chapter) {
    await supabase.from('chapters').update({ is_free: !ch.is_free }).eq('id', ch.id);
    await load();
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Write</Text>
        </Pressable>
        <Text style={styles.h1}>{story?.title ?? 'Story'}</Text>
        <Text style={styles.sub}>
          {story?.genre} · {story?.status}
        </Text>

        <Pressable style={[styles.addBtn, busy && { opacity: 0.6 }]} onPress={addChapter} disabled={busy}>
          <Text style={styles.addBtnText}>+ New chapter</Text>
        </Pressable>

        {chapters.length === 0 && (
          <Text style={styles.empty}>No chapters yet. Add your first one above.</Text>
        )}

        {chapters.map((ch) => (
          <View key={ch.id} style={styles.card}>
            <Pressable
              style={styles.cardHead}
              onPress={() => (editing === ch.id ? setEditing(null) : openEditor(ch))}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>
                  {ch.number}. {ch.title}
                </Text>
                <Text style={styles.cardMeta}>
                  {ch.published_at ? 'Published' : 'Draft'} · {ch.is_free ? 'Free' : 'Locked'}
                </Text>
              </View>
              <Text style={styles.chevron}>{editing === ch.id ? '▾' : '›'}</Text>
            </Pressable>

            {editing === ch.id && (
              <View style={styles.editor}>
                <TextInput
                  value={draftTitle}
                  onChangeText={setDraftTitle}
                  placeholder="Chapter title"
                  placeholderTextColor={colors.inkFaint}
                  style={styles.input}
                />
                <TextInput
                  value={draftBody}
                  onChangeText={setDraftBody}
                  placeholder="Write your chapter…"
                  placeholderTextColor={colors.inkFaint}
                  multiline
                  style={[styles.input, styles.bodyInput]}
                />
                <Pressable style={styles.freeRow} onPress={() => toggleFree(ch)}>
                  <View style={[styles.checkbox, ch.is_free && styles.checkboxOn]}>
                    {ch.is_free && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={styles.freeText}>Free chapter (no ad/NovelStack+ gate)</Text>
                </Pressable>
                <View style={styles.editorBtns}>
                  <Pressable
                    style={[styles.ghostBtn, busy && { opacity: 0.6 }]}
                    onPress={() => save(ch)}
                    disabled={busy}
                  >
                    <Text style={styles.ghostBtnText}>Save draft</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.addBtn, { flex: 1, marginTop: 0 }, busy && { opacity: 0.6 }]}
                    onPress={() => publish(ch)}
                    disabled={busy}
                  >
                    <Text style={styles.addBtnText}>
                      {ch.published_at ? 'Save & update' : 'Publish chapter'}
                    </Text>
                  </Pressable>
                </View>
                {!!status && <Text style={styles.status}>{status}</Text>}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 3 },
  back: { fontSize: 14, color: colors.inkMuted, marginBottom: spacing.md },
  h1: { fontSize: 26, fontWeight: '500', color: colors.ink, letterSpacing: -0.5 },
  sub: { fontSize: 13, color: colors.inkFaint, marginTop: 4, textTransform: 'capitalize' },
  empty: { fontSize: 13, color: colors.inkMuted, marginTop: spacing.md },
  addBtn: {
    backgroundColor: colors.signal,
    paddingVertical: 12,
    borderRadius: radius.pill,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  addBtnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', padding: spacing.md },
  cardTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  cardMeta: { fontSize: 12, color: colors.inkFaint, marginTop: 3 },
  chevron: { fontSize: 18, color: colors.inkFaint },
  editor: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
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
  bodyInput: { height: 220, textAlignVertical: 'top', fontSize: 16, lineHeight: 24 },
  freeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.signal, borderColor: colors.signal },
  checkMark: { color: colors.paper, fontSize: 12, fontWeight: '700' },
  freeText: { fontSize: 13, color: colors.inkMuted, flex: 1 },
  editorBtns: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  ghostBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  ghostBtnText: { color: colors.inkMuted, fontSize: 14, fontWeight: '500' },
  status: { fontSize: 12, color: colors.signal, textAlign: 'right' },
});
