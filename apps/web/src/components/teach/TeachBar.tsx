import { useRef } from 'react'
import { GraduationCap, Play, X } from 'lucide-react'
import { useTeachStore } from '../../store/teachStore'
import { useBoardStore } from '../../store/boardStore'
import { findTeachSymbol } from '../../data/teach'
import type { CategoryId } from '../../types'

interface TeachBarProps {
  onShowMe: () => void
  onJump: (category: CategoryId) => void
}

/** Adult strip above the Talk board while Teach mode is on. Leaving needs a 1-second hold. */
export function TeachBar({ onShowMe, onJump }: TeachBarProps) {
  const { focus, target, missed, setOn, endRound } = useTeachStore()
  const character = useBoardStore((s) => s.character)
  const words = focus.map((id) => findTeachSymbol(id, character)).filter((s) => !!s)
  const asked = target ? findTeachSymbol(target, character) : undefined
  const hold = useRef<ReturnType<typeof setTimeout> | null>(null)
  const release = () => { if (hold.current) clearTimeout(hold.current); hold.current = null }

  return (
    <div className="bg-pink-50 border-b border-pink-100 px-3 py-2 flex flex-col gap-2 shrink-0">
      <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        <GraduationCap className="text-pink-700 shrink-0" size={20} aria-hidden />
        <span className="text-sm font-bold text-pink-800 shrink-0">Teaching</span>
        {words.length === 0 && <span className="text-sm text-slate-600">Pick words in the Me tab</span>}
        {words.map((s) => (
          <button key={s.id} onClick={() => onJump(s.category)}
            className={`shrink-0 px-3 h-9 rounded-full text-sm font-bold border ${s.id === target ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-pink-800 border-pink-200'}`}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <p className="flex-1 min-w-0 text-xs text-slate-700">
          {asked
            ? <>Waiting for <b>{asked.label}</b>{missed ? ' (shown with a hint)' : ''}. <button onClick={endRound} className="underline">Skip</button></>
            : words.length ? 'Tap the glowing words while you talk.' : null}
        </p>
        {words.length > 0 && (
          <button onClick={onShowMe}
            className="shrink-0 flex items-center gap-1 px-4 h-9 rounded-full bg-pink-600 text-white text-sm font-bold active:scale-95 transition-transform">
            <Play size={16} aria-hidden /> {target ? 'Next' : 'Show me'}
          </button>
        )}
        <button
          onPointerDown={() => { hold.current = setTimeout(() => setOn(false), 1000) }}
          onPointerUp={release} onPointerLeave={release} onPointerCancel={release}
          onContextMenu={(e) => e.preventDefault()}
          className="shrink-0 flex items-center gap-1 px-3 h-9 rounded-full bg-white text-slate-600 text-xs font-semibold border border-slate-200 select-none"
          aria-label="Hold to stop teaching">
          <X size={14} aria-hidden /> Hold to stop
        </button>
      </div>
    </div>
  )
}
