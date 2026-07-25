import { motion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAudience, type Audience } from './audience'
import { Reveal } from './saasta/Reveal'
import { useParallax } from './saasta/useParallax'
import { ApplicantAssessment } from './saasta/ApplicantAssessment'
import { EligibilityCheck } from './saasta/EligibilityCheck'

type Content = {
  eyebrow: string
  headline: React.ReactNode
  subhead: string
  avatars: { label: string; muted?: boolean }[]
  trust: React.ReactNode
}

const CONTENT: Record<Audience, Content> = {
  universities: {
    eyebrow: 'For universities & HEIs',
    headline: (
      <>
        Know which applicants are{' '}
        <span className="text-glimmer">truly ready</span> to enrol — before you
        commit.
      </>
    ),
    subhead:
      'BloomAbroad screens your international applicants against expert-designed eligibility criteria — built from real student data accumulated over a decade. Stop guessing. Start deciding with confidence.',
    avatars: [{ label: 'UL' }, { label: 'DCU' }, { label: 'TUD' }, { label: '+5' }],
    trust: (
      <>
        <strong className="font-medium text-foreground">
          8 universities and colleges
        </strong>{' '}
        validated the need in our formal feasibility study.
      </>
    ),
  },
  students: {
    eyebrow: 'For international students',
    headline: (
      <>
        Know if you're <span className="text-glimmer">ready to apply</span> —
        before you spend time and money finding out the hard way.
      </>
    ),
    subhead:
      'BloomAbroad assesses your eligibility against real admissions criteria — so you can apply with confidence, not guesswork. Built from over a decade of real international student journeys.',
    avatars: [
      { label: 'IE' },
      { label: 'NG' },
      { label: 'IN' },
      { label: '+', muted: true },
    ],
    trust: (
      <>
        <strong className="font-medium text-foreground">
          Hundreds of student journeys
        </strong>{' '}
        inform our eligibility model — built by experts with 10+ years in
        international education.
      </>
    ),
  },
}

export function BranchHero({ audience }: { audience: Audience }) {
  const { audience: active, chosen, reset } = useAudience()
  const parallaxRef = useParallax<HTMLDivElement>(0.06)
  const isActive = chosen && active === audience
  const c = CONTENT[audience]

  return (
    <section
      hidden={!isActive}
      className="relative overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-14">
        {/* left */}
        <div>
          <Reveal>
            <button
              onClick={reset}
              className="mb-5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </Reveal>

          <Reveal delay={0.04}>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-eyebrow">
              {c.eyebrow}
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="mt-6 max-w-xl text-3xl font-extrabold leading-[1.1] tracking-tight sm:text-4xl lg:text-[2.75rem]">
              {c.headline}
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              {c.subhead}
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#waitlist"
                className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_var(--primary)]"
              >
                <span className="relative z-[2] inline-flex items-center gap-2">
                  Join the waitlist
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-base font-medium text-foreground transition-colors hover:border-primary/50"
              >
                How it works
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex">
                {c.avatars.map((a, i) => (
                  <span
                    key={i}
                    className={cn(
                      'flex h-7 w-7 items-center justify-center rounded-full border-2 border-background text-[9px] font-bold',
                      i > 0 && '-ml-2',
                      a.muted
                        ? 'bg-secondary text-muted-foreground'
                        : 'text-signal-foreground',
                    )}
                    style={a.muted ? undefined : { background: 'var(--gradient-bloom)' }}
                  >
                    {a.label}
                  </span>
                ))}
              </div>
              <p className="text-sm leading-snug text-muted-foreground">
                {c.trust}
              </p>
            </div>
          </Reveal>
        </div>

        {/* right interactive element — audience-specific, mounted when active */}
        {isActive && (
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <div ref={parallaxRef}>
              {audience === 'universities' ? (
                <ApplicantAssessment />
              ) : (
                <EligibilityCheck />
              )}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-8 -z-10 rounded-full opacity-30 blur-3xl"
              style={{ background: 'var(--gradient-hero)' }}
            />
          </motion.div>
        )}
      </div>
    </section>
  )
}
