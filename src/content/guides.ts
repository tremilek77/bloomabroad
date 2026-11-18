import guidesMeta, { type GuideMeta } from 'virtual:guides-meta'

/**
 * The guides, from the markdown files in src/content/guides (see
 * scripts/lib/guides.mjs for the file format). Only published guides appear
 * on the live site; drafts appear in dev and on preview builds.
 */
export type Guide = GuideMeta

export const GUIDES: Guide[] = guidesMeta
export const hasGuides = GUIDES.length > 0
export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug)

export const AUDIENCE_LABEL: Record<Guide['audience'], string> = {
  students: 'For students and families',
  universities: 'For universities',
}

/** The line shown at the end of every visa guide (brief, Fix 14). */
export const VISA_DISCLAIMER =
  "BloomAbroad doesn't give visa advice or make visa decisions. Always check the official guidance."

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-IE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
