import { NextRequest, NextResponse } from 'next/server';
import { getCover } from '@/lib/r2';

// GET /api/covers/[key] — streams an uploaded cover image back from R2.
// Serving through the app avoids needing a public R2 bucket domain; the
// long immutable cache header means the CDN/browser only fetches once.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params;

  // Keys are UUID-based filenames we generated — reject anything else so a
  // crafted key can't be used to probe the bucket.
  if (!/^[a-zA-Z0-9-]+\.(jpg|png|webp)$/.test(key)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const cover = await getCover(key);
  if (!cover) return new NextResponse('Not found', { status: 404 });

  return new NextResponse(Buffer.from(cover.body), {
    status: 200,
    headers: {
      'Content-Type': cover.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
