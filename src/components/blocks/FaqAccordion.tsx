import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import type { Faq } from '@/content/faqs'

/**
 * FAQ list that shows the first `visible` questions and folds the rest behind
 * "More questions". Everything stays in the DOM, so crawlers and the
 * prerender see every answer, and the FAQPage schema (built from the same
 * items by the page) matches what's on screen.
 */
export function FaqAccordion({ items, visible = 5 }: { items: Faq[]; visible?: number }) {
  const [open, setOpen] = useState<number | null>(0)
  const [showAll, setShowAll] = useState(items.length <= visible)

  return (
    <div>
      <div className="divide-y divide-border border-y border-border">
        {items.map((item, i) => {
          const isOpen = open === i
          const folded = !showAll && i >= visible
          return (
            <div key={item.q} hidden={folded}>
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
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 pr-8 text-[15px] leading-relaxed text-muted-foreground">
                    {item.a}
                    {item.link && item.link.when !== false && (
                      <>
                        {' '}
                        <Link
                          to={item.link.to}
                          className="font-medium text-primary underline underline-offset-4"
                        >
                          {item.link.label} →
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {!showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-5 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          More questions ({items.length - visible})
        </button>
      )}
    </div>
  )
}
