// Checks docs/copy-deck.md against the SEO/AEO length rules and the brief's wording rules.
//   node scripts/check-copy.mjs
// Exits 1 on any failure so it can gate a build later.

import { readFileSync } from 'node:fs'

const text = readFileSync(new URL('../docs/copy-deck.md', import.meta.url), 'utf8')
const lines = text.split('\n')

const rules = [
  { key: 'Title', min: 50, max: 60, unit: 'chars', count: (s) => [...s].length },
  { key: 'Meta', min: 150, max: 160, unit: 'chars', count: (s) => [...s].length },
  { key: 'Answer', min: 40, max: 60, unit: 'words', count: (s) => s.split(/\s+/).filter(Boolean).length },
]

let failures = 0
let section = ''
for (const line of lines) {
  if (line.startsWith('## ')) section = line.slice(3)
  const m = line.match(/^- \*\*(Title|Meta|Answer):\*\* (.+)$/)
  if (!m) continue
  const rule = rules.find((r) => r.key === m[1])
  const value = m[2].replace(/`\[NEED[^\]]*\]`/g, '').trim()
  const n = rule.count(value)
  const ok = n >= rule.min && n <= rule.max
  if (!ok) failures++
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${rule.key.padEnd(6)} ${String(n).padStart(3)} ${rule.unit} (${rule.min}-${rule.max})  [${section.slice(0, 28)}]`)
}

// Wording rules from the brief (Fix 9 / wording rules). Checked on copy lines only.
const banned = [
  [/AI[- ](driven|powered)/i, 'no "AI-driven" language'],
  [/guarantee[ds]?\b/i, 'guarantee wording (only allowed negated, check context)'],
  [/free (assessment|readiness assessment)/i, 'never imply the assessment is free'],
  [/\bLEO\b|TechFoundHer/i, 'never name LEO or TechFoundHer'],
  [/—/, 'em dash in copy'],
]
console.log('\nWording check (review each hit, negated "no guarantee" lines are fine):')
let hits = 0
lines.forEach((l, i) => {
  // Rule text and negated lines ("never guarantee") will hit too, so these are for review, not failure.
  for (const [re, why] of banned) {
    if (re.test(l)) {
      hits++
      console.log(`  line ${i + 1}: ${why}\n    ${l.trim().slice(0, 140)}`)
    }
  }
})
console.log(`\n${failures} length failure(s), ${hits} wording hit(s) to review.`)
process.exit(failures ? 1 : 0)
