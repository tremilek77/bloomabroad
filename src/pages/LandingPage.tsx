import { AudienceProvider } from '@/components/audience'
import { NavBar } from '@/components/NavBar'
import { Selector } from '@/components/Selector'
import { BranchHero } from '@/components/BranchHero'
import { StatStrip } from '@/components/StatStrip'
import { ValueProps } from '@/components/ValueProps'
import { HowItWorks } from '@/components/HowItWorks'
import { Platform } from '@/components/Platform'
import { WaitlistForm } from '@/components/WaitlistForm'
import { Faq } from '@/components/Faq'
import { Footer } from '@/components/Footer'
import { ScrollProgress } from '@/components/saasta/ScrollProgress'

export function LandingPage() {
  return (
    <AudienceProvider>
      <div className="min-h-dvh bg-background text-foreground">
        <ScrollProgress />
        <NavBar />
        <main>
          {/* Centralized selector + the two branch heroes share the top slot.
              Only one is visible at a time; the others stay in the DOM (hidden)
              so crawlers/prerender still read every audience's copy. */}
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
