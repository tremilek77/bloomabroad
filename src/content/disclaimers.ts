/**
 * The disclaimer in the brief's three lengths (Fix 9). The wording is final
 * text from the brief, so change it there first.
 *
 *   short     homepage trust area, /students, free checklist results
 *   standard  /pricing, checkout, /universities
 *   report    the bottom of every outcome report on bloomabroad.ai
 */
export const DISCLAIMER = {
  short:
    "BloomAbroad shows you where you stand. It doesn't make admission, visa or immigration decisions, and no one can guarantee those.",

  standardTitle: 'About your outcome',
  standard:
    "A BloomAbroad outcome is our independent view of your readiness, based on the information you provide and reviewed by an experienced consultant. It is not an admission decision, a visa or immigration decision, or legal advice, and it doesn't guarantee any outcome. Universities make admission decisions, and Ireland's immigration authorities make all visa and immigration decisions. Always check official guidance at irishimmigration.ie, and only apply through official channels.",

  reportTitle: 'Important',
  report:
    'This outcome reflects our assessment of the information and documents you provided on [date], reviewed by [consultant name]. If your circumstances or documents change, your readiness may change too. This outcome is not an admission, visa or immigration decision, and it is not legal advice. Decisions rest solely with universities and Ireland\'s immigration authorities. For official requirements, visit irishimmigration.ie.',
} as const

export const OFFICIAL_IMMIGRATION_URL = 'https://www.irishimmigration.ie'
