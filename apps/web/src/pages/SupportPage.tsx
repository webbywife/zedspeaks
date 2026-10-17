import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, HeartHandshake, Check, Heart, MessageSquare, Mic, Server, Share2, Sparkles } from 'lucide-react'
import { SponsorForm } from '../components/support/SponsorForm'

const FONT = { fontFamily: "'Plus Jakarta Sans Variable', ui-sans-serif, system-ui, sans-serif" }
const SITE = 'https://zedspeaks.io'
// Add a payment link here later (GCash/Maya page, Ko-fi…) and the "Chip in" button appears
const CHIP_IN_URL: string | null = null

const COSTS = [
  { Icon: Mic, title: 'Voices', desc: 'Every card, sentence and typed word is spoken by a real recorded voice. New words and new voices cost a little each time.' },
  { Icon: Server, title: 'The server', desc: 'Keeps sign-in, the dashboard and the voices running every day, safely and privately.' },
  { Icon: Sparkles, title: 'What comes next', desc: 'Filipino words and voices, more pictures, and features families ask for.' },
]

/** Support page: honest, calm, no pressure. Everything in ZedSpeaks stays free either way. */
export function SupportPage() {
  const [shared, setShared] = useState(false)

  const share = async () => {
    const data = { title: 'ZedSpeaks', text: 'A free picture talker for non-verbal children, made by a mom for her son Zed.', url: SITE }
    try {
      if (navigator.share) await navigator.share(data)
      else { await navigator.clipboard.writeText(SITE); setShared(true) }
    } catch { /* closed the share sheet */ }
  }

  return (
    <div className="min-h-screen bg-white" style={FONT}>
      <nav className="border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"><ArrowLeft size={18} /> Home</Link>
          <span className="ml-auto text-xl font-extrabold text-pink-600">ZedSpeaks</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-5 py-12 flex flex-col gap-12">
        <header className="flex flex-col gap-4">
          <Heart className="text-pink-600 fill-pink-600" size={36} />
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Help keep ZedSpeaks free</h1>
          <p className="text-lg text-slate-700 leading-relaxed">
            I built ZedSpeaks for my son Zed, and I want every family who needs it to have it for free, always. There are no ads,
            we never sell data, and nothing is ever locked behind a payment. It's just me keeping it running, so if you'd like to
            help, here's how.
          </p>
          <p className="font-bold text-slate-900">Zed's mom</p>
        </header>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold text-slate-900">What it takes to run</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {COSTS.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-3xl border border-slate-200 p-5">
                <span className="w-11 h-11 rounded-2xl bg-pink-50 text-pink-700 flex items-center justify-center mb-3"><Icon size={22} /></span>
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-extrabold text-slate-900">Ways to help</h2>

          <div className="rounded-3xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <Share2 className="text-pink-600 shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Share it with a family who needs it</h3>
              <p className="text-sm text-slate-600">The biggest help of all. One message to the right parent, teacher or therapist can change a child's day.</p>
            </div>
            <button onClick={share} className="px-5 h-11 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center gap-2 shrink-0">
              {shared ? <><Check size={18} /> Link copied</> : 'Share'}
            </button>
          </div>

          <div className="rounded-3xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <MessageSquare className="text-pink-600 shrink-0" />
            <div className="flex-1">
              <h3 className="font-bold text-slate-900">Tell me what to improve</h3>
              <p className="text-sm text-slate-600">Using ZedSpeaks? Send feedback from the Me tab. Honest feedback is a gift.</p>
            </div>
            <Link to="/board" className="px-5 h-11 rounded-full border border-slate-300 font-bold text-slate-700 flex items-center justify-center shrink-0">Open the app</Link>
          </div>

          {CHIP_IN_URL && (
            <div className="rounded-3xl border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <Heart className="text-pink-600 shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-slate-900">Chip in</h3>
                <p className="text-sm text-slate-600">Any amount helps pay for voices and the server. Thank you.</p>
              </div>
              <a href={CHIP_IN_URL} target="_blank" rel="noopener noreferrer" className="px-5 h-11 rounded-full bg-pink-600 text-white font-bold flex items-center justify-center shrink-0">Chip in</a>
            </div>
          )}

          <div id="sponsor" className="rounded-3xl bg-pink-50 border border-pink-100 p-5 sm:p-6 flex flex-col gap-4 scroll-mt-20">
            <div className="flex gap-4">
              <HeartHandshake className="text-pink-600 shrink-0" />
              <div>
                <h3 className="font-bold text-slate-900">Help fund ZedSpeaks</h3>
                <p className="text-sm text-slate-600">
                  Would you like to help keep ZedSpeaks running? You can help fund the app once or every month, share your
                  skills (design, translation, therapy, coding), or partner with us as an organisation. Leave a message and I'll
                  get back to you personally.
                </p>
              </div>
            </div>
            <SponsorForm />
          </div>
        </section>

        <p className="text-slate-600 leading-relaxed">
          Whatever you choose, even just reading this far, thank you. ZedSpeaks stays free for every family either way. 💗
        </p>
      </main>

      <footer className="border-t border-slate-100 py-6 text-center text-sm text-slate-500">
        <Link to="/" className="font-semibold text-pink-700">ZedSpeaks</Link> · <Link to="/privacy" className="underline">Privacy Notice</Link>
      </footer>
    </div>
  )
}
