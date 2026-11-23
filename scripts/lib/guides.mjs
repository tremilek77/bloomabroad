// Loads the guides in src/content/guides/*.md.
//
// One loader, used by everything that needs guides, so they cannot disagree:
//   - the Vite plugin (feeds the site)
//   - scripts/check-guides.mjs (the editorial rules)
//   - scripts/prerender.mjs and scripts/generate-sitemap.mjs (routes)
//
// A guide is a markdown file with a small front-matter block:
//
//   ---
//   title: SEO title, 50-60 characters
//   h1: The page heading
//   description: Meta description, 150-160 characters
//   answer: The 40-60 word answer shown first and quoted by search and AI assistants
//   audience: students            (or: universities)
//   keyword: the target search
//   published: false              (drafts are hidden on the live site)
//   datePublished: 2026-11-20
//   reviewed: 2026-11-20          (the "last reviewed" date, shown on the page)
//   visa: true                    (adds the visa disclaimer; needs an official source)
//   sources:
//     - Label | https://official.url | 2026-11-18   (the date you checked it)
//   related:
//     - another-guide-slug
//   ---
//   ...markdown body, H2 headings only (no H1)...
//
// Files starting with "_" (such as _template.md) are ignored.

import { readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Marked } from 'marked'

export const GUIDES_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'src',
  'content',
  'guides',
)

/** Parse the front-matter block. Supports `key: value` and `key:` + `  - item` lists. */
export function parseFrontmatter(raw) {
  const m = raw.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!m) return { data: {}, body: raw }
  const data = {}
  let listKey = null
  for (const line of m[1].split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const item = line.match(/^\s+-\s+(.*)$/)
    if (item && listKey) {
      data[listKey].push(item[1].trim())
      continue
    }
    const kv = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/)
    if (!kv) continue
    const [, key, rawVal] = kv
    if (rawVal === '') {
      data[key] = []
      listKey = key
      continue
    }
    listKey = null
    let v = rawVal.trim().replace(/^(["'])(.*)\1$/, '$2')
    data[key] = v === 'true' ? true : v === 'false' ? false : v
  }
  return { data, body: m[2] }
}

export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&[a-z]+;/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const stripTags = (h) => h.replace(/<[^>]+>/g, '')

const marked = new Marked({
  gfm: true,
  renderer: {
    heading({ tokens, depth }) {
      const text = this.parser.parseInline(tokens)
      return `<h${depth} id="${slugify(stripTags(text))}">${text}</h${depth}>\n`
    },
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens)
      const external = /^https?:/.test(href)
      return `<a href="${href}"${title ? ` title="${title}"` : ''}${
        external ? ' target="_blank" rel="noopener noreferrer"' : ''
      }>${text}</a>`
    },
  },
})

const words = (s) => s.split(/\s+/).filter(Boolean).length

/** "Label | url | 2026-11-18" -> { label, url, checked } */
export function parseSource(line) {
  const [label, url, checked] = line.split('|').map((x) => x.trim())
  return { label, url, checked }
}

/**
 * All guides. Drafts (`published: false`) are included only when asked, which
 * is for the dev server and for Vercel preview builds (VITE_SHOW_DRAFTS=1),
 * never for the production site.
 */
export function loadGuides({ includeDrafts = false } = {}) {
  let files = []
  try {
    files = readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'))
  } catch {
    return []
  }
  const guides = files.map((file) => {
    const raw = readFileSync(path.join(GUIDES_DIR, file), 'utf8')
    const { data, body } = parseFrontmatter(raw)
    const slug = file.replace(/\.md$/, '')
    const tokens = marked.lexer(body)
    const headings = tokens
      .filter((t) => t.type === 'heading')
      .map((t) => ({ depth: t.depth, text: t.text, id: slugify(t.text) }))
    return {
      slug,
      file,
      meta: {
        title: data.title ?? '',
        h1: data.h1 ?? '',
        description: data.description ?? '',
        answer: data.answer ?? '',
        audience: data.audience ?? 'students',
        keyword: data.keyword ?? '',
        published: data.published === true,
        datePublished: data.datePublished ?? '',
        reviewed: data.reviewed ?? '',
        visa: data.visa === true,
        sources: Array.isArray(data.sources) ? data.sources.map(parseSource) : [],
        related: Array.isArray(data.related) ? data.related : [],
      },
      body,
      tokens,
      headings,
      html: marked.parser(tokens),
      readingMinutes: Math.max(1, Math.round(words(body) / 220)),
    }
  })
  return guides
    .filter((g) => includeDrafts || g.meta.published)
    .sort((a, b) => (b.meta.datePublished || '').localeCompare(a.meta.datePublished || ''))
}

export const showDraftsFromEnv = () => process.env.VITE_SHOW_DRAFTS === '1'
