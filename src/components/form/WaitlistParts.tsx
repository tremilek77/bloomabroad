import { Check, Loader2 } from 'lucide-react'
import { Reveal } from '@/components/saasta/Reveal'
import { CONSENT_TEXT } from '@/content/formOptions'

/** The section frame shared by the student and university waitlist forms. */
export function WaitlistFrame({
  eyebrow,
  heading,
  lead,
  children,
}: {
  eyebrow: string
  heading: React.ReactNode
  lead: string
  children: React.ReactNode
}) {
  return (
    <section id="waitlist" className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center md:py-28">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-eyebrow">
            {eyebrow}
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-heading md:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {lead}
          </p>
        </Reveal>
        {children}
      </div>
    </section>
  )
}

/**
 * Consent: required and never pre-ticked. The label is rendered from
 * CONSENT_TEXT, the same string that is saved as the record of what the person
 * agreed to, so the two can't drift apart.
 */
export function ConsentBox({
  error,
  inputProps,
}: {
  error?: string
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
}) {
  const [before, after = ''] = CONSENT_TEXT.split('Privacy Notice')
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
        <input
          type="checkbox"
          aria-invalid={!!error}
          className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
          {...inputProps}
        />
        <span>
          {before}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline underline-offset-4"
          >
            Privacy Notice
          </a>
          {after}
        </span>
      </label>
      {error && (
        <p className="mt-1.5 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function SubmitButton({ busy, children }: { busy: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_var(--primary)] disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span className="relative z-[2] inline-flex items-center gap-2">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </span>
    </button>
  )
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p className="text-center text-sm text-destructive" role="alert">
      {message}
    </p>
  )
}

export function Success({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      role="status"
      className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-signal-foreground">
        <Check className="h-6 w-6" strokeWidth={3} />
      </span>
      <h3 className="text-2xl font-bold text-heading">{title}</h3>
      {children}
    </div>
  )
}

export const FORM_CLS = 'mx-auto mt-10 max-w-md space-y-5 text-left'
