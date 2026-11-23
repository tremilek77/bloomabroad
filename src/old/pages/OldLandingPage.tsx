import { AudienceProvider } from '@/old/components/audience'
import { NavBar } from '@/old/components/NavBar'
import { Selector } from '@/old/components/Selector'
import { BranchHero } from '@/old/components/BranchHero'
import { StatStrip } from '@/old/components/StatStrip'
import { ValueProps } from '@/old/components/ValueProps'
import { HowItWorks } from '@/old/components/HowItWorks'
import { Platform } from '@/old/components/Platform'
import { WaitlistForm } from '@/old/components/WaitlistForm'
import { Faq } from '@/old/components/Faq'
import { Footer } from '@/old/components/Footer'
import { ScrollProgress } from '@/old/components/saasta/ScrollProgress'
import { usePageMeta } from '@/lib/seo'

/**
 * ARCHIVED COPY of the site as it stood before the P0 compliance work.
 * Served at /old as a backup. (The source is also tagged `pre-p0-backup` in
 * git.)
 *
 * Everything under src/old is a frozen copy — nothing in it imports from the
 * live components, so changes to the real site can't alter this page. The only
 * deliberate differences from the original:
 *   - a banner saying this is an archive,
 *   - the sign-up form is replaced by a pointer to the live form (it collected
 *     personal data with no consent box),
 *   - it's marked noindex and disallowed in robots.txt so it can't compete
 *     with the real site in search results.
 */
export function OldLandingPage() {
  usePageMeta({
    title: 'BloomAbroad (archived copy)',
    description: 'An archived copy of the previous BloomAbroad website.',
    path: '/old',
    noindex: true,
  })

  return (
    <AudienceProvider>
      <div className="min-h-dvh bg-background text-foreground">
        <div className="bg-heading px-4 py-2 text-center text-sm text-background">
          You're viewing an archived copy of our previous site.{' '}
          <a href="/" className="font-semibold underline underline-offset-4">
            Go to the current site →
          </a>
        </div>
        <ScrollProgress />
        <NavBar />
        <main>
          <div id="top">
            <Selector />
            <BranchHero audience="universities" />
            <BranchHero audience="students" />
          </div>
          <StatStrip />
          <ValueProps />
          <HowItWorks />
          <Platform />
          <WaitlistForm />
          <Faq />
        </main>
        <Footer />
      </div>
    </AudienceProvider>
  )
}
