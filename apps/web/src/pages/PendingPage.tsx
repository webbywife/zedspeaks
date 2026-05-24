import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'

export function PendingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 text-center">
      <img
        src="/assets/moods/hopeful.png"
        alt="Zed is hopeful"
        className="w-24 h-24 rounded-full object-cover mx-auto mb-6 shadow-lg"
      />
      <div className="flex items-center gap-2 justify-center mb-2">
        <Clock size={18} className="text-amber-500" />
        <h1 className="text-xl font-black text-slate-900">You're on the list!</h1>
      </div>
      <p className="text-slate-600 max-w-xs leading-relaxed mb-6">
        Your access request is being reviewed. We'll email you once you're approved — usually
        within 24 hours.
      </p>
      <p className="text-sm text-slate-400">
        Already approved?{' '}
        <Link to="/login" className="text-pink-600 font-semibold">
          Sign in
        </Link>
      </p>
    </div>
  )
}
