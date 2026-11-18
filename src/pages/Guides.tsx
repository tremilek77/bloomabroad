import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Hero } from '@/components/blocks/Hero'
import { Section } from '@/components/blocks/Section'
import { ButtonLink } from '@/components/blocks/ButtonLink'
import { Disclaimer } from '@/components/blocks/Disclaimer'
import { Reveal } from '@/components/saasta/Reveal'
import { usePageMeta } from '@/lib/seo'
import { breadcrumbNode, useSchema, webPageNode } from '@/lib/schema'
import { AUDIENCE_LABEL, GUIDES, formatDate, type Guide } from '@/content/guides'
import { READY } from '@/content/site'

const PATH = '/guides'
const TITLE = 'Guides to Studying in Ireland for International Students'
const DESCRIPTION =
  'Plain-English guides to studying in Ireland, from visa requirements to English tests, for students, parents and universities. Written and reviewed by an expert.'
const ANSWER =
  "BloomAbroad's guides explain how to study in Ireland in plain English, from choosing a course to meeting immigration requirements. Each guide is written for students and families or for universities, reviewed by Dr Olaniyi Kolawole, and links to official sources, so you can check every fact yourself."

function GuideCard({ g, delay }: { g: Guide; delay: number }) {
  return (
    <li>
      <Reveal delay={delay} className="h-full">
        <Link
          to={`/guides/${g.slug}`}
          className="card-interactive group flex h-full flex-col rounded-2xl border border-border bg-card p-6"
        >
          {!g.published && (
            <span className="mb-3 w-fit rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
              Draft
            </span>
          )}
          <h3 className="text-lg font-bold leading-snug text-heading">{g.h1}</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{g.description}</p>
          <p className="mt-auto flex items-center justify-between pt-5 text-sm text-muted-foreground">
            <span>
              {g.readingMinutes} min read · Reviewed {formatDate(g.reviewed)}
            </span>
            <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" />
          </p>
        </Link>
      </Reveal>
    </li>
  )
}

export function GuidesPage() {
  const empty = GUIDES.length === 0
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: PATH, noindex: empty })
  useSchema('page', [
    webPageNode(PATH, TITLE, DESCRIPTION),
    breadcrumbNode([
      { name: 'Home', path: '/' },
      { name: 'Guides', path: PATH },
    ]),
  ])

  const groups = (['students', 'universities'] as const)
    .map((a) => ({ audience: a, guides: GUIDES.filter((g) => g.audience === a) }))
    .filter((g) => g.guides.length > 0)

  return (
    <PageShell>
      <Hero
        centered
        title={
          <>
            Guides to <span className="text-glimmer">studying in Ireland</span>
          </>
        }
        answer={ANSWER}
      />

      {empty ? (
        <Section width="narrow" eyebrow="Coming soon" title="Our first guides are on the way">
          <p className="text-lg leading-relaxed text-muted-foreground">
            In the meantime, our free checklist gives you a personal list of what to prepare.
          </p>
          {READY.checklist && (
            <div className="mt-6">
              <ButtonLink to="/checklist" arrow>
                Get the free checklist
              </ButtonLink>
            </div>
          )}
        </Section>
      ) : (
        groups.map((grp, i) => (
          <Section
            key={grp.audience}
            tone={i % 2 ? 'tint' : 'plain'}
            eyebrow={AUDIENCE_LABEL[grp.audience]}
            title={grp.audience === 'students' ? 'For students, parents and sponsors' : 'For admissions teams'}
          >
            <ul className="grid gap-5 md:grid-cols-2">
              {grp.guides.map((g, j) => (
                <GuideCard key={g.slug} g={g} delay={j * 0.06} />
              ))}
            </ul>
          </Section>
        ))
      )}

      <Disclaimer variant="short" />
    </PageShell>
  )
}
