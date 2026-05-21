// Shared types — mirror db/schema.sql. Keep in sync, or generate with
// `supabase gen types typescript` once the schema is deployed.

export type StoryGenre =
  | 'romance' | 'fantasy' | 'scifi' | 'thriller' | 'mystery' | 'crime'
  | 'horror' | 'paranormal' | 'werewolf' | 'vampire' | 'young_adult'
  | 'teen_fiction' | 'contemporary' | 'historical' | 'adventure' | 'action'
  | 'dystopian' | 'drama' | 'lgbtq' | 'humor' | 'fanfiction' | 'poetry'
  | 'short_story' | 'nonfiction' | 'other';

export type StoryStatus = 'draft' | 'ongoing' | 'complete' | 'paused';

export interface User {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  date_of_birth: string | null;
}

export interface Story {
  id: string;
  author_id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  cover_color: string;
  genre: StoryGenre;
  status: StoryStatus;
  is_mature: boolean;
  total_reads: number;
  total_followers: number;
  published_at: string | null;
  updated_at: string;
  author?: User;
}

export interface Chapter {
  id: string;
  story_id: string;
  number: number;
  title: string;
  excerpt: string;          // first ~200 words — public, used for the SEO preview
  word_count: number;
  is_free: boolean;
  published_at: string | null;
}

export interface ChapterContent {
  chapter_id: string;
  body: string;             // full markdown — gated by RLS
}
