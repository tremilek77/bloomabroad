import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'

// Admin is a separate route (with the Supabase auth flow) that first-time
// visitors never load — split it into its own chunk.
const AdminPage = lazy(() =>
  import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })),
)

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/admin"
        element={
          <Suspense
            fallback={
              <div className="min-h-dvh bg-background text-muted-foreground" />
            }
          >
            <AdminPage />
          </Suspense>
        }
      />
    </Routes>
  )
}

export default App
