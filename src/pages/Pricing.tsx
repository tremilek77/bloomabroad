import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Hero } from '@/components/blocks/Hero'
import { Section } from '@/components/blocks/Section'
import { CardGrid } from '@/components/blocks/Cards'
import { ButtonLink } from '@/components/blocks/ButtonLink'
import { Disclaimer } from '@/components/blocks/Disclaimer'
import { Table } from '@/components/legal/Prose'
import { WaitlistForm } from '@/components/WaitlistForm'
import { Reveal } from '@/components/saasta/Reveal'
import { cn } from '@/lib/utils'
import { usePageMeta } from '@/lib/seo'
import { ORG_ID, useSchema, webPageNode } from '@/lib/schema'
import { SITE_URL } from '@/lib/company'
import {
  CURRENCIES,
  FOUNDING_PLACES,
  LOCAL_PRICES_CONFIRMED,
  PRICES,
  money,
  type CurrencyId,
  type Money,
} from '@/content/prices'
import { READY } from '@/content/site'
import { Banknote, Lock, RotateCcw, UsersRound } from 'lucide-react'

const PATH = '/pricing'
const TITLE = 'Pricing: Readiness Assessment from €30 | BloomAbroad'
const DESCRIPTION =
  'One clear price, the same whatever your outcome. Readiness Assessment €30, Plus €65, with local prices in naira, shillings and cedis. First 100 pay less.'
const ANSWER =
  `The Readiness Assessment costs €30 and Readiness Assessment Plus costs €65, with ${LOCAL_PRICES_CONFIRMED ? '' : 'approximate '}local prices in naira, shillings and cedis. The price is the same whatever your outcome, and you see the exact amount before you pay. The first 100 waitlist members pay a founding price.`

const INCLUDED = [
  'Your full readiness outcome: Ready to Apply, Needs Support, or Not Yet in a Position to Apply',
  'Covers both application readiness and immigration readiness',
  'Reviewed by an experienced consultant',
  'Clear reasons and personalised next steps',
  'A summary you can share with parents or sponsors',
  'Your outcome within 5 working days',
]

const PLUS_EXTRA = [
  'A 30-minute call with a consultant to talk through your outcome and plan your next steps',
]

const GOOD_TO_KNOW = [
  {
    icon: UsersRound,
    title: 'Paying for someone else?',
    body: "Parents and sponsors can pay on a student's behalf.",
  },
  {
    icon: Lock,
    title: 'Secure payment',
    body: 'Only through our secure checkout on bloomabroad.ie, never by bank transfer to a personal account.',
  },
  {
    icon: Banknote,
    title: 'Same price, every outcome',
    body: 'What you pay never depends on your result.',
  },
  {
    icon: RotateCcw,
    title: '14 days to cancel',
    body: "If we haven't started your assessment, you get a full refund.",
  },
]

/** Service entries with a pre-order price in euro. Matches what's on the page. */
function offerNode(name: string, price: Money, description: string) {
  return {
    '@type': 'Service',
    '@id': `${SITE_URL}${PATH}#${name.toLowerCase().replace(/\s+/g, '-')}`,
    name,
    description,
    provider: { '@id': ORG_ID },
    areaServed: ['IE', 'NG', 'KE', 'GH'],
    offers: {
      '@type': 'Offer',
      price: String(price.eur),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/PreOrder',
      availabilityStarts: '2027-01-01',
      url: `${SITE_URL}${PATH}`,
    },
  }
}

export function PricingPage() {
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: PATH })
  useSchema('page', [
    webPageNode(PATH, TITLE, DESCRIPTION),
    offerNode(
      'Readiness Assessment',
      PRICES.assessment,
      'Your full readiness outcome covering application readiness and immigration readiness, reviewed by an experienced consultant, within 5 working days.',
    ),
    offerNode(
      'Readiness Assessment Plus',
      PRICES.plus,
      'Everything in the Readiness Assessment, plus a 30-minute call with a consultant to talk through your outcome.',
    ),
  ])

  const [cur, setCur] = useState<CurrencyId>('eur')

  return (
    <PageShell>
      <Hero
        centered
        title={
          <>
            Simple, <span className="text-glimmer">transparent</span> pricing
          </>
        }
        answer={ANSWER}
        actions={
          <ButtonLink to="#waitlist" arrow>
            Join the waitlist
          </ButtonLink>
        }
        note="Bookings open January 2027."
      />

      <Section width="wide">
        {/* Currency switcher */}
        <div className="flex flex-col items-center gap-3">
          <div
            role="group"
            aria-label="Show prices in"
            className="inline-flex flex-wrap justify-center gap-1 rounded-full border border-border bg-card p-1"
          >
            {CURRENCIES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={cur === c.id}
                onClick={() => setCur(c.id)}
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  cur === c.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          {cur === 'ngn' && (
            <Link to="/nigeria" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
              Studying from Nigeria? See our Nigeria page →
            </Link>
          )}
          {cur !== 'eur' && !LOCAL_PRICES_CONFIRMED && (
            <p className="max-w-xl text-center text-sm text-muted-foreground">
              Local prices are approximate. Checkout is in euro, and you'll always see the
              exact amount before you pay.
            </p>
          )}
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          <Tier
            name="Readiness Assessment"
            price={money(PRICES.assessment, cur)}
            founding={money(PRICES.foundingAssessment, cur)}
            approx={cur !== 'eur' && !LOCAL_PRICES_CONFIRMED}
            features={INCLUDED}
          />
          <Tier
            name="Readiness Assessment Plus"
            price={money(PRICES.plus, cur)}
            founding={money(PRICES.foundingPlus, cur)}
            approx={cur !== 'eur' && !LOCAL_PRICES_CONFIRMED}
            lead="Everything in the Readiness Assessment, plus:"
            features={PLUS_EXTRA}
            featured
          />
        </div>

        <Reveal>
          <div className="mx-auto mt-10 max-w-4xl rounded-2xl border border-signal/30 bg-signal/10 p-6 text-center">
            <h2 className="text-lg font-bold text-heading">Founding member offer</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground/85">
              The first {FOUNDING_PLACES} people to book from our waitlist pay a founding price:
              Readiness Assessment {cur !== 'eur' && !LOCAL_PRICES_CONFIRMED && 'approx. '}
              {money(PRICES.foundingAssessment, cur)}, Readiness Assessment Plus{' '}
              {cur !== 'eur' && !LOCAL_PRICES_CONFIRMED && 'approx. '}
              {money(PRICES.foundingPlus, cur)}. Bookings open in January 2027.
            </p>
            <div className="mt-5">
              <ButtonLink to="#waitlist">Join the waitlist</ButtonLink>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section tone="tint" eyebrow="All prices" title="Every price in one table" width="narrow">
        <Table
          head={
            LOCAL_PRICES_CONFIRMED
              ? ['Tier', 'Euro', 'Nigeria', 'Kenya', 'Ghana']
              : ['Tier', 'Euro', 'Nigeria (approx.)', 'Kenya (approx.)', 'Ghana (approx.)']
          }
          rows={(
            [
              ['Readiness Assessment', PRICES.assessment],
              ['Readiness Assessment Plus', PRICES.plus],
              [`Founding price: Assessment (first ${FOUNDING_PLACES})`, PRICES.foundingAssessment],
              [`Founding price: Plus (first ${FOUNDING_PLACES})`, PRICES.foundingPlus],
            ] as [string, Money][]
          ).map(([label, m]) => [
            label,
            money(m, 'eur'),
            money(m, 'ngn'),
            money(m, 'kes'),
            money(m, 'ghs'),
          ])}
        />
        <p className="mt-4 text-sm text-muted-foreground">
          Local prices are set in advance, rounded, and reviewed regularly.
          {!LOCAL_PRICES_CONFIRMED && ' They are approximate for now, and checkout is in euro.'}{' '}
          You'll always see the exact amount before you pay.
        </p>
      </Section>

      <Section eyebrow="Good to know" title="No surprises">
        <CardGrid items={GOOD_TO_KNOW} cols={2} />
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/terms" className="font-semibold text-primary underline-offset-4 hover:underline">
            See our Terms →
          </Link>
          {READY.verify && (
            <Link to="/verify" className="font-semibold text-primary underline-offset-4 hover:underline">
              How to verify it's really us →
            </Link>
          )}
          {READY.checklist && (
            <Link to="/checklist" className="font-semibold text-primary underline-offset-4 hover:underline">
              Not sure yet? Start with our free Ireland Readiness Checklist →
            </Link>
          )}
        </p>
      </Section>

      <Disclaimer variant="standard" />

      <WaitlistForm />
    </PageShell>
  )
}

function Tier({
  name,
  price,
  founding,
  approx = false,
  lead,
  features,
  featured = false,
}: {
  name: string
  price: string
  founding: string
  /** Local price that isn't confirmed yet, so label it "approx." */
  approx?: boolean
  lead?: string
  features: string[]
  featured?: boolean
}) {
  return (
    <Reveal className="h-full">
      <div
        className={cn(
          'flex h-full flex-col rounded-2xl border bg-card p-7',
          featured ? 'border-signal/40 ring-2 ring-signal/30' : 'border-border',
        )}
      >
        <h2 className="text-lg font-bold text-heading">{name}</h2>
        <p className="mt-4 text-4xl font-extrabold tracking-tight text-heading">
          {approx && <span className="mr-1.5 text-base font-medium text-muted-foreground">approx.</span>}
          {price}
        </p>
        <p className="mt-2 inline-flex w-fit rounded-full bg-signal/15 px-3 py-1 text-sm font-medium text-signal">
          Founding price {approx && 'approx. '}
          {founding}
        </p>
        {lead && <p className="mt-6 text-sm font-semibold text-heading">{lead}</p>}
        <ul className={cn('space-y-3 text-[15px] leading-relaxed text-foreground/85', lead ? 'mt-3' : 'mt-6')}>
          {features.map((f) => (
            <li key={f} className="flex gap-3">
              <Check className="mt-1 h-4 w-4 shrink-0 text-signal" aria-hidden />
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-7">
          <ButtonLink to="#waitlist" variant={featured ? 'primary' : 'secondary'}>
            Join the waitlist
          </ButtonLink>
        </div>
      </div>
    </Reveal>
  )
}
