import { useState } from 'react'
import { Check } from 'lucide-react'
import { api } from '../../lib/api'

const KINDS = ['Support the app', 'Help sustain it every month', 'Volunteer my time or skills', 'Partner as an organisation', 'Something else']
const field = 'w-full px-3 h-11 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500'

/** For anyone who wants to support or help sustain ZedSpeaks. Messages go to the admin dashboard. */
export function SponsorForm() {
  const [v, setV] = useState({ name: '', organisation: '', email: '', kind: KINDS[0], message: '', website: '' })
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setV({ ...v, [k]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('sending'); setError('')
    try {
      await api('/inquiries', { method: 'POST', body: { ...v, consent } })
      setState('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send. Please try again.'); setState('idle')
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-2xl bg-white border border-pink-100 p-5 text-center flex flex-col items-center gap-2">
        <span className="w-10 h-10 rounded-full bg-pink-600 text-white flex items-center justify-center"><Check size={20} /></span>
        <p className="font-bold text-slate-900">Thank you, I'll be in touch!</p>
        <p className="text-sm text-slate-600">I read every message myself and will reply by email.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="relative flex flex-col gap-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">Your name
          <input value={v.name} onChange={set('name')} required maxLength={100} autoComplete="name" className={field} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">
          <span>Organisation <span className="font-normal text-slate-500">(optional, if you're with one)</span></span>
          <input value={v.organisation} onChange={set('organisation')} maxLength={150} autoComplete="organization" className={field} />
        </label>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">Email
          <input type="email" value={v.email} onChange={set('email')} required maxLength={255} autoComplete="email" className={field} />
        </label>
        <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">I'd like to
          <select value={v.kind} onChange={set('kind')} className={field}>
            {KINDS.map((k) => <option key={k}>{k}</option>)}
          </select>
        </label>
      </div>
      <label className="flex flex-col gap-1 text-sm font-semibold text-slate-700">Message
        <textarea value={v.message} onChange={set('message')} required minLength={5} maxLength={2000} rows={4}
          placeholder="Tell me a little about how you'd like to support ZedSpeaks."
          className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-normal focus:outline-none focus:ring-2 focus:ring-pink-500" />
      </label>
      {/* Hidden from people; bots fill it in and get ignored */}
      <input type="text" name="website" value={v.website} onChange={set('website')} tabIndex={-1} autoComplete="off" aria-hidden="true"
        className="absolute left-[-9999px] w-px h-px opacity-0" />
      <label className="flex items-start gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} required className="mt-0.5 accent-pink-600" />
        <span>ZedSpeaks may keep these details to reply to me. (<a href="/privacy" className="underline">Privacy Notice</a>)</span>
      </label>
      {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
      <button disabled={state === 'sending' || !consent} className="self-start px-6 h-11 rounded-full bg-pink-600 text-white font-bold disabled:opacity-50">
        {state === 'sending' ? 'Sending…' : 'Send'}
      </button>
    </form>
  )
}
