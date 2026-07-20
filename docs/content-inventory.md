# BloomAbroad — Content Inventory (Step 1)

> Captured from the live Lovable preview on **2026-07-16**.
> Source: `https://lovable.dev/preview/AhYeoB6uaOZR4H7bKA3VQj2vCpIKq18Z`
> (real app iframe: `id-preview--003cf207-5cad-4adf-a738-ed8f61f2e540.lovable.app`)
>
> **Do not change any content.** This is the source of truth for the "keep the content" rule.

---

## 0. Structural summary

- **Single-page site.** No separate routes. Nav items are in-page anchors: `#top`, `#how`, `#platform`, `#waitlist`.
- **Audience toggle** in the hero: **For Universities** / **For Students**. Toggling swaps the copy in the value-props section, the "How it works" 4 steps, and the mid-page CTA. Everything else is shared.
- **One real form**: the waitlist / early-access form (bottom).
- Footer links `Privacy`, `Terms`, `Contact` currently point to `#` (no destinations yet).
- Product is **pre-launch** (waitlist stage).

**What the product actually is:** an **enrolment-readiness / eligibility-scoring platform** for universities and international students — *not* a program-browsing/study-abroad marketplace. (See "Discrepancies vs. playbook" at the end — this matters for the redesign brief.)

---

## 1. Global chrome

### Header / nav
- Logo/wordmark: **BloomAbroad** (→ `#top`) — mark is a rose→coral gradient "heart/bloom" glyph.
- Nav links: **How it works** (`#how`) · **The platform** (`#platform`)
- Primary CTA button: **Join the waitlist** (`#waitlist`)

### Footer
- Wordmark: **BloomAbroad**
- `© 2026. All rights reserved.`
- Links: **Privacy** · **Terms** · **Contact** (all `#`, no target yet)
- "Edit with Lovable" badge (remove on rebuild)

---

## 2. Hero (shared)

- Eyebrow: **ENROLMENT READINESS PLATFORM**
- Headline (3 lines):
  - **BloomAbroad.**
  - **Know before you apply.**
  - **Know before you enrol.**
- Subhead: *BloomAbroad is the enrolment-readiness platform for universities and international students — giving both sides a clear, evidence-based answer before costly decisions are made.*
- Audience toggle: **For Universities** | **For Students**

---

## 3. Value-props section (toggle-dependent)

### 3A. FOR UNIVERSITIES
- Eyebrow: **FOR UNIVERSITIES**
- Heading: **A smarter way to assess international applicants.**
- Intro: *Stop relying on incomplete applications and inconsistent criteria. BloomAbroad gives your admissions team a structured, evidence-based readiness score for every international applicant — so you enrol students who are genuinely ready.*
- Four cards:
  1. **Standardised readiness scoring** — *Every applicant is assessed against expert-designed eligibility scenarios built on 10+ years of real application and in-study outcome data. No more gut feel. No more inconsistency.*
  2. **Early risk flagging** — *Identify at-risk profiles before they become at-risk students. BloomAbroad surfaces the signals that predict in-study difficulty — giving your team time to intervene or reconsider.*
  3. **Reduced admissions burden** — *Replace manual, time-intensive screening with a consistent, auditable process. Your team focuses on decisions — not data gathering.*
  4. **Better enrolment outcomes** — *Students who pass the BloomAbroad readiness threshold are better matched to your institution — improving retention, progression, and satisfaction on both sides.*

### 3B. FOR STUDENTS
- Eyebrow: **FOR STUDENTS**
- Heading: **Know exactly where you stand — before you spend a cent.**
- Intro: *Applying to study abroad is one of the biggest decisions you'll make. BloomAbroad gives you an honest, evidence-based picture of your eligibility — so you apply to the right places, with real confidence.*
- Four cards:
  1. **Self-assessment before you apply** — *Check your academic, financial, and language readiness against real university benchmarks — before you pay application fees, gather documents, or wait months for an answer.*
  2. **Apply to the right universities** — *Stop casting a wide net and hoping. BloomAbroad helps you identify which institutions are a genuine fit for your profile — so your time and money go where they have the best chance.*
  3. **Understand the gaps** — *If you're not ready yet, BloomAbroad tells you why — and what to work on. So your next application is stronger, not just another attempt.*
  4. **Apply with evidence, not hope** — *Arrive at your application with a clear picture of your readiness — and the confidence that you belong there.*

---

## 4. "How it works" — 4 steps (toggle-dependent) — anchor `#how`

- Eyebrow: **HOW IT WORKS**
- Heading: **Four steps. One clear answer.**

### Universities
1. Submit applicant profiles to BloomAbroad via your admissions workflow.
2. BloomAbroad scores each applicant against expert-designed eligibility scenarios.
3. Your team receives a readiness report — structured, auditable, and consistent.
4. Enrol with confidence. Flag risks early. Improve outcomes over time.

- Mid CTA line: *Join a small cohort of partner universities shaping the platform from the ground up.*
- Mid CTA button: **Request early access for your institution** (→ `#waitlist`)

### Students
1. Create your profile — academic background, language scores, finances, and goals.
2. BloomAbroad assesses your readiness against real benchmarks from universities worldwide.
3. You receive a clear eligibility picture — what's strong, what's a risk, and where you stand.
4. Apply with confidence to the universities that are genuinely right for you.

- Mid CTA line: *No application needed. Find out where you stand in minutes.*
- Mid CTA button: **Check my eligibility — free** (→ `#waitlist`)

---

## 5. "The platform" / data-credibility section (shared) — anchor `#platform`

- Eyebrow: **HOW IT WORKS**  *(note: reused eyebrow label — see UX suggestion)*
- Heading: **Built on a decade of real data.**
- Body: *BloomAbroad isn't built on assumptions. It's built on 10+ years of accumulated data — student profiles, application outcomes, and in-study performance — from across the international education ecosystem.*
- Three bullets:
  - Expert-designed eligibility scenarios are applied from day one.
  - Assessments sharpen over time as more data flows through the platform.
  - Both universities and students get a clear, consistent readiness signal.
- Three stats:
  - **10+ years** — of international education data
  - **2 user types** — one unified platform
  - **Practitioners** — built by operators, not theorists

---

## 6. Waitlist / early-access section (shared) — anchor `#waitlist`

- Eyebrow: **EARLY ACCESS**
- Heading: **Be first. Shape the platform.**
- Body: *BloomAbroad is in pre-launch. We're opening early access to a select group of universities and students who want to help build something better for international education.*
- **Form fields:**
  - Name (text)
  - Email address (email)
  - I am a → **University** / **Student** (toggle)
  - Institution / Country (optional) (text)
  - Submit button: **Join the waitlist**
- Reassurance line: *No spam. Just updates on early access. Unsubscribe anytime.*

---

## 7. Existing design system (for reference — the current brand)

The live site is **already green-forest themed** with a rose/coral gradient logo accent — i.e. close to the playbook's "Alt 1 — Evergreen & Rose," not the playbook's default "Rose & Growth."

- **Type:** Headings = *Instrument Serif*; UI/body = *Inter*.
- **Radius:** `0.75rem`
- **Core tokens (oklch):**
  - `--background` cream `oklch(97.2% .012 95)`
  - `--foreground` deep forest ink `oklch(23.5% .055 155)`
  - `--primary` deep forest `oklch(23.5% .055 155)` (buttons; light text on dark green)
  - `--secondary` / `--muted` pale sage `oklch(94% .028 145)`
  - `--accent` / `--ring` mint-green `oklch(74% .14 158)`
  - Brand ramp: `--bloom-deep` `18% .05 155`, `--bloom-forest` `32% .07 155`, `--bloom-mint` `74% .14 158`, `--bloom-soft` `94% .06 155`
  - `--gradient-hero`: layered radial mint glows over a cream→pale-green vertical gradient
- **Logo:** rose→coral heart/bloom gradient (the only warm element).

---

## 8. Discrepancies vs. the Redesign Playbook (flag before building)

These are `[RECONCILE]` items — the playbook was written before the real site could be read, and reality differs:

1. **Product framing.** Playbook treats BloomAbroad as a *study-abroad / program-browsing marketplace* (Programs, Schools, For Students pages, program search/filter). The real product is an **enrolment-readiness scoring platform** in **pre-launch**, single page, waitlist-only. There are no Programs/Schools/About/Contact pages to rebuild.
2. **Palette conflict.** Playbook default is **rose-led ("Rose & Growth")**. The live brand is deliberately **green-led** (forest + mint) with rose only in the logo — this matches the playbook's *Evergreen & Rose* alternative, which it itself said to use "if buyers skew institutional." Given the buyer here is **universities/admissions**, green-led is the right call. Recommend building on the **existing green token system**, keeping the rose bloom as logo/accent only.
3. **No inner pages / forms plural.** Only one form (waitlist). Playbook's "forms last, application/contact/inquiry" scope collapses to this single early-access form.
4. **No live legal/contact pages.** Privacy/Terms/Contact are dead `#` links — a rebuild needs real destinations or they should be flagged as out of scope.

---

## 9. `[UX SUGGESTION]`s spotted during inventory (not yet actioned)

- **[UX SUGGESTION]** The "How it works" eyebrow label is used on **two different sections** (§4 steps and §5 data-credibility). Rename §5's eyebrow (e.g. **THE PLATFORM** or **WHY IT'S CREDIBLE**) so the `#platform` anchor and the label agree. *Effort: XS.*
- **[UX SUGGESTION]** Footer **Privacy / Terms / Contact** go nowhere (`#`). Either add real pages or mark as coming-soon. Education buyers check these before trusting a pre-launch tool. *Effort: S (stub pages) / M (real content).*
- **[UX SUGGESTION]** The hero **For Universities / For Students** toggle is the key IA decision, but the audience fork only affects two sections. Consider making the toggle "stickier" (persist choice, reflect in the waitlist "I am a" default). *Effort: S.*
- **[UX SUGGESTION]** No trust signals beyond the "10+ years / practitioners" stats — no named partner logos, accreditations, or founder credibility. For an admissions audience this is the biggest conversion gap. Likely intentional pre-launch, but worth a placeholder slot. *Effort: M.*

---

*End of Step 1 inventory. Awaiting go-ahead before any design-system or build work.*
