import { BloomMark } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <BloomMark className="h-6 w-6" />
          <span className="text-xl font-bold tracking-tight text-heading">
            BloomAbroad
          </span>
        </div>

        <p className="order-3 text-sm text-muted-foreground sm:order-2">
          © 2026. All rights reserved.
        </p>

        <nav className="order-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:order-3">
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <a
              key={l}
              href="#"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
