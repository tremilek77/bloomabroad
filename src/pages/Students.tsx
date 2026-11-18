import { Link } from 'react-router-dom'
import {
  Compass,
  ListChecks,
  LockKeyhole,
  Search,
  ShieldCheck,
  UserCheck,
  Wallet,
} from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Hero } from '@/components/blocks/Hero'
import { Section } from '@/components/blocks/Section'
import { CardGrid } from '@/components/blocks/Cards'
import { Steps } from '@/components/blocks/Steps'
import { Disclaimer } from '@/components/blocks/Disclaimer'
import { FaqAccordion } from '@/components/blocks/FaqAccordion'
import { ButtonLink } from '@/components/blocks/ButtonLink'
import { SampleOutcomeCard } from '@/components/previews/SampleOutcomeCard'
import { WaitlistForm } from '@/components/WaitlistForm'
import { Reveal } from '@/components/saasta/Reveal'
import { usePageMeta } from '@/lib/seo'
import { faqNode, useSchema, webPageNode } from '@/lib/schema'
import { ANSWER_STUDENTS, PARENT_FAQS, STUDENT_FAQS } from '@/content/faqs'
import { FOUNDER, READY } from '@/content/site'

const PATH = '/students'
const TITLE = 'Check Your Readiness to Study in Ireland | BloomAbroad'
const DESCRIPTION =
  'Find out where you stand before you apply to study in Ireland. Application and immigration readiness, reviewed by an experienced consultant. Join the waitlist.'

const WHY = [
  { icon: Search, title: 'Spot gaps early', body: "See what's missing while there's still time to fix it." },
  {
    icon: Wallet,
    title: 'Spend with care',
    body: 'Application fees, test fees and months of waiting add up. Know your position first.',
  },
  {
    icon: Compass,
    title: 'Get next steps',
    body: 'Clear actions for your profile, not advice that worked for someone else.',
  },
]

const STEPS = [
  { title: 'Tell us about you', body: 'Answer a short questionnaire and upload your documents securely.' },
  { title: 'We assess readiness', body: 'Your profile is checked against expert-designed scenarios.' },
  { title: 'A consultant reviews it', body: 'An experienced consultant checks every result.' },
  {
    title: 'Get your outcome',
    body: 'Within 5 working days: where you stand, why, and what to do next.',
  },
]

const OUTCOMES = [
  {
    name: 'Ready to Apply',
    body: 'Your profile is in good shape.',
    cls: 'border-signal/30 bg-signal/10',
  },
  {
    name: 'Needs Support',
    body: "You're close. We show you what to strengthen first.",
    cls: 'border-amber-500/30 bg-amber-500/10',
  },
  {
    name: 'Not Yet in a Position to Apply',
    body: 'Not the right time. We explain why, so you can plan ahead.',
    cls: 'border-border bg-secondary/40',
  },
]

const PARENTS = [
  {
    icon: ShieldCheck,
    title: 'Independent',
    body: "We're not an agent, we take no commission, and we don't send students to any university.",
  },
  {
    icon: ListChecks,
    title: 'Clear reasons',
    body: "Every outcome shows what's strong, what's missing and what comes next.",
  },
  {
    icon: LockKeyhole,
    title: 'Safe payment',
    body: 'Only through our secure checkout. We never ask for money to "show funds".',
  },
  {
    icon: UserCheck,
    title: 'Under 18?',
    body: 'A parent or guardian confirms before we contact your child or start an assessment.',
  },
]

export function StudentsPage() {
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: PATH })
  useSchema('page', [
    webPageNode(PATH, TITLE, DESCRIPTION),
    faqNode(PATH, [...STUDENT_FAQS, ...PARENT_FAQS]),
  ])

  return (
    <PageShell>
      <Hero
        eyebrow="For students and families"
        title={
          <>
            Know <span className="text-glimmer">where you stand</span> before you apply
          </>
        }
        answer={ANSWER_STUDENTS}
        actions={
          <>
            <ButtonLink to="#waitlist" arrow>
              Join the waitlist
            </ButtonLink>
            {READY.checklist ? (
              <ButtonLink to="/checklist" variant="secondary" arrow>
                Get the free checklist
              </ButtonLink>
            ) : (
              <ButtonLink to="#how" variant="secondary">
                How it works
              </ButtonLink>
            )}
          </>
        }
        note={
          <>
            Undergraduate and postgraduate · Launching early 2027
            {READY.checklist && (
              <>
                <br />
                The checklist is free and general. The full assessment is paid.
              </>
            )}
          </>
        }
        aside={<SampleOutcomeCard />}
      />

      <Section tone="card" eyebrow="Why check first?" title="Know before you commit">
        <CardGrid items={WHY} />
      </Section>

      <Section id="how" eyebrow="How it works" title="Four steps to a clear answer">
        <Steps steps={STEPS} />
      </Section>

      <Section tone="tint" eyebrow="Your outcome, explained" title="Three possible outcomes">
        <ul className="grid gap-4 md:grid-cols-3">
          {OUTCOMES.map((o, i) => (
            <li key={o.name}>
              <Reveal delay={i * 0.07} className="h-full">
                <div className={`h-full rounded-2xl border p-5 ${o.cls}`}>
                  <h3 className="text-base font-bold text-heading">{o.name}</h3>
                  <p className="mt-1.5 text-[15px] text-muted-foreground">{o.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {READY.checklist && (
        <Section
          eyebrow="Not sure where to start?"
          title="Take the free 2-minute Ireland Readiness Checklist"
          lead="Get a personal list of what to prepare. It is a starting point, not an assessment."
        >
          <ButtonLink to="/checklist" arrow>
            Get my free checklist
          </ButtonLink>
        </Section>
      )}

      <Section id="parents" eyebrow="For parents and sponsors" title="You're investing in their future. See the full picture first.">
        <CardGrid items={PARENTS} cols={2} />
      </Section>

      <Section tone="tint" width="narrow">
        <Reveal>
          <p className="text-lg leading-relaxed text-heading">
            BloomAbroad was founded by {FOUNDER.name}, who has spent more than ten years
            supporting students applying to study in Ireland.{' '}
            {READY.about && (
              <Link
                to="/about"
                className="whitespace-nowrap text-sm font-semibold text-primary underline-offset-4 hover:underline"
              >
                Meet Remi →
              </Link>
            )}
          </p>
        </Reveal>
      </Section>

      <Disclaimer variant="short" />
      {READY.verify && (
        <p className="-mt-3 pb-6 text-center">
          <Link
            to="/verify"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            How to verify it's really us →
          </Link>
        </p>
      )}

      <Section id="faq" eyebrow="FAQs" title="Questions, answered" width="narrow">
        <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Students
        </p>
        <div className="mt-4">
          <FaqAccordion items={STUDENT_FAQS} visible={5} />
        </div>
        <p className="mt-14 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Parents and sponsors
        </p>
        <div className="mt-4">
          <FaqAccordion items={PARENT_FAQS} visible={3} />
        </div>
      </Section>

      <WaitlistForm defaultRole="Student" />
    </PageShell>
  )
}
