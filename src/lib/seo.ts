import { useEffect } from 'react'
import { SITE_URL } from './company'

/**
 * Injects <meta name="robots" content="noindex,nofollow"> while the
 * calling component is mounted, and removes it on unmount.
 *
 * Only helps crawlers that execute JS (e.g. Googlebot) — non-JS bots never
 * see this since it's added at runtime. The primary defense against those
 * is robots.txt's `Disallow`, which stops compliant crawlers from fetching
 * the page at all. Use both together.
 */
export function useNoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => {
      document.head.removeChild(meta)
    }
  }, [])
}

type PageMeta = {
  title: string
  description: string
  /** Route path, e.g. "/privacy". Used for the canonical URL. */
  path: string
  noindex?: boolean
}

/**
 * Sets the page <title>, description, canonical URL and social tags for the
 * current route, and puts the previous values back when the page unmounts.
 *
 * Because the build-time prerender captures the live DOM, whatever this sets
 * is baked into each page's static HTML — so crawlers that don't run JS see
 * the right title and canonical for every route, not the homepage's.
 */
export function usePageMeta({ title, description, path, noindex = false }: PageMeta) {
  useEffect(() => {
    const undo: Array<() => void> = []

    const prevTitle = document.title
    document.title = title
    undo.push(() => {
      document.title = prevTitle
    })

    const upsert = (
      selector: string,
      create: () => HTMLElement,
      attr: 'content' | 'href',
      value: string,
    ) => {
      let el = document.head.querySelector<HTMLElement>(selector)
      const created = !el
      if (!el) {
        el = create()
        document.head.appendChild(el)
      }
      const node = el
      const prev = node.getAttribute(attr)
      node.setAttribute(attr, value)
      undo.push(() => {
        if (created) node.remove()
        else if (prev === null) node.removeAttribute(attr)
        else node.setAttribute(attr, prev)
      })
    }

    const named = (name: string) => () => {
      const m = document.createElement('meta')
      m.setAttribute('name', name)
      return m
    }
    const property = (prop: string) => () => {
      const m = document.createElement('meta')
      m.setAttribute('property', prop)
      return m
    }
    const url = `${SITE_URL}${path}`

    upsert('meta[name="description"]', named('description'), 'content', description)
    upsert(
      'link[rel="canonical"]',
      () => {
        const l = document.createElement('link')
        l.rel = 'canonical'
        return l
      },
      'href',
      url,
    )
    upsert('meta[property="og:title"]', property('og:title'), 'content', title)
    upsert('meta[property="og:description"]', property('og:description'), 'content', description)
    upsert('meta[property="og:url"]', property('og:url'), 'content', url)
    upsert('meta[property="og:type"]', property('og:type'), 'content', 'website')
    if (noindex) {
      upsert('meta[name="robots"]', named('robots'), 'content', 'noindex, nofollow')
    }

    return () => {
      undo.reverse().forEach((fn) => fn())
    }
  }, [title, description, path, noindex])
}
