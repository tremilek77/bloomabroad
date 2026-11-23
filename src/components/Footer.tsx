import { Link, useLocation } from 'react-router-dom'
import { ArrowUp, Landmark, Mail, MessageSquareText, ShieldCheck } from 'lucide-react'
import { BloomMark } from './Logo'
import { READY } from '@/content/site'
import { hasGuides } from '@/content/guides'
import { openCookieSettings } from '@/lib/consent'
import { COMPANY, SOCIALS } from '@/lib/company'
import { audienceFor, type Audience } from '@/lib/audience'

/**
 * Sitewide footer (brief, Fix 4). Rendered on every public page.
 *
 * Links to pages that aren't built yet are hidden by the READY flags in
 * content/site.ts, so nothing points at a dead page. The link columns follow
 * the same student / university split as the header: a student page shows the
 * student column, a university page the university one, and neutral pages
 * show both.
 */
type FooterLink = { label: string; href: string; ready?: boolean }
type Column = { title: string; links: FooterLink[] }

const STUDENT_COLUMN: Column = {
  title: 'For students and families',
  links: [
    { label: 'Check your readiness', href: '/students' },
    { label: 'How it works', href: '/students#how' },
    { label: 'Free Ireland Readiness Checklist', href: '/checklist', ready: READY.checklist },
    { label: 'Pricing', href: '/pricing', ready: READY.pricing },
    { label: 'Studying from Nigeria', href: '/nigeria' },
    { label: 'Student FAQs', href: '/students#faq' },
  ],
}

const UNIVERSITY_COLUMN: Column = {
  title: 'For universities',
  links: [
    { label: 'Enrolment readiness screening', href: '/universities' },
    { label: 'How it will work', href: '/universities#how' },
    { label: 'University FAQs', href: '/universities#faq' },
    { label: 'Request early access', href: '/universities#waitlist' },
  ],
}

const LEARN_COLUMN: Column = {
  title: 'Learn',
  links: [
    { label: 'How we assess', href: '/how-we-assess' },
    { label: 'What is enrolment readiness?', href: '/enrolment-readiness' },
    { label: 'Guides', href: '/guides', ready: hasGuides },
    { label: 'About us', href: '/about', ready: READY.about },
  ],
}

const SUPPORT_COLUMN: Column = {
  title: 'Trust and support',
  links: [
    { label: "Verify it's really us", href: '/verify', ready: READY.verify },
    { label: 'Contact', href: '/contact' },
    { label: 'Complaints', href: '/complaints' },
  ],
}

function columnsFor(audience: Audience | null): Column[] {
  if (audience === 'universities') return [UNIVERSITY_COLUMN, LEARN_COLUMN, SUPPORT_COLUMN]
  if (audience === 'students') return [STUDENT_COLUMN, LEARN_COLUMN, SUPPORT_COLUMN]
  return [STUDENT_COLUMN, UNIVERSITY_COLUMN, LEARN_COLUMN, SUPPORT_COLUMN]
}

const FACTS = [
  { icon: ShieldCheck, text: 'Independent. We take no commission from anyone.' },
  { icon: Landmark, text: 'An Irish company, based in Cork.' },
  { icon: MessageSquareText, text: 'Every result reviewed by an experienced consultant.' },
]

const linkCls = 'text-sm text-muted-foreground transition-colors hover:text-foreground'

export function Footer() {
  const { pathname } = useLocation()
  const audience = audienceFor(pathname)
  const columns = columnsFor(audience)

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 pb-8 pt-14">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_2fr]">
          {/* Brand and promises */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <BloomMark className="h-7 w-7" />
              <span className="text-xl font-bold tracking-tight text-heading">BloomAbroad</span>
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-muted-foreground">
              An independent readiness check for studying in Ireland, for students, families and
              universities.
            </p>

            <ul className="mt-6 space-y-3">
              {FACTS.map((f) => (
                <li key={f.text} className="flex items-start gap-3 text-sm text-foreground/85">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary text-signal">
                    <f.icon className="h-4 w-4" aria-hidden />
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>

            <a
              href={`mailto:${COMPANY.helloEmail}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              <Mail className="h-4 w-4" aria-hidden />
              {COMPANY.helloEmail}
            </a>

            {audience && (
              <p className="mt-4 text-sm">
                <Link
                  to={audience === 'students' ? '/universities' : '/students'}
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {audience === 'students' ? 'Are you a university? See how it works →' : 'Are you a student or parent? Start here →'}
                </Link>
              </p>
            )}
          </div>

          {/* Link columns */}
          <nav
            aria-label="Site"
            className={`grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-8 ${columns.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}
          >
            {columns.map((col) => (
              <div key={col.title}>
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-eyebrow">
                  {col.title}
                </h2>
                <ul className="mt-4 space-y-3">
                  {col.links
                    .filter((l) => l.ready !== false)
                    .map((l) => (
                      <li key={l.label}>
                        <Link to={l.href} className={linkCls}>
                          {l.label}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Legal row */}
        <div className="mt-12 flex flex-col gap-5 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
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

          <div className="flex items-center gap-5">
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
            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault()
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <ArrowUp className="h-4 w-4" aria-hidden />
              Back to top
            </a>
          </div>
        </div>

        <div className="mt-6 space-y-1.5 text-sm text-muted-foreground">
          <p>
            BloomAbroad is a trading name of {COMPANY.legalName}, registered in Ireland. Company
            no. {COMPANY.croNumber}. Registered office: {COMPANY.registeredOffice}.
          </p>
          <p>© 2026 {COMPANY.legalName}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
