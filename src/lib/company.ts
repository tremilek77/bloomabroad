/**
 * Company details used across the legal pages, footer and emails.
 *
 * Anything still in [square brackets] is a PLACEHOLDER from the brief's
 * "Placeholders to fill before publishing" table and is waiting on an owner.
 * Fill them in HERE and every page updates. `npm run build` prints a warning
 * for each one that's still unresolved (see scripts/check-placeholders.mjs),
 * so nothing goes live by accident with brackets showing.
 */

/** The address the site is served from today. Switch to https://bloomabroad.ie
 *  (also update index.html's JSON-LD, public/sitemap.xml and robots.txt) once
 *  that domain is attached to the Vercel project. */
export const SITE_URL = 'https://bloomabroad.vercel.app'

export const COMPANY = {
  tradingName: 'BloomAbroad',
  legalName: 'Ubisphere Ltd',

  // --- Owner: Remi ---------------------------------------------------
  croNumber: '[CRO no.]',
  registeredOffice: '[registered office address, Cork]',
  whatsappNumber: '[WhatsApp number]',

  // --- Two-email rule (applies everywhere) -----------------------------
  /** General questions, orders, cancellations, complaints. */
  helloEmail: 'hello@bloomabroad.ie',
  /** Data protection requests only. */
  privacyEmail: 'privacy@bloomabroad.ie',

  // --- Owner: developer ------------------------------------------------
  /** Date shown as "Last updated" on Privacy, Terms and Cookie Notice.
   *  Update this on the day the pages are published. */
  legalLastUpdated: '18 November 2026',
  /** Privacy section 6: the service that sends waitlist emails. */
  emailProvider: 'Resend',
  /** Privacy section 7: the EU region the data is stored in. Confirm in the
   *  Supabase and Vercel dashboards. */
  dataRegion: '[EU region]',

  // --- Owner: Remi to confirm (suggested values from the brief) ---------
  waitlistRetention: '24 months',
  assessmentRetention: '2 years',
} as const

/** Optional: a booking link for the 30-minute discovery call. While it's
 *  empty the "Book a discovery call" links fall back to an email to hello@. */
export const BOOKING_URL = ''

/** Where "Book a discovery call" buttons point: the booking link, or an email
 *  to hello@ until one exists. */
export const BOOKING_HREF =
  BOOKING_URL ||
  `mailto:${COMPANY.helloEmail}?subject=${encodeURIComponent('Discovery call')}`

/** Social accounts. The brief says to show ONLY accounts that already exist,
 *  so this stays empty until Remi supplies real URLs. */
export const SOCIALS: { label: string; href: string }[] = []

/** True while a value is still an unfilled [placeholder]. */
export const isPlaceholder = (value: string) => /^\[.*\]$/.test(value.trim())
