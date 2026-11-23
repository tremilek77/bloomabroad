import { Link, useLocation } from 'react-router-dom'
import { BloomMark } from './Logo'
import { audienceFor, type Audience } from '@/lib/audience'
import { READY } from '@/content/site'
import { hasGuides } from '@/content/guides'
import { openCookieSettings } from '@/lib/consent'
import { COMPANY, SOCIALS } from '@/lib/company'

/**
 * Sitewide footer (brief, Fix 4). Rendered on every public page.
 *
 * Links to pages that aren't built yet are hidden by the READY flags in
 * content/site.ts, so nothing points at a dead page.
 */
type SiteLink = { label: string; href: string; ready: boolean }

/** Links shared by every page. */
const COMMON: SiteLink[] = [
  { label: 'How we assess', href: '/how-we-assess', ready: true },
  { label: 'What is enrolment readiness?', href: '/enrolment-readiness', ready: true },
  { label: 'About', href: '/about', ready: READY.about },
  { label: 'Guides', href: '/guides', ready: hasGuides },
  { label: 'Contact', href: '/contact', ready: true },
  { label: "Verify it's us", href: '/verify', ready: READY.verify },
]

/** The footer follows the same student / university split as the header. */
function siteLinks(audience: Audience | null): SiteLink[] {
  if (audience === 'universities') {
    return [
      { label: 'For universities', href: '/universities', ready: true },
      { label: 'How it works', href: '/universities#how', ready: true },
      { label: 'FAQs', href: '/universities#faq', ready: true },
      { label: 'For students', href: '/students', ready: true },
      ...COMMON,
    ]
  }
  if (audience === 'students') {
    return [
      { label: 'For students and families', href: '/students', ready: true },
      { label: 'How it works', href: '/students#how', ready: true },
      { label: 'FAQs', href: '/students#faq', ready: true },
      { label: 'Pricing', href: '/pricing', ready: READY.pricing },
      { label: 'For universities', href: '/universities', ready: true },
      ...COMMON,
    ]
  }
  return [
    { label: 'For students and families', href: '/students', ready: true },
    { label: 'For universities', href: '/universities', ready: true },
    ...COMMON,
  ]
}

const linkCls =
  'text-sm text-muted-foreground transition-colors hover:text-foreground'

export function Footer() {
  const { pathname } = useLocation()
  const links = siteLinks(audienceFor(pathname))
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
          {links.filter((l) => l.ready).map((l) => (
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
