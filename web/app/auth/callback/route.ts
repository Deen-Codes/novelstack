import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Magic-link landing point. Supabase emails a link back here with a `code`;
// we exchange it for a real session, then send the reader on their way.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/browse';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/signin?error=link_expired`);
}
