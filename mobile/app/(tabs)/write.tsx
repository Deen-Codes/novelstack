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
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGetCached, apiSend, getSessionToken } from '@/lib/api';
import { GENRES, genreLabel } from '@/lib/genres';
import { Cover } from '@/components/Cover';
import { AmbientGlow } from '@/components/AmbientGlow';
import { SignInPitch } from '@/components/SignInPitch';
import { TopBar } from '@/components/TopBar';
import { Typewriter } from '@/components/Typewriter';
import type { Shelf, Story } from '@/lib/types';

export default function Write() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [genreQuery, setGenreQuery] = useState('');
  const [desc, setDesc] = useState('');
  const [mature, setMature] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

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
      setTitle('');
      setGenre('');
      setGenreQuery('');
      setDesc('');
      setMature(false);
      setCreating(false);
      router.push(`/write/${story.id}`);
    } catch {
      setError('Something went wrong creating the story. Please try again.');
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AmbientGlow />
      <TopBar page="write" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {!creating ? (
          <Pressable style={styles.newCard} onPress={() => setCreating(true)}>
            <View style={styles.newIcon}>
              <Ionicons name="add" size={24} color={colors.signal} />
            </View>
            <View style={styles.newText}>
              {/* Typewriter draws the eye to the primary action — "Start a
                  new story." types itself out and lands with a blinking
                  caret each time the screen comes into focus. */}
              <Typewriter
                text="Start a new story."
                style={styles.newTitle}
                caretColor={colors.signal}
              />
              <Text style={styles.newSub}>Set the basics, then write and publish chapters.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
          </Pressable>
        ) : (
          <View style={styles.form}>
            <Text style={styles.formTitle}>New story</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Story title"
              placeholderTextColor={colors.inkFaint}
              style={styles.input}
            />
            <View style={styles.genreField}>
              <Text style={styles.fieldLabel}>Genre</Text>
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
                    style={styles.input}
                    autoCorrect={false}
                  />
                  <View style={styles.chips}>
                    {GENRES.filter((g) =>
                      g.label.toLowerCase().includes(genreQuery.trim().toLowerCase()),
                    )
                      .slice(0, 8)
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
            </View>
            <TextInput
              value={desc}
              onChangeText={setDesc}
              placeholder="Short description"
              placeholderTextColor={colors.inkFaint}
              multiline
              style={[styles.input, { height: 76, textAlignVertical: 'top' }]}
            />
            <Pressable style={styles.matureRow} onPress={() => setMature((m) => !m)}>
              <View style={[styles.checkbox, mature && styles.checkboxOn]}>
                {mature && <Ionicons name="checkmark" size={13} color="#FFFFFF" />}
              </View>
              <Text style={styles.matureText}>
                Mature (18+) — adult content. Readers confirm their age first.
              </Text>
            </Pressable>
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
                  setCreating(false);
                  setError('');
                }}
              >
                <Text style={styles.ghostBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.createBtn, busy && { opacity: 0.6 }]}
                onPress={createStory}
                disabled={busy}
              >
                <Text style={styles.createBtnText}>{busy ? 'Creating…' : 'Create story'}</Text>
              </Pressable>
            </View>
          </View>
        )}

        <Text style={styles.section}>Your stories</Text>
        {stories.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="book-outline" size={22} color={colors.inkFaint} />
            <Text style={styles.empty}>
              No stories yet. Tap “Start a new story” to begin your first.
            </Text>
          </View>
        ) : (
          stories.map((s) => (
            <Pressable
              key={s.id}
              style={styles.storyCard}
              onPress={() => router.push(`/write/${s.id}`)}
            >
              <Cover
                coverUrl={s.coverUrl}
                coverColor={s.coverColor}
                title={s.title}
                mature={s.isMature}
                style={styles.storyCover}
              />
              <View style={styles.storyText}>
                <Text style={styles.storyTitle} numberOfLines={2}>
                  {s.title}
                </Text>
                <Text style={styles.storyGenre}>{genreLabel(s.genre)}</Text>
                <View
                  style={[styles.statusPill, s.status === 'draft' && styles.statusDraft]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      s.status === 'draft' && styles.statusTextDraft,
                    ]}
                  >
                    {s.status}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.inkFaint} />
            </Pressable>
          ))
        )}
      </ScrollView>
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
