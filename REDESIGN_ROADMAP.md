# NovelStack Redesign — Deferred Roadmap

*Companion doc to `WEBSITE_REDESIGN_RESEARCH.md`. This is the parking lot: every feature that is real, intentional, and on-radar — but not in v1.*

---

## Premise

v1 is the parity rebrand: ship the iOS app on web, dark/ember everywhere, paper-mode quarantined to `/read/[chapterId]`, and treat the reader as the page that justifies "read it on the web." Web NovelStack+ and tipping go live via Stripe at parity pricing. Annotations exist but are private-only. Everything else in this document is post-launch — listed here so it doesn't fall through the floorboards once v1 ships and the dopamine wears off. The order in each tier is roughly the order I think they should ship; sequencing notes at the end make the dependencies explicit.

---

## v2 — Differentiators

These are the things that turn "competent serialized-fiction platform" into "the one with the reader nobody else has." Each one is tractable on top of v1 — none require a re-architecture.

### Public margin annotations (private → mutual follows → public)

**What.** Promote the v1 private-only highlight/note mechanic into a public layer. Phase A: a reader can opt a highlight + note as visible to mutual follows. Phase B: fully public, with moderation tooling sitting underneath (report-on-annotation, author mute-this-annotation, density throttling for new accounts).

**Why.** This is the §2.1a feature — the actual reason "read on web" beats "read in the app" on a desktop. Margins exist on web; they don't on a 390px phone. Once it's public, it's also the most viral surface on the platform (Medium's highlights and Genius's annotations both prove the model).

**Complexity.** L. The annotation primitive itself is M (v1 already wrote it for private). Moderation tooling — report queue, mute, density throttle, account-age gating — is the L bit. Don't underestimate it.

**Prereqs from v1.** Private annotations shipped. Reports infrastructure shipped (it is). User block primitive shipped (it is).

**Metric it moves.** Reader engagement (time-on-chapter, return visits per chapter), and the qualitative "did somebody screenshot it and tweet it" loop. Likely also weak retention lift via the social signal.

**Risk.** This is a 10× UGC surface and it lives *inside the prose*. A vile annotation attached to a sensitive paragraph is materially worse UX than the same comment at the bottom of the chapter. Phase A (mutual-follows only) buys time to build the moderation tooling without launching it hot.

---

### Drop-off heatmap per chapter

**What.** A writer-side analytics view that overlays the chapter text with a heat gradient — green where readers got through, amber where some dropped, red where there's a wall. Built on per-paragraph reading progress.

**Why.** This is the §2.2f feature. Royal Road shows reads per chapter. Wattpad shows reads + votes + comments. Nobody shows the curve *inside* a chapter. This is the single most actionable analytic a serialized writer can be given.

**Complexity.** M. The schema needs per-paragraph progress writes (v1 only tracks chapter-level via `reads`). The viz is straightforward once the data is there.

**Prereqs from v1.** v1 ships chapter-level read tracking. v2 extends to per-paragraph — needs a debounced write on scroll, plus a sensible aggregation pipeline (don't store 50k rows per chapter per reader; bucket on read).

**Metric it moves.** Writer retention and writer NPS. Indirectly, story quality — if writers can see the wall, they can rewrite the wall.

**Risk.** Per-paragraph writes can balloon DB cost if you don't bucket. Also: writers reading their heatmap and panicking. Ship with a "this is normal" tooltip and quantile context ("most chapters drop 12% by paragraph 40").

---

### A/B cliffhanger lab

**What.** Writer authors two versions of a chapter's final paragraph. System randomly serves variant A to 50% of incoming readers and variant B to the other 50% for the first 72 hours. After the window, the writer sees retention-to-next-chapter for both variants and picks a winner. Loser is hard-deleted.

**Why.** §2.2h. "We are a tech company that takes writers seriously" feature. Wattpad has the data and not the engineering culture; Substack will never build it. Also a clean upsell for NovelStack+ on the writer side.

**Complexity.** M. The variant storage and rotation logic is small. The fiddly bit is making sure the *same* reader always sees the *same* variant on re-read (sticky on reader ID), and that the "winner picked" event cleanly rewrites history so the loser variant never resurfaces.

**Prereqs from v1.** Chapter editor (shipped). NovelStack+ on web (shipped — this is gated behind it).

**Metric it moves.** ARPU on the writer side (NovelStack+ for writers becomes a real upgrade). Read-through rate at chapter boundaries on stories that use it.

**Risk.** Authors who don't understand A/B testing reading variance as signal. Cap the variants at 2, force a 72h minimum window, show a confidence indicator. Also: a small but real "is this even ethical for fiction" debate — pre-empt it by making the loser delete and never showing it to anyone else after the window.

---

### Mood-based discovery as a real recommendation surface

**What.** v1 ships mood as a filter chip on `/browse`. v2 promotes it to a first-class recommendation surface — the "Mood for tonight" rail on home becomes a real model (e.g. content-based on existing mood tags + collaborative on reader histories), and there's a `/mood/[mood]` route with editorial rotation.

**Why.** §2.3j. Genres are a 50-year-old bookshop primitive. Readers actually navigate by *how they want to feel after reading*. No competitor surfaces this — AO3's tags are the closest and they're a filter, not a recommendation.

**Complexity.** M for the rec model (cold-start is the painful part — bootstrap with editorial tagging by you). S for the route + rail.

**Prereqs from v1.** Mood taxonomy defined and applied (v1 must do this even just for the filter chip, so the data is there). Read history (shipped).

**Metric it moves.** Discovery breadth (stories seen per session), and session length. Should also shift the long tail — small-but-tight stories with strong mood signals get found.

**Risk.** Garbage in, garbage out. If mood tags are author-self-applied without review, every story is "slow-burn hopeful" and the surface is useless. Either author-tag + curator-review, or apply moods centrally from content signals.

---

### Scheduled-publish + NovelStack+ early-access tier

**What.** Author sets a `publish_at` timestamp on a chapter. Optionally also sets a `plus_early_access_until` — chapter is visible to NovelStack+ subscribers immediately, public N days later. Royal Road / Patreon model, native.

**Why.** §3.3, the writer-studio addition. This is the single biggest reason serious serialized writers use Royal Road today. Bake it in and we get the LitRPG / progression-fantasy crowd as a side effect.

**Complexity.** S-M. Scheduling itself is S (cron + a `publish_at` column). The early-access tier is M because it touches the read-gate logic, the chapter-list rendering, the email/notification triggers (do `+` readers get pinged at unlock or at public release? probably both, configurable).

**Prereqs from v1.** NovelStack+ on web (shipped). Chapter editor (shipped). Notifications surface (shipped — there's a `/notifications` API in v1).

**Metric it moves.** NovelStack+ subscriber count (this is a *reason to subscribe* that's not just "ad-free"). Also writer retention — Royal Road keeps writers via this exact mechanic.

**Risk.** Time-zone bugs. Always store UTC, display in user locale, show the writer the resolved publish time in their own zone before confirming. Also: an author scheduling a chapter and forgetting they did, then complaining when it publishes "without warning" — send a 24h-before email reminder.

---

### Live earnings ticker

**What.** The `/earnings` dashboard's "today" counter ticks up in real time as reader events generate earnings. Reader finishes a chapter → ad-pool share lands visibly. Tip received → number rolls.

**Why.** §2.5n. This is what Twitch did to streamers. Visible, immediate, dollar-resolution feedback changes creator behaviour in ways daily-rollup dashboards do not. Substack updates daily; we can update on the second.

**Complexity.** S-M. The data already exists — `simulate-earnings` proves the pipeline. The UI bit is a websocket or SSE channel + a rolling-number component. The fiddly part is rate-limiting so the channel doesn't hammer a writer with 12 events/sec on a popular launch day.

**Prereqs from v1.** Earnings dashboard (shipped). Stripe Connect (shipped). Probably wants a small queue/aggregator so the ticker batches events at ~1s resolution.

**Metric it moves.** Writer session length on `/earnings` (proxy for engagement with the studio), and qualitative: writers screenshot ticking earnings, which is free marketing.

**Risk.** Looks great when there are events; looks dead when there aren't. Show a "today: $0 — your last earning was 3 hours ago" state, not a frozen ticker. Also: don't show the ticker on micro-creator accounts where the visible-zero is demoralising — gate it behind a minimum recent-earnings threshold.

---

### Per-story RSS feed

**What.** `/story/[slug]/rss.xml`. Standard RSS 2.0 with one item per published chapter, item description = the chapter excerpt (or full text for free chapters / locked-summary for paid).

**Why.** §3.6. Substack ate the world partly on RSS. It costs us almost nothing and signals "we respect the open web." Real serialized-fiction readers — the ones who finish stories and tell friends — disproportionately use RSS.

**Complexity.** S. A Next.js route handler, a feed library, done in a day.

**Prereqs from v1.** Story + chapter publishing (shipped). SEO infra including `/sitemap.xml` (shipped — add the feed URL to it).

**Metric it moves.** Marginal on the metric dashboard, large on the "did the platform feel like it respects me" axis. Some retention lift among heavy readers.

**Risk.** Almost none. Make sure paid/locked chapters render as a summary item, not a full-text leak.

---

### PWA install + offline

**What.** Manifest, install prompt, service worker that caches recently-read chapters for offline reading. Background sync for read progress when the device comes back online.

**Why.** §2.6r. Substack does this; Wattpad refuses to. Also: PWA-installed readers are functionally retained at the iOS-app level without going through the App Store funnel.

**Complexity.** M. The manifest and install prompt are S. The service worker doing meaningful caching of chapters + sync of progress is M, and the testing matrix (Safari iOS, Chrome Android, desktop Chrome, Firefox) is the M part.

**Prereqs from v1.** Reader (shipped). Reads/progress API (shipped). Sensible cache-key story on chapter content (probably wants a `content_version` field on `chapters` so cached copies invalidate cleanly on author edit).

**Metric it moves.** Web retention (PWA-installed users return at multiples of unauth web). Indirectly: web NovelStack+ conversion, because installed users monetize.

**Risk.** §5.7 — slight cannibalization of iOS App Store installs, where IAP works. Counter: PWA users are net positive because Stripe take-rate beats Apple. Don't surface the PWA prompt aggressively on iOS Safari for the first 90 days — let people app-install naturally if they want.

---

### Behaviour-signal discovery weighting (read-through-rate over raw reads)

**What.** Rewrite the ranking function on `/`, `/browse`, and trending rails so the primary signal is `completed_chapters / chapters_started` within a genre cohort, not raw read count. 500-read story that 80% finish out-ranks a 5000-read story that 5% finish.

**Why.** §2.3i. Wattpad/Tapas/Webnovel rank by reads and votes; clickbait covers win. We can rank by behaviour because we have the substrate. This is the algorithmic moat.

**Complexity.** M. The data exists. The work is in the ranking function, the cohorting (don't compare one-shots to 50-chapter epics), the freshness decay (new stories need a grace period before read-through stabilizes), and the back-test against a few weeks of v1 data.

**Prereqs from v1.** Chapter-level reads (shipped). Enough live traffic to back-test against — this is why it's v2, not v1.

**Metric it moves.** The thing it's actually for: long-term reader retention, because surfaced stories are higher-quality. Probably a short-term hit to topline session count as the clickbait-cover stories get demoted. Worth it.

**Risk.** Pissing off writers who currently rank well on raw reads. Communicate the change (a `/about` update, a writer-newsletter post), and ship a "ranking explainer" tooltip on the trending rail so a writer can see why their story is or isn't there.

---

## v3 — Moonshots

Speculative. These either depend on v2 work, depend on us having traffic we don't have yet, or carry product risk we shouldn't take pre-PMF.

### Reader Clubs (gated by 500-reader threshold)

**What.** §2.4l + §5.4. One per story, auto-created when the story crosses 500 unique readers. Weekly chapter-discussion threads auto-spawn on chapter publish. Buddy-read scheduler. Theory tags on comments (`#prediction`, `#analysis`, `#meme`, `#fan art`).

**Complexity.** L. New surface, new objects, new moderation surface, real-time presence ("14 readers reading now"). Multi-week build.

**Prereqs.** Public annotations shipped (the conversation pattern is the same). Sustained traffic where 500-reader stories are routine, not exceptional.

**Metric.** Heavy-reader retention (the 5% who carry the platform). Community NPS. Risk-adjusted, not a top-funnel metric.

**Risk.** Ghost-town. The 500-reader gate is what stops this from being v1 — until we have stories that consistently clear it, building this is building a forum nobody posts in.

---

### Per-paragraph tip jar

**What.** §2.5o. Reader taps a paragraph that hit, tips on the *line*. Tip becomes a sentence-anchored signal the author sees on the drop-off heatmap.

**Complexity.** M, conditional on credit-pack abstraction existing.

**Prereqs.** Credit-pack abstraction from v1 tipping (the whole reason it's an abstraction is so a $1 line-tip doesn't burn 32% to Stripe). Drop-off heatmap from v2 (the signal needs a surface).

**Metric.** ARPU on tipping. Qualitatively: the moment-economy thing, which nobody is doing.

**Risk.** Cognitive load on the reader — "should I be tipping every paragraph?" Cap visible affordances (one tappable tip-this-line indicator, only shown after a settle delay on hover/long-press, not always visible). Also App Store steering rules if a reader on the iOS app sees the web tip flow.

---

### Public annotations with full moderation tooling

**What.** v2 ships annotations in two stages (mutual-follows, then cautious public). v3 is the *complete* public surface — full report queue, ML-assisted triage, author mute, account-age throttling, density limits per chapter, the works.

**Complexity.** L. Mostly tooling work, not user-visible product.

**Prereqs.** v2 public annotations live and battle-tested at small scale.

**Metric.** Annotation-creation rate (volume), report-resolution time (operational), and the absence of a major moderation incident (the metric that matters most and the one you only notice when it isn't).

**Risk.** Always the risk with UGC at scale. Don't ship full-public until the queue is real.

---

### Reader-demographic retention analytics

**What.** §2.2g. Writer sees retention by demographic — "your 18-24 readers retain to chapter 12, your 35+ readers retain to chapter 4."

**Complexity.** M. Data exists (`dateOfBirth` plus IP-region). The work is cohort-cut UI and making the privacy story bulletproof.

**Prereqs.** Drop-off heatmap (v2). Enough reader volume per story that demographic cuts aren't k=3.

**Metric.** Writer retention. Story quality at the long tail (writers tune for retention on the audience they actually have, not the one they imagined).

**Risk.** Privacy optics. Even though the writer never sees individual readers, "Wattpad demographic donuts but more granular" can feel surveillance-y. Aggregate-only, minimum cohort size of N before a cut renders, explicit reader-side disclosure in the privacy page.

---

### Highlight-density gutter signal

**What.** §2.1a's second half — a soft ember dot in the margin gutter wherever public annotations cluster. Density signal, not a count, not a notification. Tap to expand.

**Complexity.** S, conditional on prereqs.

**Prereqs.** Public annotations at v3 scale (the whole point is aggregate signal — needs annotation volume to be meaningful).

**Metric.** Engagement with annotations (taps on density dots → annotation reads → annotation replies).

**Risk.** Visual noise on the reader. The whole reader brief is "prose is sacred." A density gutter that's too loud violates that. Tune it down until it almost disappears, then tune down a notch more.

---

## Explicit non-goals

Things competitors do that we are intentionally not building. Naming them here so they don't sneak in via a "but X does it" PR review.

- **Virtual currency / coins** (Tapas Ink, Wattpad Coins, Webnovel SS). Obscures pricing, feels scammy, regulatory headaches in some jurisdictions. We have direct tipping and a credit-pack abstraction for fee-efficiency only — that's the line.
- **Daily check-in rewards** (Dreame, Webnovel). Manipulative engagement hack lifted from mobile games. We're a reading platform, not a slot machine. Streak mechanics on *reading* are tempting and also a no — they punish lapsed readers, who are the readers most likely to come back if not made to feel bad.
- **AI-translation pipeline** (Webnovel). MTL slop devalues writers and floods discovery with low-quality content. We're a writer-first platform. If we ever do translation, it's human translators with attribution.
- **General-purpose forum** (Royal Road). Story-anchored Reader Clubs are the modern shape of literary community — time-bounded, context-anchored, moderation surface scoped to the story. A general forum is a 2014 relic and a moderation black hole.

---

## Sequencing notes

The v2 list is ordered roughly correctly, but the dependency graph matters more than the list order. Concretely:

**Ship-first cluster (week 1-4 of post-v1).** Per-story RSS, scheduled-publish + NovelStack+ early-access tier, live earnings ticker. All three are mostly built on v1 infrastructure, all three are low-risk, and all three create immediate writer-side reasons to stick around between bigger releases. RSS is the cheapest. Scheduled-publish is the biggest single writer-retention lever in the v2 set.

**Data-dependent cluster (needs a few weeks of v1 traffic first).** Behaviour-signal discovery weighting and mood-based recommendation. Both need real read patterns to back-test against and tune. Don't ship either until v1 has produced enough data to validate the ranking change isn't just shuffling deck chairs.

**Reader-engagement cluster (depends on annotation maturity).** Public margin annotations (mutual-follows phase) is the gate. Until v2 annotations are public-shaped, the highlight-density gutter (v3) can't ship and Reader Clubs (v3) don't have the conversation-mechanic template. Sequence: private annotations (v1) → mutual-follows annotations (v2 phase A) → cautious public (v2 phase B) → density gutter (v3) → Clubs (v3).

**Writer-analytics cluster.** Drop-off heatmap is the foundation. A/B cliffhanger lab and per-paragraph tip jar both *use* the heatmap as their result surface, so heatmap ships first. Demographic retention analytics is a third cut on the same data pipeline — ship after the heatmap data store is proven at scale.

**PWA + offline.** Independent of everything else. Slot it in whenever there's a quiet week. The only reason it isn't v1 is that the cache-invalidation work (especially against author edits to published chapters) takes longer than it looks and v1 already has enough hard scope.

**Hard dependencies — don't ship the dependent before the prereq.**
- Per-paragraph tip jar (v3) requires credit-pack abstraction (v1) *and* drop-off heatmap (v2).
- Highlight-density gutter (v3) requires public annotations (v2).
- Reader Clubs (v3) require sustained 500-reader stories, which means we need v1 + a few months of growth before this is even a real conversation.
- A/B cliffhanger lab (v2) requires web NovelStack+ on Stripe (v1).
- Behaviour-signal discovery (v2) requires enough chapter-level read data to back-test, which means several weeks of v1 traffic minimum.

The single most important sequencing principle: do not let any v2 item drift into v1 scope. v1's job is parity + reader. Everything in this doc is *after that.*

---

*— end —*
