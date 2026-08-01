import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import {
  ArrowLeft,
  Building2,
  Download,
  GraduationCap,
  Loader2,
  LogOut,
  RefreshCw,
  Search,
  Trash2,
  Users,
  Info,
  Lock,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BloomMark } from '@/components/Logo'
import { ThemeToggle } from '@/components/saasta/ThemeToggle'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { useNoIndex } from '@/lib/seo'
import {
  clearLocalEntries,
  downloadCsv,
  fetchEntries,
  storageMode,
  type Audience,
  type WaitlistEntry,
} from '@/lib/waitlist'

type Filter = 'all' | Audience

export function AdminPage() {
  useNoIndex()

  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured)

  const [entries, setEntries] = useState<WaitlistEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [filter, setFilter] = useState<Filter>('all')
  const [query, setQuery] = useState('')

  // Auth (Supabase mode only)
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setSession(s),
    )
    return () => sub.subscription.unsubscribe()
  }, [])

  const canRead = !isSupabaseConfigured || !!session

  const load = useCallback(async () => {
    if (!canRead) return
    setLoading(true)
    setLoadError(null)
    try {
      setEntries(await fetchEntries())
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : 'Failed to load entries.')
    } finally {
      setLoading(false)
    }
  }, [canRead])

  useEffect(() => {
    if (canRead) load()
  }, [canRead, load])

  const counts = useMemo(
    () => ({
      all: entries.length,
      University: entries.filter((e) => e.role === 'University').length,
      Student: entries.filter((e) => e.role === 'Student').length,
    }),
    [entries],
  )

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((e) => {
      if (filter !== 'all' && e.role !== filter) return false
      if (!q) return true
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.org ?? '').toLowerCase().includes(q)
      )
    })
  }, [entries, filter, query])

  function handleExport() {
    const suffix = filter === 'all' ? 'all' : filter.toLowerCase()
    downloadCsv(visible, `bloomabroad-waitlist-${suffix}.csv`)
  }

  function handleClearLocal() {
    if (
      window.confirm(
        `Delete all ${entries.length} entries from this browser? This cannot be undone.`,
      )
    ) {
      clearLocalEntries()
      setEntries([])
    }
  }

  async function handleSignOut() {
    await supabase?.auth.signOut()
    setEntries([])
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-2.5">
            <BloomMark className="h-7 w-7" />
            <div>
              <div className="text-base font-bold tracking-tight text-heading">
                BloomAbroad
              </div>
              <div className="text-xs text-muted-foreground">Waitlist admin</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <ThemeToggle />
            {isSupabaseConfigured && session && (
              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            )}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to site
            </Link>
          </div>
        </div>
      </header>

      {/* Auth gate (Supabase mode, not signed in) */}
      {isSupabaseConfigured && authReady && !session ? (
        <AdminLogin />
      ) : !authReady ? (
        <div className="flex items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading…
        </div>
      ) : (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-heading sm:text-3xl">
              Waitlist submissions
            </h1>
            <p className="text-sm text-muted-foreground">
              {counts.all} total · {counts.University} universities ·{' '}
              {counts.Student} students
            </p>
          </div>

          {/* mode banner */}
          {storageMode === 'local' ? (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-4 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
              <p>
                <strong>Local mode.</strong> Supabase isn't configured, so these
                entries are stored in <strong>this browser only</strong>. Add
                your <code>VITE_SUPABASE_*</code> env vars to collect real
                submissions from every visitor.
              </p>
            </div>
          ) : (
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-signal" />
              <p>
                <strong className="text-foreground">Connected to Supabase.</strong>{' '}
                Showing live submissions from all visitors.
              </p>
            </div>
          )}

          {loadError && (
            <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
              {loadError}
            </div>
          )}

          {/* controls */}
          <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterTab
                active={filter === 'all'}
                onClick={() => setFilter('all')}
                icon={<Users className="h-4 w-4" />}
                label="All"
                count={counts.all}
              />
              <FilterTab
                active={filter === 'University'}
                onClick={() => setFilter('University')}
                icon={<Building2 className="h-4 w-4" />}
                label="Universities"
                count={counts.University}
              />
              <FilterTab
                active={filter === 'Student'}
                onClick={() => setFilter('Student')}
                icon={<GraduationCap className="h-4 w-4" />}
                label="Students"
                count={counts.Student}
              />
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search name, email, org…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-full border border-input bg-card py-2 pl-9 pr-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-56"
                />
              </div>
              <button
                onClick={load}
                disabled={loading}
                title="Refresh"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
              >
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
                Refresh
              </button>
              <button
                onClick={handleExport}
                disabled={visible.length === 0}
                className="btn-sheen inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="h-4 w-4" />
                Export CSV
                {visible.length > 0 && ` (${visible.length})`}
              </button>
            </div>
          </div>

          {/* table */}
          <div className="mt-5 overflow-hidden rounded-2xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Category</th>
                    <th className="px-4 py-3 font-semibold">
                      Institution / Country of study
                    </th>
                    <th className="px-4 py-3 font-semibold">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-border/70 last:border-0 hover:bg-secondary/30"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {e.name}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {e.email}
                      </td>
                      <td className="px-4 py-3">
                        <RoleBadge role={e.role} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {e.org || <span className="opacity-50">—</span>}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                        {new Date(e.createdAt).toLocaleDateString()}{' '}
                        <span className="opacity-60">
                          {new Date(e.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visible.length === 0 && (
              <div className="px-4 py-16 text-center text-sm text-muted-foreground">
                {loading
                  ? 'Loading…'
                  : entries.length === 0
                    ? 'No submissions yet. Fill out the waitlist form on the site to see entries here.'
                    : 'No submissions match this filter.'}
              </div>
            )}
          </div>

          {storageMode === 'local' && entries.length > 0 && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleClearLocal}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Clear all
              </button>
            </div>
          )}
        </main>
      )}
    </div>
  )
}

function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await supabase!.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    setBusy(false)
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col px-4 py-20">
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-signal">
          <Lock className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-xl font-bold text-heading">Admin sign in</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to view and export waitlist submissions.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="admin-email" className="mb-1.5 block text-sm font-medium">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              className="w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </button>
        </form>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Create an admin user in Supabase → Authentication → Users.
      </p>
    </main>
  )
}

function FilterTab({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  count: number
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border text-muted-foreground hover:text-foreground',
      )}
    >
      {icon}
      {label}
      <span
        className={cn(
          'rounded-full px-1.5 text-xs',
          active ? 'bg-primary-foreground/20' : 'bg-secondary',
        )}
      >
        {count}
      </span>
    </button>
  )
}

function RoleBadge({ role }: { role: Audience }) {
  const isUni = role === 'University'
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        isUni ? 'bg-secondary text-secondary-foreground' : 'bg-signal/15 text-signal',
      )}
    >
      {isUni ? (
        <Building2 className="h-3 w-3" />
      ) : (
        <GraduationCap className="h-3 w-3" />
      )}
      {role}
    </span>
  )
}
