import { Link } from 'react-router-dom'
import { Banknote, CalendarClock, ListChecks, ShieldCheck } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Hero } from '@/components/blocks/Hero'
import { Section } from '@/components/blocks/Section'
import { CardGrid } from '@/components/blocks/Cards'
import { ButtonLink } from '@/components/blocks/ButtonLink'
import { Disclaimer } from '@/components/blocks/Disclaimer'
import { WaitlistForm } from '@/components/WaitlistForm'
import { Reveal } from '@/components/saasta/Reveal'
import { usePageMeta } from '@/lib/seo'
import { breadcrumbNode, useSchema, webPageNode } from '@/lib/schema'
import {
  NIGERIA,
  approx,
  countryDescription,
  countryH1,
  countryTitle,
  type CountryConfig,
} from '@/content/countryPages'
import { PRICES, money, type Money } from '@/content/prices'
import { GUIDES, formatDate } from '@/content/guides'
import { READY } from '@/content/site'

/** Answer block (40-60 words): who it is for, what it does, the local price. */
const answer = (c: CountryConfig) =>
  `BloomAbroad checks your application readiness and immigration readiness for studying in Ireland, with every result reviewed by an experienced consultant. The Readiness Assessment costs ${approx}${money(PRICES.assessment, c.currency)}, or ${approx}${money(PRICES.foundingAssessment, c.currency)} for the first 100 waitlist members. You find out where you stand before you apply.`

const linkCls = 'text-sm font-semibold text-primary underline-offset-4 hover:underline'

function CountryPage({ c }: { c: CountryConfig }) {
  const path = `/${c.slug}`
  const title = countryTitle(c)
  const description = countryDescription(c)
  usePageMeta({ title, description, path })
  useSchema('page', [
    webPageNode(path, title, description),
    breadcrumbNode([
      { name: 'Home', path: '/' },
      { name: c.name, path },
    ]),
  ])

  // Up to three guides for students, the ones about this country first.
  const guides = GUIDES.filter((g) => g.audience === 'students')
    .sort((a, b) => Number(b.slug.includes(c.slug)) - Number(a.slug.includes(c.slug)))
    .slice(0, 3)

  const m = (p: Money) => money(p, c.currency)

  return (
    <PageShell>
      <Hero
        eyebrow={`For students in ${c.name}`}
        title={countryH1(c)}
        answer={answer(c)}
        actions={
          <>
            <ButtonLink to="#waitlist" arrow>
              Join the waitlist
            </ButtonLink>
            {READY.checklist && (
              <ButtonLink to={`/checklist?country=${encodeURIComponent(c.name)}`} variant="secondary">
                Get your free checklist
              </ButtonLink>
            )}
          </>
        }
        note={
          <>
            Undergraduate and postgraduate · Launching early 2027
            {READY.checklist && (
              <>
                <br />
                The checklist is free. The full assessment is paid.
              </>
            )}
          </>
        }
      />

      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-6 pt-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground">
            {c.name}
          </li>
        </ol>
      </nav>

      <Section
        eyebrow={`Why ${c.demonym} students check first`}
        title="Know before you commit"
        lead="Application fees, test fees, documents and months of waiting add up quickly. A readiness check shows what's strong, what's missing, and what to fix, before you commit."
      >
        <CardGrid
          items={[
            { icon: ListChecks, title: "What's strong", body: 'See where your profile already stands up.' },
            { icon: ListChecks, title: "What's missing", body: 'Find the gaps while there is still time to close them.' },
            { icon: ListChecks, title: 'What to fix', body: 'Get clear next steps for your own situation.' },
          ]}
        />
      </Section>

      <Section
        tone="tint"
        eyebrow={`Priced in ${c.currencyName}`}
        title={`Prices in ${c.currencyName}, the same whatever your outcome`}
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            { name: 'Readiness Assessment', price: m(PRICES.assessment), founding: m(PRICES.foundingAssessment) },
            { name: 'Readiness Assessment Plus', price: m(PRICES.plus), founding: m(PRICES.foundingPlus) },
          ].map((t, i) => (
            <Reveal key={t.name} delay={i * 0.07} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-signal">
                  <Banknote className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="text-base font-bold text-heading">{t.name}</h3>
                <p className="mt-2 text-3xl font-extrabold tracking-tight text-heading">
                  {approx && (
                    <span className="mr-1.5 text-base font-medium text-muted-foreground">approx.</span>
                  )}
                  {t.price}
                </p>
                <p className="mt-2 inline-flex rounded-full bg-signal/15 px-3 py-1 text-sm font-medium text-signal">
                  Founding price {approx && 'approx. '}
                  {t.founding}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          The founding price is for the first 100 waitlist members.
          {approx &&
            ' Local prices are approximate. Checkout is in euro, and you will always see the exact amount before you pay.'}
          {READY.pricing && (
            <>
              {' '}
              <Link to="/pricing" className={linkCls}>
                See full pricing →
              </Link>
            </>
          )}
        </p>
      </Section>

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="h-full rounded-2xl border border-border bg-card p-6">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-signal">
                <CalendarClock className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-base font-bold text-heading">Planning for September 2027?</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                Many Irish courses recruit on a rolling basis, so the earlier you know where you stand,
                the more options you keep open.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.07} className="h-full">
            <div className="h-full rounded-2xl border border-border bg-card p-6">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-signal">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-base font-bold text-heading">Stay safe</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                We only take payment through our secure checkout on bloomabroad.ie. We will never ask
                you for money to "show funds".
              </p>
              {READY.verify && (
                <p className="mt-3">
                  <Link to="/verify" className={linkCls}>
                    How to verify it's really us →
                  </Link>
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </Section>

      {c.founderLine && (
        <Section tone="tint" eyebrow="Founded by someone who's made the journey" width="narrow">
          <Reveal>
            <p className="text-lg leading-relaxed text-heading">
              {c.founderLine}{' '}
              {READY.about && (
                <Link to="/about" className={`${linkCls} whitespace-nowrap`}>
                  Meet the team →
                </Link>
              )}
            </p>
          </Reveal>
        </Section>
      )}

      {guides.length > 0 && (
        <Section eyebrow="Helpful guides" title={`Guides for students applying from ${c.name}`}>
          <ul className="grid gap-5 md:grid-cols-3">
            {guides.map((g, i) => (
              <li key={g.slug}>
                <Reveal delay={i * 0.06} className="h-full">
                  <Link
                    to={`/guides/${g.slug}`}
                    className="card-interactive flex h-full flex-col rounded-2xl border border-border bg-card p-5"
                  >
                    {!g.published && (
                      <span className="mb-2 w-fit rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                        Draft
                      </span>
                    )}
                    <h3 className="text-base font-bold leading-snug text-heading">{g.h1}</h3>
                    <p className="mt-auto pt-4 text-sm text-muted-foreground">
                      {g.readingMinutes} min read · Reviewed {formatDate(g.reviewed)}
                    </p>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Disclaimer variant="short" />

      <WaitlistForm defaultCountry={c.name} />
    </PageShell>
  )
}

export function NigeriaPage() {
  return <CountryPage c={NIGERIA} />
}
