'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

// Magic-link sign in — no passwords. Sign up and sign in are one flow.
// We only ask for an email; the username is auto-generated and date of
// birth is collected later (in Settings), only if it's missing.
export default function SignIn() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function sendLink() {
    if (!email) return;
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  return (
    <main className="max-w-sm mx-auto px-6 py-32">
      <Link href="/" className="text-[22px] font-medium tracking-tight">
        novelstack<span className="text-signal">.</span>
      </Link>

      {sent ? (
        <div className="mt-10">
          <h1 className="font-serif text-2xl font-medium">Check your email</h1>
          <p className="text-ink-muted text-[14px] mt-2">
            We sent a sign-in link to {email}. Tap it and you're in.
          </p>
        </div>
      ) : (
        <div className="mt-10">
          <h1 className="font-serif text-2xl font-medium">Sign in to NovelStack</h1>
          <p className="text-ink-muted text-[14px] mt-2 mb-5">
            No password. We email you a one-time link.
          </p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full border border-border-soft rounded-lg px-3.5 py-2.5 text-[15px] bg-white"
          />
          {error && <p className="text-[13px] text-signal mt-2">{error}</p>}
          <button
            onClick={sendLink}
            disabled={loading}
            className="w-full mt-3 bg-signal text-paper py-2.5 rounded-full font-medium text-sm disabled:opacity-60"
          >
            {loading ? 'Sending…' : 'Email me a link'}
          </button>
          <p className="text-[12px] text-ink-faint mt-4">
            New here? You'll get a username automatically — change it any time in
            Settings. Mature stories stay hidden until you add your date of birth.
          </p>
        </div>
      )}
    </main>
  );
}
