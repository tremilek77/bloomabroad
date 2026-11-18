// Waitlist store.
//
// When Supabase is configured (env vars set), submissions go to a shared
// Postgres table and the admin reads them back (auth-gated by Row-Level
// Security). When it isn't configured, everything falls back to this
// browser's localStorage so the app still works for local dev / preview.
//
// Students, parents/sponsors and universities all live in the same table,
// tagged by `role`, so the three groups never mix.

import { isSupabaseConfigured, supabase, WAITLIST_TABLE } from './supabase'

export type Role = 'University' | 'Student' | 'Parent'
/** Kept under this name for the admin page's filter types. */
export type Audience = Role

export type WaitlistEntry = {
  id: string
  /** First name (students, parents) or full name (universities). */
  name: string
  email: string
  role: Role
  /** Institution name — universities only. */
  org: string
  jobTitle: string
  whatsapp: string
  /** Country the person lives in. */
  country: string
  /** Parents only: who they're supporting. */
  supporting: string
  studyLevel: string
  intendedStart: string
  /** Students only: "Under 18" / "18–24" / "25+". Never a date of birth. */
  ageBand: string
  /** Under-18 students only. */
  parentEmail: string
  consentAt: string
  /** Under-18 students: when their parent/guardian confirmed, if they have. */
  parentConfirmedAt: string | null
  /** Where the contact came from, e.g. ["checklist"]. Empty for plain waitlist sign-ups. */
  tags: string[]
  /** Answers to the free checklist, when that is how they joined. */
  checklistAnswers: Record<string, string> | null
  createdAt: string // ISO timestamp
}

/** What the form hands over. IDs and timestamps are added by the store. */
export type NewEntry = Omit<
  WaitlistEntry,
  'id' | 'createdAt' | 'consentAt' | 'parentConfirmedAt' | 'tags' | 'checklistAnswers'
> & {
  /** The exact consent wording the person ticked. Saved with the entry. */
  consentText: string
  tags?: string[]
  checklistAnswers?: Record<string, string>
}

export const storageMode: 'supabase' | 'local' = isSupabaseConfigured
  ? 'supabase'
  : 'local'

const KEY = 'ba-waitlist'

/* ----------------------------- localStorage --------------------------- */

function getLocalEntries(): WaitlistEntry[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as WaitlistEntry[]) : []
  } catch {
    return []
  }
}

function addLocalEntry(data: NewEntry): void {
  const { consentText: _consentText, tags, checklistAnswers, ...rest } = data
  const now = new Date().toISOString()
  const entry: WaitlistEntry = {
    ...rest,
    tags: tags ?? [],
    checklistAnswers: checklistAnswers ?? null,
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    consentAt: now,
    parentConfirmedAt: null,
    createdAt: now,
  }
  const all = getLocalEntries()
  all.unshift(entry)
  try {
    localStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    /* storage full / unavailable */
  }
}

export function clearLocalEntries(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}

/* ------------------------------- public ------------------------------- */

export type AddResult = { ok: true } | { ok: false; error: string }

/** Empty strings are stored as NULL so the database doesn't fill up with ''. */
const orNull = (s: string) => (s.trim() ? s.trim() : null)

/** Persist a submission. Uses Supabase when configured, else localStorage. */
export async function addEntry(data: NewEntry): Promise<AddResult> {
  if (supabase) {
    const { error } = await supabase.from(WAITLIST_TABLE).insert({
      name: data.name,
      email: data.email,
      role: data.role,
      org: orNull(data.org),
      job_title: orNull(data.jobTitle),
      whatsapp: orNull(data.whatsapp),
      country: orNull(data.country),
      supporting: orNull(data.supporting),
      study_level: orNull(data.studyLevel),
      intended_start: orNull(data.intendedStart),
      age_band: orNull(data.ageBand),
      parent_email: orNull(data.parentEmail),
      consent_text: data.consentText,
      tags: data.tags ?? [],
      checklist_answers: data.checklistAnswers ?? null,
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  }
  addLocalEntry(data)
  return { ok: true }
}

/** Read all submissions (admin). Supabase requires an authenticated session. */
export async function fetchEntries(): Promise<WaitlistEntry[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from(WAITLIST_TABLE)
      .select(
        'id, name, email, role, org, job_title, whatsapp, country, supporting, study_level, intended_start, age_band, parent_email, consent_at, parent_confirmed_at, tags, checklist_answers, created_at',
      )
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []).map((r) => ({
      id: String(r.id),
      name: r.name ?? '',
      email: r.email ?? '',
      role: (r.role as Role) ?? 'Student',
      org: r.org ?? '',
      jobTitle: r.job_title ?? '',
      whatsapp: r.whatsapp ?? '',
      country: r.country ?? '',
      supporting: r.supporting ?? '',
      studyLevel: r.study_level ?? '',
      intendedStart: r.intended_start ?? '',
      ageBand: r.age_band ?? '',
      parentEmail: r.parent_email ?? '',
      consentAt: r.consent_at ?? '',
      parentConfirmedAt: r.parent_confirmed_at ?? null,
      tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
      checklistAnswers: (r.checklist_answers as Record<string, string> | null) ?? null,
      createdAt: r.created_at ?? new Date().toISOString(),
    }))
  }
  return getLocalEntries()
}

/** Result of a parent clicking the link in their confirmation email. */
export type ParentConfirmation = 'confirmed' | 'already' | 'invalid' | 'error'

export async function confirmParent(token: string): Promise<ParentConfirmation> {
  if (!supabase) return 'error'
  const { data, error } = await supabase.rpc('confirm_parent', { p_token: token })
  if (error) {
    // A malformed token (not a UUID) is just an invalid link.
    return /uuid/i.test(error.message) ? 'invalid' : 'error'
  }
  return data === 'confirmed' || data === 'already' ? data : 'invalid'
}

/* -------------------------------- CSV --------------------------------- */

function csvCell(value: string): string {
  // Stop spreadsheet formulas: a leading = + - @ tab or CR gets a quote prefix.
  if (/^[=+\-@\t\r]/.test(value)) value = `'${value}`
  // RFC 4180: wrap in quotes if it contains comma, quote, or newline.
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

const when = (iso: string | null) => (iso ? new Date(iso).toLocaleString() : '')

export function toCsv(entries: WaitlistEntry[]): string {
  const header = [
    'Name',
    'Email',
    'Category',
    'Institution',
    'Job title',
    'Country',
    'WhatsApp',
    'Supporting',
    'Study level',
    'Intended start',
    'Age',
    'Parent email',
    'Parent confirmed',
    'Tags',
    'Consent given',
    'Submitted',
  ]
  const rows = entries.map((e) =>
    [
      e.name,
      e.email,
      e.role,
      e.org,
      e.jobTitle,
      e.country,
      e.whatsapp,
      e.supporting,
      e.studyLevel,
      e.intendedStart,
      e.ageBand,
      e.parentEmail,
      e.ageBand === 'Under 18' ? when(e.parentConfirmedAt) || 'Pending' : '',
      e.tags.join(' '),
      when(e.consentAt),
      when(e.createdAt),
    ]
      .map((v) => csvCell(String(v ?? '')))
      .join(','),
  )
  return [header.join(','), ...rows].join('\r\n')
}

export function downloadCsv(
  entries: WaitlistEntry[],
  filename = 'bloomabroad-waitlist.csv',
): void {
  const csv = toCsv(entries)
  const blob = new Blob([`﻿${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
