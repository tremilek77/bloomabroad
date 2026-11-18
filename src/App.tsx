import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { LandingPage } from '@/pages/LandingPage'
import { CookieConsent } from '@/components/CookieConsent'
import { founderNode, organizationNode, useSchema, websiteNode } from '@/lib/schema'

// Everything except the homepage is split into its own chunk, so first-time
// visitors only download what they actually open.
const lazyPage = <T extends Record<string, React.ComponentType>>(
  load: () => Promise<T>,
  name: keyof T,
) => lazy(() => load().then((m) => ({ default: m[name] })))

const StudentsPage = lazyPage(() => import('@/pages/Students'), 'StudentsPage')
const UniversitiesPage = lazyPage(() => import('@/pages/Universities'), 'UniversitiesPage')
const ChecklistPage = lazyPage(() => import('@/pages/Checklist'), 'ChecklistPage')
const AboutPage = lazyPage(() => import('@/pages/About'), 'AboutPage')
const GuidesPage = lazyPage(() => import('@/pages/Guides'), 'GuidesPage')
const GuidePage = lazyPage(() => import('@/pages/Guide'), 'GuidePage')
const PricingPage = lazyPage(() => import('@/pages/Pricing'), 'PricingPage')
const VerifyPage = lazyPage(() => import('@/pages/Verify'), 'VerifyPage')
const PrivacyPage = lazyPage(() => import('@/pages/Privacy'), 'PrivacyPage')
const TermsPage = lazyPage(() => import('@/pages/Terms'), 'TermsPage')
const ContactPage = lazyPage(() => import('@/pages/Contact'), 'ContactPage')
const ComplaintsPage = lazyPage(() => import('@/pages/Complaints'), 'ComplaintsPage')
const CookiesPage = lazyPage(() => import('@/pages/Cookies'), 'CookiesPage')
const ConfirmParentPage = lazyPage(() => import('@/pages/ConfirmParent'), 'ConfirmParentPage')
const NotFoundPage = lazyPage(() => import('@/pages/NotFound'), 'NotFoundPage')
// Admin has the Supabase auth flow that visitors never need.
const AdminPage = lazyPage(() => import('@/pages/AdminPage'), 'AdminPage')
// Frozen copy of the site as it was before the P0 work (a backup).
const OldLandingPage = lazyPage(() => import('@/old/pages/OldLandingPage'), 'OldLandingPage')

/**
 * Scroll handling for a single-page app:
 *  - moving to another page starts at the top;
 *  - a link like "/#waitlist" from another page scrolls to that section once
 *    the page has rendered (the browser can't, because the section doesn't
 *    exist yet when the page first loads).
 */
function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }
    // The target may not exist yet (lazy route still loading after a full page
    // load on /#how), so keep looking for a couple of seconds before giving up.
    const id = decodeURIComponent(hash.slice(1))
    let tries = 0
    const timer = window.setInterval(() => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView()
        window.clearInterval(timer)
      } else if (++tries > 40) {
        window.clearInterval(timer)
      }
    }, 60)
    return () => window.clearInterval(timer)
  }, [pathname, hash])
  return null
}

/** Organization, founder and website structured data, on every page. */
function SiteSchema() {
  useSchema('site', [organizationNode(), founderNode(), websiteNode()])
  return null
}

const isLocalhost = () =>
  ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)

function App() {
  return (
    <>
      <ScrollManager />
      <SiteSchema />
      <Suspense fallback={<div className="min-h-dvh bg-background" />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/students" element={<StudentsPage />} />
          <Route path="/universities" element={<UniversitiesPage />} />
          <Route path="/checklist" element={<ChecklistPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:slug" element={<GuidePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/complaints" element={<ComplaintsPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="/confirm" element={<ConfirmParentPage />} />
          <Route path="/old" element={<OldLandingPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>

      <CookieConsent />

      {/* Vercel Web Analytics: no cookies, so it needs no consent. Not loaded
          on localhost (that's where the build-time prerender runs, and there's
          no analytics endpoint there), and visits to /admin aren't counted. */}
      {!isLocalhost() && (
        <Analytics beforeSend={(e) => (new URL(e.url).pathname.startsWith('/admin') ? null : e)} />
      )}
    </>
  )
}

export default App
