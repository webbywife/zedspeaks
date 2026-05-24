import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CategoryId, MoodId, SentenceItem, TTSSettings } from '../types'

export interface SavedPhrase {
  id: string
  label: string
  spokenText: string
  createdAt: number
}

interface BoardStore {
  currentCategory: CategoryId
  sentenceItems: SentenceItem[]
  ttsSettings: TTSSettings
  voiceSettingsOpen: boolean
  mascotMood: MoodId
  narratorText: string | null
  savedPhrases: SavedPhrase[]
  setCategory: (category: CategoryId) => void
  addToSentence: (item: SentenceItem) => void
  clearSentence: () => void
  backspace: () => void
  updateTTSSettings: (settings: Partial<TTSSettings>) => void
  setVoiceSettingsOpen: (open: boolean) => void
  setMascotState: (mood: MoodId, text?: string | null) => void
  savePhrase: (label: string, spokenText: string) => void
  deletePhrase: (id: string) => void
}

export const useBoardStore = create<BoardStore>()(
  persist(
    (set) => ({
      currentCategory: 'needs',
      sentenceItems: [],
      ttsSettings: {
        rate: 0.85,
        pitch: 1.15,
        volume: 1.0,
        voiceURI: null,
        autoSpeak: false,
      },
      voiceSettingsOpen: false,
      mascotMood: 'hopeful' as MoodId,
      narratorText: "Hi! Tap a picture to talk!" as string | null,
      savedPhrases: [],

      setCategory: (category) => set({ currentCategory: category }),
      addToSentence: (item) => set((s) => ({ sentenceItems: [...s.sentenceItems, item] })),
      clearSentence: () => set({ sentenceItems: [] }),
      backspace: () => set((s) => ({ sentenceItems: s.sentenceItems.slice(0, -1) })),
      updateTTSSettings: (settings) => set((s) => ({ ttsSettings: { ...s.ttsSettings, ...settings } })),
      setVoiceSettingsOpen: (open) => set({ voiceSettingsOpen: open }),
      setMascotState: (mood, text = null) => set({ mascotMood: mood, narratorText: text }),

      savePhrase: (label, spokenText) =>
        set((s) => ({
          savedPhrases: [
            { id: crypto.randomUUID(), label: label.trim(), spokenText: spokenText.trim(), createdAt: Date.now() },
            ...s.savedPhrases,
          ],
        })),

      deletePhrase: (id) =>
        set((s) => ({ savedPhrases: s.savedPhrases.filter((p) => p.id !== id) })),
    }),
    {
      name: 'zedspeaks-settings',
      partialize: (s) => ({ ttsSettings: s.ttsSettings, savedPhrases: s.savedPhrases }),
    }
  )
)
