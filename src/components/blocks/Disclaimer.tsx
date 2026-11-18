import { DISCLAIMER, OFFICIAL_IMMIGRATION_URL } from '@/content/disclaimers'
import { READY } from '@/content/site'
import { Link } from 'react-router-dom'

/**
 * The brief's disclaimer (Fix 9). `short` sits under heroes and trust areas;
 * `standard` goes on /pricing, checkout and /universities.
 */
export function Disclaimer({ variant = 'short' }: { variant?: 'short' | 'standard' }) {
  if (variant === 'short') {
    return (
      <p className="mx-auto max-w-3xl px-6 py-6 text-center text-sm leading-relaxed text-muted-foreground">
        {DISCLAIMER.short}
      </p>
    )
  }
  return (
    <aside className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-2xl border border-border bg-card/60 p-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-heading">
          {DISCLAIMER.standardTitle}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {DISCLAIMER.standard}{' '}
          <a
            href={OFFICIAL_IMMIGRATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4"
          >
            irishimmigration.ie
          </a>
          {READY.verify && (
            <>
              {' '}
              <Link to="/verify" className="font-medium text-primary underline underline-offset-4">
                Read the security notice
              </Link>
            </>
          )}
        </p>
      </div>
    </aside>
  )
}
