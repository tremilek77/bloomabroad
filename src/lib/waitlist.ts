// Waitlist store.
//
// When Supabase is configured (env vars set), submissions go to a shared
// Postgres table and the admin reads them back (auth-gated by Row-Level
// Security). When it isn't configured, everything falls back to this
// browser's localStorage so the app still works for local dev / preview.

import { isSupabaseConfigured, supabase, WAITLIST_TABLE } from './supabase'

export type Audience = 'University' | 'Student'

export type WaitlistEntry = {
  id: string
  name: string
  email: string
  role: Audience
  org: string
  createdAt: string // ISO timestamp
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

function addLocalEntry(data: Omit<WaitlistEntry, 'id' | 'createdAt'>): void {
  const entry: WaitlistEntry = {
    ...data,
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
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

/** Persist a submission. Uses Supabase when configured, else localStorage. */
export async function addEntry(
  data: Omit<WaitlistEntry, 'id' | 'createdAt'>,
): Promise<AddResult> {
  if (supabase) {
    const { error } = await supabase.from(WAITLIST_TABLE).insert({
      name: data.name,
      email: data.email,
      role: data.role,
      org: data.org,
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
      .select('id, name, email, role, org, created_at')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data ?? []).map((r) => ({
      id: String(r.id),
      name: r.name ?? '',
      email: r.email ?? '',
      role: (r.role as Audience) ?? 'Student',
      org: r.org ?? '',
      createdAt: r.created_at ?? new Date().toISOString(),
    }))
  }
  return getLocalEntries()
}

/* -------------------------------- CSV --------------------------------- */

function csvCell(value: string): string {
  // RFC 4180: wrap in quotes if it contains comma, quote, or newline.
  if (/[",\n\r]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

export function toCsv(entries: WaitlistEntry[]): string {
  const header = ['Name', 'Email', 'Category', 'Institution / Country of study', 'Submitted']
  const rows = entries.map((e) =>
    [e.name, e.email, e.role, e.org ?? '', new Date(e.createdAt).toLocaleString()]
      .map((v) => csvCell(String(v)))
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
