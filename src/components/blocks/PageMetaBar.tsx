import { UPDATED } from '@/content/updated'
import { formatDate } from '@/content/guides'
import { COMPANY } from '@/lib/company'

/**
 * A thin line under the hero: when the page was last updated, how long it
 * takes to read, a way to report a mistake, and (on long pages) a row of
 * jump links. Dates and sources are what show readers, search engines and AI
 * assistants that a page about money and immigration is kept current.
 */
export function PageMetaBar({
  path,
  minutes,
  toc,
}: {
  path: string
  minutes: number
  /** Jump links to sections on this page, in order. */
  toc?: { id: string; label: string }[]
}) {
  const updated = UPDATED[path]
  const subject = encodeURIComponent(`Correction: ${path}`)
  return (
    <div className="mx-auto max-w-6xl px-6 pt-6">
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
        {updated && <span>Last updated {formatDate(updated)}</span>}
        <span>{minutes} min read</span>
        <a
          href={`mailto:${COMPANY.helloEmail}?subject=${subject}`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Spotted a mistake? Tell us
        </a>
      </p>
      {toc && toc.length > 0 && (
        <nav aria-label="On this page" className="mt-4">
          <ul className="flex flex-wrap gap-2">
            {toc.map((t) => (
              <li key={t.id}>
                <a
                  href={`#${t.id}`}
                  className="inline-block rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {t.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}
