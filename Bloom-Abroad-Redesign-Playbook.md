# Bloom Abroad — Redesign Playbook (Claude Code)

A step-by-step process plus copy-paste prompts to overhaul the Bloom Abroad site (landing + inner pages) in **Claude Code**, using your installed `/ui-ux-pro-max` skill, 21st.dev Magic, and a curated set of free MCPs. Audience: **schools and students** (professional, trustworthy, but energetic).

> **One thing I couldn't do for you:** the Lovable preview link (`.../preview/AhYeoB6uaOZR4H7bKA3VQj2vCpIKq18Z`) is a JavaScript app, so I couldn't read its actual copy from here. Your message also cut off at "The app is currently deployed at." — **paste the live deployed URL** into Step 2 so Claude Code can inventory the real content before touching anything. That's how we guarantee "keep the content" is honored.

---

## 0. What your stack implies

Claude Code + 21st.dev Magic + shadcn all assume **React + TypeScript + Tailwind + shadcn/ui + Motion (Framer Motion)**. If the current project is a Vite/React Lovable export, you're already compatible. If it's plain HTML, the fastest path is to scaffold a Vite + React + Tailwind + shadcn shell and port the content over. Confirm the framework in Step 1 before generating anything.

---

## 1. Install the MCPs (run these in your project folder)

Keep the set **small** — 5–6 servers is the sweet spot. Every server adds tokens to Claude's context, and past ~5 the overhead starts hurting output quality. Here's the lean, free-first stack for this exact job.

### A. 21st.dev Magic — *AI component generation* (the one you asked for)
Get a free API key at **21st.dev/magic/console** (free tier with usage limits; heavier use needs a plan), then:
```bash
npx @21st-dev/cli@latest install claude --api-key YOUR_KEY
```
Use it in chat with `/ui …` (e.g. `/ui a hero with a rose-gradient bloom motif and a search bar`). It emits React + shadcn + Tailwind and can pull matching components + brand SVG logos.

### B. shadcn MCP — *browse & install from component registries* (free)
This is the bridge to shadcn/ui **plus** third-party registries (Aceternity, Magic UI, etc.) using natural language. Official setup — add to your project's `.mcp.json`:
```json
{
  "mcpServers": {
    "shadcn": { "command": "npx", "args": ["shadcn@latest", "mcp"] }
  }
}
```
Restart Claude Code, run `/mcp`, confirm it shows **Connected**. (Docs: ui.shadcn.com/docs/mcp)

### C. Context7 — *up-to-date library docs* (free, key optional)
Stops Claude from writing code against outdated Tailwind/Motion/shadcn APIs.
```bash
claude mcp add --scope user context7 -- npx -y @upstash/context7-mcp
```

### D. Playwright MCP — *let Claude open the site and verify its own UI* (free, local)
Essential for "did the redesign actually render right?" and for **reading your current live site** in Step 2.
```bash
claude mcp add playwright -- npx @playwright/mcp@latest
npx playwright install chromium
```

### E. Chrome DevTools MCP — *performance / Lighthouse / LCP debugging* (free)
For the "fast + futuristic but still lightweight" goal — profile animations so they don't tank load speed. Needs Node 22+ and Chrome.
```bash
claude mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest
```

### Optional add-ons (only if you actually need them)
- **Figma Dev Mode MCP** — only if you design in Figma first and want token-accurate design-to-code.
- **GitHub MCP** — if you want Claude to open PRs / manage the repo inline.

**Skip:** Filesystem MCP (Claude Code already has file tools). Don't install "every server that sounds useful" — it degrades results.

After adding all of them, run `/mcp` to confirm each is Connected.

---

## 2. Where to get free samples & demos (browse these first)

Looking at real demos before you prompt gives Claude concrete targets ("build section 2 from Aceternity's spotlight hero") and dramatically improves output. All of these are **free, copy-paste, and shadcn-compatible** — you own the code.

| Source | URL | Best for |
|---|---|---|
| **21st.dev** | 21st.dev | Marketplace of community shadcn blocks; the Magic MCP pulls from here |
| **Magic UI** | magicui.design | 150+ free animated components — marquees, animated beams, bento grids, blur-fade text, retro grids |
| **Aceternity UI** | ui.aceternity.com/components | 200+ high-impact "wow" effects — spotlight heroes, 3D cards, shader/particle backgrounds, parallax |
| **shadcn/ui** | ui.shadcn.com | The accessible core system — buttons, forms, nav, dialogs |
| **shadcn.io / Shadcnblocks** | shadcn.io | 6,000+ production blocks across 56+ categories; large marketing-section library |
| **Origin UI / Cult UI / Motion Primitives** | originui.com · cult-ui.com · motion-primitives.com | Extra primitives + tasteful motion styles |

**Recommended pattern for this project:** shadcn/ui for the *system* (forms, nav, cards) → Magic UI for *tasteful motion* → Aceternity for **one or two** hero showpieces. Don't stack heavy effects everywhere — a schools/students audience needs to trust you and find info fast.

---

## 3. Brand & palette research

Your logo is a spiraling rose (magenta → crimson) rising from green leaves — a literal "bloom" of growth. That's a strong metaphor for study-abroad: students blossoming, putting down roots somewhere new. The visual system should lean into **bloom + growth**, not generic edu-blue.

### Recommended: "Rose & Growth" (primary)
A refined raspberry-rose paired with botanical green on warm cream. Reads elegant and human, not candy-pink — important for a professional audience.

| Role | Name | Hex | Use |
|---|---|---|---|
| Base surface | Cream | `#FCFBF8` | Page background (matches your current deployed theme color) |
| Primary | Raspberry Rose | `#D63A6A` | Accents, highlights, active states |
| Primary (CTA-safe) | Rose Deep | `#BE2E5E` | Buttons **with white text** (darker so it passes AA) |
| Primary dark | Plum | `#6E1E43` | Headings, footer, hover, depth |
| Tint | Blush | `#FBE4EC` | Soft card / section backgrounds |
| Secondary | Botanical Green | `#2F8F5B` | Growth motif, success, secondary CTAs, checkmarks |
| Secondary tint | Sage | `#DCEBE1` | Alternating section backgrounds |
| Text | Warm Ink | `#2A2028` | Body copy |
| Muted | Mauve | `#8A7480` | Secondary text, borders |

**Signature gradient (the "bloom"):** `#F0568C → #D6336C → #B3204E` — echo the logo swirl in the hero and in one recurring accent (button hover, section divider, or an animated beam). Use it *sparingly* so it stays special.

**Brand-presentation tips**
- Let the rose be the **accent**, cream + ink the **workhorses**. If pink dominates every surface it reads consumer/lifestyle, not educational.
- Use the **green as a system signal** (progress, "you're eligible", verified schools) so the growth metaphor does real UX work, not just decoration.
- A subtle spiral/petal motif (derived from the logo) makes a great section divider, loading state, or scroll marker without shouting.
- Pair with humanist typography: a warm sans for UI (e.g. Inter / General Sans) + a soft serif for headlines (e.g. Fraunces / Source Serif) to feel academic *and* approachable.

### Alternative palettes (you invited these — each may fit better depending on positioning)

**Alt 1 — "Evergreen & Rose" (lead with green).** Swap the hierarchy: Botanical/forest green becomes primary, rose becomes the accent. Green primary `#1F7A54`, rose accent `#D63A6A`, cream base, forest ink `#14312A`. → *Reads most institutional/trustworthy — best if your buyers are school administrators and partnerships.*

**Alt 2 — "Plum Academic" (prestige).** Deep aubergine primary `#4A1E3D` + muted gold `#C9A227` + rose highlight `#D63A6A` + ivory `#FAF6EF`. → *Premium, aspirational — best if positioning is elite programs / selective placements.*

**Alt 3 — "Sunrise Bloom" (student energy).** Coral→rose warm gradient `#FF7A59 → #D63A6A` + teal accent `#159A8C` + warm sand `#FDF4EC`. → *Friendliest, most youthful — best if the primary audience is students self-serving, less so administrators.*

**My call:** Use **Rose & Growth** as the default; if the real buyer skews toward schools/institutions over students, switch to **Evergreen & Rose**. Tell Claude to build with CSS variables so you can flip palettes by editing tokens, not components.

### Accessibility guardrails
- Never put white text on `#D63A6A` for body-size text — use `#BE2E5E` or Plum for text-bearing buttons, and verify every pairing at **AA (4.5:1 body / 3:1 large)** with a contrast checker.
- Provide a `prefers-reduced-motion` fallback for **every** animation (Aceternity/Magic UI need this added manually — it's on you, not the library).

---

## 4. The master kickoff prompt (paste into Claude Code first)

> Use the `/ui-ux-pro-max` skill for this entire engagement.
>
> **Project:** Redesign the "Bloom Abroad" website — a study-abroad platform for **schools and students**. Full visual overhaul; **preserve all existing content and information architecture** unless you flag a clear improvement (see rules below).
>
> **Step 1 — Inventory before you touch anything.** Using the Playwright MCP, open `PASTE_LIVE_URL_HERE`, crawl the landing page and every inner page/route, and produce a content inventory: every page, its sections, headings, body copy, CTAs, forms, and nav links. Save it to `/docs/content-inventory.md`. Do not change any content yet. Show me the inventory and wait for my go-ahead.
>
> **Step 2 — Design system.** Set up a token-based theme (CSS variables) using this palette — Base `#FCFBF8`, Rose `#D63A6A`, Rose-CTA `#BE2E5E`, Plum `#6E1E43`, Blush `#FBE4EC`, Green `#2F8F5B`, Sage `#DCEBE1`, Ink `#2A2028`, Mauve `#8A7480`; signature gradient `#F0568C→#D6336C→#B3204E`. Typography: soft serif headings + humanist sans UI. Build so I can swap the whole palette by editing tokens only. The brand metaphor is a rose "blooming" = students growing/rooting abroad — reflect it subtly (petal/spiral motifs, growth-green as a UX signal for progress/eligibility/verified), never garish.
>
> **Step 3 — Build.** Rebuild the landing page and inner pages with the same content but a modern, interactive, subtly futuristic feel that stays **easy to navigate**. Use shadcn/ui for the core system, Magic UI for tasteful motion, and reserve one or two Aceternity showpieces for the hero. Use the shadcn and Magic MCPs to pull real components rather than hand-rolling. Respect `prefers-reduced-motion` everywhere and keep it fast.
>
> **Rules:**
> - Keep every piece of existing copy and every page unless you propose a change.
> - Whenever you see a **UX improvement opportunity** (confusing nav, weak CTA, buried info, missing trust signals for a school/student audience, accessibility gaps), **stop and notify me in a short list** — label each `[UX SUGGESTION]` with the problem, the fix, and the effort. Don't silently redesign IA.
> - Professional, trustworthy tone. Animation should aid comprehension, not distract.
> - After each page, use the Playwright MCP to render it and the Chrome DevTools MCP to check Lighthouse/LCP; report anything that regresses performance.
>
> Start with **Step 1 only** and wait.

*(Swap in your live URL. Doing Step 1 first is what protects the content — Claude reads the real site instead of guessing.)*

---

## 5. Per-page prompts (after the system is approved)

Run these one page at a time so each stays reviewable.

**Landing page**
> Rebuild the landing page from `/docs/content-inventory.md`, same content, new design system. Hero: use the signature rose-bloom gradient with one Aceternity-class effect (spotlight or subtle particle/petal field) + a clear primary CTA in Rose-CTA `#BE2E5E`. Below: value props as a Magic UI bento or feature grid, a "how it works" 3-step with the growth-green as the progress signal, social proof / partner schools (Magic MCP `logo_search` for logos), and a strong closing CTA. Flag any `[UX SUGGESTION]`s. Then render + Lighthouse it.

**Inner page pattern** (repeat per page — Programs, Schools, For Students, About, Contact/Apply, etc.)
> Rebuild `[PAGE NAME]` from the inventory, same content. Keep it scannable for [students / school admins]. Use shadcn components for any forms/tables, Magic UI for light motion only, and consistent tokens. Add trust signals appropriate to this audience. Flag `[UX SUGGESTION]`s, then render + check performance.

**Forms (application / contact / inquiry)** — highest-stakes for this audience
> Rebuild all forms with shadcn Form + Zod validation, inline errors, clear progress if multi-step, and accessible labels. Keep required fields minimal. Green `#2F8F5B` for success/valid states. Verify keyboard nav and reduced-motion.

---

## 6. UX opportunities to watch for (schools + students)

Tell Claude to prioritize flagging these — they're the common wins for an education/study-abroad site:
- **Dual audience clarity** — students and school admins want different things; a clear "I'm a student / I'm a school" fork near the top usually helps.
- **Trust signals** — accreditations, partner logos, safety/support info, real outcomes/testimonials. Education buyers need reassurance before acting.
- **Findability** — program search/filter (destination, subject, duration) beats a long scroll.
- **CTA hierarchy** — one obvious primary action per page; don't compete "Apply", "Browse", "Contact" at equal weight.
- **Mobile-first** — students browse on phones; verify every breakpoint via Chrome DevTools MCP device emulation.
- **Performance vs. flash** — futuristic effects are great until they delay LCP. Profile and cut anything that costs more than it adds.

---

## 7. Quick run order (checklist)

1. Install MCPs (§1) → `/mcp` all Connected
2. Browse demos (§2) so you can point Claude at concrete targets
3. Pick palette (§3) — default Rose & Growth, or Evergreen & Rose if buyers skew institutional
4. Paste master prompt (§4) with your **live URL** → approve the content inventory
5. Approve the design system → build landing page (§5) → review `[UX SUGGESTION]`s
6. Build inner pages one at a time → forms last
7. Chrome DevTools MCP performance pass → fix regressions → ship

---

*Note on the "app currently deployed at" line: paste that URL into Step 1 of the master prompt. Until Claude reads the real page, treat any content it produces as a placeholder to be reconciled against the inventory.*
