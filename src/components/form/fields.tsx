import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { COUNTRIES, OTHER_COUNTRY } from '@/lib/countries'

/** Shared form pieces, used by the waitlist form and the checklist. */

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-foreground"
      >
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="mt-1.5 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/** A native <select> (best on mobile) with a chevron, styled like the inputs. */
export function Select({
  invalid,
  children,
  ...props
}: React.ComponentProps<'select'> & { invalid?: boolean }) {
  return (
    <div className="relative">
      <select
        aria-invalid={invalid}
        className={cn(inputCls(!!invalid), 'appearance-none pr-10')}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export function inputCls(invalid: boolean) {
  return cn(
    'w-full rounded-xl border bg-card px-4 py-3 text-[15px] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60',
    'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
    invalid ? 'border-destructive' : 'border-input',
  )
}

/** The countries from the brief (Fix 1) as one flat list, plus "Other". */
export function CountryOptions() {
  return (
    <>
      <option value="">Select your country</option>
      {COUNTRIES.map((c) => (
        <option key={c} value={c}>
          {c}
        </option>
      ))}
      <option value={OTHER_COUNTRY}>Other</option>
    </>
  )
}
