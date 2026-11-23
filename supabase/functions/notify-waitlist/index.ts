// Supabase Edge Function (Deno) — runs when the waitlist table changes.
//
// On a new signup (INSERT) it:
//   1. emails the ADMIN an alert, and
//   2. emails the APPLICANT their auto-response:
//        - University         → registration + discovery-call email (signed by Remi Kolawole)
//        - Student (18+)      → "you're on the waitlist"
//        - Parent / sponsor   → "you're on the waitlist"
//        - Student UNDER 18   → NOTHING to the student. Their parent/guardian gets
//                               a confirmation request instead.
//        - Joined via the free checklist (tag "checklist") → their personal
//                               Ireland Readiness Checklist instead of the
//                               generic welcome. The items are recomputed HERE
//                               from the saved answers, never taken from the
//                               row, so nobody can get their own text emailed
//                               from our domain.
// When a parent confirms (UPDATE: parent_confirmed_at goes from empty to set),
// the under-18 student gets their normal email (the checklist, if that is how
// they joined).
//
// All via Resend, server-side, so the API key stays secret. Triggered by a
// Database Webhook on public.waitlist for BOTH Insert and Update events
// (see docs/p0-setup.md). Not part of the Vite build.
//
// Secrets (set with `supabase secrets set ...`):
//   RESEND_API_KEY    — from resend.com
//   NOTIFY_TO         — where the admin alert lands. One address, or a
//                       comma-separated list to alert several inboxes.
//   NOTIFY_FROM       — verified sender, e.g. "BloomAbroad <hello@bloomabroad.ie>"
//   WEBHOOK_SECRET    — shared secret; webhook sends it as x-webhook-secret
//   SITE_URL          — where the parent's confirmation link points
//                       (default https://bloomabroad.vercel.app)
//   SEND_CONFIRMATION — set to "false" to disable applicant emails
//   BOOKING_LINK      — 30-min call URL for the UNIVERSITY auto-response.
//                       If unset, that email simply omits the booking button.

// @ts-nocheck  (Deno runtime globals aren't in the app's TS project)

// Shared with the website: questions, options and rules for the checklist.
import checklistRules from '../_shared/checklist.json' with { type: 'json' }

interface WaitlistRecord {
  id: string
  name: string
  email: string
  role: 'University' | 'Student' | 'Parent'
  org: string | null
  job_title: string | null
  whatsapp: string | null
  country: string | null
  supporting: string | null
  study_level: string | null
  intended_start: string | null
  age_band: string | null
  parent_email: string | null
  parent_confirmation_token: string | null
  parent_confirmed_at: string | null
  tags: string[] | null
  checklist_answers: Record<string, string> | null
  created_at: string
}

interface WebhookPayload {
  type?: 'INSERT' | 'UPDATE' | 'DELETE'
  record?: WaitlistRecord
  old_record?: Partial<WaitlistRecord> | null
}

const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&quot;',
  )

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
// One address, or several separated by commas (e.g. "a@x.ie,b@x.ie").
const NOTIFY_TO = (Deno.env.get('NOTIFY_TO') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)
const NOTIFY_FROM =
  Deno.env.get('NOTIFY_FROM') ?? 'BloomAbroad <onboarding@resend.dev>'
const SEND_CONFIRMATION = Deno.env.get('SEND_CONFIRMATION') !== 'false'
const SITE_URL = (Deno.env.get('SITE_URL') ?? 'https://bloomabroad.vercel.app').replace(/\/$/, '')

async function sendEmail(msg: {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: Array.isArray(msg.to) ? msg.to : [msg.to],
      subject: msg.subject,
      html: msg.html,
      ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
    }),
  })
  if (!res.ok) {
    const detail = await res.text()
    throw new Error(`${res.status} ${detail}`)
  }
}

/* ------------------------------- admin alert -------------------------- */

const SHELL = (inner: string) => `
  <div style="font-family:Inter,Arial,sans-serif;background:#0f1210;padding:32px;color:#e9efe9">
    <div style="max-width:520px;margin:0 auto;background:#171b17;border:1px solid #2a2f2a;border-radius:16px;overflow:hidden">
      <div style="height:4px;background:linear-gradient(90deg,#a3e635,#65a30d)"></div>
      <div style="padding:28px">${inner}</div>
    </div>
    <p style="max-width:520px;margin:16px auto 0;text-align:center;font-size:12px;color:#6b756b">BloomAbroad · Enrolment readiness platform</p>
  </div>`

function adminHtml(rec: WaitlistRecord) {
  const when = new Date(rec.created_at).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  const underAge = rec.role === 'Student' && rec.age_band === 'Under 18'

  // Only show the fields that apply to this role and were filled in.
  const rows: [string, string | null][] = [
    ['Category', rec.role],
    ['Source', isChecklist(rec) ? 'Free checklist' : null],
    ['Email', rec.email],
    ['WhatsApp', rec.whatsapp],
    ['Country', rec.country],
    ['Institution', rec.org],
    ['Job title', rec.job_title],
    ['Supporting', rec.supporting],
    ['Study level', rec.study_level],
    ['Intended start', rec.intended_start],
    ['Age', rec.age_band],
    ['Parent email', rec.parent_email],
    ['Submitted', when],
  ]
  const html = rows
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) =>
      k === 'Email'
        ? `<tr><td style="padding:8px 0;color:#9aa79a;width:130px">${k}</td><td style="padding:8px 0"><a href="mailto:${esc(v!)}" style="color:#a3e635">${esc(v!)}</a></td></tr>`
        : `<tr><td style="padding:8px 0;color:#9aa79a;width:130px">${k}</td><td style="padding:8px 0;color:${k === 'Category' ? '#fff' : '#e9efe9'};${k === 'Category' ? 'font-weight:600' : ''}">${esc(v!)}</td></tr>`,
    )
    .join('')

  return SHELL(`
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#a3e635">New waitlist signup</p>
    <h1 style="margin:0 0 20px;font-size:22px;color:#fff">${esc(rec.name)} joined the waitlist</h1>
    ${underAge ? '<p style="margin:0 0 16px;padding:10px 12px;border-radius:8px;background:#2a2f2a;font-size:13px;color:#e9efe9">Under 18: we have emailed their parent or guardian for confirmation. The student gets no email until the parent confirms.</p>' : ''}
    <table style="width:100%;border-collapse:collapse;font-size:14px">${html}</table>`)
}

/* ---------------------- applicant auto-responses ---------------------- */
/* Light, table-based layout for email-client support. The same markup lives
   as standalone files in /emails for reuse in any other sending tool.

   Wording follows the brief: the product checks "application readiness and
   immigration readiness"; "visa" appears only when describing the problem. */

const MAIL_SHELL = (preheader: string, inner: string, footnote = FOOTNOTE) => `
<body style="margin:0;padding:0;background-color:#F1F5F3;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#F1F5F3;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;background-color:#FFFFFF;border-radius:14px;overflow:hidden;border:1px solid #E3EAE7;">
        <tr><td style="height:4px;background-color:#1D9E75;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:28px 36px 8px 36px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
            <td style="width:34px;height:34px;background-color:#E1F5EE;border-radius:8px;text-align:center;vertical-align:middle;font-family:Helvetica,Arial,sans-serif;font-size:12px;font-weight:bold;color:#085041;">BA</td>
            <td style="padding-left:10px;font-family:Helvetica,Arial,sans-serif;font-size:17px;font-weight:bold;color:#085041;">BloomAbroad</td>
          </tr></table>
        </td></tr>
        ${inner}
      </table>
      <p style="margin:16px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.6;color:#7C8A84;max-width:560px;">${footnote}</p>
    </td></tr>
  </table>
</body>`

/** Every applicant email ends with how to stop hearing from us (the privacy
 *  notice promises withdrawal of consent at any time by email). */
const FOOTNOTE =
  'You received this because you joined the BloomAbroad waitlist. Don\'t want these updates? Email <a href="mailto:privacy@bloomabroad.ie" style="color:#0F6E56;">privacy@bloomabroad.ie</a> and we\'ll remove you.'

const H2 = (t: string) =>
  `<h2 style="margin:0 0 8px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#085041;font-weight:bold;">${t}</h2>`
const P = (t: string, mb = 22) =>
  `<p style="margin:0 0 ${mb}px 0;">${t}</p>`

const firstName = (rec: WaitlistRecord) =>
  esc(rec.name.trim().split(/\s+/)[0] || 'there')

function universityHtml(rec: WaitlistRecord) {
  const first = firstName(rec)
  const booking = Deno.env.get('BOOKING_LINK') ?? ''
  const cta = booking
    ? `<tr><td style="padding:0 36px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="background-color:#085041;border-radius:999px;">
            <a href="${esc(booking)}" style="display:inline-block;padding:13px 26px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;color:#FFFFFF;text-decoration:none;">Book a 30-minute call</a>
          </td>
        </tr></table>
      </td></tr>`
    : ''

  return MAIL_SHELL(
    'Thank you for registering your interest in BloomAbroad.',
    `
    <tr><td style="padding:16px 36px 0 36px;">
      <p style="margin:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#1D9E75;font-weight:bold;">Registration confirmed</p>
      <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:24px;line-height:1.3;color:#12261F;font-weight:bold;">Your BloomAbroad registration is confirmed</h1>
    </td></tr>
    <tr><td style="padding:22px 36px 0 36px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#3C4B45;">
      ${P(`Dear ${first},`, 16)}
      ${P('Thank you for registering your interest in BloomAbroad.')}
      ${H2('What we are building')}
      ${P('BloomAbroad is an enrolment readiness screening platform for international applications. Institutions submit applications they have already received, and the platform assesses whether the file is complete enough to assess, and whether the applicant is positioned to meet immigration requirements and complete the course.')}
      ${H2('Why it matters')}
      ${P('Processing an international application that was never likely to convert carries a real cost — assessor time, administrative handling, and repeated correspondence. Where an offer is issued and the visa is not granted, the institution also loses the non-EU fee income and, late in the cycle, the opportunity to fill the place.', 12)}
      ${P('Screening earlier means that effort is directed toward applicants who can realistically enrol.')}
      ${H2('Our methodology')}
      ${P('The assessment draws on real application, admissions, and visa outcome data gathered over more than a decade of international student advisory work. Findings are validated by experienced consultants rather than issued automatically. Admissions decisions remain entirely with the institution.')}
      ${H2('A conversation before launch')}
      ${P('We are currently in development, beginning with Ireland, and are speaking with a small number of institutions as we finalise the platform. These conversations shape what we build, and they are also how we identify partners for our first pilots.', 16)}
    </td></tr>
    ${cta}
    <tr><td style="padding:20px 36px 0 36px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.65;color:#3C4B45;">
      ${P('We would want to understand how international applications move through your office at present, where the screening effort concentrates, and whether what we are building would fit that process.', 26)}
    </td></tr>
    <tr><td style="padding:0 36px 30px 36px;border-top:1px solid #E3EAE7;">
      <p style="margin:22px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#3C4B45;">Kind regards,</p>
      <p style="margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#12261F;"><strong>Remi Kolawole</strong><br /><span style="color:#5B6B65;font-size:14px;">Founder, BloomAbroad</span></p>
      <p style="margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;"><a href="https://bloomabroad.ie" style="color:#0F6E56;text-decoration:none;">bloomabroad.ie</a></p>
    </td></tr>`,
  )
}

/** Students (18+, or once a parent has confirmed) and parents/sponsors. */
function studentHtml(rec: WaitlistRecord) {
  const first = firstName(rec)
  return MAIL_SHELL(
    "You're on the BloomAbroad waitlist — here's what we're building, and why.",
    `
    <tr><td style="padding:16px 36px 0 36px;">
      <p style="margin:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#1D9E75;font-weight:bold;">You're on the list</p>
      <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:25px;line-height:1.3;color:#12261F;font-weight:bold;">You're on the BloomAbroad waitlist — welcome.</h1>
    </td></tr>
    <tr><td style="padding:22px 36px 0 36px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#3C4B45;">
      ${P(`Hi ${first},`, 18)}
      ${P("Here's the problem we're solving. Applying to study abroad takes real work — documents, transcripts, tests, fees, months of waiting. Plenty of students put all of it in on applications that were never likely to succeed. Others get the offer, then the visa is refused. Usually the gap was there from the start, and nobody spotted it.", 18)}
    </td></tr>
    <tr><td style="padding:4px 36px 0 36px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#E1F5EE;border-radius:10px;"><tr>
        <td style="padding:18px 20px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;color:#0F4A3A;">
          <strong style="color:#085041;">BloomAbroad is designed to spot it.</strong><br />
          It checks your <strong>application readiness</strong> (are you positioned to get an offer?) and your <strong>immigration readiness</strong> (are you positioned to meet immigration requirements?). Together that's your <strong>enrolment readiness</strong> — where you actually stand, before you commit your time, effort and money.
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:20px 36px 0 36px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#3C4B45;">
      ${P('The method comes from over a decade of advising international students, and every assessment is reviewed by a real consultant.', 18)}
      ${P("We're in development now, starting with Ireland. You'll hear from us first when we open.", 18)}
      ${P("In the meantime, add us to your contacts so our launch email doesn't land in spam.", 26)}
    </td></tr>
    <tr><td style="padding:0 36px 30px 36px;border-top:1px solid #E3EAE7;">
      <p style="margin:22px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#3C4B45;">Talk soon,</p>
      <p style="margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#12261F;"><strong>The BloomAbroad Team</strong><br /><em style="color:#0F6E56;font-size:14px;">Know where you stand before you apply.</em></p>
      <p style="margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;"><a href="https://bloomabroad.ie" style="color:#0F6E56;text-decoration:none;">bloomabroad.ie</a></p>
    </td></tr>`,
  )
}

/** Sent to the parent/guardian of an under-18 sign-up. NOTE: the wording of
 *  this email was drafted for the developer handover (the brief specifies the
 *  flow but not the copy) — have Remi approve it before it goes live. */
function parentConfirmHtml(rec: WaitlistRecord, link: string) {
  const student = firstName(rec)
  return MAIL_SHELL(
    `${student} has joined the BloomAbroad waitlist and needs your OK.`,
    `
    <tr><td style="padding:16px 36px 0 36px;">
      <p style="margin:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#1D9E75;font-weight:bold;">Parent or guardian confirmation</p>
      <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:24px;line-height:1.3;color:#12261F;font-weight:bold;">Please confirm ${student}'s place on the waitlist</h1>
    </td></tr>
    <tr><td style="padding:22px 36px 0 36px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#3C4B45;">
      ${P('Hello,', 16)}
      ${P(`${student} has joined the BloomAbroad waitlist and gave us your email address as their parent or guardian. Because they're under 18, we need your OK before we send them anything.`, 16)}
      ${P("BloomAbroad is an independent readiness check for students planning to study in Ireland. It shows a student where they stand before they apply. We're not an agent, we take no commission, and we never sell personal information.", 22)}
    </td></tr>
    <tr><td style="padding:0 36px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td style="background-color:#085041;border-radius:999px;">
          <a href="${esc(link)}" style="display:inline-block;padding:13px 26px;font-family:Helvetica,Arial,sans-serif;font-size:14px;font-weight:bold;color:#FFFFFF;text-decoration:none;">Yes, that's fine — confirm</a>
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:22px 36px 0 36px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:#3C4B45;">
      ${P(`If you don't recognise this, or you'd rather ${student} wasn't on the waitlist, just ignore this email and we won't contact them. To have their details removed, email <a href="mailto:privacy@bloomabroad.ie" style="color:#0F6E56;">privacy@bloomabroad.ie</a>.`, 26)}
    </td></tr>
    <tr><td style="padding:0 36px 30px 36px;border-top:1px solid #E3EAE7;">
      <p style="margin:22px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#3C4B45;">Kind regards,</p>
      <p style="margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#12261F;"><strong>The BloomAbroad Team</strong></p>
      <p style="margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;"><a href="https://bloomabroad.ie" style="color:#0F6E56;text-decoration:none;">bloomabroad.ie</a></p>
    </td></tr>`,
    'You received this because someone entered your email address as their parent or guardian on the BloomAbroad waitlist. Questions? Email <a href="mailto:privacy@bloomabroad.ie" style="color:#0F6E56;">privacy@bloomabroad.ie</a>.',
  )
}

/* ----------------------------- free checklist ------------------------- */

const isChecklist = (rec: WaitlistRecord) => Array.isArray(rec.tags) && rec.tags.includes('checklist')

/** Items for this person's answers. Only answers that match a known option
 *  count, so a hand-made row can't change what is emailed. */
function checklistItems(rec: WaitlistRecord): string[] {
  const given = rec.checklist_answers ?? {}
  const answers: Record<string, string> = {}
  for (const q of checklistRules.questions) {
    if (q.options?.includes(given[q.id])) answers[q.id] = given[q.id]
  }
  return checklistRules.items
    .filter((r) => !r.when || r.when.in.includes(answers[r.when.q] ?? ''))
    .map((r) => r.text)
}

function checklistHtml(rec: WaitlistRecord) {
  const first = firstName(rec)
  const items = checklistItems(rec)
    .map(
      (t) =>
        `<li style="margin:0 0 12px 0;padding-left:4px;">${esc(t)}</li>`,
    )
    .join('')
  return MAIL_SHELL(
    'Your personal checklist for studying in Ireland.',
    `
    <tr><td style="padding:16px 36px 0 36px;">
      <p style="margin:0 0 6px 0;font-family:Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:1.2px;text-transform:uppercase;color:#1D9E75;font-weight:bold;">Your checklist</p>
      <h1 style="margin:0;font-family:Helvetica,Arial,sans-serif;font-size:25px;line-height:1.3;color:#12261F;font-weight:bold;">Your Ireland Readiness Checklist</h1>
    </td></tr>
    <tr><td style="padding:22px 36px 0 36px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#3C4B45;">
      ${P(`Hi ${first},`, 14)}
      ${P("Here's what to prepare, based on your answers.", 14)}
      <ol style="margin:0 0 22px 0;padding-left:22px;">${items}</ol>
    </td></tr>
    <tr><td style="padding:4px 36px 0 36px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#E1F5EE;border-radius:10px;"><tr>
        <td style="padding:18px 20px;font-family:Helvetica,Arial,sans-serif;font-size:14px;line-height:1.65;color:#0F4A3A;">
          Your checklist shows what to prepare. The full BloomAbroad assessment tells you where you stand. It checks your application and immigration readiness, and an experienced consultant reviews every result. You're on the waitlist for our early 2027 launch.
        </td>
      </tr></table>
    </td></tr>
    <tr><td style="padding:18px 36px 0 36px;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.65;color:#5B6B65;">
      ${P("This checklist is general guidance based on your answers. It isn't an assessment, and it doesn't predict admission, visa or immigration decisions.", 26)}
    </td></tr>
    <tr><td style="padding:0 36px 30px 36px;border-top:1px solid #E3EAE7;">
      <p style="margin:22px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#3C4B45;">Talk soon,</p>
      <p style="margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#12261F;"><strong>The BloomAbroad Team</strong></p>
      <p style="margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;"><a href="https://bloomabroad.ie" style="color:#0F6E56;text-decoration:none;">bloomabroad.ie</a></p>
    </td></tr>`,
  )
}

/** What a student (or a parent-confirmed under-18) is sent once they may be emailed. */
const welcomeFor = (rec: WaitlistRecord) =>
  isChecklist(rec)
    ? { subject: 'Your Ireland Readiness Checklist', html: checklistHtml(rec) }
    : { subject: "You're on the waitlist", html: studentHtml(rec) }

/* -------------------------------- handler ----------------------------- */

Deno.serve(async (req) => {
  // 1. Verify the shared secret set on the webhook.
  const secret = Deno.env.get('WEBHOOK_SECRET')
  // Fail closed: the function is public (--no-verify-jwt), so without a secret
  // anyone could post a forged payload and make us email arbitrary addresses.
  if (!secret || req.headers.get('x-webhook-secret') !== secret) {
    return new Response('Unauthorized', { status: 401 })
  }

  // 2. Parse the webhook payload.
  let payload: WebhookPayload
  try {
    payload = await req.json()
  } catch {
    return new Response('Bad request', { status: 400 })
  }
  const rec = payload.record
  if (!rec?.email) return new Response('No record', { status: 200 })

  if (!RESEND_API_KEY || NOTIFY_TO.length === 0) {
    return new Response('Missing RESEND_API_KEY or NOTIFY_TO', { status: 500 })
  }

  // 3a. UPDATE: only act when a parent has just confirmed an under-18 sign-up.
  //     The student now gets the normal waitlist email.
  if (payload.type === 'UPDATE') {
    const justConfirmed =
      Boolean(rec.parent_confirmed_at) && !payload.old_record?.parent_confirmed_at
    if (justConfirmed && SEND_CONFIRMATION) {
      try {
        await sendEmail({ to: rec.email, ...welcomeFor(rec) })
      } catch (e) {
        console.error('Post-confirmation email failed (non-fatal):', e)
      }
    }
    return new Response('ok', { status: 200 })
  }

  // Anything other than a new signup (e.g. a delete) needs no email.
  if (payload.type && payload.type !== 'INSERT') {
    return new Response('ignored', { status: 200 })
  }

  // 3b. INSERT — admin alert (primary: its failure is reported).
  try {
    await sendEmail({
      to: NOTIFY_TO,
      replyTo: rec.email,
      subject: `New ${rec.role} ${isChecklist(rec) ? 'checklist' : 'waitlist'} signup: ${rec.name}`,
      html: adminHtml(rec),
    })
  } catch (e) {
    console.error('Admin email failed:', e)
    return new Response(`Admin email failed: ${e}`, { status: 502 })
  }

  // 4. Applicant auto-response (best-effort — never blocks the signup).
  if (SEND_CONFIRMATION) {
    const underAge = rec.role === 'Student' && rec.age_band === 'Under 18'
    try {
      if (underAge) {
        // Nothing goes to the student until their parent/guardian confirms.
        if (rec.parent_email && rec.parent_confirmation_token) {
          const link = `${SITE_URL}/confirm?token=${encodeURIComponent(rec.parent_confirmation_token)}`
          await sendEmail({
            to: rec.parent_email,
            subject: `Please confirm ${rec.name.trim().split(/\s+/)[0]}'s place on the BloomAbroad waitlist`,
            html: parentConfirmHtml(rec, link),
          })
        }
      } else if (rec.role === 'University') {
        await sendEmail({
          to: rec.email,
          subject: 'Your BloomAbroad registration is confirmed',
          html: universityHtml(rec),
        })
      } else {
        await sendEmail({ to: rec.email, ...welcomeFor(rec) })
      }
    } catch (e) {
      console.error('Applicant email failed (non-fatal):', e)
    }
  }

  return new Response('ok', { status: 200 })
})
