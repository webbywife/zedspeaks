import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { aacProfiles } from '../db/schema.js'
import { requireAuth } from '../middleware/auth.js'
import type { AppEnv } from '../lib/types.js'

export const profilesRouter = new Hono<AppEnv>()

profilesRouter.use('*', requireAuth)

// Child profiles hold the minimum: a nickname and an avatar choice. Child photos never leave the
// device, so `avatar` is only a picture key ("pic:teddy-bear") or "photo" (= photo kept on device).
const MAX_PROFILES = 10
const AVATAR = /^(pic:[a-z0-9-]{1,40}|photo)$/

function cleanName(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const name = v.trim().replace(/\s+/g, ' ')
  return name.length >= 1 && name.length <= 30 ? name : null
}

function cleanAvatar(v: unknown): string | null {
  return typeof v === 'string' && AVATAR.test(v) ? v : null
}

// GET /profiles
profilesRouter.get('/', async (c) => {
  const user = c.get('user')
  const list = await db.select().from(aacProfiles).where(eq(aacProfiles.caregiverId, user.id))
  return c.json(list)
})

// POST /profiles
profilesRouter.post('/', async (c) => {
  const user = c.get('user')
  const body = await c.req.json<{ name?: unknown; avatar?: unknown }>().catch(() => ({} as { name?: unknown; avatar?: unknown }))
  const name = cleanName(body.name)
  if (!name) return c.json({ error: 'Please enter a nickname (up to 30 letters)' }, 400)

  const existing = await db.select({ id: aacProfiles.id }).from(aacProfiles).where(eq(aacProfiles.caregiverId, user.id))
  if (existing.length >= MAX_PROFILES) return c.json({ error: `Up to ${MAX_PROFILES} children per family` }, 400)

  const id = crypto.randomUUID()
  await db.insert(aacProfiles).values({ id, caregiverId: user.id, name, avatarUrl: cleanAvatar(body.avatar) })
  const [profile] = await db.select().from(aacProfiles).where(eq(aacProfiles.id, id))
  return c.json(profile, 201)
})

// PATCH /profiles/:id
profilesRouter.patch('/:id', async (c) => {
  const user = c.get('user')
  const id = c.req.param('id')
  const body = await c.req.json<{ name?: unknown; avatar?: unknown }>().catch(() => ({} as { name?: unknown; avatar?: unknown }))

  const [existing] = await db.select().from(aacProfiles).where(eq(aacProfiles.id, id))
  if (!existing || existing.caregiverId !== user.id) return c.json({ error: 'Not found' }, 404)

  // Only these fields can change; owner and id never come from the request
  const changes: Partial<typeof aacProfiles.$inferInsert> = {}
  if (body.name !== undefined) {
    const name = cleanName(body.name)
    if (!name) return c.json({ error: 'Please enter a nickname (up to 30 letters)' }, 400)
    changes.name = name
  }
  if (body.avatar !== undefined) changes.avatarUrl = cleanAvatar(body.avatar)
  if (!Object.keys(changes).length) return c.json(existing)

  await db.update(aacProfiles).set(changes).where(eq(aacProfiles.id, id))
  const [updated] = await db.select().from(aacProfiles).where(eq(aacProfiles.id, id))
  return c.json(updated)
})

// DELETE /profiles/:id
profilesRouter.delete('/:id', async (c) => {
  const user = c.get('user')
  const id = c.req.param('id')

  const [existing] = await db.select().from(aacProfiles).where(eq(aacProfiles.id, id))
  if (!existing || existing.caregiverId !== user.id) return c.json({ error: 'Not found' }, 404)

  await db.delete(aacProfiles).where(eq(aacProfiles.id, id))
  return c.json({ ok: true })
})
