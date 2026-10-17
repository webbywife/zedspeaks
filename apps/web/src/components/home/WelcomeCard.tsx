import { useState } from 'react'
import { ChefHat, Keyboard, MessageCircle, Blocks, Smile, X } from 'lucide-react'

const KEY = 'zedspeaks-welcome-hidden'

const FEATURES = [
  { tab: 'home', Icon: Smile, title: 'How I feel', text: 'Tap a face to say how you feel' },
  { tab: 'kitchen', Icon: ChefHat, title: "Mom's Kitchen", text: 'Order what you want Mom to cook' },
  { tab: 'talk', Icon: MessageCircle, title: 'Talk', text: 'All the words, by topic' },
  { tab: 'build', Icon: Blocks, title: 'Build', text: 'Make sentences: I want + pizza' },
  { tab: 'type', Icon: Keyboard, title: 'Type', text: 'A keyboard that talks' },
] as const

export type FeatureTab = (typeof FEATURES)[number]['tab']

/** Shows everything ZedSpeaks can do, one tap each. Hidden once a parent closes it. */
export function WelcomeCard({ onGo }: { onGo: (tab: FeatureTab) => void }) {
  const [hidden, setHidden] = useState(() => { try { return localStorage.getItem(KEY) === '1' } catch { return false } })
  if (hidden) return null
  const hide = () => { setHidden(true); try { localStorage.setItem(KEY, '1') } catch { /* private mode */ } }

  return (
    <section className="mx-4 mt-4 rounded-3xl bg-gradient-to-br from-pink-50 to-white border border-pink-100 p-4">
      <div className="flex items-start gap-2 pb-3">
        <div className="flex-1">
          <h2 className="text-lg font-black text-slate-900">What you can do with ZedSpeaks</h2>
          <p className="text-sm text-slate-600">Tap one to try it. Every card and word speaks out loud.</p>
        </div>
        <button onClick={hide} aria-label="Hide this" className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-500 flex items-center justify-center">
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {FEATURES.map(({ tab, Icon, title, text }) => (
          <button key={title} onClick={() => onGo(tab)}
            className="flex flex-col items-start gap-1 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm text-left">
            <span className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center"><Icon size={22} /></span>
            <span className="font-bold text-slate-900">{title}</span>
            <span className="text-xs text-slate-600 leading-snug">{text}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
