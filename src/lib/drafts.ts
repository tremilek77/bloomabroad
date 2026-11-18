/**
 * Whether unfinished pages (drafts) are visible: always in dev, and on builds
 * made with VITE_SHOW_DRAFTS=1 (Vercel Preview deployments). Never on the
 * production site. Guides and /about use it.
 */
export const SHOW_DRAFTS: boolean =
  import.meta.env.DEV || import.meta.env.VITE_SHOW_DRAFTS === '1'
