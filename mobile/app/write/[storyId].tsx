import { useCallback, useEffect, useRef, useState } from 'react';
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
import { genreLabel } from '@/lib/genres';
import { Cover } from '@/components/Cover';
import { BottomSheet } from '@/components/BottomSheet';
import type { Shelf, Story, Chapter, StoryDetail } from '@/lib/types';

type Section = 'cover' | 'status' | 'access';

const SECTION_LABELS: Record<Section, { label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }> = {
  cover: { label: 'Cover', icon: 'image-outline' },
  status: { label: 'Status', icon: 'pulse-outline' },
  access: { label: 'Access', icon: 'lock-open-outline' },
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

  // Edit-details bottom sheet — title + description editor.
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDesc, setDraftDesc] = useState('');
  const [detailsBusy, setDetailsBusy] = useState(false);
  const [detailsError, setDetailsError] = useState('');

  function openDetails() {
    if (!story) return;
    setDraftTitle(story.title);
    setDraftDesc(story.description ?? '');
    setDetailsError('');
    setDetailsOpen(true);
  }

  async function saveDetails() {
    if (!story || detailsBusy) return;
    const title = draftTitle.trim();
    if (!title) {
      setDetailsError('A title is required.');
      return;
    }
    setDetailsBusy(true);
    setDetailsError('');
    try {
      const updated = await apiSend<Story>(
        `/api/me/stories/${storyId}`,
        'PATCH',
        { title, description: draftDesc.trim() },
      );
      setStory(updated);
      setDetailsOpen(false);
    } catch (e) {
      setDetailsError(e instanceof Error ? e.message : 'Could not save.');
    }
    setDetailsBusy(false);
  }

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

        {/* Section label replaces the old tab strip — section is chosen via
            the bottom-right hamburger FAB below. */}
        <Text style={styles.sectionLabel}>{SECTION_LABELS[tab].label}</Text>

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

      {/* Tap-anywhere-to-close backdrop when the FAB menu is open. Sits
          above the scroll content but below the buttons themselves. */}
      {menuOpen && (
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => setMenuOpen(false)}
        />
      )}

      {/* Floating action buttons — fly out above the FAB, in order:
          Cover, Status, Access, Edit details. */}
      <View
        pointerEvents="box-none"
        style={[
          styles.fabStack,
          { bottom: Math.max(insets.bottom, 8) + 80 },
        ]}
      >
        {(['cover', 'status', 'access'] as Section[]).map((s, i) => {
          const reverseIdx = 3 - i; // farthest from FAB first
          return (
            <FloatingItem
              key={s}
              anim={menuAnim}
              order={reverseIdx}
              icon={SECTION_LABELS[s].icon}
              label={SECTION_LABELS[s].label}
              active={tab === s}
              onPress={() => selectSection(s)}
            />
          );
        })}
        <FloatingItem
          anim={menuAnim}
          order={0}
          icon="create-outline"
          label="Edit details"
          onPress={() => {
            setMenuOpen(false);
            openDetails();
          }}
        />
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

      <BottomSheet visible={detailsOpen} onClose={() => setDetailsOpen(false)}>
        <Text style={styles.sheetTitle}>Edit details</Text>
        <Text style={styles.sheetSub}>
          Change the title or blurb. Genre and maturity stay where they are.
        </Text>
        <Text style={styles.detailsLabel}>Title</Text>
        <TextInput
          value={draftTitle}
          onChangeText={setDraftTitle}
          placeholder="Story title"
          placeholderTextColor={colors.inkFaint}
          style={styles.detailsInput}
        />
        <Text style={styles.detailsLabel}>Description</Text>
        <TextInput
          value={draftDesc}
          onChangeText={setDraftDesc}
          placeholder="A short blurb readers will see on the cover."
          placeholderTextColor={colors.inkFaint}
          multiline
          style={[styles.detailsInput, { height: 110, textAlignVertical: 'top' }]}
        />
        {!!detailsError && <Text style={styles.detailsError}>{detailsError}</Text>}
        <Pressable
          style={[styles.detailsBtn, detailsBusy && { opacity: 0.6 }]}
          onPress={saveDetails}
          disabled={detailsBusy}
        >
          <Text style={styles.detailsBtnText}>
            {detailsBusy ? 'Saving…' : 'Save changes'}
          </Text>
        </Pressable>
      </BottomSheet>
    </SafeAreaView>
  );
}

// Single fly-out action button — sits stacked above the FAB, anim 0..1
// drives both the opacity and the rise-from-FAB translation.
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
  // Stagger each button rising 64pt further than the one before it.
  const distance = 64 * (order + 1);
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

  // Section heading replaces the old tab strip — what you're editing now,
  // chosen via the FAB menu.
  sectionLabel: {
    fontFamily: fonts.display,
    fontSize: 17,
    color: colors.ink,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },

  // Floating action button (hamburger) — bottom-right where the thumb lives.
  fab: {
    position: 'absolute',
    right: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.signal,
    alignItems: 'center',
    justifyContent: 'center',
    // Lift the button off the page so the menu visually pops.
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },

  // Stack of fly-out action buttons — sit just above the FAB.
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

  // Edit-details bottom sheet inputs.
  sheetTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
  },
  sheetSub: { fontSize: 13, color: colors.inkMuted, marginTop: 4, lineHeight: 19 },
  detailsLabel: {
    fontSize: 11,
    color: colors.inkFaint,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    fontWeight: '700',
    marginTop: spacing.md,
    marginBottom: 6,
  },
  detailsInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 15,
    backgroundColor: colors.paper,
    color: colors.ink,
  },
  detailsError: { fontSize: 13, color: colors.signal, marginTop: 8 },
  detailsBtn: {
    marginTop: spacing.md,
    height: 48,
    borderRadius: 13,
    backgroundColor: '#F4ECDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsBtnText: { fontSize: 15, fontWeight: '700', color: '#15100E' },
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
