import type { ReactNode } from 'react'
import { NavBar } from '@/components/NavBar'
import { Footer } from '@/components/Footer'
import { ScrollProgress } from '@/components/saasta/ScrollProgress'

/** NavBar + content + Footer: the frame every public page sits in. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <ScrollProgress />
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
