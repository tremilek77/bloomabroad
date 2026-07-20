import { useEffect, useState } from 'react'

/**
 * Thin lime progress bar pinned to the very top, tracking scroll depth.
 * Uses a passive scroll listener + rAF (no motion viewport hooks).
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const h = document.documentElement
        const max = h.scrollHeight - h.clientHeight
        setPct(max > 0 ? (h.scrollTop / max) * 100 : 0)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[3px] bg-transparent"
    >
      <div
        className="h-full origin-left bg-primary"
        style={{
          transform: `scaleX(${pct / 100})`,
          boxShadow: '0 0 12px 0 var(--primary)',
        }}
      />
    </div>
  )
}
