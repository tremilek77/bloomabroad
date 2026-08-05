import { createContext, useContext, useState, type ReactNode } from 'react'

export type Audience = 'universities' | 'students'

type AudienceContextValue = {
  /** Which audience's content is shown across the site. */
  audience: Audience
  setAudience: (a: Audience) => void
  /** Whether the visitor has picked a branch on the selector hero yet. */
  chosen: boolean
  /** Pick a branch: sets the audience AND reveals its hero. */
  choose: (a: Audience) => void
  /** Return to the centralized selector. */
  reset: () => void
}

const AudienceContext = createContext<AudienceContextValue | null>(null)

/**
 * The selector and both branch heroes occupy the same slot (#top) and swap
 * via `hidden`, not unmount/remount — so switching between them never moves
 * scroll position on its own. On mobile, if a visitor had scrolled down
 * within the selector (or a branch hero) before switching, the new section
 * would render starting mid-way down the viewport instead of from its top.
 * Scroll #top into view on every choose()/reset() to fix that.
 */
function scrollToTop() {
  const el = document.getElementById('top')
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

export function AudienceProvider({ children }: { children: ReactNode }) {
  // `audience` defaults to 'universities' so the follow-up sections (and the
  // prerender snapshot) have real content even before a choice is made.
  const [audience, setAudience] = useState<Audience>('universities')
  const [chosen, setChosen] = useState(false)

  function choose(a: Audience) {
    setAudience(a)
    setChosen(true)
    scrollToTop()
  }

  function reset() {
    setChosen(false)
    scrollToTop()
  }

  return (
    <AudienceContext.Provider
      value={{ audience, setAudience, chosen, choose, reset }}
    >
      {children}
    </AudienceContext.Provider>
  )
}

export function useAudience() {
  const ctx = useContext(AudienceContext)
  if (!ctx) throw new Error('useAudience must be used within an AudienceProvider')
  return ctx
}
