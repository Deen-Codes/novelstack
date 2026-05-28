import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
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
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGetCached, apiSend, getSessionToken } from '@/lib/api';
import { GENRES, genreLabel } from '@/lib/genres';
import { Cover } from '@/components/Cover';
import { AmbientGlow } from '@/components/AmbientGlow';
import { SignInPitch } from '@/components/SignInPitch';
import { TopBar, useTopBarOffset } from '@/components/TopBar';
import { Typewriter } from '@/components/Typewriter';
import type { Shelf, Story } from '@/lib/types';

export default function Write() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  // 0 = the "Start a new story" pressable, 1..3 = wizard steps.
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [genreQuery, setGenreQuery] = useState('');
  const [desc, setDesc] = useState('');
  const [mature, setMature] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Cross-fade + lift between wizard steps so the experience feels
  // intentional, not like a form that swaps content abruptly.
  const stepFade = useRef(new Animated.Value(1)).current;
  const stepLift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    stepFade.setValue(0);
    stepLift.setValue(10);
    Animated.parallel([
      Animated.timing(stepFade, { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.timing(stepLift, { toValue: 0, duration: 320, useNativeDriver: true }),
    ]).start();
  }, [step, stepFade, stepLift]);

  function resetWizard() {
    setStep(0);
    setTitle('');
    setGenre('');
    setGenreQuery('');
    setDesc('');
    setMature(false);
    setError('');
  }

  const load = useCallback(async () => {
    const token = await getSessionToken();
    if (!token) {
      setSignedIn(false);
      setLoading(false);
      return;
    }
    try {
      const shelf = await apiGetCached<Shelf>('/api/me/shelf');
      setStories(shelf.writing);
      setSignedIn(true);
    } catch {
      setSignedIn(false);
    }
    setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load]),
  );

  async function createStory() {
    if (busy) return;
    // Tell the writer exactly what's missing rather than failing silently.
    const missing: string[] = [];
    if (!title.trim()) missing.push('a story title');
    if (!genre) missing.push('a genre');
    if (missing.length > 0) {
      setError(`Please add ${missing.join(' and ')} before creating the story.`);
      return;
    }
    setError('');
    setBusy(true);
    try {
      const story = await apiSend<Story>('/api/me/stories', 'POST', {
        title: title.trim(),
        description: desc.trim(),
        genre,
        isMature: mature,
      });
      resetWizard();
      router.push(`/write/${story.id}`);
    } catch {
      setError('Something went wrong creating the story. Please try again.');
    }
    setBusy(false);
  }

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const topPad = useTopBarOffset();

  // Land back at the top whenever Write is re-focused from the tab bar.
  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo?.({ y: 0, animated: false });
      scrollY.setValue(0);
    }, [scrollY]),
  );

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
        <AmbientGlow />
        <SignInPitch
          headline="Start writing on NovelStack"
          sub="Publish your stories chapter by chapter, build a following of readers, and earn from the reader pool."
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={[]}>
      <AmbientGlow />
      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.scroll, { paddingTop: topPad }]}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      >
        {step === 0 ? (
          <Pressable style={styles.newCard} onPress={() => setStep(1)}>
            <View style={styles.newIcon}>
              <Ionicons name="add" size={24} color={colors.signal} />
            </View>
            <View style={styles.newText}>
              {/* Typewriter draws the eye to the primary action — "Start a
                  new story." types itself out each time the screen comes
                  into focus. */}
              <Typewriter
                text="Start a new story."
                style={styles.newTitle}
                caretColor={colors.signal}
              />
              <Text style={styles.newSub}>A few quick questions, then you're writing.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
          </Pressable>
        ) : (
          <Animated.View
            style={[
              styles.wizard,
              {
                opacity: stepFade,
                transform: [{ translateY: stepLift }],
              },
            ]}
          >
            <View style={styles.wizardHead}>
              <Text style={styles.wizardStep}>Step {step} of 3</Text>
              <Pressable hitSlop={8} onPress={resetWizard}>
                <Ionicons name="close" size={20} color={colors.inkMuted} />
              </Pressable>
            </View>
            <View style={styles.stepDots}>
              {[1, 2, 3].map((n) => (
                <View
                  key={n}
                  style={[
                    styles.dot,
                    n === step && styles.dotOn,
                    n < step && styles.dotPast,
                  ]}
                />
              ))}
            </View>

            {step === 1 && (
              <>
                <Text style={styles.wizardQ}>What&apos;s your story called?</Text>
                <Text style={styles.wizardSub}>
                  Don&apos;t overthink it — you can rename it later.
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="A title…"
                  placeholderTextColor={colors.inkFaint}
                  style={styles.wizardInput}
                  autoFocus
                  returnKeyType="next"
                  onSubmitEditing={() => title.trim() && setStep(2)}
                />
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.wizardQ}>Pick a genre.</Text>
                <Text style={styles.wizardSub}>
                  This shapes who finds {title.trim() ? `“${title.trim()}”` : 'your story'}.
                </Text>
                {genre ? (
                  <Pressable
                    style={styles.genrePicked}
                    onPress={() => {
                      setGenre('');
                      setGenreQuery('');
                    }}
                  >
                    <Text style={styles.genrePickedText}>{genreLabel(genre)}</Text>
                    <Ionicons name="close-circle" size={17} color={colors.signal} />
                  </Pressable>
                ) : (
                  <>
                    <TextInput
                      value={genreQuery}
                      onChangeText={setGenreQuery}
                      placeholder="Search genres…"
                      placeholderTextColor={colors.inkFaint}
                      style={styles.wizardInput}
                      autoCorrect={false}
                      autoFocus
                    />
                    <View style={styles.chips}>
                      {GENRES.filter((g) =>
                        g.label
                          .toLowerCase()
                          .includes(genreQuery.trim().toLowerCase()),
                      )
                        .slice(0, 10)
                        .map((g) => (
                          <Pressable
                            key={g.value}
                            style={styles.chip}
                            onPress={() => {
                              setGenre(g.value);
                              setGenreQuery('');
                              setError('');
                            }}
                          >
                            <Text style={styles.chipText}>{g.label}</Text>
                          </Pressable>
                        ))}
                    </View>
                  </>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <Text style={styles.wizardQ}>What&apos;s it about?</Text>
                <Text style={styles.wizardSub}>
                  One or two lines that hook a reader. You can edit this later.
                </Text>
                <TextInput
                  value={desc}
                  onChangeText={setDesc}
                  placeholder="A pitch in a few sentences…"
                  placeholderTextColor={colors.inkFaint}
                  multiline
                  style={[styles.wizardInput, { height: 110, textAlignVertical: 'top' }]}
                  autoFocus
                />
                <Pressable style={styles.matureRow} onPress={() => setMature((m) => !m)}>
                  <View style={[styles.checkbox, mature && styles.checkboxOn]}>
                    {mature && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.matureText}>
                    Mature (18+) — adult content. Readers confirm their age first.
                  </Text>
                </Pressable>
              </>
            )}

            {!!error && (
              <View style={styles.errorRow}>
                <Ionicons name="alert-circle" size={15} color={colors.signal} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.formBtns}>
              <Pressable
                style={styles.ghostBtn}
                onPress={() => {
                  if (step === 1) {
                    resetWizard();
                  } else {
                    setStep((s) => (s - 1) as 0 | 1 | 2 | 3);
                  }
                  setError('');
                }}
              >
                <Text style={styles.ghostBtnText}>{step === 1 ? 'Cancel' : 'Back'}</Text>
              </Pressable>
              {step < 3 ? (
                <Pressable
                  style={[
                    styles.createBtn,
                    ((step === 1 && !title.trim()) || (step === 2 && !genre)) && {
                      opacity: 0.5,
                    },
                  ]}
                  onPress={() => setStep((s) => (s + 1) as 0 | 1 | 2 | 3)}
                  disabled={(step === 1 && !title.trim()) || (step === 2 && !genre)}
                >
                  <Text style={styles.createBtnText}>Next</Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.createBtn, busy && { opacity: 0.6 }]}
                  onPress={createStory}
                  disabled={busy}
                >
                  <Text style={styles.createBtnText}>
                    {busy ? 'Creating…' : 'Create story'}
                  </Text>
                </Pressable>
              )}
            </View>
          </Animated.View>
        )}

        {/* Hide the Your-stories list while the new-story wizard is open so
            the wizard owns the whole screen — Cancel/Close drops back to
            the full Write surface. */}
        {step === 0 && (
          <>
            <Text style={styles.section}>Your stories</Text>
            {stories.length === 0 ? (
              <View style={styles.emptyCard}>
                <Ionicons name="book-outline" size={22} color={colors.inkFaint} />
                <Text style={styles.empty}>
                  No stories yet. Tap “Start a new story” to begin your first.
                </Text>
              </View>
            ) : (
              <View style={styles.storiesGrid}>
                {stories.map((s) => (
                  <Pressable
                    key={s.id}
                    style={styles.storyGridItem}
                    onPress={() => router.push(`/write/${s.id}`)}
                  >
                    <Cover
                      coverUrl={s.coverUrl}
                      coverColor={s.coverColor}
                      title={s.title}
                      mature={s.isMature}
                      style={styles.storyGridCover}
                    />
                    <Text style={styles.storyGridTitle} numberOfLines={2}>
                      {s.title}
                    </Text>
                    {s.status === 'draft' && (
                      <View style={styles.storyGridDraft}>
                        <Text style={styles.storyGridDraftText}>Draft</Text>
                      </View>
                    )}
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </Animated.ScrollView>

      <TopBar page="write" scrollY={scrollY} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  h1: { fontFamily: fonts.displayXl, fontSize: 28, color: colors.ink, letterSpacing: -0.6 },
  sub: {
    fontSize: 14,
    color: colors.inkMuted,
    marginTop: spacing.sm,
    lineHeight: 21,
    marginBottom: spacing.lg,
  },

  // New-story call to action.
  newCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
  },
  newIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: '#6E3138',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newText: { flex: 1, minWidth: 0 },
  newTitle: { fontFamily: fonts.display, fontSize: 16, color: colors.ink },
  newSub: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2, lineHeight: 17 },

  // Create form.
  form: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
  },
  formTitle: { fontFamily: fonts.display, fontSize: 17, color: colors.ink },

  // Three-step story-creation wizard — looks intentional and immersive,
  // not like a generic settings form.
  wizard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  wizardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wizardStep: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.inkFaint,
  },
  stepDots: { flexDirection: 'row', gap: 6, marginTop: -4 },
  dot: {
    width: 22,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cardHi,
  },
  dotOn: { backgroundColor: colors.signal },
  dotPast: { backgroundColor: '#7A4348' },
  wizardQ: {
    fontFamily: fonts.displayXl,
    fontSize: 26,
    color: colors.ink,
    letterSpacing: -0.5,
    lineHeight: 30,
    marginTop: 4,
  },
  wizardSub: { fontSize: 14, color: colors.inkMuted, lineHeight: 20, marginTop: -6 },
  wizardInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 17,
    backgroundColor: colors.paper,
    color: colors.ink,
  },
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
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  chipActive: { backgroundColor: colors.signal, borderColor: colors.signal },
  chipText: { fontSize: 12, color: colors.inkMuted, textTransform: 'capitalize' },
  chipTextActive: { color: '#FFFFFF' },

  // Genre picker.
  genreField: { gap: 8 },
  fieldLabel: { fontSize: 12.5, fontWeight: '600', color: colors.inkMuted },
  genrePicked: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: colors.signalSoft,
    borderWidth: 1,
    borderColor: colors.signal,
    borderRadius: radius.pill,
    paddingLeft: 13,
    paddingRight: 9,
    paddingVertical: 7,
  },
  genrePickedText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.ink,
    textTransform: 'capitalize',
  },

  // Validation message.
  errorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    backgroundColor: colors.signalSoft,
    borderRadius: radius.md,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },
  errorText: { flex: 1, fontSize: 12.5, color: colors.ink, lineHeight: 17 },
  matureRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxOn: { backgroundColor: colors.signal, borderColor: colors.signal },
  matureText: { fontSize: 12, color: colors.inkMuted, flex: 1, lineHeight: 17 },
  formBtns: { flexDirection: 'row', gap: spacing.sm },
  ghostBtn: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghostBtnText: { color: colors.inkMuted, fontSize: 14, fontWeight: '600' },
  createBtn: {
    flex: 1,
    height: 48,
    backgroundColor: '#F4ECDF',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnText: { color: '#15100E', fontSize: 15, fontWeight: '700' },

  // Your stories.
  section: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  empty: { flex: 1, fontSize: 13, color: colors.inkMuted, lineHeight: 19 },
  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: 11,
    marginBottom: spacing.sm,
  },
  storyCover: { width: 50, height: 68, borderRadius: 7 },
  storyText: { flex: 1, minWidth: 0, gap: 5 },

  // 3-col grid for the writer's own stories — Instagram-style cells with
  // the cover, a short title underneath, and a Draft pill for unpublished
  // ones. Sits on the same horizontal padding as the rest of the screen.
  storiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: spacing.sm,
  },
  storyGridItem: { width: '31.5%' },
  storyGridCover: { width: '100%', aspectRatio: 3 / 4, borderRadius: 10 },
  storyGridTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.ink,
    marginTop: 6,
  },
  storyGridDraft: {
    alignSelf: 'flex-start',
    marginTop: 4,
    backgroundColor: colors.signalSoft,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  storyGridDraftText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    color: colors.signal,
    textTransform: 'uppercase',
  },
  storyTitle: { fontFamily: fonts.display, fontSize: 15.5, color: colors.ink },
  storyGenre: { fontSize: 12, color: colors.inkFaint, textTransform: 'capitalize' },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.signalSoft,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  statusDraft: { backgroundColor: colors.cardHi },
  statusText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: colors.signal,
    textTransform: 'capitalize',
    letterSpacing: 0.3,
  },
  statusTextDraft: { color: colors.inkFaint },
});
