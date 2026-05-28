import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
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

type Section = 'cover' | 'chapters' | 'details' | 'status' | 'access';

const SECTION_LABELS: Record<
  Section,
  { label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }
> = {
  cover: { label: 'Cover', icon: 'image-outline' },
  chapters: { label: 'Chapters', icon: 'list-outline' },
  details: { label: 'Details', icon: 'create-outline' },
  status: { label: 'Status', icon: 'pulse-outline' },
  access: { label: 'Access', icon: 'lock-open-outline' },
};

// Order in the fly-out (top of stack first). Cover is the most-used so it
// sits closest to the thumb when the menu opens.
const SECTION_ORDER: Section[] = ['cover', 'chapters', 'details', 'status', 'access'];

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

  // Details editor (now lives inline on the Details page rather than a
  // bottom sheet — drafts are seeded from the story once it loads.
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDesc, setDraftDesc] = useState('');
  const [draftGenre, setDraftGenre] = useState('');
  const [genreQuery, setGenreQuery] = useState('');
  const [showGenrePicker, setShowGenrePicker] = useState(false);
  const [detailsBusy, setDetailsBusy] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [detailsSaved, setDetailsSaved] = useState(false);

  // Chapter reorder state — local first, server PATCH on commit.
  const [reorderBusy, setReorderBusy] = useState(false);

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

  // Moves a chapter up or down in the order, then persists the new order.
  async function moveChapter(index: number, direction: -1 | 1) {
    if (reorderBusy) return;
    const target = index + direction;
    if (target < 0 || target >= chapters.length) return;

    // Optimistic local swap + renumber for the on-screen card.
    const next = chapters.slice();
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    const renumbered = next.map((c, i) => ({ ...c, number: i + 1 }));
    setChapters(renumbered);

    setReorderBusy(true);
    try {
      await apiSend(`/api/me/stories/${storyId}/chapters/reorder`, 'POST', {
        ids: renumbered.map((c) => c.id),
      });
    } catch {
      // Rollback on failure by re-fetching the truth.
      await load();
    }
    setReorderBusy(false);
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
      // Fade the "saved" toast back out after a beat.
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
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={16} style={styles.backWrap}>
          <Text style={styles.back}>‹ Write</Text>
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {story.title}
        </Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Big page title — same look across all five sections. */}
        <Text style={styles.pageTitle}>{SECTION_LABELS[tab].label}</Text>

        {tab === 'cover' && (
          <CoverSection
            story={story}
            busy={coverBusy}
            error={coverError}
            onPick={pickCover}
          />
        )}

        {tab === 'chapters' && (
          <ChaptersSection
            chapters={chapters}
            freeCount={freeCount}
            reorderBusy={reorderBusy}
            busy={busy}
            onOpen={openEditor}
            onNew={openNew}
            onMove={moveChapter}
            onMoveDivider={(n) => setFreeChapters(n)}
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
            onMature={toggleMature}
            onChangeStatus={changeStatus}
          />
        )}

        {tab === 'access' && (
          <AccessSection
            chapters={chapters}
            freeCount={freeCount}
            busy={busy}
            onChange={setFreeChapters}
          />
        )}

        {!!status && <Text style={styles.status}>{status}</Text>}
      </ScrollView>

      {/* Tap-anywhere-to-close backdrop when the FAB menu is open. Sits
          above the scroll content but below the buttons themselves. */}
      {menuOpen && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setMenuOpen(false)}
        />
      )}

      {/* Fly-out stack — five action buttons rise from the FAB. */}
      <View
        pointerEvents={menuOpen ? 'box-none' : 'none'}
        style={[
          styles.fabStack,
          { bottom: Math.max(insets.bottom, 8) + 80 },
        ]}
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

      {/* The hamburger / X FAB itself. */}
      <Pressable
        style={[styles.fab, { bottom: Math.max(insets.bottom, 8) + 16 }]}
        onPress={() => setMenuOpen((o) => !o)}
        hitSlop={6}
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
            size={24}
            color="#FFFFFF"
          />
        </Animated.View>
      </Pressable>
    </SafeAreaView>
  );
}

// ---------- Section: Cover --------------------------------------------------
// A full-page preview with the upload button beneath. The cover image gets
// the spotlight here — no other competing content on the page.
function CoverSection({
  story,
  busy,
  error,
  onPick,
}: {
  story: Story;
  busy: boolean;
  error: string;
  onPick: () => void;
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
    </View>
  );
}

// ---------- Section: Chapters ----------------------------------------------
// Ordered list with up/down reorder buttons and a single divider line that
// splits free chapters from the paid/ad-gated ones beneath it.
function ChaptersSection({
  chapters,
  freeCount,
  reorderBusy,
  busy,
  onOpen,
  onNew,
  onMove,
  onMoveDivider,
}: {
  chapters: Chapter[];
  freeCount: number;
  reorderBusy: boolean;
  busy: boolean;
  onOpen: (c: Chapter) => void;
  onNew: () => void;
  onMove: (i: number, dir: -1 | 1) => void;
  onMoveDivider: (n: number) => void;
}) {
  return (
    <View>
      <Pressable style={styles.primaryBtnWide} onPress={onNew}>
        <Ionicons name="add" size={18} color="#15100E" />
        <Text style={styles.primaryBtnText}>New chapter</Text>
      </Pressable>

      {chapters.length === 0 && (
        <Text style={styles.empty}>No chapters yet — start with one above.</Text>
      )}

      {chapters.map((ch, i) => (
        <View key={ch.id}>
          <Pressable style={styles.chapterCard} onPress={() => onOpen(ch)}>
            <View style={styles.chapterReorder}>
              <Pressable
                hitSlop={8}
                disabled={i === 0 || reorderBusy}
                onPress={() => onMove(i, -1)}
                style={[styles.reorderBtn, (i === 0 || reorderBusy) && styles.reorderBtnOff]}
              >
                <Ionicons name="chevron-up" size={14} color={colors.ink} />
              </Pressable>
              <Pressable
                hitSlop={8}
                disabled={i === chapters.length - 1 || reorderBusy}
                onPress={() => onMove(i, 1)}
                style={[
                  styles.reorderBtn,
                  (i === chapters.length - 1 || reorderBusy) && styles.reorderBtnOff,
                ]}
              >
                <Ionicons name="chevron-down" size={14} color={colors.ink} />
              </Pressable>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chapterTitle}>
                {ch.number}. {ch.title}
              </Text>
              <Text style={styles.chapterMeta}>
                {ch.publishedAt ? 'Published' : 'Draft'}
                {ch.wordCount ? ` · ${ch.wordCount.toLocaleString()} words` : ''}
              </Text>
            </View>
            <View style={[styles.accessBadge, ch.isFree ? styles.freeBadge : styles.paidBadge]}>
              <Ionicons
                name={ch.isFree ? 'eye-outline' : 'lock-closed'}
                size={11}
                color={ch.isFree ? '#5E8E5A' : '#C8414E'}
              />
              <Text style={[styles.accessBadgeText, { color: ch.isFree ? '#5E8E5A' : '#C8414E' }]}>
                {ch.isFree ? 'Free' : 'Paid'}
              </Text>
            </View>
          </Pressable>

          {/* Divider drops between free and paid — drag (well, tap) it to
              change the cutoff. Only renders inside the chapter run, never
              before the first or after the last chapter. */}
          {i + 1 === freeCount && i + 1 < chapters.length && (
            <DividerRow
              busy={busy}
              freeCount={freeCount}
              total={chapters.length}
              onMoveDivider={onMoveDivider}
            />
          )}
        </View>
      ))}

      {/* If nothing's gated yet, show the divider as a hint at the top */}
      {chapters.length > 0 && freeCount === 0 && (
        <DividerRow
          busy={busy}
          freeCount={freeCount}
          total={chapters.length}
          onMoveDivider={onMoveDivider}
          placement="all-paid"
        />
      )}

      {/* All chapters free → hint at the bottom. */}
      {chapters.length > 0 && freeCount === chapters.length && (
        <DividerRow
          busy={busy}
          freeCount={freeCount}
          total={chapters.length}
          onMoveDivider={onMoveDivider}
          placement="all-free"
        />
      )}
    </View>
  );
}

function DividerRow({
  busy,
  freeCount,
  total,
  onMoveDivider,
  placement,
}: {
  busy: boolean;
  freeCount: number;
  total: number;
  onMoveDivider: (n: number) => void;
  placement?: 'all-free' | 'all-paid';
}) {
  const upDisabled = busy || freeCount === 0;
  const downDisabled = busy || freeCount === total;
  return (
    <View style={styles.dividerRow}>
      <View style={styles.dividerLine} />
      <View style={styles.dividerChip}>
        <Pressable
          hitSlop={6}
          disabled={upDisabled}
          onPress={() => onMoveDivider(Math.max(0, freeCount - 1))}
          style={[styles.dividerStep, upDisabled && { opacity: 0.4 }]}
        >
          <Ionicons name="chevron-up" size={13} color={colors.ink} />
        </Pressable>
        <Text style={styles.dividerText}>
          {placement === 'all-free'
            ? 'All chapters free'
            : placement === 'all-paid'
              ? 'Every chapter ad-gated'
              : 'Paid / ad-gated below'}
        </Text>
        <Pressable
          hitSlop={6}
          disabled={downDisabled}
          onPress={() => onMoveDivider(Math.min(total, freeCount + 1))}
          style={[styles.dividerStep, downDisabled && { opacity: 0.4 }]}
        >
          <Ionicons name="chevron-down" size={13} color={colors.ink} />
        </Pressable>
      </View>
      <View style={styles.dividerLine} />
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
// Just the publish state controls. Mature toggle moved to Details — this
// page is purely about live / ongoing / complete / offline.
function StatusSection({
  story,
  busy,
  onMature: _onMature,
  onChangeStatus,
}: {
  story: Story;
  busy: boolean;
  onMature: () => void;
  onChangeStatus: (next: 'draft' | 'ongoing' | 'complete') => void;
}) {
  if (story.status === 'draft') {
    return (
      <View>
        <Text style={styles.helper}>
          Your story is an offline draft — only you can see it. Make it live to
          share it with readers.
        </Text>
        <Pressable
          style={[styles.primaryBtnWide, busy && { opacity: 0.6 }, { marginTop: spacing.lg }]}
          onPress={() => onChangeStatus('ongoing')}
          disabled={busy}
        >
          <Text style={styles.primaryBtnText}>Make story live</Text>
        </Pressable>
      </View>
    );
  }
  return (
    <View>
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

      <Pressable
        style={[styles.offlineBtn, busy && { opacity: 0.5 }]}
        onPress={() => onChangeStatus('draft')}
        disabled={busy}
      >
        <Text style={styles.offlineBtnText}>Take offline — back to draft</Text>
      </Pressable>
      <Text style={styles.helper}>
        An offline story is hidden from readers until you make it live again.
      </Text>
    </View>
  );
}

// ---------- Section: Access -------------------------------------------------
// The free-chapter stepper. Mirrors the chapters-page divider so authors can
// land here from either direction.
function AccessSection({
  chapters,
  freeCount,
  busy,
  onChange,
}: {
  chapters: Chapter[];
  freeCount: number;
  busy: boolean;
  onChange: (n: number) => void;
}) {
  if (chapters.length === 0) {
    return (
      <Text style={styles.helper}>
        Add chapters first — then choose how many are free to read before the ad
        gate.
      </Text>
    );
  }
  return (
    <View>
      <Text style={styles.fieldLabel}>Free chapters</Text>
      <View style={styles.stepper}>
        <Pressable
          style={[styles.stepBtn, busy && { opacity: 0.5 }]}
          onPress={() => onChange(Math.max(0, freeCount - 1))}
          disabled={busy || freeCount === 0}
        >
          <Text style={styles.stepBtnText}>−</Text>
        </Pressable>
        <Text style={styles.stepValue}>{freeCount}</Text>
        <Pressable
          style={[styles.stepBtn, busy && { opacity: 0.5 }]}
          onPress={() => onChange(Math.min(chapters.length, freeCount + 1))}
          disabled={busy || freeCount >= chapters.length}
        >
          <Text style={styles.stepBtnText}>+</Text>
        </Pressable>
        <Text style={styles.stepLabel}>
          of {chapters.length} chapter{chapters.length === 1 ? '' : 's'}
        </Text>
      </View>
      <Text style={styles.helper}>
        {freeCount >= chapters.length
          ? 'Every chapter is free to read.'
          : `Chapter ${freeCount + 1} onward is gated behind an ad or NovelStack+.`}
      </Text>
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
  // Stagger each button rising 56pt further than the one before it.
  const distance = 56 * (order + 1);
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
          size={17}
          color={active ? '#FFFFFF' : colors.ink}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 4 },

  // Compact top bar — slim back link + the story title centered, so the
  // page title beneath can own the visual weight.
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

  // Field labels reused across Details + Status + Access.
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

  // Generic input look — paper bg, ember focus is left to the OS default.
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

  // Primary action button — cream pill.
  primaryBtn: {
    backgroundColor: '#F4ECDF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  primaryBtnWide: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: '#F4ECDF',
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: { color: '#15100E', fontSize: 15, fontWeight: '700' },

  // Chapter row + reorder controls.
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
  chapterReorder: { gap: 4 },
  reorderBtn: {
    width: 28,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.paperSoft,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reorderBtnOff: { opacity: 0.35 },
  chapterTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  chapterMeta: { fontSize: 12, color: colors.inkFaint, marginTop: 3 },
  accessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  freeBadge: { backgroundColor: 'rgba(140, 175, 130, 0.12)', borderColor: 'rgba(140, 175, 130, 0.4)' },
  paidBadge: { backgroundColor: 'rgba(200, 65, 78, 0.10)', borderColor: 'rgba(200, 65, 78, 0.35)' },
  accessBadgeText: { fontSize: 11, fontWeight: '700' },

  // Divider between free and paid chapters.
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: spacing.md,
    marginBottom: 2,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSoft,
  },
  dividerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
  },
  dividerStep: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paperSoft,
  },
  dividerText: { fontSize: 11, fontWeight: '700', color: colors.inkMuted, letterSpacing: 0.4 },

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

  // 18+ row — shared between Details and (legacy) Status if it ever returns.
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

  // Status segment.
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
  offlineBtn: {
    alignSelf: 'flex-start',
    marginTop: spacing.lg,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  offlineBtnText: { fontSize: 12.5, color: colors.inkMuted, fontWeight: '600' },

  // Access stepper.
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepBtn: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: { fontSize: 22, color: colors.ink, fontWeight: '600' },
  stepValue: {
    fontFamily: fonts.displayXl,
    fontSize: 26,
    color: colors.ink,
    minWidth: 28,
    textAlign: 'center',
  },
  stepLabel: { fontSize: 13, color: colors.inkMuted },

  status: { fontSize: 12, color: colors.signal, textAlign: 'right', marginTop: spacing.md },

  // FAB + fly-out items.
  fab: {
    position: 'absolute',
    right: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.signal,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabStack: {
    position: 'absolute',
    right: 18,
    alignItems: 'flex-end',
  },
  fabItemWrap: { marginBottom: 8 },
  fabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 24,
    paddingLeft: 16,
    paddingRight: 14,
    height: 44,
  },
  fabItemActive: { backgroundColor: colors.signal, borderColor: colors.signal },
  fabItemLabel: { fontSize: 14, fontWeight: '600', color: colors.ink },
  fabItemLabelActive: { color: '#FFFFFF' },
});
