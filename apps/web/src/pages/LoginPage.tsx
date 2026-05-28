import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useAuthCheck } from '../hooks/useAuth'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

type Mode = 'signin' | 'signup'

function GoogleButton() {
  return (
    <a
      href={`${API}/auth/google`}
      className="flex items-center justify-center gap-3 w-full py-2.5 rounded-lg border border-gray-300 bg-white text-slate-700 font-medium text-sm hover:bg-gray-50 transition-colors"
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

function PasswordInput({ value, onChange, placeholder = 'Password' }: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        minLength={8}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent pr-10"
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

  const [mode, setMode] = useState<Mode>('signin')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(
    params.get('error') === 'oauth_failed' ? 'Google sign-in failed. Please try again.' : ''
  )

  // Sign in
  const [siIdentifier, setSiIdentifier] = useState('')
  const [siPassword, setSiPassword] = useState('')

  // Sign up
  const [suName, setSuName] = useState('')
  const [suUsername, setSuUsername] = useState('')
  const [suEmail, setSuEmail] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [suConfirm, setSuConfirm] = useState('')
  const [suRelation, setSuRelation] = useState('Parent/Caregiver')

  useEffect(() => {
    if (checked && user) navigate('/board', { replace: true })
  }, [checked, user, navigate])

  const switchMode = (m: Mode) => { setMode(m); setError('') }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: siIdentifier, password: siPassword }),
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
    setLoading(true); setError('')
    try {
      const r = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: suEmail, password: suPassword, name: suName, username: suUsername, relation: suRelation }),
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">

      {/* Logo */}
      <div className="text-center mb-6">
        <img src="/assets/moods/joy.png" alt="Zed" className="w-10 h-10 rounded-full object-cover mx-auto mb-2 shadow" />
        <h1 className="text-2xl font-black text-pink-600">ZedSpeaks</h1>
        <p className="text-sm text-gray-500">AAC Communication Board</p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">

        {mode === 'signin' ? (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Sign in to ZedSpeaks</h2>
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Email or Username</label>
                <input
                  type="text"
                  value={siIdentifier}
                  onChange={(e) => setSiIdentifier(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <PasswordInput value={siPassword} onChange={setSiPassword} />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300 text-pink-600" />
                  Remember me
                </label>
                <button type="button" className="text-pink-600 hover:underline font-medium">
                  Forgot password?
                </button>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-pink-600 text-white font-semibold text-sm disabled:opacity-50 hover:bg-pink-700 transition-colors mt-1"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <GoogleButton />

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <button onClick={() => switchMode('signup')} className="text-pink-600 font-semibold hover:underline">
                Sign up
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create an account</h2>
            <form onSubmit={handleSignUp} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Full name</label>
                <input type="text" value={suName} onChange={(e) => setSuName(e.target.value)} required autoFocus
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Username</label>
                <input type="text" value={suUsername}
                  onChange={(e) => setSuUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  required minLength={3} maxLength={20} placeholder="e.g. leaabarentos"
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={suEmail} onChange={(e) => setSuEmail(e.target.value)} required
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <PasswordInput value={suPassword} onChange={setSuPassword} placeholder="Min. 8 characters" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Confirm password</label>
                <PasswordInput value={suConfirm} onChange={setSuConfirm} placeholder="Confirm password" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">I am a</label>
                <select value={suRelation} onChange={(e) => setSuRelation(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                  <option>Parent/Caregiver</option>
                  <option>Therapist</option>
                  <option>Teacher</option>
                  <option>Other</option>
                </select>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg bg-pink-600 text-white font-semibold text-sm disabled:opacity-50 hover:bg-pink-700 transition-colors mt-1">
                {loading ? 'Creating account…' : 'Request Access'}
              </button>

              <p className="text-xs text-center text-gray-400">
                Your account will be reviewed before you can sign in.
              </p>
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{' '}
              <button onClick={() => switchMode('signin')} className="text-pink-600 font-semibold hover:underline">
                Sign in
              </button>
            </p>
          </>
        )}
      </div>

      <div className="mt-6">
        <Link to="/" className="text-xs text-gray-400 hover:text-gray-600">← Back to ZedSpeaks</Link>
      </div>
    </div>
  )
}
