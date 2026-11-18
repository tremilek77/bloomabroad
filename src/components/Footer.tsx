import { Link } from 'react-router-dom'
import { BloomMark } from './Logo'
import { READY } from '@/content/site'
import { openCookieSettings } from '@/lib/consent'
import { COMPANY, SOCIALS } from '@/lib/company'

/**
 * Sitewide footer (brief, Fix 4). Rendered on every public page.
 *
 * Links to pages that aren't built yet are hidden by the READY flags in
 * content/site.ts, so nothing points at a dead page.
 */
const SITE_LINKS: { label: string; href: string; ready: boolean }[] = [
  { label: 'For students and families', href: '/students', ready: true },
  { label: 'For universities', href: '/universities', ready: true },
  { label: 'About', href: '/about', ready: READY.about },
  { label: 'Pricing', href: '/pricing', ready: READY.pricing },
  { label: 'How it works', href: '/students#how', ready: true },
  { label: 'FAQs', href: '/students#faq', ready: true },
  { label: 'Contact', href: '/contact', ready: true },
  { label: "Verify it's us", href: '/verify', ready: READY.verify },
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
          {SITE_LINKS.filter((l) => l.ready).map((l) => (
            <Link key={l.label} to={l.href} className={linkCls}>
              {l.label}
            </Link>
          ))}
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
