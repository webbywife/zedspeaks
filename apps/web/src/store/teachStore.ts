import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_FOCUS, MAX_FOCUS } from '../data/teach'

export interface WordProgress {
  /** Found on the first try in "Show me" */
  alone: number
  /** Found after a hint */
  helped: number
  last: number
}

interface TeachStore {
  on: boolean
  focus: string[]
  /** Kept on this device only: never sent to the server */
  progress: Record<string, WordProgress>
  /** "Show me" round in play (not saved) */
  target: string | null
  missed: boolean
  setOn: (on: boolean) => void
  toggleFocus: (id: string) => void
  ask: (id: string) => void
  miss: () => void
  found: () => void
  endRound: () => void
  resetProgress: () => void
}

export const useTeachStore = create<TeachStore>()(
  persist(
    (set, get) => ({
      on: false,
      focus: DEFAULT_FOCUS,
      progress: {},
      target: null,
      missed: false,
      setOn: (on) => set({ on, target: null, missed: false }),
      toggleFocus: (id) =>
        set((s) => ({
          focus: s.focus.includes(id)
            ? s.focus.filter((f) => f !== id)
            : s.focus.length < MAX_FOCUS ? [...s.focus, id] : s.focus,
        })),
      ask: (target) => set({ target, missed: false }),
      miss: () => set({ missed: true }),
      found: () => {
        const { target, missed, progress } = get()
        if (!target) return
        const p = progress[target] ?? { alone: 0, helped: 0, last: 0 }
        set({
          target: null,
          missed: false,
          progress: { ...progress, [target]: missed
            ? { ...p, helped: p.helped + 1, last: Date.now() }
            : { ...p, alone: p.alone + 1, last: Date.now() } },
        })
      },
      endRound: () => set({ target: null, missed: false }),
      resetProgress: () => set({ progress: {} }),
    }),
    {
      name: 'zedspeaks-teach',
      partialize: (s) => ({ on: s.on, focus: s.focus, progress: s.progress }),
    }
  )
)
