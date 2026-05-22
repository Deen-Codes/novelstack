// Shared types — inferred straight from the Drizzle schema so the app and the
// database can never drift. All fields are camelCase (Drizzle's column names).
import type { users, stories, chapters, chapterContent } from '@/db/schema';

export type StoryGenre = typeof stories.$inferSelect.genre;
export type StoryStatus = typeof stories.$inferSelect.status;

export type User = typeof users.$inferSelect;
export type Story = typeof stories.$inferSelect & { author?: User | null };
export type Chapter = typeof chapters.$inferSelect;
export type ChapterContent = typeof chapterContent.$inferSelect;
