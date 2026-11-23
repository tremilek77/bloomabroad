import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'
import { addEntry, type NewEntry } from '@/lib/waitlist'
import { OTHER_COUNTRY } from '@/lib/countries'
import { AGE_BANDS, CONSENT_TEXT, STARTS, STUDY_LEVELS, SUPPORTING } from '@/content/formOptions'
import { CountryOptions, Field, Select, inputCls } from '@/components/form/fields'
import {
  ConsentBox,
  FORM_CLS,
  FormError,
  SubmitButton,
  Success,
  WaitlistFrame,
} from '@/components/form/WaitlistParts'

/* -------------------------------------------------------------------------
 * Student waitlist (brief, Fix 1). Used on /students, /pricing and the
 * country pages. Universities have their own form on /universities, so there
 * is no university option here.
 *
 *   Field                       Student        Parent/sponsor
 *   First name                  required       required
 *   Email                       required       required
 *   WhatsApp (optional)         optional       optional
 *   Country you live in         required       required
 *   Who you're supporting       —              required
 *   Study level                 required       required
 *   Intended start              required       required
 *   Age band                    required       —
 *   Parent/guardian email       if Under 18    —
 *
 * Consent is required and NEVER pre-ticked. Only age BANDS are collected,
 * never a date of birth.
 * ----------------------------------------------------------------------- */

const WHO = [
  { value: 'Student', label: "I'm a student" },
  { value: 'Parent', label: "I'm a parent or sponsor" },
] as const

const filled = (v: string | undefined) => Boolean(v && v.trim())
const validEmail = (v: string) => z.email().safeParse(v).success

const schema = z
  .object({
    role: z.enum(['Student', 'Parent']),
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
    consent: z.boolean(),
  })
  .superRefine((v, ctx) => {
    const need = (field: keyof typeof v, message: string) => {
      if (!filled(v[field] as string | undefined)) {
        ctx.addIssue({ code: 'custom', path: [field], message })
      }
    }

    need('country', 'Please choose your country')
    if (v.country === OTHER_COUNTRY) need('countryOther', 'Please tell us which country')
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
    if (!v.consent) {
      ctx.addIssue({
        code: 'custom',
        path: ['consent'],
        message: 'Please tick the box to join the waitlist',
      })
    }
  })

type FormValues = z.infer<typeof schema>

type Props = {
  /** Country to start on (country pages). The visitor can change it. */
  defaultCountry?: string
  eyebrow?: string
  heading?: React.ReactNode
  lead?: string
}

export function StudentWaitlistForm({
  defaultCountry,
  eyebrow = 'Join the waitlist',
  heading = <span className="text-glimmer">Be first in line</span>,
  lead = 'BloomAbroad launches in early 2027, starting with Ireland.',
}: Props = {}) {
  const [submitted, setSubmitted] = useState<FormValues | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      role: 'Student',
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
      consent: false, // never pre-ticked
    },
  })

  const role = watch('role')
  const country = watch('country')
  const isParent = role === 'Parent'
  const underAge = role === 'Student' && watch('ageBand') === 'Under 18'

  async function onSubmit(v: FormValues) {
    setSubmitError(null)
    const entry: NewEntry = {
      role: v.role,
      name: v.name,
      email: v.email,
      org: '',
      jobTitle: '',
      whatsapp: v.whatsapp ?? '',
      country: v.country === OTHER_COUNTRY ? (v.countryOther ?? '') : (v.country ?? ''),
      supporting: v.role === 'Parent' ? (v.supporting ?? '') : '',
      studyLevel: v.studyLevel ?? '',
      intendedStart: v.intendedStart ?? '',
      ageBand: v.role === 'Student' ? (v.ageBand ?? '') : '',
      parentEmail: v.role === 'Student' && v.ageBand === 'Under 18' ? (v.parentEmail ?? '') : '',
      consentText: CONSENT_TEXT,
    }
    const res = await addEntry(entry)
    if (!res.ok) {
      setSubmitError("Sorry, we couldn't save that. Please try again.")
      return
    }
    setSubmitted(v)
  }

  return (
    <WaitlistFrame eyebrow={eyebrow} heading={heading} lead={lead}>
      {submitted ? (
        <Success title="You're on the list!">
          <p className="text-sm text-muted-foreground">
            We'll be in touch before launch in early 2027.
          </p>
          {submitted.role === 'Student' && submitted.ageBand === 'Under 18' && (
            <p className="text-sm text-muted-foreground">
              We've emailed your parent or guardian to confirm. We'll only contact you once they
              have.
            </p>
          )}
        </Success>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={FORM_CLS}>
          <fieldset>
            <legend className="mb-2 block text-sm font-medium text-foreground">
              Who's joining?
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {WHO.map((r) => (
                <label
                  key={r.value}
                  className={cn(
                    'flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-3 text-sm font-medium transition-colors',
                    role === r.value
                      ? 'border-primary bg-primary/10 text-heading'
                      : 'border-input bg-card text-foreground hover:border-primary/50',
                  )}
                >
                  <input
                    type="radio"
                    value={r.value}
                    className="h-4 w-4 shrink-0 accent-[var(--primary)]"
                    {...register('role')}
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </fieldset>

          <Field label="First name" htmlFor="name" error={errors.name?.message}>
            <input
              id="name"
              type="text"
              autoComplete="given-name"
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

          <Field label="Country you live in" htmlFor="country" error={errors.country?.message}>
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

          {isParent && (
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
            label={isParent ? 'Their study level' : 'Study level'}
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
            label={isParent ? 'Their intended start' : 'Intended start'}
            htmlFor="intendedStart"
            error={errors.intendedStart?.message}
          >
            <Select
              id="intendedStart"
              invalid={!!errors.intendedStart}
              {...register('intendedStart')}
            >
              <option value="">Select one</option>
              {STARTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>

          {!isParent && (
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

          <ConsentBox error={errors.consent?.message} inputProps={register('consent')} />

          <SubmitButton busy={isSubmitting}>Join the waitlist</SubmitButton>
          <FormError message={submitError} />

          <p className="text-center text-sm text-muted-foreground">
            No spam. Just updates on early access. Unsubscribe anytime.
          </p>
        </form>
      )}
    </WaitlistFrame>
  )
}
