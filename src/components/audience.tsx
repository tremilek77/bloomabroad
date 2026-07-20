import { createContext, useContext, useState, type ReactNode } from 'react'

export type Audience = 'universities' | 'students'

type AudienceContextValue = {
  audience: Audience
  setAudience: (a: Audience) => void
}

const AudienceContext = createContext<AudienceContextValue | null>(null)

export function AudienceProvider({ children }: { children: ReactNode }) {
  const [audience, setAudience] = useState<Audience>('universities')
  return (
    <AudienceContext.Provider value={{ audience, setAudience }}>
      {children}
    </AudienceContext.Provider>
  )
}

export function useAudience() {
  const ctx = useContext(AudienceContext)
  if (!ctx) throw new Error('useAudience must be used within an AudienceProvider')
  return ctx
}
