import { ArrowRight } from 'lucide-react'
import { useAudience } from './audience'
import { Reveal } from './saasta/Reveal'

const CONTENT: Record<
  'universities' | 'students',
  { steps: string[]; ctaLine: string; ctaLabel: string }
> = {
  universities: {
    steps: [
      'Submit applicant profiles to BloomAbroad via your admissions workflow.',
      'BloomAbroad scores each applicant against expert-designed eligibility scenarios.',
      'Your team receives a readiness report — structured, auditable, and consistent.',
      'Enrol with confidence. Flag risks early. Improve outcomes over time.',
    ],
    ctaLine:
      'Join a small cohort of partner universities shaping the platform from the ground up.',
    ctaLabel: 'Request early access for your institution',
  },
  students: {
    steps: [
      'Create your profile — academic background, language scores, finances, and goals.',
      'BloomAbroad assesses your readiness against real benchmarks from universities worldwide.',
      "You receive a clear eligibility picture — what's strong, what's a risk, and where you stand.",
      'Apply with confidence to the universities that are genuinely right for you.',
    ],
    ctaLine: 'No application needed. Find out where you stand in minutes.',
    ctaLabel: 'Join the waitlist',
  },
}

export function HowItWorks() {
  const { audience } = useAudience()
  const { steps, ctaLine, ctaLabel } = CONTENT[audience]

  return (
    <section id="how" className="border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-eyebrow">
            How it works
          </p>
          <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight text-heading md:text-5xl">
            <span className="block">Four steps.</span>
            <span className="block text-glimmer">One clear answer.</span>
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={i} delay={i * 0.1} from="up">
              <li className="group relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_22px_-2px_var(--primary)]">
                  {i + 1}
                </div>
                <p className="mt-4 text-[15px] leading-relaxed text-foreground/90">
                  {step}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.1} from="scale">
          <div className="card-interactive glimmer mt-16 flex flex-col items-start gap-5 rounded-2xl border border-border bg-card p-8 md:flex-row md:items-center md:justify-between">
            <p className="max-w-lg text-lg text-heading">{ctaLine}</p>
            <a
              href="#waitlist"
              className="btn-sheen group relative z-[2] inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
