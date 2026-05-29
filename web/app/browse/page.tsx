import { redirect } from 'next/navigation';

// /browse is retired — the top-bar search affordance replaces the link.
// Genre param survives by routing back to / with the filter; a bare /browse
// hit lands on /search so the user gets a familiar input.
export default async function Browse({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; q?: string }>;
}) {
  const { genre, q } = await searchParams;
  if (q) redirect(`/search?q=${encodeURIComponent(q)}`);
  if (genre) redirect(`/?genre=${encodeURIComponent(genre)}`);
  redirect('/search');
}
