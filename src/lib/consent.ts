// Cookie consent state.
//
// Two categories: Essential (always on) and Marketing (off until the visitor
// agrees). The choice is remembered in ONE first-party cookie for 6 months,
// after which the banner asks again. Every choice is also logged (with a
// date) so we can show when and what someone agreed to.
//
// Marketing scripts (a future Meta or TikTok pixel) must NEVER be added to
// the page directly. Register them with `registerMarketingScript()` below —
// they only run once the visitor has agreed.

import { supabase } from './supabase'

export const CONSENT_COOKIE = 'ba_cookie_consent'
/** Bump this if the banner wording or categories change, so the log shows
 *  which version a visitor agreed to. */
export const CONSENT_VERSION = '1'
/** Ask again after at most 6 months. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 182

export type Consent = {
  v: string
  /** Random id that ties log rows to one browser. Carries no personal data. */
  id: string
  marketing: boolean
  /** ISO timestamp of the choice. */
  ts: string
}

export type ConsentAction = 'accept_all' | 'reject_all' | 'save_choices'

const OPEN_EVENT = 'ba:open-cookie-settings'
const CHANGE_EVENT = 'ba:consent-changed'

function newId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

/** The saved choice, or null if there is none or it has expired. */
export function readConsent(): Consent | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
  if (!match) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(match.slice(CONSENT_COOKIE.length + 1)))
    if (
      typeof parsed?.marketing !== 'boolean' ||
      typeof parsed?.ts !== 'string' ||
      typeof parsed?.id !== 'string'
    ) {
      return null
    }
    // Belt and braces: the cookie's own Max-Age should already have removed
    // it, but never trust a choice older than 6 months.
    const ageSeconds = (Date.now() - new Date(parsed.ts).getTime()) / 1000
    if (!(ageSeconds < MAX_AGE_SECONDS)) return null
    return parsed as Consent
  } catch {
    return null
  }
}

/** Save a choice, tell the rest of the page, and log it. */
export function saveConsent(marketing: boolean, action: ConsentAction): Consent {
  const consent: Consent = {
    v: CONSENT_VERSION,
    id: readConsent()?.id ?? newId(),
    marketing,
    ts: new Date().toISOString(),
  }
  const secure = window.location.protocol === 'https:' ? '; Secure' : ''
  document.cookie =
    `${CONSENT_COOKIE}=${encodeURIComponent(JSON.stringify(consent))}` +
    `; Max-Age=${MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`

  window.dispatchEvent(new Event(CHANGE_EVENT))
  void logConsent(consent, action)
  return consent
}

/** Record the choice with its date. Never blocks or breaks the page. */
async function logConsent(consent: Consent, action: ConsentAction) {
  if (!supabase) return
  try {
    await supabase.from('consent_log').insert({
      consent_id: consent.id,
      action,
      marketing: consent.marketing,
      banner_version: consent.v,
      page: window.location.pathname,
    })
  } catch {
    /* logging must never get in the visitor's way */
  }
}

export function hasMarketingConsent(): boolean {
  return readConsent()?.marketing === true
}

/** Footer "Cookie settings" link → reopens the preferences panel. */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT))
}

export function onOpenCookieSettings(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler)
  return () => window.removeEventListener(OPEN_EVENT, handler)
}

export function onConsentChange(handler: () => void) {
  window.addEventListener(CHANGE_EVENT, handler)
  return () => window.removeEventListener(CHANGE_EVENT, handler)
}

/* ---------------------- marketing-script registry ---------------------- */

const pending: Array<() => void> = []
let marketingStarted = false

/** Run `load` only once the visitor has agreed to Marketing cookies. If they
 *  already have, it runs straight away; if they never do, it never runs. */
export function registerMarketingScript(load: () => void) {
  if (hasMarketingConsent()) {
    load()
  } else {
    pending.push(load)
  }
}

if (typeof window !== 'undefined') {
  onConsentChange(() => {
    if (hasMarketingConsent() && !marketingStarted) {
      marketingStarted = true
      pending.splice(0).forEach((load) => load())
    }
  })
}
