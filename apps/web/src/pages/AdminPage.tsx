import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, LogOut, Trash2, Mail, Star, Users, Clock, MessageSquare, LayoutGrid } from 'lucide-react'
import { api } from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { logout } from '../hooks/useAuth'

interface AccessRequest {
  id: string
  email: string
  status: 'pending' | 'approved' | 'denied'
  createdAt: string
}

interface Stats {
  accounts: number
  approved: number
  waiting: number
  google: number
  email: number
  signupsLast30Days: { day: string; count: number }[]
  feedbackCount: number
  averageRating: number | null
}

interface FeedbackItem {
  id: string
  rating: number | null
  message: string | null
  replyEmail: string | null
  createdAt: string
}

type Tab = 'overview' | 'requests' | 'feedback'

const fmtDate = (s: string) => new Date(s).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })

/** The last 30 days, oldest first, with zero-filled gaps */
function last30(points: { day: string; count: number }[]) {
  const byDay = new Map(points.map((p) => [p.day.slice(0, 10), p.count]))
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
    const key = d.toISOString().slice(0, 10)
    return { key, label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), count: byDay.get(key) ?? 0 }
  })
}

function StatCard({ Icon, label, value, note }: { Icon: typeof Users; label: string; value: string | number; note?: string }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-500"><Icon size={16} className="text-pink-600" /> {label}</div>
      <div className="mt-2 text-3xl font-extrabold text-slate-900 tabular-nums">{value}</div>
      {note && <div className="text-xs text-slate-500 mt-1">{note}</div>}
    </div>
  )
}

/** Admin dashboard: sign-up counts, access requests, and families' feedback */
export function AdminPage() {
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('overview')
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [items, setItems] = useState<FeedbackItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const [r, s, f] = await Promise.all([
        api<{ requests: AccessRequest[] }>('/admin/requests'),
        api<Stats>('/admin/stats'),
        api<{ items: FeedbackItem[] }>('/admin/feedback'),
      ])
      setRequests(r.requests ?? []); setStats(s); setItems(f.items ?? []); setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load the dashboard')
    } finally {
      setLoading(false)
    }
  }, [])
  useEffect(() => { load() }, [load])

  const decide = async (id: string, action: 'approve' | 'deny') => {
    await api(`/admin/requests/${id}/${action}`, { method: 'POST' })
    load()
  }
  const removeFeedback = async (id: string) => {
    await api(`/admin/feedback/${id}`, { method: 'DELETE' })
    setItems((prev) => prev.filter((x) => x.id !== id))
  }
  const handleLogout = async () => { await logout(); setUser(null); navigate('/login') }

  const pending = requests.filter((r) => r.status === 'pending')
  const reviewed = requests.filter((r) => r.status !== 'pending').reverse()
  const days = stats ? last30(stats.signupsLast30Days) : []
  const max = Math.max(1, ...days.map((d) => d.count))
  const last30Total = days.reduce((a, d) => a + d.count, 0)

  const TABS: { id: Tab; label: string; Icon: typeof Users; badge?: number }[] = [
    { id: 'overview', label: 'Overview', Icon: LayoutGrid },
    { id: 'requests', label: 'Requests', Icon: Clock, badge: pending.length },
    { id: 'feedback', label: 'Feedback', Icon: MessageSquare, badge: items.length },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="min-w-0">
            <h1 className="text-2xl font-black text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-500 truncate">{user?.email}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button onClick={() => navigate('/board')}
              className="px-3 py-2 rounded-xl bg-pink-100 text-pink-700 text-sm font-semibold hover:bg-pink-200 transition-colors">Open board</button>
            <button onClick={handleLogout} aria-label="Sign out"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 transition-colors"><LogOut size={16} /></button>
          </div>
        </div>

        <div className="flex gap-1 p-1 rounded-2xl bg-white border border-slate-200 mb-6 w-fit max-w-full overflow-x-auto">
          {TABS.map(({ id, label, Icon, badge }) => (
            <button key={id} onClick={() => setTab(id)} aria-pressed={tab === id}
              className={`flex items-center gap-2 px-4 h-10 rounded-xl text-sm font-bold whitespace-nowrap ${tab === id ? 'bg-pink-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              <Icon size={16} /> {label}
              {!!badge && <span className={`px-1.5 rounded-full text-xs ${tab === id ? 'bg-white/25' : 'bg-pink-100 text-pink-700'}`}>{badge}</span>}
            </button>
          ))}
        </div>

        {error && <p className="mb-4 rounded-xl bg-red-50 text-red-700 text-sm p-3">{error}</p>}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'overview' ? (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard Icon={Users} label="Families" value={stats?.accounts ?? 0} note={`${stats?.approved ?? 0} approved`} />
              <StatCard Icon={Clock} label="Waiting" value={stats?.waiting ?? 0} note="need your approval" />
              <StatCard Icon={Star} label="Avg rating" value={stats?.averageRating ?? '—'} note={`${stats?.feedbackCount ?? 0} feedback`} />
              <StatCard Icon={Mail} label="Sign-in" value={`${stats?.google ?? 0} / ${stats?.email ?? 0}`} note="Google / email" />
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 p-4">
              <div className="flex items-baseline justify-between mb-4">
                <h2 className="font-bold text-slate-900">Sign-ups, last 30 days</h2>
                <span className="text-sm text-slate-500 tabular-nums">{last30Total} total</span>
              </div>
              <div className="flex items-end gap-1 h-40" role="img" aria-label={`${last30Total} sign-ups in the last 30 days`}>
                {days.map((d) => (
                  <div key={d.key} className="flex-1 h-full flex flex-col justify-end items-center group relative">
                    <div className={`w-full rounded-t-md ${d.count ? 'bg-pink-500' : 'bg-slate-100'}`} style={{ height: `${d.count ? Math.max(8, (d.count / max) * 100) : 4}%` }} />
                    <span className="pointer-events-none absolute -top-7 hidden group-hover:block whitespace-nowrap rounded-md bg-slate-900 text-white text-xs px-2 py-1">
                      {d.label}: {d.count}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-2"><span>{days[0]?.label}</span><span>Today</span></div>
            </div>

            <p className="text-xs text-slate-500">
              Counts come only from account emails and sign-up dates. ZedSpeaks does not track what children tap or say.
            </p>
          </div>
        ) : tab === 'requests' ? (
          <div className="flex flex-col gap-8">
            <section>
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Waiting for approval ({pending.length})</h2>
              {pending.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">All caught up!</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {pending.map((req) => (
                    <div key={req.id} className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm break-all">{req.email}</p>
                        <p className="text-xs text-slate-500">Asked {fmtDate(req.createdAt)}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => decide(req.id, 'approve')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-100 text-green-700 text-xs font-bold hover:bg-green-200"><CheckCircle size={13} /> Approve</button>
                        <button onClick={() => decide(req.id, 'deny')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-100 text-red-600 text-xs font-bold hover:bg-red-200"><XCircle size={13} /> Deny</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            {reviewed.length > 0 && (
              <section>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-3">Reviewed ({reviewed.length})</h2>
                <div className="flex flex-col gap-2">
                  {reviewed.map((req) => (
                    <div key={req.id} className="bg-white rounded-2xl p-3 border border-slate-200 flex items-center gap-3">
                      <p className="flex-1 min-w-0 font-semibold text-slate-900 text-sm break-all">{req.email}</p>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{req.status}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {items.length === 0 ? (
              <p className="text-sm text-slate-400 py-12 text-center">No feedback yet. Families can send it from the Me tab.</p>
            ) : items.map((f) => (
              <div key={f.id} className="bg-white rounded-2xl p-4 border border-slate-200 flex gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {f.rating && (
                      <span className="flex" aria-label={`${f.rating} out of 5`}>
                        {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={16} className={n <= f.rating! ? 'fill-pink-500 text-pink-500' : 'text-slate-300'} />)}
                      </span>
                    )}
                    <span className="text-xs text-slate-500">{fmtDate(f.createdAt)}</span>
                  </div>
                  {/* Plain text only: React escapes it, so a message can never inject markup */}
                  {f.message && <p className="mt-2 text-slate-800 whitespace-pre-wrap break-words">{f.message}</p>}
                  {f.replyEmail
                    ? <a href={`mailto:${f.replyEmail}`} className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-pink-700"><Mail size={14} /> Reply to {f.replyEmail}</a>
                    : <p className="mt-2 text-xs text-slate-400">Anonymous</p>}
                </div>
                <button onClick={() => removeFeedback(f.id)} aria-label="Delete feedback"
                  className="self-start p-2 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
