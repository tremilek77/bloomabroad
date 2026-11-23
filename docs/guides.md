# Writing and publishing guides

Guides are markdown files in `src/content/guides/`. The site, the sitemap, the hub, the nav link and
the structured data all build themselves from those files. Nothing else needs editing.

## Write one

1. Copy `src/content/guides/_template.md` to a new file such as `english-tests-for-irish-universities.md`.
   Lowercase and hyphens. The file name becomes the address: `/guides/english-tests-for-irish-universities`.
2. Fill in the front matter (title, description, answer and so on) and write the body. The template
   explains each field.
3. Run `npm run check:guides`. It lists what still needs fixing.

## The rules the build enforces

These come from the brief (Fix 14) and the SEO and AI-search guidance. A **published** guide that breaks one
fails the build. A **draft** only gets a list of problems.

- Title 50-60 characters, description 150-160, short answer 40-60 words
- At least three H2 sections, each opening with a direct answer paragraph (aim for 40-60 words)
- A visa guide (`visa: true`) needs an official source such as irishimmigration.ie, and the page adds
  "BloomAbroad doesn't give visa advice or make visa decisions. Always check the official guidance."
- Every source has the date you checked it. Sources older than 120 days and guides not reviewed for
  180 days are flagged
- No unresolved `[NEED: ...]` markers, no "AI-driven", never "free assessment", no em dashes (warning)
- Every guide automatically ends with the free checklist, then the assessment, and has Dr Kolawole's byline

## Review before publishing

1. Set `published: false` while drafting. Drafts are **hidden on the live site** (404, `noindex`, not in the
   sitemap or the hub).
2. To read a draft on a real page: run `npm run dev` (drafts always show), or set the environment variable
   `VITE_SHOW_DRAFTS=1` on a Vercel **Preview** deployment (not Production). Drafts then appear with a yellow
   "Draft" banner.
3. Dr Kolawole reviews. Then set `reviewed` to the date of his review, remove any `[NEED]` comment, and set
   `published: true`.
4. Merge. The guide appears on the hub, in the nav, in the sitemap and with its structured data.

## Keeping them current

Visa rules change. The "Last reviewed" date on the page is a promise. Re-check each guide's sources every
quarter, update the text, and change `reviewed`. The build flags guides that are overdue.
