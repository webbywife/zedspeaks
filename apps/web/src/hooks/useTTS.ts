import { useState, useEffect, useCallback } from 'react'
import type { TTSSettings } from '../types'

// Pre-recorded natural voice clips (scripts/make_voice.py → public/voice/).
// Keys are normalized spoken text; must match norm() in make_voice.py.
const VOICE_BASE = `${import.meta.env.BASE_URL}voice/`
let manifest: Record<string, string> | null = null
let manifestLoad: Promise<void> | null = null
let current: HTMLAudioElement | null = null
let queueToken = 0

function loadManifest() {
  manifestLoad ??= fetch(`${VOICE_BASE}manifest.json`)
    .then((r) => (r.ok ? r.json() : {}))
    .then((m) => { manifest = m })
    .catch(() => { manifest = {} })
  return manifestLoad
}

export function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}_\s']/gu, '').replace(/\s+/g, ' ').trim()
}

function clipFor(text: string): string | null {
  const name = manifest?.[normalize(text)]
  return name ? VOICE_BASE + name : null
}

function stopClips() {
  queueToken++
  if (current) {
    current.pause()
    current = null
  }
}

export function useTTS(settings: TTSSettings) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [supported] = useState(() => 'speechSynthesis' in window)
  const natural = settings.naturalVoice !== false

  useEffect(() => {
    loadManifest()
    if (!supported) return
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [supported])

  const speakSynth = useCallback(
    (text: string) => {
      if (!supported) return
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

  const playClips = useCallback(
    async (urls: string[]) => {
      const token = ++queueToken
      for (const url of urls) {
        if (token !== queueToken) return
        const audio = new Audio(url)
        audio.volume = settings.volume
        // Clips are recorded at a natural pace; map the rate slider gently around it.
        audio.playbackRate = Math.min(1.5, Math.max(0.6, settings.rate / 0.85))
        current = audio
        await new Promise<void>((resolve) => {
          audio.onended = audio.onerror = () => resolve()
          audio.play().catch(() => resolve())
        })
      }
    },
    [settings.volume, settings.rate]
  )

  // `parts` = the individual cards of a sentence. If every part has a recording,
  // play them in order so the whole sentence stays in one voice; otherwise fall
  // back to the device voice for the full text.
  const speak = useCallback(
    async (text: string, parts?: string[]) => {
      if (!text.trim()) return
      stopClips()
      if (supported) window.speechSynthesis.cancel()
      if (natural) {
        await loadManifest()
        const whole = clipFor(text)
        const urls = whole ? [whole] : (parts ?? []).map(clipFor)
        if (urls.length && urls.every(Boolean)) {
          playClips(urls as string[])
          return
        }
      }
      speakSynth(text)
    },
    [natural, supported, playClips, speakSynth]
  )

  const cancel = useCallback(() => {
    stopClips()
    if (supported) window.speechSynthesis.cancel()
  }, [supported])

  return { speak, cancel, voices, supported }
}
