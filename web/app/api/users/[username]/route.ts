import { NextResponse } from 'next/server';
import { getAuthorByUsername } from '@/lib/queries';

// GET /api/users/[username]  — an author profile with their published stories.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  const author = await getAuthorByUsername(username);
  if (!author) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
  return NextResponse.json(author);
}
