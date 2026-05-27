import { NextResponse } from 'next/server';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { reviews, stories, users } from '@/db/schema';
import { getSessionUser } from '@/lib/auth';

// Resolves a slug to {id} once — both GET and POST need it.
async function findStoryId(slug: string): Promise<string | null> {
  const [row] = await db
    .select({ id: stories.id })
    .from(stories)
    .where(eq(stories.slug, slug))
    .limit(1);
  return row?.id ?? null;
}

// GET /api/stories/[slug]/reviews
// Returns the review list (newest first) + a summary (avg + count) +
// `myReview` for the signed-in viewer, if any. Public — anyone can browse.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const storyId = await findStoryId(slug);
  if (!storyId) {
    return NextResponse.json({ error: 'Story not found.' }, { status: 404 });
  }

  const viewer = await getSessionUser();

  const [list, summaryRow] = await Promise.all([
    db
      .select({
        id: reviews.id,
        rating: reviews.rating,
        body: reviews.body,
        createdAt: reviews.createdAt,
        updatedAt: reviews.updatedAt,
        user: {
          id: users.id,
          username: users.username,
          displayName: users.displayName,
          avatarUrl: users.avatarUrl,
        },
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .where(eq(reviews.storyId, storyId))
      .orderBy(desc(reviews.createdAt))
      .limit(100),
    db
      .select({
        count: sql<number>`count(*)::int`,
        avg: sql<number | null>`avg(${reviews.rating})::float`,
      })
      .from(reviews)
      .where(eq(reviews.storyId, storyId)),
  ]);

  const summary = {
    count: summaryRow[0]?.count ?? 0,
    avg: summaryRow[0]?.avg ?? null,
  };

  const myReview = viewer
    ? list.find((r) => r.user?.id === viewer.id) ?? null
    : null;

  return NextResponse.json({ reviews: list, summary, myReview });
}

// POST /api/stories/[slug]/reviews  { rating, body }
// Upserts the signed-in reader's review for this story.
export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const viewer = await getSessionUser();
  if (!viewer) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }

  const { slug } = await params;
  const storyId = await findStoryId(slug);
  if (!storyId) {
    return NextResponse.json({ error: 'Story not found.' }, { status: 404 });
  }

  let body: { rating?: number; body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const rating = Math.round(Number(body.rating ?? 0));
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: 'Rating must be between 1 and 5.' },
      { status: 400 },
    );
  }
  const text = String(body.body ?? '').trim().slice(0, 2000);

  // Upsert — one review per (story, user) thanks to the unique index.
  const [row] = await db
    .insert(reviews)
    .values({
      storyId,
      userId: viewer.id,
      rating,
      body: text,
    })
    .onConflictDoUpdate({
      target: [reviews.storyId, reviews.userId],
      set: { rating, body: text, updatedAt: new Date() },
    })
    .returning();

  return NextResponse.json({ review: row });
}

// DELETE /api/stories/[slug]/reviews  — remove the signed-in user's review.
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const viewer = await getSessionUser();
  if (!viewer) {
    return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  }

  const { slug } = await params;
  const storyId = await findStoryId(slug);
  if (!storyId) {
    return NextResponse.json({ error: 'Story not found.' }, { status: 404 });
  }

  await db
    .delete(reviews)
    .where(and(eq(reviews.storyId, storyId), eq(reviews.userId, viewer.id)));

  return NextResponse.json({ ok: true });
}
