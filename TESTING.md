# NovelStack — Testing Runbook

How to test both apps and what to check. Nothing here has been compiled yet,
so the first run of each app is also its first real build — expect a few fixes.
Paste any error you hit and it can be fixed quickly.

---

## A. Web app — local

```
cd ~/Documents/novelstack/web
npm install
npm run dev          # http://localhost:3000
```

If `npm run dev` fails to compile, that's a real error to fix — send it over.
`npm run build` does a stricter production compile and surfaces type errors.

## B. Web app — Cloudflare Workers runtime (closer to production)

```
cd ~/Documents/novelstack/web
npm run preview      # builds with the OpenNext adapter, serves in the Workers runtime
```

Use this before deploying — it catches anything that works in `next dev` but
breaks on Cloudflare. Full deploy steps are in `DEPLOY.md`.

## C. Mobile — quick test (Expo Go, no Xcode)

```
cd ~/Documents/novelstack/mobile
npm install
npx expo start       # scan the QR with Expo Go on your phone
```

Browsing, reading, search, write, library, profile all work in Expo Go.
**Sign-in will not complete in Expo Go** — the magic-link deep link needs a
real build (next step).

## D. Mobile — dev build on your iPhone (full test incl. auth)

```
cd ~/Documents/novelstack/mobile
npx expo prebuild
npx expo run:ios --device
```

First time: open `ios/novelstack.xcworkspace` in Xcode, set your Apple
Developer **Team** under Signing & Capabilities, then run. Android equivalent
is `npx expo run:android` with Android Studio installed.

---

## Feature checklist

Run through these once each app is up. Tester does the UI/visual judgement;
this list is about whether the function works at all.

### Auth
- [ ] Web: sign in with a magic link → lands back signed in.
- [ ] Web: sign-up captures date of birth; sign out works.
- [ ] Mobile: magic link opens the app and signs you in (dev build only).

### Reading
- [ ] Home feed loads ranked stories with a reason label ("New this week" etc.).
- [ ] Open a story → chapter list shows only published chapters.
- [ ] Free chapter shows full text; a banner-ad placeholder appears.
- [ ] Locked chapter shows the preview + "watch an ad" gate; watching unlocks it.
- [ ] Reader prev/next navigation moves between chapters.
- [ ] Continue-reading appears in Library after reading something.

### Writing
- [ ] Create a story, add a chapter, write text, save draft, publish.
- [ ] Published story appears on your profile and in the feed.
- [ ] Toggle a chapter free/locked.

### Discovery
- [ ] Search by title, by writer name, by genre returns results.
- [ ] Genre filter chips on Home work.

### Library
- [ ] Bookmarked stories, followed writers, continue-reading all show (web).
- [ ] Following list is populated (this was a fixed bug — confirm it's not empty).

### Social / moderation
- [ ] Comment on a chapter; like a comment.
- [ ] Follow / unfollow a writer from their profile.
- [ ] Report a story/chapter/comment/user; block a user.
- [ ] Admin: `/admin/reports` shows the queue (needs `is_admin = true` on your user).

### Monetisation
- [ ] Tip a writer from a story / profile / chapter end → a `tips` row is created.
- [ ] Age-gate: a mature story is hidden until a DOB confirming 18+ is set
      (set DOB in web Settings).

### Mobile-specific
- [ ] Bottom tab bar: Search · Library · Home · Write · Profile.
- [ ] Website on a phone browser shows the same bottom tab bar.

---

## Known stubs (expected — not bugs)

- The "watch an ad" gate is a timer, not a real ad network.
- Banner ads are a placeholder slot.
- No subscription checkout yet (NovelStack+ / Stripe is not built).
- Writer payouts (the pool split) are not built — needs Stripe.

See the latest "what's left" list for the full picture.
