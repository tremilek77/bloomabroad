import { Link } from 'react-router-dom'
import { ArrowRight, GraduationCap, Landmark } from 'lucide-react'
import { Reveal } from '@/components/saasta/Reveal'

const CHOICES = [
  {
    to: '/students#waitlist',
    icon: GraduationCap,
    who: 'Students and families',
    body: 'Find out where you stand before you apply. Students, parents and sponsors.',
    cta: 'Join the student waitlist',
  },
  {
    to: '/universities#waitlist',
    icon: Landmark,
    who: 'Universities and colleges',
    body: 'Screen international applications consistently and early.',
    cta: 'Request early access',
  },
]

/**
 * Homepage "join" section. The homepage has no form: each visitor picks their
 * side and lands on a page (and a form) built only for them.
 */
export function AudienceSplit() {
  return (
    <section id="waitlist" className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-eyebrow">
            Join the waitlist
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-heading md:text-5xl">
            <span className="text-glimmer">Who's joining?</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            BloomAbroad launches in early 2027, starting with Ireland. Choose your side and we'll
            take you to the right place.
          </p>
        </Reveal>

        <ul className="mt-10 grid gap-5 text-left md:grid-cols-2">
          {CHOICES.map((c, i) => (
            <li key={c.to}>
              <Reveal delay={i * 0.08} className="h-full">
                <Link
                  to={c.to}
                  className="card-interactive flex h-full flex-col rounded-2xl border border-border bg-card p-6"
                >
                  <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-signal">
                    <c.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="text-lg font-bold text-heading">{c.who}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{c.body}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">
                    {c.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
