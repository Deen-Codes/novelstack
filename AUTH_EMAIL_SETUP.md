# NovelStack — auth email + sign-in setup

Two things, both done in the Supabase dashboard (no rebuild needed for these).

## 1. Brand the sign-in email

By default the email body is plain and generic. To use the NovelStack design:

Supabase dashboard → **Authentication → Emails → Templates → Magic Link** →
paste the markup from `email-templates/magic-link.html` (everything below the
comment block) into the message body. Set the subject to:

> Your NovelStack sign-in link

Do the same for the **Confirm signup** template so first-time sign-ups match —
it uses the same `{{ .ConfirmationURL }}` variable, so the file works as-is.

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

- The magic link is one-time and expires after 60 minutes. Email scanners that
  pre-open links can consume it — if a link looks "already used", request a
  fresh one.
- The mobile `auth-callback` screen now retries once automatically on a
  transient network error, so a flaky tap should self-recover.
