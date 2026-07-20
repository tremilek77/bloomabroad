# Waitlist → Supabase setup

The form and admin page are wired to Supabase. Until you add your project's
env vars, the app runs in **local mode** (localStorage). Once configured, it
switches to **Supabase mode** automatically:

- Anyone can submit the form (public insert).
- Only a signed-in admin can read/export (`/admin` shows a login).
- Row-Level Security stops the public anon key from reading everyone's emails.

## 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) → **New project**. Wait for it to
provision.

## 2. Create the table + security policies

Open **SQL Editor** in the Supabase dashboard, paste this, and **Run**:

```sql
-- Table
create table public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  role       text not null check (role in ('University','Student')),
  org        text default '',
  created_at timestamptz not null default now()
);

-- Lock it down
alter table public.waitlist enable row level security;

-- Anyone (even logged-out visitors) may submit
create policy "public can insert"
  on public.waitlist for insert
  to anon, authenticated
  with check (true);

-- Only signed-in users may read
create policy "authenticated can read"
  on public.waitlist for select
  to authenticated
  using (true);
```

> This intentionally does **not** allow public reads or deletes — that's what
> keeps submitted emails private. (The admin "Clear all" button only appears in
> local mode; production data isn't deletable from the UI by design.)

## 3. Create your admin login

**Authentication → Users → Add user** → enter your email + a password, and
tick **Auto Confirm**. This is the account you'll use to sign in at `/admin`.

## 4. Add the env vars

In **Project Settings → API**, copy the **Project URL** and the **anon public**
key. Create a `.env` file in the project root (copy `.env.example`):

```
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

The anon key is safe to ship in the client bundle — it's public by design and
gated by the RLS policies above. Never put the **service_role** key here.

## 5. Rebuild and deploy

Vite inlines env vars at build time, so rebuild after adding them:

```bash
npm run build
```

Upload the `dist/` contents to cPanel as before. Done — submissions now flow
into Supabase, and `/admin` requires your login to view/export them.

## Local development

Run `npm run dev`. With `.env` present you're in Supabase mode (real data +
login). Delete/blank the env vars to drop back to local mode.
