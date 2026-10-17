import { CHARACTERS } from '../../data/characters'
import { useBoardStore } from '../../store/boardStore'

/** Header shortcut: swap between the boy and girl character (faces and voice) in one tap. */
export function CharacterSwitch({ className = '' }: { className?: string }) {
  const character = useBoardStore((s) => s.character)
  const setCharacter = useBoardStore((s) => s.setCharacter)

  return (
    <div role="radiogroup" aria-label="Character" className={`flex items-center gap-1 p-1 rounded-full bg-pink-50 ${className}`}>
      {CHARACTERS.map((ch) => {
        const on = character === ch.id
        return (
          <button key={ch.id} role="radio" aria-checked={on} aria-label={`${ch.hint} (${ch.label.toLowerCase()})`}
            onClick={() => setCharacter(ch.id)}
            className={`flex items-center gap-1.5 h-9 pl-0.5 pr-3 rounded-full text-sm font-bold transition-colors duration-150 ${
              on ? 'bg-pink-600 text-white' : 'text-pink-700 hover:bg-pink-100'
            }`}>
            <img src={ch.face} alt="" className="w-8 h-8 rounded-full object-cover bg-white" />
            {ch.hint}
          </button>
        )
      })}
    </div>
  )
}
