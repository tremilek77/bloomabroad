import { Link } from 'react-router-dom'
import { usePageMeta } from '@/lib/seo'
import { COMPANY } from '@/lib/company'
import { CONSENT_COOKIE, openCookieSettings } from '@/lib/consent'
import { H2, LegalPage, Lead, P, Table, linkCls } from '@/components/legal/Prose'

/**
 * Flip to true once the names/durations of the cookies the bloomabroad.ai
 * assessment app sets are known (the brief's table has a Supabase row for
 * "keeps you signed in on bloomabroad.ai"). Those cookies belong to that
 * separate app, so they can't be read from this codebase.
 */
const LIST_ASSESSMENT_APP_COOKIES = false

// Page text is final copy from "BloomAbroad website fixes" (Fix 5). The cookie
// list below is what THIS site actually stores; visits are measured with
// Vercel Web Analytics, which doesn't use cookies.
export function CookiesPage() {
  usePageMeta({
    title: 'Cookie Notice | BloomAbroad',
    description:
      'Which cookies BloomAbroad uses, why, and how to change your choices at any time.',
    path: '/cookies',
  })

  const cookieRows: React.ReactNode[][] = [
    [
      <code key="c" className="text-[13px]">{CONSENT_COOKIE}</code>,
      'BloomAbroad',
      'Remembers your cookie choices',
      'Essential',
      '6 months',
    ],
    [
      <code key="t" className="text-[13px]">ba-theme</code>,
      'BloomAbroad',
      'Remembers your light or dark mode choice (kept in your browser storage rather than a cookie)',
      'Essential',
      'Until you clear your browser data',
    ],
  ]
  if (LIST_ASSESSMENT_APP_COOKIES) {
    cookieRows.push([
      '[cookie name]',
      'Supabase',
      'Keeps you signed in on bloomabroad.ai',
      'Essential',
      '[duration]',
    ])
  }

  return (
    <LegalPage title="Cookie Notice" updated={COMPANY.legalLastUpdated}>
      <P>
        <Lead>What cookies are</Lead> Cookies are small files saved on your
        device when you visit a website. They help the site work and can tell us
        how it's being used.
      </P>
      <P>
        <Lead>How we use them</Lead> We use essential cookies to run the site
        and keep you signed in. We measure visits with a privacy-friendly tool
        that doesn't use cookies. We only use marketing cookies if you agree.
      </P>

      <Table
        head={['Category', 'Default', 'Text shown']}
        rows={[
          [
            'Essential',
            'Always on',
            'Needed for the site to work, such as remembering your cookie choice, keeping forms secure and keeping you signed in.',
          ],
          [
            'Marketing',
            'Off',
            'Helps us measure whether our ads reach the right people.',
          ],
        ]}
      />

      <H2>The cookies we set</H2>
      <Table
        head={['Cookie', 'Provider', 'Purpose', 'Type', 'How long']}
        rows={cookieRows}
      />
      <P>
        We don't currently set any marketing cookies. If that changes, they'll
        be listed here and only used if you agree.
      </P>

      <P>
        <Lead>Changing your choices</Lead> You can change your choices at any
        time using{' '}
        <button type="button" onClick={openCookieSettings} className={linkCls}>
          Cookie settings
        </button>{' '}
        at the bottom of every page. You can also clear cookies in your browser
        settings.
      </P>
      <P>
        <Lead>More information</Lead> To find out how we handle your personal
        information, see our{' '}
        <Link to="/privacy" className={linkCls}>
          Privacy Notice
        </Link>
        . For questions, email{' '}
        <a href={`mailto:${COMPANY.privacyEmail}`} className={linkCls}>
          {COMPANY.privacyEmail}
        </a>
        .
      </P>
      <P>
        BloomAbroad is a trading name of {COMPANY.legalName}, registered in
        Ireland.
      </P>
    </LegalPage>
  )
}
