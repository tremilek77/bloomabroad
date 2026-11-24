import { Link } from 'react-router-dom'
import { BarChart3, Eye, FileSearch, Settings2, Target } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Hero } from '@/components/blocks/Hero'
import { Section } from '@/components/blocks/Section'
import { CardGrid } from '@/components/blocks/Cards'
import { Steps } from '@/components/blocks/Steps'
import { TrustStrip } from '@/components/blocks/TrustStrip'
import { Disclaimer } from '@/components/blocks/Disclaimer'
import { FaqAccordion } from '@/components/blocks/FaqAccordion'
import { ButtonLink } from '@/components/blocks/ButtonLink'
import { WorkspacePreview } from '@/components/previews/WorkspacePreview'
import { UniversityWaitlistForm } from '@/components/UniversityWaitlistForm'
import { Reveal } from '@/components/saasta/Reveal'
import { usePageMeta } from '@/lib/seo'
import { faqNode, useSchema, webPageNode } from '@/lib/schema'
import { BOOKING_HREF, COMPANY, isPlaceholder } from '@/lib/company'
import { ANSWER_UNIVERSITIES, UNIVERSITY_DATA_FAQ, UNIVERSITY_FAQS } from '@/content/faqs'
import { FOUNDER, METHODOLOGY_ADVISER, READY } from '@/content/site'

const PATH = '/universities'
const TITLE = 'Enrolment Readiness Screening for Irish Universities'
const DESCRIPTION =
  "Screen international applications you've already received, consistently and early, with a clear record of each assessment. Early access for Irish institutions."

// The institution workspace isn't live, so everything here is future tense
// (brief, wording rules for P1). Claims marked [NEED] want pilot evidence.
const WHY = [
  {
    icon: BarChart3,
    title: 'Consistent assessment',
    body: 'Every application will be assessed against the same expert-designed scenarios, whoever reviews it.',
  },
  {
    icon: Eye,
    title: 'Early visibility of gaps',
    body: 'See what is missing or weak before your team commits more time.',
  },
  {
    icon: FileSearch,
    // [NEED: pilot data] before this can be stated as a result.
    title: 'Less manual screening',
    body: 'A consistent, auditable process, designed to leave your team free for decisions.',
  },
  {
    icon: Target,
    // [NEED: pilot data] before this can be stated as a result.
    title: 'A stronger path to enrolment',
    body: 'Put effort where applicants are positioned to progress.',
  },
  {
    icon: Settings2,
    title: 'Built around you',
    body: 'The workspace is being designed around your timelines, documents and criteria.',
  },
]

const STEPS = [
  {
    title: "Upload applications you've received",
    body: 'A secure workspace flags missing items first.',
  },
  {
    title: 'Send the assessment link',
    body: 'Once documents are approved, your team sends each applicant a secure link.',
  },
  {
    title: 'Review the readiness report',
    body: 'Outcome, reasoning and next steps, reviewed by a consultant during the pilot.',
  },
  { title: 'Decide and inform', body: 'The decision stays with your institution.' },
]

const PROOF = [
  { value: '10+ years', label: 'of real application and outcome data' },
  { value: '8 Irish institutions', label: 'consulted during development' },
  { value: 'Confirmed to address the challenges they face today' },
]

export function UniversitiesPage() {
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: PATH })

  // The data-handling FAQ is published only once the EU region is confirmed.
  const faqs = isPlaceholder(COMPANY.dataRegion)
    ? UNIVERSITY_FAQS
    : [...UNIVERSITY_FAQS.slice(0, 7), UNIVERSITY_DATA_FAQ, ...UNIVERSITY_FAQS.slice(7)]

  useSchema('page', [webPageNode(PATH, TITLE, DESCRIPTION), faqNode(PATH, faqs)])

  return (
    <PageShell>
      <Hero
        eyebrow="For universities and colleges"
        title={
          <>
            Enrolment readiness screening for{' '}
            <span className="text-glimmer">international applications</span>
          </>
        }
        answer={ANSWER_UNIVERSITIES}
        actions={
          <>
            <ButtonLink to="#waitlist" arrow>
              Request early access
            </ButtonLink>
            <ButtonLink to={BOOKING_HREF} variant="secondary">
              Book a 30-minute call with {FOUNDER.name}
            </ButtonLink>
          </>
        }
        aside={<WorkspacePreview />}
      />

      <Section
        tone="card"
        eyebrow="Why institutions choose BloomAbroad"
        title="Clear, consistent and early"
      >
        <CardGrid items={WHY} />
      </Section>

      <Section id="how" eyebrow="How it will work" title="Four steps. One clear answer.">
        <Steps steps={STEPS} />
      </Section>

      <Section
        tone="tint"
        eyebrow="Built on a decade of real data"
        title="Real student journeys, designed by an expert"
      >
        <ul className="max-w-3xl space-y-3 text-[15px] leading-relaxed text-foreground/85">
          <li>
            Built on more than ten years of documented student journeys: what was submitted,
            what happened, and why.
          </li>
          <li>
            {READY.about ? (
              <>
                The readiness methodology was designed by {METHODOLOGY_ADVISER.name},{' '}
                {METHODOLOGY_ADVISER.title}, who holds a PhD from University College Cork.{' '}
                <Link to="/about" className="font-semibold text-primary underline-offset-4 hover:underline">
                  Meet the team →
                </Link>
              </>
            ) : (
              'The readiness methodology was designed by a researcher in migration studies who holds a PhD.'
            )}
          </li>
          <li>
            Developed with input from international student directors at eight Irish
            universities and colleges.{' '}
            <Link to="/how-we-assess" className="font-semibold text-primary underline-offset-4 hover:underline">
              See how we assess →
            </Link>
          </li>
        </ul>
      </Section>
      <TrustStrip items={PROOF} columns={3} />

      <Section eyebrow="Early access" title="Help shape the institution workspace">
        <Reveal>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            We are building it with a small cohort of Irish institutions. Partners help shape
            it from configuration to reporting.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="#waitlist">Request early access</ButtonLink>
            <ButtonLink to={BOOKING_HREF} variant="secondary">
              Book a discovery call
            </ButtonLink>
          </div>
        </Reveal>
      </Section>

      <Section id="faq" tone="tint" eyebrow="FAQs" title="Questions, answered" width="narrow">
        <FaqAccordion items={faqs} visible={5} />
      </Section>

      <Disclaimer variant="standard" />

      <UniversityWaitlistForm />
    </PageShell>
  )
}
