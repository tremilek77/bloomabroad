import { Navigate, useSearchParams, Link } from 'react-router-dom'
import { Building2, GraduationCap, UsersRound } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Hero } from '@/components/blocks/Hero'
import { ButtonLink } from '@/components/blocks/ButtonLink'
import { TrustStrip } from '@/components/blocks/TrustStrip'
import { Disclaimer } from '@/components/blocks/Disclaimer'
import { Section } from '@/components/blocks/Section'
import { IconList } from '@/components/blocks/IconList'
import { FaqAccordion } from '@/components/blocks/FaqAccordion'
import { AudienceSplit } from '@/components/AudienceSplit'
import { Reveal } from '@/components/saasta/Reveal'
import { usePageMeta } from '@/lib/seo'
import { faqNode, useSchema, webPageNode } from '@/lib/schema'
import { ANSWER_STUDENTS, PARENT_FAQS, STUDENT_FAQS, type Faq } from '@/content/faqs'
import { FOUNDER, READY } from '@/content/site'

const TITLE = 'Enrolment Readiness for Studying in Ireland | BloomAbroad'
const DESCRIPTION =
  'BloomAbroad checks application and immigration readiness for studying in Ireland, so students know where they stand before they apply. An Irish company in Cork.'

const TRUST = [
  { value: '10+ years of application and outcome data' },
  { value: 'Expert-reviewed results' },
  { value: 'Independent: not an agent, no commission' },
  { value: 'An Irish company in Cork' },
]

const WHO = [
  {
    icon: GraduationCap,
    title: 'Students',
    body: 'Find out where you stand before you spend on applications, tests and documents.',
    to: '/students',
    cta: 'For students',
  },
  {
    icon: UsersRound,
    title: 'Parents and sponsors',
    body: 'Get a clear outcome and a summary written for you, before you commit.',
    to: '/students#parents',
    cta: 'For parents and sponsors',
  },
  {
    icon: Building2,
    title: 'Universities and colleges',
    body: 'A consistent, documented readiness signal for applications you have already received.',
    to: '/universities',
    cta: 'For universities',
  },
]

const STUDENT_STEPS = [
  'Answer a short questionnaire and upload your documents',
  'Your profile is checked against expert-designed scenarios',
  'An experienced consultant reviews it',
  'You get your outcome within 5 working days',
]

const UNIVERSITY_STEPS = [
  'Your team uploads applications you have already received',
  'You send each applicant a secure assessment link',
  'You review the readiness report and reasoning',
  'You decide, and inform the applicant',
]

const WE_ARE = [
  'Independent, with no commission from anyone',
  'An Irish company based in Cork',
  'Built on an expert-designed methodology and more than ten years of documented journeys',
  'Reviewed by an experienced consultant for every result',
]

const WE_ARE_NOT = [
  'We do not apply for you or send you to any institution',
  'We give no visa advice and make no visa decisions',
  'We cannot promise admission or any other outcome',
  'Our view sits alongside official guidance from universities and the immigration service',
]

/** Four questions for the front door, picked from the existing FAQ sets by wording. */
const pick = (list: Faq[], q: string) => list.find((f) => f.q === q)
const FAQS: Faq[] = [
  { q: 'What is BloomAbroad?', a: ANSWER_STUDENTS },
  pick(STUDENT_FAQS, 'Are you an agent? Will you apply for me?'),
  pick(STUDENT_FAQS, "Does a good outcome mean I'll get in?"),
  pick(PARENT_FAQS, 'How do I know BloomAbroad is genuine?'),
].filter((f): f is Faq => Boolean(f))

/** The front door: says what BloomAbroad is and sends each visitor to their page. */
export function LandingPage() {
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: '/' })
  useSchema('page', [webPageNode('/', TITLE, DESCRIPTION), faqNode('/', FAQS)])

  // Old deep links such as /?audience=students now live on their own pages.
  const [params] = useSearchParams()
  const legacy = params.get('audience')
  if (legacy === 'students') return <Navigate to="/students" replace />
  if (legacy === 'universities') return <Navigate to="/universities" replace />

  return (
    <PageShell>
      <Hero
        centered
        title={
          <>
            Know <span className="text-glimmer">where you stand</span> before you apply to
            study in Ireland
          </>
        }
        answer="BloomAbroad checks enrolment readiness for studying in Ireland. We look at your application readiness and your immigration readiness, and an experienced consultant reviews every result. Students know where they stand before they apply, and universities know which applications are ready to progress."
        actions={
          <>
            <ButtonLink to="/students" arrow>
              I'm a student or parent
            </ButtonLink>
            <ButtonLink to="/universities" variant="secondary" arrow>
              I represent a university
            </ButtonLink>
          </>
        }
      />

      <TrustStrip items={TRUST} />
      <Disclaimer variant="short" />

      <Section
        id="what-is-enrolment-readiness"
        eyebrow="The idea"
        title="What is enrolment readiness?"
        lead="Meeting entry requirements is only the start. Enrolment readiness is how prepared an applicant is to get an offer, meet immigration requirements and begin the course. We check the whole picture so gaps show up before they cost time and money."
      >
        <div className="grid gap-5 md:grid-cols-2">
          {[
            ['Application readiness', 'Are you positioned to get an offer?'],
            ['Immigration readiness', 'Are you positioned to meet immigration requirements?'],
          ].map(([title, body], i) => (
            <Reveal key={title} delay={i * 0.08} className="h-full">
              <div className="card-interactive h-full rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold text-heading">{title}</h3>
                <p className="mt-2 text-[15px] text-muted-foreground">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          <Link to="/enrolment-readiness" className="text-primary underline-offset-4 hover:underline">
            What enrolment readiness means →
          </Link>
          <Link to="/how-we-assess" className="text-primary underline-offset-4 hover:underline">
            How we assess it →
          </Link>
        </p>
      </Section>

      <Section
        tone="tint"
        eyebrow="Who it is for"
        title="Built for the people deciding to apply, and the people receiving applications"
      >
        <ul className="grid gap-5 md:grid-cols-3">
          {WHO.map((w, i) => (
            <li key={w.title}>
              <Reveal delay={i * 0.07} className="h-full">
                <Link
                  to={w.to}
                  className="card-interactive flex h-full flex-col rounded-2xl border border-border bg-card p-6"
                >
                  <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-signal">
                    <w.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="text-base font-bold text-heading">{w.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{w.body}</p>
                  <span className="mt-auto pt-4 text-sm font-semibold text-primary">{w.cta} →</span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section eyebrow="How it works" title="One method, two ways in">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { who: 'For students', steps: STUDENT_STEPS, to: '/students#how', future: false },
            { who: 'For universities', steps: UNIVERSITY_STEPS, to: '/universities#how', future: true },
          ].map((col, i) => (
            <Reveal key={col.who} delay={i * 0.07} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold text-heading">{col.who}</h3>
                {col.future && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    The institution workspace is being developed. This is how it will work.
                  </p>
                )}
                <ol className="mt-4 space-y-3 text-[15px] leading-relaxed text-foreground/85">
                  {col.steps.map((s, n) => (
                    <li key={s} className="flex gap-3">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-signal">
                        {n + 1}
                      </span>
                      {s}
                    </li>
                  ))}
                </ol>
                <p className="mt-5">
                  <Link to={col.to} className="text-sm font-semibold text-primary underline-offset-4 hover:underline">
                    See the full steps →
                  </Link>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        tone="tint"
        eyebrow="Where we stand"
        title="What BloomAbroad does, and where it stops"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <IconList title="We are" items={WE_ARE} tone="yes" />
          <IconList title="We are not" items={WE_ARE_NOT} tone="no" delay={0.07} />
        </div>
        <p className="mt-6 text-sm">
          <Link to="/how-we-assess" className="font-semibold text-primary underline-offset-4 hover:underline">
            Read how every assessment works →
          </Link>
        </p>
      </Section>

      <Section eyebrow="Meet the founder">
        <Reveal>
          <div className="flex max-w-3xl flex-col gap-5 sm:flex-row sm:items-center">
            <span
              aria-hidden
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-lg font-bold text-signal-foreground"
              style={{ background: 'var(--gradient-bloom)' }}
            >
              RK
            </span>
            <p className="text-lg leading-relaxed text-heading">
              {FOUNDER.name} has spent more than ten years supporting students applying to
              study in Ireland. She kept seeing capable students find out they weren't ready
              only after the fees were paid and the months had passed. BloomAbroad is her
              answer.{' '}
              {READY.about && (
                <Link
                  to="/about"
                  className="whitespace-nowrap text-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Read Remi's story →
                </Link>
              )}
            </p>
          </div>
        </Reveal>
      </Section>

      <Section id="faq" tone="tint" eyebrow="FAQs" title="Quick answers" width="narrow">
        <FaqAccordion items={FAQS} visible={4} />
        <p className="mt-6 text-sm">
          <Link to="/students#faq" className="font-semibold text-primary underline-offset-4 hover:underline">
            More questions for students and parents →
          </Link>
          {' · '}
          <Link to="/universities#faq" className="font-semibold text-primary underline-offset-4 hover:underline">
            More for universities →
          </Link>
        </p>
      </Section>

      <AudienceSplit />
    </PageShell>
  )
}
