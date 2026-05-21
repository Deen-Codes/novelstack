import { redirect } from 'next/navigation';

// The catalog feed now lives at the homepage (/). /browse is kept only so old
// links and bookmarks still resolve — it forwards to the feed, genre intact.
export default async function Browse({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  const { genre } = await searchParams;
  redirect(genre ? `/?genre=${genre}` : '/');
}
