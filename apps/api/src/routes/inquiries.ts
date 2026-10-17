import { Hono } from 'hono'
import { db } from '../db/index.js'
import { inquiries } from '../db/schema.js'
import type { AppEnv } from '../lib/types.js'

// Public form on the Support page for sponsors, schools, clinics and collaborators.
// Spam guards: a hidden "website" field bots fill in, size limits, and 5 messages per hour per address.
export const inquiriesRouter = new Hono<AppEnv>()

const KINDS = ['Sponsor a family', 'Sponsor a school or class', 'Sponsor a new voice or language', 'Collaborate or partner', 'Other']
const recent = new Map<string, number[]>()

const clean = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ').slice(0, max) : '')

// POST /inquiries
inquiriesRouter.post('/', async (c) => {
  const body = await c.req.json<Record<string, unknown>>().catch(() => ({} as Record<string, unknown>))
  if (typeof body.website === 'string' && body.website) return c.json({ ok: true }) // bot: pretend it worked

  const ip = c.req.header('x-real-ip') ?? c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  const now = Date.now()
  const times = (recent.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000)
  if (times.length >= 5) return c.json({ error: 'Thank you! Please wait a little before sending another message.' }, 429)

  const name = clean(body.name, 100)
  const organisation = clean(body.organisation, 150)
  const email = clean(body.email, 255).toLowerCase()
  const kind = KINDS.includes(String(body.kind)) ? String(body.kind) : 'Other'
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 2000) : ''

  if (!name) return c.json({ error: 'Please tell us your name.' }, 400)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return c.json({ error: 'Please enter a valid email so we can reply.' }, 400)
  if (message.length < 5) return c.json({ error: 'Please write a short message.' }, 400)
  if (body.consent !== true) return c.json({ error: 'Please tick the box so we can keep your message to reply.' }, 400)

  recent.set(ip, [...times, now])
  await db.insert(inquiries).values({ id: crypto.randomUUID(), name, organisation: organisation || null, email, kind, message })
  return c.json({ ok: true })
})
