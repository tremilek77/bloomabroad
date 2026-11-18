import { Reveal } from '@/components/saasta/Reveal'

/**
 * One row of short proof points. Values are plain text in the HTML (never
 * animated from 0, never baked into images) so crawlers and AI assistants
 * can read them.
 */
export function TrustStrip({
  items,
  columns,
}: {
  items: { value: string; label?: string }[]
  columns?: 2 | 3 | 4
}) {
  const cols = columns ?? (items.length >= 4 ? 4 : (items.length as 2 | 3))
  const grid =
    cols === 4
      ? 'sm:grid-cols-2 lg:grid-cols-4'
      : cols === 3
        ? 'sm:grid-cols-3'
        : 'sm:grid-cols-2'

  return (
    <section className="border-y border-border bg-card/40">
      <ul className={`mx-auto grid max-w-6xl gap-px px-6 py-2 ${grid}`}>
        {items.map((s, i) => (
          <li key={s.value}>
            <Reveal delay={i * 0.06}>
              <div className="px-2 py-5 text-center">
                <div className="text-[15px] font-bold tracking-tight text-signal sm:text-base">
                  {s.value}
                </div>
                {s.label && (
                  <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                )}
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  )
}
