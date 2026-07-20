import {
  Gauge,
  Flag,
  ClipboardCheck,
  TrendingUp,
  SearchCheck,
  Target,
  Lightbulb,
  BadgeCheck,
  type LucideIcon,
} from 'lucide-react'
import { useAudience } from './audience'
import { Reveal } from './saasta/Reveal'
import { Highlight } from './saasta/Highlight'

type Card = { icon: LucideIcon; title: string; body: string }

const CONTENT: Record<
  'universities' | 'students',
  {
    eyebrow: string
    heading: string
    emphasis: string
    intro: string
    cards: Card[]
  }
> = {
  universities: {
    eyebrow: 'For Universities',
    heading: 'A smarter way to assess international applicants.',
    emphasis: 'smarter',
    intro:
      'Stop relying on incomplete applications and inconsistent criteria. BloomAbroad gives your admissions team a structured, evidence-based readiness score for every international applicant — so you enrol students who are genuinely ready.',
    cards: [
      {
        icon: Gauge,
        title: 'Standardised readiness scoring',
        body: 'Every applicant is assessed against expert-designed eligibility scenarios built on 10+ years of real application and in-study outcome data. No more gut feel. No more inconsistency.',
      },
      {
        icon: Flag,
        title: 'Early risk flagging',
        body: 'Identify at-risk profiles before they become at-risk students. BloomAbroad surfaces the signals that predict in-study difficulty — giving your team time to intervene or reconsider.',
      },
      {
        icon: ClipboardCheck,
        title: 'Reduced admissions burden',
        body: 'Replace manual, time-intensive screening with a consistent, auditable process. Your team focuses on decisions — not data gathering.',
      },
      {
        icon: TrendingUp,
        title: 'Better enrolment outcomes',
        body: 'Students who pass the BloomAbroad readiness threshold are better matched to your institution — improving retention, progression, and satisfaction on both sides.',
      },
    ],
  },
  students: {
    eyebrow: 'For Students',
    heading: 'Know exactly where you stand — before you spend a cent.',
    emphasis: 'exactly where you stand',
    intro:
      "Applying to study abroad is one of the biggest decisions you'll make. BloomAbroad gives you an honest, evidence-based picture of your eligibility — so you apply to the right places, with real confidence.",
    cards: [
      {
        icon: SearchCheck,
        title: 'Self-assessment before you apply',
        body: 'Check your academic, financial, and language readiness against real university benchmarks — before you pay application fees, gather documents, or wait months for an answer.',
      },
      {
        icon: Target,
        title: 'Apply to the right universities',
        body: 'Stop casting a wide net and hoping. BloomAbroad helps you identify which institutions are a genuine fit for your profile — so your time and money go where they have the best chance.',
      },
      {
        icon: Lightbulb,
        title: 'Understand the gaps',
        body: "If you're not ready yet, BloomAbroad tells you why — and what to work on. So your next application is stronger, not just another attempt.",
      },
      {
        icon: BadgeCheck,
        title: 'Apply with evidence, not hope',
        body: 'Arrive at your application with a clear picture of your readiness — and the confidence that you belong there.',
      },
    ],
  },
}

export function ValueProps() {
  const { audience } = useAudience()
  const { eyebrow, heading, emphasis, intro, cards } = CONTENT[audience]

  return (
    <section className="mx-auto max-w-6xl px-6 py-20 md:py-28">
      <Reveal>
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-eyebrow">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-heading md:text-5xl">
            <Highlight text={heading} phrase={emphasis} />
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            {intro}
          </p>
        </div>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2">
        {cards.map((card, i) => (
          <Reveal
            key={card.title}
            delay={i * 0.08}
            from={i % 2 === 0 ? 'left' : 'right'}
            className="h-full"
          >
            <article className="group card-interactive glimmer h-full rounded-2xl border border-border bg-card p-7">
              <div className="icon-zoom flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-signal ring-1 ring-primary/20 group-hover:ring-primary/60">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-heading">
                {card.title}
              </h3>
              <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">
                {card.body}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
