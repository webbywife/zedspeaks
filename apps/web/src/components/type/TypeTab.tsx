import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Delete, Volume2, X } from 'lucide-react'
import { LETTER_ROWS, NUMBER_ROW, SPACE, SYMBOL_ROW, type Key } from '../../data/keyboard'
import { SYMBOLS, cardImage } from '../../data/symbols'
import { librarySrc, loadLibrary, searchLibrary } from '../../data/library'

interface TypeTabProps {
  speak: (text: string) => void
}

const SAY_KEYS = 'zedspeaks-say-keys'

function loadSayKeys() {
  try { return localStorage.getItem(SAY_KEYS) !== 'off' } catch { return true }
}

/** Type and talk: each key says its name, Speak reads the whole text. Picture hints help with spelling. */
export function TypeTab({ speak }: TypeTabProps) {
  const [text, setText] = useState('')
  const [sayKeys, setSayKeys] = useState(loadSayKeys)
  const [libraryReady, setLibraryReady] = useState(false)
  useEffect(() => { loadLibrary().then(() => setLibraryReady(true)) }, [])

  const toggleSayKeys = () => {
    const next = !sayKeys
    setSayKeys(next)
    try { localStorage.setItem(SAY_KEYS, next ? 'on' : 'off') } catch { /* private mode */ }
  }

  const press = (k: Key) => {
    // Letters go in lower case after the first letter of a word, like a phone keyboard
    const startOfWord = text === '' || /[\s.!?]$/.test(text)
    setText(text + (/^[A-Z]$/.test(k.label) && !startOfWord ? k.label.toLowerCase() : k.label))
    if (sayKeys) speak(k.spoken)
  }
  const space = () => { setText(text + ' '); if (sayKeys) speak(SPACE) }
  const backspace = () => setText(text.slice(0, -1))

  // Picture hints for the word being typed (e.g. "ap" → Apple)
  const word = text.split(/\s+/).pop()?.toLowerCase() ?? ''
  // App cards first (Zed's own pictures), then the Mulberry library
  const own = word
    ? SYMBOLS.filter((s) => s.category !== 'people' && s.label.toLowerCase().startsWith(word))
        .map((s) => ({ key: s.id, label: s.label, src: s.customImageUrl ?? cardImage(s.id).src }))
    : []
  const lib = libraryReady && word.length >= 2
    ? searchLibrary(word).filter((l) => !own.some((o) => o.label.toLowerCase() === l.w.toLowerCase()))
        .map((l) => ({ key: l.f, label: l.w, src: librarySrc(l) }))
    : []
  const hints = [...own, ...lib].slice(0, 8)
  const pickHint = (label: string) => {
    const next = text.slice(0, text.length - word.length) + label + ' '
    setText(next)
    speak(label)
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">
      <div className="flex items-start gap-2 px-3 py-3 bg-white border-b border-slate-200">
        <p className="flex-1 min-w-0 min-h-[56px] text-2xl font-bold text-slate-900 break-words leading-snug">
          {text || <span className="text-slate-400 text-base font-medium italic">Type a word…</span>}
          <span className="inline-block w-0.5 h-6 bg-pink-600 align-middle animate-pulse ml-0.5" />
        </p>
        <button onClick={() => setText('')} disabled={!text} aria-label="Clear"
          className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center disabled:opacity-30">
          <X size={20} />
        </button>
        <button onClick={() => speak(text)} disabled={!text.trim()}
          className="flex items-center gap-2 px-4 h-11 rounded-xl bg-pink-600 text-white font-bold disabled:opacity-30">
          <Volume2 size={18} /> Speak
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto px-3 py-2 min-h-[64px]" style={{ scrollbarWidth: 'none' }}>
        {hints.map((s) => (
          <button key={s.key} onClick={() => pickHint(s.label)}
            className="shrink-0 flex items-center gap-2 pl-1 pr-3 h-12 rounded-xl bg-white border border-slate-200 shadow-sm font-semibold text-slate-800">
            <img src={s.src} alt="" className="w-10 h-10 rounded-lg object-contain bg-white" />
            {s.label}
          </button>
        ))}
      </div>

      <div className="mt-auto px-1.5 pb-2 space-y-1.5">
        <Row keys={NUMBER_ROW} onPress={press} tone="number" />
        {LETTER_ROWS.map((row, i) => <Row key={i} keys={row} onPress={press} tone="letter" />)}
        <div className="flex gap-1">
          <Row keys={SYMBOL_ROW} onPress={press} tone="symbol" />
        </div>
        <div className="flex gap-1.5">
          <button onClick={toggleSayKeys}
            className={`px-3 h-12 rounded-xl text-xs font-bold ${sayKeys ? 'bg-pink-100 text-pink-700' : 'bg-slate-200 text-slate-500'}`}>
            {sayKeys ? 'Keys talk' : 'Keys quiet'}
          </button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={space}
            className="flex-1 h-12 rounded-xl bg-white border border-slate-300 shadow-sm font-semibold text-slate-500">
            space
          </motion.button>
          <button onClick={backspace} disabled={!text} aria-label="Delete"
            className="w-16 h-12 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center disabled:opacity-40">
            <Delete size={22} />
          </button>
        </div>
      </div>
    </div>
  )
}

const TONES = {
  number: 'bg-pink-50 border-pink-200 text-pink-700',
  letter: 'bg-white border-slate-300 text-slate-900',
  symbol: 'bg-amber-50 border-amber-200 text-amber-900',
}

function Row({ keys, onPress, tone }: { keys: Key[]; onPress: (k: Key) => void; tone: keyof typeof TONES }) {
  return (
    <div className="flex justify-center gap-1 w-full">
      {keys.map((k) => (
        <motion.button key={k.label} whileTap={{ scale: 0.88 }} onClick={() => onPress(k)} aria-label={k.spoken}
          className={`flex-1 max-w-[3.25rem] h-12 rounded-xl border shadow-sm text-xl font-bold ${TONES[tone]}`}>
          {k.label}
        </motion.button>
      ))}
    </div>
  )
}
