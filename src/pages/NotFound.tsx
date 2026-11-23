import { Link } from 'react-router-dom'
import { usePageMeta } from '@/lib/seo'
import { PageShell, linkCls } from '@/components/legal/Prose'

export function NotFoundPage() {
  usePageMeta({
    title: 'Page not found | BloomAbroad',
    description: "We couldn't find that page.",
    path: '/404',
    noindex: true,
  })

  return (
    <PageShell>
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-eyebrow">
          404
        </p>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-heading">
          We couldn't find that page
        </h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          It may have moved, or the link may be mistyped.
        </p>
        <p className="mt-8">
          <Link to="/" className={linkCls}>
            Back to the BloomAbroad homepage
          </Link>
        </p>
      </div>
    </PageShell>
  )
}
