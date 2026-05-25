# NovelStack — Deploying the web app to novelstack.app

Host: **Cloudflare Workers** via the **OpenNext** adapter (`@opennextjs/cloudflare`).
Free tier allows commercial use. Domain: **novelstack.app**, already in Cloudflare.

The web app is **Next.js 15 + React 19** with the OpenNext adapter wired in
(`open-next.config.ts`, `wrangler.jsonc`, `next.config.mjs`).

**Status of verification (done in-session):**
- `npx tsc --noEmit` passes clean on the web app — no type errors.
- A clean `npm install` succeeds.
- The only thing left that can only run on your Mac (or Cloudflare's CI) is the
  full `opennextjs-cloudflare build` + the deploy itself.

The deploy needs `wrangler login` — a browser OAuth step that only you can
complete — so the two commands in step 4 have to be run by you. Everything
before and after is set up.

## 1. Push the latest code to GitHub

```
cd ~/Documents/novelstack
git add -A
git commit -m "MVP audit pass, iOS build assets, deploy prep"
git push
```

## 2. Install dependencies

```
cd ~/Documents/novelstack/web
npm install
```

Pulls Next 15, React 19, `@opennextjs/cloudflare` and `wrangler`.

## 3. (Optional) Build + preview locally in the Workers runtime

```
npm run preview
```

Runs `opennextjs-cloudflare build`, then serves the app in the real Cloudflare
Workers runtime locally so you can sanity-check before shipping. `npm run dev`
is still normal Next.js local dev.

## 4. Deploy to Cloudflare — RUN THESE TWO COMMANDS

```
cd ~/Documents/novelstack/web
npx wrangler login      # opens your browser — click "Allow"
npm run deploy          # builds into .open-next/ and ships the Worker
```

You'll get a `novelstack.<your-subdomain>.workers.dev` URL — open it and check
the seeded stories load.

Environment variables: `npm run deploy` builds locally and reads `web/.env.local`
(which has the two `NEXT_PUBLIC_SUPABASE_*` keys). Because they're `NEXT_PUBLIC_`
they're baked in at build time — nothing extra to configure for the CLI deploy.

## 5. Connect the novelstack.app domain

Cloudflare dashboard → **Workers & Pages** → the `novelstack` Worker →
**Settings → Domains & Routes** → **Add → Custom Domain** → add:

- `novelstack.app`
- `www.novelstack.app`

Because the domain is already in your Cloudflare account, DNS configures itself
and SSL is issued within minutes — no manual records.

## 6. Point Supabase auth at the live domain

Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL:** `https://novelstack.app`
- **Redirect URLs** — add:
  - `https://novelstack.app/auth/callback`
  - `https://novelstack.app/**`
  - `novelstack://auth-callback`  ← keep this for the mobile app

## 7. (Optional) Auto-deploy on every push — Workers Builds

In the dashboard, connect the GitHub repo to the Worker so each `git push`
redeploys. Workers & Pages → the `novelstack` Worker → **Settings → Builds →
Connect**. Then set:

- Repository: `Deen-Codes/novelstack`
- Root directory: `web`
- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx wrangler deploy`
- Build variables: add `NEXT_PUBLIC_SUPABASE_URL` and
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` (CI builds don't see your local `.env.local`).
  Values are in `web/.env.local`.

## Verify

- Visit `https://novelstack.app` — seeded stories load (19 stories, 25 genres).
- Sign in with a magic link — the email link lands back signed in.
- Open a story, read a chapter, check `https://novelstack.app/sitemap.xml`.

---

## Notes

- The app is **Next.js 15 / React 19**. The OpenNext adapter supports the
  latest Next 15 minors.
- If `npm run deploy` surfaces a build error, copy it over — type-checking
  already passes, so anything that appears would be an adapter/runtime detail,
  usually a one-liner.
