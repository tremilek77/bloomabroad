// Supabase Edge Function (Deno) — on a new waitlist signup it:
//   1. emails YOU an admin alert, and
//   2. emails the APPLICANT a branded "you're on the list" confirmation.
// Both via Resend, server-side, so the API key stays secret.
//
// Triggered by a Database Webhook on INSERT into public.waitlist
// (see docs/email-notifications.md). Not part of the Vite build.
//
// Secrets (set with `supabase secrets set ...`):
//   RESEND_API_KEY    — from resend.com
//   NOTIFY_TO         — where the admin alert lands. One address, or a
//                       comma-separated list to alert several inboxes.
//   NOTIFY_FROM       — verified sender, e.g. "BloomAbroad <hello@yourdomain.com>"
//                       (defaults to Resend's test sender — see note below)
//   WEBHOOK_SECRET    — shared secret; webhook sends it as x-webhook-secret
//   SEND_CONFIRMATION — set to "false" to disable the applicant confirmation
//   BOOKING_LINK      — 30-min call URL for the UNIVERSITY auto-response.
//                       If unset, that email simply omits the booking button.
//
// NOTE: the applicant confirmation only reaches real inboxes once NOTIFY_FROM
// is a verified domain. Resend's test sender (onboarding@resend.dev) only
// delivers to your own account address.

// @ts-nocheck  (Deno runtime globals aren't in the app's TS project)

interface WaitlistRecord {
  id: string
  name: string
  email: string
  role: 'University' | 'Student'
  org: string | null
  created_at: string
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

/* ------------------------------- templates ---------------------------- */

const SHELL = (inner: string) => `
  <div style="font-family:Inter,Arial,sans-serif;background:#0f1210;padding:32px;color:#e9efe9">
    <div style="max-width:520px;margin:0 auto;background:#171b17;border:1px solid #2a2f2a;border-radius:16px;overflow:hidden">
      <div style="height:4px;background:linear-gradient(90deg,#a3e635,#65a30d)"></div>
      <div style="padding:28px">${inner}</div>
    </div>
    <p style="max-width:520px;margin:16px auto 0;text-align:center;font-size:12px;color:#6b756b">BloomAbroad · Enrolment readiness platform</p>
  </div>`

function adminHtml(rec: WaitlistRecord) {
  const org = rec.org && rec.org.trim() ? rec.org : '—'
  const when = new Date(rec.created_at).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
  return SHELL(`
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#a3e635">New waitlist signup</p>
    <h1 style="margin:0 0 20px;font-size:22px;color:#fff">${esc(rec.name)} joined the waitlist</h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#9aa79a;width:120px">Category</td><td style="padding:8px 0;color:#fff;font-weight:600">${esc(rec.role)}</td></tr>
      <tr><td style="padding:8px 0;color:#9aa79a">Email</td><td style="padding:8px 0"><a href="mailto:${esc(rec.email)}" style="color:#a3e635">${esc(rec.email)}</a></td></tr>
      <tr><td style="padding:8px 0;color:#9aa79a">Institution / Country of study</td><td style="padding:8px 0;color:#e9efe9">${esc(org)}</td></tr>
      <tr><td style="padding:8px 0;color:#9aa79a">Submitted</td><td style="padding:8px 0;color:#e9efe9">${esc(when)}</td></tr>
    </table>`)
}

/* ---------------------- applicant auto-responses ---------------------- */
/* Content supplied by the client ("Email for Universities/Students.docx").
   The same markup lives as standalone files in /emails for reuse in any
   other sending tool. Light, table-based layout for email-client support. */

const MAIL_SHELL = (preheader: string, inner: string) => `
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
    </td></tr>
  </table>
</body>`

const H2 = (t: string) =>
  `<h2 style="margin:0 0 8px 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;color:#085041;font-weight:bold;">${t}</h2>`
const P = (t: string, mb = 22) =>
  `<p style="margin:0 0 ${mb}px 0;">${t}</p>`

function universityHtml(rec: WaitlistRecord) {
  const first = esc(rec.name.trim().split(/\s+/)[0] || 'there')
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
      ${P('BloomAbroad is an enrolment readiness screening platform for international applications. Institutions submit applications they have already received, and the platform assesses whether the file is complete enough to assess, and whether the applicant is positioned to obtain a visa and complete the course.')}
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
      <p style="margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.5;color:#12261F;"><strong>Dr Niyi Kolawole</strong><br /><span style="color:#5B6B65;font-size:14px;">Co-Founder, BloomAbroad</span></p>
      <p style="margin:10px 0 0 0;font-family:Helvetica,Arial,sans-serif;font-size:14px;"><a href="https://bloomabroad.ie" style="color:#0F6E56;text-decoration:none;">bloomabroad.ie</a></p>
    </td></tr>`,
  )
}

function studentHtml(rec: WaitlistRecord) {
  const first = esc(rec.name.trim().split(/\s+/)[0] || 'there')
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
          It checks your <strong>application readiness</strong> (are you positioned to get an offer?) and your <strong>visa readiness</strong> (are you positioned to meet immigration requirements?). Together that's your <strong>enrolment readiness</strong> — where you actually stand, before you commit your time, effort and money.
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

/* -------------------------------- handler ----------------------------- */

Deno.serve(async (req) => {
  // 1. Verify the shared secret set on the webhook.
  const secret = Deno.env.get('WEBHOOK_SECRET')
  if (secret && req.headers.get('x-webhook-secret') !== secret) {
    return new Response('Unauthorized', { status: 401 })
  }

  // 2. Parse the webhook payload.
  let payload: { type?: string; record?: WaitlistRecord }
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

  // 3. Admin alert (primary — its failure is reported).
  try {
    await sendEmail({
      to: NOTIFY_TO,
      replyTo: rec.email,
      subject: `New ${rec.role} waitlist signup: ${rec.name}`,
      html: adminHtml(rec),
    })
  } catch (e) {
    console.error('Admin email failed:', e)
    return new Response(`Admin email failed: ${e}`, { status: 502 })
  }

  // 4. Applicant auto-response (best-effort — never blocks the signup).
  //    Content differs by category, per the client's supplied copy.
  if (SEND_CONFIRMATION) {
    const isUni = rec.role === 'University'
    try {
      await sendEmail({
        to: rec.email,
        subject: isUni
          ? 'Your BloomAbroad registration is confirmed'
          : "You're on the waitlist",
        html: isUni ? universityHtml(rec) : studentHtml(rec),
      })
    } catch (e) {
      console.error('Confirmation email failed (non-fatal):', e)
    }
  }

  return new Response('ok', { status: 200 })
})
