/**
 * What exists yet. Links to pages that aren't built are hidden, so nothing on
 * the site ever points at a dead page. Flip a flag to `true` in the same PR
 * that ships the page.
 */
export const READY = {
  about: false, // Gate B item 8: needs photos and bios (Olaniyi's permission)
  pricing: false, // Gate B item 9
  verify: false, // Gate B item 7
  checklist: false, // Gate B item 5: the free Ireland Readiness Checklist
  sample: false, // Gate C: watermarked sample outcome report
  video: false, // Gate C: 60-second walkthrough
} as const

/** Founder name and title, used in copy, schema and emails. */
export const FOUNDER = {
  name: 'Remi Kolawole',
  title: 'Founder',
} as const

export const METHODOLOGY_ADVISER = {
  name: 'Dr Olaniyi Kolawole',
  title: 'Methodology Adviser',
} as const
