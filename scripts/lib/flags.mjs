// Reads the READY flags in src/content/site.ts, so build scripts (sitemap,
// prerender, SEO check) agree with the site about which pages are live.
import { readFileSync } from 'node:fs'

const src = readFileSync(new URL('../../src/content/site.ts', import.meta.url), 'utf8')

/** True if `flag` is switched on in the READY block. */
export const isReady = (flag) => new RegExp(`\b${flag}:\s*true\b`).test(src)
