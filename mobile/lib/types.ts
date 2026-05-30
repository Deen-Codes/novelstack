// Shared API response shapes (camelCase, matching the NovelStack HTTP API).

export type User = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  role: string;
  isVerified: boolean;
  dateOfBirth: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Story = {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  coverColor: string | null;
  genre: string;
  tags: string[] | null;
  status: string;
  isMature: boolean;
  totalReads: number;
  totalFollowers: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author?: User | null;
  // Present on saved-shelf stories: the reader's completed/total chapters.
  progress?: { completed: number; total: number } | null;
};

export type Chapter = {
  id: string;
  storyId: string;
  number: number;
  title: string;
  excerpt: string;
  wordCount: number;
  pageCount: number;
  isFree: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

// GET /api/feed — story plus the ranking reason.
export type FeedStory = Story & { _reason: string };

// GET /api/stories/:slug — story with author + full chapter list.
export type StoryDetail = Story & { author: User | null; chapters: Chapter[] };

// GET /api/chapters/:id — chapter with story.author, gated body + locked flag.
export type ChapterDetail = Chapter & {
  story: Story & { author: User | null };
  body: string | null;
  locked: boolean;
  // True for everyone except NovelStack+ members — drives the reader banner.
  showAds: boolean;
};

// GET /api/users/:username — author with their published stories.
export type AuthorProfile = User & { stories: Story[] };

// GET /api/me/shelf
export type Shelf = {
  saved: Story[];
  writing: Story[];
  following: User[];
};

// GET /api/me/home — extras for the home screen.
export type ContinueReading = {
  progressPct: number;
  completedAt: string | null;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  storyId: string;
  storySlug: string;
  storyTitle: string;
  coverUrl: string | null;
  coverColor: string | null;
  totalChapters: number;
  // True once every published chapter is finished — the home screen then
  // stops showing the "continue reading" card for this book.
  storyCompleted: boolean;
};

export type HomeExtras = {
  continueReading: ContinueReading | null;
  streak: number;
  name: string | null;
};

// GET /api/community — an author update post, with author + attached book.
export type CommunityPost = {
  id: string;
  authorId: string;
  body: string;
  storyId: string | null;
  createdAt: string;
  author: User | null;
  story: Story | null;
  commentCount: number;
  likeCount: number;
  likedByMe: boolean;
};

export type PostComment = {
  id: string;
  postId: string;
  userId: string;
  body: string;
  createdAt: string;
  user: User | null;
};

// GET /api/posts/:id — a post with its full comment thread.
export type PostDetail = CommunityPost & { comments: PostComment[] };

// GET /api/me/earnings — an author's earnings + payout status.
export type EarningsTip = {
  id: string;
  amountCents: number;
  message: string | null;
  from: string;
  createdAt: string;
};

export type EarningsPayout = {
  id: string;
  periodMonth: string;
  subscriptionCents: number;
  adCents: number;
  tipCents: number;
  totalCents: number;
  status: 'pending' | 'processing' | 'paid' | 'failed';
};

export type Earnings = {
  // A NovelStack house/seed account — earnings route to the company.
  routesToCompany: boolean;
  availableCents: number;
  thisMonthCents: number;
  lifetimeCents: number;
  paidOutCents: number;
  breakdown: { tipsCents: number; adCents: number; subscriptionCents: number };
  pendingAdUnlocks: number;
  recentTips: EarningsTip[];
  payouts: EarningsPayout[];
  stripe: {
    connected: boolean;
    payoutsEnabled: boolean;
    detailsSubmitted: boolean;
    needsOnboarding: boolean;
  };
  // Server-side override for the App Review test account — hides the entire
  // payout-management section (no Set up / Manage buttons) so reviewers see
  // a clean populated dashboard without a broken Stripe flow behind the CTA.
  hidePayoutSetup?: boolean;
};

// GET /api/stories/:slug/reviews
export type Review = {
  id: string;
  rating: number;
  body: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  } | null;
};

export type ReviewsResponse = {
  reviews: Review[];
  summary: { count: number; avg: number | null };
  myReview: Review | null;
};

export type Comment = {
  id: string;
  userId: string;
  chapterId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
};
