import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAudience } from './audience'
import { Reveal } from './saasta/Reveal'
import { addEntry } from '@/lib/waitlist'

const schema = z.object({
  name: z.string().trim().min(1, 'Please enter your name'),
  email: z.email('Enter a valid email address'),
  role: z.enum(['University', 'Student']),
  org: z.string().trim().optional(),
})

type FormValues = z.infer<typeof schema>

export function WaitlistForm() {
  const { audience } = useAudience()
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      // sticky: default to whichever audience the visitor was reading
      role: audience === 'students' ? 'Student' : 'University',
      org: '',
    },
  })

  async function onSubmit(values: FormValues) {
    setSubmitError(null)
    const res = await addEntry({
      name: values.name,
      email: values.email,
      role: values.role,
      org: values.org ?? '',
    })
    if (!res.ok) {
      setSubmitError("Sorry — we couldn't save that. Please try again.")
      return
    }
    setSubmitted(true)
  }

  return (
    <section id="waitlist" className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-2xl px-6 py-20 text-center md:py-28">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-eyebrow">
            Early access
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-heading md:text-5xl">
            <span className="text-glimmer">Be first.</span> Shape the platform.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            BloomAbroad is in pre-launch. We're opening early access to a select
            group of universities and students who want to help build something
            better for international education.
          </p>
        </Reveal>

        {submitted ? (
          <div
            role="status"
            className="mx-auto mt-10 flex max-w-md flex-col items-center gap-4 rounded-2xl border border-border bg-card p-10"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-signal-foreground">
              <Check className="h-6 w-6" strokeWidth={3} />
            </span>
            <h3 className="text-2xl font-bold text-heading">You're on the list.</h3>
            <p className="text-sm text-muted-foreground">
              Thanks for joining. We'll be in touch with early-access updates —
              no spam, unsubscribe anytime.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mx-auto mt-10 max-w-md space-y-5 text-left"
          >
            <Field label="Name" htmlFor="name" error={errors.name?.message}>
              <input
                id="name"
                type="text"
                autoComplete="name"
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

            <Controller
              control={control}
              name="role"
              render={({ field }) => (
                <fieldset>
                  <legend className="mb-2 block text-sm font-medium text-foreground">
                    I am a
                  </legend>
                  <div className="grid grid-cols-2 gap-2 rounded-full border border-input bg-card p-1">
                    {(['University', 'Student'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        aria-pressed={field.value === opt}
                        onClick={() => field.onChange(opt)}
                        className={cn(
                          'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                          field.value === opt
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
            />

            <Field
              label="Institution / Country"
              htmlFor="org"
              optional
              error={errors.org?.message}
            >
              <input
                id="org"
                type="text"
                className={inputCls(false)}
                {...register('org')}
              />
            </Field>

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

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-foreground"
      >
        {label}
        {optional && (
          <span className="ml-1 font-normal text-muted-foreground">(optional)</span>
        )}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

function inputCls(invalid: boolean) {
  return cn(
    'w-full rounded-xl border bg-card px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
    invalid ? 'border-destructive' : 'border-input',
  )
}
