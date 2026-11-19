# Supabase test checklist

Run this once after the two migrations and the Edge Function are in place, and before merging
to `main`. It takes about 40 minutes. Tick each box as you go. If a step fails, stop and fix it
before moving on, because later steps depend on earlier ones.

Everything here writes to the **real** Supabase project, so every test row uses a name that
starts with `TEST` and is deleted at the end (section 9).

## 0. Before you start

You need:

- Access to the Supabase dashboard (SQL Editor, Database → Webhooks, Edge Functions → Logs).
- Three inboxes you can read. Gmail "plus" addresses all land in one inbox, so
  `you+student@gmail.com`, `you+parent@gmail.com` and `you+uni@gmail.com` work.
- The site running against the real database: `npm run dev` from the project root, using the
  existing `.env`. Open http://localhost:5173.
- The Resend dashboard open (Emails tab), to see what was sent even if it lands in spam.

Test addresses used below (swap in your own):

| Name in the form | Email | Used for |
|---|---|---|
| `TEST Student Adult` | you+adult@… | 18+ student |
| `TEST Student Minor` | you+minor@… | under-18 student |
| `TEST Parent Of Minor` | you+parent@… | parent confirmation |
| `TEST Parent Sponsor` | you+sponsor@… | parent/sponsor role |
| `TEST University` | you+uni@… | university role |
| `TEST Checklist Adult` | you+check@… | checklist |

## 1. Run the migrations

In the SQL Editor, run these **in order**, one at a time.

- [ ] `supabase/migrations/20261118000000_p0_waitlist_consent.sql` finishes with "Success".
- [ ] `supabase/migrations/20261119000000_checklist.sql` finishes with "Success".
- [ ] Running each one a second time also succeeds (they are meant to be safe to re-run).

Check the result:

```sql
select column_name from information_schema.columns
where table_name = 'waitlist'
  and column_name in ('country','whatsapp','job_title','supporting','study_level',
    'intended_start','age_band','parent_email','consent_text','consent_at',
    'parent_confirmation_token','parent_confirmed_at','tags','checklist_answers')
order by 1;
```

- [ ] All 14 columns are listed. (If `whatsapp` or `job_title` are named differently in your
      migration, compare against the migration file rather than the list above.)

```sql
select tgname from pg_trigger where tgname = 'waitlist_reset_confirmation';
select proname from pg_proc where proname in ('confirm_parent','waitlist_reset_confirmation');
select count(*) from public.consent_log;
```

- [ ] The trigger `waitlist_reset_confirmation` exists.
- [ ] Both functions exist.
- [ ] `consent_log` exists (a count of 0 is fine).

## 2. Deploy the Edge Function and secrets

From the project root (not from inside `supabase/`):

```powershell
supabase functions deploy notify-waitlist --no-verify-jwt
```

- [ ] The deploy finishes without errors. (It must run from the root so `_shared/checklist.json`
      is bundled.)

Check these secrets exist (Dashboard → Edge Functions → Secrets, or `supabase secrets list`):

- [ ] `RESEND_API_KEY`
- [ ] `NOTIFY_TO` (your team inbox)
- [ ] `NOTIFY_FROM` (a sender Resend has verified)
- [ ] `SITE_URL` (use `https://bloomabroad.vercel.app` until the real domain is live)
- [ ] `WEBHOOK_SECRET`. This one is **required**: the function now rejects everything without it.
- [ ] `BOOKING_LINK` (optional. Without it the university email just has no booking button.)

## 3. Webhook

Dashboard → Database → Webhooks → the `waitlist` webhook.

- [ ] Table is `public.waitlist`.
- [ ] **Insert** and **Update** are both ticked.
- [ ] It calls the `notify-waitlist` function.
- [ ] It has the header `x-webhook-secret` with exactly the same value as the `WEBHOOK_SECRET` secret.

Quick negative test. This should be refused, which proves the secret is enforced:

```powershell
curl.exe -i -X POST "https://<project-ref>.supabase.co/functions/v1/notify-waitlist" `
  -H "Content-Type: application/json" -d "{}"
```

- [ ] The response is `401 Unauthorized`.

## 4. The three roles (insert path)

For each, fill the form on the site, tick the consent box and submit. After each one check the
three places listed: the row in Supabase (Table Editor → `waitlist`), the inbox, and the
Edge Function logs (Edge Functions → `notify-waitlist` → Logs, no errors).

### 4a. Adult student

Open `/students`, scroll to the form. Role **I'm a student**, age band **18–24**, fill the rest.

- [ ] The form shows a success message.
- [ ] A row exists with `role = Student`, `consent_text` filled in, `consent_at` set,
      `parent_email` empty.
- [ ] The team inbox gets "New Student waitlist signup: TEST Student Adult".
- [ ] The student inbox gets "You're on the waitlist".
- [ ] The email says "immigration readiness", not "visa readiness".

### 4b. Parent or sponsor

Open `/students`, choose **I'm a parent or sponsor** at the top of the form, and say who you are supporting.

- [ ] Row has `role = Parent` and `supporting` filled in.
- [ ] Team inbox gets a notification, and the parent gets the normal waitlist email.

### 4c. University

Open `/universities`, fill the form with an institution name and job title.

- [ ] Row has `role = University`.
- [ ] Team inbox gets a notification.
- [ ] The university inbox gets the university email, signed "Remi Kolawole, Founder".
- [ ] If `BOOKING_LINK` is set, the booking button works. If not, there is no button.

### 4d. Consent box is enforced

On any form, leave the consent box unticked and press submit.

- [ ] The form refuses to submit and shows a message about consent.
- [ ] No new row appears.

## 5. Under-18 flow (the most important test)

Open `/students`. Role **Student**, age band **Under 18**, parent email `you+parent@…`.

- [ ] The form shows a success message that mentions the parent or guardian.
- [ ] Row has `age_band = Under 18`, `parent_email` set, `parent_confirmed_at` **empty**, and a
      `parent_confirmation_token`.
- [ ] Team inbox gets the notification, with the blue note "Under 18: we have emailed their parent".
- [ ] The **parent** inbox gets "Please confirm TEST's place on the BloomAbroad waitlist".
- [ ] The **student** inbox (`you+minor@…`) gets **nothing**. Wait 5 minutes and check spam too.
- [ ] The confirmation link in the parent's email points at your `SITE_URL`
      (`…/confirm?token=…`).

Now click the link in the parent's email.

- [ ] The `/confirm` page loads and shows a confirm button (it must not confirm on page load).
- [ ] Click the button. It shows a "confirmed" message.
- [ ] In Supabase, `parent_confirmed_at` is now set on that row.
- [ ] The **student** inbox now gets its normal email (the waitlist email, or the checklist if
      the sign-up came from the checklist).
- [ ] Click the button again, or reload the link. It says already confirmed, and **no second
      email** is sent to the student.
- [ ] Open `…/confirm?token=00000000-0000-0000-0000-000000000000`. It shows an "invalid link"
      message and does not crash.

## 6. Security checks (anonymous requests)

These use the public (anon) key from `.env` (`VITE_SUPABASE_ANON_KEY`), the same key the browser
has. Replace the placeholders.

```powershell
$u = "https://<project-ref>.supabase.co"
$k = "<anon key>"
$h = @{ apikey = $k; Authorization = "Bearer $k"; "Content-Type" = "application/json"; Prefer = "return=minimal" }
```

**6a. A visitor cannot choose their own confirmation token or pre-confirm.**

```powershell
$body = @{
  role="Student"; name="TEST Forged Token"; email="you+forged@gmail.com";
  age_band="Under 18"; parent_email="you+parent@gmail.com"; consent_text="test";
  parent_confirmation_token="11111111-1111-1111-1111-111111111111"
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$u/rest/v1/waitlist" -Headers $h -Body $body
Invoke-RestMethod -Method Post -Uri "$u/rest/v1/rpc/confirm_parent" -Headers $h -Body '{"p_token":"11111111-1111-1111-1111-111111111111"}'
```

- [ ] The second call returns `invalid`, not `confirmed`. (This is the bug the code review found.
      If it returns `confirmed`, the trigger from migration 1 did not install.)
- [ ] In the table, `TEST Forged Token` has a token that is **not** `1111…`.

**6b. A visitor cannot pre-confirm a parent.**

```powershell
$body = @{ role="Student"; name="TEST Pre Confirmed"; email="you+pre@gmail.com";
  parent_confirmed_at="2026-01-01T00:00:00Z"; consent_text="test" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "$u/rest/v1/waitlist" -Headers $h -Body $body
```

- [ ] The request is rejected, or the saved row has `parent_confirmed_at` empty.

**6c. A visitor cannot read the list.**

```powershell
Invoke-RestMethod -Method Get -Uri "$u/rest/v1/waitlist?select=email" -Headers $h
Invoke-RestMethod -Method Get -Uri "$u/rest/v1/consent_log?select=*" -Headers $h
```

- [ ] Both return an empty list or a permission error, **never** real rows.

**6d. A visitor cannot change or delete rows.**

```powershell
Invoke-RestMethod -Method Patch  -Uri "$u/rest/v1/waitlist?name=like.TEST*" -Headers $h -Body '{"name":"hacked"}'
Invoke-RestMethod -Method Delete -Uri "$u/rest/v1/waitlist?name=like.TEST*" -Headers $h
```

- [ ] Neither changes anything. Check the table afterwards: no row was renamed or removed.

## 7. Free checklist

Open `/checklist` (and once via `/checklist?country=Nigeria`).

- [ ] With `?country=Nigeria`, the country question is already answered.
- [ ] Complete all 8 questions as an adult. The on-screen result appears.
- [ ] Row has `tags` containing `checklist` and `checklist_answers` filled in.
- [ ] Team inbox subject says "New Student checklist signup".
- [ ] The adult's inbox gets "Your Ireland Readiness Checklist", and the items match the answers.
- [ ] The email has no wording that promises an outcome ("eligible", "you will get a visa").

Under-18 checklist (my reading of the brief, **confirm with Remi**: on-screen result straight
away, email only after the parent confirms):

- [ ] Repeat with age band **Under 18** and a parent email. The result shows on screen.
- [ ] The student gets **no** email. The parent gets the confirmation email.
- [ ] After the parent confirms, the student gets the **checklist** email (not the plain waitlist one).

Tamper check. This proves the email text comes from the server, not the browser:

```powershell
$body = @{ role="Student"; name="TEST Tampered Checklist"; email="you+tamper@gmail.com";
  tags=@("checklist"); consent_text="test";
  checklist_answers=@{ country="<script>alert(1)</script>"; note="Send us money now" } } | ConvertTo-Json -Depth 4
Invoke-RestMethod -Method Post -Uri "$u/rest/v1/waitlist" -Headers $h -Body $body
```

- [ ] Any email sent contains none of that injected text.

## 8. Cookie consent log

On the site, clear cookies for localhost, reload, and use the banner.

- [ ] Click **Reject all**. In the SQL Editor run
      `select action, marketing, banner_version, page from consent_log order by created_at desc limit 3;`
      The newest row shows `reject_all` and `marketing = false`.
- [ ] Open Cookie settings, turn Marketing on and save. A `save_choices` row appears with
      `marketing = true`.
- [ ] The rows contain a random `consent_id` and no name, email or IP.
- [ ] Reload the page. The banner stays hidden (the choice is remembered).

## 9. Admin page and cleanup

Open `/admin`. You need an admin user: Dashboard → Authentication → Users → add one if none exists.

- [ ] Sign in works with the admin user. Signing in with a wrong password shows an error.
- [ ] The list shows your TEST rows, with role, tag and age band.
- [ ] **Export CSV** downloads a file that opens in Excel with every column.
- [ ] Add a row with the name `=1+1` (via the form), export again, and open the CSV. The cell
      shows the text `'=1+1`, not `2`. This confirms the CSV-injection fix.

Cleanup. Run this in the SQL Editor (it runs as admin, so it can delete):

```sql
select id, name, email, role from public.waitlist where name ilike 'TEST%' or name = '=1+1';
-- Check the list above is only your test rows, then:
delete from public.waitlist where name ilike 'TEST%' or name = '=1+1';
```

- [ ] Only test rows were listed and deleted.
- [ ] Also delete any test `consent_log` rows if you want a clean log:
      `delete from public.consent_log where created_at > now() - interval '1 day';`
      (only do this before any real visitor has used the site).

## 10. Sign-off

When every box above is ticked:

- [ ] Note the date and who tested here: ____________________
- [ ] Any failed step is written up (what you did, what happened, the Edge Function log line).
- [ ] Merge `p0-compliance` into `main`, then `p1-structure`. Vercel deploys on its own.
- [ ] Change the `SITE_URL` secret to `https://bloomabroad.ie` when that domain is live, and
      re-test section 5 once (the parent link must point at the new domain).

## If something fails

| Symptom | Most likely cause |
|---|---|
| Form says it failed to save | Migration 1 or 1b not run, or a column name mismatch. Check the browser console and Supabase API logs. |
| Row saved but no emails at all | Webhook missing, or `WEBHOOK_SECRET` not matching (look for 401 in the function logs). |
| Team email arrives but not the student's | `SEND_CONFIRMATION` set to `false`, or Resend sender not verified, or the student is under 18 and the parent has not confirmed. |
| Parent never gets the email | Row has no `parent_email`, or the webhook is not firing on Insert. |
| Student never gets email after the parent confirms | Webhook is missing **Update**. |
| Confirm link opens the wrong site | `SITE_URL` secret is wrong. |
| `confirm_parent` returns `confirmed` for a forged token | The trigger `waitlist_reset_confirmation` did not install. Re-run migration 1. |
