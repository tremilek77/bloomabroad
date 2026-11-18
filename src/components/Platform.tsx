import { Check } from 'lucide-react'
import { Reveal } from './saasta/Reveal'

const BULLETS = [
  'Expert-designed readiness scenarios are applied from day one.',
  'Both universities and students get a clear, consistent readiness signal.',
]

/**
 * Where "Read Remi's story →" points. The founder section / About page is a
 * P1 deliverable; until it exists this stays null and the line shows as plain
 * text rather than a link to nowhere. Set it to '/about' when that ships.
 */
const FOUNDER_HREF: string | null = null

export function Platform() {
  return (
    <section id="platform" className="mx-auto max-w-3xl px-6 py-20 md:py-28">
      <Reveal>
        <div>
          {/* Eyebrow renamed from the live site's duplicate "HOW IT WORKS"
              to match the #platform anchor (see content-inventory UX note). */}
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-eyebrow">
            The platform
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-heading md:text-5xl">
            Built on a decade of real data — and{' '}
            <span className="text-glimmer">real expertise.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
            BloomAbroad isn't built on assumptions. It's built on 10+ years of
            accumulated data — student profiles, application outcomes, and
            real student success stories — from across the international
            education ecosystem.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Designed by an expert with a doctoral background in migration and
            years of experience as an educator, BloomAbroad combines
            professional expertise with real operational insight — a rare
            pairing in international education.
          </p>

          <ul className="mt-8 space-y-4">
            {BULLETS.map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-signal text-signal-foreground">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                <span className="text-[15px] leading-relaxed text-foreground/90">
                  {b}
                </span>
              </li>
            ))}
          </ul>

          {/* Replaces the duplicate lower stats block (the numbers live in
              the one stats strip near the top of the page). */}
          <p className="mt-8 border-t border-border pt-6 text-[15px] leading-relaxed text-muted-foreground">
            BloomAbroad was founded by Remi Kolawole, who has spent more than
            ten years supporting students applying to study in Ireland.
            {FOUNDER_HREF && (
              <>
                {' '}
                <a
                  href={FOUNDER_HREF}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Read Remi's story →
                </a>
              </>
            )}
          </p>
        </div>
      </Reveal>
    </section>
  )
}
