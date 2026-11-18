import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BloomMark } from './Logo'
import { useOptionalAudience, type Audience } from './audience'
import { openCookieSettings } from '@/lib/consent'
import { COMPANY, SOCIALS } from '@/lib/company'

/**
 * Sitewide footer (brief, Fix 4). Rendered on every public page.
 *
 * The brief's link list includes About, Pricing and "Verify it's us", which
 * are P1/P2 pages that don't exist yet. They're listed here with
 * `ready: false` so nothing links to a dead page; flip each to `true` as its
 * page ships.
 */
const SITE_LINKS: { label: string; href: string; ready: boolean }[] = [
  { label: 'About', href: '/about', ready: false },
  { label: 'Pricing', href: '/pricing', ready: false },
  { label: 'How it works', href: '/#how', ready: true },
  { label: 'FAQs', href: '/#faq', ready: true },
  { label: 'Contact', href: '/contact', ready: true },
  { label: "Verify it's us", href: '/verify', ready: false },
]

const linkCls =
  'text-sm text-muted-foreground transition-colors hover:text-foreground'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <BloomMark className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight text-heading">
              BloomAbroad
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Helping students and universities get enrolment-ready.
          </p>
        </div>

        <nav
          aria-label="Site"
          className="flex flex-wrap gap-x-6 gap-y-2"
        >
          <AudienceLink audience="students">For students and families</AudienceLink>
          <AudienceLink audience="universities">For universities</AudienceLink>
          {SITE_LINKS.filter((l) => l.ready).map((l) =>
            l.href.startsWith('/#') ? (
              <a key={l.label} href={l.href} className={linkCls}>
                {l.label}
              </a>
            ) : (
              <Link key={l.label} to={l.href} className={linkCls}>
                {l.label}
              </Link>
            ),
          )}
        </nav>

        <nav
          aria-label="Legal"
          className="flex flex-wrap gap-x-6 gap-y-2"
        >
          <Link to="/privacy" className={linkCls}>
            Privacy Notice
          </Link>
          <Link to="/terms" className={linkCls}>
            Terms of Service
          </Link>
          <Link to="/cookies" className={linkCls}>
            Cookie Notice
          </Link>
          <button type="button" onClick={openCookieSettings} className={linkCls}>
            Cookie settings
          </button>
          <Link to="/complaints" className={linkCls}>
            Complaints
          </Link>
        </nav>

        <div className="space-y-1 border-t border-border pt-6 text-sm text-muted-foreground">
          <p>
            BloomAbroad is a trading name of {COMPANY.legalName}, registered in
            Ireland. Company no. {COMPANY.croNumber} · Registered office:{' '}
            {COMPANY.registeredOffice}
          </p>
          <p>© 2026 {COMPANY.legalName}. All rights reserved.</p>
        </div>

        {SOCIALS.length > 0 && (
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkCls}
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}

/** On the homepage this switches the page to that audience in place; from any
 *  other page it's a normal link that opens the homepage on that branch. */
function AudienceLink({
  audience,
  children,
}: {
  audience: Audience
  children: ReactNode
}) {
  const ctx = useOptionalAudience()
  return (
    <a
      href={`/?audience=${audience}`}
      onClick={(e) => {
        if (ctx) {
          e.preventDefault()
          ctx.choose(audience)
        }
      }}
      className={linkCls}
    >
      {children}
    </a>
  )
}
