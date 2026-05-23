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
};

export type HomeExtras = {
  continueReading: ContinueReading | null;
  streak: number;
  name: string | null;
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
