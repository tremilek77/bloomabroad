import { AudienceProvider } from '@/components/audience'
import { NavBar } from '@/components/NavBar'
import { Hero } from '@/components/Hero'
import { ValueProps } from '@/components/ValueProps'
import { HowItWorks } from '@/components/HowItWorks'
import { Platform } from '@/components/Platform'
import { WaitlistForm } from '@/components/WaitlistForm'
import { Footer } from '@/components/Footer'
import { ScrollProgress } from '@/components/saasta/ScrollProgress'

export function LandingPage() {
  return (
    <AudienceProvider>
      <div className="min-h-dvh bg-background text-foreground">
        <ScrollProgress />
        <NavBar />
        <main>
          <Hero />
          <ValueProps />
          <HowItWorks />
          <Platform />
          <WaitlistForm />
        </main>
        <Footer />
      </div>
    </AudienceProvider>
  )
}
