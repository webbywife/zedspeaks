import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useBoardStore } from '../../store/boardStore'
import type { MoodId } from '../../types'

const MOOD_LABELS: Record<MoodId, string> = {
  joy:       'Joy',
  sad:       'Sad',
  disgust:   'Disgust',
  fear:      'Fear',
  angry:     'Angry',
  hopeful:   'Hopeful',
  curious:   'Curious',
  surprised: 'Surprised',
  relaxed:   'Relaxed',
  excited:   'Excited',
  laughing:  'Laughing',
}

interface ZedMascotProps {
  size?: 'sm' | 'md'
}

export function ZedMascot({ size = 'md' }: ZedMascotProps) {
  const { mascotMood, narratorText, setMascotState } = useBoardStore()

  // Auto-clear narrator text after 3s
  useEffect(() => {
    if (!narratorText) return
    const t = setTimeout(() => setMascotState(mascotMood, null), 3000)
    return () => clearTimeout(t)
  }, [narratorText, mascotMood, setMascotState])

  const dim = size === 'sm' ? 'w-9 h-9' : 'w-11 h-11'

  return (
    <div className="flex items-center gap-2 relative">
      {/* Mood portrait */}
      <div className={`${dim} rounded-full overflow-hidden border-2 border-blue-400 shrink-0 shadow-sm`}>
        <AnimatePresence mode="wait">
          <motion.img
            key={mascotMood}
            src={`/assets/moods/${mascotMood}.png`}
            alt={`Zed is ${MOOD_LABELS[mascotMood]}`}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            className="w-full h-full object-cover object-top"
          />
        </AnimatePresence>
      </div>

      {/* Speech bubble */}
      <AnimatePresence>
        {narratorText && (
          <motion.div
            initial={{ opacity: 0, x: -6, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -6, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute left-12 top-1/2 -translate-y-1/2 bg-white rounded-2xl rounded-tl-sm px-3 py-1.5 shadow-lg z-10 whitespace-nowrap pointer-events-none"
          >
            <span className="text-xs font-semibold text-gray-700">{narratorText}</span>
            {/* Tail */}
            <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 rounded-sm" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
