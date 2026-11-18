// Lists every company detail in src/lib/company.ts that is still an unfilled
// [placeholder]. Run automatically at the end of `npm run build`.
//
// It only WARNS (exit 0): the site should still build while details are being
// gathered. But the warning is loud, because an unfilled value shows up on the
// live Privacy Notice, Terms, Contact page and footer as highlighted brackets.

import { readFile } from 'node:fs/promises'

const file = new URL('../src/lib/company.ts', import.meta.url)
const src = await readFile(file, 'utf8')

const unresolved = [...src.matchAll(/^\s*(\w+):\s*'(\[[^']*\])'/gm)].map((m) => ({
  key: m[1],
  value: m[2],
}))

if (unresolved.length === 0) {
  console.log('[placeholders] ✓ none — every company detail is filled in.')
} else {
  console.warn(`\n[placeholders] ⚠ ${unresolved.length} unfilled in src/lib/company.ts:`)
  for (const { key, value } of unresolved) {
    console.warn(`    ${key.padEnd(20)} ${value}`)
  }
  console.warn(
    '  These appear as highlighted [brackets] on /privacy, /terms, /contact and the\n' +
      '  footer. Fill them in before the pages go public.\n',
  )
}
