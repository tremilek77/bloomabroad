# Email notifications via Resend

Get an email whenever someone joins the waitlist. This runs as a **Supabase
Edge Function** triggered by a **database webhook** on every insert into
`public.waitlist`, so the Resend API key stays server-side (never in the app
bundle). Requires the Supabase setup in [supabase-setup.md](./supabase-setup.md)
to be done first.

Function code: `supabase/functions/notify-waitlist/index.ts`.

## 1. Get a Resend API key

Sign up at [resend.com](https://resend.com) → **API Keys → Create**. Copy the
key (starts with `re_`).

For real sending from your own address, also add & verify your domain under
**Domains** (add the DNS records Resend gives you). Until then you can use the
test sender `onboarding@resend.dev`, which only delivers to the email you signed
up with — fine for testing.

## 2. Install the Supabase CLI & link the project

```bash
npm install -g supabase        # or: brew install supabase/tap/supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

(`YOUR_PROJECT_REF` is the subdomain in your project URL:
`https://YOUR_PROJECT_REF.supabase.co`.)

## 3. Set the function secrets

Pick any long random string for `WEBHOOK_SECRET` (e.g. from a password
manager).

```bash
supabase secrets set \
  RESEND_API_KEY="re_xxxxxxxx" \
  NOTIFY_TO="you@yourdomain.com" \
  NOTIFY_FROM="BloomAbroad <hello@yourdomain.com>" \
  WEBHOOK_SECRET="some-long-random-string"
```

- `NOTIFY_TO` — where alerts land (your inbox).
- `NOTIFY_FROM` — a **verified** Resend sender. Omit to use `onboarding@resend.dev`.
- `WEBHOOK_SECRET` — must match the header you set on the webhook in step 5.

## 4. Deploy the function

```bash
supabase functions deploy notify-waitlist --no-verify-jwt
```

`--no-verify-jwt` lets the database webhook call it; we authenticate instead
with the `x-webhook-secret` header.

Its URL will be:
`https://YOUR_PROJECT_REF.supabase.co/functions/v1/notify-waitlist`

## 5. Create the database webhook

Supabase dashboard → **Database → Webhooks → Create a new hook**:

- **Table:** `public.waitlist`
- **Events:** `Insert`
- **Type:** HTTP Request → **POST**
- **URL:** the function URL from step 4
- **HTTP Headers:** add
  - `Content-Type: application/json`
  - `x-webhook-secret: <the same WEBHOOK_SECRET from step 3>`

Save. Now every new signup fires the function and emails you.

## 6. Test

Submit the waitlist form on the live site (or in local dev pointed at Supabase).
Within a few seconds you should get the notification. If not:

- **Function logs:** Supabase → Edge Functions → `notify-waitlist` → Logs.
- **Webhook logs:** Database → Webhooks → your hook → recent deliveries.
- `401` = `x-webhook-secret` mismatch. `502 Email failed: …` = Resend rejected
  it (usually an unverified `NOTIFY_FROM` domain, or test sender to a
  non-account address).

## Applicant confirmation email

The function **also emails the applicant** a branded "you're on the list"
confirmation (tailored slightly for students vs. universities). This is on by
default and is best-effort — if it fails, the signup and your admin alert are
unaffected.

- It only reaches real inboxes once **`NOTIFY_FROM` is a verified domain**.
  Resend's test sender (`onboarding@resend.dev`) only delivers to your own
  account address, so applicants won't receive it until you verify a domain.
- To turn it off: `supabase secrets set SEND_CONFIRMATION="false"`.
