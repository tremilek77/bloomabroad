import { Navigate, useSearchParams } from 'react-router-dom'
import { PageShell } from '@/components/PageShell'
import { Hero } from '@/components/blocks/Hero'
import { ButtonLink } from '@/components/blocks/ButtonLink'
import { TrustStrip } from '@/components/blocks/TrustStrip'
import { Disclaimer } from '@/components/blocks/Disclaimer'
import { Section } from '@/components/blocks/Section'
import { AudienceSplit } from '@/components/AudienceSplit'
import { Reveal } from '@/components/saasta/Reveal'
import { usePageMeta } from '@/lib/seo'
import { useSchema, webPageNode } from '@/lib/schema'
import { FOUNDER, READY } from '@/content/site'
import { Link } from 'react-router-dom'

const TITLE = 'Enrolment Readiness for Studying in Ireland | BloomAbroad'
const DESCRIPTION =
  'BloomAbroad checks application and immigration readiness for studying in Ireland, so students know where they stand before they apply. An Irish company in Cork.'

const TRUST = [
  { value: '10+ years of application and outcome data' },
  { value: 'Expert-reviewed results' },
  { value: 'Independent: not an agent, no commission' },
  { value: 'An Irish company in Cork' },
]

/** The front door: says what BloomAbroad is and sends each visitor to their page. */
export function LandingPage() {
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: '/' })
  useSchema('page', [webPageNode('/', TITLE, DESCRIPTION)])

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
          <Link to="/students#how" className="text-primary underline-offset-4 hover:underline">
            How it works for students →
          </Link>
          <Link to="/universities#how" className="text-primary underline-offset-4 hover:underline">
            How it works for universities →
          </Link>
        </p>
      </Section>

      <Section tone="tint" eyebrow="Meet the founder">
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
              study in Ireland.{' '}
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

      <AudienceSplit />
    </PageShell>
  )
}
