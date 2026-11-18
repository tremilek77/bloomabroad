-- Free Ireland Readiness Checklist: results join the waitlist with a "checklist" tag.
-- Additive and safe to run on the live database. The website keeps working before
-- and after it runs, but run it BEFORE deploying the checklist page.

alter table public.waitlist
  add column if not exists tags text[] not null default '{}',
  add column if not exists checklist_answers jsonb;

comment on column public.waitlist.tags is
  'Where the contact came from, e.g. {checklist}. Contacts stay in one table, split by role and tag.';
comment on column public.waitlist.checklist_answers is
  'Answers to the 8 checklist questions. The Edge Function recomputes the emailed items from these.';

-- No policy change needed: the existing anon INSERT policy already covers new columns.
