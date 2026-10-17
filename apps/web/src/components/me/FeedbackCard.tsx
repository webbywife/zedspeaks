import { useState } from 'react'
import { Heart, Star } from 'lucide-react'
import { api } from '../../lib/api'

const FACES = ['Not yet', 'A little', 'Okay', 'Good', 'Love it']

/** Parents tell us how ZedSpeaks is going. Anonymous unless they ask for a reply. */
export function FeedbackCard() {
  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState('')
  const [replyOk, setReplyOk] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  const send = async () => {
    setState('sending'); setError('')
    try {
      await api('/feedback', { method: 'POST', body: { rating: rating || undefined, message, replyOk } })
      setState('sent')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send. Please try again.'); setState('idle')
    }
  }

  if (state === 'sent') {
    return (
      <div className="p-5 rounded-2xl bg-pink-50 border border-pink-100 text-center flex flex-col items-center gap-2">
        <Heart className="text-pink-600 fill-pink-600" />
        <p className="font-bold text-slate-900">Thank you!</p>
        <p className="text-sm text-slate-600">Every message helps make ZedSpeaks better for children like yours.</p>
        <button onClick={() => { setState('idle'); setRating(0); setMessage(''); setReplyOk(false) }} className="text-sm font-semibold text-pink-700 underline">Send more</button>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col gap-3">
      <div>
        <p className="font-bold text-slate-900">How is ZedSpeaks working for you?</p>
        <p className="text-sm text-slate-500">Tell us what helps, what's missing or what your child loves.</p>
      </div>
      <div className="flex gap-1" role="radiogroup" aria-label="Rating">
        {FACES.map((label, i) => (
          <button key={label} role="radio" aria-checked={rating === i + 1} aria-label={`${i + 1}: ${label}`} onClick={() => setRating(i + 1)}
            className="p-1">
            <Star size={30} className={i < rating ? 'fill-pink-500 text-pink-500' : 'text-slate-300'} />
          </button>
        ))}
        {rating > 0 && <span className="self-center ml-1 text-sm font-semibold text-slate-600">{FACES[rating - 1]}</span>}
      </div>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={1000} rows={3}
        placeholder="Your idea or story (optional)" aria-label="Your feedback"
        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
      <label className="flex items-start gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={replyOk} onChange={(e) => setReplyOk(e.target.checked)} className="mt-0.5 accent-pink-600" />
        You can email me back about this (otherwise it stays anonymous)
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button onClick={send} disabled={state === 'sending' || (!rating && !message.trim())}
        className="h-11 rounded-xl bg-pink-600 text-white font-bold disabled:opacity-40">
        {state === 'sending' ? 'Sending…' : 'Send feedback'}
      </button>
    </div>
  )
}
