import { PRICES, fmt } from './prices'
import { READY } from './site'

/**
 * FAQs by audience (brief Fix 10, tightened in docs/copy-deck.md section 8).
 * Answers are plain strings so the same text feeds the page and its FAQPage
 * schema. Each answer leads with the answer itself.
 *
 * `visible` is how many show before "More questions".
 */
export type Faq = {
  q: string
  a: string
  /** Optional link shown after the answer. Omitted automatically if its page isn't built. */
  link?: { label: string; to: string; when?: boolean }
}

export const ANSWER_STUDENTS =
  'BloomAbroad is an independent readiness check for students planning to study in Ireland. It looks at your application readiness and your immigration readiness, and an experienced consultant reviews every result. You find out where you stand before you apply, so you can spend your time and money wisely.'

export const ANSWER_UNIVERSITIES =
  'BloomAbroad is an enrolment readiness screening platform for international applications. It will assess applications your office has already received: whether each file is complete enough to assess, and whether the applicant is positioned to progress to enrolment. Admissions decisions stay entirely with your institution.'

export const STUDENT_FAQS: Faq[] = [
  { q: 'What is BloomAbroad?', a: ANSWER_STUDENTS },
  {
    q: 'What does the assessment look at?',
    a: 'Your application readiness and immigration readiness together: qualifications, course choice, English, documents and how they fit. Not just your grades.',
  },
  {
    q: 'How long does it take?',
    a: 'Answer a short questionnaire and upload your documents. You get your outcome within 5 working days.',
  },
  {
    q: 'How much does it cost?',
    a: `The Readiness Assessment is ${fmt.all(PRICES.assessment)}. The first 100 waitlist members pay a founding price.`,
    link: { label: 'See pricing', to: '/pricing', when: READY.pricing },
  },
  {
    q: "Does a good outcome mean I'll get in?",
    a: "No one can promise that. Universities decide on admission, and Ireland's immigration authorities decide on visa and immigration matters. BloomAbroad helps you apply knowing where you stand.",
  },
  {
    q: 'Are you an agent? Will you apply for me?',
    a: "No. We don't apply for you, we don't send you to any institution and we take no commission from anyone.",
  },
  {
    q: 'What will I need to upload?',
    a: "Usually your passport, academic certificates and transcripts, and English test results if you have them. We tell you exactly what's needed when you start.",
  },
  {
    q: "I'm under 18. Can I use BloomAbroad?",
    a: "Yes, with a parent or guardian's OK. We check with them before we contact you or start your assessment.",
  },
  {
    q: 'Is my information safe?',
    a: "We use it only to run your assessment, we never sell it, and we don't share it with universities or agents unless you ask.",
    link: { label: 'Read our Privacy Notice', to: '/privacy' },
  },
]

export const PARENT_FAQS: Faq[] = [
  {
    q: 'Why pay when some agents give free advice?',
    // [NEED: Remi to confirm "often"]. The brief says "usually".
    a: 'Advice that is free to you is often paid for by universities through commission. BloomAbroad takes no commission from anyone, so our only job is an honest view, even when the answer is "not yet". For about €30, it can save a family far larger costs.',
  },
  {
    q: 'Can I pay for my child or someone I sponsor?',
    a: 'Yes, through our secure checkout on bloomabroad.ie. We never take payment by bank transfer to a personal account.',
  },
  {
    q: 'Will I see the outcome?',
    a: "Every outcome includes a summary for parents and sponsors. If the student is 18 or over, they choose whether to share it. If under 18, we ask you to confirm before the assessment starts and we share the summary with you.",
  },
  {
    q: 'How do I know BloomAbroad is genuine?',
    a: 'BloomAbroad is a trading name of Ubisphere Ltd, registered in Ireland and based in Cork. Our only websites are bloomabroad.ie and bloomabroad.ai, and our prices are public.',
    link: { label: "How to verify it's really us", to: '/verify', when: READY.verify },
  },
  {
    q: 'What if the outcome is "Not Yet in a Position to Apply"?',
    a: "It's better to know before money is spent. The outcome explains why and what would need to change, so you can plan the next step together.",
  },
  {
    q: 'Can you help with proof of funds?',
    a: 'No. We don\'t prepare, source or advise on financial documents, and we never ask for money to "show funds". Be cautious of anyone who offers. Check irishimmigration.ie.',
  },
]

export const UNIVERSITY_FAQS: Faq[] = [
  { q: 'What is BloomAbroad?', a: ANSWER_UNIVERSITIES },
  {
    q: 'How will it fit our workflow?',
    a: 'Partner institutions will have a secure login. Your team uploads applications already received, the platform flags what is missing, you send applicants a secure assessment link, review the readiness report, and decide.',
  },
  {
    q: 'Does BloomAbroad make admissions decisions?',
    a: "No. Admissions decisions stay entirely with your institution. Visa and immigration decisions rest with Ireland's immigration authorities.",
  },
  {
    q: 'What is the assessment based on?',
    a: 'A methodology designed by Dr Olaniyi Kolawole and built on more than ten years of documented student journeys. The criteria were developed with input from international student directors at eight Irish universities and colleges.',
  },
  {
    q: 'How are findings validated?',
    a: 'Every assessment applies the same methodology and records its reasoning so it can be audited. During the pilot, an experienced consultant reviews every result before it reaches your team.',
  },
  {
    q: 'Can it be tailored to our institution?',
    a: 'The workspace is being designed so timelines, documents and criteria can be configured within a standard readiness framework. Pilot partners help decide which settings matter most.',
  },
  {
    q: 'Are you a marketplace or recruitment agent?',
    a: "No. We don't source, refer or send applicants to institutions, and we take no commission. We work only on applications your office has already received.",
  },
  {
    q: 'Is the student assessment connected to our applications?',
    a: "No. The student self-assessment is separate and independent. We don't share it with institutions unless the student asks.",
  },
  {
    q: 'What does it cost, and how do we take part?',
    a: "We are inviting a small cohort of Irish institutions to test BloomAbroad first. Terms are agreed individually.",
  },
]

/** The applicant-data FAQ. The brief says publish it only once the EU storage
 *  region is confirmed, so the university page adds it only when
 *  COMPANY.dataRegion is no longer a [placeholder]. */
export const UNIVERSITY_DATA_FAQ: Faq = {
  q: 'How is applicant data handled?',
  a: 'In line with GDPR, stored securely in the EU, with a data processing agreement signed before any applications are shared.',
}
