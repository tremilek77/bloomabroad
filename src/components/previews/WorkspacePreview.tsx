/**
 * Hero visual for /universities. The institution workspace isn't live, so this
 * is labelled an illustration, uses no real names, and makes no claim about
 * results (brief: future tense until the dashboard exists).
 */
const FILES = [
  { who: 'Applicant A', course: 'MSc Data Analytics', status: 'Ready to assess', tone: 'ok' },
  { who: 'Applicant B', course: 'MBA', status: '2 documents missing', tone: 'warn' },
  { who: 'Applicant C', course: 'BEng Mechanical', status: 'Readiness report ready', tone: 'ok' },
] as const

export function WorkspacePreview() {
  return (
    <div className="rounded-2xl border border-border bg-card/90 p-5 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-heading">Institution workspace</span>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Illustration: being designed
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {FILES.map((f) => (
          <li
            key={f.who}
            className="flex items-center justify-between gap-3 rounded-xl bg-background/50 px-3.5 py-3"
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-foreground">{f.who}</div>
              <div className="truncate text-xs text-muted-foreground">{f.course}</div>
            </div>
            <span
              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                f.tone === 'ok'
                  ? 'bg-signal/15 text-signal'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
              }`}
            >
              {f.status}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Your team uploads applications already received. Admissions decisions stay with
        your institution.
      </p>
    </div>
  )
}
