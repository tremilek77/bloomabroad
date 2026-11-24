import { Link } from 'react-router-dom'
import {
  Compass,
  FileText,
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
import { ReportCoversCard } from '@/components/previews/ReportCoversCard'
import { IconList } from '@/components/blocks/IconList'
import { StudentWaitlistForm } from '@/components/StudentWaitlistForm'
import { Reveal } from '@/components/saasta/Reveal'
import { usePageMeta } from '@/lib/seo'
import { faqNode, useSchema, webPageNode } from '@/lib/schema'
import { ANSWER_STUDENTS, PARENT_FAQS, STUDENT_FAQS } from '@/content/faqs'
import { FOUNDER, READY } from '@/content/site'
import { OUTCOMES } from '@/content/outcomes'

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

const REPORT = [
  {
    icon: Compass,
    title: 'Where you stand',
    body: 'One of three clear outcomes, so you know whether to apply now, strengthen first, or plan ahead.',
  },
  {
    icon: Search,
    title: "What's strong, and what's missing",
    body: 'Your application readiness and immigration readiness, with the reasons behind each finding.',
  },
  {
    icon: ListChecks,
    title: 'What to do next',
    body: 'Next steps for your situation, in order, so you know what to tackle first.',
  },
  {
    icon: UserCheck,
    title: 'A summary for parents and sponsors',
    body: 'Written so the people supporting you can follow the outcome and the plan.',
  },
]

const LOOKS_AT = ['your qualifications', 'your course choice', 'your English', 'your documents', 'how it all fits together']

const GOOD_FIT = [
  'You plan to study in Ireland at undergraduate or postgraduate level',
  'You want to know where you stand before you pay for applications and tests',
  'You are a parent or sponsor who wants a clear view before committing',
]

const NOT_WHAT_WE_DO = [
  'Apply to universities for you, or send you to any institution',
  'Prepare, source or advise on financial documents',
  'Give visa advice or make visa decisions. Always check the official guidance',
  'Promise admission or any other outcome',
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
        aside={<ReportCoversCard />}
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

      <Section
        id="report"
        eyebrow="Your report"
        title="What does your readiness report cover?"
        lead="A written account of where you stand and what to do about it, with the reasons shown."
      >
        <CardGrid items={REPORT} cols={2} />
        <Reveal>
          <div className="mt-6 flex gap-4 rounded-2xl border border-border bg-card p-6">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-signal">
              <FileText className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h3 className="text-base font-bold text-heading">What the assessment looks at</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                It looks at {LOOKS_AT.join(', ')}. Not just your grades. An experienced consultant
                reviews every result, and the reasoning is recorded.
              </p>
              <p className="mt-3 text-sm">
                <Link to="/how-we-assess" className="font-semibold text-primary underline-offset-4 hover:underline">
                  See how we assess →
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section id="fit" tone="tint" eyebrow="Is this for you?" title="Who it helps, and what it does not do">
        <div className="grid gap-5 md:grid-cols-2">
          <IconList title="A good fit if" items={GOOD_FIT} tone="yes" />
          <IconList title="What we do not do" items={NOT_WHAT_WE_DO} tone="no" delay={0.07} />
        </div>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          To start you will usually need your passport and your academic certificates and
          transcripts. English test results help if you have them. We tell you exactly what's
          needed when you begin.
        </p>
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
      <p className="pb-2 text-center">
        <Link
          to="/nigeria"
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          Applying from Nigeria? See our Nigeria page →
        </Link>
      </p>
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

      <StudentWaitlistForm />
    </PageShell>
  )
}
