import { motion } from 'framer-motion'
import { MessageSquare, Sparkles, ChevronsRight } from 'lucide-react'
import type { Phrase, PhraseType } from '../../types'

const TYPE_STYLES: Record<PhraseType, { bg: string; border: string; icon: React.ReactNode; badge: string }> = {
  greeting: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-400',
    icon: <MessageSquare size={16} className="text-yellow-600 shrink-0" />,
    badge: 'bg-yellow-100 text-yellow-700',
  },
  complete: {
    bg: 'bg-green-50',
    border: 'border-green-400',
    icon: <Sparkles size={16} className="text-green-600 shrink-0" />,
    badge: 'bg-green-100 text-green-700',
  },
  starter: {
    bg: 'bg-pink-50',
    border: 'border-pink-400',
    icon: <ChevronsRight size={16} className="text-pink-600 shrink-0" />,
    badge: 'bg-pink-100 text-pink-700',
  },
}

interface PhraseButtonProps {
  phrase: Phrase
  onTap: (phrase: Phrase) => void
}

export function PhraseButton({ phrase, onTap }: PhraseButtonProps) {
  const style = TYPE_STYLES[phrase.type]

  return (
    <motion.button
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      onClick={() => onTap(phrase)}
      className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border-2 min-h-[56px] w-full text-left cursor-pointer select-none focus:outline-none focus-visible:ring-2 ${style.bg} ${style.border}`}
      aria-label={phrase.label}
    >
      {style.icon}
      <span className="flex-1 text-sm font-bold text-gray-800 leading-snug">
        {phrase.label}
      </span>
      {phrase.type === 'starter' && (
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${style.badge}`}>
          ADD MORE
        </span>
      )}
    </motion.button>
  )
}
