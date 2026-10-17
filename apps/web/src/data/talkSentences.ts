// Talk tab: a card on its own says a short, natural sentence ("I want to eat"), not a bare word.
// After a starter card ("I want"), it adds just its word so children can still build sentences.
// Every say('…') string here is pre-recorded by scripts/make_voice.py.
import type { AACSymbol } from '../types'
import { CARD_PHRASES, sentenceFor } from './homePhrases'

const say = (s: string) => s

const TALK_SAY: Record<string, string> = {
  // needs
  eat: say('I want to eat'),
  drink: say('I want a drink'),
  sleep: say('I want to sleep'),
  bathroom: say('I need to go to the bathroom'),
  help: say('I need help'),
  more: say('More, please'),
  stop: say('Please stop'),
  please: say('Please'),
  thanks: say('Thank you'),
  bread: say('I want bread'),
  hug: say('Can I have a hug?'),
  break: say('I need a break'),
  cold: say('I am cold'),
  quiet: say('I need it quiet, please'),
  tired: say('I am tired'),
  washhands: say('I want to wash my hands'),
  brushteeth: say('I want to brush my teeth'),
  bath: say('I want to take a bath'),
  dress: say('I want to get dressed'),
  // people
  me: say('Me'),
  doctor: say('I need a doctor'),
  // places
  hospital: say('I need to go to the hospital'),
  outside: say('I want to go outside'),
  bedroom: say('I want to go to my bedroom'),
  kitchen: say('I want to go to the kitchen'),
  livingroom: say('I want to go to the living room'),
  // actions
  go: say("Let's go"),
  play: say('I want to play'),
  run: say('I want to run'),
  sit: say('I want to sit down'),
  wait: say('Please wait'),
  look: say('Look!'),
  come: say('Come here, please'),
  open: say('Please open it'),
  give: say('Can you give it to me?'),
  watch: say('I want to watch TV'),
  listen: say('I want to listen to music'),
}

// Starter cards: the next card adds only its word ("I want" + "apple")
const STARTER_IDS = new Set(['want'])

/** What a Talk card says when tapped on its own */
export function talkSentence(s: AACSymbol): string {
  if (TALK_SAY[s.id]) return TALK_SAY[s.id]
  if (s.category === 'body' || s.category === 'feelings' || STARTER_IDS.has(s.id)) return s.spokenText
  const phrase = CARD_PHRASES[s.id]
  if (phrase) return sentenceFor(phrase, null)
  return s.spokenText
}

/** True when the last card in the strip is a starter, so the next card should add just its word */
export function followsStarter(lastSpoken: string | undefined): boolean {
  return !!lastSpoken && /^I (really )?(want|need)( to)?$/i.test(lastSpoken.trim())
}
