import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Hero } from '@/components/blocks/Hero'
import { Disclaimer } from '@/components/blocks/Disclaimer'
import { CountryOptions, Field, Select, inputCls } from '@/components/form/fields'
import { usePageMeta } from '@/lib/seo'
import { useSchema, webPageNode } from '@/lib/schema'
import { addEntry } from '@/lib/waitlist'
import { COUNTRY_GROUPS, OTHER_COUNTRY } from '@/lib/countries'
import { AGE_BANDS, CONSENT_TEXT } from '@/content/formOptions'
import { QUESTIONS, buildChecklist, type Answers } from '@/content/checklist'
import { cn } from '@/lib/utils'

const PATH = '/checklist'
const TITLE = 'Free Ireland Readiness Checklist for Students | BloomAbroad'
const DESCRIPTION =
  'Answer eight quick questions and get a personal list of what to prepare before you apply to study in Ireland, from English tests to documents. Free, 2 minutes.'
const ANSWER =
  'The Ireland Readiness Checklist is a free 2-minute quiz for students planning to study in Ireland. Answer eight questions and get a personal list of what to prepare, from English tests to documents. It is a starting point, not an assessment, and it gives no score or outcome.'

const DETAILS_STEP = QUESTIONS.length
const emailOk = (v: string) => z.email().safeParse(v).success

type Contact = {
  name: string
  email: string
  whatsapp: string
  ageBand: string
  parentEmail: string
  consent: boolean
}

type Result = { first: string; items: string[]; under18: boolean }

export function ChecklistPage() {
  usePageMeta({ title: TITLE, description: DESCRIPTION, path: PATH })
  useSchema('page', [webPageNode(PATH, TITLE, DESCRIPTION)])

  const [step, setStep] = useState(0)
  // A country page can send people here with the country already chosen (?country=Nigeria).
  const [answers, setAnswers] = useState<Answers>((): Answers => {
    const c = new URLSearchParams(window.location.search).get('country')
    const known = COUNTRY_GROUPS.some((g) => g.countries.includes(c ?? ''))
    const start: Answers = {}
    if (known && c) start.q2 = c
    return start
  })
  const [countryOther, setCountryOther] = useState('')
  const [contact, setContact] = useState<Contact>({
    name: '',
    email: '',
    whatsapp: '',
    ageBand: '',
    parentEmail: '',
    consent: false, // never pre-ticked
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)

  // Move keyboard focus to the new step so screen-reader users hear it.
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
  }, [step, result])

  const q = QUESTIONS[step]
  const isCountryQ = q?.type === 'country'
  const answered =
    !q ||
    (isCountryQ
      ? Boolean(answers[q.id]) && (answers[q.id] !== OTHER_COUNTRY || countryOther.trim() !== '')
      : Boolean(answers[q.id]))

  const setContactField = <K extends keyof Contact>(k: K, v: Contact[K]) =>
    setContact((c) => ({ ...c, [k]: v }))

  function next() {
    if (answered) setStep((s) => s + 1)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!contact.name.trim()) errs.name = 'Please enter your first name'
    if (!emailOk(contact.email)) errs.email = 'Enter a valid email address'
    if (contact.whatsapp.trim() && !/^[+()\d\s-]{6,20}$/.test(contact.whatsapp))
      errs.whatsapp = 'Enter a valid phone number, or leave this blank'
    if (!contact.ageBand) errs.ageBand = 'Please choose your age'
    const under18 = contact.ageBand === 'Under 18'
    if (under18 && !emailOk(contact.parentEmail))
      errs.parentEmail = "Please enter a parent or guardian's email"
    if (!contact.consent) errs.consent = 'Please tick the box to get your checklist'
    setErrors(errs)
    if (Object.keys(errs).length) return

    setSubmitting(true)
    setSubmitError(null)
    const country = answers.q2 === OTHER_COUNTRY ? countryOther.trim() : answers.q2
    const finalAnswers = { ...answers, q2: country }
    const res = await addEntry({
      role: 'Student',
      name: contact.name.trim(),
      email: contact.email.trim(),
      org: '',
      jobTitle: '',
      whatsapp: contact.whatsapp.trim(),
      country,
      supporting: '',
      studyLevel: answers.q1,
      intendedStart: answers.q3,
      ageBand: contact.ageBand,
      parentEmail: under18 ? contact.parentEmail.trim() : '',
      consentText: CONSENT_TEXT,
      tags: ['checklist'],
      checklistAnswers: finalAnswers,
    })
    setSubmitting(false)
    if (!res.ok) {
      setSubmitError("Sorry, we couldn't save that. Please try again.")
      return
    }
    setResult({
      first: contact.name.trim().split(/\s+/)[0],
      items: buildChecklist(finalAnswers),
      under18,
    })
  }

  return (
    <PageShell>
      <Hero
        eyebrow="Free checklist"
        title={
          <>
            Get your free <span className="text-glimmer">Ireland Readiness Checklist</span>
          </>
        }
        answer={ANSWER}
        note="The checklist is free. The full assessment is paid. We don't ask about money or visa history."
      />

      <section className="px-6 pb-20 pt-4">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {result ? (
            <Results result={result} />
          ) : step < DETAILS_STEP ? (
            <div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  Question {step + 1} of {QUESTIONS.length}
                </span>
                <span>About 2 minutes</span>
              </div>
              <div
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-border"
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={QUESTIONS.length}
                aria-valuenow={step + 1}
              >
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-300"
                  style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <h2
                ref={headingRef}
                tabIndex={-1}
                className="mt-6 text-xl font-bold leading-snug text-heading outline-none"
              >
                {q.prompt}
              </h2>

              {isCountryQ ? (
                <div className="mt-5 space-y-4">
                  <Select
                    id="q2"
                    aria-label={q.prompt}
                    value={answers.q2 ?? ''}
                    onChange={(e) => setAnswers((a) => ({ ...a, q2: e.target.value }))}
                  >
                    <CountryOptions />
                  </Select>
                  {answers.q2 === OTHER_COUNTRY && (
                    <Field label="Please tell us which country" htmlFor="q2-other">
                      <input
                        id="q2-other"
                        type="text"
                        value={countryOther}
                        onChange={(e) => setCountryOther(e.target.value)}
                        className={inputCls(false)}
                      />
                    </Field>
                  )}
                </div>
              ) : (
                <fieldset className="mt-5 space-y-2.5">
                  <legend className="sr-only">{q.prompt}</legend>
                  {q.options!.map((o) => (
                    <label
                      key={o}
                      className={cn(
                        'flex cursor-pointer items-center gap-3 rounded-xl border border-input px-4 py-3.5 text-[15px] text-foreground transition-colors hover:bg-secondary/50',
                        'has-[:checked]:bg-primary/10 has-[:checked]:ring-2 has-[:checked]:ring-primary',
                      )}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={o}
                        checked={answers[q.id] === o}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: o }))}
                        className="h-4 w-4 shrink-0 accent-[var(--primary)]"
                      />
                      {o}
                    </label>
                  ))}
                </fieldset>
              )}

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:invisible"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={next}
                  disabled={!answered}
                  className="btn-sheen inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="relative z-[2] inline-flex items-center gap-2">
                    Next <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              <div>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="text-xl font-bold leading-snug text-heading outline-none"
                >
                  Where should we send it?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  You'll see your checklist on screen and get a copy by email.
                </p>
              </div>

              <Field label="First name" htmlFor="c-name" error={errors.name}>
                <input
                  id="c-name"
                  type="text"
                  autoComplete="given-name"
                  value={contact.name}
                  onChange={(e) => setContactField('name', e.target.value)}
                  aria-invalid={!!errors.name}
                  className={inputCls(!!errors.name)}
                />
              </Field>
              <Field label="Email address" htmlFor="c-email" error={errors.email}>
                <input
                  id="c-email"
                  type="email"
                  autoComplete="email"
                  value={contact.email}
                  onChange={(e) => setContactField('email', e.target.value)}
                  aria-invalid={!!errors.email}
                  className={inputCls(!!errors.email)}
                />
              </Field>
              <Field
                label="WhatsApp number (optional)"
                htmlFor="c-whatsapp"
                hint="For launch updates only"
                error={errors.whatsapp}
              >
                <input
                  id="c-whatsapp"
                  type="tel"
                  autoComplete="tel"
                  value={contact.whatsapp}
                  onChange={(e) => setContactField('whatsapp', e.target.value)}
                  aria-invalid={!!errors.whatsapp}
                  className={inputCls(!!errors.whatsapp)}
                />
              </Field>
              <Field label="Age" htmlFor="c-age" error={errors.ageBand}>
                <Select
                  id="c-age"
                  value={contact.ageBand}
                  onChange={(e) => setContactField('ageBand', e.target.value)}
                  invalid={!!errors.ageBand}
                >
                  <option value="">Select your age</option>
                  {AGE_BANDS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </Select>
              </Field>
              {contact.ageBand === 'Under 18' && (
                <Field
                  label="Parent or guardian email"
                  htmlFor="c-parent"
                  hint="We'll check with them before sending you anything."
                  error={errors.parentEmail}
                >
                  <input
                    id="c-parent"
                    type="email"
                    autoComplete="off"
                    value={contact.parentEmail}
                    onChange={(e) => setContactField('parentEmail', e.target.value)}
                    aria-invalid={!!errors.parentEmail}
                    className={inputCls(!!errors.parentEmail)}
                  />
                </Field>
              )}

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
                  <input
                    type="checkbox"
                    checked={contact.consent}
                    onChange={(e) => setContactField('consent', e.target.checked)}
                    aria-invalid={!!errors.consent}
                    className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
                  />
                  <span>
                    Send me updates about BloomAbroad's launch. I can unsubscribe at any time.
                    By joining, you agree to our{' '}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary underline underline-offset-4"
                    >
                      Privacy Notice
                    </a>
                    .
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-1.5 text-sm text-destructive" role="alert">
                    {errors.consent}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep((s) => s - 1)}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-sheen inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="relative z-[2] inline-flex items-center gap-2">
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Show my checklist
                  </span>
                </button>
              </div>
              {submitError && (
                <p className="text-center text-sm text-destructive" role="alert">
                  {submitError}
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </PageShell>
  )
}

function Results({ result }: { result: Result }) {
  return (
    <div role="status">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-signal text-signal-foreground">
        <Check className="h-6 w-6" strokeWidth={3} />
      </span>
      <h2 className="mt-4 text-2xl font-bold leading-snug text-heading" tabIndex={-1}>
        Here's your Ireland Readiness Checklist, {result.first}!
      </h2>

      <ol className="mt-6 space-y-3">
        {result.items.map((item, i) => (
          <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-foreground">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold text-signal">
              {i + 1}
            </span>
            {item}
          </li>
        ))}
      </ol>

      <div className="mt-7 rounded-xl bg-secondary/60 p-4 text-sm leading-relaxed text-foreground">
        Your checklist shows what to prepare. The full BloomAbroad assessment tells you where
        you stand. It checks your application and immigration readiness, and an experienced
        consultant reviews every result. You're on the waitlist for our early 2027 launch.
      </div>

      {result.under18 ? (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We've emailed your parent or guardian to confirm. We'll email you a copy of this
          checklist once they have.
        </p>
      ) : (
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We've also emailed you a copy.
        </p>
      )}

      <p className="mt-5">
        <Link
          to="/students#how"
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          See how the full assessment works →
        </Link>
      </p>
      <div className="-mx-6 mt-4 border-t border-border sm:-mx-8">
        <Disclaimer variant="short" />
        <p className="px-6 pb-2 text-center text-xs leading-relaxed text-muted-foreground sm:px-8">
          This checklist is general guidance based on your answers. It isn't an assessment, and
          it doesn't predict admission, visa or immigration decisions.
        </p>
      </div>
    </div>
  )
}
