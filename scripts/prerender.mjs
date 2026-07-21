// Build-time prerender step: renders "/" in a real (headless) browser after
// `vite build`, then writes the resulting HTML — with real text content —
// back into dist/index.html. This is what lets bots that don't execute JS
// (many AI answer-engine crawlers) read actual page content in the raw
// initial HTML payload, rather than an empty `<div id="root"></div>` shell.
//
// Only "/" is rendered. "/admin" is intentionally left as the plain CSR
// shell — it's a private, auth-gated page that's also blocked in
// robots.txt and tagged noindex at runtime; there's nothing useful (or
// wanted) to prerender there.
//
// Known trade-off: this captures the page in its fully "settled" state
// (scroll-reveal animations complete, counters at their final numbers) —
// the best snapshot for a text-reading crawler. Real visitors' React app
// still mounts fresh on top of this (not a true hydrate), so there can be
// a brief visual reset before the entrance animations replay. Flagged to
// the team; can be hardened later (e.g. skip re-animating already-visible
// content) if it turns out to be noticeable in practice.

import { chromium } from 'playwright'
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

async function main() {
  const server = createServer((req, res) => {
    serveStatic(req, res).catch((err) => {
      res.writeHead(500)
      res.end(String(err))
    })
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const { port } = server.address()
  const url = `http://127.0.0.1:${port}/`

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 2400 } })

  console.log(`[prerender] loading ${url}`)
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })

  // Let scroll-reveal (1200ms fallback) and count-up (1500ms fallback)
  // finish settling so the snapshot has real, complete final content.
  await page.waitForTimeout(2000)

  const html = await page.content()
  await browser.close()
  await new Promise((resolve) => server.close(resolve))

  if (!html.includes('Know before you') || html.includes('id="root"></div>')) {
    throw new Error(
      'Prerendered HTML looks empty/unexpected — refusing to overwrite dist/index.html. ' +
        'Check that the app actually rendered content.',
    )
  }

  const outPath = path.join(distDir, 'index.html')
  await writeFile(outPath, html, 'utf8')
  console.log(`[prerender] wrote ${html.length.toLocaleString()} chars to dist/index.html`)
}

main().catch((err) => {
  console.error('[prerender] failed:', err)
  process.exit(1)
})
