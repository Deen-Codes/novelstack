// Canonical NovelStack genre taxonomy.
// Values mirror the `story_genre` enum in the database (db/schema.sql +
// db/migrations/003_genres_and_seed_flag.sql) — keep the two in sync.
// Researched against Wattpad, Royal Road, Inkitt and Webnovel: covers the
// categories serialized-fiction readers expect, including the Wattpad-heavy
// werewolf / vampire / paranormal romance niches.

export type Genre = { value: string; label: string };

export const GENRES: Genre[] = [
  { value: 'romance', label: 'Romance' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'scifi', label: 'Science Fiction' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'crime', label: 'Crime' },
  { value: 'horror', label: 'Horror' },
  { value: 'paranormal', label: 'Paranormal' },
  { value: 'werewolf', label: 'Werewolf' },
  { value: 'vampire', label: 'Vampire' },
  { value: 'young_adult', label: 'Young Adult' },
  { value: 'teen_fiction', label: 'Teen Fiction' },
  { value: 'contemporary', label: 'Contemporary' },
  { value: 'historical', label: 'Historical Fiction' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'action', label: 'Action' },
  { value: 'dystopian', label: 'Dystopian' },
  { value: 'drama', label: 'Drama' },
  { value: 'lgbtq', label: 'LGBTQ+' },
  { value: 'humor', label: 'Humor' },
  { value: 'fanfiction', label: 'Fanfiction' },
  { value: 'poetry', label: 'Poetry' },
  { value: 'short_story', label: 'Short Story' },
  { value: 'nonfiction', label: 'Non-Fiction' },
  { value: 'other', label: 'Other' },
];

export const GENRE_VALUES = GENRES.map((g) => g.value);

export function genreLabel(value: string): string {
  return GENRES.find((g) => g.value === value)?.label ?? value;
}
