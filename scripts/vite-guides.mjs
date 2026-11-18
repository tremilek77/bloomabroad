// Vite plugin: exposes the guides to the site as two virtual modules.
//
//   virtual:guides-meta  small list of each guide's details (hub, nav, links)
//   virtual:guides-html  each guide's rendered body, loaded only on guide pages
//
// Drafts are included in dev and on builds with VITE_SHOW_DRAFTS=1 (Vercel
// preview deployments), and left out of the production site.

import { GUIDES_DIR, loadGuides, showDraftsFromEnv } from './lib/guides.mjs'

const META = 'virtual:guides-meta'
const HTML = 'virtual:guides-html'

export function guidesPlugin() {
  let includeDrafts = false
  return {
    name: 'bloomabroad-guides',
    configResolved(config) {
      includeDrafts = config.command === 'serve' || showDraftsFromEnv()
    },
    resolveId(id) {
      if (id === META || id === HTML) return '\0' + id
    },
    load(id) {
      if (id !== '\0' + META && id !== '\0' + HTML) return
      const guides = loadGuides({ includeDrafts })
      if (id === '\0' + META) {
        const meta = guides.map((g) => ({
          slug: g.slug,
          ...g.meta,
          headings: g.headings.filter((h) => h.depth === 2),
          readingMinutes: g.readingMinutes,
        }))
        return `export default ${JSON.stringify(meta)}`
      }
      const html = Object.fromEntries(guides.map((g) => [g.slug, g.html]))
      return `export default ${JSON.stringify(html)}`
    },
    // Editing a guide in dev reloads the page.
    configureServer(server) {
      server.watcher.add(GUIDES_DIR)
    },
    handleHotUpdate({ file, server }) {
      if (file.startsWith(GUIDES_DIR) && file.endsWith('.md')) {
        for (const id of [META, HTML]) {
          const mod = server.moduleGraph.getModuleById('\0' + id)
          if (mod) server.moduleGraph.invalidateModule(mod)
        }
        server.ws.send({ type: 'full-reload' })
        return []
      }
    },
  }
}
