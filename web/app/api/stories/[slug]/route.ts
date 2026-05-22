import { NextResponse } from 'next/server';
import { getStoryBySlug } from '@/lib/queries';

// GET /api/stories/[slug]  — one story with its author and chapter list.
export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) return NextResponse.json({ error: 'Story not found.' }, { status: 404 });
  return NextResponse.json(story);
}
