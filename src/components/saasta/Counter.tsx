import { useEffect, useRef, useState } from 'react'

/**
 * Count-up number that animates from 0 → value when scrolled into view.
 * IntersectionObserver + rAF (reliable here, unlike motion's whileInView).
 * Respects prefers-reduced-motion (shows final value immediately).
 */
export function Counter({
  value,
  duration = 1500,
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
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setDisplay(value)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !started.current) {
          started.current = true
          const start = performance.now()
          const step = (now: number) => {
            const t = Math.min(1, (now - start) / duration)
            const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
            setDisplay(value * eased)
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

    // Safety: reveal final value if IO never fires.
    const fallback = window.setTimeout(() => {
      if (!started.current) setDisplay(value)
    }, 1500)

    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
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
