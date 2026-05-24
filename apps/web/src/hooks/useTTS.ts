import { useState, useEffect, useCallback } from 'react'
import type { TTSSettings } from '../types'

export function useTTS(settings: TTSSettings) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [supported] = useState(() => 'speechSynthesis' in window)

  useEffect(() => {
    if (!supported) return
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [supported])

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text.trim()) return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = settings.rate
      utterance.pitch = settings.pitch
      utterance.volume = settings.volume
      if (settings.voiceURI) {
        const voice = voices.find((v) => v.voiceURI === settings.voiceURI)
        if (voice) utterance.voice = voice
      }
      window.speechSynthesis.speak(utterance)
    },
    [settings, voices, supported]
  )

  const cancel = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
  }, [supported])

  return { speak, cancel, voices, supported }
}
