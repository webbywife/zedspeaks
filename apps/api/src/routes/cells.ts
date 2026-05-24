import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { cells, boards, aacProfiles } from '../db/schema'
import { requireAuth } from '../middleware/auth'
import type { AppEnv } from '../lib/types'

export const cellsRouter = new Hono<AppEnv>()

cellsRouter.use('*', requireAuth)

async function ownsBoard(userId: string, boardId: string) {
  const [board] = await db.select().from(boards).where(eq(boards.id, boardId))
  if (!board) return false
  const [profile] = await db.select().from(aacProfiles).where(eq(aacProfiles.id, board.profileId))
  return profile?.caregiverId === userId
}

// PUT /cells  — bulk upsert all cells for a board
cellsRouter.put('/', async (c) => {
  const user = c.get('user')
  const body = await c.req.json<{
    boardId: string
    cells: Array<{
      position: number
      label: string
      spokenText: string
      iconUrl?: string
      bgColor?: string
      linkBoardId?: string
    }>
  }>()

  if (!await ownsBoard(user.id, body.boardId)) return c.json({ error: 'Forbidden' }, 403)

  await db.delete(cells).where(eq(cells.boardId, body.boardId))

  if (body.cells.length === 0) return c.json([])

  const inserted = await db.insert(cells).values(
    body.cells.map((cell) => ({
      id: crypto.randomUUID(),
      boardId: body.boardId,
      ...cell,
    }))
  ).returning()

  return c.json(inserted)
})

// PATCH /cells/:id
cellsRouter.patch('/:id', async (c) => {
  const user = c.get('user')
  const id = c.req.param('id')
  const body = await c.req.json<Partial<typeof cells.$inferInsert>>()

  const [cell] = await db.select().from(cells).where(eq(cells.id, id))
  if (!cell) return c.json({ error: 'Not found' }, 404)
  if (!await ownsBoard(user.id, cell.boardId)) return c.json({ error: 'Forbidden' }, 403)

  const [updated] = await db.update(cells).set(body).where(eq(cells.id, id)).returning()
  return c.json(updated)
})
