-- P0 compliance: role-based waitlist, recorded consent, under-18 parent
-- confirmation, and a dated log of cookie-banner choices.
--
-- RUN THIS BEFORE deploying the new site. The new form sends the new columns,
-- so submissions fail until they exist. It's safe to run more than once.
--
-- How: Supabase dashboard -> SQL Editor -> paste this file -> Run
--      (or `supabase db push` if you use the CLI migrations).

-- ---------------------------------------------------------------------
-- 1. waitlist: new fields
-- ---------------------------------------------------------------------

-- Students, parents/sponsors and universities now share the table; the
-- `role` column tags each so the lists never mix. (Allow the new 'Parent'.)
alter table public.waitlist drop constraint if exists waitlist_role_check;
alter table public.waitlist
  add constraint waitlist_role_check
  check (role in ('University', 'Student', 'Parent'));

alter table public.waitlist
  add column if not exists whatsapp                   text,
  add column if not exists country                    text,   -- country the person lives in
  add column if not exists job_title                  text,   -- universities
  add column if not exists supporting                 text,   -- parents: child / family member / sponsored
  add column if not exists study_level                text,
  add column if not exists intended_start             text,
  add column if not exists age_band                   text,   -- bands only, never a date of birth
  add column if not exists parent_email               text,   -- under-18 students
  add column if not exists consent_text               text,   -- the exact wording they agreed to
  add column if not exists consent_at                 timestamptz not null default now(),
  add column if not exists parent_confirmation_token  uuid not null default gen_random_uuid(),
  add column if not exists parent_confirmed_at        timestamptz;

-- NOTE: there's deliberately no database rule forcing `consent_text` to be
-- filled in. This migration is purely additive, so the CURRENT live form
-- (which has no consent box) keeps working until the new site is deployed.
-- The new form won't submit without the consent box ticked, and it always
-- saves the wording + timestamp so consent is on record.

-- Public sign-ups may insert, but can't pre-confirm themselves as a parent.
drop policy if exists "public can insert" on public.waitlist;
create policy "public can insert"
  on public.waitlist for insert
  to anon, authenticated
  with check (parent_confirmed_at is null);

-- Public clients can't choose their own confirmation token or pre-confirm:
-- both are always set by the database on insert.
create or replace function public.waitlist_reset_confirmation()
returns trigger
language plpgsql
as $$
begin
  new.parent_confirmation_token := gen_random_uuid();
  new.parent_confirmed_at := null;
  return new;
end;
$$;

drop trigger if exists waitlist_reset_confirmation on public.waitlist;
create trigger waitlist_reset_confirmation
  before insert on public.waitlist
  for each row execute function public.waitlist_reset_confirmation();

-- ---------------------------------------------------------------------
-- 2. Parent confirmation (under-18 students)
-- ---------------------------------------------------------------------

-- The parent clicks a link containing an unguessable token. This function is
-- the only thing the public can call; it reveals nothing about the row.
create or replace function public.confirm_parent(p_token uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  r record;
begin
  select id, parent_confirmed_at
    into r
    from public.waitlist
   where parent_confirmation_token = p_token;

  if not found then
    return 'invalid';
  end if;

  if r.parent_confirmed_at is not null then
    return 'already';
  end if;

  update public.waitlist
     set parent_confirmed_at = now()
   where id = r.id;

  return 'confirmed';
end;
$$;

revoke all on function public.confirm_parent(uuid) from public;
grant execute on function public.confirm_parent(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------
-- 3. Cookie-banner consent log (who chose what, and when)
-- ---------------------------------------------------------------------

create table if not exists public.consent_log (
  id             uuid primary key default gen_random_uuid(),
  consent_id     text not null,            -- random per browser; no personal data
  action         text not null check (action in ('accept_all', 'reject_all', 'save_choices')),
  marketing      boolean not null,
  banner_version text not null,
  page           text,
  created_at     timestamptz not null default now()
);

alter table public.consent_log enable row level security;

drop policy if exists "public can log consent" on public.consent_log;
create policy "public can log consent"
  on public.consent_log for insert
  to anon, authenticated
  with check (true);

drop policy if exists "authenticated can read consent log" on public.consent_log;
create policy "authenticated can read consent log"
  on public.consent_log for select
  to authenticated
  using (true);
