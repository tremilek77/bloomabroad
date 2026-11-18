import { useEffect } from 'react'
import { COMPANY, SITE_URL, SOCIALS } from './company'
import { FOUNDER } from '@/content/site'
import type { Faq } from '@/content/faqs'

/**
 * JSON-LD builders. Rules (schema skill): markup must match what's visible on
 * the page, use fully qualified URLs and ISO dates, and sit in one @graph.
 * The prerender captures the live DOM, so whatever is injected here is baked
 * into each page's static HTML.
 */

export const ORG_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const FOUNDER_ID = `${SITE_URL}/#founder`

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: COMPANY.tradingName,
    legalName: COMPANY.legalName,
    url: `${SITE_URL}/`,
    description:
      'BloomAbroad is an independent enrolment readiness check for studying in Ireland. It assesses application readiness and immigration readiness, and an experienced consultant reviews every result.',
    email: COMPANY.helloEmail,
    address: { '@type': 'PostalAddress', addressLocality: 'Cork', addressCountry: 'IE' },
    founder: { '@id': FOUNDER_ID },
    // Only accounts that exist (brief, Fix 4). Empty until Remi supplies them.
    ...(SOCIALS.length ? { sameAs: SOCIALS.map((s) => s.href) } : {}),
  }
}

export function founderNode() {
  return {
    '@type': 'Person',
    '@id': FOUNDER_ID,
    name: FOUNDER.name,
    jobTitle: FOUNDER.title,
    worksFor: { '@id': ORG_ID },
  }
}

export function websiteNode() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: COMPANY.tradingName,
    url: `${SITE_URL}/`,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en-IE',
  }
}

/** FAQPage for the questions visible on the page. */
export function faqNode(path: string, items: Faq[]) {
  return {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}${path}#faq`,
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function webPageNode(path: string, name: string, description: string) {
  return {
    '@type': 'WebPage',
    '@id': `${SITE_URL}${path === '/' ? '/' : path}#webpage`,
    url: `${SITE_URL}${path === '/' ? '/' : path}`,
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    about: { '@id': ORG_ID },
    inLanguage: 'en-IE',
  }
}

/**
 * Injects a <script type="application/ld+json"> into <head> while the calling
 * component is mounted. `key` keeps two scripts from clobbering each other.
 */
export function useSchema(key: string, nodes: object[]) {
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes })
  useEffect(() => {
    // The prerendered HTML already carries this block. Drop it so the page
    // never ends up with two copies once React takes over.
    document.head
      .querySelectorAll(`script[data-schema="${key}"]`)
      .forEach((old) => old.remove())
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.dataset.schema = key
    el.text = json
    document.head.appendChild(el)
    return () => el.remove()
  }, [key, json])
}
