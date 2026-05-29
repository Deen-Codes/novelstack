# NovelStack Aesthetic Research

*Visual register research for the web redesign. Compares premium reading-platform aesthetics, recommends typography pairings, locks layout density + motion philosophy. Output feeds the three HTML mockups in `aesthetic_examples/`.*

---

## 1. What "premium" actually means in this market

The web product NovelStack is trying to be is not a Wattpad clone — that whole genre (Wattpad / Webnovel / Inkitt / Royal Road / Dreame) has settled on a *dense, gamified, illustrated* register that signals "free fanfic for teens" to anyone over 22. The platforms that signal "serious reading destination" are a different cluster: Substack, Medium, NYT Reader, The New Yorker web, Pocket (RIP), Readwise Reader, Linear's blog, Stripe Press, Are.na. These are the references that matter.

What they share, before getting specific:

- A **single accent colour**, used sparingly. Substack's orange (`#FF6719`), Medium's green (`#1A8917`), NYT's almost-no-accent, Stripe Press's deep red, Linear's purple. Never two accents.
- A **serif body** for any reading-length content. Even Linear (a software company) uses serif for its blog body.
- **One typeface for chrome** — not three. Substack uses a custom Söhne-derivative; Medium uses Sohne and Charter; NYT uses NYT Cheltenham + Imperial.
- **Disciplined whitespace.** Margins are wider than feels comfortable when you're building it; this is correct.
- **Almost no motion.** Substack and Medium animate basically nothing. Stripe Press is essentially static. Motion is the *cheap-platform* tell.

---

## 2. Reading-platform specifics (the data)

### Substack — substack.com / a typical newsletter

- **Reader body:** Charter (web font), 21px, line-height 1.5–1.58, max-width ~728px column. Paragraph margin-bottom: 1.5em.
- **Chrome:** Sohne, 14–16px, weights 400/500/700. Logo wordmark in a heavier Sohne.
- **Accent:** Publication colour overrides the default orange — most serious newsletters pick a deep red, deep blue, or stay grey-only.
- **Motion:** None. The like-heart fills on click. That's it.
- **Spacing rhythm:** generous. The article column floats inside a wide page; right sidebar is empty whitespace on desktop unless the author opts into a sidebar widget.
- **The takeaway for us:** Substack is the model for the *Reader* and the *Story page*. The whole site shouldn't be Substack — they have no real Home (their Discover is a card grid that's neither lovable nor distinctive).

### Medium — medium.com

- **Reader body:** Charter (a Bitstream font from 1987), 21px, line-height 1.58, max-width 680px. Paragraph margin-bottom: 2em. Drop-caps on the first paragraph of "Member-only" posts (large, serif, ~5em initial cap).
- **Chrome:** Sohne, 13–16px. Their hover-to-highlight margin annotations float in 13px Sohne.
- **Accent:** That iconic green (`#1A8917`), used for follow buttons and not much else.
- **Motion:** Cards have a 200ms shadow-and-translate hover. Otherwise still.
- **Headings inside posts:** Sohne (their sans), large weight differential against the serif body — visual signal that "this is a section break."
- **The takeaway for us:** The drop-cap on the reader is a low-cost premium signal we should steal for v1. The 21px / 680px / 1.58 spec is the boring-but-correct default — we want similar but tighter (~64-72ch instead of 680px because Newsreader/Charter has different metrics).

### NYTimes Reader (web articles + the dark mode)

- **Reader body:** Imperial (in-house serif, NYT's body workhorse), 18-20px, line-height 1.55–1.6, max-width ~600-630px on articles.
- **Display:** NYT Cheltenham (custom). Hard distinction — the body and the headlines are not on speaking terms.
- **Dark mode:** Background is *not* pure black — `#121212`-ish very-near-black with text in `#E8E8E8` (almost-white, not pure). The dark mode is *quieter* than the light mode, intentionally — fewer affordances visible, the reader is supposed to disappear into the prose.
- **Motion:** Zero. NYT does not animate.
- **The takeaway for us:** Validate that warm-black `#14110F` is correct — NYT uses near-black + dimmed off-white for exactly the same "don't fatigue the reader" reason. Their dark mode also commits — there's no toggle hidden in a settings drawer; it's a top-level switch. We should make our dark/paper toggle equally visible on the reader.

### The New Yorker — newyorker.com

- **Reader body:** Caslon variant (custom), 18px, line-height 1.6, max-width ~640px.
- **Chrome:** Neutraface (a geometric sans), used for nav and bylines. *Heavily* tracked headers (small caps, letter-spacing 0.08em or so) — the brand signature.
- **Accent:** Black + a single editorial red on dropcap glyphs and link hovers.
- **Layout:** Decorative — illustrations are first-class, not afterthoughts. A serious story has a Eustace-Tilley feel.
- **The takeaway for us:** The tracked-caps section header is a real signature move — cheap to ship, signals "we care about typography." Worth adopting for rail titles ("RECOMMENDED FOR YOU" instead of "Recommended for you").

### Pocket (RIP) — getpocket.com archive

- **Reader body:** "Lyon Text" (purchased serif) or Inter, 19px, line-height 1.5, max-width ~700px.
- **Reader chrome:** Toolbar at left edge — font controls, theme toggle, archive, share. The toolbar collapsed away when you started scrolling and reappeared on hover. *This is the move we want for the reader settings drawer.*
- **Dark mode:** `#1B1B1B` background, `#D7D7D7` text — slightly cool, slightly clinical. Less warm than NYT.
- **The takeaway for us:** The auto-hiding edge toolbar is the right pattern for a settings drawer that doesn't intrude on prose.

### Readwise Reader — read.readwise.io

- **Reader body:** User-configurable. Default is Inter at 18-20px, max-width 720px.
- **Chrome:** Inter throughout. They lean *very* sans-serif — Reader is a power-user tool, not an aesthetic statement.
- **Dark mode:** Multiple themes shipped — Dark, Sepia, Cream. The Sepia is the most copyable for us — light tan background with dark warm text.
- **The takeaway for us:** Multi-theme is over-engineering for v1. Two themes (dark + paper) is right. The user-configurable font size + family inside the reader is correct — Readwise nails that.

### Linear's blog — linear.app/blog

- **Body:** Inter Display + a custom serif, ~17px / 1.6, ~650px max.
- **Hero:** Big Inter Display headline, 56-72px, weight 600.
- **Accent:** Their purple, restrained — used on links and one CTA per page.
- **Motion:** Subtle. Headline fades in on load. That's it.
- **The takeaway for us:** Linear's blog is a software company's reading surface — proves that even non-publishers commit to serious typography. Our /writers and /about pages should look this confident.

### Stripe Press — press.stripe.com

- **Body:** A custom serif (Stripe Press Serif). 17-19px, line-height 1.55, max-width ~660px.
- **Hero:** Massive serif title, often 80-120px on desktop. Quiet caption underneath in their sans (Söhne-like).
- **Accent:** Deep red, used only on the book cover renderings.
- **Spacing:** Aggressive whitespace. A book page is mostly empty.
- **Motion:** Hero parallax on the book covers. Otherwise nothing.
- **The takeaway for us:** Stripe Press is the gold standard for *premium book-as-product* presentation. Our story-detail page should adopt that "this object matters" register — big cover, big title, tons of breathing room around it, the description is a small caption beneath rather than a dense block.

### Are.na — are.na

- **Body:** Söhne mono in places, Söhne regular elsewhere. Dense.
- **Layout:** Very tight, almost wireframe. Heavy use of `text-transform: uppercase` and small-caps.
- **Accent:** Black on off-white only. A single bright element on hover.
- **Dark mode:** Surprisingly aggressive — true off-black `#0A0A0A` with bright `#FFFFFF` text.
- **The takeaway for us:** Are.na is a *taste signal* — too cold for the warmth we want, but their commitment to typographic restraint is a useful counterweight to our ember accents. The third mockup (idiosyncratic) borrows from Are.na's confidence without copying its register.

---

## 3. Dark-mode reading platforms specifically

What works in dark/ember versus what feels like cheap-Reddit:

- **NYT Dark:** Works because the contrast is *lower* than the light theme, not higher. Pure-black + pure-white reads as fatiguing — the brain has nothing to settle on. NYT dark is `#121212` + `#E8E8E8`, contrast ratio ~14:1 instead of the 21:1 of pure black/white. We should match — `#14110F` + `#F2EADC` gives us ~13.5:1, in the sweet spot.

- **The Verge (post-redesign):** Tried very saturated colour-on-dark and the result feels Y2K-Geocities — neon yellow Verge logo on dark grey. Cautionary tale. Don't let the ember accent get bright.

- **GitHub dark mode:** Works because the syntax-highlighting colours are *desaturated* against the dark background. Saturated colours on dark = headache. Our `#C8414E` ember is on the right side of this — it's a deep, warm red, not a bright "danger red."

- **Are.na dark / Linear dark:** Commit to the *absence of warmth* — they read as engineering tools. We want warmer than them because we're a reading product.

- **What makes dark feel cheap-Reddit:** (a) bright pure-white text on near-black, (b) saturated link colours, (c) zero accent — all greys, (d) inconsistent surface tones (some panels lighter, some darker, no logic). Our mobile theme already avoids all four; web should preserve that.

**Locked decision for the web (informed by all of the above):** warm near-black background, off-cream text (matches mobile), single deep-ember accent, surfaces step warmer with elevation (not cooler), zero pure-white anywhere.

---

## 4. Typography pairings — three options

Concrete sizes/leadings/families for each, weight defaults for hero/heading/body/caption.

### Pairing 1 — the original spec (Bricolage + Newsreader + Inter)

The pairing already documented in the redesign brief. Conservative, on-brand with mobile (Bricolage is the mobile display), commits to a screen-tuned reading serif.

- **Display (logo, hero, section heads, chapter title):** `Bricolage Grotesque` 600/700/800.
  - Hero: 64-72px, weight 700, line-height 1.05, letter-spacing -0.015em.
  - Section heading: 28-32px, weight 700, line-height 1.15.
  - Rail title: 13px, weight 700, uppercase, letter-spacing 0.08em.
- **Reader body:** `Newsreader` 400/500.
  - Body: 19px, line-height 1.65, max-width 64-72ch.
  - Drop-cap: Bricolage 800, ~3.4em initial cap, ember.
  - Caption: 14px, 1.5.
- **UI / chrome:** `Inter` 400/500/600.
  - Buttons / nav / cards: 14px, weight 500-600.
  - Metadata: 12-13px, weight 400-500.
- **Pairing logic:** Bricolage's tighter spacing and the slight quirk of its `g`/`a` give the chrome personality without being precious. Newsreader is the most-readable open-source body serif for screens, designed by David Jonathan Ross with optical sizes. Inter is the safe pick for UI everywhere.
- **Risk:** Bricolage isn't a *household* typeface — most users have never seen it. Mostly upside, but a fraction of users will read it as "unfamiliar = vaguely off."

### Pairing 2 — the editorial alternative (Söhne / GT America + Source Serif + Inter)

If Bricolage feels too app-y on web, the editorial pivot is to lean harder into the publication register.

- **Display:** `GT America` (commercial) or `Söhne` (commercial). For our open-source path: `Inter Display` weight 700 — it's the same family but with subtly different metrics. Cheaper than buying GT America, gets 85% of the way there.
  - Hero: 56-64px, weight 700, line-height 1.08, letter-spacing -0.01em.
  - Section heading: 24-28px, weight 600, line-height 1.2.
  - Rail title: 12px, weight 600, uppercase, letter-spacing 0.10em (more tracked than pairing 1).
- **Reader body:** `Source Serif 4` (Adobe open-source, currently in the codebase as `Source_Serif_4`) or `Tiempos Text` (commercial). Source Serif is *very* close to Tiempos for the price of zero dollars.
  - Body: 19px, line-height 1.60, max-width 64ch.
  - Drop-cap: same Source Serif at ~4em, weight 700, ember.
  - Caption: 14px italic, 1.5.
- **UI / chrome:** `Inter` (same as pairing 1).
- **Pairing logic:** Inter Display + Source Serif is what the NYT-influenced "trusted publication" register actually looks like in 2026 without paying commercial-font fees. Source Serif is wider and more open than Newsreader — feels more "newspaper" and less "novel."
- **Risk:** A bit anonymous — this is the pairing five other reading platforms also use. Reads as *correct* but doesn't read as *NovelStack*.

### Pairing 3 — the idiosyncratic option (Instrument Serif + Inter / or Fraunces)

The "we have a point of view" pick. Adopts a single distinctive display serif as the brand signature.

- **Display:** `Instrument Serif` (open-source, modern transitional serif by Instrument). Beautiful italic ligatures, sharp brackets, a real face.
  - Hero: 72-96px, weight 400 (Instrument Serif's regular is its money weight), line-height 1.0, letter-spacing -0.02em. Italic for emphasis.
  - Section heading: 32-40px, weight 400, often italic.
  - Rail title: 13px Inter, weight 500, uppercase, letter-spacing 0.08em (chrome stays sans).
- **Reader body:** `Fraunces` (open-source variable serif, also a strong character) at the "normal" optical size and a low SOFT axis value to keep it calm.
  - Body: 19px, line-height 1.65, max-width 68ch. SOFT axis: 30 (gentle). opsz axis: 19 (reading size).
  - Drop-cap: Instrument Serif italic, ~5em, ember.
- **UI / chrome:** `Inter` (same).
- **Alternative reader pair:** Instrument Serif at display + `Lora` or `Newsreader` at body — Instrument Serif body at small sizes gets tight.
- **Pairing logic:** Instrument Serif headlines say "this is an editorial product with taste." Fraunces body has variable axes that let us age the prose subtly (looser SOFT for cosy stories, tighter for thrillers, eventually). A real differentiator that no competitor — including the premium reading sites — has adopted yet.
- **Risk:** Distinctive = polarising. A serif logo wordmark is a commitment. Also: Instrument Serif's italic is gorgeous but at smaller sizes can lose contrast on dark backgrounds. Test before committing.

---

## 5. Layout density — opinion

NovelStack should sit much closer to Substack than to Wattpad. Concrete numbers:

- **Reader column width:** 64-72ch (roughly 600-720px at 19px Newsreader/Source Serif). 64ch = tighter, more "novel page." 72ch = looser, more "Substack post." I recommend **68ch** as the default — splits the difference.
- **Paragraph spacing:** 1.2em margin-bottom inside a chapter (we want continuity), 1.8em between scene breaks (marked with a centred ornament or three asterisks).
- **Vertical rhythm:** 8px baseline grid. All vertical margins are multiples of 8.
- **Section gap on Home:** 64px between rails on desktop, 40px on mobile. Card-to-card gap inside a rail: 16px.
- **Page max-width (non-reader):** 1280-1440px container, content centred. Browse / Library / Search can use wider (cover grids look better wider).
- **Card padding:** 16px (small cards), 20-24px (story cards), 32px (hero spotlight). Mobile reduces by ~25%.
- **Mobile gutters:** 20px page padding (matches the mobile app's `marginHorizontal: 20`). Don't change this.

**The general principle:** if it feels too spacious when you build it, leave it. The dense competitors (Royal Road, Webnovel) read as cheap precisely because they don't leave room. Confidence in spacing is the cheapest premium signal we can ship.

---

## 6. Motion philosophy — ranked options + recommendation

Three viable points of view, ordered from quietest to loudest:

**(a) Maximally still — prose-first.** The only things that move: the live earnings ticker (writer-side), the Home spotlight rotation (slow cross-fade between 3 stories every ~18s), and the chapter spine dot tracking your scroll position. Cover lift-on-hover is `transition: transform 200ms` — that's a default browser interaction, not "motion." Everything else is static. **Reference:** Substack, Stripe Press, NYT, Are.na. **Risk:** Can read as static or unfinished to users coming from Wattpad's chaos. But the right audience reads it as "this respects me."

**(b) Gentle ambient.** All of (a), plus: staggered fade-ins on cards when they enter the viewport (200ms, 50ms stagger, soft easing), slow ember pulses on the home hero halo (4-6s period, 5% opacity swing), tab-switch fades (150ms). No bouncy springs, no parallax, nothing that competes with the prose. **Reference:** Medium, Linear's blog, the Verge tasteful sections. **Risk:** Easy to overshoot into "performative" if you keep adding "just one more" ambient touch.

**(c) Performative.** All of (b), plus: a real landing-page hero animation (text reveal, parallax book covers, maybe a Lottie illustration), scroll-triggered reveals on marketing pages, a more pronounced spotlight transition with motion blur. **Reference:** Apple product pages, Linear's product marketing (not their blog), Notion landing. **Risk:** This is what the *current* novelstack.app landing page already does (`ns-hero` + `ns-reveal` classes in globals.css). It's competent but it makes the homepage feel like a marketing site rather than a reading destination — and the locked v1 spec says the homepage is the bookshop, not the pitch deck.

**Recommendation: (b) — gentle ambient.** It matches the mobile app's existing motion language (staggered fade-ins, slow ambient halos, no springs) and the premium reading-platform precedent. Reserve (c) only for `/writers` and `/about` — those pages are *selling*, so a little more motion is justified.

---

## 7. Hero / landing-page register

The home page is *not* a marketing landing. Per the locked v1 spec, every visitor lands in the bookshop. That means the "hero" of `/` is the rotating spotlight, not a pitch.

But there *are* marketing pages: `/writers`, `/about`, `/plus`. For those, the question is: what does "a serious reading platform" look like on a hero that's NOT a feed?

- **Stripe Press model:** massive serif title, tiny caption underneath, one product image. Total still. The page does not move when you load it. *Use this for `/plus`.*
- **Linear blog model:** a confident sans hero, one CTA, scroll-revealed sections of mostly text below. *Use this for `/about`.*
- **Substack publication-home model:** publication name in display, byline below, then the feed of posts. *Use this for `/u/[username]` — author profiles.*
- **NYT Magazine cover model:** illustrated, editorial, with the title as art. Out of scope unless we commission illustration; would be ideal for editorial collections later.

The thing all four share: **the hero is a single still composition.** No "watch the typing animation finish before you can scroll" energy. We respect that the reader is here to read.

---

## 8. The three mockups

The HTML files in `aesthetic_examples/` map to:

- `example_1_editorial_serious.html` → Pairing 2 (Inter Display + Source Serif + Inter). The Substack/NYT register. Motion: (a) maximally still. Layout: Substack-spacious.
- `example_2_app_native.html` → Pairing 1 (Bricolage + Newsreader + Inter). Mirrors mobile 1:1. Motion: (b) gentle ambient. Layout: same density as the mobile app on iPad.
- `example_3_idiosyncratic.html` → Pairing 3 (Instrument Serif + Fraunces + Inter). The "we have a point of view" pick. Motion: (b) gentle, but with a more dramatic spotlight. Layout: editorial magazine-grid on the home.

Each mockup shows the same Home content (three rails of seed stories) plus a stripped Reader preview (one styled chapter excerpt) so you can feel both at once. Standalone HTML, inline CSS, opens in any browser, no build step. 1440px desktop primary view, 480px mobile media query.

---

## 9. What I'd pick if forced

If we had to lock right now without seeing the mockups: **Pairing 1 (Bricolage + Newsreader)** is the safe bet because it ties web to mobile and respects the brand work already done. **Pairing 3 (Instrument Serif)** is the better bet *if* we want web to be a step more editorial than the app — which is defensible because the audiences slightly differ (mobile = engagement / habit, web = discovery + writer studio + reader desktop). **Pairing 2** is the regret-pick — it's correct but it's what everyone else does. I would only choose it if Bricolage on the web genuinely doesn't survive the headline-size stress test.

Make the call after seeing the mockups.
