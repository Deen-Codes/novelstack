# NovelStack — auth email + sign-in setup

Two things, both done in the Supabase dashboard (no rebuild needed for these).

## 1. Brand the sign-in email — and add the code (required)

This step is **required**, not cosmetic: the iPhone app now signs in with the
6-digit code (`{{ .Token }}`), and Supabase's default template only includes
the link, not the code. Sign-in on the app will not work until you paste this.

Supabase dashboard → **Authentication → Emails → Templates → Magic Link** →
paste the markup from `email-templates/magic-link.html` (everything below the
comment block) into the message body. Set the subject to:

> Your NovelStack sign-in code

Do the same for the **Confirm signup** template so first-time sign-ups match.

### The sender still says "Supabase"

That's separate from the body. The "from" address is controlled by SMTP, not
the template. While you're on Supabase's built-in mailer, emails come from
their shared address (and are rate-limited to a few per hour).

To send from your own address (e.g. `hello@novelstack.app`):

Supabase dashboard → **Project Settings → Authentication → SMTP Settings** →
enable custom SMTP. Easiest provider is **Resend** (free tier, owned domain) —
verify `novelstack.app`, create an SMTP credential, paste host/port/user/pass,
and set the sender name to `NovelStack`. After that the email shows as
"NovelStack <hello@novelstack.app>".

## 2. Sign-in checklist (fixes most magic-link failures)

Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL:** `https://novelstack.app`
- **Redirect URLs** — all three must be present:
  - `https://novelstack.app/auth/callback`
  - `https://novelstack.app/**`
  - `novelstack://auth-callback`   ← the mobile app's deep link

Supabase → **Authentication → Sign In / Providers → Email**:

- "Allow new users to sign up" is **on** — this is what makes the magic link
  double as registration. A first-time email gets the same link; tapping it
  creates the account. No separate sign-up screen needed.

## Notes

- The app's primary sign-in is the **6-digit code** — typed in, no deep link,
  no browser. The magic link still works as a fallback for anyone who taps it.
- The code / link is one-time and expires after 60 minutes. Email scanners that
  pre-open links can consume the link — the code is unaffected, so prefer it.
- The mobile `auth-callback` screen (link fallback) retries once automatically
  on a transient network error.
