// Home tab sentences. Each card has a "thing" form (I want ___) and a "doing" form (I want to ___),
// so every starter makes a correct sentence. scripts/make_voice.py records every combination.
import type { SHELVES } from './shelves'

type ShelfId = (typeof SHELVES)[number]['id']

export interface CardPhrase {
  thing: string // "a cookie", "Mom", or "to go home" for places and activities
  doing: string // "eat a cookie", "go to the park", "see Mom"
  auto: 'thing' | 'doing' // the natural sentence when no starter is picked
}

const p = (thing: string, doing: string, auto: CardPhrase['auto']): CardPhrase => ({ thing, doing, auto })

export const CARD_PHRASES: Record<string, CardPhrase> = {
  // toys
  blocks: p('my blocks', 'play with my blocks', 'doing'),
  toycars: p('my toy cars', 'play with my toy cars', 'doing'),
  car: p('the car', 'ride in the car', 'doing'),
  play: p('a game', 'play', 'doing'),
  read: p('a book', 'read a book', 'doing'),
  // snacks
  cookie: p('a cookie', 'eat a cookie', 'thing'),
  juice: p('juice', 'drink juice', 'thing'),
  milk: p('milk', 'drink milk', 'thing'),
  apple: p('an apple', 'eat an apple', 'thing'),
  banana: p('a banana', 'eat a banana', 'thing'),
  icecream: p('ice cream', 'eat ice cream', 'thing'),
  water: p('water', 'drink water', 'thing'),
  // watch & play
  watch: p('to watch TV', 'watch TV', 'doing'),
  listen: p('to listen to music', 'listen to music', 'doing'),
  outside: p('to go outside', 'go outside', 'doing'),
  // places
  park: p('to go to the park', 'go to the park', 'doing'),
  store: p('to go to the store', 'go to the store', 'doing'),
  home: p('to go home', 'go home', 'doing'),
  school: p('to go to school', 'go to school', 'doing'),
  // people
  mom: p('Mom', 'see Mom', 'thing'),
  dad: p('Dad', 'see Dad', 'thing'),
  sister: p('my sister', 'play with my sister', 'thing'),
  brother: p('my brother', 'play with my brother', 'thing'),
  friend: p('my friend', 'play with my friend', 'thing'),
  teacher: p('my teacher', 'see my teacher', 'thing'),
}

export interface Starter { id: string; text: string; uses: 'thing' | 'doing' }

export const STARTERS: Starter[] = [
  { id: 'want', text: 'I want', uses: 'thing' },
  { id: 'wantto', text: 'I want to', uses: 'doing' },
  { id: 'dontwant', text: "I don't want", uses: 'thing' },
  { id: 'like', text: 'I like', uses: 'thing' },
]

// Family photos have only a name: build both forms from the shelf they're on
const PHOTO_DOING: Record<string, (name: string) => string> = {
  toys: (n) => `play with ${n}`,
  snacks: (n) => `eat ${n}`,
  watch: (n) => `watch ${n}`,
  places: (n) => `go to ${n}`,
  people: (n) => `see ${n}`,
}
const PHOTO_AUTO: Record<string, CardPhrase['auto']> = { toys: 'thing', snacks: 'thing', watch: 'doing', places: 'doing', people: 'thing' }

export function photoPhrase(name: string, shelf: ShelfId | string | undefined): CardPhrase {
  const s = shelf ?? 'toys'
  const doing = (PHOTO_DOING[s] ?? PHOTO_DOING.toys)(name)
  const auto = PHOTO_AUTO[s] ?? 'thing'
  // places and activities read best as actions: "I don't want to go to Grandma's house"
  return { thing: auto === 'doing' ? `to ${doing}` : name, doing, auto }
}

/** The sentence a card says, with the chosen starter (or its natural one) */
export function sentenceFor(phrase: CardPhrase, starter: Starter | null): string {
  if (!starter) return phrase.auto === 'doing' ? `I want to ${phrase.doing}` : `I want ${phrase.thing}`
  return `${starter.text} ${starter.uses === 'doing' ? phrase.doing : phrase.thing}`
}
