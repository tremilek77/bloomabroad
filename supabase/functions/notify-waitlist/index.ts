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
//   NOTIFY_TO         — where the admin alert lands (your inbox)
//   NOTIFY_FROM       — verified sender, e.g. "BloomAbroad <hello@yourdomain.com>"
//                       (defaults to Resend's test sender — see note below)
//   WEBHOOK_SECRET    — shared secret; webhook sends it as x-webhook-secret
//   SEND_CONFIRMATION — set to "false" to disable the applicant confirmation
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
const NOTIFY_TO = Deno.env.get('NOTIFY_TO')
const NOTIFY_FROM =
  Deno.env.get('NOTIFY_FROM') ?? 'BloomAbroad <onboarding@resend.dev>'
const SEND_CONFIRMATION = Deno.env.get('SEND_CONFIRMATION') !== 'false'

async function sendEmail(msg: {
  to: string
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
      to: [msg.to],
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
      <tr><td style="padding:8px 0;color:#9aa79a">Institution / Country</td><td style="padding:8px 0;color:#e9efe9">${esc(org)}</td></tr>
      <tr><td style="padding:8px 0;color:#9aa79a">Submitted</td><td style="padding:8px 0;color:#e9efe9">${esc(when)}</td></tr>
    </table>`)
}

function confirmationHtml(rec: WaitlistRecord) {
  const firstName = esc(rec.name.trim().split(/\s+/)[0] || 'there')
  const line =
    rec.role === 'University'
      ? "We'll be in touch about early access for your institution."
      : "We'll let you know the moment you can check your readiness."
  return SHELL(`
    <p style="margin:0 0 4px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#a3e635">You're on the list</p>
    <h1 style="margin:0 0 16px;font-size:24px;color:#fff">Thanks, ${firstName} 🌱</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#c8d2c8">
      You've joined the BloomAbroad waitlist. ${line}
    </p>
    <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#c8d2c8">
      BloomAbroad is the enrolment-readiness platform for universities and
      international students — a clear, evidence-based answer before costly
      decisions are made.
    </p>
    <p style="margin:0;font-size:13px;color:#9aa79a">
      No spam, just early-access updates. You can unsubscribe anytime.
    </p>`)
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

  if (!RESEND_API_KEY || !NOTIFY_TO) {
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

  // 4. Applicant confirmation (best-effort — never blocks the signup).
  if (SEND_CONFIRMATION) {
    try {
      await sendEmail({
        to: rec.email,
        subject: "You're on the BloomAbroad waitlist",
        html: confirmationHtml(rec),
      })
    } catch (e) {
      console.error('Confirmation email failed (non-fatal):', e)
    }
  }

  return new Response('ok', { status: 200 })
})
