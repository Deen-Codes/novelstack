# NovelStack — auth email + sign-in setup

Two things, both done in the Supabase dashboard (no rebuild needed for these).

## 1. Brand the sign-in email (cosmetic)

To use the NovelStack design instead of the plain default:

Supabase dashboard → **Authentication → Emails → Templates → Magic Link** →
paste the markup from `email-templates/magic-link.html` (everything below the
comment block) into the message body. Set the subject to:

> Your NovelStack sign-in link

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

## 2. Redirect URL — THIS is what makes the app magic link work

This is the fix for "the link doesn't sign me in on the app".

For the magic link to come back into the NovelStack app, Supabase has to be
told that `novelstack://auth-callback` is an allowed destination. If it isn't,
Supabase silently ignores it and sends the link to the **Site URL** (the
website) instead — so tapping the email link opens novelstack.app in Safari,
and the app never gets signed in.

Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL:** `https://novelstack.app`
- **Redirect URLs** — all three must be present:
  - `novelstack://auth-callback`   ← **required for the iPhone app**
  - `https://novelstack.app/auth/callback`
  - `https://novelstack.app/**`

Click **Save**. No rebuild needed for this — it takes effect immediately.

Supabase → **Authentication → Sign In / Providers → Email**:

- "Allow new users to sign up" is **on** — this is what makes the magic link
  double as registration. A first-time email gets the same link; tapping it
  creates the account. No separate sign-up screen needed.

## Notes

- The link is one-time and expires after 60 minutes. Email scanners that
  pre-open links can consume it — if a link looks "already used", request a
  fresh one.
- Open the email **on the iPhone itself** and tap the link there, so iOS can
  hand off to the app.
- The mobile `auth-callback` screen retries once automatically on a transient
  network error, and handles both the PKCE (`?code=`) and token (`#`) returns.
