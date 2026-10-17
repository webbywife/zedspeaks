// Who the feeling faces look like. Families pick in Settings → Character.
// Every say('…') string here is pre-recorded by scripts/make_voice.py.
import type { AACSymbol, MoodId } from '../types'
import { getSymbolsByCategory } from './symbols'

const say = (s: string) => s

export type CharacterId = 'boy' | 'girl'

export const CHARACTERS: { id: CharacterId; label: string; hint: string; face: string }[] = [
  { id: 'boy', label: 'Boy', hint: 'Zed', face: '/assets/moods/hopeful.png' },
  { id: 'girl', label: 'Girl', hint: 'Ponytail', face: '/assets/characters/girl/happy.webp' },
]

const girl = (id: string, label: string, spokenText: string, emoji: string, moodId: MoodId): AACSymbol => ({
  id: `girl-${id}`, label, spokenText, emoji, moodId, arasaacId: 0, category: 'feelings',
  customImageUrl: `/assets/characters/girl/${id}.webp`,
})

const GIRL_FEELINGS: AACSymbol[] = [
  girl('happy', 'Happy', say('I am happy'), '😊', 'joy'),
  girl('sad', 'Sad', say('I am sad'), '😢', 'sad'),
  girl('angry', 'Angry', say('I am angry'), '😠', 'angry'),
  girl('scared', 'Scared', say('I am scared'), '😨', 'fear'),
  girl('excited', 'Excited', say('I am excited'), '🤩', 'excited'),
  girl('surprised', 'Surprised', say('I am surprised'), '😲', 'surprised'),
  girl('confused', 'Confused', say('I am confused'), '😕', 'curious'),
  girl('embarrassed', 'Embarrassed', say('I am embarrassed'), '😳', 'relaxed'),
  girl('determined', 'Determined', say('I am determined'), '😤', 'disgust'),
]

/** The feeling cards for the chosen character */
export function feelingSymbols(character: CharacterId): AACSymbol[] {
  return character === 'girl' ? GIRL_FEELINGS : getSymbolsByCategory('feelings')
}

// The header face follows the last feeling tapped; the girl has her own face for each mood
const GIRL_FACE: Record<MoodId, string> = {
  joy: 'happy', laughing: 'happy', hopeful: 'happy', relaxed: 'embarrassed', surprised: 'surprised',
  curious: 'confused', sad: 'sad', angry: 'angry', excited: 'excited', fear: 'scared', disgust: 'determined',
}

export function moodFace(character: CharacterId, mood: MoodId): string {
  if (character === 'girl') return `/assets/characters/girl/${GIRL_FACE[mood]}.webp`
  return `/assets/moods/${mood}.png`
}
