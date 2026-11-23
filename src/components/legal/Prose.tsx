import type { ReactNode } from 'react'
import { PageShell } from '@/components/PageShell'
import { isPlaceholder } from '@/lib/company'

export { PageShell }

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string
  /** Shown as "Last updated: …" under the title. Omit for pages without one. */
  updated?: string
  children: ReactNode
}) {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-heading md:text-5xl">
          {title}
        </h1>
        {updated && (
          <p className="mt-4 text-sm italic text-muted-foreground">
            Last updated: {updated}
          </p>
        )}
        <div className="mt-8">{children}</div>
      </article>
    </PageShell>
  )
}

/** An <h2> with an optional anchor id (Terms section 11 needs #complaints). */
export function H2({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-10 scroll-mt-24 text-xl font-bold tracking-tight text-heading"
    >
      {children}
    </h2>
  )
}

export function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-6 text-base font-semibold text-heading">{children}</h3>
  )
}

export function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">{children}</p>
  )
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-foreground/85 marker:text-signal">
      {children}
    </ul>
  )
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="mt-3 list-decimal space-y-2 pl-5 text-[15px] leading-relaxed text-foreground/85 marker:font-semibold marker:text-signal">
      {children}
    </ol>
  )
}

export function Lead({ children }: { children: ReactNode }) {
  return <strong className="font-semibold text-heading">{children}</strong>
}

/** A value from lib/company.ts. While it's still an unfilled [placeholder]
 *  it's highlighted, so it can't be missed in review. */
export function Fill({ value }: { value: string }) {
  if (!isPlaceholder(value)) return <>{value}</>
  return (
    <mark className="rounded bg-amber-200 px-1 text-black" title="Placeholder: fill in lib/company.ts">
      {value}
    </mark>
  )
}

export function Table({
  head,
  rows,
}: {
  head: string[]
  rows: ReactNode[][]
}) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border/70 align-top last:border-0">
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={
                    j === 0
                      ? 'px-4 py-3 font-medium text-foreground'
                      : 'px-4 py-3 text-muted-foreground'
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const linkCls =
  'font-medium text-primary underline underline-offset-4 hover:opacity-80'
