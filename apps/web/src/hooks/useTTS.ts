import { useState, useEffect, useCallback } from 'react'
import type { TTSSettings } from '../types'
import { API } from '../lib/api'
import { useBoardStore } from '../store/boardStore'

// Pre-recorded natural voice clips (scripts/make_voice.py → public/voice/).
// Keys are normalized spoken text; must match norm() in make_voice.py.
// One recorded set per character voice: Zed's in /voice, the girl's in /voice-girl
export type VoiceId = 'boy' | 'girl'
const VOICE_DIR: Record<VoiceId, string> = { boy: 'voice/', girl: 'voice-girl/' }
const manifests: Partial<Record<VoiceId, Record<string, string>>> = {}
const manifestLoads: Partial<Record<VoiceId, Promise<void>>> = {}
let activeVoice: VoiceId = 'boy'
const base = (v: VoiceId) => `${import.meta.env.BASE_URL}${VOICE_DIR[v]}`
/** The girl's voice is used once her recordings exist; until then everyone hears Zed's voice */
const voiceInUse = (): VoiceId =>
  activeVoice === 'girl' && Object.keys(manifests.girl ?? {}).length === 0 ? 'boy' : activeVoice
let current: HTMLAudioElement | null = null
let queueToken = 0

function loadManifest(v: VoiceId = activeVoice) {
  manifestLoads[v] ??= fetch(`${base(v)}manifest.json`)
    .then((r) => (r.ok ? r.json() : {}))
    .then((m) => { manifests[v] = m })
    .catch(() => { manifests[v] = {} })
  return manifestLoads[v]!
}

export function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\p{L}\p{N}_\s']/gu, '').replace(/\s+/g, ' ').trim()
}

function clipFor(text: string): string | null {
  const v = voiceInUse()
  const name = manifests[v]?.[normalize(text)]
  return name ? base(v) + name : null
}

// Typed text and family photo names: made in the same teen voice by our server, then kept
// on this device so repeats are instant and work offline.
const LIVE_CACHE = 'zedspeaks-live-voice'
const liveUrls = new Map<string, string>()

async function liveClip(text: string): Promise<string | null> {
  const key = normalize(text)
  if (!key) return null
  const hit = liveUrls.get(`${voiceInUse()}:${key}`)
  if (hit) return hit
  const voice = voiceInUse()
  const cacheKey = `${location.origin}/__live-voice/${voice}/${encodeURIComponent(key)}`
  try {
    const cache = 'caches' in window ? await caches.open(LIVE_CACHE) : null
    let res = cache ? await cache.match(cacheKey) : undefined
    if (!res) {
      if (!navigator.onLine) return null
      const r = await fetch(`${API}/tts`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, voice }),
      })
      if (!r.ok || !(r.headers.get('content-type') ?? '').includes('audio')) return null
      res = r
      if (cache) await cache.put(cacheKey, r.clone())
    }
    const url = URL.createObjectURL(await res.blob())
    liveUrls.set(`${voice}:${key}`, url)
    return url
  } catch {
    return null
  }
}

function stopClips() {
  queueToken++
  if (current) {
    current.pause()
    current = null
  }
}

export function useTTS(settings: TTSSettings) {
  const character = useBoardStore((s) => s.character)
  activeVoice = character
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [supported] = useState(() => 'speechSynthesis' in window)
  const natural = settings.naturalVoice !== false

  useEffect(() => {
    loadManifest('boy')
    if (character === 'girl') loadManifest('girl')
  }, [character])

  useEffect(() => {
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
        await loadManifest('boy')
        if (activeVoice === 'girl') await loadManifest('girl')
        const whole = clipFor(text)
        const urls = whole ? [whole] : (parts ?? []).map(clipFor)
        if (urls.length && urls.every(Boolean)) {
          playClips(urls as string[])
          return
        }
        // Not pre-recorded: ask for the same voice live, phone voice only if that fails (e.g. offline)
        const token = queueToken
        const live = await liveClip(text)
        if (token !== queueToken) return // something else was tapped meanwhile
        if (live) {
          playClips([live])
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
