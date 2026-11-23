import { ChevronDown, CircleAlert } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Hero } from '@/components/blocks/Hero'
import { Section } from '@/components/blocks/Section'
import { ButtonLink } from '@/components/blocks/ButtonLink'
import { Reveal } from '@/components/saasta/Reveal'
import { NotFoundPage } from '@/pages/NotFound'
import { usePageMeta } from '@/lib/seo'
import { adviserNode, founderNode, useSchema, webPageNode } from '@/lib/schema'
import { SHOW_DRAFTS } from '@/lib/drafts'
import { PEOPLE, type Person } from '@/content/team'
import { READY } from '@/content/site'
import { cn } from '@/lib/utils'

const PATH = '/about'
const TITLE = 'About BloomAbroad: Remi Kolawole and Dr Olaniyi Kolawole'
const DESCRIPTION =
  'Meet the team behind BloomAbroad: founder Remi Kolawole, with 10+ years supporting Ireland-bound students, and Methodology Adviser Dr Olaniyi Kolawole.'
const ANSWER =
  'BloomAbroad was founded by Remi Kolawole, who has spent more than ten years supporting students applying to study in Ireland. Remi and her husband, Dr Olaniyi Kolawole, both came to Ireland, studied here and built their lives here over more than twenty years.'

/** The page is a hidden draft until READY.about is switched on (see content/site.ts). */
const visible = READY.about || SHOW_DRAFTS

/**
 * Until the page is live, none of its content may reach the live site: not the
 * body, and not the title, description or structured data either. So the hidden
 * case returns early, before any of those hooks run.
 */
export function AboutPage() {
  return visible ? <AboutContent /> : <NotFoundPage />
}

function AboutContent() {
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: PATH, noindex: !READY.about })
  useSchema('page', [
    { ...webPageNode(PATH, TITLE, DESCRIPTION), '@type': 'AboutPage' },
    { ...founderNode(), description: PEOPLE[0].summary },
    { ...adviserNode(), description: PEOPLE[1].summary },
  ])

  return (
    <PageShell>
      {!READY.about && (
        <p
          role="note"
          className="mx-auto mt-6 flex max-w-3xl gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground"
        >
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" aria-hidden />
          <span>
            <strong>Draft.</strong> Hidden on the live site until Dr Kolawole has agreed to his bio
            and photo, and both photos are in. Visitors cannot see this page.
          </span>
        </p>
      )}

      <Hero
        centered
        title={
          <>
            Built by people who've <span className="text-glimmer">made the journey</span>
          </>
        }
        answer={ANSWER}
      />

      <Section tone="plain" eyebrow="The team" title="Who is behind BloomAbroad">
        <div className="space-y-16">
          {PEOPLE.map((p, i) => (
            <PersonBlock key={p.id} person={p} flip={i % 2 === 1} />
          ))}
        </div>
      </Section>

      <Section tone="tint" width="narrow">
        <Reveal>
          <div className="text-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-heading md:text-3xl">
              Know where you stand before you apply
            </h2>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink to="/#waitlist" arrow>
                Join the waitlist
              </ButtonLink>
              <ButtonLink to="/contact" variant="secondary">
                Contact us
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Section>
    </PageShell>
  )
}

function Photo({ person }: { person: Person }) {
  if (person.photo) {
    return (
      <img
        src={person.photo}
        alt={person.photoAlt}
        loading="lazy"
        className="aspect-[4/5] w-full rounded-3xl object-cover"
      />
    )
  }
  // Placeholder until there is a photo the person has agreed to.
  return (
    <div
      role="img"
      aria-label={`Photo of ${person.name} to come`}
      className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-3xl"
      style={{ background: 'var(--gradient-bloom)' }}
    >
      <span className="text-6xl font-extrabold tracking-tight text-signal-foreground/90">
        {person.initials}
      </span>
      {!READY.about && (
        <span className="absolute bottom-3 left-3 rounded-full bg-background/80 px-3 py-1 text-xs font-medium text-foreground">
          Photo to come
        </span>
      )}
    </div>
  )
}

function PersonBlock({ person, flip }: { person: Person; flip: boolean }) {
  return (
    <Reveal>
      <article
        aria-labelledby={`person-${person.id}`}
        className="grid items-center gap-8 md:grid-cols-[18rem_1fr] md:gap-12"
      >
        <div className={cn('mx-auto w-full max-w-[18rem]', flip && 'md:order-2')}>
          <Photo person={person} />
        </div>
        <div className={cn(flip && 'md:order-1')}>
          <h3 id={`person-${person.id}`} className="text-2xl font-extrabold tracking-tight text-heading">
            {person.name}
          </h3>
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-eyebrow">
            {person.role}
          </p>
          <p className="mt-4 text-[17px] leading-relaxed text-foreground/90">{person.summary}</p>

          <details className="group mt-4">
            <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-semibold text-primary">
              {person.id === 'remi' ? 'Her background' : 'His background'}
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
              {person.background.map((b) => (
                <p key={b}>{b}</p>
              ))}
            </div>
          </details>

          {person.quote && (
            <blockquote className="mt-6 border-l-[3px] border-l-[var(--signal)] pl-4">
              <p className="text-lg font-medium italic leading-relaxed text-heading">
                “{person.quote}”
              </p>
              <footer className="mt-2 text-sm text-muted-foreground">{person.name}</footer>
            </blockquote>
          )}
        </div>
      </article>
    </Reveal>
  )
}
