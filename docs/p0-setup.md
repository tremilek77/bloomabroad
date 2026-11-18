# P0 compliance release: setup & go-live checklist

Branch: `p0-compliance`. The pre-change site is preserved two ways:

- **Git tag `pre-p0-backup`** (pushed): the exact code that was live before this work.
- **`/old`** on the site: a frozen, noindexed copy of the previous landing page
  (its waitlist form is replaced with a notice because the old form had no consent box).

## Order matters

Do these **in this order**, otherwise the new form will fail to save.

### 1. Run the database migration (Supabase SQL Editor)

Paste and run `supabase/migrations/20261118000000_p0_waitlist_consent.sql`.
It is purely additive, so the currently-live site keeps working after it runs. It adds:

- `Parent` as a valid role, plus the new waitlist columns (country, WhatsApp, job title,
  supporting, study level, intended start, age band, parent email, consent text/time,
  parent confirmation token/time)
- `confirm_parent(uuid)`, the function behind the `/confirm` page
- `consent_log`, the dated record of cookie-banner choices

### 1b. Run the second migration (free checklist)

Also in the SQL Editor, **after the first one and before the site deploys**:
`supabase/migrations/20261119000000_checklist.sql`. It adds a `tags` column and the checklist
answers. It is additive, so the current live site keeps working either way.

### 2. Deploy the updated Edge Function

```bash
supabase functions deploy notify-waitlist --no-verify-jwt
```

New secret (the others are unchanged):

```bash
supabase secrets set SITE_URL=https://bloomabroad.vercel.app
```

`NOTIFY_TO` can still be several comma-separated addresses.
The function now also sends the personal checklist email, and it reads
`supabase/functions/_shared/checklist.json`, so deploy it from the project root (the CLI bundles that file).
Change `SITE_URL` to `https://bloomabroad.ie` when the domain is live: it is where
the parent's confirmation link points.

### 3. Database webhook must cover Insert **and** Update

Supabase → Database → Webhooks → the `waitlist` webhook → tick **Insert** and **Update**
(table `public.waitlist`, header `x-webhook-secret`). Update is what sends the student
their email after a parent confirms. Without it, under-18 students never get one.

### 4. Merge `p0-compliance` → `main`

Vercel deploys `main` automatically. The build prints a warning listing any unfilled placeholders.

### 5. Turn on Vercel Web Analytics

Vercel dashboard → the project → Analytics → Enable. The code is already in. It sets no
cookies, so it needs no consent. It's skipped on localhost and on `/admin`.

## Placeholders to fill in: `src/lib/company.ts`

| Field | Needed from | Shows up on |
|---|---|---|
| `croNumber` | Remi | Privacy, Terms, Contact, footer |
| `registeredOffice` | Remi | Privacy, Terms, Contact, footer |
| `whatsappNumber` | Remi | Contact |
| `dataRegion` | Supabase project region | Privacy |
| `whatsappChannel` | Remi (or remove the line if there is no channel) | /verify |
| `BOOKING_URL` | Remi (30-min call link) | Contact; also the `BOOKING_LINK` secret for the university email |
| `SOCIALS` | Remi | Footer (hidden until filled) |
| `legalLastUpdated` | set to the actual publish date | Privacy, Terms |

Retention defaults I used (**confirm with Remi**): waitlist 24 months, assessment data 2 years.

Unfilled placeholders appear as highlighted `[brackets]` on the page, so they can't be missed.

## Mailboxes (client task)

`hello@bloomabroad.ie` (general) and `privacy@bloomabroad.ie` (data requests) must exist
and be monitored before launch. Both are linked from the legal pages and emails.

## Needs Remi's approval

- Parent-confirmation email and `/confirm` page wording (the brief specifies the flow, not the copy):
  `emails/parent-confirmation.html`, `src/pages/ConfirmParent.tsx`
- Student/University email wording changes: "visa readiness" → "immigration readiness";
  the university email is now signed "Remi Kolawole, Founder"
- Consent is required to submit the form (the brief says never pre-ticked; I made ticking mandatory)
- `ba-theme` (light/dark preference) is listed as an Essential cookie on `/cookies`: a judgement call

## Hidden until the pages exist

Footer links to About, Pricing and Verify, and the founder-line link, are switched off
(`ready: false` in `Footer.tsx`, `FOUNDER_HREF` in `Platform.tsx`). Flip them when the pages ship.

## Testing without touching the live database

A local `.env` contains the live Supabase credentials. To test the form without writing
real rows, build with them blanked. The form then saves to browser storage only:

```bash
VITE_SUPABASE_URL= VITE_SUPABASE_ANON_KEY= npm run build
npm run preview
```
