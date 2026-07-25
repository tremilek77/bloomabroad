import { useEffect } from 'react'

/**
 * Injects <meta name="robots" content="noindex,nofollow"> while the
 * calling component is mounted, and removes it on unmount.
 *
 * Only helps crawlers that execute JS (e.g. Googlebot) — non-JS bots never
 * see this since it's added at runtime. The primary defense against those
 * is robots.txt's `Disallow: /admin`, which stops compliant crawlers from
 * fetching the page at all. Use both together.
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
