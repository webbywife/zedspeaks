// Teach mode: an adult models focus words on the child's own Talk board, then plays "Show me".
// Words stay where they always are (motor planning), they only glow while being taught.
import type { AACSymbol } from '../types'
import type { CharacterId } from './characters'
import { SYMBOLS } from './symbols'
import { feelingSymbols } from './characters'

const say = (s: string) => s // recorded by scripts/make_voice.py

export const TEACH_LINES = {
  showMe: say('Show me'),
  found: say('You found it!'),
  hereItIs: say('Here it is'),
}

export const MAX_FOCUS = 5
export const DEFAULT_FOCUS = ['help', 'more', 'stop']

/** Every Talk card an adult can pick to teach (feelings follow the chosen character) */
export function teachableSymbols(character: CharacterId): AACSymbol[] {
  return [...SYMBOLS.filter((s) => s.category !== 'phrases'), ...feelingSymbols(character)]
}

export function findTeachSymbol(id: string, character: CharacterId): AACSymbol | undefined {
  return teachableSymbols(character).find((s) => s.id === id)
}

/** The word said after "Show me": the recorded word, or the label when the card says a sentence */
export function promptWord(s: AACSymbol): string {
  return /^i (am|want|need|feel)\b/i.test(s.spokenText) ? s.label.toLowerCase() : s.spokenText
}

// Short coaching for the adult (never shown to the child). Modelling = tap it while you say it.
const TIPS: Record<string, string> = {
  help: 'Pause before you help with a jar, a shoe or a toy. Say "help" and tap Help, then help right away.',
  more: 'Give small portions or one block at a time. Each time you give more, say "more" and tap More.',
  stop: 'During tickles, swinging or a song, tap Stop and stop at once. Then wait, and start again.',
  yes: 'Offer something you know they want. Say "yes" and tap Yes as you hand it over.',
  no: 'Offer something they don\'t want. Tap No and take it away right away. Respect every "no".',
  eat: 'Before snacks and meals, say "eat" and tap Eat. Keep the board on the table.',
  drink: 'Keep the cup in sight but out of reach. Tap Drink while you say it, then give the drink.',
  bathroom: 'Tap Bathroom every time you go, at the same times each day, before you walk there.',
  pain: 'When they bump something, tap Hurt and say "you are hurt". This one can keep them safe.',
  please: 'Model it, don\'t demand it. Tap Please when you ask them for something.',
  thanks: 'Tap Thank you when they hand you something. Children copy what they see often.',
  break: 'When they look overwhelmed, tap Break, say "break" and go somewhere calm together.',
  hug: 'Before a hug, say "hug" and tap Hug, so they learn they can ask for one.',
}

export function tipFor(s: AACSymbol): string {
  return TIPS[s.id] ??
    `Say "${s.label.toLowerCase()}" and tap ${s.label} every time it comes up today. Don't ask them to copy yet: just show them, many times.`
}
