import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  onOpenCookieSettings,
  readConsent,
  saveConsent,
  type Consent,
} from '@/lib/consent'

/**
 * Cookie banner + preferences panel.
 *
 * Rules this follows (Data Protection Commission guidance, per the brief):
 *  - "Accept all" and "Reject all" are identical in size, colour and position.
 *  - Nothing is pre-ticked; Marketing is off until the visitor turns it on.
 *  - No "by continuing to browse, you agree" wording.
 *  - Asks again after 6 months (the cookie expires) and logs every choice.
 *  - The footer's "Cookie settings" link reopens the panel (see lib/consent).
 *  - The banner is a bar at the bottom, never a blocking overlay, and the page
 *    gets matching bottom padding so it can't cover the Privacy or Cookie
 *    Notice text.
 */

// One class string for BOTH Accept and Reject so they can never drift apart.
const equalButton =
  'inline-flex flex-1 items-center justify-center rounded-full border border-primary bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

export function CookieConsent() {
  // undefined = not read yet (we only read after mount), null = no choice yet.
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined)
  const [panelOpen, setPanelOpen] = useState(false)
  const [marketingDraft, setMarketingDraft] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setConsent(readConsent())
    return onOpenCookieSettings(() => {
      setMarketingDraft(readConsent()?.marketing ?? false)
      setPanelOpen(true)
    })
  }, [])

  const showBar = consent === null && !panelOpen

  // Keep the page clear of the bar so it never hides any text.
  useEffect(() => {
    const root = document.documentElement
    const el = barRef.current
    if (!showBar || !el) {
      root.style.removeProperty('--cookie-bar-h')
      return
    }
    const apply = () =>
      root.style.setProperty('--cookie-bar-h', `${el.offsetHeight}px`)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => {
      ro.disconnect()
      root.style.removeProperty('--cookie-bar-h')
    }
  }, [showBar])

  // Esc closes the panel without saving anything.
  useEffect(() => {
    if (!panelOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setPanelOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panelOpen])

  function choose(marketing: boolean, action: 'accept_all' | 'reject_all' | 'save_choices') {
    setConsent(saveConsent(marketing, action))
    setPanelOpen(false)
  }

  return (
    <>
      {showBar && (
        <div
          ref={barRef}
          data-cookie-banner
          role="region"
          aria-label="Cookie choices"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.25)] backdrop-blur"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:gap-8">
            <div className="md:flex-1">
              <p className="text-sm font-semibold text-heading">Cookies on BloomAbroad</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                We use essential cookies to make our site work. With your OK,
                we'd also like to use marketing cookies to measure our ads. You
                can change your mind at any time.{' '}
                <Link
                  to="/cookies"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  Cookie Notice
                </Link>
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center md:shrink-0">
              <div className="flex gap-3 sm:w-[19rem]">
                <button
                  type="button"
                  onClick={() => choose(true, 'accept_all')}
                  className={equalButton}
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={() => choose(false, 'reject_all')}
                  className={equalButton}
                >
                  Reject all
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  setMarketingDraft(false)
                  setPanelOpen(true)
                }}
                className="px-2 py-2 text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                Manage choices
              </button>
            </div>
          </div>
        </div>
      )}

      {panelOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center"
          onMouseDown={(e) => e.target === e.currentTarget && setPanelOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-panel-title"
            className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <h2 id="cookie-panel-title" className="text-lg font-bold text-heading">
                Manage your cookie choices
              </h2>
              <button
                type="button"
                aria-label="Close without saving"
                onClick={() => setPanelOpen(false)}
                className="rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 divide-y divide-border rounded-xl border border-border">
              <Category
                title="Essential"
                status="Always on"
                text="Needed for the site to work, such as remembering your cookie choice, keeping forms secure and keeping you signed in."
              />
              <Category
                title="Marketing"
                status={marketingDraft ? 'On' : 'Off'}
                text="Helps us measure whether our ads reach the right people."
                toggle={{
                  checked: marketingDraft,
                  onChange: setMarketingDraft,
                }}
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/cookies"
                onClick={() => setPanelOpen(false)}
                className="text-sm font-medium text-primary underline underline-offset-4"
              >
                Cookie Notice
              </Link>
              <button
                type="button"
                onClick={() => choose(marketingDraft, 'save_choices')}
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Save my choices
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Category({
  title,
  status,
  text,
  toggle,
}: {
  title: string
  status: string
  text: string
  toggle?: { checked: boolean; onChange: (v: boolean) => void }
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-4">
      <div>
        <p className="text-sm font-semibold text-heading">
          {title}{' '}
          <span className="ml-1 text-xs font-medium text-muted-foreground">{status}</span>
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
      </div>
      {toggle ? (
        <button
          type="button"
          role="switch"
          aria-checked={toggle.checked}
          aria-label={`${title} cookies`}
          onClick={() => toggle.onChange(!toggle.checked)}
          className={cn(
            'relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-colors',
            toggle.checked ? 'border-primary bg-primary' : 'border-border bg-muted',
          )}
        >
          <span
            className={cn(
              'absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-all',
              toggle.checked ? 'left-[1.4rem]' : 'left-0.5',
            )}
            style={{ width: '1.1rem', height: '1.1rem' }}
          />
        </button>
      ) : (
        <span
          aria-hidden
          className="relative mt-0.5 h-6 w-11 shrink-0 rounded-full border border-primary/40 bg-primary/40"
        >
          <span
            className="absolute left-[1.4rem] top-0.5 rounded-full bg-white shadow"
            style={{ width: '1.1rem', height: '1.1rem' }}
          />
        </span>
      )}
    </div>
  )
}
