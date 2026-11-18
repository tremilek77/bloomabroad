import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { BloomMark } from './Logo'
import { ThemeToggle } from './saasta/ThemeToggle'
import { READY } from '@/content/site'
import { hasGuides } from '@/content/guides'

const navCls =
  'nav-underline text-base font-medium text-muted-foreground transition-colors hover:text-foreground'

export function NavBar() {
  // Pages with their own waitlist form scroll to it; every other page sends
  // the visitor to the homepage's form.
  const { pathname } = useLocation()
  const hasForm = ['/', '/students', '/universities', '/pricing', '/nigeria'].includes(pathname)
  const joinHref = hasForm ? '#waitlist' : '/#waitlist'
  const isUni = pathname === '/universities'
  const joinLabel = (
    <>
      <span className="sm:hidden">{isUni ? 'Early access' : 'Join waitlist'}</span>
      <span className="hidden sm:inline">{isUni ? 'Request early access' : 'Join the waitlist'}</span>
    </>
  )

  // Below the md breakpoint the links live in a small dropdown.
  const [open, setOpen] = useState(false)
  useEffect(() => setOpen(false), [pathname])

  const links = [
    { to: '/students', label: 'For students' },
    { to: '/universities', label: 'For universities' },
    { to: '/students#how', label: 'How it works' },
    ...(READY.pricing ? [{ to: '/pricing', label: 'Pricing' }] : []),
    ...(hasGuides ? [{ to: '/guides', label: 'Guides' }] : []),
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
            <Link key={l.to} to={l.to} className={navCls}>
              {l.label}
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
              className="block rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
            >
              {l.label}
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
