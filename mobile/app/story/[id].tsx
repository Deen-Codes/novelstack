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
import { viewerIsAdult } from '@/lib/age';

// Reader-to-writer tip amounts, in cents. The tips table enforces >= $3.
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

// Story detail — chapter list plus the social/monetisation surfaces
// (bookmark, follow, tip, report) that previously only existed on web.
export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [story, setStory] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [gated, setGated] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);

  const [tipOpen, setTipOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(500);
  const [tipMsg, setTipMsg] = useState('');
  const [tipDone, setTipDone] = useState(false);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('harassment');
  const [reportDetail, setReportDetail] = useState('');
  const [reportDone, setReportDone] = useState(false);

  const load = useCallback(async () => {
    const adult = await viewerIsAdult();
    const { data: s } = await supabase
      .from('stories')
      .select('*, author:users(id, username, display_name, is_verified)')
      .eq('id', id)
      .single();
    if (!s) {
      setLoading(false);
      return;
    }
    setStory(s);

    // Q1 age-gate — mature stories blocked for under-18s / logged-out viewers.
    if (s.is_mature && !adult) {
      setGated(true);
      setLoading(false);
      return;
    }

    const { data: chs } = await supabase
      .from('chapters')
      .select('id, number, title, is_free')
      .eq('story_id', id)
      .not('published_at', 'is', null)
      .order('number');
    setChapters(chs ?? []);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);
    if (user) {
      const { data: bm } = await supabase
        .from('bookmarks')
        .select('story_id')
        .eq('reader_id', user.id)
        .eq('story_id', id)
        .maybeSingle();
      setBookmarked(!!bm);
      const { data: f } = await supabase
        .from('follows')
        .select('author_id')
        .eq('follower_id', user.id)
        .eq('author_id', s.author_id)
        .maybeSingle();
      setFollowing(!!f);
    }
    setLoading(false);
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  function requireSignIn(): boolean {
    if (!userId) {
      router.push('/signin');
      return true;
    }
    return false;
  }

  async function toggleBookmark() {
    if (requireSignIn() || busy) return;
    setBusy(true);
    if (bookmarked) {
      await supabase.from('bookmarks').delete().eq('reader_id', userId!).eq('story_id', id);
    } else {
      await supabase.from('bookmarks').insert({ reader_id: userId!, story_id: id });
    }
    setBookmarked(!bookmarked);
    setBusy(false);
  }

  async function toggleFollow() {
    if (requireSignIn() || busy) return;
    setBusy(true);
    if (following) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', userId!)
        .eq('author_id', story.author_id);
    } else {
      await supabase.from('follows').insert({ follower_id: userId!, author_id: story.author_id });
    }
    setFollowing(!following);
    setBusy(false);
  }

  async function sendTip() {
    if (requireSignIn() || busy) return;
    if (story.author_id === userId) return; // can't tip yourself
    setBusy(true);
    await supabase.from('tips').insert({
      sender_id: userId!,
      recipient_id: story.author_id,
      story_id: id,
      amount_cents: tipAmount,
      message: tipMsg.trim() || null,
    });
    setBusy(false);
    setTipDone(true);
    setTipOpen(false);
  }

  async function submitReport() {
    if (requireSignIn() || busy) return;
    setBusy(true);
    await supabase.from('reports').insert({
      reporter_id: userId!,
      target_type: 'story',
      target_id: id,
      reason: reportReason,
      detail: reportDetail.trim() || null,
    });
    setBusy(false);
    setReportDone(true);
    setReportOpen(false);
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <ActivityIndicator color={colors.signal} style={{ marginTop: 80 }} />
      </SafeAreaView>
    );
  }

  if (!story) {
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

  if (gated) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.body}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.back}>‹ Back</Text>
          </Pressable>
          <Text style={styles.h1}>{story.title}</Text>
          <Text style={styles.sub}>
            This story is marked mature (18+). Add a date of birth confirming you
            are 18 or older — in Profile — to read it.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isOwnStory = userId === story.author_id;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Back</Text>
        </Pressable>

        <View style={styles.head}>
          <View style={[styles.cover, { backgroundColor: story.cover_color ?? '#4F4AAA' }]} />
          <View style={styles.headText}>
            <Text style={styles.genre}>{story.genre}</Text>
            <Text style={styles.h1}>{story.title}</Text>
            <Text style={styles.author}>
              by {story.author?.display_name ?? 'a NovelStack writer'}
              {story.author?.is_verified ? ' ✓' : ''}
            </Text>
          </View>
        </View>

        {!!story.description && <Text style={styles.desc}>{story.description}</Text>}

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
              <Text style={styles.chapterTag}>{ch.is_free ? 'Free' : 'Ad / NovelStack+'}</Text>
            </Pressable>
          ))
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
  genre: { fontSize: 12, color: colors.signal, fontWeight: '500', textTransform: 'capitalize' },
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
