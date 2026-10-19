import { useState } from 'react'
import { GraduationCap, X } from 'lucide-react'
import { useTeachStore } from '../../store/teachStore'
import { useBoardStore } from '../../store/boardStore'
import { CATEGORIES } from '../../data/symbols'
import { MAX_FOCUS, findTeachSymbol, teachableSymbols, tipFor } from '../../data/teach'

/** Me tab: switch Teach mode on, pick this week's words, see tips and progress (on this phone only). */
export function TeachSettings({ onStart }: { onStart: () => void }) {
  const { on, focus, progress, setOn, toggleFocus, resetProgress } = useTeachStore()
  const character = useBoardStore((s) => s.character)
  const layout = useBoardStore((s) => s.layout)
  const [picking, setPicking] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const words = focus.map((id) => findTeachSymbol(id, character)).filter((s) => !!s)
  const all = teachableSymbols(character)
  const full = focus.length >= MAX_FOCUS

  return (
    <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <GraduationCap className="text-slate-700" size={20} aria-hidden />
        <p className="font-bold text-slate-900 flex-1">Teach mode</p>
        <button role="switch" aria-checked={on} aria-label="Teach mode"
          onClick={() => { setOn(!on); if (!on) onStart() }}
          className={`w-12 h-7 rounded-full p-1 transition-colors ${on ? 'bg-pink-600' : 'bg-slate-300'}`}>
          <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${on ? 'translate-x-5' : ''}`} />
        </button>
      </div>
      <p className="text-sm text-slate-600">
        For parents, teachers and therapists. Pick up to {MAX_FOCUS} words. They glow on the Talk board, so you can tap
        them while you talk. Then tap <b>Show me</b>: your child hears a word and finds it. To leave, hold <b>Hold to stop</b>.
      </p>
      {layout === 'classic' && <p className="text-sm text-amber-700">Teach mode works in the Tabs layout (Settings → Layout).</p>}

      <div className="flex flex-col gap-2">
        {words.map((s) => {
          const p = progress[s.id]
          return (
            <div key={s.id} className="p-3 rounded-xl bg-pink-50 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 flex-1">{s.label}</span>
                <span className="text-xs text-slate-600 tabular-nums">
                  {p ? `Found alone ${p.alone} · with a hint ${p.helped}` : 'Not practised yet'}
                </span>
                <button onClick={() => toggleFocus(s.id)} className="p-1 text-slate-500" aria-label={`Remove ${s.label}`}>
                  <X size={16} />
                </button>
              </div>
              <p className="text-xs text-slate-600">{tipFor(s)}</p>
            </div>
          )
        })}
      </div>

      <button onClick={() => setPicking(!picking)}
        className="py-2 rounded-xl border-2 border-dashed border-pink-300 text-pink-700 text-sm font-semibold">
        {picking ? 'Done picking' : full ? `Change words (${MAX_FOCUS} max)` : 'Pick words to teach'}
      </button>
      {picking && (
        <div className="flex flex-col gap-3">
          {CATEGORIES.filter((c) => c.id !== 'phrases' && c.id !== 'my-photos').map((c) => (
            <div key={c.id}>
              <p className="text-xs font-bold text-slate-500 pb-1">{c.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {all.filter((s) => s.category === c.id).map((s) => {
                  const picked = focus.includes(s.id)
                  return (
                    <button key={s.id} onClick={() => toggleFocus(s.id)} disabled={!picked && full}
                      aria-pressed={picked}
                      className={`px-3 h-8 rounded-full text-sm font-semibold border disabled:opacity-40 ${picked ? 'bg-pink-600 text-white border-pink-600' : 'bg-white text-slate-700 border-slate-200'}`}>
                      {s.label}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="flex-1">Progress stays on this phone. It is never sent anywhere.</span>
        {Object.keys(progress).length > 0 && (
          <button onClick={() => { if (confirmReset) { resetProgress(); setConfirmReset(false) } else setConfirmReset(true) }}
            className="underline">
            {confirmReset ? 'Tap again to clear' : 'Clear progress'}
          </button>
        )}
      </div>
    </div>
  )
}
