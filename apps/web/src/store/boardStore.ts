import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ownsItem, useProfileStore } from './profileStore'
import type { CategoryId, MoodId, SentenceItem, TTSSettings } from '../types'

export interface SavedPhrase {
  id: string
  label: string
  spokenText: string
  createdAt: number
  /** Which child saved it (older phrases have none: first child) */
  profileId?: string
}

export type LayoutId = 'tabs' | 'classic'
export type CharacterId = 'boy' | 'girl'

interface BoardStore {
  layout: LayoutId
  setLayout: (layout: LayoutId) => void
  character: CharacterId
  setCharacter: (character: CharacterId) => void
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
        naturalVoice: true,
      },
      character: 'boy' as CharacterId,
      setCharacter: (character) => set({ character }),
      layout: 'tabs' as LayoutId,
      setLayout: (layout) => set({ layout }),
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
            { id: crypto.randomUUID(), label: label.trim(), spokenText: spokenText.trim(), createdAt: Date.now(),
              profileId: useProfileStore.getState().activeId ?? undefined },
            ...s.savedPhrases,
          ],
        })),

      deletePhrase: (id) =>
        set((s) => ({ savedPhrases: s.savedPhrases.filter((p) => p.id !== id) })),
    }),
    {
      name: 'zedspeaks-settings',
      partialize: (s) => ({ layout: s.layout, character: s.character, ttsSettings: s.ttsSettings, savedPhrases: s.savedPhrases }),
    }
  )
)

/** The active child's saved phrases */
export function useMySavedPhrases(): SavedPhrase[] {
  const all = useBoardStore((s) => s.savedPhrases)
  const activeId = useProfileStore((s) => s.activeId)
  const firstId = useProfileStore((s) => s.profiles[0]?.id)
  return all.filter((p) => ownsItem(p.profileId, activeId, firstId))
}
