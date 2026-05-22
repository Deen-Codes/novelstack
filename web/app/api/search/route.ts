import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { searchStories, isAdult } from '@/lib/queries';

// GET /api/search?q=  — story search.
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  const q = req.nextUrl.searchParams.get('q') ?? '';
  const results = await searchStories(q, isAdult(user?.dateOfBirth));
  return NextResponse.json(results);
}
