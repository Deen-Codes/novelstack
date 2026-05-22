// NovelStack — database schema (Drizzle ORM, PostgreSQL).
// This is the canonical schema for the Render-hosted database. Ported from the
// old Supabase db/schema.sql + migrations 001-003. Changes from Supabase:
//   - `users` is now the identity table itself (it carries `email`), instead
//     of pointing at Supabase's auth.users.
//   - `auth_tokens` + `sessions` added — magic-link auth we own (Phase 2).
// Schema changes are made here, in code, and applied with drizzle-kit.

import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  integer,
  numeric,
  date,
  timestamp,
  primaryKey,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ============================================================
// ENUMS
// ============================================================
export const userRole = pgEnum('user_role', ['reader', 'writer', 'both', 'admin']);

export const storyGenre = pgEnum('story_genre', [
  'romance', 'fantasy', 'scifi', 'thriller', 'mystery', 'crime', 'horror',
  'paranormal', 'werewolf', 'vampire', 'young_adult', 'teen_fiction',
  'contemporary', 'historical', 'adventure', 'action', 'dystopian', 'drama',
  'lgbtq', 'humor', 'fanfiction', 'poetry', 'short_story', 'nonfiction', 'other',
]);

export const storyStatus = pgEnum('story_status', ['draft', 'ongoing', 'complete', 'paused']);
export const subStatus = pgEnum('sub_status', ['active', 'canceled', 'past_due']);
export const payoutStatus = pgEnum('payout_status', ['pending', 'processing', 'paid', 'failed']);

// ============================================================
// USERS — the identity + profile table
// ============================================================
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  username: text('username').notNull().unique(),
  displayName: text('display_name').notNull(),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  role: userRole('role').notNull().default('reader'),
  isVerified: boolean('is_verified').notNull().default(false),
  dateOfBirth: date('date_of_birth'),
  isSeed: boolean('is_seed').notNull().default(false), // internal house account
  stripeCustomerId: text('stripe_customer_id'),
  stripeConnectId: text('stripe_connect_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// AUTH — magic-link tokens + sessions (owned by us, Phase 2)
// ============================================================
export const authTokens = pgTable(
  'auth_tokens',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').notNull(),
    tokenHash: text('token_hash').notNull(), // sha-256 of the emailed token
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    consumedAt: timestamp('consumed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_auth_tokens_email').on(t.email)],
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_sessions_user').on(t.userId)],
);

// ============================================================
// STORIES
// ============================================================
export const stories = pgTable(
  'stories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    coverUrl: text('cover_url'),
    coverColor: text('cover_color').default('#D85A30'),
    genre: storyGenre('genre').notNull().default('other'),
    tags: text('tags').array().default([]),
    status: storyStatus('status').notNull().default('draft'),
    isMature: boolean('is_mature').notNull().default(false),
    totalReads: integer('total_reads').notNull().default(0),
    totalFollowers: integer('total_followers').notNull().default(0),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index('idx_stories_genre_published').on(t.genre, t.publishedAt),
    index('idx_stories_author').on(t.authorId),
  ],
);

// ============================================================
// CHAPTERS
// ============================================================
export const chapters = pgTable(
  'chapters',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    storyId: uuid('story_id')
      .notNull()
      .references(() => stories.id, { onDelete: 'cascade' }),
    number: integer('number').notNull(),
    title: text('title').notNull(),
    excerpt: text('excerpt').notNull().default(''),
    wordCount: integer('word_count').notNull().default(0),
    pageCount: integer('page_count').notNull().default(0),
    isFree: boolean('is_free').notNull().default(false),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('idx_chapters_story_number').on(t.storyId, t.number)],
);

// Full chapter body, split out so the chapters row can be public for SEO
// while the body itself stays access-gated by the API.
export const chapterContent = pgTable('chapter_content', {
  chapterId: uuid('chapter_id')
    .primaryKey()
    .references(() => chapters.id, { onDelete: 'cascade' }),
  body: text('body').notNull().default(''),
});

// ============================================================
// MONETIZATION
// ============================================================
export const subscriptions = pgTable('subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  readerId: uuid('reader_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  stripeSubscriptionId: text('stripe_subscription_id'),
  status: subStatus('status').notNull().default('active'),
  priceCents: integer('price_cents').notNull().default(699),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  endsAt: timestamp('ends_at', { withTimezone: true }),
});

export const adUnlocks = pgTable('ad_unlocks', {
  id: uuid('id').primaryKey().defaultRandom(),
  readerId: uuid('reader_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  chapterId: uuid('chapter_id')
    .notNull()
    .references(() => chapters.id, { onDelete: 'cascade' }),
  adRevenueCents: numeric('ad_revenue_cents', { precision: 10, scale: 4 }).notNull().default('0'),
  authorPayoutCents: numeric('author_payout_cents', { precision: 10, scale: 4 }).notNull().default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const tips = pgTable('tips', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: uuid('sender_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  recipientId: uuid('recipient_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  storyId: uuid('story_id').references(() => stories.id, { onDelete: 'set null' }),
  amountCents: integer('amount_cents').notNull(),
  message: text('message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// READING PROGRESS
// ============================================================
export const reads = pgTable(
  'reads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    readerId: uuid('reader_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    chapterId: uuid('chapter_id')
      .notNull()
      .references(() => chapters.id, { onDelete: 'cascade' }),
    progressPct: integer('progress_pct').notNull().default(0),
    isSubscriber: boolean('is_subscriber').notNull().default(false),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('idx_reads_reader_chapter').on(t.readerId, t.chapterId)],
);

// ============================================================
// SOCIAL
// ============================================================
export const follows = pgTable(
  'follows',
  {
    followerId: uuid('follower_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    authorId: uuid('author_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.followerId, t.authorId] })],
);

export const bookmarks = pgTable(
  'bookmarks',
  {
    readerId: uuid('reader_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    storyId: uuid('story_id')
      .notNull()
      .references(() => stories.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.readerId, t.storyId] })],
);

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  chapterId: uuid('chapter_id')
    .notNull()
    .references(() => chapters.id, { onDelete: 'cascade' }),
  parentId: uuid('parent_id'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const likes = pgTable(
  'likes',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    chapterId: uuid('chapter_id')
      .notNull()
      .references(() => chapters.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.chapterId] })],
);

// ============================================================
// PAYOUTS
// ============================================================
export const payouts = pgTable('payouts', {
  id: uuid('id').primaryKey().defaultRandom(),
  writerId: uuid('writer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  periodMonth: date('period_month').notNull(),
  subscriptionCents: integer('subscription_cents').notNull().default(0),
  adCents: integer('ad_cents').notNull().default(0),
  tipCents: integer('tip_cents').notNull().default(0),
  totalCents: integer('total_cents').notNull().default(0),
  status: payoutStatus('status').notNull().default('pending'),
  stripePayoutId: text('stripe_payout_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ============================================================
// RELATIONS — let Drizzle's query API fetch nested data
// (story.author, story.chapters, chapter.content, …)
// ============================================================
export const usersRelations = relations(users, ({ many }) => ({
  stories: many(stories),
}));

export const storiesRelations = relations(stories, ({ one, many }) => ({
  author: one(users, { fields: [stories.authorId], references: [users.id] }),
  chapters: many(chapters),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  story: one(stories, { fields: [chapters.storyId], references: [stories.id] }),
  content: one(chapterContent, {
    fields: [chapters.id],
    references: [chapterContent.chapterId],
  }),
  comments: many(comments),
}));

export const chapterContentRelations = relations(chapterContent, ({ one }) => ({
  chapter: one(chapters, { fields: [chapterContent.chapterId], references: [chapters.id] }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  chapter: one(chapters, { fields: [comments.chapterId], references: [chapters.id] }),
}));

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  story: one(stories, { fields: [bookmarks.storyId], references: [stories.id] }),
  reader: one(users, { fields: [bookmarks.readerId], references: [users.id] }),
}));

export const followsRelations = relations(follows, ({ one }) => ({
  author: one(users, { fields: [follows.authorId], references: [users.id] }),
  follower: one(users, { fields: [follows.followerId], references: [users.id] }),
}));
