import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, BookmarkPlus, Trash2, Mic } from 'lucide-react'
import { PHRASE_SECTIONS, getPhrasesByType } from '../../data/phrases'
import { PhraseButton } from './PhraseButton'
import { useBoardStore } from '../../store/boardStore'
import { useTTS } from '../../hooks/useTTS'
import type { Phrase } from '../../types'

interface PhraseBoardProps {
  onPhraseTap: (phrase: Phrase) => void
}

function TypeSayBar({ onPhraseTap }: { onPhraseTap: (p: Phrase) => void }) {
  const [text, setText] = useState('')
  const { ttsSettings, savedPhrases, savePhrase, deletePhrase } = useBoardStore()
  const { speak } = useTTS(ttsSettings)
  const inputRef = useRef<HTMLInputElement>(null)

  const canSpeak = text.trim().length > 0
  const alreadySaved = savedPhrases.some(
    (p) => p.spokenText.toLowerCase() === text.trim().toLowerCase()
  )

  const handleSpeak = () => {
    if (!canSpeak) return
    speak(text.trim())
  }

  const handleSave = () => {
    if (!canSpeak || alreadySaved) return
    savePhrase(text.trim(), text.trim())
    setText('')
    inputRef.current?.blur()
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 flex flex-col gap-2 shrink-0">
      <p className="text-xs font-black uppercase tracking-widest text-pink-600">
        Type anything to say it
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Mic size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); handleSpeak() }
            }}
            placeholder="Type a word or phrase…"
            maxLength={120}
            className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-pink-400 focus:bg-white transition-colors"
          />
        </div>

        <button
          onClick={handleSpeak}
          disabled={!canSpeak}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 text-white text-sm font-bold disabled:opacity-30 active:scale-95 transition-transform shrink-0"
          aria-label="Speak"
        >
          <Volume2 size={16} />
          Read it
        </button>
      </div>

      <button
        onClick={handleSave}
        disabled={!canSpeak || alreadySaved}
        className="flex items-center gap-2 w-full justify-center py-2 rounded-xl border-2 border-dashed border-pink-300 text-pink-600 text-sm font-semibold disabled:opacity-30 active:scale-95 transition-transform"
      >
        <BookmarkPlus size={16} />
        {alreadySaved ? 'Already saved' : 'Save as a phrase'}
      </button>

      {/* Saved phrases list */}
      {savedPhrases.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-1 border-t border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">My saved phrases</p>
          <AnimatePresence initial={false}>
            {savedPhrases.map((saved) => (
              <motion.div
                key={saved.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 bg-pink-50 rounded-xl px-3 py-2"
              >
                <button
                  onClick={() => onPhraseTap({ id: saved.id, label: saved.label, spokenText: saved.spokenText, type: 'complete' })}
                  className="flex-1 text-sm font-semibold text-gray-800 text-left leading-snug"
                >
                  {saved.label}
                </button>
                <button
                  onClick={() => speak(saved.spokenText)}
                  className="p-1.5 rounded-lg bg-green-100 text-green-700 shrink-0"
                  aria-label={`Speak: ${saved.label}`}
                >
                  <Volume2 size={13} />
                </button>
                <button
                  onClick={() => deletePhrase(saved.id)}
                  className="p-1.5 rounded-lg bg-red-100 text-red-500 shrink-0"
                  aria-label={`Delete: ${saved.label}`}
                >
                  <Trash2 size={13} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

export function PhraseBoard({ onPhraseTap }: PhraseBoardProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 px-3 py-3 flex flex-col gap-4">
      {/* Type & Say always at the top */}
      <TypeSayBar onPhraseTap={onPhraseTap} />

      {/* Built-in phrase sections */}
      {PHRASE_SECTIONS.map((section) => {
        const phrases = getPhrasesByType(section.type)
        return (
          <section key={section.type}>
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2 px-1">
              {section.title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {phrases.map((phrase) => (
                <PhraseButton key={phrase.id} phrase={phrase} onTap={onPhraseTap} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
