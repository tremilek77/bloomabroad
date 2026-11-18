import { Check, CircleAlert } from 'lucide-react'

/**
 * Hero visual for /students: a short version of the sample outcome report in
 * the brief (Fix 13). The applicant is fictional and the card says so. Keep
 * it in step with the real report structure on bloomabroad.ai.
 */
const COLUMNS = [
  {
    title: 'Application readiness',
    strong: 'Your degree fits the course',
    attention: 'Your English test will have expired',
  },
  {
    title: 'Immigration readiness',
    strong: 'Your passport covers your full stay',
    attention: 'Your name is spelt differently on two documents',
  },
]

export function SampleOutcomeCard() {
  return (
    <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-heading">Readiness outcome</span>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Sample: fictional applicant
        </span>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Amara · Nigeria · Postgraduate · MSc in Data Analytics · September 2027
      </p>

      <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
        <div className="text-base font-bold text-heading">Needs Support</div>
        <p className="mt-1 text-sm text-muted-foreground">
          You're close. Three things need attention before you apply, and all of them
          can be fixed.
        </p>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {COLUMNS.map((c) => (
          <div key={c.title} className="rounded-xl bg-background/50 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-eyebrow">
              {c.title}
            </div>
            <p className="mt-2 flex gap-2 text-sm text-foreground">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-signal" aria-hidden />
              {c.strong}
            </p>
            <p className="mt-2 flex gap-2 text-sm text-foreground">
              <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden />
              {c.attention}
            </p>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Reviewed by an experienced consultant
      </p>
    </div>
  )
}
