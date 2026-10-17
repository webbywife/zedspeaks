import { Hono } from 'hono'
import { db } from '../db/index.js'
import { feedback } from '../db/schema.js'
import { requireAuth } from '../middleware/auth.js'
import type { AppEnv } from '../lib/types.js'

// Families can send a rating and a short message. Nothing links it to their account
// unless they tick "you can email me back".
export const feedbackRouter = new Hono<AppEnv>()

feedbackRouter.use('*', requireAuth)

const recent = new Map<string, number[]>() // user id -> send times, to stop accidental floods
const LIMIT = 5
const WINDOW = 60 * 60 * 1000

// POST /feedback
feedbackRouter.post('/', async (c) => {
  const user = c.get('user')
  const body = await c.req.json<{ rating?: unknown; message?: unknown; replyOk?: unknown }>().catch(() => ({} as Record<string, unknown>))

  const rating = typeof body.rating === 'number' && Number.isInteger(body.rating) && body.rating >= 1 && body.rating <= 5 ? body.rating : null
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : ''
  if (!rating && !message) return c.json({ error: 'Please pick a rating or write a message' }, 400)

  const now = Date.now()
  const times = (recent.get(user.id) ?? []).filter((t) => now - t < WINDOW)
  if (times.length >= LIMIT) return c.json({ error: 'Thank you! You have sent a lot of feedback this hour. Please try again later.' }, 429)
  recent.set(user.id, [...times, now])

  await db.insert(feedback).values({
    id: crypto.randomUUID(),
    rating,
    message: message || null,
    replyEmail: body.replyOk === true ? user.email : null,
  })
  return c.json({ ok: true })
})
