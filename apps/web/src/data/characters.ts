// Who the feeling faces look like. Families pick in Settings → Character.
// Every say('…') string here is pre-recorded by scripts/make_voice.py.
// (The landing page keeps Zed's original faces in /assets/moods; the app uses these sets.)
import type { AACSymbol, MoodId } from '../types'

const say = (s: string) => s

export type CharacterId = 'boy' | 'girl'

export const CHARACTERS: { id: CharacterId; label: string; hint: string; face: string }[] = [
  { id: 'boy', label: 'Boy', hint: 'Zed', face: '/assets/characters/boy/happy.webp' },
  { id: 'girl', label: 'Girl', hint: 'Ponytail', face: '/assets/characters/girl/happy.webp' },
]

type Feeling = [file: string, label: string, spoken: string, emoji: string, mood: MoodId]

function feelings(character: CharacterId, list: Feeling[]): AACSymbol[] {
  return list.map(([file, label, spokenText, emoji, moodId]) => ({
    id: `${character}-${file}`, label, spokenText, emoji, moodId, arasaacId: 0, category: 'feelings',
    customImageUrl: `/assets/characters/${character}/${file}.webp`,
  }))
}

const BOY = feelings('boy', [
  ['happy', 'Happy', say('I am happy'), '😊', 'joy'],
  ['sad', 'Sad', say('I am sad'), '😢', 'sad'],
  ['angry', 'Angry', say('I am angry'), '😠', 'angry'],
  ['scared', 'Scared', say('I am scared'), '😨', 'fear'],
  ['excited', 'Excited', say('I am excited'), '🤩', 'excited'],
  ['surprised', 'Surprised', say('I am surprised'), '😲', 'surprised'],
  ['goofy', 'Goofy', say('I am goofy'), '😜', 'laughing'],
  ['confused', 'Confused', say('I am confused'), '😕', 'curious'],
  ['thinking', 'Thinking', say('I am thinking'), '🤔', 'curious'],
  ['bored', 'Bored', say('I am bored'), '😑', 'relaxed'],
  ['embarrassed', 'Embarrassed', say('I am embarrassed'), '😳', 'relaxed'],
  ['determined', 'Determined', say('I am determined'), '😤', 'disgust'],
])

const GIRL = feelings('girl', [
  ['happy', 'Happy', say('I am happy'), '😊', 'joy'],
  ['sad', 'Sad', say('I am sad'), '😢', 'sad'],
  ['angry', 'Angry', say('I am angry'), '😠', 'angry'],
  ['scared', 'Scared', say('I am scared'), '😨', 'fear'],
  ['excited', 'Excited', say('I am excited'), '🤩', 'excited'],
  ['surprised', 'Surprised', say('I am surprised'), '😲', 'surprised'],
  ['confused', 'Confused', say('I am confused'), '😕', 'curious'],
  ['embarrassed', 'Embarrassed', say('I am embarrassed'), '😳', 'relaxed'],
  ['determined', 'Determined', say('I am determined'), '😤', 'disgust'],
])

/** The feeling cards for the chosen character */
export function feelingSymbols(character: CharacterId): AACSymbol[] {
  return character === 'girl' ? GIRL : BOY
}

/** The header face: the last feeling tapped, or the character's happy face when resting */
export function headerFace(character: CharacterId, tapped: string | null): string {
  return tapped ?? `/assets/characters/${character}/happy.webp`
}
