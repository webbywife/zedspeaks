import { useCallback, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header } from './components/layout/Header'
import { SentenceStrip } from './components/board/SentenceStrip'
import { CommunicationBoard } from './components/board/CommunicationBoard'
import { CategoryNav } from './components/board/CategoryNav'
import { VoiceSettings } from './components/settings/VoiceSettings'
import { PhraseBoard } from './components/phrases/PhraseBoard'
import { MyPhotosBoard } from './components/camera/MyPhotosBoard'
import { CameraCapture } from './components/camera/CameraCapture'
import { useBoardStore } from './store/boardStore'
import { useTTS } from './hooks/useTTS'
import { useCustomSymbols } from './hooks/useCustomSymbols'
import { CATEGORIES, getSymbolsByCategory } from './data/symbols'
import type { AACSymbol, CategoryId, CustomSymbol, MoodId, Phrase } from './types'

const MOOD_RESET_MS = 2000

export default function App() {
  const {
    currentCategory,
    sentenceItems,
    ttsSettings,
    setCategory,
    addToSentence,
    clearSentence,
    backspace,
    setMascotState,
  } = useBoardStore()

  const { speak } = useTTS(ttsSettings)
  const { symbols: customSymbols, save: savePhoto, remove: removePhoto } = useCustomSymbols()
  const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [cameraOpen, setCameraOpen] = useState(false)

  const symbols = getSymbolsByCategory(currentCategory)

  const flashMood = useCallback(
    (mood: MoodId, text?: string) => {
      if (moodTimer.current) clearTimeout(moodTimer.current)
      setMascotState(mood, text ?? null)
      moodTimer.current = setTimeout(() => setMascotState('relaxed', null), MOOD_RESET_MS)
    },
    [setMascotState]
  )

  const handleCategoryChange = useCallback(
    (cat: CategoryId) => {
      setCategory(cat)
      if (cat === 'feelings') setMascotState('curious', 'How are you feeling?')
      else if (cat === 'phrases') setMascotState('hopeful', 'Let me say something!')
      else if (cat === 'my-photos') setMascotState('excited', 'My favourite things!')
      else setMascotState('hopeful', null)
    },
    [setCategory, setMascotState]
  )

  // ── Symbol tap ──────────────────────────────────────────────────────────────
  const handleSymbolTap = useCallback(
    (symbol: AACSymbol) => {
      const mood: MoodId = symbol.moodId ?? 'curious'
      if (ttsSettings.autoSpeak) {
        speak(symbol.spokenText)
        flashMood(mood, symbol.label)
      } else {
        addToSentence({ uid: `${symbol.id}-${Date.now()}`, label: symbol.label, spokenText: symbol.spokenText })
        flashMood(mood)
      }
    },
    [ttsSettings.autoSpeak, speak, addToSentence, flashMood]
  )

  // ── Phrase tap ──────────────────────────────────────────────────────────────
  const handlePhraseTap = useCallback(
    (phrase: Phrase) => {
      if (phrase.type === 'greeting' || phrase.type === 'complete') {
        // Speak immediately OR add full phrase to strip
        if (ttsSettings.autoSpeak) {
          speak(phrase.spokenText)
          flashMood('joy', phrase.label)
        } else {
          addToSentence({ uid: `phrase-${phrase.id}-${Date.now()}`, label: phrase.label, spokenText: phrase.spokenText })
          flashMood('joy')
        }
      } else {
        // Starters always add to strip so user can continue
        addToSentence({ uid: `phrase-${phrase.id}-${Date.now()}`, label: phrase.label, spokenText: phrase.spokenText })
        flashMood('curious', 'Keep going!')
      }
    },
    [ttsSettings.autoSpeak, speak, addToSentence, flashMood]
  )

  // ── Custom photo tap ────────────────────────────────────────────────────────
  const handlePhotoTap = useCallback(
    (sym: CustomSymbol) => {
      if (ttsSettings.autoSpeak) {
        speak(sym.label)
        flashMood('excited', sym.label)
      } else {
        addToSentence({ uid: `photo-${sym.id}-${Date.now()}`, label: sym.label, spokenText: sym.label })
        flashMood('excited')
      }
    },
    [ttsSettings.autoSpeak, speak, addToSentence, flashMood]
  )

  // ── Camera save ─────────────────────────────────────────────────────────────
  const handleCameraSave = useCallback(
    async (label: string, imageData: string) => {
      await savePhoto(label, imageData)
      setCameraOpen(false)
      setCategory('my-photos')
      flashMood('excited', `Added "${label}"!`)
    },
    [savePhoto, setCategory, flashMood]
  )

  // ── Sentence strip controls ─────────────────────────────────────────────────
  const handleSpeak = useCallback(() => {
    const text = sentenceItems.map((i) => i.spokenText).join(' ')
    speak(text)
    flashMood(sentenceItems.length >= 3 ? 'excited' : 'joy', 'Speaking!')
  }, [sentenceItems, speak, flashMood])

  const handleClear = useCallback(() => {
    clearSentence()
    flashMood('surprised', 'Fresh start!')
  }, [clearSentence, flashMood])

  const handleBackspace = useCallback(() => {
    if (sentenceItems.length > 0) {
      backspace()
      flashMood('curious')
    }
  }, [backspace, sentenceItems.length, flashMood])

  // ── Render correct board for active category ────────────────────────────────
  const renderBoard = () => {
    if (currentCategory === 'phrases') {
      return <PhraseBoard onPhraseTap={handlePhraseTap} />
    }
    if (currentCategory === 'my-photos') {
      return (
        <MyPhotosBoard
          symbols={customSymbols}
          onTap={handlePhotoTap}
          onDelete={removePhoto}
          onOpenCamera={() => setCameraOpen(true)}
        />
      )
    }
    return (
      <CommunicationBoard
        symbols={symbols}
        currentCategory={currentCategory}
        onSymbolTap={handleSymbolTap}
      />
    )
  }

  return (
    <div className="flex flex-col h-dvh bg-slate-100 overflow-hidden">
      <Header onCameraOpen={() => setCameraOpen(true)} />
      <SentenceStrip
        items={sentenceItems}
        onSpeak={handleSpeak}
        onClear={handleClear}
        onBackspace={handleBackspace}
      />
      {renderBoard()}
      <CategoryNav categories={CATEGORIES} active={currentCategory} onChange={handleCategoryChange} />
      <VoiceSettings />

      {/* Camera capture overlay */}
      <AnimatePresence>
        {cameraOpen && (
          <CameraCapture
            onSave={handleCameraSave}
            onClose={() => setCameraOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
