import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'

interface PictureCardProps {
  label: string
  src: string
  emoji?: string
  photo?: boolean
  wide?: boolean
  onTap: () => void
  onDelete?: () => void
}

/** One tappable picture: a built-in icon or the family's own photo. Hold to delete own photos. */
export function PictureCard({ label, src, emoji, photo, wide, onTap, onDelete }: PictureCardProps) {
  const [failed, setFailed] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startHold = () => { if (onDelete) timer.current = setTimeout(() => setConfirm(true), 600) }
  const endHold = () => { if (timer.current) clearTimeout(timer.current) }

  return (
    <div className={`relative shrink-0 ${wide ? 'w-full' : 'w-28'}`}>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => { if (!confirm) onTap() }}
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        onContextMenu={(e) => { if (onDelete) { e.preventDefault(); setConfirm(true) } }}
        className="flex flex-col w-full rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden text-left select-none"
        aria-label={label}
      >
        <div className={`w-full ${wide ? 'aspect-[4/3]' : 'aspect-square'} relative overflow-hidden bg-white flex items-center justify-center`}>
          {failed ? (
            <span className="text-4xl" aria-hidden>{emoji}</span>
          ) : (
            <img
              src={src}
              alt=""
              onError={() => setFailed(true)}
              className={photo ? 'absolute inset-0 w-full h-full object-cover object-[center_65%]' : 'w-[92%] h-[92%] object-contain'}
              loading="lazy"
            />
          )}
        </div>
        <span className="px-2 py-1.5 text-sm font-semibold text-slate-800 leading-tight line-clamp-2">{label}</span>
      </motion.button>
      {confirm && (
        <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center gap-2">
          <button onClick={onDelete} className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-xl">
            <Trash2 size={14} /> Delete
          </button>
          <button onClick={() => setConfirm(false)} className="text-white text-xs underline">Cancel</button>
        </div>
      )}
    </div>
  )
}
