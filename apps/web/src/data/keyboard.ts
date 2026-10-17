// Type tab keys. Every say('…') string here is pre-recorded by scripts/make_voice.py,
// so each key speaks its own name in the app voice.
const say = (s: string) => s

export interface Key {
  label: string // what the key shows and types
  spoken: string // what it says when tapped
}

const letter = (l: string, spoken: string): Key => ({ label: l, spoken })
const sym = (label: string, spoken: string): Key => ({ label, spoken })

export const NUMBER_ROW: Key[] = [
  sym('1', say('one')), sym('2', say('two')), sym('3', say('three')), sym('4', say('four')), sym('5', say('five')),
  sym('6', say('six')), sym('7', say('seven')), sym('8', say('eight')), sym('9', say('nine')), sym('0', say('zero')),
]

// Same rows as a phone keyboard, which Zed already knows
export const LETTER_ROWS: Key[][] = [
  [letter('Q', say('Q.')), letter('W', say('W.')), letter('E', say('E.')), letter('R', say('R.')), letter('T', say('T.')),
   letter('Y', say('Y.')), letter('U', say('U.')), letter('I', say('I.')), letter('O', say('O.')), letter('P', say('P.'))],
  [letter('A', say('A.')), letter('S', say('S.')), letter('D', say('D.')), letter('F', say('F.')), letter('G', say('G.')),
   letter('H', say('H.')), letter('J', say('J.')), letter('K', say('K.')), letter('L', say('L.'))],
  [letter('Z', say('Z.')), letter('X', say('X.')), letter('C', say('C.')), letter('V', say('V.')), letter('B', say('B.')),
   letter('N', say('N.')), letter('M', say('M.'))],
]

export const SYMBOL_ROW: Key[] = [
  sym('.', say('period')), sym(',', say('comma')), sym('?', say('question mark')), sym('!', say('exclamation mark')),
  sym('+', say('plus')), sym('-', say('minus')), sym('=', say('equals')), sym('@', say('at')),
  sym('&', say('and')), sym('$', say('dollar')), sym('%', say('percent')), sym('#', say('hashtag')),
]

export const SPACE = say('space')
