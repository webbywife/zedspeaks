import { Hono } from 'hono'
import { eq, and } from 'drizzle-orm'
import { db } from '../db'
import { boards, cells, aacProfiles } from '../db/schema'
import { requireAuth } from '../middleware/auth'
import type { AppEnv } from '../lib/types'

export const boardsRouter = new Hono<AppEnv>()

boardsRouter.use('*', requireAuth)

async function ownsProfile(userId: string, profileId: string) {
  const [p] = await db.select().from(aacProfiles).where(
    and(eq(aacProfiles.id, profileId), eq(aacProfiles.caregiverId, userId))
  )
  return !!p
}

// GET /boards?profileId=
boardsRouter.get('/', async (c) => {
  const user = c.get('user')
  const profileId = c.req.query('profileId')
  if (!profileId) return c.json({ error: 'profileId required' }, 400)
  if (!await ownsProfile(user.id, profileId)) return c.json({ error: 'Not found' }, 404)

  const list = await db.select().from(boards).where(eq(boards.profileId, profileId))
  return c.json(list)
})

// GET /boards/:id  (includes cells)
boardsRouter.get('/:id', async (c) => {
  const user = c.get('user')
  const id = c.req.param('id')

  const [board] = await db.select().from(boards).where(eq(boards.id, id))
  if (!board) return c.json({ error: 'Not found' }, 404)
  if (!await ownsProfile(user.id, board.profileId)) return c.json({ error: 'Forbidden' }, 403)

  const boardCells = await db.select().from(cells).where(eq(cells.boardId, id))
  return c.json({ ...board, cells: boardCells })
})

// POST /boards
boardsRouter.post('/', async (c) => {
  const user = c.get('user')
  const body = await c.req.json<{ profileId: string; name: string; isHome?: boolean }>()

  if (!body.profileId || !body.name) return c.json({ error: 'profileId and name required' }, 400)
  if (!await ownsProfile(user.id, body.profileId)) return c.json({ error: 'Forbidden' }, 403)

  const id = crypto.randomUUID()
  await db.insert(boards).values({ id, profileId: body.profileId, name: body.name, isHome: body.isHome ?? false })
  const [board] = await db.select().from(boards).where(eq(boards.id, id))
  return c.json(board, 201)
})

// PATCH /boards/:id
boardsRouter.patch('/:id', async (c) => {
  const user = c.get('user')
  const id = c.req.param('id')
  const body = await c.req.json<Partial<typeof boards.$inferInsert>>()

  const [existing] = await db.select().from(boards).where(eq(boards.id, id))
  if (!existing) return c.json({ error: 'Not found' }, 404)
  if (!await ownsProfile(user.id, existing.profileId)) return c.json({ error: 'Forbidden' }, 403)

  await db.update(boards).set(body).where(eq(boards.id, id))
  const [updated] = await db.select().from(boards).where(eq(boards.id, id))
  return c.json(updated)
})

// DELETE /boards/:id
boardsRouter.delete('/:id', async (c) => {
  const user = c.get('user')
  const id = c.req.param('id')

  const [existing] = await db.select().from(boards).where(eq(boards.id, id))
  if (!existing) return c.json({ error: 'Not found' }, 404)
  if (!await ownsProfile(user.id, existing.profileId)) return c.json({ error: 'Forbidden' }, 403)

  await db.delete(boards).where(eq(boards.id, id))
  return c.json({ ok: true })
})
