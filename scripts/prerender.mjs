// Build-time prerender step: renders each public page in a real (headless)
// browser after `vite build`, then writes the resulting HTML — with real text
// content, and the page's own <title>, description and canonical URL — to a
// static file. This is what lets bots that don't execute JS (many AI
// answer-engine crawlers) read actual page content in the raw initial HTML
// payload, rather than an empty `<div id="root"></div>` shell.
//
// Output (flat files; vercel.json has `cleanUrls: true`, so /privacy serves
// privacy.html):  dist/index.html, dist/privacy.html, dist/terms.html, ...
//
// Left as the plain client-rendered shell on purpose: "/admin" and "/confirm"
// (private / token pages, noindex + robots-disallowed) — nothing useful to
// prerender there.
//
// To add a page: add it to ROUTES below. `expect` is a phrase that must be in
// the rendered HTML — if it isn't, the page didn't render properly and that
// file is NOT written (the site still works, as a client-rendered page).
//
// Known trade-off: this captures the page in its fully "settled" state
// (scroll-reveal animations complete, counters at their final numbers) —
// the best snapshot for a text-reading crawler. Real visitors' React app
// still mounts fresh on top of this (not a true hydrate), so there can be
// a brief visual reset before the entrance animations replay. Flagged to
// the team; can be hardened later (e.g. skip re-animating already-visible
// content) if it turns out to be noticeable in practice.

import { createServer } from 'node:http'
import { readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '..', 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.woff2': 'font/woff2',
}

// Launch a headless Chromium. On Vercel (Amazon Linux build container),
// Playwright's own browser binary isn't present and system libs are
// missing, so we use @sparticuz/chromium — a Chromium build bundled with
// the required .so libraries for exactly this environment — driven by
// playwright-core. Locally (Windows/macOS dev), we use the full Playwright
// package's downloaded browser, with a fallback to sparticuz.
async function launchSparticuz() {
  const [{ default: sparticuz }, { chromium }] = await Promise.all([
    import('@sparticuz/chromium'),
    import('playwright-core'),
  ])
  const executablePath = await sparticuz.executablePath()
  if (!executablePath) {
    throw new Error('@sparticuz/chromium executablePath() returned empty')
  }
  console.log('[prerender] using @sparticuz/chromium at', executablePath)
  return chromium.launch({
    args: sparticuz.args,
    executablePath,
    headless: true,
  })
}

async function launchBrowser() {
  if (process.env.VERCEL) return launchSparticuz()
  try {
    const { chromium } = await import('playwright')
    return await chromium.launch()
  } catch (err) {
    console.warn(
      '[prerender] local Playwright launch failed, falling back to @sparticuz/chromium:',
      err.message,
    )
    return launchSparticuz()
  }
}

async function serveStatic(req, res) {
  const urlPath = decodeURIComponent(req.url.split('?')[0])
  let filePath = path.join(distDir, urlPath)

  try {
    const s = await stat(filePath)
    if (s.isDirectory()) filePath = path.join(distDir, 'index.html')
  } catch {
    filePath = path.join(distDir, 'index.html') // SPA fallback, matches vercel.json
  }

  try {
    const data = await readFile(filePath)
    const ext = path.extname(filePath)
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    res.end(data)
  } catch {
    res.writeHead(404)
    res.end('Not found')
  }
}

const ROUTES = [
  { route: '/', file: 'index.html', expect: 'What is enrolment readiness', settle: 2000 },
  { route: '/students', file: 'students.html', expect: 'Four steps to a clear answer', settle: 2000 },
  { route: '/universities', file: 'universities.html', expect: 'Four steps. One clear answer.', settle: 2000 },
  { route: '/checklist', file: 'checklist.html', expect: 'Question 1 of 8', settle: 1500 },
  { route: '/pricing', file: 'pricing.html', expect: 'Founding member offer', settle: 1500 },
  { route: '/verify', file: 'verify.html', expect: 'Where to find us', settle: 1500 },
  { route: '/privacy', file: 'privacy.html', expect: 'The short version', settle: 800 },
  { route: '/terms', file: 'terms.html', expect: 'What BloomAbroad is not', settle: 800 },
  { route: '/contact', file: 'contact.html', expect: 'Making sure it', settle: 800 },
  { route: '/complaints', file: 'complaints.html', expect: 'How to make a complaint', settle: 800 },
  { route: '/cookies', file: 'cookies.html', expect: 'The cookies we set', settle: 800 },
  // The archived backup: prerendered so its noindex tag is in the static HTML.
  { route: '/old', file: 'old.html', expect: 'archived copy', settle: 2000 },
]

/** Render one route and return its final HTML. Throws if it looks wrong. */
async function renderRoute(browser, baseUrl, { route, expect, settle }) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 2400 } })
  try {
    await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 30000 })

    // Let scroll-reveal animations settle so the snapshot is complete.
    await page.waitForTimeout(settle)

    // The cookie banner appears for any visitor with no saved choice, which
    // is every fresh browser — including this one. It's per-visitor UI, not
    // page content, so it must not be baked into the static HTML.
    await page.evaluate(() => {
      document.querySelectorAll('[data-cookie-banner]').forEach((el) => el.remove())
      const root = document.documentElement
      root.style.removeProperty('--cookie-bar-h')
      if (!root.getAttribute('style')) root.removeAttribute('style')
    })

    const html = await page.content()
    if (!html.includes(expect) || html.includes('id="root"></div>')) {
      throw new Error(`rendered HTML is missing "${expect}" (or #root is empty)`)
    }
    return html
  } finally {
    await page.close()
  }
}

async function main() {
  const server = createServer((req, res) => {
    serveStatic(req, res).catch((err) => {
      res.writeHead(500)
      res.end(String(err))
    })
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address()
  const baseUrl = `http://127.0.0.1:${port}`

  const browser = await launchBrowser()

  // Render EVERY route first and only then write files, so each route loads
  // the original (empty) shell rather than a half-prerendered one.
  const results = []
  for (const spec of ROUTES) {
    try {
      console.log(`[prerender] rendering ${spec.route}`)
      results.push({ spec, html: await renderRoute(browser, baseUrl, spec) })
    } catch (err) {
      // One broken page must not stop the others, or the deploy.
      console.error(
        `[prerender] ✗ ${spec.route} FAILED — it will be served as a plain client-rendered page: ${err.message}`,
      )
      results.push({ spec, html: null })
    }
  }

  await browser.close()
  await new Promise((resolve) => server.close(resolve))

  let ok = 0
  for (const { spec, html } of results) {
    if (!html) continue
    await writeFile(path.join(distDir, spec.file), html, 'utf8')
    console.log(
      `[prerender] ✓ ${spec.route} -> dist/${spec.file} (${html.length.toLocaleString()} chars)`,
    )
    ok++
  }

  if (ok === ROUTES.length) {
    console.log(`[prerender] ✓ SUCCESS — all ${ok} pages prerendered`)
  } else {
    console.error(
      `[prerender] ✗ PARTIAL — ${ok} of ${ROUTES.length} pages prerendered. ` +
        'The rest still work for visitors, but crawlers see an empty shell for them.',
    )
  }
}

main().catch((err) => {
  // Non-fatal by design: a prerender failure must NOT block the deploy.
  // The site still ships as a normal client-rendered SPA (fully functional
  // for humans) — only the crawler-facing initial HTML is affected. This
  // loud marker is what to look for in the Vercel build log.
  console.error(
    '\n[prerender] ✗ FAILED — deploying as a client-rendered SPA instead.\n' +
      '            The app works for visitors, but crawlers/AI engines will see\n' +
      '            the empty shell until this is resolved. Error:\n',
    err,
  )
  process.exit(0)
})
