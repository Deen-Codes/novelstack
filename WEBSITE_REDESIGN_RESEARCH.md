# NovelStack Website Redesign — Research

*Working doc for novelstack.app, the web counterpart to the iOS app. Audience: Deen. Scope: structure, opinions, and competitive grounding — not pixel design and not code.*

---

## ⚑ Decisions locked (post-research review)

- **Dark by default everywhere on web.** Paper-mode (`#F5EFE0` / `#EDE4CE` / `#2A2418`) exists only inside `/read/[chapterId]` as the default reading surface, with a dark toggle. No other route uses paper-mode. The ember-halo aesthetic in §4.1 stays — that's a dark surface with a contained ember glow, not a light surface.
- **v1 = full feature parity with the iOS app + the reader as the differentiator.** Every user-visible mobile feature must exist on web. v1 is not "rebrand only" — it's "ship the app on web, dark/ember, reader is THE page." Restyle takes precedence over new affordances on non-reader routes; the reader gets the new affordances (chapter spine, resume ribbon, TTS, settings drawer) in v1.
- **Web NovelStack+ and tipping ship via Stripe in v1.** Parity demands it. Same iOS pricing on the subscription, no advertising of the web price from inside the iOS app. Tipping uses a credit-pack abstraction so a $1 tip doesn't burn 32% on Stripe per-transaction fees.
- **Annotations in v1 are PRIVATE ONLY.** Public margin annotations are a v2 ship — they bring a 10× UGC moderation surface and we don't want to launch that hot.

See §6 for the full v1 / v2 / v3 scope; the original v1 list there has been rewritten to match these decisions.

---

## 0. Premise

The iOS app already does the heavy lifting: dark/ember home with rotating spotlight, immersive reader, story-manage with chapters/details/status, Instagram-style community feed, full earnings dashboard with Stripe Connect, four-tier tipping via Apple IAP, NovelStack+ via RevenueCat, magic-link auth, mature-content gating. The website (`/Users/deen/Documents/novelstack/web/app/`) currently has most of the routes — `/`, `/story/[slug]`, `/read/[chapterId]`, `/write/*`, `/library`, `/earnings`, `/u/[username]`, `/settings`, `/search`, `/signin`, `/payouts/*`, plus the full API surface — but the visual treatment is still in the "warm paper marketing stub" register: white cards, serif headings, signal-red links on cream. The community route currently `redirect()`s to `/`. The reader is a single body-paint with no chrome.

This document is the brief for turning that into a first-class web product. Not a download-the-app funnel. The reader on a phone browser should *actually work* — and ideally be the thing somebody screenshots and sends to a friend.

Brand anchors carry over from `mobile/theme/tokens.ts`:

- **Paper** `#14110F`, **paperSoft** `#1C1714`, **card** `#241E1A`, **cardHi** `#2C2520`
- **Ink** `#F2EADC`, **inkMuted** `#A29685`, **inkFaint** `#6F6459`
- **Signal (ember)** `#C8414E`, **signalDeep** `#8E2C38`, **signalSoft** `#3A2025`
- **Cream** `#F4ECDF` on **creamInk** `#15100E` for primary affordances
- **Paper-mode** (light reading surface) `#F5EFE0` / `#EDE4CE` / `#2A2418`
- Display: Bricolage Grotesque (700/600/800). Body: system stack on mobile, web needs an explicit pick (see §4).

---

## 1. Competitor teardown

For each platform: IA, visual register, one thing they nail, one thing they botch. Claims based on the current public site (visited May 2026) and well-documented patterns from their long histories.

### 1.1 Wattpad — wattpad.com

**IA:** Top nav is `Browse / Community / Write / Download app / Log in / Sign Up`. Signed-out home is a long scrolling marketing landing: hero ("Come for the story. Stay for the connection."), trending carousel, fanfiction carousel, illustrated 18-genre grid, "Your book club, but bigger" pitch, Wattpad Studios success-story rail, "Read. Watch. Obsess." adaptations carousel, two QR-code app-download blocks, big illustrated wave footer. Signed-in home becomes a personalised feed. Reader is a vertical scroll with inline-paragraph comments anchored to a comment count bubble next to each paragraph. Writer dashboard ("My Works") is a separate area at `/myworks` with a per-story stats page (reads/votes/comments over time, demographic donuts). Paid Stories use "Coins" — an in-app currency you buy in packs.

**Visual:** Pastel orange/coral on white, illustrated rounded-corner everything, the brand is "friendly fanfic teen". Heavy use of stock-character illustrations and emojis baked into the marketing copy ("from banter to BREAKUP in two paragraphs 😭").

**Best thing they do:** Inline paragraph comments. Every paragraph has a comment count beside it; tap, see the local thread, react. This is the single most-imitated reading-app feature on Earth and the actual core of their community moat — it converts solo reading into a shared experience.

**Worst thing they do:** Web is treated as a marketing surface for the app. Reading on wattpad.com on a phone browser is actively hostile — sticky "Open in app" interstitial, ad blocks shoved between paragraphs, "you've read N chapters, sign up" gates. Their own web is a download funnel for their app, which is why their search results so often dead-end at "open in app."

### 1.2 Inkitt — inkitt.com

**IA:** `Read / Write / Community / About`. Signed-out home is a giant cover-grid editorial: "Featured stories", "Trending now", per-genre rails. The big story is the Galatea sister-app: Inkitt is the discovery slush-pile, Galatea is the polished paywalled-by-chapter app. Reader on inkitt.com is paginated chapters with a sticky reader chrome (font size, theme, next chapter).

**Visual:** Dark navy + warm pink/peach accents, sans-serif throughout, very glossy "consumer tech" look. Cover-forward, no narrative chrome.

**Best thing:** Data-driven acquisition pipeline. They claim to use reader-behavior signals (read-through, time-on-chapter, drop-off) to pick which stories get promoted into Galatea. This is the only competitor that openly markets a "reading-behavior signal" stack.

**Worst thing:** Opaque "we might pick you for Galatea" author terms have been a long-running point of frustration on r/Inkitt — authors don't know what their data is being used for, contract terms are inconsistent, and the discovery side feels like a feeder to the paid app rather than a destination.

### 1.3 Royal Road — royalroad.com

**IA:** Top nav `Home / Fictions / Forums / Community / Premium / Support / Username`. Home is *information-dense*: "Best Ongoing", "Latest Updates", "Rising Stars", "Trending Forum Threads", weekly contest banners, all above the fold. Story page has a wall of metadata: word count, chapters, last update, followers, favorites, ratings histogram, warning tags, content tags, comment thread. Reader is paginated by chapter, minimal chrome, supports both light and "Mid-night" theme. Writer dashboard has Patreon integration baked in and chapter-scheduling.

**Visual:** Looks like a forum from 2014. Phpbb-era density, blue links, table layouts. Brutally functional.

**Best thing:** **Author-controlled chapter scheduling with Patreon-tier locks.** Writers can publish chapters 5 ahead on Patreon, then auto-release weekly to the free site. This is a *first-class* publishing primitive baked into the system, and it's why Royal Road is the de-facto home for serialised LitRPG/progression fantasy.

**Worst thing:** Discovery for new readers is "Best Rated" → adventure-fantasy slop forever. Mood/theme/style discovery doesn't exist. New readers see the same 30 books they saw last year.

### 1.4 Webnovel — webnovel.com

**IA:** Top nav `Library / Ranking / Original / Translate / Editor's Pick`. Aggressive monetisation: "Power Stones", "Privilege Chapters", "Premium". Story pages push you to buy coin packs. The reader is paginated with an over-engineered toolbar: comment-paragraph (Wattpad-style), translation toggle, "Privilege" tier indicators.

**Visual:** Bright orange accents on white, dense, very Asian-mobile-game UX — multiple competing CTAs per screen, gamified bars and badges everywhere.

**Best thing:** **Translation pipeline as a content multiplier.** Original Chinese web novels are translated in flight by paid translators with a public progress meter. As a *content sourcing* mechanism it's unparalleled.

**Worst thing:** Predatory contracts and a long history of forum complaints about authors signing exclusive rights for years and being unable to take their work elsewhere. Also: the UX layers so many premium-currency CTAs that a free reader bounces in under a minute.

### 1.5 AO3 (Archive of Our Own) — archiveofourown.org

**IA:** A tag-graph with chapters attached. Top nav `Fandoms / Browse / Search / About`. The homepage is a search/browse interface, not a feed. Story page is a single-page reader with a metadata sidebar — *every tag is a link to that tag's index*. No paywalls, no ads, no algorithm.

**Visual:** Unstyled-by-default, intentionally accessible. Default skin is white with red links, the "user skins" feature lets readers fully restyle it. Looks like nothing else on this list.

**Best thing:** **The tag system.** AO3's tagging — `Hurt/Comfort`, `Slow Burn`, `No Beta We Die Like Men`, `Fluff and Angst` — is curated by volunteer tag wranglers who merge synonyms, build relationships between tags, and make filtering surgical. Combined with "exclude tags", you can say "give me everything Sherlock/John, slow-burn, over 50k, complete, *not* canon-divergence." Nobody else gets close.

**Worst thing:** Onboarding is brutal — there's no recommendation surface at all. New readers either know what fandom they want or they bounce. There is no "for you", no editorial, no spotlight. By design, but a real cost.

### 1.6 Tapas — tapas.io

**IA:** Top nav `Comics / Novels / Originals / INK Subscription`. The web product is comics-first; novels are a sibling. Reader is vertical scroll with ad breaks and "unlock next episode with ink" interstitials. Library is a horizontal-shelf bookshelf.

**Visual:** Bright purple-pink accents, illustrated mascots, very webtoon-y. The novels side inherits the comics chrome and feels secondary.

**Best thing:** "**Ink**" — a single virtual currency that works across all creators, lets readers wait-for-free (one episode unlocks per N hours), and gives the platform a clean way to track per-creator revenue without per-creator paywalls. Wait-for-free in particular is a behavioural masterstroke — it converts patience into a habit loop.

**Worst thing:** Novels are second-class citizens. The reader UX, the discovery, the editorial — all of it is comics-shaped. A serialised-novel platform built on the same chassis feels off.

### 1.7 Radish — radishfiction.com

**IA:** Mobile-first to the point that the web property barely exists. radishfiction.com is essentially a landing page + investor narrative; the product is the app. Reader (app) is vertical-scroll chapters, sliced into tiny episodes, with coin-unlock walls every few episodes.

**Visual:** Pink/coral accents, very "Kindle Vella but stricter paywalls". The episode slicing is the brand.

**Best thing:** **Micro-episode pacing.** Radish chapters are intentionally short (often 1000-1500 words) with hard cliffhanger endings. This optimises for read-completion rate and conversion to coin purchase. It is, structurally, a TV episode model applied to serialised fiction.

**Worst thing:** Functionally no web product. They cede SEO, sharing, the desktop-reader audience, the "I read at work" market, and the entire "send my friend a link" social loop. A reader who finds them via Google gets a "download the app" wall.

### 1.8 Dreame — dreame.com

**IA:** Heavy genre rails ("Werewolf", "Billionaire", "Mafia Romance"), aggressive coin-unlock walls, daily check-in rewards.

**Visual:** Hot-pink and gold, cover-forward in a romance-novel paperback sense, slightly chaotic.

**Best thing:** **Genre-niching as identity.** Dreame doesn't pretend to be a general platform — it's romance + paranormal romance + werewolf romance, and the entire UX is tuned for that audience. The trope tags ("alpha CEO", "fated mates") are first-class taxonomy.

**Worst thing:** Quality. Auto-translated MTL content sits next to original work with no labelling. The free-chapters-then-paywall pattern is so steep that the read-through curve drops a cliff at chapter 5.

### 1.9 Kindle Vella (RIP, but instructive) — was at amazon.com/kindle-vella

**IA:** Was bolted onto Amazon's main shop. Discovery was through Amazon's catalog UI; reader was a stripped Kindle web reader. Story page showed "Tokens to unlock", a "Fave" button, and a "Like this episode" button per chapter.

**Visual:** Amazon. Pure utility.

**Best thing:** "**Fave + Like-this-episode**" as two distinct signals — Fave is per-story (subscribe), Like is per-episode (clap). Amazon used the per-episode like to weight a "Top Faved" leaderboard. Two-signal system is a clean idea.

**Worst thing:** Killed in 2025. Amazon could never figure out how Vella related to KDP, Kindle Unlimited, or its own self-pub ecosystem. The product was strategically homeless, and Amazon's "Tokens" currency was meaningfully more expensive than Tapas's Ink for the same word count. Cautionary tale: tokens-per-episode without a strong-enough creator and reader value prop = death spiral.

### 1.10 Substack — substack.com

**IA:** Top nav `Discover / Search / Subscribe / Write`. Home for signed-out users is editorial recommendations. Reader is a long-form article view with the publication's brand colour. Writer dashboard is a separate `/dashboard` with subscriber lists, open rates, revenue. Comments are threaded *per post* and a side-tab.

**Visual:** Off-white, near-monochrome with the publication's accent. Heavy serif body text (a serif "Newsreader" / Substack-custom). Very high typographic polish — they treat text as the brand.

**Best thing:** **Email-as-primary-channel.** Every post is also an email. Readers don't need to come back; the platform delivers. For a serialised-fiction platform this is a *huge* unlock — push notifications work for app users, but email reaches the 80% who never installed.

**Worst thing:** No discovery within a publication. If a reader lands on chapter 12 of your serialised novel via a friend's link, the platform doesn't surface chapters 1-11 in a coherent reading-order navigation. Substack treats every post as standalone.

### 1.11 Medium — medium.com

**IA:** Top nav `Our story / Membership / Write / Sign in`. Signed-in home is a feed of recommended articles. Reader is the famous Medium reader — wide line-height, serif body, minimal chrome, a hover-to-highlight-and-comment interaction where margin comments appear next to highlighted text.

**Visual:** Monochrome with green accent (the iconic Medium-green), Charter serif body type, oversized white space, soft drop shadows. Probably the most-copied reading aesthetic of the last decade.

**Best thing:** **Highlight-to-respond annotations.** A reader highlights a sentence and either (a) responds inline with a comment that anchors to the highlight, or (b) silently bookmarks it as a personal highlight. Other readers see aggregate highlight density on popular paragraphs. This is *exactly* the mechanic AO3/Wattpad's paragraph-comments can't do and AO3 tags can't do — it makes the prose itself the comment surface.

**Worst thing:** Paywall lottery. Whether you can read a given article depends on signed-in status, "metered preview", member-only status, and a confusing partner-program friction layer that varies between articles. Most regular readers can't predict whether the next link will open or wall them.

---

## 2. Innovation opportunities

Where this market does things the same lazy way, and where NovelStack can break.

### 2.1 Reader UX

**(a) Margin-anchored annotations, not bottom-of-chapter comments.** Wattpad has per-paragraph comments behind a bubble. Medium has highlight-to-respond. *Nobody combines them cleanly for serialised fiction.* The NovelStack reader should let a reader highlight a phrase → either drop a private note (their own marginalia) or post a public reply that anchors to that phrase. Other readers see, in the margin gutter, a soft ember dot wherever public annotations cluster — never a number, never a notification, just a density signal. Tap the gutter to expand. This is the *one* feature that justifies "read on the web" as superior to "read in the app" for a desktop reader, because margins exist on web in a way they can't on a 390px phone.

**(b) Leave-and-resume with a 3-line context preview.** Every long-form reader fails the "I closed the tab three days ago, where was I?" test. When a returning reader lands on `/read/[chapterId]`, the page should open positioned at last-read-paragraph with a soft inline ribbon: *"You left here on Tuesday — previous 3 lines: '…and she finally understood. The door was already open. She had been standing in front of it the whole time.'"* Then a "resume" CTA below that scrolls into the next paragraph. Substack doesn't do this. Wattpad doesn't. AO3 can't. This is a 2-day backend job (we already track reading progress in `reads`) and a massive UX moat.

**(c) Paragraph-anchored progress, not a percentage bar.** Every reader on the web shows "67% complete" as a thin line at top. That's pointless — it tells you nothing about *how the story is paced*. Show a tiny vertical chapter spine on the right edge, with each chapter as a notch, the current paragraph as an ember dot, and chapter cliffhangers as small triangles. Glanceable shape of the story. Royal Road readers have asked for this for a decade.

**(d) Dyslexia mode + reading-pace mode as first-class settings.** Open-Dyslexic font, increased letter spacing, paragraph-by-paragraph reveal mode where you press space to dim the previous paragraph. Wattpad has none of this. AO3 lets you skin it but the burden is on the reader. We can ship it from the menu.

**(e) "Read it to me" as a true web feature.** The mobile app does expo-speech with word highlighting. On web, browser SpeechSynthesisAPI gives us the same capability free, and *nobody on this list does this on web*. Substack doesn't. Medium has a half-broken audio-narration that's member-only. We can ship word-highlighted TTS on the public web reader for free, and gate background-playback (the actually-monetisable bit) behind NovelStack+.

### 2.2 Writer studio

**(f) Drop-off heatmap per chapter.** Royal Road shows total reads per chapter. Wattpad shows reads + votes + comments. *Nobody shows you the curve inside a chapter* — where readers stop scrolling, where they bounce, where they re-read. We already have a `reads` table with per-paragraph progress could be added cheaply. Show authors a heatmap overlay on their own chapter: green = readers got through, amber = some dropped, red = a wall. This is the single most actionable analytic a serialised writer could ask for. No competitor ships it.

**(g) Reader-demographic breakdown that's actually useful.** Wattpad shows demographic donuts (age bucket, country). We have `dateOfBirth` and (via IP at read time) approximate region. The interesting cut is *retention by demographic* — "your 18-24 readers retain to chapter 12, your 35+ readers retain to chapter 4" tells a writer something. Nobody does this.

**(h) A/B cliffhanger testing.** Let an author write two versions of a chapter's final paragraph, randomly serve each to 50% of incoming readers for the first 72 hours, then show retention-to-next-chapter for both variants. The author picks the winner; the loser is auto-deleted. This is a "we are a tech company that takes writers seriously" feature. Substack will never build it. Wattpad has the data but not the engineering culture.

### 2.3 Discovery

**(i) Behaviour signal, not click signal.** Wattpad/Tapas/Webnovel rank by reads and votes — which means clickbait covers win. Rank by read-through-rate (`completed_chapters / chapters_started`) within genre. A 500-read story that 80% of readers finish should out-rank a 5000-read story that 5% finish. The schema supports this today.

**(j) Mood-based discovery, not genre-based.** Genres are a 50-year-old bookshop primitive. AO3's tag system is closer to what readers actually want. Add a `mood` axis: *cosy*, *unhinged*, *slow-burn*, *gut-punch*, *hopeful*, *bleak*. Surface "you've been reading slow-burn; here's a gut-punch one-shot for a Sunday afternoon." This pairs with the existing genre taxonomy without replacing it.

**(k) Social-graph weighting baked into the feed.** The web home feed currently calls `getFeed({ genre, query, viewerId })`. The `_reason` field on FeedStory already hints at this. Weight more heavily: stories your follows are *reading right now* (not just publishing), stories two-degree-out readers finished this week, stories that just hit a chapter milestone (a "Chapter 50!" surface). Nobody does the live-reading signal because nobody tracks it in real time — we already write to `reads` per chapter open, so we have the substrate.

### 2.4 Community

**(l) Reader Clubs as a first-class object, not a forum.** AO3 has no community. Wattpad has the messy mash of inline comments + forum + DMs. Royal Road has subforums that nobody under 30 will ever post in. **Reader Clubs** = a story-anchored space (one per published story by default, opt-in to create), with weekly chapter discussion threads auto-created when a chapter publishes, scheduled "buddy reads" (start chapter 1 together on Monday), and theory tags on individual comments (`#prediction`, `#analysis`, `#meme`, `#fan art`). It's a Discord channel that ships with the book. The current community feed (`/community` redirects to `/`) is a posts feed — fine for the home merge, but it doesn't replace per-story rooms.

**(m) Margin-comment digest emails.** Once-a-week, "here are the 5 most-highlighted lines from chapters you've followed this week + the funniest annotation on each." Substack-style email loop without Substack-style "every post is its own email" fatigue.

### 2.5 Payments / transparency

**(n) Real-time earnings ticker — the author sees the dollar move.** The mobile earnings screen and `/earnings` show a balance and a list of monthly statements. *What if it ticked up live?* A reader finishes a chapter → +$0.003 ad-pool share lands in the author's "today" counter visibly. This is what Twitch did to streamers and it changed creator behaviour at the engagement level. Substack's dashboard updates daily. We already simulate this via `simulate-earnings` for the test account.

**(o) Per-paragraph tip jar.** Tipping currently sits as a button on the story page (`TipButton.tsx`). What if a reader, finishing a particularly devastating paragraph, could tap-and-tip on the line itself — "this line was worth a dollar to me"? The tip becomes a sentence-anchored signal the author sees on the chapter heatmap. Wattpad's coins go to the work; ours could go to *the moment*. (Web-only: iOS sandboxing means this has to be a different payment rail than Apple IAP — see §5.)

**(p) Reader-facing transparency.** When a reader tips, show them where it goes: "$2.00 → $1.40 to the author after Stripe + platform fee". Substack doesn't do this. Wattpad actively obscures it. Trust compounds.

### 2.6 Mobile-first web

**(q) The reader on iPhone Safari has to actually be the product.** Wattpad's web on mobile is a download interstitial. NovelStack web on mobile should *be* the product. Same chrome, same gestures (swipe-to-next-chapter via touch events), same TTS, same annotations — minus the things iOS truly owns (push, IAP, offline R2 caching). A reader who lands on a story link from Twitter on their phone should think *"oh this is nice"* and read three chapters before the app prompt ever surfaces.

**(r) PWA install, not App Store interstitial.** Add a manifest, install prompt, offline-cached recently-read chapters via service worker. Substack does this; Wattpad refuses to.

---

## 3. Sitemap + page-by-page brief

Routes that already exist are marked *(exists)* — those need redesign work, not new infrastructure. New routes are marked *(new)*.

### 3.1 Public / discovery

- **`/` Home** *(exists)* — Currently a feed list with sidebar + saved/writing/following views. **New intent:** the signed-out version is a rotating ember-lit spotlight (mirrors the mobile home's animated hero), then four rails: *Continue reading* (signed-in), *Trending now* (read-through-rate weighted, not raw reads), *From writers you follow*, *Mood for tonight* (the new mood facet). Genre chips collapse into a "more" filter. The sidebar stays as a desktop power-user surface but is hidden by default behind a hamburger. **Beats:** Wattpad's landing-as-marketing approach is wrong for us — every visitor should land *in the bookshop*, not in a pitch deck. Substack-style "Discover" tab is closer.

- **`/browse` Browse** *(exists)* — Currently a genre-filterable list. **New intent:** the heavy-duty filterer. Genre + mood + length (one-shot / novelette / novella / novel) + status (ongoing / complete) + completeness (under 5 chapters / 5-20 / 20+) + maturity. Multi-select tag chips inspired by AO3. This is where power readers live. Keep it server-rendered for SEO.

- **`/search` Search** *(exists)* — Title / author / tag fuzzy search. Already serviceable. Add a "search inside chapters" mode behind a NovelStack+ pill (full-text search is expensive enough to gate).

- **`/story/[slug]` Story page** *(exists)* — Cover, title, author, description, chapter list, tip button, save, report. **Redesign intent:** Mirror the mobile story-detail's tabbed sections (Cover / Status / Access / Details). Surface read-through-rate as the headline social proof (not "1.2M reads"). Surface review aggregate (5-star, already shipped). Add a "Reader Club" entry point. Add a "tip the story" CTA. Keep the JSON-LD Book metadata for SEO.

- **`/read/[chapterId]` Reader** *(exists)* — Currently a body-paint with prev/next, comments, ad slot, report. **Redesign intent: this is the page.** Paper-mode by default (the `paperMode` palette from tokens), centred 64-72ch column, generous line-height, Bricolage for chapter title only. Right-edge chapter spine (§2.1c). Margin gutter for annotations (§2.1a). "Resume" ribbon (§2.1b). TTS button (§2.1e). Settings drawer (font size, font face, theme toggle dark↔paper, dyslexia mode, paragraph-reveal mode). Inline tip-this-line affordance (§2.5o). Bottom: ad slot for non-+ readers, a "Continue to Chapter N+1" cream button, an "All caught up" celebration when at the last published chapter (mirror mobile), a comments section + an annotations section (separate tabs, not piled together).

- **`/u/[username]` Author profile** *(exists)* — Avatar, bio, stats, stories. **Redesign intent:** Instagram-card-top (mirror mobile ProfileSheet), then their stories as a 3-col cover grid, then their most-recent community posts inline, then a "Follow" cream→ember toggle. Add a "Tip the author" affordance distinct from per-story tips.

- **`/clubs/[storyId]` Reader Club** *(new)* — One per story (auto-created on first publish). Weekly chapter-thread layout: each published chapter has its own thread, posts in the thread anchor to chapter+paragraph. Buddy-read scheduler ("starting chapter 1 on June 3 at 7pm — 14 readers signed up"). This is the new community primitive; the home community feed is the *aggregation* of activity from all clubs a reader is in.

### 3.2 Authenticated reader surfaces

- **`/library` Library** *(exists)* — Currently shows saved + in-progress books. **Redesign intent:** Mirror the mobile "In progress / Completed" pill tabs. Add a third tab: **Annotations** — every highlight + private note a reader has made, searchable. This is a "your second brain for fiction" surface that no competitor has.

- **`/notifications` Notifications** *(new — the API exists at `/api/notifications`)* — Web doesn't have a page for these yet; the API does. New chapters from follows, replies to your annotations, tips received, NovelStack+ pool drops. Group by day.

- **`/settings` Settings** *(exists)* — Edit profile, NovelStack+ status, blocked users, sign out. Add: reading defaults (default theme, default font, default TTS voice), notification preferences (per-author "alert me on new chapters"), email digest cadence, account deletion (App Store blocker — already shipped mobile, mirror here).

### 3.3 Writer studio

- **`/write` Write home** *(exists)* — 3-col cover grid of own stories + start-new. Fine. Wrap the start-new in the 3-step immersive flow (title → genre → description) that mirrors mobile (task #223).

- **`/write/[storyId]` Story manage** *(exists)* — Cover/Status/Access/Details/Chapters. Already structured. **Add:** the analytics tab — drop-off heatmap (§2.2f), demographic retention (§2.2g), and A/B cliffhanger lab (§2.2h, gated behind NovelStack+ for writers since it costs us inference / data work).

- **`/write/[storyId]/chapter/[chapterId]` Chapter editor** *(exists)* — Already a WYSIWYG. Add: scheduled-publish (publish-at timestamp), Royal Road–style "patrons read this 5 chapters ahead" lock equivalent for NovelStack+ subscribers (this is a real, ship-now monetisation lever for writers).

- **`/earnings` Earnings dashboard** *(exists)* — Available balance, monthly statements, Stripe Connect setup. **Redesign intent:** Add the live ticker (§2.5n). Add a "where your money came from" breakdown — tips vs. NovelStack+ pool vs. ad share, per-story. Add a "what readers tipped on" list — the per-paragraph tip events become a feed.

- **`/payouts/done` and `/payouts/refresh`** *(exists)* — Stripe Connect callbacks. Keep, restyle to the dark/ember theme (currently feels generic).

### 3.4 Auth

- **`/signin` Sign in** *(exists)* — Magic-link request. Already modernised. Restyle dark/ember.

### 3.5 Static / legal / marketing

- **`/about` About** *(new)* — One real page explaining the platform's economics. The 70/30 pool model. Why NovelStack+ exists. Why tips go through Stripe and what the cut is. **This is a moat** — Wattpad hides this, we put it on a single page and link it from every payment surface.

- **`/writers` For writers** *(new)* — A *real* marketing surface for the writer pitch, separate from the reader home. Earnings calculator (paste your follower count → see what the pool model would have paid you last month), feature breakdown (chapter scheduling, analytics, A/B lab, NovelStack+ early-access tier), success stories once we have any. This page is allowed to be marketing-shaped — it's selling.

- **`/plus` NovelStack+** *(new)* — The subscription pitch on web. Critical question: can a non-iOS user *subscribe* on web via Stripe? See §5 risk. If yes, this is the page; if no, this page links out to the App Store.

- **`/privacy`, `/terms`, `/support`** *(exist)* — Keep, restyle.

- **`/admin/*`** *(exists)* — Internal payout + reports admin. Out of redesign scope; functional only.

### 3.6 SEO / infra

- **`/sitemap.xml`, `/robots.txt`** *(exist)* — Already wired. Add `/clubs/*` once shipped.

- **Per-story RSS feed** *(new)* — `/story/[slug]/rss.xml`. Substack ate the world partly on RSS. Letting readers subscribe to a serialised story via RSS is a *huge* "we respect the open web" signal that costs us nothing.

---

## 4. Visual direction

### 4.1 Palette extension for web

The mobile tokens are tuned for ~390px phone surfaces. Web has larger canvases, more dead space, and a desktop reader expectation. Concrete extensions:

- **Paper** stays `#14110F` as the base body. On marketing surfaces and writer-dashboard wide areas, add a subtle radial halo (centred top, ember-tinted, ~8% opacity max) — the same "contained halo" aesthetic as the app icon/splash. On the reader, *do not use* — paper-mode takes over there.

- **Surfaces:** add one more step for web's bigger cards. `paperSoft` `#1C1714` → `card` `#241E1A` → `cardHi` `#2C2520` → **new: cardWeb** `#34291F` for headline cards on writer dashboards / earnings hero (mobile doesn't need this rung; web does, to break monotony on a 1440px canvas).

- **Borders:** keep `borderSoft #332B25` and `border #3F352D`. Add a **divider** at `#221C18` (slightly above paper) for hairline rules inside cards on web — the existing borders feel too heavy when used as inter-row dividers in a wide table.

- **Ember accent stays the only accent.** Resist any temptation to introduce a second colour (no "primary blue", no "success green"). Status states use ink-muted (neutral), ember (action / live), and a single warm amber `#E6A04A` for "warning" / "needs attention" on the writer dashboard only.

- **Paper-mode** stays exactly as in tokens — `#F5EFE0` / `#EDE4CE` / `#2A2418`. This is the *only* light surface on the entire web app. It belongs to the reader. Do not introduce a light mode for the rest of the site; the brand is dark.

- **Cream affordance** `#F4ECDF` on `creamInk #15100E` for *primary* CTAs only. On web, this means: "Read now", "Continue reading", "Publish chapter", "Get paid", "Subscribe". Secondary actions are ember-outline. Tertiary is ink-on-paper.

### 4.2 Typography stack

Mobile uses Bricolage Grotesque for display + system for body. Web needs to be more deliberate because the system font on Windows Chrome (Arial) is genuinely ugly.

**Display:** `'Bricolage Grotesque', system-ui, sans-serif` — weights 600/700/800, used for logo, page titles, hero, chapter titles, section headings only.

**Body / UI:** `-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', system-ui, sans-serif` — for buttons, cards, navigation, metadata. The explicit Inter fallback gives Windows users a real font without shipping a 300KB webfont for chrome.

**Reader body:** `'Newsreader', 'Charter', 'Iowan Old Style', Georgia, serif` — a true reading serif. Newsreader is open-source (Google Fonts), designed for screens, has optical sizes. This is the *one* webfont we should pay the load cost for; the reader is the product. Line-height 1.65, max-width 64ch on desktop, 92ch on tablet portrait, full-bleed-minus-gutter on phone, font-size 18px default with reader-controlled +/- two steps.

**Monospace (chapter editor inline code, earnings ledger numbers):** `'JetBrains Mono', 'SF Mono', Menlo, monospace`.

### 4.3 Component patterns

- **Cards:** dark `card` surface, `borderSoft` 1px, 12-16px radius depending on size. No drop shadows on dark — use the next-rung-up surface (`cardHi`) for elevation instead. Cover-forward story cards have the cover bleed to the card edge on three sides (mirror mobile's existing pattern in `Cover` component).

- **Lists:** the home feed's current flex-row layout (cover + title + author + reads) is good. Keep it, but make the cover lift-on-hover do an actual ember glow (`box-shadow: 0 0 32px -8px var(--signal-soft)`) instead of just translate-y.

- **Reading surface:** see §4.2 reader body. The frame around the reading column on desktop is paper-mode bg, the rest of the viewport stays dark — a "spotlight on the page" effect. On mobile the whole viewport switches to paper-mode for true immersion.

- **Buttons:** three rungs. Primary cream pill, ember outline secondary, ink-muted ghost tertiary. Pill radius (24px) on cream, 12px on secondary, 0 padding on ghost. Mirror exactly what mobile does — there's already an established pattern.

- **Forms:** inputs are paperSoft-on-paper with a 1px borderSoft, focus state is a 2px signal-soft outline (not a thick ember bar — keep the brand restrained).

### 4.4 Motion

Mobile has a strong motion language already — staggered fade-ins on every focus, typewriter on writing prompts, wave-in on tab bars. Web should adopt *less* of this, deliberately. Web users don't tab-switch; they scroll. Reserve motion for:

- **Home spotlight rotation** — slow cross-fade between three featured stories, every 6s, with a subtle ember halo pulse. Matches mobile home.
- **Cover hover lift** — translateY(-4px) + ember glow. 200ms ease-out.
- **Chapter spine dot** — current paragraph indicator slides smoothly as the reader scrolls (RAF-throttled).
- **Live earnings ticker** — number rolls when it changes, 400ms.
- **Annotation gutter dots** — fade in as you scroll near them, never animate when off-screen.

No page-transition animations between routes. No scroll-triggered parallax. The reader cannot have *any* motion on the prose itself; the prose is sacred.

### 4.5 Reuse, don't rebuild

The mobile theme tokens (`mobile/theme/tokens.ts`) should be the *source of truth*. Mirror them into `web/app/globals.css` as CSS custom properties (one-to-one mapping — `--color-paper`, `--color-signal`, etc.) and into the existing Tailwind config. When the brand reskins, both surfaces update from one place.

---

## 5. Risks & honest opinions

### 5.1 The iOS IAP / web monetisation collision

**The single biggest strategic question.** Apple takes 30% of in-app purchases. NovelStack+ on iOS is sold via RevenueCat-mediated IAP. Tips on iOS are sold as 4-tier consumable IAPs. On the web, Apple's cut doesn't apply — you could sell NovelStack+ via Stripe for the same price and keep 26% more, or sell it cheaper and undercut your own iOS pricing.

**The trap:** Apple's anti-steering rules used to forbid even *mentioning* a cheaper web price inside the iOS app. Post-Epic-v-Apple this loosened (US: external link entitlement, EU: alternative app marketplaces, etc.) but it's still a minefield. Concretely:

- **If you sell NovelStack+ on web via Stripe**, you can probably charge the same iOS price and pocket the difference, but you must be careful not to *advertise* that path from inside the iOS app.
- **If you sell tips on web via Stripe**, same logic — and tips are arguably cleaner because the per-transaction Stripe fee (2.9% + $0.30) is brutal on $1 tips. May need a "tip credit" buy-once pack model (Tapas Ink, Wattpad Coins) for small tips even on web.
- **My recommendation:** ship web NovelStack+ on Stripe at parity pricing. Defer the per-paragraph tip jar (§2.5o) until you've thought hard about whether you want a "stack credits" abstraction on web, because the Stripe fee on a $1 tip eats 32% of it.

### 5.2 Duplicating the earnings dashboard

The web `/earnings` already exists and is functional. The mobile earnings screen is more visually polished and supports Stripe Connect onboarding in-app via expo-web-browser. **Question:** do we maintain feature-parity dashboards on both surfaces (cost: every analytic gets built twice) or do we let web be the *deep* analytics dashboard (heatmaps, A/B lab, demographic cuts) and let mobile stay the at-a-glance "what's my balance, when's payout"?

**My recommendation:** the writer studio is a web-primary surface. Mobile shows the balance and recent earnings; web is where writers go to *work*. This is consistent with how every other creator platform has settled (Substack, YouTube Studio, Spotify for Artists — all are web-primary studios with mobile companion apps).

### 5.3 The annotation layer is a moderation problem

If we ship margin annotations (§2.1a), we have a *new* user-generated-content surface to moderate. Right now, comments and reviews go through the existing report flow. Annotations would multiply UGC volume by ~10x (a chapter might have dozens of annotated lines vs. a couple of comments) and they live *inside the prose* — a public annotation saying something vile attached to a sensitive paragraph is a much worse experience than the same comment in a thread at the bottom.

**Mitigation options, ranked:**
1. Launch annotations as **private only** for v1. Readers can highlight + note for themselves. Public annotations come in v2 once we have annotation-specific moderation tooling.
2. Launch public annotations but only visible to the **author** and to **mutual follows**. Friction = trust = lower moderation surface.
3. Launch fully public with first-comment-anywhere requires-account-age-7-days throttling.

Option 1 is the right v1 ship. It's also the more useful feature for most readers — *personal marginalia* is what Kindle highlights nailed.

### 5.4 The Reader Club is a bet

Reader Clubs (§2.4l, route `/clubs/[storyId]`) are a substantial product surface — comments wrangling, scheduled events, anchored discussions. There's a real risk that we ship the infrastructure and clubs sit empty because no story has enough readers to populate them. **Mitigation:** auto-create clubs only when a story crosses a read threshold (e.g. 500 unique readers). Until then, the story's "community" is just the comments at the bottom of each chapter — like every competitor. This avoids the "ghost-town forum" problem.

### 5.5 SEO vs. soft-paywall tension

The current `/story/[slug]` and `/read/[chapterId]` are server-rendered and indexable, with metadata + JSON-LD for SEO (this is good and already done). The `_reason` excerpt for locked chapters lets Google show *something* in search results without giving away paid content. If we bolt on more aggressive monetisation (paragraph tips, scheduled-publish, NovelStack+ early access), we risk killing the SEO win — Google will either index empty stub pages or wall the bot.

**Stay disciplined:** the first N chapters of every story are *always* free and *always* fully indexable. Paywall the tail, never the head. This is what Substack does well and Webnovel does poorly.

### 5.6 The Bricolage webfont budget

Bricolage Grotesque is 4 weights × subset = ~80KB if we ship 600/700/800 and a light. Newsreader for the reader is another ~40KB per weight. Total webfont budget could land at ~200KB unsubsetted. **Mitigation:** use `font-display: swap`, ship a system-font fallback that's metric-compatible (Inter pairs reasonably with Bricolage), preload only the display weight that the above-the-fold uses on each route. Don't ship Newsreader on routes that aren't the reader.

### 5.7 PWA installability competes with App Store

If we ship a great PWA (§2.6r), there is a small but real risk that we cannibalise iOS installs — which matters because the iOS app is where IAP monetisation works. **Counter-argument:** every reader who installs the PWA is one we *also* have on the website, where Stripe monetisation works fine and our take rate is higher. PWA users are net positive on revenue if we're confident about web NovelStack+.

### 5.8 What we're choosing not to build

Things competitors do that we should explicitly *not* copy:
- **Coins / virtual currency.** Tapas Ink, Wattpad Coins, Webnovel SS — these obscure pricing and feel scammy. We have direct tipping. Keep it that way.
- **Daily check-in rewards.** Dreame and Webnovel both do this. It's a manipulative engagement hack. We're not running a slot machine; we're running a reading platform.
- **AI-translation pipeline.** Webnovel's strength is also its weakness (low-quality MTL slop). We are a writer-first platform; MTL devalues writers.
- **A general-purpose forum.** Royal Road's forum is a relic. Reader Clubs are story-anchored and time-bounded; that's the modern shape of literary community.

---

## 6. What ships first

The shape of v1 / v2 / v3. v1 is the parity ship — the iOS app on web, dark/ember, reader as the page.

**v1 — Parity rebrand + Reader as THE page (task #248):**
- Dark/ember palette across **all** web routes; CSS custom properties mirrored 1:1 from `mobile/theme/tokens.ts` into `web/app/globals.css`
- Home rebuilt: rotating ember spotlight + four rails (Continue / Trending by read-through-rate / From follows / Mood tonight)
- Story page with tabbed sections (Cover / Status / Access / Details), read-through-rate as the headline metric
- Reader: paper-mode default with dark toggle, 64-72ch centred column, right-edge chapter spine, "You left here on Tuesday" resume ribbon with 3-line preview, TTS via `SpeechSynthesisAPI` with word-highlight, settings drawer (font size, font face, theme, dyslexia mode)
- Library: In-progress / Completed / Annotations (PRIVATE-ONLY in v1)
- Full Writer flow + Story manage + Chapter editor (WYSIWYG), all dark/ember restyled
- Earnings dashboard + Stripe Connect onboarding, dark/ember
- Profile + public `/u/[username]`, Settings, Blocks, Mature gating
- Search + Browse with mood + genre filters
- Community feed (Instagram-style, mirror mobile)
- Reviews + Reports flow
- **Web NovelStack+ via Stripe** at iOS parity pricing (do not advertise from inside the iOS app)
- **Tipping via Stripe with credit-pack abstraction** (avoid the 32% fee drain on $1 tips)
- `/about` with real economics (70/30 pool, link from every payment surface)
- `/writers` marketing page with earnings calculator
- `/plus` subscription pitch

**v2 — Differentiators (post-launch):**
- Public margin annotations (mutual-follows visibility tier first, then full public with moderation tooling)
- Drop-off heatmap per chapter (writer analytics)
- A/B cliffhanger lab (writer NovelStack+ gated)
- Mood-based discovery as a real recommendation surface, not just filter chips
- Scheduled-publish + NovelStack+ early-access tier (mirrors Royal Road / Patreon)
- Live earnings ticker (writer-side)
- Per-story RSS at `/story/[slug]/rss.xml`
- PWA install + offline-cached recently-read chapters
- Behaviour-signal discovery weighting (read-through-rate over raw reads in ranking)

**v3 — Moonshots:**
- Reader Clubs (auto-create when story crosses 500 unique readers)
- Per-paragraph tip jar (anchored to a sentence, requires credit-pack abstraction from v1)
- Public annotations with full moderation tooling
- Reader-demographic retention analytics (writer-side)
- Highlight-density gutter signal (Medium-style, but only after annotations are public)

---

*— end —*
