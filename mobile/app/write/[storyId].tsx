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
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius } from '@/theme/tokens';
import { apiGet, apiSend, apiUpload } from '@/lib/api';
import { Cover } from '@/components/Cover';
import type { Shelf, Story, Chapter, StoryDetail, ChapterDetail } from '@/lib/types';

export default function StoryWriter() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverError, setCoverError] = useState('');

  // Inline editor state — which chapter is open + its draft fields. `null`
  // means nothing open; 'new' means the create-chapter form.
  const [editing, setEditing] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftBody, setDraftBody] = useState('');
  const [draftFree, setDraftFree] = useState(true);

  const load = useCallback(async () => {
    // The shelf carries the full Story (incl. slug) for every story we own.
    let mine: Story | undefined;
    try {
      const shelf = await apiGet<Shelf>('/api/me/shelf');
      mine = shelf.writing.find((s) => s.id === storyId);
    } catch {
      mine = undefined;
    }
    if (!mine) {
      setStory(null);
      setLoading(false);
      return;
    }
    setStory(mine);

    // Chapters come from the public story-by-slug endpoint.
    try {
      const detail = await apiGet<StoryDetail>(`/api/stories/${mine.slug}`);
      setChapters([...detail.chapters].sort((a, b) => a.number - b.number));
    } catch {
      setChapters([]);
    }
    setLoading(false);
  }, [storyId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // Opens the create-chapter form.
  function openNew() {
    setEditing('new');
    setDraftTitle(`Chapter ${chapters.length + 1}`);
    setDraftBody('');
    setDraftFree(chapters.length < 3);
    setStatus('');
  }

  // Opens an existing chapter — its body is fetched (authors can read it).
  async function openEditor(ch: Chapter) {
    setEditing(ch.id);
    setDraftTitle(ch.title);
    setDraftFree(ch.isFree);
    setStatus('');
    try {
      const detail = await apiGet<ChapterDetail>(`/api/chapters/${ch.id}`);
      setDraftBody(detail.body ?? '');
    } catch {
      setDraftBody('');
    }
  }

  // Creating a chapter publishes it immediately (API behaviour).
  async function createChapter() {
    if (busy) return;
    setBusy(true);
    setStatus('Publishing…');
    try {
      await apiSend<Chapter>(`/api/me/stories/${storyId}/chapters`, 'POST', {
        title: draftTitle.trim() || `Chapter ${chapters.length + 1}`,
        body: draftBody,
        isFree: draftFree,
      });
      setStatus('Published');
      setEditing(null);
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not publish.');
    }
    setBusy(false);
  }

  async function saveChapter(ch: Chapter) {
    if (busy) return;
    setBusy(true);
    setStatus('Saving…');
    try {
      await apiSend<Chapter>(`/api/me/chapters/${ch.id}`, 'PATCH', {
        title: draftTitle.trim() || `Chapter ${ch.number}`,
        body: draftBody,
        isFree: draftFree,
      });
      setStatus('Saved');
      await load();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : 'Could not save.');
    }
    setBusy(false);
  }

  // Toggles whether a published chapter is free.
  async function toggleFree(ch: Chapter) {
    try {
      await apiSend<Chapter>(`/api/me/chapters/${ch.id}`, 'PATCH', { isFree: !ch.isFree });
      await load();
    } catch {
      // Ignore — UI will reflect server state on next load.
    }
  }

  // Picks an image from the library, uploads it to R2, saves it on the story.
  async function pickCover() {
    if (coverBusy || !story) return;
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setCoverError('Photo access is needed to choose a cover.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.85,
    });
    if (result.canceled) return;

    const asset = result.assets[0];
    setCoverBusy(true);
    setCoverError('');
    try {
      const ext = (asset.uri.split('.').pop() || 'jpg').toLowerCase();
      const type =
        ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      const { coverUrl } = await apiUpload<{ coverUrl: string }>('/api/me/cover', {
        uri: asset.uri,
        name: `cover.${ext}`,
        type,
      });
      const updated = await apiSend<Story>(
        `/api/me/stories/${storyId}`,
        'PATCH',
        { coverUrl },
      );
      setStory(updated);
    } catch (e) {
      setCoverError(e instanceof Error ? e.message : 'Could not upload cover.');
    }
    setCoverBusy(false);
  }

  // Flips the story's mature (18+) flag.
  async function toggleMature() {
    if (!story || busy) return;
    try {
      const updated = await apiSend<Story>(`/api/me/stories/${storyId}`, 'PATCH', {
        isMature: !story.isMature,
      });
      setStory(updated);
    } catch {
      // UI reflects server state on next load.
    }
  }

  // Marks the whole story as live (ongoing).
  async function publishStory() {
    if (busy || !story) return;
    setBusy(true);
    try {
      const updated = await apiSend<Story>(
        `/api/me/stories/${storyId}/status`,
        'POST',
        { status: 'ongoing' },
      );
      setStory(updated);
    } catch {
      // Ignore failure.
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

  if (!story) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.scroll}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>‹ Write</Text>
          </Pressable>
          <Text style={styles.empty}>Story not found, or it isn&apos;t yours.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Write</Text>
        </Pressable>
        <Text style={styles.h1}>{story.title}</Text>
        <Text style={styles.sub}>
          {story.genre} · {story.status}
        </Text>

        <View style={styles.coverCard}>
          <Cover
            coverUrl={story.coverUrl}
            coverColor={story.coverColor}
            title={story.title}
            style={styles.coverThumb}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.coverLabel}>Cover image</Text>
            <Text style={styles.coverHint}>JPEG, PNG or WebP · up to 5 MB</Text>
            <Pressable
              style={[styles.coverBtn, coverBusy && { opacity: 0.6 }]}
              onPress={pickCover}
              disabled={coverBusy}
            >
              <Text style={styles.coverBtnText}>
                {coverBusy ? 'Uploading…' : story.coverUrl ? 'Replace cover' : 'Upload cover'}
              </Text>
            </Pressable>
            {!!coverError && <Text style={styles.coverError}>{coverError}</Text>}
          </View>
        </View>

        <Pressable style={styles.matureRow} onPress={toggleMature}>
          <View style={[styles.checkbox, story.isMature && styles.checkboxOn]}>
            {story.isMature && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={styles.freeText}>Mature (18+) — readers confirm their age first</Text>
        </Pressable>

        {story.status === 'draft' && (
          <Pressable
            style={[styles.addBtn, busy && { opacity: 0.6 }]}
            onPress={publishStory}
            disabled={busy}
          >
            <Text style={styles.addBtnText}>Make story live</Text>
          </Pressable>
        )}

        <Pressable style={[styles.addBtn, busy && { opacity: 0.6 }]} onPress={openNew} disabled={busy}>
          <Text style={styles.addBtnText}>+ New chapter</Text>
        </Pressable>

        {editing === 'new' && (
          <View style={styles.card}>
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
              <Pressable style={styles.freeRow} onPress={() => setDraftFree(!draftFree)}>
                <View style={[styles.checkbox, draftFree && styles.checkboxOn]}>
                  {draftFree && <Text style={styles.checkMark}>✓</Text>}
                </View>
                <Text style={styles.freeText}>Free chapter (no ad/NovelStack+ gate)</Text>
              </Pressable>
              <View style={styles.editorBtns}>
                <Pressable style={styles.ghostBtn} onPress={() => setEditing(null)}>
                  <Text style={styles.ghostBtnText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.addBtn, { flex: 1, marginTop: 0 }, busy && { opacity: 0.6 }]}
                  onPress={createChapter}
                  disabled={busy}
                >
                  <Text style={styles.addBtnText}>Publish chapter</Text>
                </Pressable>
              </View>
              {!!status && <Text style={styles.status}>{status}</Text>}
            </View>
          </View>
        )}

        {chapters.length === 0 && editing !== 'new' && (
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
                  {ch.publishedAt ? 'Published' : 'Draft'} · {ch.isFree ? 'Free' : 'Locked'}
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
                  <View style={[styles.checkbox, ch.isFree && styles.checkboxOn]}>
                    {ch.isFree && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                  <Text style={styles.freeText}>Free chapter (no ad/NovelStack+ gate)</Text>
                </Pressable>
                <View style={styles.editorBtns}>
                  <Pressable
                    style={[styles.addBtn, { flex: 1, marginTop: 0 }, busy && { opacity: 0.6 }]}
                    onPress={() => saveChapter(ch)}
                    disabled={busy}
                  >
                    <Text style={styles.addBtnText}>Save & update</Text>
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
  coverCard: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  coverThumb: {
    width: 64,
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  coverLabel: { fontSize: 14, fontWeight: '500', color: colors.ink },
  coverHint: { fontSize: 12, color: colors.inkFaint, marginTop: 2, marginBottom: 8 },
  coverBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  coverBtnText: { fontSize: 13, fontWeight: '500', color: colors.ink },
  coverError: { fontSize: 12, color: '#C0392B', marginTop: 6 },
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
  matureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: spacing.lg },
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
