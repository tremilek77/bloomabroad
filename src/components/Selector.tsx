import { ArrowRight, Building2, GraduationCap, Sparkles } from 'lucide-react'
import { useAudience } from './audience'
import { Reveal } from './saasta/Reveal'

/**
 * Centralized selector hero — the first thing a visitor sees. Picking a
 * branch sets the site audience and reveals that branch's hero (see
 * BranchHero). Kept in the DOM (hidden via `hidden` when a branch is
 * chosen) so crawlers still read its copy.
 */
export function Selector() {
  const { chosen, choose } = useAudience()

  return (
    <section
      hidden={chosen}
      className="relative overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div className="mx-auto max-w-4xl px-6 pb-20 pt-16 text-center lg:pt-24">
        <Reveal>
          <span className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-eyebrow">
            <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-primary" />
            <Sparkles className="h-3.5 w-3.5" />
            Welcome to BloomAbroad
          </span>
        </Reveal>

        <Reveal delay={0.06}>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">
            The right student, in the{' '}
            <span className="text-glimmer">right place</span> — before it's too
            late.
          </h1>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            BloomAbroad helps universities assess international applicants, and
            helps students assess their own eligibility — each independently, on
            one platform. Who are you?
          </p>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          <Reveal delay={0.18} from="left">
            <BranchCard
              icon={<Building2 className="h-5 w-5" />}
              title="I represent a university or college"
              desc="Screen and assess international applicants before costly admissions decisions are made."
              onClick={() => choose('universities')}
            />
          </Reveal>
          <Reveal delay={0.24} from="right">
            <BranchCard
              icon={<GraduationCap className="h-5 w-5" />}
              title="I am an international student"
              desc="Check your own eligibility before applying anywhere — and know where you truly belong."
              onClick={() => choose('students')}
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function BranchCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="card-interactive glimmer group flex h-full flex-col rounded-2xl border border-border bg-card p-7 text-left"
    >
      <div className="icon-zoom flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-signal ring-1 ring-primary/20 group-hover:ring-primary/60">
        {icon}
      </div>
      <h2 className="mt-5 text-lg font-semibold text-heading">{title}</h2>
      <p className="mt-2.5 flex-1 text-[15px] leading-relaxed text-muted-foreground">
        {desc}
      </p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Show me how
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}
