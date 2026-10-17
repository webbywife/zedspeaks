import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowRight, ArrowUp, Camera, Check, Heart, ShieldCheck, Smile, Volume2, WifiOff } from 'lucide-react'
import { SYMBOLS, cardImage } from '../data/symbols'
import { useBoardStore } from '../store/boardStore'
import { useTTS } from '../hooks/useTTS'

const FONT = { fontFamily: "'Plus Jakarta Sans Variable', ui-sans-serif, system-ui, sans-serif" }
const pic = (name: string) => `${import.meta.env.BASE_URL}symbols/zs-${name}.webp`

// Fade-and-rise as a section scrolls into view (MotionConfig turns it off for reduced motion)
const rise = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

const DEMO_IDS = ['pizza', 'icecream', 'cookie', 'toycars', 'blocks', 'play']
const STRIP = ['pizza-slice', 'toy-car', 'teddy-bear', 'ice-cream', 'building-blocks', 'headphones', 'banana', 'bus', 'chicken-adobo',
  'video-game-controller', 'house', 'cookie', 'bicycle', 'sinigang', 'puzzle', 'tree', 'pancakes', 'umbrella']

const BENEFITS = [
  { Icon: Volume2, title: 'A real voice', desc: 'A natural young voice, recorded for every card. Not a robot.' },
  { Icon: Smile, title: 'Made for older kids', desc: 'No baby look. Built with a 12-year-old who knows what he likes.' },
  { Icon: Camera, title: 'Their own world', desc: 'Add photos of their toys, snacks and the dishes you cook.' },
  { Icon: WifiOff, title: 'Works offline', desc: 'Once opened, it works anywhere: home, school or the car.' },
  { Icon: ShieldCheck, title: 'Private by design', desc: "We only keep your email. No names, no ads, no tracking, and photos stay on your phone." },
  { Icon: Heart, title: 'Free for families', desc: 'Always free for families. Made at home, for children like Zed.' },
]

const TABS = [
  {
    id: 'feel', label: 'How I feel', title: 'Say how you feel',
    desc: 'Big faces for happy, sad, angry, scared and more. One tap and the feeling is said out loud.',
    points: ['Faces drawn from a real child', 'Says "I am happy", "I am scared"', 'Right at the top of the home screen'],
    images: ['/assets/moods/joy.png', '/assets/moods/sad.png', '/assets/moods/excited.png', '/assets/moods/angry.png'], round: true,
  },
  {
    id: 'kitchen', label: "Mom's Kitchen", title: 'Order what Mom cooks',
    desc: 'A family menu of the dishes you make. Pick one, tap Order, and it asks for you.',
    points: ['"Mom, can you cook adobo for me, please?"', 'Add photos of your own dishes', 'Filipino home dishes included'],
    images: [pic('chicken-adobo'), pic('sinigang'), pic('fried-rice'), pic('spaghetti')],
  },
  {
    id: 'build', label: 'Build', title: 'Build real sentences',
    desc: 'Mix and match a starter with an ending: "I want" + "to go to the park" + "please".',
    points: ['20 starters, 200+ endings', 'Natural grammar every time', 'Each piece is recorded'],
    images: [pic('house'), pic('tree'), pic('bus'), pic('teddy-bear')],
  },
  {
    id: 'type', label: 'Type', title: 'A keyboard that talks',
    desc: 'For children who spell: every letter speaks, and pictures pop up to help with each word.',
    points: ['Phone-style keys he already knows', 'Letters, numbers and symbols', 'Picture hints while typing'],
    images: [pic('banana'), pic('bicycle'), pic('building-blocks'), pic('bus')],
  },
]

const STEPS = [
  { n: '1', title: 'Request access', desc: 'Sign up with just your email or Google. No names needed.' },
  { n: '2', title: 'Get approved', desc: 'We review every request personally.' },
  { n: '3', title: 'Start talking', desc: "Open ZedSpeaks on your child's phone or tablet. Add your own photos anytime." },
]

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
      <div className="absolute -inset-6 rounded-[3rem] bg-pink-200/50 blur-2xl" aria-hidden />
      <div className="relative rounded-[2.5rem] bg-slate-900 p-3 shadow-2xl">
        <div className="rounded-[2rem] bg-slate-50 overflow-hidden">
          <div className="px-4 pt-4 pb-2 bg-white flex items-center gap-2 border-b border-slate-100">
            <img src="/assets/moods/joy.png" alt="" className="w-8 h-8 rounded-full object-cover" />
            <span className="font-extrabold text-pink-600">ZedSpeaks</span>
          </div>
          <div className="h-16 px-3 flex items-center">
            <AnimatePresence mode="wait">
              {said ? (
                <motion.div key={said} initial={{ opacity: 0, y: 6, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
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
              <motion.button key={s.id} whileTap={{ scale: 0.9 }} whileHover={{ y: -2 }} onClick={() => tap(s.label, s.spokenText)}
                className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <img src={cardImage(s.id).src} alt="" className="w-full aspect-square object-contain p-1" />
                <span className="block pb-1.5 text-xs font-bold text-slate-800">{s.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const NAV_LINKS = [
  { id: 'features', label: 'Features' },
  { id: 'how', label: 'How it works' },
  { id: 'story', label: 'Our story' },
]

/** Which section is on screen, so the menu can show where you are */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
    }, { rootMargin: '-45% 0px -50% 0px' })
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [ids])
  return active
}

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection(NAV_LINKS.map((l) => l.id))
  // Reading progress: a thin bar that fills as you scroll
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <nav className={`sticky top-0 z-30 transition-all ${scrolled ? 'bg-white/85 backdrop-blur border-b border-slate-200/70' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center gap-6">
        <span className="text-2xl font-extrabold text-pink-600 tracking-tight">ZedSpeaks</span>
        <div className="hidden md:flex items-center gap-1 text-sm font-semibold">
          {NAV_LINKS.map((l) => (
            <a key={l.id} href={`#${l.id}`} aria-current={active === l.id ? 'true' : undefined}
              className={`relative px-3 py-1.5 rounded-full transition-colors ${active === l.id ? 'text-pink-700' : 'text-slate-600 hover:text-slate-900'}`}>
              {active === l.id && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-pink-50" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
              <span className="relative">{l.label}</span>
            </a>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/login" className="hidden sm:inline px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900">Sign in</Link>
          <Link to="/login" className="px-4 py-2 rounded-full bg-pink-600 text-white text-sm font-bold hover:bg-pink-700 transition-colors">
            Get started
          </Link>
        </div>
      </div>
      <motion.div aria-hidden className="absolute left-0 right-0 bottom-0 h-0.5 bg-pink-600 origin-left" style={{ scaleX: progress }} />
    </nav>
  )
}

/** Appears after scrolling down; glides back to the top */
function BackToTop() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 900)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <AnimatePresence>
      {show && (
        <motion.button initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2 }}
          onClick={() => window.scrollTo({ top: 0 })} aria-label="Back to top"
          className="fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-pink-600 text-white shadow-lg flex items-center justify-center hover:bg-pink-700">
          <ArrowUp size={22} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}

const MOTION_KEY = 'zedspeaks-motion'

/** Visitor's own motion switch (on top of the phone's reduce-motion setting) */
function useMotionChoice() {
  const [reduce, setReduce] = useState(() => { try { return localStorage.getItem(MOTION_KEY) === 'reduce' } catch { return false } })
  useEffect(() => {
    if (reduce) document.documentElement.dataset.motion = 'reduce'
    else delete document.documentElement.dataset.motion
    try { localStorage.setItem(MOTION_KEY, reduce ? 'reduce' : 'full') } catch { /* private mode */ }
    return () => { delete document.documentElement.dataset.motion }
  }, [reduce])
  return [reduce, setReduce] as const
}

export function LandingPage() {
  const [tab, setTab] = useState(TABS[0].id)
  const active = TABS.find((t) => t.id === tab) ?? TABS[0]
  const [reduceMotion, setReduceMotion] = useMotionChoice()

  return (
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'user'}>
      <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden" style={FONT}>
        <div className="bg-gradient-to-b from-pink-50 via-white to-white">
          <Nav />

          {/* Hero */}
          <section className="relative max-w-6xl mx-auto px-5 pt-10 pb-16 lg:pt-16 lg:pb-24 grid lg:grid-cols-2 gap-12 items-center">
            <img src={pic('teddy-bear')} alt="" aria-hidden style={{ '--r': '-8deg' } as React.CSSProperties}
              className="zs-float hidden xl:block absolute -left-16 top-24 w-20 opacity-90" />
            <img src={pic('toy-car')} alt="" aria-hidden style={{ '--r': '6deg', animationDelay: '-3s' } as React.CSSProperties}
              className="zs-float hidden xl:block absolute -right-10 bottom-10 w-24 opacity-90" />
            <motion.div {...rise} className="text-center lg:text-left">
              <motion.img src="/assets/moods/joy.png" alt="Zed" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-28 h-28 rounded-full object-cover mx-auto lg:mx-0 mb-6 shadow-lg ring-4 ring-white" />
              <h1 className="text-5xl sm:text-6xl font-extrabold leading-[1.02] tracking-tight mb-5">
                Give every child<br /><span className="text-pink-600">a voice.</span>
              </h1>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed max-w-xl mx-auto lg:mx-0">
                ZedSpeaks is a free AAC (Augmentative and Alternative Communication) board built
                for non-verbal children. Tap a symbol, build a sentence, and speak — works offline, always.
              </p>
              <p className="text-sm font-semibold text-pink-700 mb-8">Made by a mom, for her son Zed, and for yours.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link to="/login" className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-pink-600 text-white font-bold text-lg hover:bg-pink-700 transition-colors shadow-lg shadow-pink-600/20">
                  Get started free <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a href="#features" className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-lg hover:border-slate-300 transition-colors">
                  See how it works
                </a>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 40, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}>
              <LiveDemo />
            </motion.div>
          </section>
        </div>

        {/* Moving strip of our drawings */}
        <section aria-hidden className="py-6 border-y border-slate-100 bg-white overflow-hidden">
          <div className="zs-marquee flex w-max gap-4">
            {[...STRIP, ...STRIP].map((name, i) => (
              <div key={i} className="w-20 h-20 shrink-0 rounded-2xl bg-pink-50/60 border border-pink-100 flex items-center justify-center">
                <img src={pic(name)} alt="" className="w-16 h-16 object-contain" loading="lazy" />
              </div>
            ))}
          </div>
        </section>

        {/* One big quote, from the note below */}
        <section className="max-w-4xl mx-auto px-5 py-20 text-center">
          <motion.blockquote {...rise}>
            <p className="text-2xl sm:text-4xl font-bold leading-snug tracking-tight">
              "Zed doesn't use words, but he has always known exactly what he wants. <span className="text-pink-600">I just didn't always know what.</span>"
            </p>
            <footer className="mt-8 flex items-center justify-center gap-3">
              <img src="/assets/moods/hopeful.png" alt="" className="w-12 h-12 rounded-full object-cover ring-2 ring-pink-100" />
              <span className="text-left text-sm"><b className="block text-slate-900">Zed's mom</b><span className="text-slate-500">Founder of ZedSpeaks</span></span>
            </footer>
          </motion.blockquote>
        </section>

        {/* Benefits grid */}
        <section className="bg-slate-50 py-20">
          <div className="max-w-6xl mx-auto px-5">
            <motion.div {...rise} className="max-w-2xl mb-12">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">Built for real children, not a demo</h2>
              <p className="text-lg text-slate-600">Everything a family needs on day one, and nothing that gets in the way.</p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {BENEFITS.map(({ Icon, title, desc }, i) => (
                <motion.div key={title} {...rise} transition={{ ...rise.transition, delay: i * 0.06 }}
                  whileHover={{ y: -4 }} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
                  <span className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center mb-4"><Icon size={24} /></span>
                  <h3 className="text-lg font-bold mb-1">{title}</h3>
                  <p className="text-slate-600 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Product tabs */}
        <section id="features" className="max-w-6xl mx-auto px-5 py-20 scroll-mt-20">
          <motion.div {...rise} className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3">One app, everything they want to say</h2>
            <p className="text-lg text-slate-600">Pick a part to see how it works.</p>
          </motion.div>
          <div className="flex justify-center mb-10">
            <div className="inline-flex flex-wrap justify-center gap-1 p-1.5 rounded-full bg-slate-100">
              {TABS.map((t) => (
                <button key={t.id} onClick={() => setTab(t.id)} aria-pressed={tab === t.id}
                  className="relative px-4 sm:px-5 h-11 rounded-full text-sm font-bold">
                  {tab === t.id && <motion.span layoutId="tab-pill" className="absolute inset-0 rounded-full bg-white shadow" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className={`relative ${tab === t.id ? 'text-pink-700' : 'text-slate-600'}`}>{t.label}</span>
                </button>
              ))}
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={active.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
              className="grid lg:grid-cols-2 gap-10 items-center rounded-[2rem] bg-gradient-to-br from-pink-50 to-white border border-pink-100 p-6 sm:p-10">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">{active.title}</h3>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">{active.desc}</p>
                <ul className="flex flex-col gap-3">
                  {active.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-3 font-medium text-slate-700">
                      <span className="mt-0.5 w-6 h-6 rounded-full bg-pink-600 text-white flex items-center justify-center shrink-0"><Check size={14} /></span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {active.images.map((src, i) => (
                  <motion.div key={src} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 * i }}
                    className="aspect-square rounded-3xl bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                    <img src={src} alt="" className={active.round ? 'w-full h-full object-cover' : 'w-3/4 h-3/4 object-contain'} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* How it works */}
        <section id="how" className="bg-slate-50 py-20 scroll-mt-20">
          <div className="max-w-5xl mx-auto px-5">
            <motion.h2 {...rise} className="text-3xl sm:text-5xl font-extrabold tracking-tight text-center mb-12">Start in three steps</motion.h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {STEPS.map(({ n, title, desc }, i) => (
                <motion.div key={n} {...rise} transition={{ ...rise.transition, delay: i * 0.1 }} className="rounded-3xl bg-white border border-slate-200 p-6">
                  <div className="w-12 h-12 rounded-full bg-pink-600 text-white font-extrabold flex items-center justify-center mb-4 text-xl">{n}</div>
                  <h3 className="text-lg font-bold mb-1">{title}</h3>
                  <p className="text-slate-600 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* A note from Zed's mom (Lea's own words; she reviews before it goes live) */}
        <section id="story" className="max-w-3xl mx-auto px-5 py-20 scroll-mt-20">
          <motion.div {...rise}>
            <div className="flex items-center gap-4 mb-6">
              <img src="/assets/moods/hopeful.png" alt="" className="w-20 h-20 rounded-full object-cover shadow-lg ring-4 ring-pink-50" />
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">A note from Zed's mom</h2>
            </div>
            <div className="rounded-[2rem] bg-white border border-slate-200 shadow-sm p-6 sm:p-10 text-lg text-slate-700 leading-relaxed flex flex-col gap-4">
              <p>Zed doesn't use words, but he has always known exactly what he wants. He points at his toy cars, his blocks,
                the snack on the shelf. He comes to me when he wants me to cook something for him. I just didn't always know what.</p>
              <p>We tried a communication app when he was little. He deleted it. It wasn't made for a boy like him, and he knew it.</p>
              <p>So I started building one around him: his own pictures, his favourite things, a voice that sounds like a boy his age,
                and a kitchen menu so he can ask me to cook. Every part is tried with Zed first.</p>
              <p>If your child points, waits and hopes you understand, I made this for you too. It's free for families, always.</p>
              <p className="font-bold text-slate-900">With love,<br />Zed's mom</p>
            </div>
          </motion.div>
        </section>

        {/* Closing CTA band */}
        <section className="px-5 pb-20">
          <motion.div {...rise} className="max-w-6xl mx-auto rounded-[2rem] bg-pink-600 text-white p-8 sm:p-14 grid lg:grid-cols-2 gap-10 items-center overflow-hidden">
            <div>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">Give your child a voice today</h2>
              <p className="text-lg text-pink-100 mb-2">Free for families, always. Set up in minutes on any phone or tablet.</p>
              <p className="text-sm text-pink-100 mb-8">
                ZedSpeaks is family-run. <Link to="/support" className="underline font-semibold text-white">Here's how you can help keep it free →</Link>
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-pink-700 font-bold text-lg hover:bg-pink-50 transition-colors">
                  Get started free <ArrowRight size={20} />
                </Link>
                <a href="#features" className="inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/40 text-white font-bold text-lg hover:bg-white/10 transition-colors">
                  See the features
                </a>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {['pizza-slice', 'teddy-bear', 'toy-car', 'ice-cream', 'house', 'headphones'].map((n, i) => (
                <div key={n} style={{ '--r': `${i % 2 ? 4 : -4}deg`, animationDelay: `${-i}s` } as React.CSSProperties}
                  className="zs-float aspect-square rounded-3xl bg-white shadow-lg flex items-center justify-center">
                  <img src={pic(n)} alt="" className="w-3/4 h-3/4 object-contain" />
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-5 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
            <div className="sm:col-span-2 lg:col-span-1">
              <span className="text-2xl font-extrabold text-pink-600">ZedSpeaks</span>
              <p className="mt-2 text-slate-500 leading-relaxed">A free picture talker for non-verbal children. Made with love for Zed.</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-slate-900">Product</span>
              <a href="#features" className="text-slate-600 hover:text-slate-900">Features</a>
              <a href="#how" className="text-slate-600 hover:text-slate-900">How it works</a>
              <Link to="/login" className="text-slate-600 hover:text-slate-900">Sign in</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-slate-900">About</span>
              <a href="#story" className="text-slate-600 hover:text-slate-900">Our story</a>
              <Link to="/privacy" className="text-slate-600 hover:text-slate-900">Privacy Notice</Link>
              <Link to="/support" className="text-slate-600 hover:text-slate-900">Help keep it free</Link>
              <span className="text-slate-600">Free for families, always</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-slate-900">Credits</span>
              <span className="text-slate-600">Voice by ElevenLabs</span>
              <a href="https://mulberrysymbols.org" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900">Mulberry Symbols (CC BY-SA)</a>
              <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-slate-900">Photos from Pexels</a>
            </div>
          </div>
          <div className="border-t border-slate-100 py-5 px-5 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-400">
            <span>© {new Date().getFullYear()} ZedSpeaks · Made at home, for children like Zed.</span>
            <button onClick={() => setReduceMotion(!reduceMotion)} aria-pressed={reduceMotion}
              className="px-3 py-1.5 rounded-full border border-slate-200 font-semibold text-slate-600 hover:border-slate-300">
              {reduceMotion ? 'Motion: off' : 'Motion: on'} · tap to {reduceMotion ? 'turn on' : 'reduce'}
            </button>
          </div>
        </footer>
        <BackToTop />
      </div>
    </MotionConfig>
  )
}
