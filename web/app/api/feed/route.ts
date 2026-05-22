import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getFeed, isAdult } from '@/lib/queries';

// GET /api/feed?genre=&q=  — discovery feed, personalized when signed in.
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  const genre = req.nextUrl.searchParams.get('genre') ?? undefined;
  const query = req.nextUrl.searchParams.get('q') ?? undefined;

  const feed = await getFeed({
    genre,
    query,
    viewerId: user?.id,
    viewerIsAdult: isAdult(user?.dateOfBirth),
  });
  return NextResponse.json(feed);
}
