import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The one button/link component for page CTAs. In-page anchors ("#waitlist")
 * and external links render a plain <a>; site routes use the router so the
 * page doesn't reload.
 */
const base =
  'group inline-flex items-center gap-2 rounded-full text-base font-semibold transition-transform duration-200 hover:-translate-y-0.5'

const variants = {
  primary:
    'btn-sheen bg-primary px-7 py-3.5 text-primary-foreground hover:shadow-[0_10px_40px_-10px_var(--primary)]',
  secondary:
    'border border-border px-6 py-3.5 font-medium text-foreground transition-colors hover:border-primary/50',
  text: 'text-sm font-semibold text-primary underline-offset-4 hover:underline',
} as const

export function ButtonLink({
  to,
  variant = 'primary',
  arrow = false,
  className,
  children,
}: {
  to: string
  variant?: keyof typeof variants
  arrow?: boolean
  className?: string
  children: ReactNode
}) {
  const cls = cn(base, variants[variant], className)
  const inner = (
    <span className="relative z-[2] inline-flex items-center gap-2">
      {children}
      {arrow && (
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </span>
  )

  const external = /^(https?:|mailto:)/.test(to)
  if (external || to.startsWith('#')) {
    return (
      <a
        href={to}
        className={cls}
        {...(to.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  }
  return (
    <Link to={to} className={cls}>
      {inner}
    </Link>
  )
}
