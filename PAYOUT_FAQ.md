# Payouts — how you get paid on NovelStack

A plain-language explainer for writers. Link this from the Earnings dashboard.

---

## The short version

You earn from three things on NovelStack:

1. **Tips** readers send you — you get **70%** after Apple's cut. In your balance the same day.
2. **NovelStack+ subscribers reading your work** — you earn a share of a monthly pool based on how many minutes subscribers spent reading your paid chapters. Paid on the **7th of next month**.
3. **Rewarded ads** readers watch to unlock your paid chapters — you get **70%** after the ad network's cut. Paid about **two months later** (ad networks take a while to confirm and pay out the underlying ad revenue).

Banner ads on the free preview chapters of your books **don't** earn you anything — they fund the platform itself so the discovery side stays free for readers. We're upfront about that.

---

## Where the money goes — full breakdown

Every reader payment goes through the same three layers:

```
What a reader paid
    ↓
Payment processor's fee (Apple 15%, Google 15%, or Stripe ~3% on web)
    ↓
NovelStack's 30% platform fee
    ↓
70% to you  ← this is what shows up in your balance
```

### How does our 30% compare?

| Platform | Their cut | Your cut |
|---|---|---|
| **NovelStack** | **30%** | **70%** |
| Spotify (artists) | 30% | 70% |
| Apple Music | 30% | 70% |
| YouTube creators | 45% | 55% |
| Amazon Kindle Unlimited | ~40% | ~60% |
| Wattpad | 40-50% | 50-60% |
| Medium Partner Program | ~50% | ~50% |
| Substack | 10% | 90% |
| Patreon | 5-12% | 88-95% |

Substack and Patreon take less but they don't do what we do — they're a payments pipe + email list. They don't run discovery, don't run an app, don't pay App Store distribution fees, don't fund the reader funnel. We sit in the same bucket as Spotify and Apple Music — pool-based engagement platforms — and we're at the floor of that bucket. We will never raise this without 60 days' notice in writing.

---

## How the NovelStack+ pool works

NovelStack+ readers pay $6.99/month for ad-free, all-access reading. The revenue from those subscriptions becomes a **monthly pool** that gets split across writers, in proportion to how many minutes subscribers actually spent reading your paid chapters that month.

### The math, with a real example

Say in March 2025:

- 100 readers were subscribed to NovelStack+ for the full month
- Subscribers read a total of 18,000 minutes of paid chapters across the whole platform
- Out of those 18,000 minutes, **900 minutes were spent on your work**

Step 1 — the pool:

```
100 subscribers × $6.99       = $699.00   ← gross
                              − $104.85   ← Apple 15%
                              = $594.15
                              − $178.25   ← NovelStack 30%
                              = $415.91   ← distributable pool
```

Step 2 — your share:

```
Per-minute rate = $415.91 ÷ 18,000 minutes = $0.0231 per minute
Your earnings    = 900 minutes × $0.0231     = $20.79
```

That $20.79 lands in your available balance on **April 7th**.

### Why pay on the 7th of the next month?

Two reasons:

1. **The month has to close fully.** Subscribers can cancel mid-month, refunds can land in the last 48 hours, Apple's monthly accounting takes a day or two to settle. By the 7th everything is locked.
2. **It matches industry norms.** Spotify, Apple Music, Medium, Kindle Unlimited all pay 1-2 months after the engagement happens. We pay 7 days after — earlier than most.

### Why is there a maximum per-minute rate?

There's a $0.02/minute cap (= $1.20 per hour of reading) on the pool's per-minute rate. In months where engagement is unusually low across the platform, the natural rate would mathematically exceed $0.02 — at that point the cap kicks in and every writer gets paid at the cap. Any surplus stays with NovelStack as a buffer for low months.

In practice the cap rarely bites — it's there as a safety floor so a low-engagement month can't accidentally produce per-minute rates ten times higher than normal and create expectations we can't sustain. **The cap can only ever pay you the same or more than the natural rate, never less.**

---

## Tips — the simplest path

When a reader taps "Tip the author" and pays you $4.99 via Apple, the math is:

```
$4.99 (gross)
− $0.75 (Apple's 15%)
= $4.24
− $1.27 (NovelStack's 30%)
= $2.97 ← in your available balance, immediately
```

No lag. No pool. Just a direct credit. Tips are the most efficient way for readers to support you because they're a single transaction, no monthly settlement window.

---

## Rewarded ads — the longest lag, but real money

When a NS+ non-subscriber wants to read your paid chapter for free, they can watch a 30-second rewarded ad. AdMob pays NovelStack for that ad view; we take 30%, you get 70%. But — and this is important — **AdMob doesn't tell us the actual cents value until about two months later**.

### Why so long?

AdMob (Google's ad network) settles ad revenue on a two-stage cycle:

1. End of month → AdMob waits ~30 days to finalize the numbers (they need to verify the views weren't fraudulent, that advertisers paid their invoices, etc.)
2. Once finalized → AdMob waits another ~30 days to actually wire the money to NovelStack

So an ad-view on March 15 finalizes around May 1 and the cash hits our bank around May 21. We pay you in the June 7 monthly cycle.

This is industry-standard — YouTube AdSense, Twitch, and every other ad-supported platform runs on a near-identical cadence. We can't make AdMob settle faster.

### What you see on your dashboard

While unlocks are awaiting reconciliation, your dashboard shows:

> *"23 unlocks awaiting AdMob reconciliation · cents land on next monthly settlement"*

We deliberately don't show a dollar estimate while the unlocks are pending — those estimates can be 5-10x off in either direction depending on geography and ad market conditions, and we'd rather not lie to you about what you've earned. When AdMob's real numbers land, your dashboard updates with the actual cents and the unlock count drops.

---

## Banner ads — why they're 100% NovelStack

Free preview chapters (the first three of each book) carry banner ads. **Writers don't earn from banners.** This is by design:

- Free chapters exist as a **discovery funnel** — they let readers find your work and decide whether to subscribe, watch a rewarded ad, or just enjoy the preview.
- Banner ads on free chapters fund the platform's running costs — servers, content moderation, app-store distribution, the engineering that makes NovelStack work at all.
- When a reader hits a paid chapter, they have two genuine choices: subscribe to NovelStack+ (you get pool share) or watch a rewarded ad (you get 70% of that ad's revenue). Both pay you.

Banner revenue on free chapters is the cost of running the shop window. Rewarded ad + sub + tip revenue is what pays you when readers actually engage with your work.

If we ever change this we'll give you 30 days' written notice and apply it prospectively, never retroactively.

---

## Getting paid out

Money in your "available balance" stays there until you withdraw it. To withdraw:

1. Open the **Earnings** tab.
2. Tap **Withdraw**.
3. If you haven't connected Stripe Connect yet, you'll be walked through onboarding (takes ~5 min — you'll need your bank details and basic ID).
4. Once connected, Withdraw triggers a Stripe Connect transfer. Money hits your bank in 1-3 business days.

There's no minimum withdrawal threshold. You can withdraw $1 if you want. We don't charge any withdrawal fee on top of what Stripe charges (which is itself $0 for standard Connect transfers to your bank in supported countries).

---

## Refunds — when they happen, what they do to your balance

If a reader refunds a tip or a subscription within Apple's refund window (typically 90 days for subs, 60 for one-off purchases):

- **Tips:** the refund is applied as a chargeback against your future earnings, not retroactively clawed back from money you've already withdrawn. If your available balance can absorb it, it nets out there. If it can't (because you already withdrew), it carries forward and reduces your next monthly payout slightly.
- **Subscription refunds:** the refunded subscriber doesn't count toward the next month's pool. That's the natural correction. We never claw back from your existing payouts.

We do not surprise you with negative balances. Worst case in a refund-heavy month is your next monthly payout is reduced by the refund amount.

---

## Questions?

If anything here doesn't match what you see on your dashboard, ping us at **support@novelstack.app** with your username and we'll pull your earnings audit trail. Every payout is fully traceable to the underlying tips / subscriber-minutes / ad-unlock rows — there's no hand-waving, you'll get the math.
