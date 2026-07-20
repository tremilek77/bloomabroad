import { lazy, Suspense } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, GraduationCap, Building2, ShieldCheck, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAudience } from './audience'
import { Reveal } from './saasta/Reveal'
import { Counter } from './saasta/Counter'
import { useParallax } from './saasta/useParallax'

// Charts pull in recharts (~the biggest dependency). Load them in their own
// async chunk so they don't bloat the initial bundle; a card-shaped skeleton
// holds the layout until they arrive.
const ProjectAreaChart = lazy(() =>
  import('./saasta/ProjectAreaChart').then((m) => ({ default: m.ProjectAreaChart })),
)
const ReadinessGauge = lazy(() =>
  import('./saasta/ReadinessGauge').then((m) => ({ default: m.ReadinessGauge })),
)

function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl border border-border bg-card/60',
        className,
      )}
    />
  )
}

export function Hero() {
  const { audience, setAudience } = useAudience()
  const parallaxRef = useParallax<HTMLDivElement>(0.06)

  return (
    <section
      id="top"
      className="relative overflow-hidden"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-20">
        {/* left */}
        <div>
          <Reveal>
            <span className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-eyebrow transition-colors hover:border-primary/50">
              <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-primary" />
              <Sparkles className="h-3.5 w-3.5" />
              Enrolment readiness platform
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              <span className="block lg:whitespace-nowrap">
                Know before you <span className="text-glimmer">apply</span>.
              </span>
              <span className="block lg:whitespace-nowrap">
                Know before you <span className="text-glimmer">enrol</span>.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              BloomAbroad is the enrolment-readiness platform for universities
              and international students — giving both sides a clear,
              evidence-based answer before costly decisions are made.
            </p>
          </Reveal>

          {/* audience toggle */}
          <Reveal delay={0.18}>
            <div
              role="tablist"
              aria-label="Choose your audience"
              className="mt-8 inline-flex rounded-full border border-border bg-card/70 p-1"
            >
              <AudienceTab
                active={audience === 'universities'}
                onClick={() => setAudience('universities')}
                icon={<Building2 className="h-4 w-4" />}
              >
                For Universities
              </AudienceTab>
              <AudienceTab
                active={audience === 'students'}
                onClick={() => setAudience('students')}
                icon={<GraduationCap className="h-4 w-4" />}
              >
                For Students
              </AudienceTab>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-7 flex flex-col items-start gap-3">
              <a
                href="#waitlist"
                className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_var(--primary)]"
              >
                <span className="relative z-[2] inline-flex items-center gap-2">
                  {audience === 'universities'
                    ? 'Request early access'
                    : 'Join the waitlist'}
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </a>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-signal" />
                Built on 10+ years of real international-education data
              </span>
            </div>
          </Reveal>
        </div>

        {/* right dashboard cluster */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
        >
          <div ref={parallaxRef} className="grid gap-4">
            <Suspense fallback={<CardSkeleton className="h-[268px]" />}>
              <ProjectAreaChart />
            </Suspense>
            <div className="grid grid-cols-[1.4fr_1fr] gap-4">
              <div className="card-interactive glimmer group rounded-2xl border border-border bg-card/80 p-5 backdrop-blur">
                <p className="text-sm font-medium text-foreground">
                  Information architecture
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  <Counter value={10} suffix="× active cohorts this term" />
                </p>
                <div className="mt-4 flex -space-x-2">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={i}
                      className="h-8 w-8 rounded-full border-2 border-card transition-transform duration-300 group-hover:-translate-y-0.5"
                      style={{ background: 'var(--gradient-bloom)' }}
                    />
                  ))}
                </div>
              </div>
              <Suspense fallback={<CardSkeleton className="h-[210px]" />}>
                <ReadinessGauge />
              </Suspense>
            </div>
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 -z-10 rounded-full opacity-30 blur-3xl"
            style={{ background: 'var(--gradient-hero)' }}
          />
        </motion.div>
      </div>
    </section>
  )
}

function AudienceTab({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {children}
    </button>
  )
}
