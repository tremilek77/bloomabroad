import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Check, Loader2, TriangleAlert } from 'lucide-react'
import { usePageMeta } from '@/lib/seo'
import { COMPANY } from '@/lib/company'
import { confirmParent, type ParentConfirmation } from '@/lib/waitlist'
import { PageShell, linkCls } from '@/components/legal/Prose'

/**
 * Where a parent or guardian lands from the link in their confirmation email
 * (an under-18 student's sign-up waits for this before we contact the student).
 *
 * The page shows a button instead of confirming the moment it loads: some
 * email security tools open every link in a message, and that must not count
 * as a parent's consent.
 */
export function ConfirmParentPage() {
  usePageMeta({
    title: 'Confirm | BloomAbroad',
    description: 'Parent or guardian confirmation for the BloomAbroad waitlist.',
    path: '/confirm',
    noindex: true,
  })

  const [params] = useSearchParams()
  const token = params.get('token') ?? ''
  const [state, setState] = useState<'ready' | 'working' | ParentConfirmation>(
    token ? 'ready' : 'invalid',
  )

  async function confirm() {
    setState('working')
    setState(await confirmParent(token))
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-xl px-6 py-20 text-center md:py-28">
        {state === 'ready' || state === 'working' ? (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight text-heading md:text-4xl">
              Please confirm
            </h1>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              A young person has joined the BloomAbroad waitlist and given us
              your email address as their parent or guardian. Because they're
              under 18, we need your OK before we send them anything.
            </p>
            <button
              type="button"
              onClick={confirm}
              disabled={state === 'working'}
              className="btn-sheen mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-sm disabled:opacity-70"
            >
              <span className="relative z-[2] inline-flex items-center gap-2">
                {state === 'working' && <Loader2 className="h-4 w-4 animate-spin" />}
                Yes, that's fine — confirm
              </span>
            </button>
            <p className="mt-5 text-sm text-muted-foreground">
              If you don't recognise this, you can close this page and we won't
              contact them.
            </p>
          </>
        ) : state === 'confirmed' || state === 'already' ? (
          <Result
            ok
            title={state === 'confirmed' ? "Thanks, you're confirmed" : 'Already confirmed'}
          >
            {state === 'confirmed'
              ? "We'll be in touch with them before launch in early 2027."
              : "This link has already been used, so there's nothing more to do."}{' '}
            You can ask us to remove their details at any time by emailing{' '}
            <a href={`mailto:${COMPANY.privacyEmail}`} className={linkCls}>
              {COMPANY.privacyEmail}
            </a>
            .
          </Result>
        ) : state === 'invalid' ? (
          <Result title="This link isn't valid">
            It may be incomplete or out of date. Please email{' '}
            <a href={`mailto:${COMPANY.helloEmail}`} className={linkCls}>
              {COMPANY.helloEmail}
            </a>{' '}
            and we'll help.
          </Result>
        ) : (
          <Result title="Something went wrong">
            We couldn't record your confirmation. Please try the link again in a
            moment, or email{' '}
            <a href={`mailto:${COMPANY.helloEmail}`} className={linkCls}>
              {COMPANY.helloEmail}
            </a>
            .
          </Result>
        )}

        <p className="mt-10 text-sm">
          <Link to="/" className={linkCls}>
            Back to BloomAbroad
          </Link>
        </p>
      </div>
    </PageShell>
  )
}

function Result({
  ok,
  title,
  children,
}: {
  ok?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <div role="status" className="flex flex-col items-center gap-4">
      <span
        className={
          ok
            ? 'flex h-12 w-12 items-center justify-center rounded-full bg-signal text-signal-foreground'
            : 'flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-muted-foreground'
        }
      >
        {ok ? (
          <Check className="h-6 w-6" strokeWidth={3} />
        ) : (
          <TriangleAlert className="h-6 w-6" />
        )}
      </span>
      <h1 className="text-3xl font-extrabold tracking-tight text-heading md:text-4xl">
        {title}
      </h1>
      <p className="text-[15px] leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}
