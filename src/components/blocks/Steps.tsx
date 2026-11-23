import { Reveal } from '@/components/saasta/Reveal'

export type Step = { title: string; body: string }

/** Numbered steps. Max 4: past that, nobody reads them. */
export function Steps({ steps }: { steps: Step[] }) {
  return (
    <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((s, i) => (
        <Reveal key={s.title} delay={i * 0.08} from="up">
          <li className="group">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_22px_-2px_var(--primary)]">
              {i + 1}
            </div>
            <h3 className="mt-4 text-base font-bold text-heading">{s.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
              {s.body}
            </p>
          </li>
        </Reveal>
      ))}
    </ol>
  )
}
