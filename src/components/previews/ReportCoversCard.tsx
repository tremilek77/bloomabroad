import { Check, CircleDot, ListOrdered, UsersRound } from 'lucide-react'

/**
 * Hero visual for /students: what a readiness report covers, described by
 * section. It deliberately shows no example applicant and no example findings,
 * so it can't drift from what the real report on bloomabroad.ai contains.
 * Section names come from the brief (outcome, what's strong, what's missing,
 * next steps, summary for parents and sponsors).
 */
const PARTS = [
  { icon: CircleDot, title: 'Your outcome', body: 'Ready to Apply, Needs Support, or Not Yet in a Position to Apply' },
  { icon: Check, title: "What's strong", body: 'Where your application and immigration readiness already stand up' },
  { icon: Check, title: "What's missing", body: 'The gaps, with the reasons behind them' },
  { icon: ListOrdered, title: 'Your next steps', body: 'What to do, in order, for your situation' },
  { icon: UsersRound, title: 'A summary for parents and sponsors', body: 'Written so the people supporting you can follow it' },
]

export function ReportCoversCard() {
  return (
    <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm backdrop-blur">
      <p className="text-sm font-semibold text-heading">What your readiness report covers</p>
      <ul className="mt-4 space-y-3">
        {PARTS.map((p) => (
          <li key={p.title} className="flex gap-3 rounded-xl bg-background/50 p-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-signal">
              <p.icon className="h-4 w-4" aria-hidden />
            </span>
            <div>
              <div className="text-sm font-semibold text-foreground">{p.title}</div>
              <div className="text-sm text-muted-foreground">{p.body}</div>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted-foreground">Reviewed by an experienced consultant</p>
    </div>
  )
}
