import { ArrowRight } from 'lucide-react'
import { Reveal } from './saasta/Reveal'

/**
 * ARCHIVED COPY — this is the "Be first. Shape the platform." section as it
 * stood before the P0 compliance work, with ONE deliberate change: the
 * sign-up form is gone.
 *
 * The old form collected personal data without a consent checkbox, which the
 * new Privacy Notice doesn't allow, so /old must not collect sign-ups. The
 * section keeps its id ("waitlist") so the page's "Join the waitlist" buttons
 * still scroll somewhere sensible, and points visitors to the live form.
 */
export function WaitlistForm() {
  return (
    <section id="waitlist" className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center md:py-28">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-eyebrow">
            Early access
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-heading md:text-5xl">
            <span className="text-glimmer">Be first.</span> Shape the platform.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            BloomAbroad is in pre-launch. We're opening early access to a select
            group of universities and students who want to help build something
            better for international education.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-border bg-card p-8">
          <p className="text-sm text-muted-foreground">
            This is an archived copy of our previous site, so it no longer takes
            sign-ups. Please join the waitlist on the current site.
          </p>
          <a
            href="/#waitlist"
            className="btn-sheen mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition-transform duration-200 hover:-translate-y-0.5"
          >
            <span className="relative z-[2] inline-flex items-center gap-2">
              Go to the current waitlist
              <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
