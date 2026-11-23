import { Link } from 'react-router-dom'
import { Compass, Search, Wallet } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Hero } from '@/components/blocks/Hero'
import { Section } from '@/components/blocks/Section'
import { CardGrid } from '@/components/blocks/Cards'
import { PageMetaBar } from '@/components/blocks/PageMetaBar'
import { Disclaimer } from '@/components/blocks/Disclaimer'
import { FaqAccordion } from '@/components/blocks/FaqAccordion'
import { AudienceSplit } from '@/components/AudienceSplit'
import { Reveal } from '@/components/saasta/Reveal'
import { usePageMeta } from '@/lib/seo'
import { breadcrumbNode, faqNode, useSchema, webPageNode } from '@/lib/schema'
import { SITE_URL } from '@/lib/company'
import type { Faq } from '@/content/faqs'

const PATH = '/enrolment-readiness'
const TITLE = 'What Is Enrolment Readiness? A Plain Guide | BloomAbroad'
const DESCRIPTION =
  'Enrolment readiness is how prepared someone is to get an offer, meet immigration requirements and start a course in Ireland. What it covers and why it matters.'
const ANSWER =
  'Enrolment readiness is how prepared an applicant is to get an offer, meet immigration requirements and begin their course. It has two parts: application readiness and immigration readiness. Checking both before you apply shows gaps while there is still time to fix them, instead of after fees are paid and months have passed.'

const TOC = [
  { id: 'what', label: 'What it is' },
  { id: 'parts', label: 'The two parts' },
  { id: 'why', label: 'Why check first' },
  { id: 'who-decides', label: 'Who decides what' },
  { id: 'glossary', label: 'Glossary' },
]

/**
 * Glossary. The Irish terms come from the Irish immigration service's policy
 * statement "TrustEd Ireland Scheme and Immigration Requirements" on
 * irishimmigration.ie. Re-check them against it before changing anything, and
 * update the page date in content/updated.ts when you do.
 */
const GLOSSARY: { term: string; def: string }[] = [
  {
    term: 'Enrolment readiness',
    def: 'How prepared an applicant is to get an offer, meet immigration requirements and begin the course. It combines application readiness and immigration readiness.',
  },
  {
    term: 'Application readiness',
    def: 'Whether an applicant is positioned to get an offer. It covers qualifications, course choice, English and documents, and how they fit together.',
  },
  {
    term: 'Immigration readiness',
    def: 'Whether an applicant is positioned to meet immigration requirements. BloomAbroad checks readiness only. It does not give immigration advice or make decisions.',
  },
  {
    term: 'QQI (Quality and Qualifications Ireland)',
    def: "The state agency responsible for promoting the quality, integrity and reputation of Ireland's further and higher education system.",
  },
  {
    term: 'TrustEd Ireland',
    def: 'The statutory quality mark for student immigration purposes. Education providers that intend to recruit non-EU/EEA/Swiss students who need study visas or immigration permission to reside in Ireland to study must be authorised by QQI to use it. Holding the mark does not guarantee that every course a provider offers qualifies.',
  },
  {
    term: 'ILEP (Interim List of Eligible Programmes)',
    def: 'The list that is being superseded by the TrustEd Ireland mark. Providers still listed must keep meeting its criteria until they are authorised to use the mark or their listing ends.',
  },
  {
    term: 'Stamp 2',
    def: 'The Irish immigration permission linked to registering as an international student. Conditions change, so check the current rules on irishimmigration.ie.',
  },
]

const faqs: Faq[] = [
  {
    q: 'What is enrolment readiness?',
    a: ANSWER,
  },
  {
    q: 'Is enrolment readiness the same as meeting the entry requirements?',
    a: 'No. Meeting entry requirements is only the start. Enrolment readiness also covers whether you are positioned to meet immigration requirements and begin the course.',
  },
  {
    q: 'Does BloomAbroad decide whether someone gets in?',
    a: "No. Universities decide on admission, and Ireland's immigration authorities decide on visa and immigration matters. BloomAbroad gives a readiness view so you can apply knowing where you stand.",
  },
]

const linkCls = 'font-semibold text-primary underline-offset-4 hover:underline'

export function EnrolmentReadinessPage() {
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: PATH })
  useSchema('page', [
    webPageNode(PATH, TITLE, DESCRIPTION),
    faqNode(PATH, faqs),
    {
      '@type': 'DefinedTermSet',
      '@id': `${SITE_URL}${PATH}#glossary`,
      name: 'Enrolment readiness glossary',
      hasDefinedTerm: GLOSSARY.map((g) => ({
        '@type': 'DefinedTerm',
        name: g.term,
        description: g.def,
        inDefinedTermSet: `${SITE_URL}${PATH}#glossary`,
      })),
    },
    breadcrumbNode([
      { name: 'Home', path: '/' },
      { name: 'What is enrolment readiness?', path: PATH },
    ]),
  ])

  return (
    <PageShell>
      <Hero
        centered
        eyebrow="Plain-English guide"
        title={
          <>
            What is <span className="text-glimmer">enrolment readiness</span>?
          </>
        }
        answer={ANSWER}
      />
      <PageMetaBar path={PATH} minutes={4} toc={TOC} />

      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-6 pt-4 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground">
            What is enrolment readiness?
          </li>
        </ol>
      </nav>

      <Section
        id="what"
        eyebrow="The idea"
        title="What is enrolment readiness?"
        width="narrow"
      >
        <div className="space-y-4 text-[17px] leading-relaxed text-foreground/85">
          <p>
            Meeting entry requirements is only the start. A capable applicant can still find out
            they were not ready only after the fees have been paid and the months have passed.
          </p>
          <p>
            Enrolment readiness looks at the whole picture: whether you are positioned to get an
            offer, to meet immigration requirements, and to begin the course. We check it so gaps
            show up before they cost time and money.
          </p>
        </div>
      </Section>

      <Section
        id="parts"
        tone="tint"
        eyebrow="Two parts"
        title="What are application readiness and immigration readiness?"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="h-full rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold text-heading">Application readiness</h3>
              <p className="mt-2 font-medium text-heading">Are you positioned to get an offer?</p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                It covers your qualifications, your course choice, your English and your
                documents, and how they fit together. It is not just your grades.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.07} className="h-full">
            <div className="h-full rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-bold text-heading">Immigration readiness</h3>
              <p className="mt-2 font-medium text-heading">
                Are you positioned to meet immigration requirements?
              </p>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                It looks at whether your situation and documents are ready for the immigration
                step. BloomAbroad checks readiness only. Official requirements are set by
                Ireland's immigration authorities at{' '}
                <a
                  href="https://www.irishimmigration.ie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkCls}
                >
                  irishimmigration.ie
                </a>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section id="why" eyebrow="Why it matters" title="Why check before you apply?">
        <CardGrid
          items={[
            { icon: Search, title: 'Spot gaps early', body: "See what's missing while there's still time to fix it." },
            {
              icon: Wallet,
              title: 'Spend with care',
              body: 'Application fees, test fees, documents and months of waiting add up quickly.',
            },
            {
              icon: Compass,
              title: 'Get next steps',
              body: 'Clear actions for your own profile, not advice that worked for someone else.',
            },
          ]}
        />
      </Section>

      <Section
        id="who-decides"
        tone="tint"
        eyebrow="Roles"
        title="Who decides what?"
        width="narrow"
      >
        <ul className="space-y-3 text-[16px] leading-relaxed text-foreground/85">
          <li>
            <strong className="text-heading">Universities and colleges</strong> decide on
            admission.
          </li>
          <li>
            <strong className="text-heading">Ireland's immigration authorities</strong> decide on
            visa and immigration matters.
          </li>
          <li>
            <strong className="text-heading">BloomAbroad</strong> gives a readiness view, so you
            can apply knowing where you stand. No outcome guarantees admission or a visa.
          </li>
        </ul>
        <p className="mt-6 text-sm">
          <Link to="/how-we-assess" className={linkCls}>
            See exactly how we assess readiness →
          </Link>
        </p>
      </Section>

      <Section
        id="glossary"
        eyebrow="Glossary"
        title="Terms you will see when studying in Ireland"
        lead="The Irish terms come from the Irish immigration service's policy statement on the TrustEd Ireland scheme."
        width="narrow"
      >
        <dl className="space-y-6">
          {GLOSSARY.map((g) => (
            <div key={g.term} className="border-b border-border/70 pb-6 last:border-0">
              <dt className="text-base font-bold text-heading">{g.term}</dt>
              <dd className="mt-2 text-[15px] leading-relaxed text-foreground/85">{g.def}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-2 text-sm text-muted-foreground">
          Source:{' '}
          <a
            href="https://www.irishimmigration.ie/wp-content/uploads/2026/02/Policy-Statement-TrustEd-Ireland-and-Immigration-Requirements.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={linkCls}
          >
            TrustEd Ireland Scheme and Immigration Requirements, irishimmigration.ie
          </a>
          . Rules change, so always check the official pages.
        </p>
      </Section>

      <Disclaimer variant="short" />

      <Section tone="tint" eyebrow="FAQs" title="Quick answers" width="narrow">
        <FaqAccordion items={faqs} visible={3} />
      </Section>

      <AudienceSplit />
    </PageShell>
  )
}
