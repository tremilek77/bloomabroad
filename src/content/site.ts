/**
 * What exists yet. Links to pages that aren't built are hidden, so nothing on
 * the site ever points at a dead page. Flip a flag to `true` in the same PR
 * that ships the page.
 */
export const READY = {
  // /about is built but hidden (404 on the live site) until this is true.
  // BEFORE flipping it: Dr Kolawole agrees to his bio and photo, both photos are in
  // /public/team and set in content/team.ts, and add the /about line to public/llms.txt.
  // This flag also controls whether Dr Kolawole is NAMED on /universities, /verify and
  // the FAQ. Until it is true those pages describe the methodology without naming him.
  about: false,
  pricing: true, // Gate B item 9
  verify: true, // Gate B item 7
  checklist: true, // Gate B item 5: the free Ireland Readiness Checklist
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
  /** Shown in every guide byline (brief, Fix 14). */
  credential: 'PhD, University College Cork',
} as const
