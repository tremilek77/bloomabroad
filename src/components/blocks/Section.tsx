import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/saasta/Reveal'

/**
 * Standard page section: consistent spacing, optional eyebrow, H2 and one-line
 * lead. Keep leads to a sentence; cards and steps carry the detail.
 */
export function Section({
  id,
  tone = 'plain',
  eyebrow,
  title,
  lead,
  width = 'wide',
  children,
}: {
  id?: string
  tone?: 'plain' | 'tint' | 'card'
  eyebrow?: string
  title?: ReactNode
  lead?: ReactNode
  width?: 'wide' | 'narrow'
  children?: ReactNode
}) {
  return (
    <section
      id={id}
      className={cn(
        'scroll-mt-20',
        tone === 'tint' && 'border-y border-border bg-secondary/30',
        tone === 'card' && 'border-y border-border bg-card/40',
      )}
    >
      <div
        className={cn(
          'mx-auto px-6 py-16 md:py-20',
          width === 'wide' ? 'max-w-6xl' : 'max-w-3xl',
        )}
      >
        {(eyebrow || title || lead) && (
          <Reveal>
            {eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-eyebrow">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-[1.1] tracking-tight text-heading md:text-4xl">
                {title}
              </h2>
            )}
            {lead && (
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {lead}
              </p>
            )}
          </Reveal>
        )}
        {children && <div className={cn(title || lead || eyebrow ? 'mt-10' : '')}>{children}</div>}
      </div>
    </section>
  )
}
