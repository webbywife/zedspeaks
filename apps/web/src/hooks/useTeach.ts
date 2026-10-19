import { useCallback } from 'react'
import { useTeachStore } from '../store/teachStore'
import { useBoardStore } from '../store/boardStore'
import { TEACH_LINES, findTeachSymbol, promptWord } from '../data/teach'
import type { AACSymbol, CategoryId } from '../types'

type Speak = (text: string, parts?: string[]) => void

/** "Show me": the app asks for a focus word; a right tap cheers, any other tap gently shows the way. */
export function useTeach(speak: Speak, setCategory: (c: CategoryId) => void) {
  const character = useBoardStore((s) => s.character)

  const showMe = useCallback(() => {
    const { focus, target, ask } = useTeachStore.getState()
    const pool = focus.length > 1 ? focus.filter((f) => f !== target) : focus
    const id = pool[Math.floor(Math.random() * pool.length)]
    const s = id && findTeachSymbol(id, character)
    if (!s) return
    setCategory(s.category)
    ask(s.id)
    const w = promptWord(s)
    speak(`${TEACH_LINES.showMe} ${w}`, [TEACH_LINES.showMe, w])
  }, [character, setCategory, speak])

  /** True when the tap was part of a "Show me" round (the caller then skips its usual speech) */
  const onTap = useCallback((s: AACSymbol): boolean => {
    const { on, target, found, miss } = useTeachStore.getState()
    if (!on || !target) return false
    const w = promptWord(s)
    if (s.id === target) {
      found()
      speak(`${w} ${TEACH_LINES.found}`, [w, TEACH_LINES.found])
    } else {
      // Their word still counts: say it, then point to the one we asked for (no "wrong" sound)
      miss()
      speak(`${w} ${TEACH_LINES.hereItIs}`, [w, TEACH_LINES.hereItIs])
    }
    return true
  }, [speak])

  return { showMe, onTap }
}
