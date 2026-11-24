import type { LucideIcon } from 'lucide-react'
import { Ban, Globe, Lock, Mail, MessageCircle, UserCheck } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Hero } from '@/components/blocks/Hero'
import { Section } from '@/components/blocks/Section'
import { ButtonLink } from '@/components/blocks/ButtonLink'
import { Reveal } from '@/components/saasta/Reveal'
import { Fill, linkCls } from '@/components/legal/Prose'
import { usePageMeta } from '@/lib/seo'
import { useSchema, webPageNode } from '@/lib/schema'
import { COMPANY, SOCIALS } from '@/lib/company'
import { OFFICIAL_IMMIGRATION_URL } from '@/content/disclaimers'
import { FOUNDER, METHODOLOGY_ADVISER, READY } from '@/content/site'

const PATH = '/verify'
const TITLE = 'Is It Really BloomAbroad? How to Verify Our Sites and Emails'
const DESCRIPTION =
  "Check you're dealing with the real BloomAbroad: our only websites and email addresses, how we take payment, and what we never ask. Report a scam to us."
const ANSWER =
  "BloomAbroad's only websites are bloomabroad.ie and bloomabroad.ai, and we only email from addresses ending in @bloomabroad.ie. We take payment only through our secure checkout on bloomabroad.ie. If a message, website or person claims to be us and something feels wrong, email hello@bloomabroad.ie before you reply or pay."

const NEVER = [
  'Ask you for money to "show funds"',
  'Ask you to pay visa fees through us, or handle them for you',
  'Promise or guarantee admission, a visa, or any outcome',
  'Offer to "speed up" a decision for an extra fee',
  'Ask for your passwords or one-time codes',
]

function Card({
  icon: Icon,
  title,
  children,
  delay = 0,
}: {
  icon: LucideIcon
  title: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <Reveal delay={delay} className="h-full">
      <div className="card-interactive h-full rounded-2xl border border-border bg-card p-6">
        <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-signal">
          <Icon className="h-5 w-5" aria-hidden />
        </span>
        <h3 className="text-base font-bold text-heading">{title}</h3>
        <div className="mt-2 space-y-2 text-[15px] leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </Reveal>
  )
}

export function VerifyPage() {
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: PATH })
  useSchema('page', [webPageNode(PATH, TITLE, DESCRIPTION)])

  return (
    <PageShell>
      <Hero
        eyebrow="Your safety matters to us"
        title={
          <>
            Check it's really <span className="text-glimmer">BloomAbroad</span>
          </>
        }
        answer={ANSWER}
        actions={
          <ButtonLink to={`mailto:${COMPANY.helloEmail}?subject=${encodeURIComponent('Is this really BloomAbroad?')}`} arrow>
            Email us to check
          </ButtonLink>
        }
      />

      <Section tone="card" eyebrow="The real BloomAbroad" title="Where to find us">
        <div className="grid gap-5 md:grid-cols-2">
          <Card icon={Globe} title="Our only websites">
            <p>
              <strong className="text-foreground">bloomabroad.ie</strong>: our company
              website, where you pay securely.
            </p>
            <p>
              <strong className="text-foreground">bloomabroad.ai</strong>: where you take
              your assessment.
            </p>
          </Card>
          <Card icon={Mail} title="Our only email addresses" delay={0.06}>
            <p>
              We only ever email you from addresses ending in{' '}
              <strong className="text-foreground">@bloomabroad.ie</strong>, such as{' '}
              <a href={`mailto:${COMPANY.helloEmail}`} className={linkCls}>
                {COMPANY.helloEmail}
              </a>{' '}
              and{' '}
              <a href={`mailto:${COMPANY.privacyEmail}`} className={linkCls}>
                {COMPANY.privacyEmail}
              </a>
              .
            </p>
          </Card>
          <Card icon={MessageCircle} title="Our official accounts" delay={0.12}>
            <p>
              WhatsApp: <Fill value={COMPANY.whatsappNumber} />
            </p>
            <p>
              WhatsApp Channel: <Fill value={COMPANY.whatsappChannel} />
            </p>
            {SOCIALS.length > 0 && (
              <p>
                {SOCIALS.map((s, i) => (
                  <span key={s.label}>
                    {i > 0 && ' · '}
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                      {s.label}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </Card>
          <Card icon={Lock} title="How we take payment" delay={0.18}>
            <p>
              Only through the secure checkout on bloomabroad.ie. We will never ask you to
              pay by bank transfer, by mobile money to a personal number, or through WhatsApp.
            </p>
          </Card>
        </div>
      </Section>

      <Section eyebrow="What we will never do" title="If anyone asks you for these, it isn't us">
        <Reveal>
          <ul className="max-w-2xl space-y-3">
            {NEVER.map((n) => (
              <li
                key={n}
                className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-3.5 text-[15px] text-foreground"
              >
                <Ban className="mt-0.5 h-5 w-5 shrink-0 text-destructive" aria-hidden />
                {n}
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section tone="tint" eyebrow="Who represents us" title="The people behind BloomAbroad">
        <div className="grid gap-5 md:grid-cols-2">
          <Card icon={UserCheck} title={`${FOUNDER.name}, ${FOUNDER.title}`}>
            <p>
              {READY.about
                ? `Leads BloomAbroad, with ${METHODOLOGY_ADVISER.name}, ${METHODOLOGY_ADVISER.title}.`
                : 'Leads BloomAbroad.'}
            </p>
          </Card>
          <Card icon={Mail} title="Anyone else" delay={0.06}>
            <p>
              Anyone else contacting you on our behalf will use an @bloomabroad.ie email
              address. If you're unsure, check with us first.
            </p>
          </Card>
        </div>
      </Section>

      <Section
        eyebrow="Not sure? Ask us first"
        title="Email us before you reply or pay"
        lead="If a message, website or person claims to be BloomAbroad and something feels wrong, we'll tell you whether it's really us."
      >
        <Reveal>
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink to={`mailto:${COMPANY.helloEmail}`}>Email {COMPANY.helloEmail}</ButtonLink>
          </div>
          <div className="mt-10 max-w-2xl rounded-2xl border border-border bg-card/60 p-6">
            <h3 className="text-base font-bold text-heading">Report a scam</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
              If you think you've been targeted, please tell us at{' '}
              <a href={`mailto:${COMPANY.helloEmail}`} className={linkCls}>
                {COMPANY.helloEmail}
              </a>{' '}
              and report it to your local police. For Irish immigration matters, see the
              official security notice from Ireland's immigration service on{' '}
              {/* [NEED: the exact URL of the official security notice]. Until then this
                  links to the immigration service's site. */}
              <a href={OFFICIAL_IMMIGRATION_URL} target="_blank" rel="noopener noreferrer" className={linkCls}>
                irishimmigration.ie
              </a>
              .
            </p>
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            BloomAbroad is a trading name of {COMPANY.legalName}, registered in Ireland. Company
            no. <Fill value={COMPANY.croNumber} />
          </p>
        </Reveal>
      </Section>
    </PageShell>
  )
}
