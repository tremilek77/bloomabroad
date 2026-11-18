# BloomAbroad implementation plan: P0 to public launch

Written 18 Nov 2026 from the 36-page brief (4 Nov). Copy for each page is in
[copy-deck.md](copy-deck.md).

## 1. The big picture

| Phase | Brief's deadline | What it is | Status |
|---|---|---|---|
| **P0** (Fixes 1-5) | Before any student promotion | Form, stats, legal pages, footer, cookies | **Built**, branch `p0-compliance`, not merged |
| **P1** (Fixes 6-7) | Before the founding cohort, Jan 2027 | Homepage split, `/students`, `/universities`, `/about`, free checklist | Not started |
| **P2** (Fixes 8-14) | By public launch | `/pricing`, Stripe, `/verify`, testimonials, sample report, video, `/nigeria`, `/guides`, geolocation, defensive domains | Not started |

### Recommended re-grouping into three gates

The brief's P2 label hides a dependency: the founding cohort **books and pays in January**, so the
parts of P2 that payment depends on cannot wait for "public launch".

| Gate | Date target | Contents |
|---|---|---|
| **A. Safe to promote** | ~25 Nov | P0 merged and live, placeholders filled, mailboxes working, Search Console and analytics on |
| **B. Safe to take money** | Mid-Jan 2027 (hard stop) | P1 **plus** the payment-critical P2 items: `/pricing`, Stripe checkout, "Start my assessment now" tickbox, disclaimers (3 lengths), split FAQs, `/verify`, solicitor sign-off on Privacy and Terms |
| **C. Public launch** | Early 2027 | Testimonials (from Feb), sample report, walkthrough video, `/nigeria`, guides, location banner, defensive domains |

## 2. Where to start: this week

Do these in order. The first four cost almost nothing and are the longest lead-time items.

| # | Action | Owner | Why now |
|---|---|---|---|
| 1 | Book the **solicitor** to review Privacy and Terms | Remi | The brief requires review before payments in January. Solicitors book out over December |
| 2 | Set up **hello@ and privacy@** mailboxes | Remi | Linked from every legal page and email; they must reply within 2 working days |
| 3 | Send me **CRO number, registered office, WhatsApp number**; confirm 24-month and 2-year retention | Remi | The four placeholders on the live legal pages |
| 4 | **Decide the domain**: point bloomabroad.ie at Vercel and make it canonical | Remi + me | The site, emails and sitemap use .ie while hosting is `bloomabroad.vercel.app`. Moving later throws away indexing |
| 5 | Run the **migration**, deploy `notify-waitlist`, add the Update webhook, set `SITE_URL` | You | Steps in [p0-setup.md](p0-setup.md). Migration goes first |
| 6 | **Merge `p0-compliance`** to `main` | You | Gate A |
| 7 | Verify **Google Search Console** (domain property, DNS) and submit the sitemap | You | The brief wants phrases "confirmed in Search Console" and a new site has no data for weeks |
| 8 | Enable **Vercel Web Analytics** | You | One click, already in the code |
| 9 | Register the **defensive domains** now | Remi | Cheap, and local-presence rules for .ng and .co.ke can take weeks. Do not wait for Gate C |

Items 1 to 4 and 9 are Remi's. Send them as one message today.

## 3. How to build it: the working method

1. **One branch per gate**, small PRs per page. Every PR gets a Vercel preview link.
2. **Remi approves copy on the preview link**, not in a document. Copy lives in `src/content/`, so changes
   after approval are one-line edits.
3. **One source of truth for repeated facts.** Prices appear in four places (`/pricing`, FAQ, `/nigeria`,
   checkout) and the disclaimer in three lengths. Put them in `src/content/prices.ts` and
   `src/content/disclaimers.ts`. A price change then happens once and cannot drift.
4. **Build shared blocks before pages**: `Hero`, `CardGrid`, `Steps`, `FaqAccordion` (emits its own JSON-LD),
   `StatStrip`, `Disclaimer` (short / standard / report), `CtaBand`, `SeoHead`, `SchemaGraph`. The P0 work
   already has `usePageMeta`, `Prose`, footer and consent; the new blocks sit beside them.
5. **Automated guardrails**, extending `check-placeholders`: `check-copy.mjs` (exists: title, meta and answer
   lengths, banned wording) wired into the build, plus checks for exactly one H1 per page, a canonical on every
   page, and "visa" appearing only on guide, disclaimer and verify pages.
6. **Keep the stack.** Vite + React + prerender works for about 20 to 30 pages. Move guides to markdown files
   rendered at build time. Revisit Astro or a static generator only if guides pass roughly 30 or prerender time
   becomes painful.

## 4. Gate B build order (P1 plus payment-critical P2)

Rough effort is in developer-days.

| Order | Piece | Days | Notes |
|---|---|---|---|
| 1 | Shared blocks, `src/content/`, site-wide SEO and schema (Organization, WebSite, Breadcrumb, sitemap from routes, robots, `llms.txt`) | 3 | Everything below depends on it |
| 2 | **Homepage** as front door (Fix 6a) | 1.5 | Existing sections move out; keep `/#how`, `/#faq` anchors working |
| 3 | **/students** (Fix 6b) | 2.5 | Includes parent block, outcomes, FAQs |
| 4 | **/universities** (Fix 6c) | 2 | Moved sections; future tense |
| 5 | **Free checklist** | 2.5 | See below |
| 6 | **Disclaimers** in three lengths | 0.5 | Falls out of the shared blocks |
| 7 | **/verify** | 1 | Pure content and cheap. Pull forward: it is a trust page for payment |
| 8 | **/about** | 1.5 | Blocked on photos and bios consent |
| 9 | **/pricing** with waitlist buttons | 2 | Local currency via geolocation can wait for Gate C; ship euro-first with a switcher |
| 10 | **Stripe checkout** + founding code (100 uses) + required "Start my assessment now" tickbox | 4 to 5 | Confirm NGN, KES, GHS support first (brief question 6). Add Stripe cookies to `/cookies` |
| 11 | **Handover to bloomabroad.ai** after payment | 1 to 2 | Depends on the assessment app's progress |

Gate B total is about 22 to 25 developer-days, which fits between now and mid-January only if the content
inputs (photos, bios, Stripe account, solicitor) are not late.

**Recommendation on the checklist:** build it natively instead of in Tally. It is eight questions with a
fixed rules table (brief page 17), so it is deterministic code and easy to test. The waitlist form already
has consent logging, role tags, age band and the under-18 parent flow. Tally would need all of that
duplicated, and it cannot write the consent record. Cost is about the same; the compliance risk is lower.

## 5. Gate C build order

| Piece | Days | Blocked on |
|---|---|---|
| Location banner and local-currency default (Vercel geo header via a tiny `/api/geo` function, nothing stored) | 1.5 | None |
| Testimonials ("In their words") | 1 | Real quotes and written consent, from Feb 2027 |
| Sample outcome report (image + PDF, watermarked) | 1 | Report structure on bloomabroad.ai to match |
| Walkthrough video | 0.5 dev | MVP complete, about 26 Nov for the recording |
| `/nigeria` (template reused for Kenya, Ghana) | 1.5 | Stripe naira decision |
| `/guides` hub and the first 3 guides | 4 plus writing | Olaniyi's review; Search Console data |
| Redirects for defensive domains, `/verify` wording update | 0.5 | Domains registered |

## 6. Content production

- Remi and Olaniyi supply the facts; I draft in the deck's pattern; Olaniyi reviews anything with a byline.
- Guide cadence: 3 before launch, then 2 a month. Start guide 1 (Nigeria) now: it is the most winnable query.
- **Best long-term asset:** an anonymised "what we saw" article from 10 years of Solid-Link journeys. Original data
  is what search and AI assistants cite. It needs Remi's data and consent.

## 7. Risks and contradictions to settle

| Risk | Fix |
|---|---|
| P2 pricing, Stripe and verify are labelled "by public launch" but payments open in January | Pull them into Gate B (above) |
| Consultant review: Privacy and Terms promise every result is reviewed, the university FAQ says that will narrow later | Keep the promise until the legal pages are re-reviewed. If it narrows, change the legal text first (GDPR automated-decision wording) |
| Hero "right student, in the right place", and "visa fees" and "refusal" in student cards, break the brief's own wording rules | Reworded in the deck |
| University benefits written in the present tense before the dashboard exists | Reworded in the deck; evidence claims flagged `[NEED: pilot data]` |
| "Free checklist" next to a paid assessment risks implying the assessment is free | Microcopy "The checklist is free. The full assessment is paid." beside every checklist button |
| Parent FAQ claims agents' free advice "is usually paid for by universities" | Softened to "often"; Remi to confirm |
| New domain: slow to rank for competitive phrases such as "Ireland student visa requirements" | Lead with country and first-hand angles; expect months, not weeks |
| Prerender is non-fatal, so a failed render silently ships the SPA shell | Keep the per-route `expect` check; consider failing the build for the legal pages |
| 10 `npm audit` findings in dependencies | Patch in a separate PR before Gate B |
| `confirm_parent`, consent log and form are untested against the real database | Run one real test signup of each role after the migration |

## 8. Decisions I need from Remi

1. Domain: make bloomabroad.ie the live canonical now?
2. Can Stripe charge in NGN, KES and GHS, or is it euro-only with "approximate" local prices?
3. Training crawlers (GPTBot, ClaudeBot): allow or block? (Search and user crawlers: allow.)
4. Photos and bios: written permission from Olaniyi; photo choices
5. Is the parent FAQ "often paid for by universities" claim acceptable?
6. Booking link for the 30-minute call (also used in the university email)
7. Which social accounts exist today (the footer shows only these)
8. Data for the "what we saw" article, and consent to publish it anonymised

## 9. What I recommend doing next

Start Gate B's foundation on a new branch `p1-structure` once Gate A is merged: shared blocks, content files,
site-wide SEO and schema, then the homepage, `/students` and `/universities`. That is the longest chain and it
unblocks everything else. Two to three days gets a first preview for Remi to react to.
