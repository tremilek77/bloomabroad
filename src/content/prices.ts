/**
 * Prices, in one place. They appear on /pricing, in the FAQs, on /nigeria and
 * at checkout, so a change here updates all of them and none can drift.
 *
 * Source: brief Fix 8. Local prices are set in advance, rounded, and reviewed
 * quarterly or when a currency moves more than about 10%.
 * If Stripe cannot charge in NGN, KES or GHS, show local prices as
 * "approximate" and charge in euro (brief, question 6).
 */
export type Money = { eur: number; ngn: number; kes: number; ghs: number }

export const PRICES = {
  assessment: { eur: 30, ngn: 49000, kes: 4200, ghs: 380 },
  plus: { eur: 65, ngn: 99000, kes: 9000, ghs: 800 },
  foundingAssessment: { eur: 18, ngn: 29000, kes: 2500, ghs: 230 },
  foundingPlus: { eur: 39, ngn: 59000, kes: 5400, ghs: 480 },
} as const satisfies Record<string, Money>

/** How many people get the founding price (a discount code with 100 uses). */
export const FOUNDING_PLACES = 100

const nf = (n: number) => n.toLocaleString('en-US')

export const fmt = {
  eur: (m: Money) => `€${m.eur}`,
  ngn: (m: Money) => `₦${nf(m.ngn)}`,
  kes: (m: Money) => `KSh ${nf(m.kes)}`,
  ghs: (m: Money) => `GH₵ ${nf(m.ghs)}`,
  /** "€30 (₦49,000 · KSh 4,200 · GH₵ 380)" */
  all: (m: Money) =>
    `€${m.eur} (₦${nf(m.ngn)} · KSh ${nf(m.kes)} · GH₵ ${nf(m.ghs)})`,
}

export type CurrencyId = 'eur' | 'ngn' | 'kes' | 'ghs'

export const CURRENCIES: { id: CurrencyId; label: string; country: string }[] = [
  { id: 'eur', label: '€ Euro', country: 'Ireland' },
  { id: 'ngn', label: '₦ Naira', country: 'Nigeria' },
  { id: 'kes', label: 'KSh Shillings', country: 'Kenya' },
  { id: 'ghs', label: 'GH₵ Cedis', country: 'Ghana' },
]

/** One price in one currency, e.g. money(PRICES.assessment, 'ngn') -> "₦49,000". */
export const money = (m: Money, cur: CurrencyId) => fmt[cur](m)

/**
 * Whether Stripe has been confirmed to charge in naira, shillings and cedis
 * (brief, developer question 6). Until it has, /pricing says local prices are
 * approximate and that checkout is in euro. Flip to true once confirmed.
 */
export const LOCAL_PRICES_CONFIRMED = false
