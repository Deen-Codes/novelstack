import { useCallback, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  ActivityIndicator,
  Share,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useFocusEffect, router } from 'expo-router';
import { colors, spacing, radius, fonts } from '@/theme/tokens';
import { apiGetCached, apiSend } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { genreLabel } from '@/lib/genres';
import { Cover } from '@/components/Cover';
import { DobField } from '@/components/DobField';
import { BottomSheet } from '@/components/BottomSheet';
import { purchaseTip, TIP_TIERS, type TipTier } from '@/lib/iap';
import type {
  StoryDetail,
  Shelf,
  User,
  Story,
  HomeExtras,
  Review,
  ReviewsResponse,
} from '@/lib/types';

const SITE = 'https://novelstack.app';

function isAdult(dob?: string | null): boolean {
  if (!dob) return false;
  const d = new Date(`${dob}T00:00:00`);
  if (Number.isNaN(d.getTime())) return false;
  const eighteen = new Date();
  eighteen.setFullYear(eighteen.getFullYear() - 18);
  return d <= eighteen;
}

function hexA(hex: string, a: number): string {
  const h = (hex || '#3a2150').replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) || 58;
  const g = parseInt(h.slice(2, 4), 16) || 33;
  const b = parseInt(h.slice(4, 6), 16) || 80;
  return `rgba(${r},${g},${b},${a})`;
}

// Read-only star display — five icons, half-stars rounded down, used for
// both the cover-side average and each review row.
function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Ionicons
          key={n}
          name={value >= n ? 'star' : value >= n - 0.5 ? 'star-half' : 'star-outline'}
          size={size}
          color={colors.signal}
        />
      ))}
    </View>
  );
}

// Interactive 1-to-5 star selector for the review form.
function StarSelector({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, marginVertical: 8 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} onPress={() => onChange(n)} hitSlop={6}>
          <Ionicons
            name={value >= n ? 'star' : 'star-outline'}
            size={28}
            color={colors.signal}
          />
        </Pressable>
      ))}
    </View>
  );
}

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

export default function StoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [story, setStory] = useState<StoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [following, setFollowing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<'chapters' | 'more'>('chapters');
  const [moreLikeThis, setMoreLikeThis] = useState<Story[]>([]);
  // Lazy reviews — loaded the first time the Reviews tab is opened, then kept
  // in memory until the screen unmounts.
  const [reviewData, setReviewData] = useState<ReviewsResponse | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewSummary, setReviewSummary] = useState<{ count: number; avg: number | null }>({
    count: 0,
    avg: null,
  });
  const [draftRating, setDraftRating] = useState(0);
  const [draftBody, setDraftBody] = useState('');
  const [reviewBusy, setReviewBusy] = useState(false);
  const [continueId, setContinueId] = useState<string | null>(null);
  const [continueNum, setContinueNum] = useState<number | null>(null);

  const [gateDob, setGateDob] = useState<string | null>(null);
  const [gateErr, setGateErr] = useState('');

  const [tipOpen, setTipOpen] = useState(false);
  const [tipDone, setTipDone] = useState(false);
  const [tipPending, setTipPending] = useState<string | null>(null);
  const [tipError, setTipError] = useState('');

  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState('harassment');
  const [reportDetail, setReportDetail] = useState('');
  const [reportDone, setReportDone] = useState(false);

  // Reviews bottom sheet — opens from the action row, holds either the form
  // for first-time reviewers OR an inline-editable version of your own
  // review, with the full list of everyone else's reviews underneath.
  const [reviewsOpen, setReviewsOpen] = useState(false);

  const userId = user?.id ?? null;

  const load = useCallback(async () => {
    // Critical path: the story itself, plus who we are (the user lookup is
    // cached, so it's effectively free after the first call). As soon as
    // these land the page renders — everything else streams in after.
    let s: StoryDetail;
    try {
      s = await apiGetCached<StoryDetail>(`/api/stories/${id}`);
    } catch {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setStory(s);
    // Kick off the reviews summary fetch alongside everything else — cheap
    // round-trip; lets the cover-side stars render without waiting on the
    // user to open the Reviews tab.
    loadReviews(s.slug);

    const me = await getCurrentUser();
    setUser(me ?? null);
    setLoading(false);

    // Secondary data — fetched in parallel and applied as it arrives, so it
    // never holds up the first paint.
    const tasks: Promise<unknown>[] = [];
    if (me) {
      tasks.push(
        apiGetCached<Shelf>('/api/me/shelf')
          .then((shelf) => {
            setBookmarked(shelf.saved.some((b) => b.id === s.id));
            setFollowing(shelf.following.some((f) => f.id === s.authorId));
          })
          .catch(() => {}),
      );
      tasks.push(
        apiGetCached<HomeExtras>('/api/me/home')
          .then((home) => {
            if (home.continueReading && home.continueReading.storyId === s.id) {
              setContinueId(home.continueReading.chapterId);
              setContinueNum(home.continueReading.chapterNumber);
            }
          })
          .catch(() => {}),
      );
    }
    tasks.push(
      apiGetCached<Story[]>(`/api/feed?genre=${encodeURIComponent(s.genre)}`)
        .then((similar) =>
          setMoreLikeThis(similar.filter((x) => x.id !== s.id).slice(0, 12)),
        )
        .catch(() => setMoreLikeThis([])),
    );
    await Promise.allSettled(tasks);
  }, [id, loadReviews]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      setNotFound(false);
      load();
    }, [load]),
  );

  // Fetch reviews payload and seed the summary used by the cover-side stars.
  // Called from load() once the story is known, and again after submitReview
  // so the freshly-posted rating shows up immediately.
  const loadReviews = useCallback(async (story_slug: string) => {
    try {
      const data = await apiGetCached<ReviewsResponse>(
        `/api/stories/${story_slug}/reviews`,
      );
      setReviewData(data);
      setReviewSummary(data.summary);
      if (data.myReview) {
        setDraftRating(data.myReview.rating);
        setDraftBody(data.myReview.body);
      }
    } catch {
      // Best-effort — Reviews tab will just show empty.
    }
  }, []);

  async function submitReview() {
    if (!story || reviewBusy) return;
    if (draftRating < 1) return;
    if (requireSignIn()) return;
    setReviewBusy(true);
    try {
      await apiSend(`/api/stories/${story.slug}/reviews`, 'POST', {
        rating: draftRating,
        body: draftBody.trim(),
      });
      // Refetch so the summary + list both update with the new review.
      const fresh = await apiGetCached<ReviewsResponse>(
        `/api/stories/${story.slug}/reviews`,
      );
      setReviewData(fresh);
      setReviewSummary(fresh.summary);
    } catch {
      // Leave the form filled so the user can retry.
    }
    setReviewBusy(false);
  }

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
      // Leave unchanged.
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
      // Leave unchanged.
    }
    setBusy(false);
  }

  async function shareStory() {
    if (!story) return;
    try {
      await Share.share({
        message: `Read "${story.title}" by ${story.author?.displayName ?? 'a NovelStack writer'} on NovelStack — ${SITE}/story/${story.slug}`,
      });
    } catch {
      // Share cancelled — no-op.
    }
  }

  async function sendTip(tier: TipTier) {
    if (requireSignIn() || tipPending || !story) return;
    setTipPending(tier.productId);
    setTipError('');
    try {
      const out = await purchaseTip(tier.productId, story.authorId, story.id);
      if (out.cancelled) {
        setTipPending(null);
        return;
      }
      if (!out.ok && out.error) {
        setTipError(out.error);
        setTipPending(null);
        return;
      }
      setTipDone(true);
      setTipOpen(false);
    } catch (e) {
      setTipError(e instanceof Error ? e.message : 'Tip failed.');
    }
    setTipPending(null);
  }

  async function submitReport() {
    if (requireSignIn() || busy || !story) return;
    setBusy(true);
    try {
      await apiSend('/api/reports', 'POST', {
        storyId: story.id,
        reason: reportReason,
        detail: reportDetail.trim(),
      });
      setReportDone(true);
      setReportOpen(false);
    } catch {
      // Leave the sheet open so the reader can retry.
    }
    setBusy(false);
  }

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
        <View style={styles.topRow}>
          <Pressable style={styles.circleBtn} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={20} color={colors.ink} />
          </Pressable>
        </View>
        <Text style={styles.notFound}>Story not found.</Text>
      </SafeAreaView>
    );
  }

  const isOwnStory = userId === story.authorId;
  const chapters = story.chapters
    .filter((c) => c.publishedAt)
    .sort((a, b) => a.number - b.number);
  const firstChapterId = chapters[0]?.id ?? null;
  const gated = story.isMature && !isOwnStory && !isAdult(user?.dateOfBirth);
  const ambient = story.coverColor ?? '#3a2150';

  const readTarget = continueId ?? firstChapterId;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <LinearGradient
        colors={[hexA(ambient, 0.55), hexA(ambient, 0.1), 'transparent']}
        locations={[0, 0.55, 1]}
        style={styles.ambient}
        pointerEvents="none"
      />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.topRow}>
          <Pressable style={styles.circleBtn} onPress={() => router.back()} hitSlop={8}>
            <Ionicons name="chevron-back" size={20} color={colors.ink} />
          </Pressable>
        </View>

        <Cover
          coverUrl={story.coverUrl}
          coverColor={story.coverColor}
          title={story.title}
          mature={story.isMature}
          style={styles.cover}
        />

        <Text style={styles.title}>{story.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>
            {genreLabel(story.genre)} · {chapters.length} chapter
            {chapters.length === 1 ? '' : 's'} · {(story.totalReads ?? 0).toLocaleString()} reads
          </Text>
          {story.isMature && (
            <View style={styles.maturePill}>
              <Text style={styles.maturePillText}>18+</Text>
            </View>
          )}
        </View>
        {/* Star rating — only shown when the story has at least one review.
            Tapping jumps straight to the Reviews tab. */}
        {reviewSummary.count > 0 && reviewSummary.avg != null && (
          <Pressable
            style={styles.ratingRow}
            onPress={() => setTab('reviews')}
            hitSlop={4}
          >
            <Stars value={reviewSummary.avg} size={15} />
            <Text style={styles.ratingNum}>{reviewSummary.avg.toFixed(1)}</Text>
            <Text style={styles.ratingCount}>
              · {reviewSummary.count} review{reviewSummary.count === 1 ? '' : 's'}
            </Text>
          </Pressable>
        )}

        <Pressable
          style={styles.authorRow}
          onPress={() =>
            story.author?.username && router.push(`/u/${story.author.username}`)
          }
        >
          <View style={styles.authorAv}>
            <Text style={styles.authorAvText}>
              {(story.author?.displayName ?? '?').slice(0, 1).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.authorName}>
            {story.author?.displayName ?? 'a NovelStack writer'}
          </Text>
          {!isOwnStory && (
            <Pressable
              style={[styles.followPill, following && styles.followPillOn]}
              onPress={toggleFollow}
              disabled={busy}
            >
              <Text style={[styles.followPillText, following && styles.followPillTextOn]}>
                {following ? 'Following' : 'Follow'}
              </Text>
            </Pressable>
          )}
        </Pressable>

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
                  style={[styles.gateBtn, busy && { opacity: 0.6 }]}
                  onPress={confirmAge}
                  disabled={busy}
                >
                  <Text style={styles.gateBtnText}>{busy ? 'Saving…' : 'Confirm & continue'}</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Text style={styles.gateBody}>
                  Sign in and confirm your date of birth to read mature stories.
                </Text>
                <Pressable style={styles.gateBtn} onPress={() => router.push('/signin')}>
                  <Text style={styles.gateBtnText}>Sign in</Text>
                </Pressable>
              </>
            )}
          </View>
        ) : (
          <>
            <View style={styles.btns}>
              <Pressable
                style={[styles.btn, styles.btnRead, !readTarget && { opacity: 0.5 }]}
                disabled={!readTarget}
                onPress={() => readTarget && router.push(`/read/${readTarget}`)}
              >
                <Ionicons name="play" size={16} color="#15100E" />
                <Text style={styles.btnReadText}>
                  {continueId ? 'Continue' : 'Start reading'}
                </Text>
                {continueId && continueNum != null && (
                  <Text style={styles.btnReadSub}> · Ch {continueNum}</Text>
                )}
              </Pressable>
              <Pressable style={[styles.btn, styles.btnSave]} onPress={toggleBookmark} disabled={busy}>
                <Ionicons
                  name={bookmarked ? 'checkmark' : 'add'}
                  size={18}
                  color={colors.ink}
                />
                <Text style={styles.btnSaveText}>{bookmarked ? 'Saved' : 'Save'}</Text>
              </Pressable>
            </View>

            {!!story.description && <Text style={styles.desc}>{story.description}</Text>}

            <View style={styles.actions}>
              <Pressable style={styles.act} onPress={shareStory}>
                <Ionicons name="paper-plane-outline" size={21} color={colors.ink} />
                <Text style={styles.actText}>Share</Text>
              </Pressable>
              {!isOwnStory && (
                <Pressable style={styles.act} onPress={() => setTipOpen((o) => !o)}>
                  <Ionicons name="heart-outline" size={21} color={colors.ink} />
                  <Text style={styles.actText}>{tipDone ? 'Tipped' : 'Tip writer'}</Text>
                </Pressable>
              )}
              {!isOwnStory && (
                <Pressable style={styles.act} onPress={() => setReviewsOpen(true)}>
                  <Ionicons
                    name={reviewData?.myReview ? 'star' : 'star-outline'}
                    size={21}
                    color={reviewData?.myReview ? colors.signal : colors.ink}
                  />
                  <Text style={styles.actText}>
                    {reviewData?.myReview ? 'Reviewed' : 'Review'}
                  </Text>
                </Pressable>
              )}
              {!isOwnStory && (
                <Pressable style={styles.act} onPress={() => setReportOpen((o) => !o)}>
                  <Ionicons name="flag-outline" size={21} color={colors.ink} />
                  <Text style={styles.actText}>{reportDone ? 'Reported' : 'Report'}</Text>
                </Pressable>
              )}
            </View>

            <BottomSheet visible={tipOpen && !tipDone} onClose={() => setTipOpen(false)}>
              <Text style={styles.sheetTitle}>Tip this writer</Text>
              <Text style={styles.sheetSub}>
                Pick a tier. Charged through your Apple ID — secure and one-tap.
              </Text>
              <View style={styles.tierList}>
                {TIP_TIERS.map((tier) => {
                  const isPending = tipPending === tier.productId;
                  return (
                    <Pressable
                      key={tier.productId}
                      style={[styles.tierRow, isPending && { opacity: 0.6 }]}
                      onPress={() => sendTip(tier)}
                      disabled={!!tipPending}
                    >
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={styles.tierName}>{tier.name}</Text>
                        <Text style={styles.tierDesc}>{tier.description}</Text>
                      </View>
                      <Text style={styles.tierPrice}>
                        {isPending ? '…' : tier.priceLabel}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {!!tipError && <Text style={styles.tipError}>{tipError}</Text>}
              <Text style={styles.tipFinePrint}>
                Tips are processed by Apple. Writers receive the majority share after
                Apple&apos;s fee and a small platform cut.
              </Text>
            </BottomSheet>

            <BottomSheet visible={reportOpen && !reportDone} onClose={() => setReportOpen(false)}>
              <Text style={styles.sheetTitle}>Report this story</Text>
              <Text style={styles.sheetSub}>
                Tell us what&apos;s wrong — reports are confidential.
              </Text>
              <View style={styles.reasonWrap}>
                {REPORT_REASONS.map((r) => (
                  <Pressable
                    key={r.v}
                    style={[styles.reason, reportReason === r.v && styles.reasonOn]}
                    onPress={() => setReportReason(r.v)}
                  >
                    <Text style={[styles.reasonText, reportReason === r.v && styles.reasonTextOn]}>
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
              <Pressable style={styles.sheetBtn} onPress={submitReport} disabled={busy}>
                <Text style={styles.sheetBtnText}>Submit report</Text>
              </Pressable>
            </BottomSheet>

            {/* Reviews sheet — composer/inline-edit for your own review at the
                top (whichever applies), then everyone else's reviews below.
                Tap a star or the body to edit; Save appears the moment
                anything differs from what's already stored. */}
            <BottomSheet visible={reviewsOpen} onClose={() => setReviewsOpen(false)}>
              <Text style={styles.sheetTitle}>
                {reviewSummary.count > 0 && reviewSummary.avg != null
                  ? `Reviews · ${reviewSummary.avg.toFixed(1)} (${reviewSummary.count})`
                  : 'Reviews'}
              </Text>

              {userId && userId !== story.authorId && (
                <View style={styles.reviewForm}>
                  <Text style={styles.reviewFormLabel}>
                    {reviewData?.myReview ? 'Your review' : 'Leave a review'}
                  </Text>
                  <StarSelector value={draftRating} onChange={setDraftRating} />
                  <TextInput
                    value={draftBody}
                    onChangeText={setDraftBody}
                    placeholder="A line or two (optional)"
                    placeholderTextColor={colors.inkFaint}
                    multiline
                    style={[styles.input, { height: 76, textAlignVertical: 'top' }]}
                  />
                  {/* Save button only appears when there's something to save
                      — first-time post if you have a rating, or an edit
                      that diverges from your stored review. */}
                  {(() => {
                    const my = reviewData?.myReview;
                    const dirty = my
                      ? draftRating !== my.rating || draftBody.trim() !== my.body
                      : draftRating > 0;
                    if (!dirty && !reviewBusy) return null;
                    return (
                      <Pressable
                        style={[
                          styles.reviewBtn,
                          (draftRating < 1 || reviewBusy) && { opacity: 0.5 },
                        ]}
                        onPress={submitReview}
                        disabled={draftRating < 1 || reviewBusy}
                      >
                        <Text style={styles.reviewBtnText}>
                          {reviewBusy
                            ? 'Saving…'
                            : my
                              ? 'Save changes'
                              : 'Post review'}
                        </Text>
                      </Pressable>
                    );
                  })()}
                </View>
              )}

              {reviewData == null ? (
                <ActivityIndicator color={colors.signal} style={{ marginTop: 20 }} />
              ) : reviewData.reviews.filter((r) => r.user?.id !== userId).length ===
                0 ? (
                <Text style={styles.emptyNote}>
                  No other reviews yet — yours will be the first.
                </Text>
              ) : (
                reviewData.reviews
                  // Hide your own review from the public list — it lives in
                  // the editable section above instead.
                  .filter((r) => r.user?.id !== userId)
                  .map((r) => (
                    <View key={r.id} style={styles.reviewRow}>
                      <View style={styles.reviewHead}>
                        <Pressable
                          onPress={() => {
                            setReviewsOpen(false);
                            r.user?.username && router.push(`/u/${r.user.username}`);
                          }}
                        >
                          <Text style={styles.reviewName}>
                            {r.user?.displayName ?? 'A reader'}
                          </Text>
                        </Pressable>
                        <Stars value={r.rating} size={13} />
                      </View>
                      {!!r.body && <Text style={styles.reviewBody}>{r.body}</Text>}
                    </View>
                  ))
              )}
            </BottomSheet>

            <View style={styles.tabs}>
              <Pressable onPress={() => setTab('chapters')}>
                <Text style={[styles.tab, tab === 'chapters' && styles.tabOn]}>Chapters</Text>
              </Pressable>
              <Pressable onPress={() => setTab('more')}>
                <Text style={[styles.tab, tab === 'more' && styles.tabOn]}>More like this</Text>
              </Pressable>
            </View>

            {tab === 'chapters' ? (
              chapters.length === 0 ? (
                <Text style={styles.emptyNote}>No published chapters yet.</Text>
              ) : (
                chapters.map((ch) => {
                  const isCurrent = ch.id === continueId;
                  return (
                    <Pressable
                      key={ch.id}
                      style={styles.chapterRow}
                      onPress={() => router.push(`/read/${ch.id}`)}
                    >
                      <Text style={[styles.chNum, isCurrent && styles.chCurrent]}>
                        {ch.number}
                      </Text>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Text style={[styles.chTitle, isCurrent && styles.chCurrent]} numberOfLines={1}>
                          {ch.title}
                        </Text>
                        {isCurrent && <Text style={styles.chSub}>Currently reading</Text>}
                      </View>
                      <Ionicons name="chevron-forward" size={16} color={colors.inkFaint} />
                    </Pressable>
                  );
                })
              )
            ) : moreLikeThis.length === 0 ? (
              <Text style={styles.emptyNote}>Nothing similar yet.</Text>
            ) : (
              <View style={styles.grid}>
                {moreLikeThis.map((s) => (
                  <Pressable
                    key={s.id}
                    style={styles.gridItem}
                    onPress={() => router.push(`/story/${s.slug}`)}
                  >
                    <Cover
                      coverUrl={s.coverUrl}
                      coverColor={s.coverColor}
                      title={s.title}
                      mature={s.isMature}
                      style={styles.gridCover}
                    />
                    <Text style={styles.gridTitle} numberOfLines={2}>
                      {s.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  ambient: { position: 'absolute', top: 0, left: 0, right: 0, height: 360 },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: spacing.xl * 2 },

  topRow: { flexDirection: 'row', justifyContent: 'space-between' },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFound: { fontSize: 15, color: colors.inkMuted, textAlign: 'center', marginTop: 80 },

  cover: {
    width: 158,
    height: 222,
    borderRadius: 14,
    alignSelf: 'center',
    marginTop: 14,
  },
  title: {
    fontFamily: fonts.displayXl,
    fontSize: 26,
    color: colors.ink,
    textAlign: 'center',
    marginTop: 16,
    letterSpacing: -0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  meta: { fontSize: 12.5, color: colors.inkMuted, fontWeight: '500' },
  maturePill: {
    backgroundColor: colors.ink,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  maturePillText: { fontSize: 10, fontWeight: '700', color: colors.paper },

  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 12,
  },
  authorAv: {
    width: 26,
    height: 26,
    borderRadius: radius.pill,
    backgroundColor: colors.signalDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvText: { fontSize: 11, fontWeight: '700', color: '#FFFFFF' },
  authorName: { fontSize: 13, fontWeight: '600', color: colors.ink },
  followPill: {
    borderWidth: 1,
    borderColor: 'rgba(200,65,78,0.55)',
    borderRadius: radius.pill,
    paddingHorizontal: 11,
    paddingVertical: 4,
  },
  followPillOn: { backgroundColor: colors.signal, borderColor: colors.signal },
  followPillText: { fontSize: 11, fontWeight: '600', color: '#F2C9CD' },
  followPillTextOn: { color: '#FFFFFF' },

  btns: { flexDirection: 'row', gap: 10, marginTop: spacing.lg },
  btn: {
    height: 50,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  btnRead: { flex: 1.7, backgroundColor: '#F4ECDF' },
  btnReadText: { fontSize: 15, fontWeight: '700', color: '#15100E' },
  btnReadSub: { fontSize: 12, fontWeight: '500', color: 'rgba(21,16,14,0.65)' },
  btnSave: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSaveText: { fontSize: 15, fontWeight: '600', color: colors.ink },

  desc: { fontSize: 13.5, color: colors.inkMuted, lineHeight: 21, marginTop: spacing.lg },

  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: spacing.lg,
    paddingHorizontal: 10,
  },
  act: { alignItems: 'center', gap: 5 },
  actText: { fontSize: 11, color: colors.inkMuted, fontWeight: '500' },

  panel: {
    marginTop: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  panelTitle: { fontSize: 15, fontWeight: '600', color: colors.ink },
  tierList: { gap: 10, marginBottom: 6 },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: radius.md,
  },
  tierName: { fontSize: 15, fontWeight: '600', color: colors.ink },
  tierDesc: { fontSize: 12.5, color: colors.inkMuted, marginTop: 2 },
  tierPrice: { fontSize: 15, fontWeight: '700', color: colors.ink },
  tipError: { fontSize: 13, color: colors.signal, marginTop: 8 },
  tipFinePrint: {
    fontSize: 11.5,
    color: colors.inkFaint,
    lineHeight: 16,
    marginTop: spacing.md,
  },
  reasonWrap: { gap: 4, marginBottom: spacing.md },
  reason: { paddingVertical: 7, paddingHorizontal: 10, borderRadius: radius.sm },
  reasonOn: { backgroundColor: colors.cardHi },
  reasonText: { fontSize: 13, color: colors.inkMuted },
  reasonTextOn: { color: colors.ink, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    backgroundColor: colors.card,
    color: colors.ink,
  },
  tinyMuted: { fontSize: 12, color: colors.inkFaint },
  sheetTitle: { fontFamily: fonts.display, fontSize: 18, color: colors.ink },
  sheetSub: {
    fontSize: 13,
    color: colors.inkMuted,
    lineHeight: 19,
    marginTop: 4,
    marginBottom: spacing.md,
  },
  sheetBtn: {
    backgroundColor: '#F4ECDF',
    height: 52,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  sheetBtnText: { color: '#15100E', fontSize: 15, fontWeight: '700' },
  gateBtn: {
    backgroundColor: '#F4ECDF',
    height: 50,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gateBtnText: { color: '#15100E', fontSize: 15, fontWeight: '700' },

  gate: {
    marginTop: spacing.lg,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  gateTitle: { fontFamily: fonts.display, fontSize: 17, color: colors.ink },
  gateBody: { fontSize: 14, color: colors.inkMuted, lineHeight: 21 },
  gateErr: { fontSize: 13, color: colors.signal },

  tabs: {
    flexDirection: 'row',
    gap: 24,
    marginTop: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  tab: {
    fontFamily: fonts.display,
    fontSize: 15,
    color: colors.inkFaint,
    paddingBottom: 11,
  },
  tabOn: { color: colors.ink, borderBottomWidth: 2, borderBottomColor: colors.signal },

  emptyNote: { fontSize: 14, color: colors.inkMuted, marginTop: spacing.lg },

  // Cover-side rating summary — appears only when there's at least one review.
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 6,
  },
  ratingNum: { fontSize: 13.5, color: colors.ink, fontWeight: '700' },
  ratingCount: { fontSize: 13, color: colors.inkMuted },

  // Reviews tab — form + rows.
  reviewForm: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: 14,
    padding: 14,
    marginTop: spacing.md,
  },
  reviewFormLabel: { fontSize: 13, color: colors.inkMuted, fontWeight: '600' },
  reviewBtn: {
    marginTop: 8,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F4ECDF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBtnText: { fontSize: 14, fontWeight: '700', color: '#15100E' },
  reviewRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  reviewHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reviewName: { fontSize: 14, fontWeight: '600', color: colors.ink },
  reviewBody: {
    fontSize: 14,
    color: colors.inkMuted,
    lineHeight: 20,
    marginTop: 6,
  },


  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#241E1A',
  },
  chNum: { fontFamily: fonts.display, fontSize: 15, color: colors.inkFaint, width: 24 },
  chTitle: { fontSize: 14.5, color: colors.ink, fontWeight: '500' },
  chSub: { fontSize: 11, color: colors.signal, marginTop: 2 },
  chCurrent: { color: colors.signal },
  chTag: { fontSize: 11, color: colors.inkFaint },
  chTagFree: { color: '#7FB08A' },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: spacing.md,
  },
  gridItem: { width: '31%' },
  gridCover: { width: '100%', aspectRatio: 3 / 4, borderRadius: 10 },
  gridTitle: { fontSize: 12, fontWeight: '600', color: colors.ink, marginTop: 7 },
});
