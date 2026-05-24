import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, Trash2 } from 'lucide-react'
import type { CustomSymbol } from '../../types'

function PhotoCard({ sym, onTap, onDelete }: {
  sym: CustomSymbol
  onTap: (s: CustomSymbol) => void
  onDelete: (id: string) => void
}) {
  const [showDelete, setShowDelete] = useState(false)
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handlePointerDown = () => {
    pressTimer.current = setTimeout(() => setShowDelete(true), 600)
  }
  const handlePointerUp = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current)
  }

  return (
    <div className="relative">
      <motion.button
        whileTap={{ scale: 0.88 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        onClick={() => { if (!showDelete) onTap(sym) }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onContextMenu={(e) => { e.preventDefault(); setShowDelete(true) }}
        className="flex flex-col items-center gap-1 w-full min-h-[72px] rounded-2xl bg-white shadow-sm border-2 border-teal-500 overflow-hidden cursor-pointer select-none"
        aria-label={sym.label}
      >
        <div className="w-full overflow-hidden">
          <img src={sym.imageData} alt={sym.label} className="w-full h-20 object-cover" />
        </div>
        <span className="text-[11px] font-bold text-teal-700 px-1 pb-1.5 text-center leading-tight line-clamp-2 w-full">
          {sym.label}
        </span>
      </motion.button>

      {showDelete && (
        <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center gap-2 z-10">
          <button
            onClick={() => onDelete(sym.id)}
            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-xl"
          >
            <Trash2 size={14} /> Delete
          </button>
          <button onClick={() => setShowDelete(false)} className="text-white text-xs underline">
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}

interface MyPhotosBoardProps {
  symbols: CustomSymbol[]
  onTap: (sym: CustomSymbol) => void
  onDelete: (id: string) => void
  onOpenCamera: () => void
}

export function MyPhotosBoard({ symbols, onTap, onDelete, onOpenCamera }: MyPhotosBoardProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-slate-100 p-3 flex flex-col gap-3">
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={onOpenCamera}
        className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl border-2 border-dashed border-teal-400 bg-teal-50 text-teal-700 font-bold text-sm shrink-0"
      >
        <Camera size={20} />
        Take a photo to add it here
      </motion.button>

      {symbols.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 gap-2 py-12">
          <Camera size={48} className="opacity-30" />
          <p className="text-sm font-medium">No photos yet</p>
          <p className="text-xs">Tap the button above to add your first photo!</p>
        </div>
      ) : (
        <>
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))' }}>
            {symbols.map((sym) => (
              <PhotoCard key={sym.id} sym={sym} onTap={onTap} onDelete={onDelete} />
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 pb-1">Hold a photo to delete it</p>
        </>
      )}
    </div>
  )
}
