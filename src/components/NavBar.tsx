import { BloomMark } from './Logo'
import { ThemeToggle } from './saasta/ThemeToggle'

export function NavBar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <a href="#top" className="group flex items-center gap-2.5">
          <BloomMark className="h-7 w-7 transition-transform duration-500 group-hover:rotate-90" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            BloomAbroad
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#how"
            className="nav-underline text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <a
            href="#platform"
            className="nav-underline text-base font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            The platform
          </a>
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a
            href="#waitlist"
            className="btn-sheen whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 sm:px-5"
          >
            Join the waitlist
          </a>
        </div>
      </div>
    </header>
  )
}
