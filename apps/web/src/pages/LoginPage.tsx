import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, AtSign } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useAuthCheck } from '../hooks/useAuth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

type Tab = 'signin' | 'signup'

function GoogleButton() {
  return (
    <a
      href={`${API}/auth/google`}
      className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border-2 border-gray-200 bg-white text-slate-700 font-semibold text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
        <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
      </svg>
      Continue with Google
    </a>
  )
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-1">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-xs text-gray-400">or</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  )
}

function PasswordInput({
  value,
  onChange,
  placeholder = 'Password',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        minLength={8}
        className="w-full pl-9 pr-10 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 bg-gray-50 transition-colors"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        tabIndex={-1}
      >
        {show ? <EyeOff size={15} /> : <Eye size={15} />}
      </button>
    </div>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { user, checked, setUser } = useAuthStore()
  useAuthCheck()

  const [tab, setTab] = useState<Tab>('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(params.get('error') === 'oauth_failed' ? 'Google sign-in failed. Please try again.' : '')

  // Sign in state
  const [siEmail, setSiEmail] = useState('')
  const [siPassword, setSiPassword] = useState('')

  // Sign up state
  const [suName, setSuName] = useState('')
  const [suUsername, setSuUsername] = useState('')
  const [suEmail, setSuEmail] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [suConfirm, setSuConfirm] = useState('')
  const [suRelation, setSuRelation] = useState('Parent/Caregiver')

  useEffect(() => {
    if (checked && user) navigate('/board', { replace: true })
  }, [checked, user, navigate])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: siEmail, password: siPassword }),
      })
      const data = await r.json()
      if (r.status === 403 && data.status === 'pending') { navigate('/pending'); return }
      if (!r.ok) throw new Error(data.error ?? 'Sign in failed')
      setUser(data.user)
      navigate(data.user.role === 'admin' ? '/admin' : '/board')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (suPassword !== suConfirm) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      const r = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: suEmail,
          password: suPassword,
          name: suName,
          username: suUsername,
          relation: suRelation,
        }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error ?? 'Sign up failed')
      if (data.status === 'pending') { navigate('/pending'); return }
      setUser(data.user)
      navigate('/board')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/assets/moods/joy.png"
            alt="Zed"
            className="w-16 h-16 rounded-full object-cover mx-auto mb-3 shadow"
          />
          <h1 className="text-2xl font-black text-pink-600">ZedSpeaks</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
          <GoogleButton />
          <Divider />

          {/* Tabs */}
          <div className="flex rounded-xl bg-gray-100 p-1 gap-1">
            {(['signin', 'signup'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${
                  tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            ))}
          </div>

          {/* Sign in */}
          {tab === 'signin' && (
            <form onSubmit={handleSignIn} className="flex flex-col gap-3">
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={siEmail}
                  onChange={(e) => setSiEmail(e.target.value)}
                  placeholder="Email"
                  required
                  autoFocus
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 bg-gray-50 transition-colors"
                />
              </div>
              <PasswordInput value={siPassword} onChange={setSiPassword} />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-pink-600 text-white font-bold text-sm disabled:opacity-50 hover:bg-pink-700 transition-colors"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}

          {/* Sign up */}
          {tab === 'signup' && (
            <form onSubmit={handleSignUp} className="flex flex-col gap-3">
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={suName}
                  onChange={(e) => setSuName(e.target.value)}
                  placeholder="Full name"
                  required
                  autoFocus
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 bg-gray-50 transition-colors"
                />
              </div>
              <div className="relative">
                <AtSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={suUsername}
                  onChange={(e) => setSuUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="username"
                  required
                  minLength={3}
                  maxLength={20}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 bg-gray-50 transition-colors"
                />
              </div>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={suEmail}
                  onChange={(e) => setSuEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 bg-gray-50 transition-colors"
                />
              </div>
              <PasswordInput value={suPassword} onChange={setSuPassword} placeholder="Password (min. 8 chars)" />
              <PasswordInput value={suConfirm} onChange={setSuConfirm} placeholder="Confirm password" />
              <select
                value={suRelation}
                onChange={(e) => setSuRelation(e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 bg-gray-50"
              >
                <option>Parent/Caregiver</option>
                <option>Therapist</option>
                <option>Teacher</option>
                <option>Other</option>
              </select>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-pink-600 text-white font-bold text-sm disabled:opacity-50 hover:bg-pink-700 transition-colors"
              >
                {loading ? 'Creating account…' : 'Request access'}
              </button>
              <p className="text-xs text-center text-slate-400">
                Your account will be reviewed before you can sign in.
              </p>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">
            ← Back to ZedSpeaks
          </Link>
        </div>
      </div>
    </div>
  )
}
