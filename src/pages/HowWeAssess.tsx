import { Link } from 'react-router-dom'
import { BookOpenCheck, GraduationCap, Landmark, Layers, UserRoundCheck } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Hero } from '@/components/blocks/Hero'
import { Section } from '@/components/blocks/Section'
import { CardGrid } from '@/components/blocks/Cards'
import { Steps } from '@/components/blocks/Steps'
import { IconList } from '@/components/blocks/IconList'
import { Disclaimer } from '@/components/blocks/Disclaimer'
import { FaqAccordion } from '@/components/blocks/FaqAccordion'
import { AudienceSplit } from '@/components/AudienceSplit'
import { Reveal } from '@/components/saasta/Reveal'
import { usePageMeta } from '@/lib/seo'
import { breadcrumbNode, faqNode, useSchema, webPageNode } from '@/lib/schema'
import { STUDENT_FAQS, UNIVERSITY_FAQS, type Faq } from '@/content/faqs'
import { OUTCOMES } from '@/content/outcomes'
import { METHODOLOGY_ADVISER, READY } from '@/content/site'

const PATH = '/how-we-assess'
const TITLE = 'How We Assess Readiness to Study in Ireland | BloomAbroad'
const DESCRIPTION =
  'One structured method, applied the same way every time. See how BloomAbroad checks application and immigration readiness, and how a consultant reviews results.'
const ANSWER =
  'BloomAbroad assesses enrolment readiness with one structured methodology, applied the same way every time. It checks application readiness and immigration readiness together against expert-designed scenarios built on more than ten years of documented student journeys. An experienced consultant reviews every result before it is issued.'

const STEPS = [
  { title: 'You provide the facts', body: 'A short questionnaire and your documents, uploaded securely.' },
  { title: 'Your profile is checked', body: 'Against expert-designed readiness scenarios.' },
  { title: 'A consultant reviews it', body: 'An experienced consultant checks every result.' },
  { title: 'You get your outcome', body: 'Within 5 working days, with the reasons and next steps.' },
]

const LOOKS_AT = [
  'Your qualifications',
  'Your course choice',
  'Your English',
  'Your documents',
  'How everything fits together, not just your grades',
]

const WE_DO = [
  'Check application readiness and immigration readiness together',
  'Record the reasoning behind every outcome, so it can be audited',
  'Have an experienced consultant review every result',
  'Tell you plainly where you stand, even when the answer is "not yet"',
]

const WE_DO_NOT = [
  'Apply to universities for you, or send you to any institution',
  'Take commission from anyone',
  'Prepare, source or advise on financial documents',
  "Give visa advice or make visa decisions. Always check the official guidance",
  'Make admissions decisions. Those stay with each university',
  'Promise or guarantee admission, a visa, or any outcome',
]

/** The questions this page answers, taken from the existing FAQ sets. */
const faqs: Faq[] = [
  ...[
    'What does the assessment look at?',
    'Are you an agent? Will you apply for me?',
    "Does a good outcome mean I'll get in?",
  ].map((q) => STUDENT_FAQS.find((f) => f.q === q)!),
  ...['What is the assessment based on?', 'How are findings validated?']
    .map((q) => UNIVERSITY_FAQS.find((f) => f.q === q))
    .filter((f): f is Faq => Boolean(f)),
]

export function HowWeAssessPage() {
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: PATH })
  useSchema('page', [
    webPageNode(PATH, TITLE, DESCRIPTION),
    faqNode(PATH, faqs),
    breadcrumbNode([
      { name: 'Home', path: '/' },
      { name: 'How we assess', path: PATH },
    ]),
  ])

  // Dr Kolawole is named only once /about is live (see content/site.ts).
  const designer = READY.about
    ? `${METHODOLOGY_ADVISER.name}, ${METHODOLOGY_ADVISER.title}, who holds a PhD in social science from University College Cork, specialising in migration and diversity`
    : 'a researcher in migration studies who holds a PhD'

  return (
    <PageShell>
      <Hero
        centered
        eyebrow="Our methodology"
        title={
          <>
            How BloomAbroad <span className="text-glimmer">assesses</span> enrolment readiness
          </>
        }
        answer={ANSWER}
      />

      <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-6 pt-4 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li>
            <Link to="/" className="hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-foreground">
            How we assess
          </li>
        </ol>
      </nav>

      <Section
        id="readiness"
        eyebrow="Readiness"
        title="What do we mean by readiness?"
        lead="Meeting entry requirements is only the start. Readiness is how prepared an applicant is to get an offer, meet immigration requirements and begin the course."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ['Application readiness', 'Are you positioned to get an offer?'],
            ['Immigration readiness', 'Are you positioned to meet immigration requirements?'],
          ].map(([t, b], i) => (
            <Reveal key={t} delay={i * 0.07} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold text-heading">{t}</h3>
                <p className="mt-2 text-[15px] text-muted-foreground">{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-sm">
          <Link
            to="/enrolment-readiness"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Read the full definition of enrolment readiness →
          </Link>
        </p>
      </Section>

      <Section
        id="method"
        tone="tint"
        eyebrow="The method"
        title="Where does the methodology come from?"
        lead="It rests on real student journeys and was designed by an expert, and every assessment applies the same methodology."
      >
        <CardGrid
          items={[
            {
              icon: BookOpenCheck,
              title: 'Ten years of real journeys',
              body: 'More than ten years of documented journeys: what was submitted, what happened, and why.',
            },
            {
              icon: GraduationCap,
              title: 'Designed by an expert',
              body: `Designed by ${designer}.`,
            },
            {
              icon: Landmark,
              title: 'Tested with institutions',
              body: 'Developed with input from international student directors at eight Irish universities and colleges.',
            },
          ]}
        />
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Those directors confirmed the challenges the methodology is designed to address. Its
          expert-designed readiness scenarios apply from day one.
        </p>
      </Section>

      <Section id="process" eyebrow="The process" title="How does an assessment work?">
        <Steps steps={STEPS} />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="h-full rounded-2xl border border-border bg-card p-6">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-signal">
                <Layers className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-base font-bold text-heading">What it looks at</h3>
              <ul className="mt-3 space-y-2 text-[15px] text-foreground/85">
                {LOOKS_AT.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.07} className="h-full">
            <div className="h-full rounded-2xl border border-border bg-card p-6">
              <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-signal">
                <UserRoundCheck className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="text-base font-bold text-heading">How results are checked</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">
                Every assessment applies the same methodology, and each outcome is recorded with
                the reasoning behind it, so it can be audited. An experienced consultant reviews
                every result before it is issued.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section
        id="outcomes"
        tone="tint"
        eyebrow="Your outcome"
        title="What do the three outcomes mean?"
        lead="Each one comes with the reasons behind it and next steps for your situation."
      >
        <ul className="grid gap-4 md:grid-cols-3">
          {OUTCOMES.map((o, i) => (
            <li key={o.name}>
              <Reveal delay={i * 0.07} className="h-full">
                <div className={`h-full rounded-2xl border p-5 ${o.cls}`}>
                  <h3 className="text-base font-bold text-heading">{o.name}</h3>
                  <p className="mt-1.5 text-[15px] text-muted-foreground">{o.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          An outcome describes where you stand today. Whether a university admits you is its own
          decision, and no one can promise it in advance.
        </p>
      </Section>

      <Section id="limits" eyebrow="Our limits" title="What do we do, and what do we not do?">
        <div className="grid gap-5 md:grid-cols-2">
          <IconList title="What we do" items={WE_DO} tone="yes" />
          <IconList title="What we do not do" items={WE_DO_NOT} tone="no" delay={0.07} />
        </div>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          Universities decide on admission, and Ireland's immigration authorities decide on
          immigration matters. For official requirements, go to{' '}
          <a
            href="https://www.irishimmigration.ie"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            irishimmigration.ie
          </a>
          .
        </p>
      </Section>

      <Disclaimer variant="short" />

      <Section id="faq" tone="tint" eyebrow="FAQs" title="Questions about the method" width="narrow">
        <FaqAccordion items={faqs} visible={5} />
      </Section>

      <AudienceSplit />
    </PageShell>
  )
}
