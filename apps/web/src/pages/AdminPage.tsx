import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, LogOut } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { logout } from '../hooks/useAuth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

interface AccessRequest {
  id: string
  email: string
  applicantName: string
  relation: string
  status: 'pending' | 'approved' | 'denied'
  createdAt: string
}

export function AdminPage() {
  const { user, setUser } = useAuthStore()
  const navigate = useNavigate()
  const [requests, setRequests] = useState<AccessRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/admin/requests`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setRequests(data.requests ?? []))
      .finally(() => setLoading(false))
  }, [])

  const approve = async (id: string) => {
    await fetch(`${API}/admin/requests/${id}/approve`, { method: 'POST', credentials: 'include' })
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)))
  }

  const deny = async (id: string) => {
    await fetch(`${API}/admin/requests/${id}/deny`, { method: 'POST', credentials: 'include' })
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'denied' } : r)))
  }

  const handleLogout = async () => {
    await logout()
    setUser(null)
    navigate('/login')
  }

  const pending = requests.filter((r) => r.status === 'pending')
  const reviewed = requests.filter((r) => r.status !== 'pending')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Admin</h1>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/board')}
              className="px-3 py-2 rounded-xl bg-pink-100 text-pink-700 text-sm font-semibold hover:bg-pink-200 transition-colors"
            >
              Open board
            </button>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Pending */}
            <section className="mb-8">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                Pending approval ({pending.length})
              </h2>
              {pending.length === 0 ? (
                <p className="text-sm text-slate-400 py-8 text-center">All caught up!</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {pending.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-start gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm">{req.applicantName}</p>
                        <p className="text-xs text-slate-500">{req.email}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{req.relation}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => approve(req.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-100 text-green-700 text-xs font-bold hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button
                          onClick={() => deny(req.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-100 text-red-600 text-xs font-bold hover:bg-red-200 transition-colors"
                        >
                          <XCircle size={13} /> Deny
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Reviewed */}
            {reviewed.length > 0 && (
              <section>
                <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
                  Reviewed ({reviewed.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {reviewed.map((req) => (
                    <div
                      key={req.id}
                      className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 text-sm">{req.applicantName}</p>
                        <p className="text-xs text-slate-500">{req.email}</p>
                      </div>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                          req.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
