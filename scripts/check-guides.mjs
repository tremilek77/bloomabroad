// Editorial rules for the guides (brief Fix 14, plus the seo-audit and ai-seo skills).
//   node scripts/check-guides.mjs
//
// PUBLISHED guides must pass every rule or the build fails. DRAFTS are checked
// too, but their problems are only listed, so work in progress never blocks a deploy.

import { loadGuides } from './lib/guides.mjs'

const OFFICIAL_HOSTS = [
  'irishimmigration.ie',
  'gov.ie',
  'immigration.gov.ie',
  'educationinireland.com',
  'studyinireland.ie',
  'qqi.ie',
  'hea.ie',
  'cao.ie',
  'citizensinformation.ie',
  'dataprotection.ie',
]

const wc = (s) => s.split(/\s+/).filter(Boolean).length
const iso = /^\d{4}-\d{2}-\d{2}$/
const daysAgo = (d) => (Date.now() - new Date(`${d}T12:00:00Z`).getTime()) / 86400000

const guides = loadGuides({ includeDrafts: true })
let hardFailures = 0

if (guides.length === 0) console.log('[guides] no guides yet (the /guides hub shows its "coming soon" state).')

for (const g of guides) {
  const { meta, slug, body, tokens } = g
  const errors = []
  const warnings = []

  for (const f of ['title', 'h1', 'description', 'answer', 'keyword', 'datePublished', 'reviewed']) {
    if (!meta[f]) errors.push(`missing front-matter field "${f}"`)
  }
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) errors.push('file name must be lowercase-hyphenated')
  if (!['students', 'universities'].includes(meta.audience)) errors.push('audience must be students or universities')

  const t = [...meta.title].length
  const d = [...meta.description].length
  const a = wc(meta.answer)
  if (meta.title && (t < 50 || t > 60)) errors.push(`title is ${t} characters (want 50-60)`)
  if (meta.description && (d < 150 || d > 160)) errors.push(`description is ${d} characters (want 150-160)`)
  if (meta.answer && (a < 40 || a > 60)) errors.push(`answer is ${a} words (want 40-60)`)
  if (meta.keyword && !(meta.h1 + ' ' + meta.answer).toLowerCase().includes(meta.keyword.toLowerCase().split(' ')[0]))
    warnings.push('target keyword does not appear in the H1 or answer')

  for (const f of ['datePublished', 'reviewed']) {
    if (meta[f] && !iso.test(meta[f])) errors.push(`${f} must be YYYY-MM-DD`)
  }
  if (iso.test(meta.reviewed) && iso.test(meta.datePublished) && meta.reviewed < meta.datePublished)
    errors.push('reviewed is earlier than datePublished')
  if (iso.test(meta.reviewed) && daysAgo(meta.reviewed) > 180)
    warnings.push(`last reviewed ${Math.round(daysAgo(meta.reviewed))} days ago: review it again`)

  // Structure: one H1 (the page template), H2 sections, each opening with a direct answer.
  if (tokens.some((x) => x.type === 'heading' && x.depth === 1)) errors.push('body must not contain an H1 (the page adds it)')
  const h2s = tokens.filter((x) => x.type === 'heading' && x.depth === 2)
  if (h2s.length < 3) errors.push(`needs at least 3 H2 sections (has ${h2s.length})`)
  tokens.forEach((tok, i) => {
    if (tok.type !== 'heading' || tok.depth !== 2) return
    const next = tokens.slice(i + 1).find((x) => x.type !== 'space')
    if (!next || next.type !== 'paragraph') {
      errors.push(`section "${tok.text}" must open with a short answer paragraph`)
    } else {
      const n = wc(next.text)
      if (n < 25 || n > 70) warnings.push(`section "${tok.text}" opens with ${n} words (aim for 40-60)`)
    }
  })

  // Facts and safety.
  if (meta.visa) {
    const official = meta.sources.filter((s) => OFFICIAL_HOSTS.some((h) => (s.url || '').includes(h)))
    if (official.length === 0) errors.push('a visa guide needs at least one official source (irishimmigration.ie or similar)')
  }
  for (const s of meta.sources) {
    if (!s.label || !/^https:\/\//.test(s.url || '')) errors.push(`source needs "Label | https://url | checked date": "${s.label || ''}"`)
    else if (!iso.test(s.checked || '')) errors.push(`source "${s.label}" needs the date you checked it (YYYY-MM-DD)`)
    else if (daysAgo(s.checked) > 120) warnings.push(`source "${s.label}" was checked ${Math.round(daysAgo(s.checked))} days ago`)
  }
  if (/\[NEED/i.test(body + meta.answer)) errors.push('contains an unresolved [NEED: ...] marker')
  if (/AI[- ](driven|powered)/i.test(body)) errors.push('no "AI-driven" language')
  if (/free (readiness )?assessment/i.test(body)) errors.push('never imply the assessment is free')
  if (/\bLEO\b|TechFoundHer/.test(body)) errors.push('never name LEO or TechFoundHer')
  if (/—/.test(body + meta.answer)) warnings.push('contains em dashes: rewrite them')
  if (/\bguarantee[sd]?\b/i.test(body) && !/(no|not|never|n't|cannot|can't)\W+(\w+\W+){0,3}guarantee/i.test(body))
    warnings.push('mentions "guarantee": make sure it never promises an outcome')

  const published = meta.published
  const label = published ? 'PUBLISHED' : 'draft    '
  console.log(`  ${errors.length ? '✗' : '✓'} ${label} ${slug}  title=${t} meta=${d} answer=${a}w  sections=${h2s.length}  ~${g.readingMinutes}min`)
  for (const e of errors) console.log(`      ${published ? '✗' : '·'} ${e}`)
  for (const w of warnings) console.log(`      · ${w}`)
  if (published && errors.length) hardFailures += errors.length
}

// Related slugs must exist.
const slugs = new Set(guides.map((g) => g.slug))
for (const g of guides) {
  for (const r of g.meta.related) {
    if (!slugs.has(r)) {
      console.log(`      · ${g.slug}: related guide "${r}" does not exist`)
      if (g.meta.published) hardFailures++
    }
  }
}

console.log(hardFailures ? `\n[guides] ${hardFailures} problem(s) in published guides` : '\n[guides] published guides pass')
process.exit(hardFailures ? 1 : 0)
