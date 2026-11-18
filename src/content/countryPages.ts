import { LOCAL_PRICES_CONFIRMED, type CurrencyId } from './prices'

/**
 * Country pages (brief, Fix 14): one template, one entry per country. All pages
 * live on bloomabroad.ie, there are no separate country websites.
 *
 * Nigeria is built. Kenya (Q2-Q3 2027) and Ghana (once partnerships begin) are
 * added here as new entries, with their own local guides, when they are due.
 */
export type CountryConfig = {
  slug: string
  name: string
  /** "Nigerian" in "Why Nigerian students check first". */
  demonym: string
  currency: Exclude<CurrencyId, 'eur'>
  /** "naira" in "Priced in naira". */
  currencyName: string
  /** Only where it is true of the founder. Remi is from Nigeria. */
  founderLine?: string
}

export const NIGERIA: CountryConfig = {
  slug: 'nigeria',
  name: 'Nigeria',
  demonym: 'Nigerian',
  currency: 'ngn',
  currencyName: 'naira',
  founderLine:
    'BloomAbroad was founded by Remi Kolawole, from Nigeria and living in Ireland for over two decades, who has spent more than ten years supporting students applying to study in Ireland.',
}

/** Until Stripe is confirmed to charge in the local currency, say so (brief, Fix 14). */
export const approx = LOCAL_PRICES_CONFIRMED ? '' : 'approximately '

export const countryTitle = (c: CountryConfig) =>
  `Study in Ireland from ${c.name}: Readiness Check | BloomAbroad`

export const countryDescription = (c: CountryConfig) =>
  `Studying in Ireland from ${c.name}? Check your application and immigration readiness before you apply. Priced in ${c.currencyName}, every result reviewed by a consultant.`

export const countryH1 = (c: CountryConfig) =>
  `Studying in Ireland from ${c.name}? Know where you stand before you apply`
