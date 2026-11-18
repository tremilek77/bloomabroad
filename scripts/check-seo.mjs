// Build-time SEO and wording check on the prerendered pages in dist/.
//   node scripts/check-seo.mjs
// Runs after the prerender. Fails the build (exit 1) only for problems that
// would hurt search or break the brief's rules. Softer items print as notes.
//
// Rules come from the seo-audit and schema skills: one H1, unique title (50-60
// characters) and meta description (150-160) on the marketing pages, a
// self-referencing canonical, JSON-LD that parses.

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

// Marketing pages must meet the length rules. Legal pages only need the basics.
const PAGES = [
  { file: 'index.html', route: '/', marketing: true },
  { file: 'students.html', route: '/students', marketing: true },
  { file: 'universities.html', route: '/universities', marketing: true },
  { file: 'checklist.html', route: '/checklist', marketing: true },
  { file: 'pricing.html', route: '/pricing', marketing: true },
  { file: 'verify.html', route: '/verify', marketing: true },
  { file: 'privacy.html', route: '/privacy' },
  { file: 'terms.html', route: '/terms' },
  { file: 'contact.html', route: '/contact' },
  { file: 'complaints.html', route: '/complaints' },
  { file: 'cookies.html', route: '/cookies' },
]

const BANNED = [
  [/AI[- ](driven|powered)/gi, 'no "AI-driven" language'],
  [/free (readiness )?assessment/gi, 'never imply the assessment is free'],
  [/\bLEO\b|TechFoundHer/g, 'never name LEO or TechFoundHer'],
  [/—/g, 'em dash in copy'],
]

let failures = 0
const fail = (page, msg) => {
  failures++
  console.log(`  ✗ ${page}: ${msg}`)
}
const note = (page, msg) => console.log(`  · ${page}: ${msg}`)

for (const { file, route, marketing } of PAGES) {
  let html
  try {
    html = await readFile(path.join(dist, file), 'utf8')
  } catch {
    fail(file, 'not prerendered (missing from dist/)')
    continue
  }

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(/&amp;/g, '&') ?? ''
  const meta = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.replace(/&amp;/g, '&') ?? ''
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1] ?? ''
  const h1s = (html.match(/<h1[\s>]/g) ?? []).length

  if (h1s !== 1) fail(file, `expected exactly one <h1>, found ${h1s}`)
  if (!canonical.endsWith(route === '/' ? '/' : route)) fail(file, `canonical "${canonical}" doesn't match ${route}`)
  if (marketing) {
    const t = [...title].length
    const m = [...meta].length
    if (t < 50 || t > 60) fail(file, `title is ${t} characters (want 50-60)`)
    if (m < 150 || m > 160) fail(file, `meta description is ${m} characters (want 150-160)`)
  }

  // Every JSON-LD block must parse and carry a @graph or @type.
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  if (blocks.length === 0) fail(file, 'no JSON-LD found')
  for (const b of blocks) {
    try {
      const j = JSON.parse(b[1])
      if (!j['@graph'] && !j['@type']) fail(file, 'JSON-LD without @graph or @type')
    } catch {
      fail(file, 'JSON-LD does not parse')
    }
  }

  // Visible text only: drop scripts, styles and tags.
  const text = html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#x27;|&amp;|&quot;/g, ' ')

  if (marketing) {
    for (const [re, why] of BANNED) {
      const hits = text.match(re)
      if (hits) fail(file, `${why} (${hits.length}x)`)
    }
    // "visa" is allowed only in disclaimers, FAQs and safety lines. List it for review.
    const visa = [...text.matchAll(/.{0,50}\bvisa\b.{0,40}/gi)].map((m) => m[0].replace(/\s+/g, ' ').trim())
    if (visa.length) note(file, `"visa" appears ${visa.length}x, confirm each is a disclaimer, FAQ or safety line`)
  }
  console.log(`  ✓ ${file}  h1=${h1s}  title=${[...title].length}  meta=${[...meta].length}`)
}

console.log(failures ? `\n[seo] ${failures} problem(s)` : '\n[seo] all checks passed')
process.exit(failures ? 1 : 0)
