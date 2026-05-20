# NovelStack — Deploying the web app to novelstack.app

Host: **Vercel** (free Hobby tier is fine for testing; Pro $20/mo is required
once the app is live and commercial). Domain: **novelstack.app**, registered
at Cloudflare. ~20 minutes.

The web app code is already production-ready — the domain is hardcoded where
it needs to be, and sign-in/auth use the dynamic request origin, so nothing
in the code needs changing to deploy.

## 1. Push the latest code to GitHub

```
cd ~/Documents/novelstack
git add -A
git commit -m "Mobile de-stub + deploy prep"
git push
```

Repo: https://github.com/Deen-Codes/novelstack

## 2. Import the project into Vercel

1. Go to https://vercel.com → sign in with GitHub.
2. **Add New… → Project** → import the `novelstack` repo.
3. **Root Directory** — click *Edit* and set it to `web`. This is essential —
   the repo holds both `web/` and `mobile/`, and Vercel must build only `web/`.
4. Framework Preset auto-detects as **Next.js**. Leave build settings default.

## 3. Add environment variables

In the import screen (or Project → Settings → Environment Variables) add the
same two values that are in `web/.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Apply them to Production, Preview and Development.

## 4. Deploy

Hit **Deploy**. Vercel runs `npm run build` on its servers — this is the first
real compile of the web app, so the first attempt or two may fail on
TypeScript errors. That is expected. Copy the error out of the Vercel build
log and send it over — there's a likely-errors guide in `BUILD_AND_RUN.md`,
and most are one-line fixes.

Once it builds, you get a live `*.vercel.app` URL. Test there before wiring
the domain.

## 5. Add the custom domain in Vercel

Project → **Settings → Domains** → add both:

- `novelstack.app`
- `www.novelstack.app`

Vercel will display the exact DNS records to create. They are normally:

| Type  | Name | Value                  |
|-------|------|------------------------|
| A     | `@`  | `76.76.21.21`          |
| CNAME | `www`| `cname.vercel-dns.com` |

(Use whatever Vercel actually shows — it can change.)

## 6. Add those records in Cloudflare DNS

In the Cloudflare dashboard → `novelstack.app` → **DNS → Records**, add the
records from step 5.

**Critical gotcha:** set each of those records to **DNS only** — click the
orange cloud so it turns **grey**. If Cloudflare proxies (orange cloud) a
domain that Vercel is also terminating SSL for, you get SSL errors and
redirect loops. Vercel handles the CDN and certificate itself; Cloudflare
just needs to point at it.

SSL provisioning on Vercel takes a few minutes after the records resolve.

## 7. Point Supabase auth at the live domain

Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL:** `https://novelstack.app`
- **Redirect URLs** — add:
  - `https://novelstack.app/auth/callback`
  - `https://novelstack.app/**`
  - `novelstack://auth-callback`  ← keep this one for the mobile app

Without this, magic-link sign-in will fail on the live site.

## 8. Verify

- Visit `https://novelstack.app` — seeded stories should load.
- Sign in with a magic link — the email link should land back on the site
  signed in.
- Check a story page and `https://novelstack.app/sitemap.xml`.

---

## If you later want to switch to Cloudflare Pages (to save the $20/mo)

Cloudflare Pages allows commercial use for free. The web app uses Next.js App
Router server actions, so it needs the `@cloudflare/next-on-pages` adapter and
the edge runtime — a bit more setup than Vercel. Doable; just ask and I'll
walk through it. Keeping the domain at Cloudflare now means no registrar
migration either way.
