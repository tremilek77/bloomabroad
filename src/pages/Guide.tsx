import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, CircleAlert } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Disclaimer } from '@/components/blocks/Disclaimer'
import { ButtonLink } from '@/components/blocks/ButtonLink'
import { NotFoundPage } from '@/pages/NotFound'
import { usePageMeta } from '@/lib/seo'
import {
  adviserNode,
  articleNode,
  breadcrumbNode,
  useSchema,
  webPageNode,
} from '@/lib/schema'
import { VISA_DISCLAIMER, formatDate, getGuide, GUIDES } from '@/content/guides'
import { METHODOLOGY_ADVISER, READY } from '@/content/site'

/** One guide: byline, short answer, contents, body, sources, then the next step. */
export function GuidePage() {
  const { slug = '' } = useParams()
  const guide = getGuide(slug)
  const navigate = useNavigate()
  const [html, setHtml] = useState<string | null>(null)

  // The article bodies are a separate chunk, loaded only on guide pages.
  useEffect(() => {
    let live = true
    import('virtual:guides-html').then((m) => live && setHtml(m.default[slug] ?? ''))
    return () => {
      live = false
    }
  }, [slug])

  const path = `/guides/${slug}`
  usePageMeta({
    title: guide?.title ?? 'Guide not found | BloomAbroad',
    description: guide?.description ?? '',
    path,
    noindex: !guide || !guide.published,
  })
  useSchema(
    'page',
    guide
      ? [
          webPageNode(path, guide.title, guide.description),
          articleNode(path, guide),
          adviserNode(),
          breadcrumbNode([
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/guides' },
            { name: guide.h1, path },
          ]),
        ]
      : [],
  )

  if (!guide) return <NotFoundPage />

  const related = guide.related
    .map((s) => GUIDES.find((g) => g.slug === s))
    .filter((g): g is NonNullable<typeof g> => Boolean(g))

  // Links inside the article use plain /paths; open them without a page reload.
  const onBodyClick = (e: React.MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a')
    const href = a?.getAttribute('href')
    if (a && href?.startsWith('/') && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      e.preventDefault()
      navigate(href)
    }
  }

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-6 py-12 md:py-16">
        {!guide.published && (
          <p
            role="note"
            className="mb-8 flex gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
          >
            <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
            <span>
              <strong>Draft.</strong> Not published and not yet reviewed by{' '}
              {METHODOLOGY_ADVISER.name}. Visitors to the live site cannot see this page.
            </span>
          </p>
        )}

        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li>
              <Link to="/" className="hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link to="/guides" className="hover:text-foreground">
                Guides
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-foreground">
              {guide.h1}
            </li>
          </ol>
        </nav>

        <h1 className="mt-6 text-3xl font-extrabold leading-[1.12] tracking-tight text-heading sm:text-4xl md:text-[2.5rem]">
          {guide.h1}
        </h1>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          By{' '}
          {READY.about ? (
            <Link to="/about" className="font-semibold text-foreground underline-offset-4 hover:underline">
              {METHODOLOGY_ADVISER.name}
            </Link>
          ) : (
            <strong className="font-semibold text-foreground">{METHODOLOGY_ADVISER.name}</strong>
          )}
          , {METHODOLOGY_ADVISER.title}. {METHODOLOGY_ADVISER.credential}.
          <br />
          Last reviewed {formatDate(guide.reviewed)} · {guide.readingMinutes} min read
        </p>

        <div className="mt-8 rounded-2xl border border-signal/30 bg-signal/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-eyebrow">
            The short answer
          </p>
          <p className="mt-2 text-[17px] leading-relaxed text-heading">{guide.answer}</p>
        </div>

        {guide.headings.length >= 3 && (
          <nav aria-label="On this page" className="mt-8">
            <p className="text-sm font-bold text-heading">On this page</p>
            <ol className="mt-2 space-y-1.5 text-[15px]">
              {guide.headings.map((h) => (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                  >
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {html === null ? (
          <div className="mt-10 h-64" aria-hidden />
        ) : (
          <div
            className="guide-body mt-10"
            onClick={onBodyClick}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}

        {guide.sources.length > 0 && (
          <section aria-labelledby="sources" className="mt-12">
            <h2 id="sources" className="text-xl font-bold text-heading">
              Sources
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Rules change. Always check the official page before you act.
            </p>
            <ul className="mt-4 space-y-2 text-[15px]">
              {guide.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline underline-offset-4"
                  >
                    {s.label}
                  </a>
                  {s.checked && (
                    <span className="text-muted-foreground"> · checked {formatDate(s.checked)}</span>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {guide.visa && (
          <p className="mt-8 rounded-xl border border-border bg-card/60 p-4 text-sm font-medium text-heading">
            {VISA_DISCLAIMER}
          </p>
        )}

        {/* Every guide ends with the free checklist, then the assessment. */}
        <section aria-labelledby="next" className="mt-12">
          <h2 id="next" className="text-xl font-bold text-heading">
            What to do next
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {READY.checklist && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="text-base font-bold text-heading">Get your free checklist</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  A free 2-minute quiz and a personal list of what to prepare. It is not an
                  assessment.
                </p>
                <div className="mt-4">
                  <ButtonLink to="/checklist" variant="secondary" arrow>
                    Start the checklist
                  </ButtonLink>
                </div>
              </div>
            )}
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="text-base font-bold text-heading">See where you stand</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                The BloomAbroad assessment checks your application and immigration readiness,
                reviewed by an experienced consultant.
              </p>
              <div className="mt-4">
                <ButtonLink to="/students#waitlist" arrow>
                  Join the waitlist
                </ButtonLink>
              </div>
            </div>
          </div>
          {READY.pricing && (
            <p className="mt-4 text-sm">
              <Link to="/pricing" className="font-semibold text-primary underline-offset-4 hover:underline">
                See pricing →
              </Link>
            </p>
          )}
        </section>

        {related.length > 0 && (
          <section aria-labelledby="related" className="mt-12">
            <h2 id="related" className="text-xl font-bold text-heading">
              Related guides
            </h2>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/guides/${r.slug}`}
                    className="group inline-flex items-center gap-2 font-medium text-primary"
                  >
                    <span className="underline-offset-4 group-hover:underline">{r.h1}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <Disclaimer variant="short" />
    </PageShell>
  )
}
