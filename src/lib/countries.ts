/**
 * The grouped country list from the brief (Fix 1). Use this same list
 * wherever a country field appears — the waitlist form now, the free
 * Ireland Readiness Checklist and country pages later.
 */
export const COUNTRY_GROUPS: { label: string; countries: string[] }[] = [
  {
    label: 'West Africa',
    countries: [
      'Nigeria',
      'Ghana',
      'Sierra Leone',
      'Liberia',
      'The Gambia',
      'Cameroon',
      'Senegal',
      "Côte d'Ivoire",
      'Togo',
      'Benin',
    ],
  },
  {
    label: 'East Africa',
    countries: ['Kenya', 'Uganda', 'Tanzania', 'Rwanda', 'Ethiopia'],
  },
  {
    label: 'Southern Africa',
    countries: ['South Africa', 'Zimbabwe', 'Zambia', 'Botswana', 'Malawi'],
  },
]

/** Choosing this opens a text box: "Please tell us which country". */
export const OTHER_COUNTRY = 'Other'
