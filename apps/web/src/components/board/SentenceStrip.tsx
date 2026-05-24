import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, Delete, X, Mic } from 'lucide-react'
import type { SentenceItem } from '../../types'

interface SentenceStripProps {
  items: SentenceItem[]
  onSpeak: () => void
  onClear: () => void
  onBackspace: () => void
}

export function SentenceStrip({ items, onSpeak, onClear, onBackspace }: SentenceStripProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
    }
  }, [items])

  const isEmpty = items.length === 0

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-gray-200 shadow-sm">
      {/* Sentence chips */}
      <div
        ref={scrollRef}
        className="flex-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none min-h-[48px] py-1"
        style={{ scrollbarWidth: 'none' }}
      >
        {isEmpty ? (
          <span className="text-gray-400 text-sm italic px-1 flex items-center gap-1.5">
            <Mic size={14} />
            Tap symbols to build a message…
          </span>
        ) : (
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.span
                key={item.uid}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm whitespace-nowrap shrink-0"
              >
                {item.label}
              </motion.span>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onBackspace}
          disabled={isEmpty}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-100 text-amber-700 disabled:opacity-30 active:scale-95 transition-transform"
          aria-label="Remove last word"
        >
          <Delete size={18} />
        </button>
        <button
          onClick={onClear}
          disabled={isEmpty}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 text-red-700 disabled:opacity-30 active:scale-95 transition-transform"
          aria-label="Clear sentence"
        >
          <X size={18} />
        </button>
        <button
          onClick={onSpeak}
          disabled={isEmpty}
          className="flex items-center gap-2 px-4 h-10 rounded-xl bg-green-600 text-white font-bold text-sm disabled:opacity-30 active:scale-95 transition-transform shadow-sm"
          aria-label="Speak sentence"
        >
          <Volume2 size={18} />
          Speak
        </button>
      </div>
    </div>
  )
}
