import { useEffect, useState } from 'react'
import {
  BadgeCheck,
  Check,
  GraduationCap,
  Languages,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

type Tone = 'ok' | 'warn'

const CHECKS: {
  icon: LucideIcon
  label: string
  value: string
  pct: number
  tone: Tone
}[] = [
  {
    icon: GraduationCap,
    label: 'Academic qualifications',
    value: 'BSc Engineering — 2:1 Honours',
    pct: 90,
    tone: 'ok',
  },
  {
    icon: Languages,
    label: 'English language proficiency',
    value: 'IELTS 6.5 — reviewing requirement',
    pct: 65,
    tone: 'warn',
  },
  {
    icon: BadgeCheck,
    label: 'Visa & immigration eligibility',
    value: 'Nigerian passport — eligible',
    pct: 100,
    tone: 'ok',
  },
]

// step machine: 0 reset · 1..3 fill each bar · 4-5 show result (hold) · loop
const STEPS = CHECKS.length + 3

export function EligibilityCheck() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(CHECKS.length + 1) // final state: all filled + result
      return
    }
    const id = window.setInterval(
      () => setStep((s) => (s + 1) % STEPS),
      900,
    )
    return () => window.clearInterval(id)
  }, [])

  const resultShown = step > CHECKS.length

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            Your eligibility assessment
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-signal/15 px-2.5 py-1 text-xs font-medium text-signal">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-signal" />
            {resultShown ? 'Complete' : 'In progress'}
          </span>
        </div>

        <div className="flex flex-col gap-3.5">
          {CHECKS.map((c, i) => {
            const filled = step > i
            const barCls = c.tone === 'ok' ? 'bg-signal' : 'bg-amber-500'
            return (
              <div key={c.label} className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-secondary text-signal">
                  <c.icon className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] text-muted-foreground">
                    {c.label}
                  </div>
                  <div className="truncate text-xs font-medium text-foreground">
                    {c.value}
                  </div>
                  <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-border">
                    <div
                      className={`h-full rounded-full transition-[width] duration-700 ease-out ${barCls}`}
                      style={{ width: filled ? `${c.pct}%` : '0%' }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div
          className={`mt-3.5 flex items-center gap-2.5 rounded-lg border border-signal/30 bg-signal/10 p-2.5 transition-opacity duration-500 ${resultShown ? 'opacity-100' : 'opacity-0'}`}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-signal text-signal-foreground">
            <Check className="h-4 w-4" strokeWidth={3} />
          </span>
          <div>
            <div className="text-xs font-medium text-foreground">
              Looking strong — one area to review
            </div>
            <div className="text-[11px] text-muted-foreground">
              Your IELTS score may need improvement for this programme
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/80 p-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-signal">
          <ShieldCheck className="h-4.5 w-4.5" />
        </div>
        <div>
          <div className="text-xs font-medium text-foreground">
            Apply with confidence
          </div>
          <div className="text-[11px] text-muted-foreground">
            Know your eligibility before you spend time and money on an
            application that may not succeed.
          </div>
        </div>
      </div>
    </div>
  )
}
