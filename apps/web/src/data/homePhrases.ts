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
  // more toys
  doll: p('my doll', 'play with my doll', 'thing'),
  dollhouse: p('my dollhouse', 'play with my dollhouse', 'thing'),
  teaset: p('my tea set', 'play tea party', 'thing'),
  bunny: p('my bunny', 'hug my bunny', 'thing'),
  unicorn: p('my unicorn', 'play with my unicorn', 'thing'),
  hairclip: p('my hair bow', 'wear my hair bow', 'thing'),
  bracelet: p('my bracelet', 'make a bracelet', 'thing'),
  stickers: p('stickers', 'play with stickers', 'thing'),
  jumprope: p('my jump rope', 'jump rope', 'thing'),
  playkitchen: p('my play kitchen', 'play kitchen', 'thing'),
  dressup: p('my dress-up clothes', 'play dress-up', 'thing'),
  playdough: p('play dough', 'play with play dough', 'thing'),
  bubbles: p('bubbles', 'blow bubbles', 'thing'),
  kite: p('my kite', 'fly my kite', 'thing'),
  stroller: p('my doll stroller', 'push my doll stroller', 'thing'),
  // more snacks and meals
  chicken: p('chicken', 'eat chicken', 'thing'),
  eggs: p('eggs', 'eat eggs', 'thing'),
  pizza: p('pizza', 'eat pizza', 'thing'),
  sandwich: p('a sandwich', 'eat a sandwich', 'thing'),
  rice: p('rice', 'eat rice', 'thing'),
  noodles: p('noodles', 'eat noodles', 'thing'),
  soup: p('soup', 'eat soup', 'thing'),
  spaghetti: p('spaghetti', 'eat spaghetti', 'thing'),
  burger: p('a burger', 'eat a burger', 'thing'),
  hotdog: p('a hotdog', 'eat a hotdog', 'thing'),
  pancakes: p('pancakes', 'eat pancakes', 'thing'),
  fish: p('fish', 'eat fish', 'thing'),
  cereal: p('cereal', 'eat cereal', 'thing'),
  mango: p('a mango', 'eat a mango', 'thing'),
  watermelon: p('watermelon', 'eat watermelon', 'thing'),
  orange: p('an orange', 'eat an orange', 'thing'),
  grapes: p('grapes', 'eat grapes', 'thing'),
  crackers: p('crackers', 'eat crackers', 'thing'),
  candy: p('candy', 'eat candy', 'thing'),
  cake: p('cake', 'eat cake', 'thing'),
  chocolate: p('chocolate', 'eat chocolate', 'thing'),
  yogurt: p('yogurt', 'eat yogurt', 'thing'),
  // more to do
  dance: p('to dance', 'dance', 'doing'),
  swim: p('to swim', 'swim', 'doing'),
  bike: p('my bike', 'ride my bike', 'doing'),
  jump: p('to jump', 'jump', 'doing'),
  cook: p('to cook', 'cook with you', 'doing'),
  walk: p('a walk', 'go for a walk', 'doing'),
  music: p('music', 'listen to music', 'thing'),
  // more places
  playground: p('to go to the playground', 'go to the playground', 'doing'),
  beach: p('to go to the beach', 'go to the beach', 'doing'),
  pool: p('to go to the pool', 'go to the pool', 'doing'),
  mall: p('to go to the mall', 'go to the mall', 'doing'),
  church: p('to go to church', 'go to church', 'doing'),
  restaurant: p('to eat out', 'eat at a restaurant', 'doing'),
  grandparents: p('my grandparents', 'visit my grandparents', 'thing'),
  // what I need
  bathroom: p('the bathroom', 'go to the bathroom', 'doing'),
  help: p('help', 'get help', 'thing'),
  hug: p('a hug', 'give you a hug', 'thing'),
  break: p('a break', 'take a break', 'thing'),
  sleep: p('to sleep', 'sleep', 'doing'),
  washhands: p('to wash my hands', 'wash my hands', 'doing'),
  brushteeth: p('to brush my teeth', 'brush my teeth', 'doing'),
  bath: p('a bath', 'take a bath', 'thing'),
  dress: p('my clothes', 'get dressed', 'doing'),
}

export interface Starter { id: string; text: string; uses: 'thing' | 'doing' }

export const STARTERS: Starter[] = [
  { id: 'want', text: 'I want', uses: 'thing' },
  { id: 'wantto', text: 'I want to', uses: 'doing' },
  { id: 'dontwant', text: "I don't want", uses: 'thing' },
  { id: 'like', text: 'I like', uses: 'thing' },
  { id: 'need', text: 'I need', uses: 'thing' },
  { id: 'needto', text: 'I need to', uses: 'doing' },
]

// Family photos have only a name: build both forms from the shelf they're on
const PHOTO_DOING: Record<string, (name: string) => string> = {
  toys: (n) => `play with ${n}`,
  snacks: (n) => `eat ${n}`,
  meals: (n) => `eat ${n}`,
  needs: (n) => `have ${n}`,
  watch: (n) => `watch ${n}`,
  places: (n) => `go to ${n}`,
  people: (n) => `see ${n}`,
}
const PHOTO_AUTO: Record<string, CardPhrase['auto']> = { toys: 'thing', snacks: 'thing', meals: 'thing', needs: 'thing', watch: 'doing', places: 'doing', people: 'thing' }

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
