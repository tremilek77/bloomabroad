import rules from '../../supabase/functions/_shared/checklist.json'

/**
 * Ireland Readiness Checklist (brief, Fix 6b). The questions, options and
 * rules live in one JSON file that the website and the email function both
 * read, so the checklist on screen and the one emailed can never differ.
 */
export type Question = {
  id: string
  prompt: string
  /** Fixed answers. Questions without options use the country list instead. */
  options?: string[]
  type?: 'country'
}

export type Answers = Record<string, string>

export const QUESTIONS = rules.questions as Question[]

type Rule = { when?: { q: string; in: string[] }; text: string }

/** The items for a set of answers: the personal ones first, then the ones everyone gets. */
export function buildChecklist(answers: Answers): string[] {
  return (rules.items as Rule[])
    .filter((r) => !r.when || r.when.in.includes(answers[r.when.q] ?? ''))
    .map((r) => r.text)
}
