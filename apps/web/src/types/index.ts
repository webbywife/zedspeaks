export type CategoryId =
  | 'needs' | 'feelings' | 'food' | 'people' | 'places' | 'actions'
  | 'phrases' | 'my-photos'

export type MoodId =
  | 'joy' | 'sad' | 'disgust' | 'fear' | 'angry'
  | 'hopeful' | 'curious' | 'surprised' | 'relaxed' | 'excited' | 'laughing'

export interface AACSymbol {
  id: string
  label: string
  spokenText: string
  arasaacId: number
  emoji: string
  category: CategoryId
  customImageUrl?: string
  moodId?: MoodId
}

export interface SentenceItem {
  uid: string
  label: string
  spokenText: string
}

export interface TTSSettings {
  rate: number
  pitch: number
  volume: number
  voiceURI: string | null
  autoSpeak: boolean
}

export interface CategoryMeta {
  id: CategoryId
  label: string
  color: string
  bgColor: string
  borderColor: string
}

// ── Phrases ───────────────────────────────────────────────────────────────────

export type PhraseType = 'greeting' | 'complete' | 'starter'

export interface Phrase {
  id: string
  label: string
  /** Text added to the sentence strip (starters end with a space so user continues) */
  spokenText: string
  type: PhraseType
  moodId?: MoodId
}

// ── Custom camera photos ──────────────────────────────────────────────────────

export interface CustomSymbol {
  id: string
  label: string
  /** base64 data URL */
  imageData: string
  createdAt: number
}
