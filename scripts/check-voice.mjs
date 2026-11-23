// Build-time voice check: flags the patterns that make copy read as machine-written.
//   node scripts/check-voice.mjs
// Runs after the prerender, on the marketing pages in dist/. Rules come from the
// copywriting skill's AI-tells list (references/ai-tells.md). It fails the build
// on the hard bans and prints warnings for the "cap" patterns.
//
// What it cannot do: tell you how an AI detector will score a page. Those tools
// are unreliable and disagree with each other. This catches the known tells and
// reports sentence-length variety, which detectors lean on. Real specifics from
// the client (their story, numbers, quotes) do more for a human voice than any
// rewording.

import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')

// Marketing pages only. Legal text is approved wording and stays as it is.
// The contact page is the client's own supplied wording, so it is left alone too.
const SKIP = new Set(['privacy.html', 'terms.html', 'cookies.html', 'complaints.html', 'contact.html', 'old.html'])
const files = []
for (const f of await readdir(dist)) if (f.endsWith('.html') && !SKIP.has(f)) files.push(f)
try {
  for (const f of await readdir(path.join(dist, 'guides'))) if (f.endsWith('.html')) files.push(`guides/${f}`)
} catch {
  /* no guides published */
}

const BANS = [
  [/\b(?:it'?s|it is|this is|that'?s|this isn'?t|it isn'?t|isn'?t)\s+not\b[^.?!]{0,80}[,;]\s*(?:it'?s|but|it is)\b/i, 'contrast reveal ("it is not X, it is Y")'],
  [/\bnot (?:just|only|merely)\b[^.?!]{0,80}\bbut\b/i, 'contrast reveal ("not just X, but Y")'],
  [/\bnot because\b[^.?!]{0,100}[.]\s*because\b/i, 'contrast reveal ("Not because X. Because Y.")'],
  [/\bnot an? [^.?!,]{2,40}\.\s+(?:a|an|it'?s|it is)\b/i, 'denial then reveal ("Not a X. A Y.")'],
  [/\bno [a-z' -]{2,28},\s*no [a-z' -]{2,28}/i, 'negation list ("no X, no Y")'],
  [/\bwithout [a-z' -]{2,28},\s*without\b/i, 'negation list ("without X, without Y")'],
  [/\b(?:the (?:result|catch|best part|secret|truth|upshot|bottom line)\??:|here'?s the (?:thing|catch|secret|truth)|let me be clear|here'?s why)/i, 'self-answered question or colon reveal'],
  [/\b(?:in today'?s|whether you'?re|say goodbye|say hello to|imagine (?:never|a world|if)|when it comes to|let'?s dive|it'?s worth noting|in conclusion|at the end of the day|take it to the next level|the future of|game-?changer)\b/i, 'stock opener or marketing phrase'],
  [/\b(?:moreover|additionally|furthermore|importantly|ultimately)\b/i, 'filler transition'],
  [/\b(?:delve|tapestry|testament to|realm|embark|beacon|multifaceted|paradigm|synergy|myriad|plethora|meticulous|intricate|utili[sz]e|leverage|supercharge|turbocharge|seamless(?:ly)?|robust|streamline|empower|elevate|unlock|unleash|harness|foster|cutting-edge|innovative|revolutionary|holistic|pivotal|crucial|world-class|best-in-class)\b/i, 'banned vocabulary'],
  [/\b(?:trusted by industry leaders|experts agree|studies show)\b/i, 'weasel source'],
  [/—/, 'em dash'],
  [/!/, 'exclamation point'],
]

// Absolute wording. Allowed only where the client's brief says it (see docs/client-claims.md).
const ABSOLUTE = /\b(always|never|guarantee[sd]?|100%|everyone|no one|best|leading|proven|certain(?:ly)?|definitely|zero)\b/i
const CLIENT_ABSOLUTES = [
  /never ask you for money/i,
  /never (?:handle|take payment|sell|by bank transfer)/i,
  /(?:doesn't|does not|don't) guarantee/i,
  /no one can (?:promise|guarantee)/i,
  /guarantee any outcome|promise or guarantee/i,
  /never (?:be )?pre-?ticked/i,
  /never describe/i,
  /always check (?:the )?official/i,
  /always see the exact amount/i,
  /never ask you to pay/i,
  /what we will never do/i,
  /same price, every outcome/i,
  /\b(?:says|said|states|told)\b/i, // attributed to a named source
]

// Words that are fine in context but the broad regex above would catch.
const ALLOW = [/the future of (?:studying|their|your)/i]

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>|<head[\s\S]*?<\/head>/g, ' ')
    // Layout and form chrome: not copy.
    .replace(/<(?:button|label|option|select|input|textarea)[\s\S]*?(?:<\/(?:button|label|option|select|textarea)>|>)/g, ' ')
    .replace(/<\/(?:p|li|h[1-6]|div|section|dt|dd|tr|td|th|summary|a)>|<br\s*\/?>/g, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

const words = (s) => s.split(/\s+/).filter(Boolean).length
const mean = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1)
const sd = (a) => {
  const m = mean(a)
  return Math.sqrt(mean(a.map((x) => (x - m) ** 2)))
}

let failures = 0
let warnings = 0
const report = []

for (const f of files.sort()) {
  const html = await readFile(path.join(dist, f), 'utf8')
  const body = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<svg[\s\S]*?<\/svg>|<head[\s\S]*?<\/head>|<footer[\s\S]*?<\/footer>|<header[\s\S]*?<\/header>/g, ' ')
  // Copy lives in headings, paragraphs, list items and definitions. Buttons, labels and nav are chrome.
  const blocks = [
    ...new Set(
      [...body.matchAll(/<(p|li|dd|h[1-3]|summary)\b[^>]*>([\s\S]*?)<\/\1>/g)]
        .map((m) => strip(m[2]).replace(/\s+/g, ' ').trim())
        .filter((t) => t.length > 2),
    ),
  ]
  const lines = blocks
  const prose = [...new Set(
    [...body.matchAll(/<(p|dd)\b[^>]*>([\s\S]*?)<\/\1>/g)]
      .map((m) => strip(m[2]).replace(/\s+/g, ' ').trim())
      .filter((t) => words(t) >= 6),
  )]
  const split = (l) => l.split(/(?<=[.?!])\s+(?=[A-Z"'(])/).filter((s) => words(s) >= 2)

  // Sentences in running prose, for the cap checks.
  const sentences = prose.flatMap(split)

  const hits = []
  for (const line of lines) {
    for (const [re, why] of BANS) {
      const m = line.match(re)
      if (m && !ALLOW.some((a) => a.test(line))) hits.push({ why, text: line.slice(Math.max(0, m.index - 30), m.index + 90) })
    }
  }

  const warn = []
  // Absolute claims are only for things the client's brief states outright. Anything else should be
  // attributed ("the Immigration Service says") or softened. Flagged for review, not failed.
  for (const line of lines) {
    for (const sent of split(line)) {
      if (ABSOLUTE.test(sent) && !CLIENT_ABSOLUTES.some((re) => re.test(sent)))
        warn.push(`absolute claim, check the brief says it: ${sent.slice(0, 110)}`)
    }
  }
  const long = sentences.filter((s) => words(s) > 32)
  for (const s of long) warn.push(`long sentence (${words(s)} words): ${s.slice(0, 90)}…`)
  // Trailing pile-on: a sentence over 20 words with 3+ commas.
  for (const s of sentences) {
    if (words(s) > 20 && (s.match(/,/g) ?? []).length >= 4) warn.push(`possible trailing pile-on: ${s.slice(0, 100)}…`)
  }
  // Staccato run: three or more sentences of five words or fewer in a row.
  for (const para of prose) {
    let run = 0
    for (const s of split(para)) {
      run = words(s) <= 5 ? run + 1 : 0
      if (run === 3) warn.push(`staccato run in: ${para.slice(0, 80)}`)
    }
  }
  const lens = sentences.map(words)
  const m = mean(lens)
  const s = sd(lens)

  report.push({ f, n: sentences.length, m, s })
  if (hits.length || warn.length) console.log(`\n${f}`)
  for (const h of hits) {
    failures++
    console.log(`  ✗ ${h.why}: …${h.text}…`)
  }
  for (const w of warn) {
    warnings++
    console.log(`  · ${w}`)
  }
}

console.log('\nSentence length (words): mean ± spread. Very low spread reads as uniform, which detectors notice.')
for (const r of report) console.log(`  ${r.f.padEnd(34)} ${String(r.n).padStart(3)} sentences  ${r.m.toFixed(1)} ± ${r.s.toFixed(1)}`)

console.log(
  failures
    ? `\n[voice] ${failures} tell(s) to fix, ${warnings} warning(s)`
    : `\n[voice] no hard tells found, ${warnings} warning(s)`,
)
process.exit(failures ? 1 : 0)
