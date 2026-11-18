import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from './saasta/Reveal'
import { addEntry, type NewEntry, type Role } from '@/lib/waitlist'
import { OTHER_COUNTRY } from '@/lib/countries'
import { AGE_BANDS, CONSENT_TEXT, STARTS, STUDY_LEVELS, SUPPORTING } from '@/content/formOptions'
import { CountryOptions, Field, Select, inputCls } from '@/components/form/fields'

/* -------------------------------------------------------------------------
 * Role-based waitlist form (brief, Fix 1).
 *
 * One form that starts with a role choice and shows only that role's fields:
 *
 *   Field                       Student        Parent/sponsor  University
 *   First name (full name: uni) required       required        required
 *   Email                       required       required        required
 *   WhatsApp (optional)         optional       optional        —
 *   Country you live in         required       required        —
 *   Who you're supporting       —              required        —
 *   Study level                 required       required        —
 *   Intended start              required       required        —
 *   Age band                    required       —               —
 *   Parent/guardian email       if Under 18    —               —
 *   Institution name            —              —               required
 *   Job title                   —              —               required
 *
 * Consent is required and NEVER pre-ticked. Only age BANDS are collected,
 * never a date of birth.
 * ----------------------------------------------------------------------- */

const ROLES = [
  { value: 'Student', label: "I'm a student" },
  { value: 'Parent', label: "I'm a parent or sponsor" },
  { value: 'University', label: 'I represent a university or college' },
] as const

const filled = (v: string | undefined) => Boolean(v && v.trim())
const validEmail = (v: string) => z.email().safeParse(v).success

const schema = z
  .object({
    role: z.enum(['Student', 'Parent', 'University'], {
      error: "Please choose who's joining",
    }),
    name: z.string().trim().min(1, 'Please enter your name'),
    email: z.email('Enter a valid email address'),
    whatsapp: z.string().trim().optional(),
    country: z.string().optional(),
    countryOther: z.string().trim().optional(),
    supporting: z.string().optional(),
    studyLevel: z.string().optional(),
    intendedStart: z.string().optional(),
    ageBand: z.string().optional(),
    parentEmail: z.string().trim().optional(),
    org: z.string().trim().optional(),
    jobTitle: z.string().trim().optional(),
    consent: z.boolean(),
  })
  .superRefine((v, ctx) => {
    const need = (field: keyof typeof v, message: string) => {
      if (!filled(v[field] as string | undefined)) {
        ctx.addIssue({ code: 'custom', path: [field], message })
      }
    }

    if (v.role === 'University') {
      need('org', 'Please enter your institution name')
      need('jobTitle', 'Please enter your job title')
    } else {
      need('country', 'Please choose your country')
      if (v.country === OTHER_COUNTRY) {
        need('countryOther', 'Please tell us which country')
      }
      need('studyLevel', 'Please choose a study level')
      need('intendedStart', 'Please choose when you hope to start')
      if (v.role === 'Parent') need('supporting', "Please tell us who you're supporting")
      if (v.role === 'Student') {
        need('ageBand', 'Please choose your age')
        if (v.ageBand === 'Under 18') {
          if (!filled(v.parentEmail)) {
            ctx.addIssue({
              code: 'custom',
              path: ['parentEmail'],
              message: "Please enter a parent or guardian's email",
            })
          } else if (!validEmail(v.parentEmail!)) {
            ctx.addIssue({
              code: 'custom',
              path: ['parentEmail'],
              message: 'Enter a valid email address',
            })
          }
        }
      }
      if (filled(v.whatsapp) && !/^[+()\d\s-]{6,20}$/.test(v.whatsapp!)) {
        ctx.addIssue({
          code: 'custom',
          path: ['whatsapp'],
          message: 'Enter a valid phone number, or leave this blank',
        })
      }
    }

    if (!v.consent) {
      ctx.addIssue({
        code: 'custom',
        path: ['consent'],
        message: 'Please tick the box to join the waitlist',
      })
    }
  })

type FormValues = z.infer<typeof schema>

type WaitlistFormProps = {
  /** Role to start on (e.g. Student on /students). The visitor can change it. */
  defaultRole?: Role
  /** Country to start on (country pages). The visitor can change it. */
  defaultCountry?: string
  eyebrow?: string
  heading?: React.ReactNode
  lead?: string
}

export function WaitlistForm({
  defaultRole,
  defaultCountry,
  eyebrow = 'Join the waitlist',
  heading = <span className="text-glimmer">Be first in line</span>,
  lead = 'BloomAbroad launches in early 2027, starting with Ireland.',
}: WaitlistFormProps = {}) {
  const [submitted, setSubmitted] = useState<FormValues | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      whatsapp: '',
      country: defaultCountry ?? '',
      countryOther: '',
      supporting: '',
      studyLevel: '',
      intendedStart: '',
      ageBand: '',
      parentEmail: '',
      org: '',
      jobTitle: '',
      consent: false, // never pre-ticked
    },
  })

  // Pages that serve one audience start on that role. The visitor can still
  // change it here (e.g. to "parent or sponsor").
  useEffect(() => {
    if (defaultRole) setValue('role', defaultRole)
  }, [defaultRole, setValue])

  const role = watch('role')
  const country = watch('country')
  const ageBand = watch('ageBand')
  const isUni = role === 'University'
  const underAge = role === 'Student' && ageBand === 'Under 18'

  async function onSubmit(v: FormValues) {
    setSubmitError(null)
    const uni = v.role === 'University'
    const entry: NewEntry = {
      role: v.role,
      name: v.name,
      email: v.email,
      org: uni ? (v.org ?? '') : '',
      jobTitle: uni ? (v.jobTitle ?? '') : '',
      whatsapp: uni ? '' : (v.whatsapp ?? ''),
      country: uni
        ? ''
        : v.country === OTHER_COUNTRY
          ? (v.countryOther ?? '')
          : (v.country ?? ''),
      supporting: v.role === 'Parent' ? (v.supporting ?? '') : '',
      studyLevel: uni ? '' : (v.studyLevel ?? ''),
      intendedStart: uni ? '' : (v.intendedStart ?? ''),
      ageBand: v.role === 'Student' ? (v.ageBand ?? '') : '',
      parentEmail: v.role === 'Student' && v.ageBand === 'Under 18' ? (v.parentEmail ?? '') : '',
      consentText: CONSENT_TEXT,
    }
    const res = await addEntry(entry)
    if (!res.ok) {
      setSubmitError("Sorry — we couldn't save that. Please try again.")
      return
    }
    setSubmitted(v)
  }

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

        {submitted ? (
          <Confirmation values={submitted} />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mx-auto mt-10 max-w-md space-y-5 text-left"
          >
            {/* Step 1: who's joining */}
            <fieldset>
              <legend className="mb-2 block text-sm font-medium text-foreground">
                Who's joining?
              </legend>
              <div className="space-y-2">
                {ROLES.map((r) => (
                  <label
                    key={r.value}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors',
                      role === r.value
                        ? 'border-primary bg-primary/10 text-heading'
                        : 'border-input bg-card text-foreground hover:border-primary/50',
                    )}
                  >
                    <input
                      type="radio"
                      value={r.value}
                      className="h-4 w-4 accent-[var(--primary)]"
                      {...register('role')}
                    />
                    {r.label}
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="mt-1.5 text-sm text-destructive" role="alert">
                  {errors.role.message}
                </p>
              )}
            </fieldset>

            {/* Step 2: only that role's fields */}
            {role && (
              <>
                <Field
                  label={isUni ? 'Full name' : 'First name'}
                  htmlFor="name"
                  error={errors.name?.message}
                >
                  <input
                    id="name"
                    type="text"
                    autoComplete={isUni ? 'name' : 'given-name'}
                    aria-invalid={!!errors.name}
                    className={inputCls(!!errors.name)}
                    {...register('name')}
                  />
                </Field>

                <Field label="Email address" htmlFor="email" error={errors.email?.message}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    className={inputCls(!!errors.email)}
                    {...register('email')}
                  />
                </Field>

                {isUni ? (
                  <>
                    <Field
                      label="Institution name"
                      htmlFor="org"
                      error={errors.org?.message}
                    >
                      <input
                        id="org"
                        type="text"
                        autoComplete="organization"
                        aria-invalid={!!errors.org}
                        className={inputCls(!!errors.org)}
                        {...register('org')}
                      />
                    </Field>
                    <Field
                      label="Job title"
                      htmlFor="jobTitle"
                      error={errors.jobTitle?.message}
                    >
                      <input
                        id="jobTitle"
                        type="text"
                        autoComplete="organization-title"
                        aria-invalid={!!errors.jobTitle}
                        className={inputCls(!!errors.jobTitle)}
                        {...register('jobTitle')}
                      />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field
                      label="WhatsApp number (optional)"
                      htmlFor="whatsapp"
                      hint="For launch updates only"
                      error={errors.whatsapp?.message}
                    >
                      <input
                        id="whatsapp"
                        type="tel"
                        autoComplete="tel"
                        aria-invalid={!!errors.whatsapp}
                        className={inputCls(!!errors.whatsapp)}
                        {...register('whatsapp')}
                      />
                    </Field>

                    <Field
                      label="Country you live in"
                      htmlFor="country"
                      error={errors.country?.message}
                    >
                      <Select id="country" invalid={!!errors.country} {...register('country')}>
                        <CountryOptions />
                      </Select>
                    </Field>
                    {country === OTHER_COUNTRY && (
                      <Field
                        label="Please tell us which country"
                        htmlFor="countryOther"
                        error={errors.countryOther?.message}
                      >
                        <input
                          id="countryOther"
                          type="text"
                          aria-invalid={!!errors.countryOther}
                          className={inputCls(!!errors.countryOther)}
                          {...register('countryOther')}
                        />
                      </Field>
                    )}

                    {role === 'Parent' && (
                      <Field
                        label="Who you're supporting"
                        htmlFor="supporting"
                        error={errors.supporting?.message}
                      >
                        <Select id="supporting" invalid={!!errors.supporting} {...register('supporting')}>
                          <option value="">Select one</option>
                          {SUPPORTING.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    )}

                    <Field
                      label={role === 'Parent' ? 'Their study level' : 'Study level'}
                      htmlFor="studyLevel"
                      error={errors.studyLevel?.message}
                    >
                      <Select id="studyLevel" invalid={!!errors.studyLevel} {...register('studyLevel')}>
                        <option value="">Select one</option>
                        {STUDY_LEVELS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Select>
                    </Field>

                    <Field
                      label={role === 'Parent' ? 'Their intended start' : 'Intended start'}
                      htmlFor="intendedStart"
                      error={errors.intendedStart?.message}
                    >
                      <Select id="intendedStart" invalid={!!errors.intendedStart} {...register('intendedStart')}>
                        <option value="">Select one</option>
                        {STARTS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Select>
                    </Field>

                    {role === 'Student' && (
                      <Field label="Age" htmlFor="ageBand" error={errors.ageBand?.message}>
                        <Select id="ageBand" invalid={!!errors.ageBand} {...register('ageBand')}>
                          <option value="">Select your age</option>
                          {AGE_BANDS.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    )}

                    {underAge && (
                      <Field
                        label="Parent or guardian email"
                        htmlFor="parentEmail"
                        hint="We'll check with them before sending you anything."
                        error={errors.parentEmail?.message}
                      >
                        <input
                          id="parentEmail"
                          type="email"
                          autoComplete="off"
                          aria-invalid={!!errors.parentEmail}
                          className={inputCls(!!errors.parentEmail)}
                          {...register('parentEmail')}
                        />
                      </Field>
                    )}
                  </>
                )}

                {/* Consent: required, and never pre-ticked. */}
                <div>
                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
                    <input
                      type="checkbox"
                      aria-invalid={!!errors.consent}
                      className="mt-1 h-4 w-4 shrink-0 accent-[var(--primary)]"
                      {...register('consent')}
                    />
                    <span>
                      Send me updates about BloomAbroad's launch. I can
                      unsubscribe at any time. By joining, you agree to our{' '}
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
                      {errors.consent.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-sheen inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_40px_-10px_var(--primary)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="relative z-[2] inline-flex items-center gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Join the waitlist
              </span>
            </button>

            {submitError && (
              <p className="text-center text-sm text-destructive" role="alert">
                {submitError}
              </p>
            )}

            <p className="text-center text-sm text-muted-foreground">
              No spam. Just updates on early access. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  )
}

/** Students and parents get the brief's message; universities keep the
 *  existing one (their email carries the discovery-call details). */
function Confirmation({ values }: { values: FormValues }) {
  const uni = values.role === 'University'
  const under18 = values.role === 'Student' && values.ageBand === 'Under 18'
  return (
    <div
      role="status"
      className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-signal-foreground">
        <Check className="h-6 w-6" strokeWidth={3} />
      </span>
      {uni ? (
        <>
          <h3 className="text-2xl font-bold text-heading">You're on the list.</h3>
          <p className="text-sm text-muted-foreground">
            Thanks for joining. We'll be in touch with early-access updates — no
            spam, unsubscribe anytime.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-2xl font-bold text-heading">You're on the list!</h3>
          <p className="text-sm text-muted-foreground">
            We'll be in touch before launch in early 2027.
          </p>
          {under18 && (
            <p className="text-sm text-muted-foreground">
              We've emailed your parent or guardian to confirm. We'll only
              contact you once they have.
            </p>
          )}
        </>
      )}
    </div>
  )
}
