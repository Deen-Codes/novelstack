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
import type { Shelf, Story, Chapter, StoryDetail } from '@/lib/types';

type Section = 'cover' | 'chapters' | 'details' | 'status';

const SECTION_LABELS: Record<
  Section,
  { label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }
> = {
  cover: { label: 'Cover', icon: 'image-outline' },
  chapters: { label: 'Chapters', icon: 'list-outline' },
  details: { label: 'Details', icon: 'create-outline' },
  status: { label: 'Status', icon: 'pulse-outline' },
};

// Order in the fly-out (top of stack first). Cover is the most-used so it
// sits closest to the thumb when the menu opens.
const SECTION_ORDER: Section[] = ['cover', 'chapters', 'details', 'status'];

export default function StoryWriter() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverError, setCoverError] = useState('');
  const [tab, setTab] = useState<Section>('cover');

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
            onGoChapters={() => setTab('chapters')}
          />
        )}

        {tab === 'chapters' && (
          <ChaptersSection
            chapters={chapters}
            pendingFreeId={pendingFreeId}
            onOpen={openEditor}
            onNew={openNew}
            onToggleFree={toggleChapterFree}
          />
        )}

        {tab === 'details' && (
          <DetailsSection
            draftTitle={draftTitle}
            setDraftTitle={setDraftTitle}
            draftDesc={draftDesc}
            setDraftDesc={setDraftDesc}
            draftGenre={draftGenre}
            setDraftGenre={setDraftGenre}
            genreQuery={genreQuery}
            setGenreQuery={setGenreQuery}
            showGenrePicker={showGenrePicker}
            setShowGenrePicker={setShowGenrePicker}
            isMature={story.isMature}
            onToggleMature={toggleMature}
            dirty={detailsDirty}
            busy={detailsBusy}
            saved={detailsSaved}
            error={detailsError}
            onSave={saveDetails}
            onDelete={confirmDelete}
          />
        )}

        {tab === 'status' && (
          <StatusSection
            story={story}
            busy={busy}
            onChangeStatus={changeStatus}
          />
        )}

        {!!status && <Text style={styles.statusMsg}>{status}</Text>}
      </ScrollView>

      {/* Tap-anywhere-to-close backdrop when the FAB menu is open. */}
      {menuOpen && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setMenuOpen(false)}
        />
      )}

      {/* Fly-out stack — four section buttons rise from the FAB. */}
      <View
        pointerEvents={menuOpen ? 'box-none' : 'none'}
        style={[styles.fabStack, { bottom: fabBottom + 78 }]}
      >
        {SECTION_ORDER.map((s, i) => {
          // Farthest-from-FAB item moves first so the rise reads as a stack.
          const order = SECTION_ORDER.length - 1 - i;
          return (
            <FloatingItem
              key={s}
              anim={menuAnim}
              order={order}
              icon={SECTION_LABELS[s].icon}
              label={SECTION_LABELS[s].label}
              active={tab === s}
              onPress={() => selectSection(s)}
            />
          );
        })}
      </View>

      {/* The hamburger / X FAB itself — cream background with the icon in
          ink so it matches the home Read/Save button family. */}
      <Pressable
        style={[styles.fab, { bottom: fabBottom }]}
        onPress={() => setMenuOpen((o) => !o)}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel={menuOpen ? 'Close section menu' : 'Open section menu'}
      >
        <Animated.View
          style={{
            transform: [
              {
                rotate: menuAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '90deg'],
                }),
              },
            ],
          }}
        >
          <Ionicons
            name={menuOpen ? 'close' : 'menu'}
            size={28}
            color={colors.creamInk}
          />
        </Animated.View>
      </Pressable>
    </SafeAreaView>
  );
}

// ---------- Section: Cover --------------------------------------------------
// A full-page preview with upload + "go to chapters" beneath. The cover image
// gets the spotlight here — no other competing content on the page.
function CoverSection({
  story,
  busy,
  error,
  onPick,
  onGoChapters,
}: {
  story: Story;
  busy: boolean;
  error: string;
  onPick: () => void;
  onGoChapters: () => void;
}) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Cover
        coverUrl={story.coverUrl}
        coverColor={story.coverColor}
        title={story.title}
        style={styles.coverHero}
      />
      <Pressable
        style={[styles.primaryBtn, busy && { opacity: 0.6 }]}
        onPress={onPick}
        disabled={busy}
      >
        <Text style={styles.primaryBtnText}>
          {busy ? 'Uploading…' : story.coverUrl ? 'Replace cover' : 'Upload cover'}
        </Text>
      </Pressable>
      <Text style={styles.helperCentered}>JPEG, PNG or WebP · up to 5 MB</Text>
      {!!error && <Text style={styles.errorCentered}>{error}</Text>}

      <Pressable style={styles.secondaryBtn} onPress={onGoChapters}>
        <Text style={styles.secondaryBtnText}>Go to chapters</Text>
        <Ionicons name="arrow-forward" size={15} color={colors.ink} />
      </Pressable>
    </View>
  );
}

// ---------- Section: Chapters ----------------------------------------------
// Ordered chapter list. Each row has a Free ⟷ Paid pill that flips
// instantly — that's how authors gate chapters. No reorder UI.
function ChaptersSection({
  chapters,
  pendingFreeId,
  onOpen,
  onNew,
  onToggleFree,
}: {
  chapters: Chapter[];
  pendingFreeId: string | null;
  onOpen: (c: Chapter) => void;
  onNew: () => void;
  onToggleFree: (c: Chapter) => void;
}) {
  return (
    <View>
      <Pressable style={styles.primaryBtnWide} onPress={onNew}>
        <Ionicons name="add" size={18} color={colors.creamInk} />
        <Text style={styles.primaryBtnText}>New chapter</Text>
      </Pressable>

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
        <Text style={styles.helper}>
          Tap a chapter to edit. Tap the Free/Paid pill to gate it behind an ad
          or NovelStack+.
        </Text>
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
