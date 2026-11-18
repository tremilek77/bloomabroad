import { useEffect, useRef, useState } from 'react'

/**
 * Count-up number. The FINAL value is what's rendered in the HTML (and what
 * no-JS visitors, crawlers and reduced-motion users see), so the page can
 * never show a placeholder like "0+ years". When it scrolls into view it
 * does a short count-up that ends on that number — starting from a floor
 * above zero, never from 0.
 */
export function Counter({
  value,
  duration = 1200,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: {
  value: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') return

    // Count up from ~70% of the target, so it visibly climbs but never
    // passes through 0 (or anything that reads as a different number).
    const from = value * 0.7

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started.current) {
          started.current = true
          const start = performance.now()
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
            setDisplay(from + (value - from) * eased)
            if (t < 1) requestAnimationFrame(step)
            else setDisplay(value)
          }
          requestAnimationFrame(step)
          io.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    io.observe(el)

    return () => io.disconnect()
  }, [value, duration])

  const shown =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString()

  return (
    <span ref={ref} className={className}>
      {prefix}
      {shown}
      {suffix}
    </span>
  )
}
