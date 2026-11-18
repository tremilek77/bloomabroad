import { Reveal } from './saasta/Reveal'

// The one stats block on the page (the duplicate lower block was removed).
// Final values are plain text in the HTML — nothing here animates from 0.
const STATS = [
  { value: '10+ years', label: 'of real application, admissions and outcome data' },
  {
    value: 'Validated with university admissions teams',
    label: 'Confirmed to address the challenges they face today',
  },
]

export function StatStrip() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto grid max-w-4xl grid-cols-1 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        {STATS.map((s, i) => (
          <Reveal key={s.value} delay={i * 0.08}>
            <div className="px-6 py-6 text-center">
              <div className="text-xl font-extrabold tracking-tight text-signal">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
