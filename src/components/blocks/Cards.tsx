import type { LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/saasta/Reveal'
import { cn } from '@/lib/utils'

export type CardItem = {
  icon?: LucideIcon
  title: string
  /** One line. If it needs more, it belongs in a guide. */
  body: string
}

/** Cards with a bold lead-in and one line of body. 3 across by default. */
export function CardGrid({
  items,
  cols = 3,
}: {
  items: CardItem[]
  cols?: 2 | 3
}) {
  return (
    <ul
      className={cn(
        'grid gap-5',
        cols === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
      )}
    >
      {items.map((c, i) => (
        <li key={c.title}>
          <Reveal delay={i * 0.06} from="up" className="h-full">
            <div className="card-interactive h-full rounded-2xl border border-border bg-card p-6">
              {c.icon && (
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-signal">
                  <c.icon className="h-5 w-5" aria-hidden />
                </span>
              )}
              <h3 className="text-base font-bold text-heading">{c.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                {c.body}
              </p>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  )
}
