import { Hono } from 'hono'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { requireAuth } from '../middleware/auth.js'
import type { AppEnv } from '../lib/types.js'

// Speaks typed text (and family photo names) in the same teen voice as the recorded cards.
// - Signed-in families only, so strangers can't spend the ElevenLabs credits.
// - Each phrase is made once and saved by a hash of the text; repeats are served from disk.
// - The text itself is never logged or stored in the database, and nothing links it to an account.
export const ttsRouter = new Hono<AppEnv>()

ttsRouter.use('*', requireAuth)

const VOICE = 'nzHcPRle5J78QRhxKFd8' // "ZedSpeaks Teen" (same as scripts/make_voice.py)
const MODEL = 'eleven_multilingual_v2'
const SETTINGS = { stability: 0.6, similarity_boost: 0.8, style: 0.2, use_speaker_boost: true, speed: 0.9 }
const CACHE_DIR = process.env.TTS_CACHE_DIR ?? join(process.cwd(), 'tts-cache')
const MAX_CHARS = 200
const PER_USER_PER_HOUR = 60 // new phrases (cached ones are free and unlimited)
const DAILY_CHARS = Number(process.env.TTS_DAILY_CHARS ?? 20000) // whole-site credit guard

const recent = new Map<string, number[]>()
let day = new Date().toISOString().slice(0, 10)
let charsToday = 0

// Same normalising as the app and the recording script, so "Wed." and "wed" share one clip
const normalize = (t: string) => t.toLowerCase().replace(/[^\p{L}\p{N}_\s']/gu, '').replace(/\s+/g, ' ').trim()

// POST /tts  { text }  ->  audio/mpeg
ttsRouter.post('/', async (c) => {
  const key = process.env.ELEVENLABS_API_KEY
  if (!key) return c.json({ error: 'Voice not set up' }, 503)

  const body = await c.req.json<{ text?: unknown }>().catch(() => ({} as { text?: unknown }))
  const text = typeof body.text === 'string' ? body.text.trim().slice(0, MAX_CHARS) : ''
  const norm = normalize(text)
  if (!norm) return c.json({ error: 'Nothing to say' }, 400)

  const file = join(CACHE_DIR, createHash('sha256').update(norm).digest('hex') + '.mp3')
  const cached = await readFile(file).catch(() => null)
  if (cached) return audio(cached)

  // Limits apply only to new phrases
  const now = Date.now()
  const user = c.get('user')
  const times = (recent.get(user.id) ?? []).filter((t) => now - t < 60 * 60 * 1000)
  if (times.length >= PER_USER_PER_HOUR) return c.json({ error: 'Too many new words this hour' }, 429)
  const today = new Date().toISOString().slice(0, 10)
  if (today !== day) { day = today; charsToday = 0 }
  if (charsToday + text.length > DAILY_CHARS) return c.json({ error: 'Daily voice limit reached' }, 429)

  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}?output_format=mp3_44100_64`, {
    method: 'POST',
    headers: { 'xi-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, model_id: MODEL, voice_settings: SETTINGS }),
  }).catch(() => null)
  if (!r || !r.ok) return c.json({ error: 'Voice service unavailable' }, 502)

  const mp3 = Buffer.from(await r.arrayBuffer())
  recent.set(user.id, [...times, now])
  charsToday += text.length
  await mkdir(CACHE_DIR, { recursive: true }).catch(() => {})
  await writeFile(file, mp3).catch(() => {})
  return audio(mp3)
})

function audio(buf: Buffer) {
  return new Response(new Uint8Array(buf), {
    headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'private, max-age=31536000, immutable' },
  })
}
