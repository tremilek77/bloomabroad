import { Check, X } from 'lucide-react'
import { Reveal } from '@/components/saasta/Reveal'
import { cn } from '@/lib/utils'

/**
 * A titled list with a tick or cross on every line. Used for "what we do /
 * what we don't do" and "good fit / not what we do" pairs.
 */
export function IconList({
  title,
  items,
  tone,
  delay = 0,
}: {
  title: string
  items: string[]
  tone: 'yes' | 'no'
  delay?: number
}) {
  const Icon = tone === 'yes' ? Check : X
  return (
    <Reveal delay={delay} className="h-full">
      <div className="h-full rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-bold text-heading">{title}</h3>
        <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-foreground/85">
          {items.map((t) => (
            <li key={t} className="flex gap-3">
              <Icon
                className={cn(
                  'mt-1 h-4 w-4 shrink-0',
                  tone === 'yes' ? 'text-signal' : 'text-muted-foreground',
                )}
                aria-hidden
              />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}
