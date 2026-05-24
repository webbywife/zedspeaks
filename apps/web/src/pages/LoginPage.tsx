import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, KeyRound } from 'lucide-react'
import { requestPin, verifyPin, useAuthCheck } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'

export function LoginPage() {
  const navigate = useNavigate()
  const { user, checked, setUser } = useAuthStore()
  useAuthCheck()

  const [step, setStep] = useState<'email' | 'pin'>('email')
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [name, setName] = useState('')
  const [relation, setRelation] = useState('Parent/Caregiver')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect already-logged-in users
  useEffect(() => {
    if (checked && user) navigate('/board', { replace: true })
  }, [checked, user, navigate])

  const handleRequestPin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await requestPin(email)
      setStep('pin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await verifyPin(email, pin, name || undefined, relation || undefined)
      if (result.status === 'pending') {
        navigate('/pending')
      } else if (result.user) {
        setUser(result.user)
        navigate(result.user.role === 'admin' ? '/admin' : '/board')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code')
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {step === 'email' ? (
            <form onSubmit={handleRequestPin} className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Sign in</h2>
                <p className="text-sm text-slate-500">
                  Enter your email and we'll send a 6-digit code.
                </p>
              </div>

              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  autoFocus
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 bg-gray-50 transition-colors"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-pink-600 text-white font-bold text-sm disabled:opacity-50 hover:bg-pink-700 transition-colors"
              >
                {loading ? 'Sending…' : 'Send code'}
              </button>

              <p className="text-center text-xs text-slate-400">
                First time? We'll ask a couple of questions after.
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyPin} className="flex flex-col gap-4">
              <div>
                <button
                  type="button"
                  onClick={() => { setStep('email'); setPin(''); setError('') }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mb-2"
                >
                  <ArrowLeft size={12} /> Back
                </button>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Enter your code</h2>
                <p className="text-sm text-slate-500">
                  We sent a 6-digit code to <strong>{email}</strong>
                </p>
              </div>

              <div className="relative">
                <KeyRound size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  required
                  autoFocus
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-gray-200 text-center text-2xl font-bold tracking-[0.4em] focus:outline-none focus:border-pink-400 bg-gray-50 transition-colors"
                />
              </div>

              {/* New user fields */}
              <div className="border-t border-gray-100 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-400 mb-2">
                  New here? Tell us about you
                </p>
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name (optional)"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 bg-gray-50"
                  />
                  <select
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-pink-400 bg-gray-50"
                  >
                    <option>Parent/Caregiver</option>
                    <option>Therapist</option>
                    <option>Teacher</option>
                    <option>Other</option>
                  </select>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Already have an account? Leave these blank.
                </p>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading || pin.length < 6}
                className="w-full py-3 rounded-xl bg-pink-600 text-white font-bold text-sm disabled:opacity-50 hover:bg-pink-700 transition-colors"
              >
                {loading ? 'Verifying…' : 'Continue'}
              </button>
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
