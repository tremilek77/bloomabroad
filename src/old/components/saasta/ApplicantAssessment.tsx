import { Counter } from './Counter'

type Status = 'ready' | 'review' | 'gap'

const STATUS: Record<Status, { label: string; cls: string }> = {
  ready: { label: 'Ready to enrol', cls: 'bg-signal/15 text-signal' },
  review: { label: 'Needs review', cls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  gap: { label: 'Eligibility gap', cls: 'bg-red-500/15 text-red-600 dark:text-red-400' },
}

const APPLICANTS: {
  initials: string
  name: string
  detail: string
  status: Status
}[] = [
  { initials: 'AM', name: 'Amara M. — Nigeria', detail: 'BSc Computer Science · IELTS 7.0', status: 'ready' },
  { initials: 'JL', name: 'Jun L. — China', detail: 'MBA · GMAT 580', status: 'review' },
  { initials: 'PS', name: 'Priya S. — India', detail: 'MEng Civil · English B2', status: 'gap' },
  { initials: 'DK', name: 'Daniel K. — Kenya', detail: 'MSc Data Science · IELTS 7.5', status: 'ready' },
  { initials: 'SR', name: 'Sofia R. — Brazil', detail: 'BA Economics · TOEFL 95', status: 'review' },
  { initials: 'TN', name: 'Thao N. — Vietnam', detail: 'BEng Mechanical · IELTS 6.0', status: 'gap' },
]

export function ApplicantAssessment() {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            International applicant assessment
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-signal/15 px-2.5 py-1 text-xs font-medium text-signal">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-signal" />
            Live
          </span>
        </div>

        {/* auto-scrolling feed */}
        <div
          className="vscroll-wrap relative h-[176px] overflow-hidden"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)',
          }}
          aria-label="Live feed of international applicants being assessed"
        >
          <ul className="vscroll flex flex-col gap-1.5">
            {[...APPLICANTS, ...APPLICANTS].map((a, i) => (
              <li
                key={i}
                className="flex items-center gap-3 rounded-lg bg-background/40 px-3 py-2"
              >
                <span
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-signal-foreground"
                  style={{ background: 'var(--gradient-bloom)' }}
                >
                  {a.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11px] font-medium text-foreground">
                    {a.name}
                  </div>
                  <div className="truncate text-[10px] text-muted-foreground">
                    {a.detail}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS[a.status].cls}`}
                >
                  {STATUS[a.status].label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-signal" style={{ width: '72%' }} />
        </div>
        <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
          <span>Applicants assessed this intake</span>
          <span className="font-medium text-signal">
            <Counter value={72} suffix="% complete" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-card/80 p-4">
          <div className="text-[10px] text-muted-foreground">Time saved per intake</div>
          <div className="text-lg font-bold text-signal">Significant</div>
          <div className="text-[10px] text-muted-foreground">vs manual screening</div>
        </div>
        <div className="rounded-2xl border border-border bg-card/80 p-4">
          <div className="text-[10px] text-muted-foreground">Data foundation</div>
          <div className="text-lg font-bold text-signal">
            <Counter value={10} suffix="+ yrs" />
          </div>
          <div className="text-[10px] text-muted-foreground">Real student journeys</div>
        </div>
      </div>
    </div>
  )
}
