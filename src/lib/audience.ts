/**
 * Which side of BloomAbroad a page belongs to. Students and universities get
 * separate pages, separate navigation and separate forms, so nothing from one
 * side shows up while someone is on the other. The page they are on is the
 * choice: nothing is stored about it.
 *
 * `null` means a neutral page (home, legal, contact, guides hub), which offers
 * both.
 */
export type Audience = 'students' | 'universities'

const STUDENT_PATHS = ['/students', '/pricing', '/nigeria', '/checklist', '/verify']
const UNIVERSITY_PATHS = ['/universities']

export function audienceFor(pathname: string): Audience | null {
  if (UNIVERSITY_PATHS.includes(pathname)) return 'universities'
  if (STUDENT_PATHS.includes(pathname)) return 'students'
  return null
}

/** Pages that render their own waitlist form (or, on the homepage, the chooser). */
export const PAGES_WITH_FORM = ['/', '/students', '/universities', '/pricing', '/nigeria']
