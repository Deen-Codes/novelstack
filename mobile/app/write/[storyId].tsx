import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGet, apiSend, apiUpload } from '@/lib/api';
import { GENRES, genreLabel } from '@/lib/genres';
import { Cover } from '@/components/Cover';
import { CoverEditor, type CoverEditorHandle } from '@/components/CoverEditor';
import { AppleMusicSwitcher } from '@/components/AppleMusicSwitcher';
import type { Shelf, Story, Chapter, StoryDetail } from '@/lib/types';

// Two-tab navigation — Cover hosts the whole book identity (title via the
// CoverEditor, genre, description, mature toggle, cover image). Chapters
// hosts the chapter list + Live/Draft and Ongoing/Complete book status.
// A bottom Apple-Music-style switcher swaps between them.
type Section = 'cover' | 'chapters';

const SECTION_LABELS: Record<
  Section,
  { label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }
> = {
  cover: { label: 'Cover', icon: 'image-outline' },
  chapters: { label: 'Chapters', icon: 'list-outline' },
};

export default function StoryWriter() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverError, setCoverError] = useState('');
  // Smart default: land on Chapters if the story already has any (the
  // writer is here to carry on writing), else Cover (it's a fresh story
  // that hasn't been set up yet). Bumped from 'cover' to its real value
  // inside `load()` once we know chapters.length.
  const [tab, setTab] = useState<Section>('cover');
  const [tabExplicitlySet, setTabExplicitlySet] = useState(false);
  // Local working copy of the title — flows into CoverEditor and back so the
  // author can type a new title directly onto the cover.
  const [coverTitleDraft, setCoverTitleDraft] = useState<string>('');
  const coverEditorRef = useRef<CoverEditorHandle | null>(null);

  // Hamburger FAB state — open toggles a stack of action buttons that fly
  // out from the bottom-right where the thumb naturally lives.
  const [menuOpen, setMenuOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const menuAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.spring(menuAnim, {
      toValue: menuOpen ? 1 : 0,
      useNativeDriver: true,
      stiffness: 220,
      damping: 22,
      mass: 0.7,
    }).start();
  }, [menuOpen, menuAnim]);

  // Details editor (inline, not a bottom sheet) — drafts are seeded from the
  // story once it loads so the inputs are immediately populated.
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDesc, setDraftDesc] = useState('');
  const [draftGenre, setDraftGenre] = useState('');
  const [genreQuery, setGenreQuery] = useState('');
  const [showGenrePicker, setShowGenrePicker] = useState(false);
  const [detailsBusy, setDetailsBusy] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [detailsSaved, setDetailsSaved] = useState(false);

  // Optimistic per-chapter pending state for the Free/Paid toggle so the
  // pill flips immediately even while the PATCH is in flight.
  const [pendingFreeId, setPendingFreeId] = useState<string | null>(null);

  function selectSection(s: Section) {
    setTab(s);
    setMenuOpen(false);
  }

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
    // Seed the Details drafts so the inputs match the story without an
    // extra "edit" tap.
    setDraftTitle(mine.title);
    setDraftDesc(mine.description ?? '');
    setDraftGenre(mine.genre);
    setCoverTitleDraft(mine.title);

    // Chapters come from the public story-by-slug endpoint.
    let loadedChapters: Chapter[] = [];
    try {
      const detail = await apiGet<StoryDetail>(`/api/stories/${mine.slug}`);
      loadedChapters = [...detail.chapters].sort((a, b) => a.number - b.number);
      setChapters(loadedChapters);
    } catch {
      setChapters([]);
    }
    // Smart default — only fires the first time, never overrides a user pick.
    if (!tabExplicitlySet) {
      setTab(loadedChapters.length > 0 ? 'chapters' : 'cover');
    }
    setLoading(false);
  }, [storyId, tabExplicitlySet]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  // Opens the immersive editor to draft a brand-new chapter. New chapters
  // default to free; authors flip individual chapters to paid from the
  // chapters page instead of being prompted at publish.
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

  // Captures the CoverEditor canvas (background + title overlay in the
  // chosen font / position) and uploads the composite as the new cover.
  // Also syncs the title that was typed on the cover back into story.title
  // so the Details tab stays in sync with what the cover shows.
  async function saveDesignedCover() {
    if (coverBusy || !story || !coverEditorRef.current) return;
    setCoverBusy(true);
    setCoverError('');
    try {
      const uri = await coverEditorRef.current.captureToFile();
      const { coverUrl } = await apiUpload<{ coverUrl: string }>('/api/me/cover', {
        uri,
        name: 'cover.png',
        type: 'image/png',
      });
      const patch: { coverUrl: string; title?: string } = { coverUrl };
      const nextTitle = (coverTitleDraft || '').trim();
      if (nextTitle && nextTitle !== story.title) {
        patch.title = nextTitle;
        setDraftTitle(nextTitle); // keep Details tab in sync
      }
      const updated = await apiSend<Story>(
        `/api/me/stories/${storyId}`,
        'PATCH',
        patch,
      );
      setStory(updated);
    } catch (e) {
      setCoverError(e instanceof Error ? e.message : 'Could not save designed cover.');
    }
    setCoverBusy(false);
  }

  // Flips the story's mature (18+) flag (used from Details page).
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

  // Sets the story's status — draft (offline) ⟷ ongoing ⟷ complete.
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

  // Flips one chapter between free and paid (ad/NS+ gated). PATCH is
  // optimistic — the pill updates locally while the request flies.
  async function toggleChapterFree(ch: Chapter) {
    if (pendingFreeId) return;
    const nextFree = !ch.isFree;
    setPendingFreeId(ch.id);
    setChapters((list) =>
      list.map((c) => (c.id === ch.id ? { ...c, isFree: nextFree } : c)),
    );
    try {
      await apiSend(`/api/me/chapters/${ch.id}`, 'PATCH', { isFree: nextFree });
    } catch {
      // Rollback by re-fetching the truth.
      await load();
    }
    setPendingFreeId(null);
  }

  // Saves the editable Details fields (title, description, genre) to the
  // story. Mature toggle saves immediately via toggleMature() instead.
  async function saveDetails() {
    if (!story || detailsBusy) return;
    const title = draftTitle.trim();
    if (!title) {
      setDetailsError('A title is required.');
      return;
    }
    setDetailsBusy(true);
    setDetailsError('');
    setDetailsSaved(false);
    try {
      const updated = await apiSend<Story>(
        `/api/me/stories/${storyId}`,
        'PATCH',
        {
          title,
          description: draftDesc.trim(),
          genre: draftGenre,
        },
      );
      setStory(updated);
      setDetailsSaved(true);
      setTimeout(() => setDetailsSaved(false), 1800);
    } catch (e) {
      setDetailsError(e instanceof Error ? e.message : 'Could not save.');
    }
    setDetailsBusy(false);
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

  const detailsDirty = useMemo(() => {
    if (!story) return false;
    return (
      draftTitle.trim() !== story.title ||
      draftDesc.trim() !== (story.description ?? '') ||
      draftGenre !== story.genre
    );
  }, [story, draftTitle, draftDesc, draftGenre]);

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
            <Text style={styles.back}>‹ Exit writing</Text>
          </Pressable>
          <Text style={styles.empty}>Story not found, or it isn&apos;t yours.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // FAB sits a little higher than the SafeArea so it lands where the thumb
  // naturally rests on modern iPhones. Bigger hit area too.
  const fabBottom = Math.max(insets.bottom, 8) + 64;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={16} style={styles.backWrap}>
          <Text style={styles.back}>‹ Exit writing</Text>
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {story.title}
        </Text>
        <View style={{ width: 110 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Big page title — same look across all four sections. */}
        <Text style={styles.pageTitle}>{SECTION_LABELS[tab].label}</Text>

        {tab === 'cover' && (
          <CoverSection
            story={story}
            busy={coverBusy}
            error={coverError}
            onPick={pickCover}
            onSaveDesigned={saveDesignedCover}
            editorRef={coverEditorRef}
            titleDraft={coverTitleDraft}
            onTitleDraftChange={setCoverTitleDraft}
            draftDesc={draftDesc}
            setDraftDesc={setDraftDesc}
            draftGenre={draftGenre}
            setDraftGenre={setDraftGenre}
            showGenrePicker={showGenrePicker}
            setShowGenrePicker={setShowGenrePicker}
            isMature={story.isMature}
            onToggleMature={toggleMature}
            detailsDirty={detailsDirty}
            detailsBusy={detailsBusy}
            onSaveDetails={saveDetails}
            onDelete={confirmDelete}
          />
        )}

        {tab === 'chapters' && (
          <ChaptersSection
            chapters={chapters}
            pendingFreeId={pendingFreeId}
            story={story}
            busy={busy}
            onChangeStatus={changeStatus}
            onOpen={openEditor}
            onNew={openNew}
            onToggleFree={toggleChapterFree}
          />
        )}

        {!!status && <Text style={styles.statusMsg}>{status}</Text>}
      </ScrollView>

      {/* Fly-out stack — four section buttons rise from the FAB. */}
      {/* Apple-Music-style two-tab switcher anchored above the home
          indicator. Replaces the old hamburger fly-out — only two screens
          to choose between (Cover · Chapters), no need for a stack menu. */}
      <AppleMusicSwitcher
        tabs={[
          { key: 'cover',    label: SECTION_LABELS.cover.label,    icon: SECTION_LABELS.cover.icon },
          { key: 'chapters', label: SECTION_LABELS.chapters.label, icon: SECTION_LABELS.chapters.icon },
        ]}
        value={tab}
        onChange={(next) => {
          // Auto-save the designed cover when leaving the Cover tab IF the
          // title was edited on-canvas. Means we never silently lose a typed
          // title and the user doesn't need a separate Save button — switching
          // tabs IS the save. Font/position autosave is follow-up (task #292).
          if (tab === 'cover' && next !== 'cover') {
            const typed = (coverTitleDraft || '').trim();
            if (typed && typed !== story.title) {
              saveDesignedCover();
            }
          }
          setTab(next);
          setTabExplicitlySet(true);
        }}
      />
    </SafeAreaView>
  );
}

// ---------- Section: Cover (merged with Details + Access) -----------------
// Single screen for the book's identity. Genre pill in the top-right opens
// the genre picker. CoverEditor handles title + font + visual design. Below:
// description input + mature toggle + danger-zone delete. Save buttons are
// gone — author hits "Save changes" if anything is dirty, or just leaves
// (the field-level inputs already push to draftTitle/Desc/Genre state).
function CoverSection({
  story,
  busy,
  error,
  onPick,
  onSaveDesigned,
  editorRef,
  titleDraft,
  onTitleDraftChange,
  draftDesc,
  setDraftDesc,
  draftGenre,
  setDraftGenre,
  showGenrePicker,
  setShowGenrePicker,
  isMature,
  onToggleMature,
  detailsDirty,
  detailsBusy,
  onSaveDetails,
  onDelete,
}: {
  story: Story;
  busy: boolean;
  error: string;
  onPick: () => void;
  onSaveDesigned: () => void;
  editorRef: React.MutableRefObject<CoverEditorHandle | null>;
  titleDraft: string;
  onTitleDraftChange: (next: string) => void;
  draftDesc: string;
  setDraftDesc: (s: string) => void;
  draftGenre: Story['genre'];
  setDraftGenre: (g: Story['genre']) => void;
  showGenrePicker: boolean;
  setShowGenrePicker: (v: boolean) => void;
  isMature: boolean;
  onToggleMature: () => void;
  detailsDirty: boolean;
  detailsBusy: boolean;
  onSaveDetails: () => void;
  onDelete: () => void;
}) {
  return (
    <View>
      {/* Genre pill top-right of the Cover section. Open → picker sheet. */}
      <View style={styles.genreRow}>
        <Pressable
          onPress={() => setShowGenrePicker(!showGenrePicker)}
          style={styles.genrePill}
        >
          <Ionicons name="pricetag-outline" size={13} color={colors.creamInk} />
          <Text style={styles.genrePillText}>{genreLabel(draftGenre)}</Text>
          <Ionicons name="chevron-down" size={14} color={colors.creamInk} />
        </Pressable>
      </View>

      <CoverEditor
        ref={editorRef}
        storyId={story.id}
        imageUri={story.coverUrl}
        title={titleDraft}
        onTitleChange={onTitleDraftChange}
        genre={draftGenre}
        authorName={story.author?.displayName ?? null}
        onTapBackground={onPick}
        style={styles.coverEditor}
      />
      <Text style={styles.helperCentered}>
        {busy
          ? 'Saving cover…'
          : 'Tap the title to edit. Tap the cover background to replace the image. Changes save when you switch tabs.'}
      </Text>
      {!!error && <Text style={styles.errorCentered}>{error}</Text>}

      {/* Genre picker — inline list. */}
      {showGenrePicker && (
        <View style={styles.genreSheet}>
          {GENRES.map((g) => (
            <Pressable
              key={g.value}
              style={[
                styles.genreSheetRow,
                draftGenre === g.value && styles.genreSheetRowActive,
              ]}
              onPress={() => {
                setDraftGenre(g.value as Story['genre']);
                setShowGenrePicker(false);
              }}
            >
              <Text
                style={[
                  styles.genreSheetText,
                  draftGenre === g.value && { color: colors.creamInk, fontWeight: '700' },
                ]}
              >
                {g.label}
              </Text>
              {draftGenre === g.value && (
                <Ionicons name="checkmark" size={16} color={colors.creamInk} />
              )}
            </Pressable>
          ))}
        </View>
      )}

      {/* Description — at the bottom where the buttons used to live. */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Description</Text>
        <TextInput
          style={styles.descInput}
          value={draftDesc}
          onChangeText={setDraftDesc}
          placeholder="A few lines about what this story is. The hook a reader sees before they tap in."
          placeholderTextColor={colors.inkFaint}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Mature toggle. */}
      <Pressable style={styles.matureRow} onPress={onToggleMature}>
        <View style={{ flex: 1 }}>
          <Text style={styles.fieldLabel}>Mature (18+)</Text>
          <Text style={styles.matureHint}>
            Readers without a verified date of birth won't see this story.
          </Text>
        </View>
        <Switch
          value={isMature}
          onValueChange={onToggleMature}
          trackColor={{ false: colors.borderSoft, true: colors.signal }}
          thumbColor={colors.cream}
        />
      </Pressable>

      {/* Save changes — appears only when title/desc/genre have unsaved edits. */}
      {detailsDirty && (
        <Pressable
          style={[styles.primaryBtnWide, detailsBusy && { opacity: 0.6 }]}
          onPress={onSaveDetails}
          disabled={detailsBusy}
        >
          <Text style={styles.primaryBtnText}>
            {detailsBusy ? 'Saving…' : 'Save changes'}
          </Text>
        </Pressable>
      )}

      {/* Danger zone — delete the story. */}
      <Pressable style={styles.dangerBtn} onPress={onDelete}>
        <Ionicons name="trash-outline" size={15} color={colors.signal} />
        <Text style={styles.dangerBtnText}>Delete this story</Text>
      </Pressable>
    </View>
  );
}

// ---------- Section: Chapters ----------------------------------------------
// Ordered chapter list. Top-right pill toggles the book between Draft
// (unpublished) and Live (published). At the end of the list — only once
// at least one chapter exists — a chapter-shaped pill lets the author
// toggle the book between Ongoing and Complete.
function ChaptersSection({
  chapters,
  pendingFreeId,
  story,
  busy,
  onChangeStatus,
  onOpen,
  onNew,
  onToggleFree,
}: {
  chapters: Chapter[];
  pendingFreeId: string | null;
  story: Story;
  busy: boolean;
  onChangeStatus: (next: 'draft' | 'ongoing' | 'complete') => void;
  onOpen: (c: Chapter) => void;
  onNew: () => void;
  onToggleFree: (c: Chapter) => void;
}) {
  const isLive = story.status !== 'draft';
  const isComplete = story.status === 'complete';
  return (
    <View>
      {/* Book Live/Draft toggle in the top-right of the Chapters tab. */}
      <View style={styles.chaptersHead}>
        <Pressable style={styles.primaryBtnInline} onPress={onNew}>
          <Ionicons name="add" size={18} color={colors.creamInk} />
          <Text style={styles.primaryBtnText}>New chapter</Text>
        </Pressable>
        <Pressable
          onPress={() => onChangeStatus(isLive ? 'draft' : 'ongoing')}
          disabled={busy}
          style={[
            styles.liveTopPill,
            { backgroundColor: isLive ? colors.signal : colors.paperSoft, borderColor: isLive ? colors.signal : colors.borderSoft },
          ]}
        >
          <View style={[styles.liveDot, { backgroundColor: isLive ? colors.cream : colors.inkMuted }]} />
          <Text style={[styles.liveTopText, { color: isLive ? colors.cream : colors.inkMuted }]}>
            {isLive ? 'LIVE' : 'DRAFT'}
          </Text>
        </Pressable>
      </View>

      {chapters.length === 0 && (
        <Text style={styles.empty}>No chapters yet — start with one above.</Text>
      )}

      {chapters.map((ch) => {
        const flipping = pendingFreeId === ch.id;
        return (
          <View key={ch.id} style={styles.chapterCard}>
            <Pressable style={{ flex: 1 }} onPress={() => onOpen(ch)}>
              <Text style={styles.chapterTitle}>
                {ch.number}. {ch.title}
              </Text>
              <Text style={styles.chapterMeta}>
                {ch.publishedAt ? 'Published' : 'Draft'}
                {ch.wordCount ? ` · ${ch.wordCount.toLocaleString()} words` : ''}
              </Text>
            </Pressable>
            <Pressable
              disabled={flipping}
              onPress={() => onToggleFree(ch)}
              style={[
                styles.freePaidPill,
                ch.isFree ? styles.freePill : styles.paidPill,
                flipping && { opacity: 0.55 },
              ]}
              hitSlop={6}
            >
              <Ionicons
                name={ch.isFree ? 'eye-outline' : 'lock-closed'}
                size={12}
                color={ch.isFree ? '#5E8E5A' : '#C8414E'}
              />
              <Text
                style={[
                  styles.freePaidText,
                  { color: ch.isFree ? '#5E8E5A' : '#C8414E' },
                ]}
              >
                {ch.isFree ? 'Free' : 'Paid'}
              </Text>
            </Pressable>
          </View>
        );
      })}

      {chapters.length > 0 && (
        <>
          <Text style={styles.helper}>
            Tap a chapter to edit. Tap the Free/Paid pill to gate it behind an ad
            or NovelStack+.
          </Text>
          {/* Book status pill — same shape as a chapter row so it sits at the
              end of the list like a final card. Tap to flip Ongoing ⟷ Complete. */}
          <Pressable
            onPress={() => onChangeStatus(isComplete ? 'ongoing' : 'complete')}
            disabled={busy}
            style={[
              styles.chapterCard,
              { justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
              isComplete && { borderColor: colors.cream },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.chapterTitle, { color: isComplete ? colors.cream : colors.ink }]}>
                {isComplete ? 'Book is complete' : 'Book is ongoing'}
              </Text>
              <Text style={styles.chapterMeta}>
                {isComplete
                  ? 'Readers see the "complete" badge. Tap to mark ongoing again.'
                  : 'Tap when you\'ve published the final chapter.'}
              </Text>
            </View>
            <Ionicons
              name={isComplete ? 'checkmark-circle' : 'time-outline'}
              size={22}
              color={isComplete ? colors.cream : colors.inkMuted}
            />
          </Pressable>
        </>
      )}
    </View>
  );
}

// ---------- Section: Details ------------------------------------------------
// Inline editable form for the title, blurb, genre + 18+ flag. Delete-story
// lives at the bottom here — it's the one screen where the destructive
// action belongs.
function DetailsSection({
  draftTitle,
  setDraftTitle,
  draftDesc,
  setDraftDesc,
  draftGenre,
  setDraftGenre,
  genreQuery,
  setGenreQuery,
  showGenrePicker,
  setShowGenrePicker,
  isMature,
  onToggleMature,
  dirty,
  busy,
  saved,
  error,
  onSave,
  onDelete,
}: {
  draftTitle: string;
  setDraftTitle: (s: string) => void;
  draftDesc: string;
  setDraftDesc: (s: string) => void;
  draftGenre: string;
  setDraftGenre: (s: string) => void;
  genreQuery: string;
  setGenreQuery: (s: string) => void;
  showGenrePicker: boolean;
  setShowGenrePicker: (b: boolean) => void;
  isMature: boolean;
  onToggleMature: () => void;
  dirty: boolean;
  busy: boolean;
  saved: boolean;
  error: string;
  onSave: () => void;
  onDelete: () => void;
}) {
  const filtered = useMemo(() => {
    const q = genreQuery.trim().toLowerCase();
    return GENRES.filter((g) => g.label.toLowerCase().includes(q)).slice(0, 12);
  }, [genreQuery]);

  return (
    <View>
      <Text style={styles.fieldLabel}>Title</Text>
      <TextInput
        value={draftTitle}
        onChangeText={setDraftTitle}
        placeholder="Story title"
        placeholderTextColor={colors.inkFaint}
        style={styles.input}
      />

      <Text style={styles.fieldLabel}>Description</Text>
      <TextInput
        value={draftDesc}
        onChangeText={setDraftDesc}
        placeholder="A short blurb readers will see on the cover."
        placeholderTextColor={colors.inkFaint}
        multiline
        style={[styles.input, { height: 130, textAlignVertical: 'top' }]}
      />

      <Text style={styles.fieldLabel}>Genre</Text>
      <Pressable
        style={styles.genreField}
        onPress={() => setShowGenrePicker(!showGenrePicker)}
      >
        <Text style={styles.genreFieldText}>{genreLabel(draftGenre)}</Text>
        <Ionicons
          name={showGenrePicker ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={colors.inkMuted}
        />
      </Pressable>
      {showGenrePicker && (
        <View style={styles.genrePicker}>
          <TextInput
            value={genreQuery}
            onChangeText={setGenreQuery}
            placeholder="Search genres…"
            placeholderTextColor={colors.inkFaint}
            style={[styles.input, { marginBottom: 10 }]}
          />
          <View style={styles.chips}>
            {filtered.map((g) => {
              const on = draftGenre === g.value;
              return (
                <Pressable
                  key={g.value}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => {
                    setDraftGenre(g.value);
                    setGenreQuery('');
                    setShowGenrePicker(false);
                  }}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>
                    {g.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      <Pressable style={styles.matureRow} onPress={onToggleMature}>
        <View style={[styles.checkbox, isMature && styles.checkboxOn]}>
          {isMature && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={styles.matureText}>
          Mature (18+) — readers confirm their age first
        </Text>
      </Pressable>

      {!!error && <Text style={styles.fieldError}>{error}</Text>}

      <Pressable
        style={[
          styles.primaryBtnWide,
          (!dirty || busy) && { opacity: 0.45 },
          { marginTop: spacing.lg },
        ]}
        onPress={onSave}
        disabled={!dirty || busy}
      >
        <Text style={styles.primaryBtnText}>
          {busy ? 'Saving…' : saved ? 'Saved' : 'Save changes'}
        </Text>
      </Pressable>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerLabel}>Danger zone</Text>
        <Pressable style={styles.deleteBtn} onPress={onDelete}>
          <Ionicons name="trash-outline" size={15} color="#D9656F" />
          <Text style={styles.deleteBtnText}>Delete story</Text>
        </Pressable>
        <Text style={styles.dangerHint}>
          Removes the story and every chapter for good. This can&apos;t be undone.
        </Text>
      </View>
    </View>
  );
}

// ---------- Section: Status -------------------------------------------------
// One Offline switch for hide-from-readers, and an Ongoing/Complete picker
// underneath when the story is live. Flipping Offline off after a previously
// offline story defaults back to Ongoing.
function StatusSection({
  story,
  busy,
  onChangeStatus,
}: {
  story: Story;
  busy: boolean;
  onChangeStatus: (next: 'draft' | 'ongoing' | 'complete') => void;
}) {
  const offline = story.status === 'draft';
  return (
    <View>
      <View style={styles.switchRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.switchLabel}>{offline ? 'Offline' : 'Live'}</Text>
          <Text style={styles.switchHint}>
            {offline
              ? 'Only you can see this story. Flick the switch to make it live.'
              : 'Readers can find and read it. Flick the switch to take it offline.'}
          </Text>
        </View>
        <View style={styles.switchPad}>
          <Switch
            value={offline}
            onValueChange={(on) => onChangeStatus(on ? 'draft' : 'ongoing')}
            disabled={busy}
            trackColor={{ false: colors.borderSoft, true: colors.signalDeep }}
            thumbColor={offline ? colors.signal : colors.cream}
            ios_backgroundColor={colors.borderSoft}
          />
        </View>
      </View>

      {!offline && (
        <>
          <Text style={styles.fieldLabel}>Story status</Text>
          <View style={styles.segment}>
            <Pressable
              style={[styles.segBtn, story.status === 'ongoing' && styles.segOn]}
              onPress={() => onChangeStatus('ongoing')}
              disabled={busy}
            >
              <Text style={[styles.segText, story.status === 'ongoing' && styles.segTextOn]}>
                Ongoing
              </Text>
            </Pressable>
            <Pressable
              style={[styles.segBtn, story.status === 'complete' && styles.segOn]}
              onPress={() => onChangeStatus('complete')}
              disabled={busy}
            >
              <Text style={[styles.segText, story.status === 'complete' && styles.segTextOn]}>
                Complete
              </Text>
            </Pressable>
          </View>
          <Text style={styles.helper}>
            {story.status === 'complete'
              ? 'Readers see this as a finished book.'
              : 'Readers know more chapters are still coming.'}
          </Text>
        </>
      )}
    </View>
  );
}

// ---------- Floating action button items -----------------------------------
function FloatingItem({
  anim,
  order,
  icon,
  label,
  active,
  onPress,
}: {
  anim: Animated.Value;
  order: number;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  // Stagger each button rising 60pt further than the one before it.
  const distance = 60 * (order + 1);
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [distance, 0],
  });
  return (
    <Animated.View
      style={[
        styles.fabItemWrap,
        {
          opacity: anim,
          transform: [{ translateY }],
        },
      ]}
      pointerEvents="box-none"
    >
      <Pressable
        style={[styles.fabItem, active && styles.fabItemActive]}
        onPress={onPress}
      >
        <Text style={[styles.fabItemLabel, active && styles.fabItemLabelActive]}>
          {label}
        </Text>
        <Ionicons
          name={icon}
          size={19}
          color={active ? colors.creamInk : colors.ink}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 5 },

  // Compact top bar — back link plus the story title centered, so the page
  // title beneath can own the visual weight.
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 4,
    paddingBottom: 4,
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: colors.inkFaint,
  },

  // Larger hit target — the small "‹ Write" link was a pain to tap.
  backWrap: { paddingVertical: 8, paddingRight: 16, alignSelf: 'flex-start' },
  back: { fontSize: 16, fontWeight: '500', color: colors.ink },

  // Section heading — display font + large, owns the top of the page.
  pageTitle: {
    fontFamily: fonts.displayXl,
    fontSize: 30,
    color: colors.ink,
    letterSpacing: -0.6,
    marginBottom: spacing.lg,
  },

  empty: { fontSize: 13, color: colors.inkMuted, marginTop: spacing.lg },
  helper: { fontSize: 13, color: colors.inkMuted, marginTop: spacing.md, lineHeight: 19 },
  helperCentered: {
    fontSize: 12,
    color: colors.inkFaint,
    marginTop: 10,
    textAlign: 'center',
  },
  errorCentered: { fontSize: 13, color: colors.signal, marginTop: 8, textAlign: 'center' },

  // Field labels reused across Details + Status.
  fieldLabel: {
    fontSize: 11,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: 8,
  },
  fieldError: { fontSize: 13, color: colors.signal, marginTop: 10 },

  // Generic input look.
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 15,
    backgroundColor: colors.paper,
    color: colors.ink,
  },

  // Cover section — full-bleed preview, primary action sits beneath.
  coverHero: {
    width: '78%',
    aspectRatio: 3 / 4,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  // CoverEditor wraps the editable canvas + font picker + position chips.
  // Centred and width-capped so it reads well on phone AND on iPad.
  coverEditor: {
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  // Genre row above the cover — pill aligned to the right.
  genreRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: spacing.sm },
  genrePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.cream,
  },
  genrePillText: { fontSize: 12, fontWeight: '700', color: colors.creamInk, letterSpacing: 0.2 },
  genreSheet: {
    marginTop: spacing.sm,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    overflow: 'hidden',
  },
  genreSheetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  genreSheetRowActive: { backgroundColor: colors.cream },
  genreSheetText: { fontSize: 14, color: colors.ink },
  // Description input + mature row below the cover editor.
  fieldGroup: { marginTop: spacing.lg },
  descInput: {
    minHeight: 110,
    backgroundColor: colors.paperSoft,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 12,
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  matureHint: { fontSize: 12, color: colors.inkFaint, marginTop: 2, lineHeight: 16 },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.xl,
    padding: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.signalSoft,
  },
  dangerBtnText: { color: colors.signal, fontWeight: '700', fontSize: 13 },
  // Chapters header — New chapter button + Live/Draft pill, in a row.
  chaptersHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  primaryBtnInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.cream,
  },
  liveTopPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  liveDot: { width: 8, height: 8, borderRadius: 999 },
  liveTopText: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4 },

  // Primary action button — cream rounded-square like the home Read button.
  primaryBtn: {
    backgroundColor: colors.cream,
    height: 52,
    paddingHorizontal: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnWide: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.cream,
    height: 52,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: colors.creamInk, fontSize: 15, fontWeight: '700' },

  // Secondary action — same rounded-square family but ghosted, used for
  // "Go to chapters" under the cover.
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: spacing.xl,
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  secondaryBtnText: { fontSize: 14, color: colors.ink, fontWeight: '600' },

  // Chapter row — title left, Free/Paid pill right. Tap title to edit, tap
  // pill to flip the gate.
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  chapterTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  chapterMeta: { fontSize: 12, color: colors.inkFaint, marginTop: 3 },
  freePaidPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  freePill: { backgroundColor: 'rgba(140, 175, 130, 0.12)', borderColor: 'rgba(140, 175, 130, 0.4)' },
  paidPill: { backgroundColor: 'rgba(200, 65, 78, 0.10)', borderColor: 'rgba(200, 65, 78, 0.35)' },
  freePaidText: { fontSize: 12, fontWeight: '700' },

  // Details — genre picker.
  genreField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 13,
    paddingVertical: 12,
    backgroundColor: colors.paper,
  },
  genreFieldText: { fontSize: 15, color: colors.ink },
  genrePicker: {
    marginTop: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.paperSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  chipOn: { backgroundColor: colors.signal, borderColor: colors.signal },
  chipText: { fontSize: 13, color: colors.ink, fontWeight: '500' },
  chipTextOn: { color: '#FFFFFF', fontWeight: '700' },

  // 18+ row.
  matureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.lg,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.signal, borderColor: colors.signal },
  checkMark: { color: colors.paper, fontSize: 12, fontWeight: '700' },
  matureText: { fontSize: 13, color: colors.inkMuted, flex: 1, lineHeight: 19 },

  // Danger zone — sits at the bottom of Details only.
  dangerZone: {
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  dangerLabel: {
    fontSize: 11,
    color: '#D9656F',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
    marginBottom: 10,
  },
  deleteBtn: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 13,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: '#5A2A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: { fontSize: 14, color: '#D9656F', fontWeight: '600' },
  dangerHint: { fontSize: 12, color: colors.inkFaint, marginTop: 10, lineHeight: 17 },

  // Status — Offline switch row + Ongoing/Complete segment.
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  switchLabel: { fontSize: 15, fontWeight: '700', color: colors.ink },
  switchHint: { fontSize: 12, color: colors.inkMuted, marginTop: 4, lineHeight: 17 },
  // Pulls the iOS switch away from the card edge so it doesn't crowd the
  // border — the native control already has its own bleed.
  switchPad: { paddingLeft: 4, paddingRight: 2 },
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
    paddingVertical: 10,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  segOn: { backgroundColor: colors.signal },
  segText: { fontSize: 13, fontWeight: '600', color: colors.inkMuted },
  segTextOn: { color: '#FFFFFF' },

  statusMsg: { fontSize: 12, color: colors.signal, textAlign: 'right', marginTop: spacing.md },

  // FAB + fly-out items — cream rounded-square family. The FAB is a
  // pleasingly chunky rounded-square (not a circle) to read as part of the
  // same button language as Read/Continue.
  fab: {
    position: 'absolute',
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.32,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  fabStack: {
    position: 'absolute',
    right: 20,
    alignItems: 'flex-end',
  },
  fabItemWrap: { marginBottom: 10 },
  fabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    paddingLeft: 18,
    paddingRight: 16,
    height: 50,
    minWidth: 158,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  // Selected fly-out button paints cream like the primary buttons.
  fabItemActive: { backgroundColor: colors.cream, borderColor: colors.cream },
  fabItemLabel: { fontSize: 15, fontWeight: '600', color: colors.ink },
  fabItemLabelActive: { color: colors.creamInk, fontWeight: '700' },
});
