import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShieldCheck, Volume2, WifiOff } from 'lucide-react'
import { SYMBOLS, cardImage } from '../data/symbols'
import { useBoardStore } from '../store/boardStore'
import { useTTS } from '../hooks/useTTS'

// Cards in the live demo: tap one and the app says "I want …" in the real voice
const DEMO_IDS = ['pizza', 'icecream', 'cookie', 'toycars', 'blocks', 'play']

const features = [
  { img: '/assets/moods/joy.png', round: true, title: 'Say how you feel', desc: "Faces for happy, sad, angry, scared and more. Tap one and it's said out loud." },
  { img: 'pizza', title: "Mom's Kitchen", desc: 'Pick a dish from the family menu and order it: "Mom, can you cook pizza for me, please?"' },
  { img: 'blocks', title: 'Build sentences', desc: 'Mix and match: "I want" + "the park" + "please". Over 200 ready pieces.' },
  { img: 'play', title: 'A keyboard that talks', desc: 'For children who spell: every letter speaks, and pictures help with each word.' },
]

const promises = [
  { Icon: Volume2, title: 'A real voice', desc: 'A natural young voice, recorded for every card. Not a robot.' },
  { Icon: WifiOff, title: 'Works offline', desc: 'Once opened, it works anywhere: at home, school or in the car.' },
  { Icon: ShieldCheck, title: 'Private by design', desc: 'Photos you take stay on your phone. No ads, and we never sell data.' },
  { Icon: Heart, title: 'Free for families', desc: 'Always free for families. Made at home, for children like Zed.' },
]

const steps = [
  { n: '1', title: 'Request access', desc: 'Sign up with Google or your email and tell us a little about your child.' },
  { n: '2', title: 'Get approved', desc: 'We review every request personally, usually within a day.' },
  { n: '3', title: 'Start talking', desc: "Open ZedSpeaks on your child's phone or tablet and tap away. Add your own photos anytime." },
]

function Picture({ id, className }: { id: string; className?: string }) {
  if (id.startsWith('/')) return <img src={id} alt="" className={className} />
  return <img src={cardImage(id).src} alt="" className={className} />
}

/** Tap-to-hear demo in a phone frame, using the app's own cards and recorded voice */
function LiveDemo() {
  const { speak } = useTTS(useBoardStore((s) => s.ttsSettings))
  const [said, setSaid] = useState<string | null>(null)
  const cards = DEMO_IDS.map((id) => SYMBOLS.find((s) => s.id === id)).filter((s): s is NonNullable<typeof s> => !!s)

  const tap = (label: string, spoken: string) => {
    speak(`I want ${spoken}`, ['I want', spoken])
    setSaid(`I want ${label.toLowerCase()}!`)
  }

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      <div className="rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl">
        <div className="rounded-[2rem] bg-slate-50 overflow-hidden">
          <div className="px-4 pt-4 pb-2 bg-white flex items-center gap-2 border-b border-slate-100">
            <img src="/assets/moods/joy.png" alt="" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-black text-pink-600">ZedSpeaks</span>
          </div>
          <div className="h-16 px-3 flex items-center">
            <AnimatePresence mode="wait">
              {said ? (
                <motion.div key={said} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="px-4 py-2 rounded-2xl rounded-bl-sm bg-pink-600 text-white font-bold shadow">
                  {said}
                </motion.div>
              ) : (
                <motion.p key="hint" className="text-sm text-slate-500 italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  Tap a picture to hear it 🔊
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <div className="grid grid-cols-3 gap-2 px-3 pb-5">
            {cards.map((s) => (
              <motion.button key={s.id} whileTap={{ scale: 0.9 }} onClick={() => tap(s.label, s.spokenText)}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <Picture id={s.id} className="w-full aspect-square object-contain p-1" />
                <span className="block pb-1.5 text-xs font-bold text-slate-800">{s.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <span className="text-2xl font-black text-pink-600">ZedSpeaks</span>
        <Link to="/login" className="px-4 py-2 rounded-xl bg-pink-600 text-white text-sm font-bold hover:bg-pink-700 transition-colors">
          Sign in
        </Link>
      </nav>

      {/* Hero: message on one side, a demo you can tap on the other */}
      <section className="relative bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-14 lg:py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <img src="/assets/moods/joy.png" alt="Zed" className="w-28 h-28 rounded-full object-cover mx-auto lg:mx-0 mb-6 shadow-lg" />
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight mb-4">
              Give every child<br />
              <span className="text-pink-600">a voice.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-4 leading-relaxed max-w-xl mx-auto lg:mx-0">
              ZedSpeaks is a free AAC (Augmentative and Alternative Communication) board built
              for non-verbal children. Tap a symbol, build a sentence, and speak — works offline, always.
            </p>
            <p className="text-sm font-semibold text-pink-700 mb-8">Made by a mom, for her son Zed, and for yours.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to="/login" className="px-8 py-3.5 rounded-2xl bg-pink-600 text-white font-bold text-lg hover:bg-pink-700 transition-colors shadow-md">
                Get started free
              </Link>
              <a href="#features" className="px-8 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-lg hover:bg-slate-50 transition-colors">
                See what it does
              </a>
            </div>
          </div>
          <LiveDemo />
        </div>
      </section>

      {/* What children can do */}
      <section id="features" className="px-6 py-16 max-w-6xl mx-auto">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-2">Made for real moments at home</h2>
        <p className="text-slate-600 text-center mb-10">Built around what children actually want to say every day.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(({ img, round, title, desc }) => (
            <div key={title} className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
              <div className="w-20 h-20 rounded-2xl bg-pink-50 flex items-center justify-center overflow-hidden">
                <Picture id={img} className={round ? 'w-16 h-16 rounded-full object-cover' : 'w-16 h-16 object-contain'} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Promises */}
      <section className="px-6 py-14 bg-slate-50">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promises.map(({ Icon, title, desc }) => (
            <div key={title} className="flex gap-3">
              <span className="w-11 h-11 shrink-0 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center"><Icon size={22} /></span>
              <div>
                <h3 className="font-bold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-3xl mx-auto" id="how">
        <h2 className="text-3xl font-black text-slate-900 text-center mb-10">Start in three steps</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map(({ n, title, desc }) => (
            <div key={n} className="text-center">
              <div className="w-12 h-12 rounded-full bg-pink-600 text-white font-black flex items-center justify-center mx-auto mb-3 text-xl">{n}</div>
              <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* A note from Zed's mom (Lea's own words to review before going live) */}
      <section className="px-6 py-16 bg-pink-50">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <img src="/assets/moods/hopeful.png" alt="" className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-white" />
            <h2 className="text-3xl font-black text-slate-900">A note from Zed's mom</h2>
          </div>
          <div className="bg-white rounded-3xl border border-pink-100 shadow-sm p-6 sm:p-8 text-slate-700 leading-relaxed flex flex-col gap-4">
            <p>Zed doesn't use words, but he has always known exactly what he wants. He points at his toy cars, his blocks,
              the snack on the shelf. He comes to me when he wants me to cook something for him. I just didn't always know what.</p>
            <p>We tried a communication app when he was little. He deleted it. It wasn't made for a boy like him, and he knew it.</p>
            <p>So I started building one around him: his own pictures, his favourite things, a voice that sounds like a boy his age,
              and a kitchen menu so he can ask me to cook. Every part is tried with Zed first.</p>
            <p>If your child points, waits and hopes you understand, I made this for you too. It's free for families, always.</p>
            <p className="font-bold text-slate-900">With love,<br />Zed's mom</p>
          </div>
          <div className="text-center mt-8">
            <Link to="/login" className="px-8 py-3.5 rounded-2xl bg-pink-600 text-white font-bold text-lg hover:bg-pink-700 transition-colors shadow-md inline-block">
              Give your child a voice
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 py-8 text-center text-sm text-slate-400 border-t border-gray-100">
        Made with love for Zed · Free for families, always.
      </footer>
    </div>
  )
}
