import type { ReactNode } from 'react'
import { Reveal } from '@/components/saasta/Reveal'
import { cn } from '@/lib/utils'

/**
 * Page hero. The `answer` is the 40-60 word block that names BloomAbroad, who
 * it is for and what it does. It is written to be quoted whole by search
 * snippets and AI assistants, so keep it self-contained.
 */
export function Hero({
  eyebrow,
  title,
  answer,
  actions,
  note,
  aside,
  centered = false,
}: {
  eyebrow?: string
  title: ReactNode
  answer: string
  actions?: ReactNode
  /** Small line under the buttons (e.g. "Launching early 2027"). */
  note?: ReactNode
  /** Right-hand visual. Omit for a centred hero. */
  aside?: ReactNode
  centered?: boolean
}) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div
        className={cn(
          'mx-auto max-w-6xl px-6 pb-16 pt-14 md:pt-20',
          aside ? 'grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center' : '',
          centered && !aside && 'text-center',
        )}
      >
        <div className={cn(centered && !aside && 'mx-auto max-w-3xl')}>
          {eyebrow && (
            <Reveal>
              <span className="inline-flex items-center rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-eyebrow">
                {eyebrow}
              </span>
            </Reveal>
          )}
          <Reveal delay={0.06}>
            <h1 className="mt-6 max-w-2xl text-4xl font-extrabold leading-[1.08] tracking-tight text-heading sm:text-5xl lg:text-[3.25rem]">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              className={cn(
                'mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground',
                centered && !aside && 'mx-auto',
              )}
            >
              {answer}
            </p>
          </Reveal>
          {actions && (
            <Reveal delay={0.18}>
              <div
                className={cn(
                  'mt-8 flex flex-wrap items-center gap-3',
                  centered && !aside && 'justify-center',
                )}
              >
                {actions}
              </div>
            </Reveal>
          )}
          {note && (
            <Reveal delay={0.24}>
              <p className="mt-5 text-sm text-muted-foreground">{note}</p>
            </Reveal>
          )}
        </div>
        {aside && (
          <Reveal delay={0.2} from="scale">
            <div className="relative">{aside}</div>
          </Reveal>
        )}
      </div>
    </section>
  )
}
