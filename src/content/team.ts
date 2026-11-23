import { FOUNDER, METHODOLOGY_ADVISER } from './site'

/**
 * The people on /about. The bio text is the brief's (Fix 7), shortened for the
 * page; the longer part sits behind "background".
 *
 * PHOTOS: set `photo` to a file in /public (for example '/team/remi.jpg') once
 * the person has chosen a photo and agreed to it. Until then the page shows
 * their initials. Dr Kolawole's photo and bio need his permission first.
 */
export type Person = {
  id: 'remi' | 'olaniyi'
  name: string
  role: string
  initials: string
  photo: string | null
  /** Describes the photo for screen readers once there is one. */
  photoAlt: string
  summary: string
  background: string[]
  quote?: string
}

export const PEOPLE: Person[] = [
  {
    id: 'remi',
    name: FOUNDER.name,
    role: FOUNDER.title,
    initials: 'RK',
    photo: null,
    photoAlt: `${FOUNDER.name}, ${FOUNDER.title} of BloomAbroad`,
    summary:
      "From Nigeria, in Ireland for over two decades, and a graduate of Irish study herself. For over ten years she co-founded and led Solid-Link Consulting, which supported around 500 students, most applying to study in Ireland. She kept seeing capable students learn they weren't ready only after the fees were paid and the months had passed. BloomAbroad is her answer.",
    background: [
      'Before and alongside international education, Remi worked in Cork as a software quality analyst for multinationals and small businesses, and in programme management, business analysis and digital transformation.',
      "That experience shapes how BloomAbroad works: every assessment follows a consistent, tested process, and every result is checked before it's issued.",
    ],
    quote:
      "Every student deserves to know where they stand before they apply. That's what BloomAbroad is for.",
  },
  {
    id: 'olaniyi',
    name: METHODOLOGY_ADVISER.name,
    role: METHODOLOGY_ADVISER.title,
    initials: 'OK',
    photo: null,
    photoAlt: `${METHODOLOGY_ADVISER.name}, ${METHODOLOGY_ADVISER.title} at BloomAbroad`,
    summary:
      "Designed BloomAbroad's readiness methodology. PhD in social science (migration and diversity) and a master's in migration and diaspora studies, both from University College Cork, where he has lectured. Co-founder of Solid-Link Consulting, whose documented student journeys informed the readiness scenarios.",
    background: [
      'Having studied and lived in Ireland for more than two decades, he brings both research and lived experience to understanding the journey international students make.',
      'A conference speaker, he advises on international education and global mobility, and brings expertise in equality, diversity and inclusion developed through research and practice.',
    ],
  },
]
