import { Check } from 'lucide-react'
import { Reveal } from './saasta/Reveal'
import { Counter } from './saasta/Counter'

const BULLETS = [
  'Expert-designed readiness scenarios are applied from day one.',
  'Both universities and students get a clear, consistent readiness signal.',
]

const STATS: {
  count?: number
  suffix?: string
  text?: string
  label: string
}[] = [
  {
    count: 10,
    suffix: '+ years',
    label: 'Real application, admissions & outcome data',
  },
  {
    text: 'Validated with HEIs admissions teams',
    label: 'Confirmed to address challenges they face today',
  },
]

export function Platform() {
  return (
    <section id="platform" className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div>
            {/* Eyebrow renamed from the live site's duplicate "HOW IT WORKS"
                to match the #platform anchor (see content-inventory UX note). */}
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-eyebrow">
              The platform
            </p>
            <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-heading md:text-5xl">
              Built on a decade of real data — and{' '}
              <span className="text-glimmer">real expertise.</span>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              BloomAbroad isn't built on assumptions. It's built on 10+ years of
              accumulated data — student profiles, application outcomes, and
              real student success stories — from across the international
              education ecosystem.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Designed by an expert with a doctoral background in migration and
              years of experience as an educator, BloomAbroad combines
              professional expertise with real operational insight — a rare
              pairing in international education.
            </p>

            <ul className="mt-8 space-y-4">
              {BULLETS.map((b) => (
                <li key={b} className="flex gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal text-signal-foreground">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-[15px] leading-relaxed text-foreground/90">
                    {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <div className="grid content-center gap-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.12} from="right">
              <div className="card-interactive glimmer rounded-2xl border border-border bg-card p-7">
                <div className="text-4xl font-extrabold tracking-tight text-signal">
                  {s.count !== undefined ? (
                    <Counter value={s.count} suffix={s.suffix} />
                  ) : (
                    s.text
                  )}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
