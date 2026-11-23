import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addEntry, type NewEntry } from '@/lib/waitlist'
import { CONSENT_TEXT } from '@/content/formOptions'
import { Field, inputCls } from '@/components/form/fields'
import {
  ConsentBox,
  FORM_CLS,
  FormError,
  SubmitButton,
  Success,
  WaitlistFrame,
} from '@/components/form/WaitlistParts'

/**
 * Early-access request for universities and colleges (brief, Fix 1). Used only
 * on /universities. Students and parents have their own form, so this one has
 * no role choice and none of the student fields (no country, study level, age).
 */
const schema = z.object({
  name: z.string().trim().min(1, 'Please enter your full name'),
  email: z.email('Enter a valid email address'),
  org: z.string().trim().min(1, 'Please enter your institution name'),
  jobTitle: z.string().trim().min(1, 'Please enter your job title'),
  consent: z.boolean().refine((v) => v, 'Please tick the box to request early access'),
})

type FormValues = z.infer<typeof schema>

type Props = {
  eyebrow?: string
  heading?: React.ReactNode
  lead?: string
}

export function UniversityWaitlistForm({
  eyebrow = 'Early access',
  heading = <span className="text-glimmer">Request early access</span>,
  lead = 'The institution workspace is being developed with a small cohort of Irish institutions.',
}: Props = {}) {
  const [done, setDone] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', org: '', jobTitle: '', consent: false },
  })

  async function onSubmit(v: FormValues) {
    setSubmitError(null)
    const entry: NewEntry = {
      role: 'University',
      name: v.name,
      email: v.email,
      org: v.org,
      jobTitle: v.jobTitle,
      whatsapp: '',
      country: '',
      supporting: '',
      studyLevel: '',
      intendedStart: '',
      ageBand: '',
      parentEmail: '',
      consentText: CONSENT_TEXT,
    }
    const res = await addEntry(entry)
    if (!res.ok) {
      setSubmitError("Sorry, we couldn't save that. Please try again.")
      return
    }
    setDone(true)
  }

  return (
    <WaitlistFrame eyebrow={eyebrow} heading={heading} lead={lead}>
      {done ? (
        <Success title="You're on the list.">
          <p className="text-sm text-muted-foreground">
            Thanks for your interest. We'll be in touch with early-access updates. No spam,
            unsubscribe anytime.
          </p>
        </Success>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={FORM_CLS}>
          <Field label="Full name" htmlFor="name" error={errors.name?.message}>
            <input
              id="name"
              type="text"
              autoComplete="name"
              aria-invalid={!!errors.name}
              className={inputCls(!!errors.name)}
              {...register('name')}
            />
          </Field>

          <Field label="Work email address" htmlFor="email" error={errors.email?.message}>
            <input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={!!errors.email}
              className={inputCls(!!errors.email)}
              {...register('email')}
            />
          </Field>

          <Field label="Institution name" htmlFor="org" error={errors.org?.message}>
            <input
              id="org"
              type="text"
              autoComplete="organization"
              aria-invalid={!!errors.org}
              className={inputCls(!!errors.org)}
              {...register('org')}
            />
          </Field>

          <Field label="Job title" htmlFor="jobTitle" error={errors.jobTitle?.message}>
            <input
              id="jobTitle"
              type="text"
              autoComplete="organization-title"
              aria-invalid={!!errors.jobTitle}
              className={inputCls(!!errors.jobTitle)}
              {...register('jobTitle')}
            />
          </Field>

          <ConsentBox error={errors.consent?.message} inputProps={register('consent')} />

          <SubmitButton busy={isSubmitting}>Request early access</SubmitButton>
          <FormError message={submitError} />

          <p className="text-center text-sm text-muted-foreground">
            No spam. Just updates on early access. Unsubscribe anytime.
          </p>
        </form>
      )}
    </WaitlistFrame>
  )
}
