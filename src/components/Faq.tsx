import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAudience } from './audience'
import { Reveal } from './saasta/Reveal'
import { FAQS, type Faq as FaqItem } from '@/lib/faqs'

/**
 * FAQPage structured data covering both audiences (both are present in the
 * DOM). Deduped by question, since a few appear in both lists. Rendered
 * into the page so the prerender bakes it into the static HTML — this is
 * what lets answer engines cite these Q&As directly.
 */
const FAQ_JSON_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [...FAQS.universities, ...FAQS.students]
    .filter((f, i, all) => all.findIndex((x) => x.q === f.q) === i)
    .map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a.join(' ') },
    })),
})

/**
 * Audience-switching FAQ. Both audiences' lists stay in the DOM (the
 * inactive one is `hidden`) so the prerendered HTML carries every answer
 * for search/answer engines — the same approach as the branch heroes.
 */
export function Faq() {
  const { audience } = useAudience()

  return (
    <section id="faq" className="border-t border-border bg-secondary/20">
      <div className="mx-auto max-w-3xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-eyebrow">
            FAQ
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-heading md:text-5xl">
            Questions, <span className="text-glimmer">answered.</span>
          </h2>
        </Reveal>

        <FaqList list={FAQS.universities} hidden={audience !== 'universities'} />
        <FaqList list={FAQS.students} hidden={audience !== 'students'} />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: FAQ_JSON_LD }}
      />
    </section>
  )
}

function FaqList({ list, hidden }: { list: FaqItem[]; hidden: boolean }) {
  // Each list keeps its own open state so switching audience doesn't carry
  // an index across two differently-sized lists.
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div hidden={hidden} className="mt-10 divide-y divide-border border-y border-border">
      {list.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-start justify-between gap-4 py-5 text-left"
              >
                <span className="text-[15px] font-semibold text-heading transition-colors group-hover:text-primary md:text-base">
                  {item.q}
                </span>
                <Plus
                  className={`mt-0.5 h-5 w-5 shrink-0 text-signal transition-transform duration-300 ${
                    isOpen ? 'rotate-45' : ''
                  }`}
                />
              </button>
            </h3>
            {/* grid-rows trick: animates height while keeping the answer in
                the DOM at all times (crawlable even when collapsed). */}
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              }`}
            >
              <div className="overflow-hidden">
                <div className="space-y-3 pb-6 pr-8">
                  {item.a.map((p, j) => (
                    <p
                      key={j}
                      className="text-[15px] leading-relaxed text-muted-foreground"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

