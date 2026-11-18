import { useEffect, useRef, useState, type ReactNode } from 'react'

type From = 'up' | 'left' | 'right' | 'scale'

/**
 * Scroll-reveal wrapper — the Framer-style entrance.
 *
 * Self-contained IntersectionObserver + CSS transition (motion's
 * `whileInView` did not fire reliably here). Supports directional
 * variants and an optional blur-in, reveals as a safety fallback if IO
 * never fires, and fully respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  from = 'up',
  distance = 24,
  blur = false,
  className,
}: {
  children: ReactNode
  delay?: number
  from?: From
  distance?: number
  blur?: boolean
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)

    const fallback = window.setTimeout(() => setShown(true), 1200)

    return () => {
      io.disconnect()
      window.clearTimeout(fallback)
    }
  }, [])

  const hidden = (() => {
    switch (from) {
      case 'left':
        return `translateX(-${distance}px)`
      case 'right':
        return `translateX(${distance}px)`
      case 'scale':
        return 'scale(0.94)'
      default:
        return `translateY(${distance}px)`
    }
  })()

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? 'none' : hidden,
        filter: blur && !shown ? 'blur(8px)' : 'none',
        transition: `opacity 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.7s cubic-bezier(0.22,1,0.36,1) ${delay}s, filter 0.7s ease ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}
