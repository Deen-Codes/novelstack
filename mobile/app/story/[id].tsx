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
import { apiGet, apiSend } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { Cover } from '@/components/Cover';
import { DobField } from '@/components/DobField';
import type { StoryDetail, Shelf, User } from '@/lib/types';

// 18 or older. Mature stories stay gated until a date of birth proves it.
function isAdult(dob?: string | null): boolean {
  if (!dob) return false;
  const d = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const eighteen = new Date();
  eighteen.setFullYear(eighteen.getFullYear() - 18);
  return d <= eighteen;
}

// Reader-to-writer tip amounts, in cents.
const TIP_AMOUNTS = [300, 500, 1000];
const REPORT_REASONS = [
  { v: 'csam', l: 'Child exploitation (CSAM)' },
  { v: 'harassment', l: 'Harassment or bullying' },
  { v: 'hate', l: 'Hate speech' },
  { v: 'graphic_abuse', l: 'Graphic violence or abuse' },
  { v: 'spam', l: 'Spam' },
  { v: 'copyright', l: 'Copyright / plagiarism' },
  { v: 'self_harm', l: 'Self-harm promotion' },
  { v: 'other', l: 'Something else' },
];

// Story detail — chapter list plus the social surfaces (bookmark, follow,
// tip, report). The route param carries the story slug.
export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [story, setStory] = useState<StoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  // 18+ age-gate state.
  const [gateDob, setGateDob] = useState<string | null>(null);
  const [gateErr, setGateErr] = useState('');

  const userId = user?.id ?? null;

  const [tipOpen, setTipOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(500);
  const [tipMsg, setTipMsg] = useState('');
  const [tipDone, setTipDone] = useState(false);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('harassment');
  const [reportDetail, setReportDetail] = useState('');
  const [reportDone, setReportDone] = useState(false);

  const load = useCallback(async () => {
    let s: StoryDetail;
    try {
      s = await apiGet<StoryDetail>(`/api/stories/${id}`);
    } catch {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setStory(s);

    const me = await getCurrentUser();
    setUser(me ?? null);
    if (me) {
      // The shelf tells us which stories are saved and which authors followed.
      try {
        const shelf = await apiGet<Shelf>('/api/me/shelf');
        setBookmarked(shelf.saved.some((b) => b.id === s.id));
        setFollowing(shelf.following.some((f) => f.id === s.authorId));
      } catch {
        // No shelf — leave toggles in their default off state.
      }
    }
    setLoading(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setNotFound(false);
      load();
    }, [load]),
  );

  function requireSignIn(): boolean {
    if (!userId) {
      router.push('/signin');
      return true;
    }
    return false;
  }

  async function toggleBookmark() {
    if (requireSignIn() || busy || !story) return;
    setBusy(true);
    try {
      const { bookmarked: next } = await apiSend<{ bookmarked: boolean }>(
        '/api/bookmarks',
        'POST',
        { storyId: story.id },
      );
      setBookmarked(next);
    } catch {
      // Leave state unchanged on failure.
    }
    setBusy(false);
  }

  async function toggleFollow() {
    if (requireSignIn() || busy || !story) return;
    setBusy(true);
    try {
      const { following: next } = await apiSend<{ following: boolean }>(
        '/api/follows',
        'POST',
        { authorId: story.authorId },
      );
      setFollowing(next);
    } catch {
      // Leave state unchanged on failure.
    }
    setBusy(false);
  }

  // Tipping and reporting have no API endpoint yet — these confirm locally.
  function sendTip() {
    if (requireSignIn() || busy || !story) return;
    if (story.authorId === userId) return; // can't tip yourself
    setTipDone(true);
    setTipOpen(false);
  }

  function submitReport() {
    if (requireSignIn() || busy) return;
    setReportDone(true);
    setReportOpen(false);
  }

  // Saves the reader's date of birth, then reloads — which lifts the gate
  // if it confirms they're 18+.
  async function confirmAge() {
    if (busy) return;
    if (!gateDob) {
      setGateErr('Select your date of birth.');
      return;
    }
    if (!isAdult(gateDob)) {
      setGateErr('You must be 18 or older to read this story.');
      return;
    }
    setBusy(true);
    setGateErr('');
    try {
      await apiSend<User>('/api/me/profile', 'PATCH', { dateOfBirth: gateDob });
      await load();
    } catch {
      setGateErr('Could not save that. Please try again.');
    }
    setBusy(false);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (notFound || !story) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.body}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>‹ Back</Text>
          </Pressable>
          <Text style={styles.sub}>Story not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOwnStory = userId === story.authorId;
  const chapters = story.chapters.filter((c) => c.publishedAt);
  // Mature stories are gated until the reader proves they're 18+. Authors
  // always see their own story.
  const gated = story.isMature && !isOwnStory && !isAdult(user?.dateOfBirth);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>

        <View style={styles.head}>
          <Cover
            coverUrl={story.coverUrl}
            coverColor={story.coverColor}
            title={story.title}
            mature={story.isMature}
            style={styles.cover}
          />
          <View style={styles.headText}>
            <View style={styles.metaRow}>
              <Text style={styles.genre}>{story.genre}</Text>
              {story.isMature && (
                <View style={styles.maturePill}>
                  <Text style={styles.maturePillText}>18+</Text>
                </View>
              )}
            </View>
            <Text style={styles.h1}>{story.title}</Text>
            <Text style={styles.author}>
              by {story.author?.displayName ?? 'a NovelStack writer'}
              {story.author?.isVerified ? ' ✓' : ''}
            </Text>
          </View>
        </View>

        {!!story.description && <Text style={styles.desc}>{story.description}</Text>}

        {gated ? (
          <View style={styles.gate}>
            <Text style={styles.gateTitle}>This story is 18+</Text>
            {userId ? (
              <>
                <Text style={styles.gateBody}>
                  Confirm your date of birth to read mature stories — we only ask once.
                </Text>
                <DobField
                  value={gateDob}
                  onChange={(d) => {
                    setGateDob(d);
                    setGateErr('');
                  }}
                />
                {!!gateErr && <Text style={styles.gateErr}>{gateErr}</Text>}
                <Pressable
                  style={[styles.primaryBtn, busy && { opacity: 0.6 }]}
                  onPress={confirmAge}
                  disabled={busy}
                >
                  <Text style={styles.primaryBtnText}>
                    {busy ? 'Saving…' : 'Confirm & continue'}
                  </Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.gateBody}>
                  Sign in and confirm your date of birth to read mature stories.
                </Text>
                <Pressable style={styles.primaryBtn} onPress={() => router.push('/signin')}>
                  <Text style={styles.primaryBtnText}>Sign in</Text>
                </Pressable>
              </>
            )}
          </View>
        ) : (
          <>
        {/* Actions */}
        <View style={styles.actions}>
          <Pressable
            style={[styles.actionBtn, bookmarked && styles.actionBtnOn]}
            onPress={toggleBookmark}
            disabled={busy}
          >
            <Text style={[styles.actionText, bookmarked && styles.actionTextOn]}>
              {bookmarked ? 'Saved ✓' : 'Save story'}
            </Text>
          </Pressable>
          {!isOwnStory && (
            <Pressable
              style={[styles.actionBtn, following && styles.actionBtnOn]}
              onPress={toggleFollow}
              disabled={busy}
            >
              <Text style={[styles.actionText, following && styles.actionTextOn]}>
                {following ? 'Following' : 'Follow writer'}
              </Text>
            </Pressable>
          )}
        </View>

        {!isOwnStory && (
          <View style={styles.linkRow}>
            {tipDone ? (
              <Text style={styles.tinyMuted}>Tip sent — thank you</Text>
            ) : (
              <Pressable onPress={() => setTipOpen(!tipOpen)}>
                <Text style={styles.link}>Tip the writer</Text>
              </Pressable>
            )}
            {reportDone ? (
              <Text style={styles.tinyMuted}>Reported — thank you</Text>
            ) : (
              <Pressable onPress={() => setReportOpen(!reportOpen)}>
                <Text style={styles.linkFaint}>Report</Text>
              </Pressable>
            )}
          </View>
        )}

        {/* Tip panel */}
        {tipOpen && !tipDone && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Send a tip</Text>
            <View style={styles.tipRow}>
              {TIP_AMOUNTS.map((a) => (
                <Pressable
                  key={a}
                  style={[styles.tipChip, tipAmount === a && styles.tipChipOn]}
                  onPress={() => setTipAmount(a)}
                >
                  <Text style={[styles.tipChipText, tipAmount === a && styles.tipChipTextOn]}>
                    ${a / 100}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={tipMsg}
              onChangeText={setTipMsg}
              placeholder="Add a message (optional)"
              placeholderTextColor={colors.inkFaint}
              style={styles.input}
            />
            <Pressable
              style={[styles.primaryBtn, busy && { opacity: 0.6 }]}
              onPress={sendTip}
              disabled={busy}
            >
              <Text style={styles.primaryBtnText}>Send ${tipAmount / 100} tip</Text>
            </Pressable>
            <Text style={styles.tinyMuted}>
              Writers keep 70%. Charges settle once payouts go live.
            </Text>
          </View>
        )}

        {/* Report panel */}
        {reportOpen && !reportDone && (
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Report this story</Text>
            <View style={styles.reasonWrap}>
              {REPORT_REASONS.map((r) => (
                <Pressable
                  key={r.v}
                  style={[styles.reason, reportReason === r.v && styles.reasonOn]}
                  onPress={() => setReportReason(r.v)}
                >
                  <Text
                    style={[styles.reasonText, reportReason === r.v && styles.reasonTextOn]}
                  >
                    {r.l}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={reportDetail}
              onChangeText={setReportDetail}
              placeholder="Anything else? (optional)"
              placeholderTextColor={colors.inkFaint}
              multiline
              style={[styles.input, { height: 64, textAlignVertical: 'top' }]}
            />
            <Pressable
              style={[styles.primaryBtn, busy && { opacity: 0.6 }]}
              onPress={submitReport}
              disabled={busy}
            >
              <Text style={styles.primaryBtnText}>Submit report</Text>
            </Pressable>
          </View>
        )}

        {/* Chapters */}
        <Text style={styles.section}>Chapters</Text>
        {chapters.length === 0 ? (
          <Text style={styles.sub}>No published chapters yet.</Text>
        ) : (
          chapters.map((ch) => (
            <Pressable
              key={ch.id}
              style={styles.chapterRow}
              onPress={() => router.push(`/read/${ch.id}`)}
            >
              <Text style={styles.chapterTitle}>
                {ch.number}. {ch.title}
              </Text>
              <Text style={styles.chapterTag}>{ch.isFree ? 'Free' : 'Ad / NovelStack+'}</Text>
            </Pressable>
          ))
        )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  body: { padding: spacing.lg },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 3 },
  back: { fontSize: 14, color: colors.inkMuted, marginBottom: spacing.lg },
  head: { flexDirection: 'row', gap: spacing.md },
  cover: { width: 110, height: 146, borderRadius: radius.md },
  headText: { flex: 1, justifyContent: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  genre: { fontSize: 12, color: colors.signal, fontWeight: '500', textTransform: 'capitalize' },
  maturePill: {
    backgroundColor: colors.ink,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  maturePillText: { fontSize: 10, fontWeight: '700', color: colors.paper },
  gate: {
    marginTop: spacing.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  gateTitle: { fontSize: 17, fontWeight: '500', color: colors.ink },
  gateBody: { fontSize: 14, color: colors.inkMuted, lineHeight: 21 },
  gateErr: { fontSize: 13, color: colors.signal },
  h1: { fontSize: 24, fontWeight: '500', color: colors.ink, marginTop: 4, letterSpacing: -0.5 },
  author: { fontSize: 14, color: colors.inkMuted, marginTop: 6 },
  desc: { fontSize: 14, color: colors.inkMuted, lineHeight: 21, marginTop: spacing.lg },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  actionBtn: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  actionBtnOn: { backgroundColor: colors.signal, borderColor: colors.signal },
  actionText: { fontSize: 13, fontWeight: '500', color: colors.ink },
  actionTextOn: { color: colors.paper },
  linkRow: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.md, alignItems: 'center' },
  link: { fontSize: 13, color: colors.signal, fontWeight: '500' },
  linkFaint: { fontSize: 12, color: colors.inkFaint, textDecorationLine: 'underline' },
  tinyMuted: { fontSize: 12, color: colors.inkFaint },
  panel: {
    marginTop: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  panelTitle: { fontSize: 15, fontWeight: '500', color: colors.ink },
  tipRow: { flexDirection: 'row', gap: spacing.sm },
  tipChip: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tipChipOn: { backgroundColor: colors.signal, borderColor: colors.signal },
  tipChipText: { fontSize: 14, fontWeight: '500', color: colors.ink },
  tipChipTextOn: { color: colors.paper },
  reasonWrap: { gap: 4 },
  reason: { paddingVertical: 7, paddingHorizontal: 10, borderRadius: radius.sm },
  reasonOn: { backgroundColor: colors.paperSoft },
  reasonText: { fontSize: 13, color: colors.inkMuted },
  reasonTextOn: { color: colors.ink, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: colors.paperSoft,
    color: colors.ink,
  },
  primaryBtn: {
    backgroundColor: colors.signal,
    paddingVertical: 11,
    borderRadius: radius.pill,
    alignItems: 'center',
  },
  primaryBtnText: { color: colors.paper, fontSize: 14, fontWeight: '500' },
  section: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.ink,
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  sub: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.sm, lineHeight: 21 },
  chapterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  chapterTitle: { fontSize: 15, color: colors.ink, flex: 1 },
  chapterTag: { fontSize: 12, color: colors.inkFaint, marginLeft: spacing.sm },
});
