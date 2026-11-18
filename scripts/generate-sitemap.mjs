// Writes public/sitemap.xml from the real routes, so it can't drift.
// Runs first in `npm run build`. Only indexable pages are listed: published
// guides (never drafts), and the guides hub once there is at least one.

import { readFileSync, writeFileSync } from 'node:fs'
import { loadGuides } from './lib/guides.mjs'
import { isReady } from './lib/flags.mjs'

const company = readFileSync(new URL('../src/lib/company.ts', import.meta.url), 'utf8')
const SITE_URL = company.match(/SITE_URL\s*=\s*'([^']+)'/)?.[1]?.replace(/\/$/, '')
if (!SITE_URL) throw new Error('SITE_URL not found in src/lib/company.ts')

const pages = [
  ['/', 'weekly', '1.0'],
  ['/students', 'monthly', '0.9'],
  ['/universities', 'monthly', '0.9'],
  ['/pricing', 'monthly', '0.8'],
  ['/checklist', 'monthly', '0.8'],
  ['/verify', 'yearly', '0.5'],
  ['/contact', 'yearly', '0.5'],
  ['/privacy', 'yearly', '0.3'],
  ['/terms', 'yearly', '0.3'],
  ['/complaints', 'yearly', '0.3'],
  ['/cookies', 'yearly', '0.3'],
].map(([path, changefreq, priority]) => ({ path, changefreq, priority }))

if (isReady('about')) pages.push({ path: '/about', changefreq: 'yearly', priority: '0.6' })

const guides = loadGuides({ includeDrafts: false })
if (guides.length) {
  pages.push({ path: '/guides', changefreq: 'weekly', priority: '0.7' })
  for (const g of guides) {
    pages.push({
      path: `/guides/${g.slug}`,
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: g.meta.reviewed,
    })
  }
}

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages
    .map(
      (p) =>
        `  <url>\n    <loc>${SITE_URL}${p.path === '/' ? '/' : p.path}</loc>\n` +
        (p.lastmod ? `    <lastmod>${p.lastmod}</lastmod>\n` : '') +
        `    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`,
    )
    .join('') +
  '</urlset>\n'

writeFileSync(new URL('../public/sitemap.xml', import.meta.url), xml)
console.log(`[sitemap] ${pages.length} URLs written (${guides.length} published guide${guides.length === 1 ? '' : 's'})`)
