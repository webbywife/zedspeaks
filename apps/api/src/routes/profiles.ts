import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { aacProfiles } from '../db/schema'
import { requireAuth } from '../middleware/auth'
import type { AppEnv } from '../lib/types'

export const profilesRouter = new Hono<AppEnv>()

profilesRouter.use('*', requireAuth)

// GET /profiles
profilesRouter.get('/', async (c) => {
  const user = c.get('user')
  const list = await db.select().from(aacProfiles).where(eq(aacProfiles.caregiverId, user.id))
  return c.json(list)
})

// POST /profiles
profilesRouter.post('/', async (c) => {
  const user = c.get('user')
  const body = await c.req.json<{ name: string; gridCols?: number; gridRows?: number }>()

  if (!body.name) return c.json({ error: 'Name required' }, 400)

  const id = crypto.randomUUID()
  await db.insert(aacProfiles).values({ id, caregiverId: user.id, name: body.name, gridCols: body.gridCols ?? 5, gridRows: body.gridRows ?? 4 })
  const [profile] = await db.select().from(aacProfiles).where(eq(aacProfiles.id, id))
  return c.json(profile, 201)
})

// PATCH /profiles/:id
profilesRouter.patch('/:id', async (c) => {
  const user = c.get('user')
  const id = c.req.param('id')
  const body = await c.req.json<Partial<typeof aacProfiles.$inferInsert>>()

  const [existing] = await db.select().from(aacProfiles).where(eq(aacProfiles.id, id))
  if (!existing || existing.caregiverId !== user.id) return c.json({ error: 'Not found' }, 404)

  await db.update(aacProfiles).set(body).where(eq(aacProfiles.id, id))
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
