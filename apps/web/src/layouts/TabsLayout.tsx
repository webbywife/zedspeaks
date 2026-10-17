import { useCallback, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Blocks, ChefHat, Home, Keyboard, MessageCircle, User } from 'lucide-react'
import { SentenceStrip } from '../components/board/SentenceStrip'
import { CategoryNav } from '../components/board/CategoryNav'
import { CommunicationBoard } from '../components/board/CommunicationBoard'
import { PhraseBoard } from '../components/phrases/PhraseBoard'
import { CameraCapture } from '../components/camera/CameraCapture'
import { VoiceSettings } from '../components/settings/VoiceSettings'
import { HomeTab } from '../components/home/HomeTab'
import { KitchenTab } from '../components/kitchen/KitchenTab'
import { MeTab } from '../components/me/MeTab'
import { TypeTab } from '../components/type/TypeTab'
import { BuildTab } from '../components/build/BuildTab'
import { ZedMascot } from '../components/mascot/ZedMascot'
import { KITCHEN_SHELF } from '../data/shelves'
import { CATEGORIES, getSymbolsByCategory } from '../data/symbols'
import { useBoardStore } from '../store/boardStore'
import { useTTS } from '../hooks/useTTS'
import { useCustomSymbols } from '../hooks/useCustomSymbols'
import type { AACSymbol, Phrase } from '../types'

type Tab = 'home' | 'kitchen' | 'talk' | 'build' | 'type' | 'me'

const TABS: { id: Tab; label: string; Icon: typeof Home }[] = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'kitchen', label: 'Kitchen', Icon: ChefHat },
  { id: 'talk', label: 'Talk', Icon: MessageCircle },
  { id: 'build', label: 'Build', Icon: Blocks },
  { id: 'type', label: 'Type', Icon: Keyboard },
  { id: 'me', label: 'Me', Icon: User },
]
const TALK_CATEGORIES = CATEGORIES.filter((c) => c.id !== 'my-photos')

/** App-style layout: shelves, Mom's Kitchen, the talk board and a parent corner. */
export function TabsLayout() {
  const { currentCategory, sentenceItems, ttsSettings, setCategory, addToSentence, clearSentence, backspace, setMascotState } = useBoardStore()
  const { speak } = useTTS(ttsSettings)
  const { symbols: photos, save, remove } = useCustomSymbols()
  // ?tab=kitchen opens a tab directly (handy for links and previews)
  const [tab, setTab] = useState<Tab>(() => {
    const t = new URLSearchParams(window.location.search).get('tab') as Tab | null
    return t && TABS.some((x) => x.id === t) ? t : 'home'
  })
  const [cameraShelf, setCameraShelf] = useState<string | null>(null)
  const talkCategory = currentCategory === 'my-photos' ? 'needs' : currentCategory

  const add = useCallback(
    (label: string, spokenText: string) => addToSentence({ uid: `${label}-${Date.now()}`, label, spokenText }),
    [addToSentence]
  )

  // Home: tap = "I want …" out loud, and the item joins the sentence strip
  const pick = useCallback((label: string, spokenText: string) => {
    add(label, spokenText)
    speak(`I want ${spokenText}`, ['I want', spokenText])
  }, [add, speak])

  // Zed's face in the header shows the feeling he taps, then settles back
  const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tapSymbol = useCallback((s: AACSymbol) => {
    add(s.label, s.spokenText)
    speak(s.spokenText)
    if (s.moodId) {
      setMascotState(s.moodId)
      if (moodTimer.current) clearTimeout(moodTimer.current)
      moodTimer.current = setTimeout(() => setMascotState('hopeful'), 6000)
    }
  }, [add, speak, setMascotState])
  const tapPhrase = useCallback((p: Phrase) => { add(p.label, p.spokenText); speak(p.spokenText) }, [add, speak])
  const speakSentence = useCallback(() => {
    speak(sentenceItems.map((i) => i.spokenText).join(' '), sentenceItems.map((i) => i.spokenText))
  }, [sentenceItems, speak])

  return (
    <div className="flex flex-col h-dvh bg-slate-50 overflow-hidden">
      <header className="px-4 py-2 bg-blue-900 flex items-center gap-3 shrink-0">
        <ZedMascot size="sm" />
        <h1 className="text-lg font-black text-white">Zed<span className="text-blue-300">Speaks</span></h1>
      </header>
      {tab !== 'type' && <SentenceStrip items={sentenceItems} onSpeak={speakSentence} onClear={clearSentence} onBackspace={backspace} />}

      {tab === 'home' && (
        <HomeTab photos={photos.filter((p) => p.shelf !== KITCHEN_SHELF)} onPick={pick} onFeel={tapSymbol} onAddPhoto={setCameraShelf} onDelete={remove} />
      )}
      {tab === 'kitchen' && (
        <KitchenTab dishes={photos.filter((p) => p.shelf === KITCHEN_SHELF)} speak={speak}
          onAddDish={() => setCameraShelf(KITCHEN_SHELF)} onDelete={remove} />
      )}
      {tab === 'talk' && (
        <>
          {talkCategory === 'phrases'
            ? <PhraseBoard onPhraseTap={tapPhrase} />
            : <CommunicationBoard symbols={getSymbolsByCategory(talkCategory)} currentCategory={talkCategory} onSymbolTap={tapSymbol} />}
          <CategoryNav categories={TALK_CATEGORIES} active={talkCategory} onChange={setCategory} />
        </>
      )}
      {tab === 'build' && <BuildTab onPiece={(t) => { add(t, t); speak(t) }} />}
      {tab === 'type' && <TypeTab speak={speak} />}
      {tab === 'me' && <MeTab />}

      <nav className="flex bg-white border-t border-slate-200 shrink-0" aria-label="Main">
        {TABS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-xs font-semibold ${tab === id ? 'text-blue-700' : 'text-slate-500'}`}
            aria-current={tab === id ? 'page' : undefined}>
            <Icon size={24} />
            {label}
          </button>
        ))}
      </nav>

      <VoiceSettings />
      <AnimatePresence>
        {cameraShelf && (
          <CameraCapture
            onSave={async (label, imageData) => { await save(label, imageData, cameraShelf); setCameraShelf(null) }}
            onClose={() => setCameraShelf(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
