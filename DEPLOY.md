# NovelStack — Deploying the web app to novelstack.app

Host: **Cloudflare Workers** via the **OpenNext** adapter (`@opennextjs/cloudflare`).
Free tier allows commercial use. Domain: **novelstack.app**, already in Cloudflare.

The web app has been upgraded to **Next.js 15 + React 19** and the OpenNext
adapter is wired in (`open-next.config.ts`, `wrangler.jsonc`, `next.config.mjs`).
~30 minutes for the first deploy.

## 1. Push the latest code to GitHub

```
cd ~/Documents/novelstack
git add -A
git commit -m "Next 15 + Cloudflare adapter, audit fixes, mobile-web"
git push
```

## 2. Install dependencies

```
cd ~/Documents/novelstack/web
npm install
```

This pulls Next 15, React 19, `@opennextjs/cloudflare` and `wrangler`. If a
pinned version 404s, run `npm install @opennextjs/cloudflare@latest -D wrangler@latest`.

## 3. Build + preview locally in the Workers runtime

```
npm run preview
```

This runs `opennextjs-cloudflare build` then serves the app in the actual
Cloudflare Workers runtime locally. **This is the first real compile** — expect
a few TypeScript errors on the first run (the Next 15 upgrade touched many
files). Copy any error and send it over; most are one-liners.

`npm run dev` still works for normal Next.js local development.

## 4. Deploy to Cloudflare

```
npx wrangler login      # opens the browser, authorize the CLI
npm run deploy          # builds + deploys the Worker
```

`npm run deploy` builds into `.open-next/` and ships it. You get a
`novelstack.<your-subdomain>.workers.dev` URL — test there first.

Environment variables: the build reads `web/.env.local` (which exists and has
the two `NEXT_PUBLIC_SUPABASE_*` keys). Because they're `NEXT_PUBLIC_`, they're
baked in at build time — nothing extra to configure for the CLI deploy.

## 5. Connect the novelstack.app domain

Cloudflare dashboard → **Workers & Pages** → the `novelstack` Worker →
**Settings → Domains & Routes** → **Add → Custom Domain** → enter:

- `novelstack.app`
- `www.novelstack.app`

Because the domain is already in your Cloudflare account, DNS configures
itself automatically and SSL is issued within minutes — no manual DNS records,
no proxy/orange-cloud gotcha. This is the payoff for staying inside Cloudflare.

## 6. Point Supabase auth at the live domain

Supabase dashboard → **Authentication → URL Configuration**:

- **Site URL:** `https://novelstack.app`
- **Redirect URLs** — add:
  - `https://novelstack.app/auth/callback`
  - `https://novelstack.app/**`
  - `novelstack://auth-callback`  ← keep this for the mobile app

## 7. (Optional) Auto-deploy on every push

In the dashboard, connect the GitHub repo to the Worker (Workers Builds). Set:
- Build command: `npx opennextjs-cloudflare build`
- Deploy command: `npx opennextjs-cloudflare deploy`
- Root directory: `web`
- Build env vars: add the two `NEXT_PUBLIC_SUPABASE_*` values (CI builds don't
  see your local `.env.local`).

## Verify

- Visit `https://novelstack.app` — seeded stories load.
- Sign in with a magic link — the email link lands back signed in.
- Open a story, read a chapter, check `https://novelstack.app/sitemap.xml`.

---

## Notes

- The app is **Next.js 15 / React 19**. The OpenNext adapter supports the
  latest Next 15 minors; Next 14 support is being dropped, which is why we
  upgraded.
- Nothing here has been compiled yet — the sandbox this was built in can't run
  `npm install`. Step 3 is where real errors surface. `BUILD_AND_RUN.md` has a
  likely-errors guide.
