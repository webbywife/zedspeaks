import { Link } from 'react-router-dom'
import { Volume2, ImageIcon, BookOpen, WifiOff } from 'lucide-react'

const features = [
  {
    icon: Volume2,
    title: 'Speaks instantly',
    desc: 'Tap any symbol and hear it read aloud in a warm, clear voice.',
    color: 'bg-green-100 text-green-700',
  },
  {
    icon: ImageIcon,
    title: 'Your photos',
    desc: "Add personal photos as custom symbols using your phone's camera.",
    color: 'bg-blue-100 text-blue-700',
  },
  {
    icon: BookOpen,
    title: 'Phrase builder',
    desc: 'Build sentences word-by-word or use ready-made phrases and greetings.',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    icon: WifiOff,
    title: 'Works offline',
    desc: 'No internet required. Once loaded, ZedSpeaks works anywhere.',
    color: 'bg-amber-100 text-amber-700',
  },
]

const steps = [
  { n: '1', title: 'Request access', desc: 'Enter your email and tell us about yourself. We review every request personally.' },
  { n: '2', title: 'Get approved', desc: "We'll email you once your account is approved — usually within 24 hours." },
  { n: '3', title: 'Start communicating', desc: 'Sign in with your email and a one-time code. No password to remember.' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="text-2xl font-black text-pink-600">ZedSpeaks</span>
        <Link
          to="/login"
          className="px-4 py-2 rounded-xl bg-pink-600 text-white text-sm font-bold hover:bg-pink-700 transition-colors"
        >
          Sign in
        </Link>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 text-center max-w-2xl mx-auto">
        <img
          src="/assets/moods/joy.png"
          alt="Zed"
          className="w-28 h-28 rounded-full object-cover mx-auto mb-6 shadow-lg"
        />
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-4">
          Give every child<br />
          <span className="text-pink-600">a voice.</span>
        </h1>
        <p className="text-lg text-slate-600 mb-8 leading-relaxed">
          ZedSpeaks is a free AAC (Augmentative and Alternative Communication) board built
          for non-verbal children. Tap a symbol, build a sentence, and speak — works offline, always.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-2xl bg-pink-600 text-white font-bold text-lg hover:bg-pink-700 transition-colors shadow-md"
          >
            Request Access
          </Link>
          <a
            href="#how"
            className="px-8 py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-lg hover:bg-slate-200 transition-colors"
          >
            See how it works
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12 bg-slate-50">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-xl mx-auto" id="how">
        <h2 className="text-2xl font-black text-slate-900 text-center mb-10">How it works</h2>
        <div className="flex flex-col gap-6">
          {steps.map(({ n, title, desc }) => (
            <div key={n} className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-full bg-pink-600 text-white font-black flex items-center justify-center shrink-0 text-lg">
                {n}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-0.5">{title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-pink-50 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Ready to get started?</h2>
        <p className="text-slate-500 mb-6">ZedSpeaks is free. Always.</p>
        <Link
          to="/login"
          className="px-8 py-3.5 rounded-2xl bg-pink-600 text-white font-bold text-lg hover:bg-pink-700 transition-colors shadow-md inline-block"
        >
          Request Access
        </Link>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-slate-400 border-t border-gray-100">
        Made with love for Zed.
      </footer>
    </div>
  )
}
