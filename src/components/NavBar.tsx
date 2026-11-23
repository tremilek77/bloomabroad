import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { BloomMark } from './Logo'
import { ThemeToggle } from './saasta/ThemeToggle'
import { READY } from '@/content/site'
import { hasGuides } from '@/content/guides'
import { PAGES_WITH_FORM, audienceFor } from '@/lib/audience'

const navCls =
  'nav-underline text-base font-medium text-muted-foreground transition-colors hover:text-foreground'

export function NavBar() {
  // The experience is split by audience: student pages show student navigation
  // and the student form, university pages show only university navigation. A
  // small link at the end switches sides. Neutral pages offer both.
  const { pathname } = useLocation()
  const audience = audienceFor(pathname)
  const isUni = audience === 'universities'

  // Pages with their own form scroll to it; others go to that audience's form
  // (neutral pages go to the homepage chooser).
  const joinHref = PAGES_WITH_FORM.includes(pathname)
    ? '#waitlist'
    : audience === 'students'
      ? '/students#waitlist'
      : '/#waitlist'
  const joinLabel = (
    <>
      <span className="sm:hidden">{isUni ? 'Early access' : 'Join waitlist'}</span>
      <span className="hidden sm:inline">{isUni ? 'Request early access' : 'Join the waitlist'}</span>
    </>
  )

  // Below the md breakpoint the links live in a small dropdown.
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  const guides = hasGuides ? [{ to: '/guides', label: 'Guides' }] : []
  const links: { to: string; label: string; switchSide?: boolean }[] =
    audience === 'universities'
      ? [
          { to: '/universities#how', label: 'How it works' },
          { to: '/universities#faq', label: 'FAQs' },
          { to: '/students', label: 'For students', switchSide: true },
        ]
      : audience === 'students'
        ? [
            { to: '/students#how', label: 'How it works' },
            ...(READY.pricing ? [{ to: '/pricing', label: 'Pricing' }] : []),
            ...guides,
            { to: '/universities', label: 'For universities', switchSide: true },
          ]
        : [
            { to: '/students', label: 'For students' },
            { to: '/universities', label: 'For universities' },
            ...guides,
          ]

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <BloomMark className="h-7 w-7 transition-transform duration-500 group-hover:rotate-90" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            BloomAbroad
          </span>
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={l.switchSide ? `${navCls} border-l border-border pl-8` : navCls}
            >
              {l.label}
              {l.switchSide && <span aria-hidden> →</span>}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          {joinHref.startsWith('#') ? (
            <a href={joinHref} className={joinCls}>
              {joinLabel}
            </a>
          ) : (
            <Link to={joinHref} className={joinCls}>
              {joinLabel}
            </Link>
          )}
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Main"
          className="border-t border-border/60 bg-background px-4 pb-4 pt-2 md:hidden"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={
                l.switchSide
                  ? 'mt-1 block rounded-lg border-t border-border px-3 py-3 text-base font-medium text-muted-foreground hover:bg-secondary'
                  : 'block rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary'
              }
            >
              {l.label}
              {l.switchSide && <span aria-hidden> →</span>}
            </Link>
          ))}
          <div className="flex items-center justify-between rounded-lg px-3 py-2 text-base font-medium text-foreground">
            Light or dark
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  )
}

const joinCls =
  'btn-sheen whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 sm:px-5'
