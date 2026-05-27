import { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGet, apiSend, apiUpload } from '@/lib/api';
import { genreLabel } from '@/lib/genres';
import { Cover } from '@/components/Cover';
import type { Shelf, Story, Chapter, StoryDetail } from '@/lib/types';

export default function StoryWriter() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverError, setCoverError] = useState('');
  const [tab, setTab] = useState<'cover' | 'status' | 'access'>('cover');

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

  // Opens the immersive editor to draft a brand-new chapter.
  function openNew() {
    router.push({
      pathname: '/write/chapter/[id]',
      params: { id: 'new', storyId, next: String(chapters.length + 1) },
    });
  }

  // Opens an existing chapter in the immersive editor.
  function openEditor(ch: Chapter) {
    router.push({ pathname: '/write/chapter/[id]', params: { id: ch.id } });
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
      // Lower quality keeps the upload small + fast — covers display small.
      quality: 0.5,
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

  // Sets the story's status — draft → live, ongoing ⟷ complete, or back
  // to draft to take the story offline.
  async function changeStatus(next: 'draft' | 'ongoing' | 'complete') {
    if (busy || !story || story.status === next) return;
    setBusy(true);
    try {
      const updated = await apiSend<Story>(
        `/api/me/stories/${storyId}/status`,
        'POST',
        { status: next },
      );
      setStory(updated);
    } catch {
      // Ignore failure.
    }
    setBusy(false);
  }

  // Ad-gating cutoff: makes the first `n` chapters free and gates the rest.
  async function setFreeChapters(n: number) {
    if (busy) return;
    setBusy(true);
    try {
      await Promise.all(
        chapters.map((c, i) => {
          const shouldBeFree = i < n;
          return c.isFree === shouldBeFree
            ? Promise.resolve()
            : apiSend(`/api/me/chapters/${c.id}`, 'PATCH', { isFree: shouldBeFree });
        }),
      );
      await load();
    } catch {
      // UI reflects server state on next load.
    }
    setBusy(false);
  }

  // Permanently deletes the story (chapters cascade). Confirmed first.
  async function deleteStoryNow() {
    try {
      await apiSend(`/api/me/stories/${storyId}`, 'DELETE');
      router.replace('/write');
    } catch {
      setStatus('Could not delete the story. Try again.');
    }
  }

  function confirmDelete() {
    Alert.alert(
      'Delete this story?',
      'This permanently removes the story and all its chapters. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: deleteStoryNow },
      ],
    );
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
          <Pressable
            onPress={() => router.back()}
            hitSlop={16}
            style={styles.backWrap}
          >
            <Text style={styles.back}>‹ Write</Text>
          </Pressable>
          <Text style={styles.empty}>Story not found, or it isn&apos;t yours.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const freeCount = chapters.filter((c) => c.isFree).length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Write</Text>
        </Pressable>
        <Text style={styles.h1}>{story.title}</Text>
        <Text style={styles.sub}>
          {genreLabel(story.genre)} · {story.status === 'draft' ? 'Offline draft' : story.status}
        </Text>

        <View style={styles.tabs}>
          {(['cover', 'status', 'access'] as const).map((t) => (
            <Pressable
              key={t}
              style={[styles.tab, tab === t && styles.tabOn]}
              onPress={() => setTab(t)}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextOn]}>
                {t === 'cover' ? 'Cover' : t === 'status' ? 'Status' : 'Access'}
              </Text>
            </Pressable>
          ))}
        </View>

        {tab === 'cover' && (
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
        )}

        {tab === 'status' && (
          <>
            <Pressable style={styles.matureRow} onPress={toggleMature}>
              <View style={[styles.checkbox, story.isMature && styles.checkboxOn]}>
                {story.isMature && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.freeText}>
                Mature (18+) — readers confirm their age first
              </Text>
            </Pressable>

            {story.status === 'draft' ? (
              <Pressable
                style={[styles.addBtn, busy && { opacity: 0.6 }]}
                onPress={() => changeStatus('ongoing')}
                disabled={busy}
              >
                <Text style={styles.addBtnText}>Make story live</Text>
              </Pressable>
            ) : (
              <View style={styles.settingCard}>
                <Text style={styles.cardLabel}>Story status</Text>
                <View style={styles.segment}>
                  <Pressable
                    style={[styles.segBtn, story.status === 'ongoing' && styles.segOn]}
                    onPress={() => changeStatus('ongoing')}
                    disabled={busy}
                  >
                    <Text
                      style={[styles.segText, story.status === 'ongoing' && styles.segTextOn]}
                    >
                      Ongoing
                    </Text>
                  </Pressable>
                  <Pressable
                    style={[styles.segBtn, story.status === 'complete' && styles.segOn]}
                    onPress={() => changeStatus('complete')}
                    disabled={busy}
                  >
                    <Text
                      style={[styles.segText, story.status === 'complete' && styles.segTextOn]}
                    >
                      Complete
                    </Text>
                  </Pressable>
                </View>
                <Text style={styles.cardHint}>
                  {story.status === 'complete'
                    ? 'Readers see this as a finished book.'
                    : 'Readers know more chapters are still coming.'}
                </Text>
                <Pressable
                  style={[styles.offlineBtn, busy && { opacity: 0.5 }]}
                  onPress={() => changeStatus('draft')}
                  disabled={busy}
                >
                  <Text style={styles.offlineBtnText}>Take offline — back to draft</Text>
                </Pressable>
                <Text style={styles.cardHint}>
                  An offline story is hidden from readers until you make it live again.
                </Text>
              </View>
            )}
          </>
        )}

        {tab === 'access' &&
          (chapters.length > 0 ? (
            <View style={styles.settingCard}>
              <Text style={styles.cardLabel}>Reader access</Text>
              <View style={styles.stepper}>
                <Pressable
                  style={[styles.stepBtn, busy && { opacity: 0.5 }]}
                  onPress={() => setFreeChapters(Math.max(0, freeCount - 1))}
                  disabled={busy || freeCount === 0}
                >
                  <Text style={styles.stepBtnText}>−</Text>
                </Pressable>
                <Text style={styles.stepValue}>{freeCount}</Text>
                <Pressable
                  style={[styles.stepBtn, busy && { opacity: 0.5 }]}
                  onPress={() => setFreeChapters(Math.min(chapters.length, freeCount + 1))}
                  disabled={busy || freeCount >= chapters.length}
                >
                  <Text style={styles.stepBtnText}>+</Text>
                </Pressable>
                <Text style={styles.stepLabel}>
                  free chapter{freeCount === 1 ? '' : 's'}
                </Text>
              </View>
              <Text style={styles.cardHint}>
                {freeCount >= chapters.length
                  ? 'Every chapter is free to read.'
                  : `Chapter ${freeCount + 1} onward is gated behind an ad or NovelStack+.`}
              </Text>
            </View>
          ) : (
            <View style={styles.settingCard}>
              <Text style={styles.cardLabel}>Reader access</Text>
              <Text style={styles.cardHint}>
                Add chapters first — then choose how many are free to read before the ad gate.
              </Text>
            </View>
          ))}

        <Pressable style={[styles.addBtn, busy && { opacity: 0.6 }]} onPress={openNew} disabled={busy}>
          <Text style={styles.addBtnText}>+ New chapter</Text>
        </Pressable>

        {chapters.length === 0 && (
          <Text style={styles.empty}>No chapters yet. Add your first one above.</Text>
        )}

        {chapters.map((ch) => (
          <Pressable key={ch.id} style={styles.card} onPress={() => openEditor(ch)}>
            <View style={styles.cardHead}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>
                  {ch.number}. {ch.title}
                </Text>
                <Text style={styles.cardMeta}>
                  {ch.publishedAt ? 'Published' : 'Draft'} · {ch.isFree ? 'Free' : 'Locked'}
                  {ch.wordCount ? ` · ${ch.wordCount.toLocaleString()} words` : ''}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </Pressable>
        ))}

        {!!status && <Text style={styles.status}>{status}</Text>}

        <Pressable style={styles.deleteBtn} onPress={confirmDelete}>
          <Text style={styles.deleteBtnText}>Delete story</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 3 },
  // Larger hit target — the small "‹ Write" link was a pain to tap.
  backWrap: { paddingVertical: 8, paddingRight: 16, marginBottom: 4, alignSelf: 'flex-start' },
  back: { fontSize: 16, fontWeight: '500', color: colors.ink },
  tabs: {
    flexDirection: 'row',
    gap: 4,
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  tabOn: { backgroundColor: colors.signal },
  tabText: { fontSize: 13, fontWeight: '700', color: colors.inkMuted },
  tabTextOn: { color: '#FFFFFF' },
  h1: { fontFamily: fonts.displayXl, fontSize: 26, color: colors.ink, letterSpacing: -0.5 },
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
  deleteBtn: {
    marginTop: spacing.xl,
    paddingVertical: 13,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#5A2A2E',
    alignItems: 'center',
  },
  deleteBtnText: { fontSize: 14, color: '#D9656F', fontWeight: '500' },
  addBtn: {
    backgroundColor: '#F4ECDF',
    paddingVertical: 15,
    borderRadius: radius.md,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  addBtnText: { color: '#15100E', fontSize: 15, fontWeight: '700' },
  offlineBtn: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  offlineBtnText: { fontSize: 12.5, color: colors.inkMuted, fontWeight: '600' },
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

  settingCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  cardLabel: { fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 10 },
  cardHint: { fontSize: 12, color: colors.inkFaint, marginTop: 10, lineHeight: 17 },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    padding: 3,
    gap: 3,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  segOn: { backgroundColor: colors.signal },
  segText: { fontSize: 13, fontWeight: '600', color: colors.inkMuted },
  segTextOn: { color: '#FFFFFF' },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { fontSize: 20, color: colors.ink, fontWeight: '600' },
  stepValue: {
    fontFamily: fonts.displayXl,
    fontSize: 22,
    color: colors.ink,
    minWidth: 26,
    textAlign: 'center',
  },
  stepLabel: { fontSize: 13, color: colors.inkMuted },
});
