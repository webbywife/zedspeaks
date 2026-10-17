import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { cells, boards, aacProfiles } from '../db/schema.js'
import { requireAuth } from '../middleware/auth.js'
import type { AppEnv } from '../lib/types.js'

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

  if (typeof body.boardId !== 'string' || !Array.isArray(body.cells) || body.cells.length > 200) {
    return c.json({ error: 'Invalid request' }, 400)
  }
  if (!await ownsBoard(user.id, body.boardId)) return c.json({ error: 'Forbidden' }, 403)

  // Only these fields are taken from the request; board and id are always set by the server,
  // and a linked board must belong to the same family
  const rows = []
  for (const cell of body.cells) {
    const linkBoardId = typeof cell.linkBoardId === 'string' && cell.linkBoardId ? cell.linkBoardId : null
    if (linkBoardId && !await ownsBoard(user.id, linkBoardId)) return c.json({ error: 'Forbidden' }, 403)
    rows.push({
      position: Number.isFinite(Number(cell.position)) ? Math.trunc(Number(cell.position)) : 0,
      label: String(cell.label ?? '').slice(0, 255),
      spokenText: String(cell.spokenText ?? '').slice(0, 500),
      iconUrl: typeof cell.iconUrl === 'string' ? cell.iconUrl.slice(0, 500) : null,
      bgColor: typeof cell.bgColor === 'string' ? cell.bgColor.slice(0, 20) : null,
      linkBoardId,
      id: crypto.randomUUID(),
      boardId: body.boardId,
    })
  }

  await db.delete(cells).where(eq(cells.boardId, body.boardId))

  if (rows.length === 0) return c.json([])

  await db.insert(cells).values(rows)
  const inserted = await db.select().from(cells).where(eq(cells.boardId, body.boardId))
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

  // Editable fields only: a cell can't be moved to another family's board or given a new id
  const changes: Partial<typeof cells.$inferInsert> = {}
  for (const k of ['position', 'label', 'spokenText', 'iconUrl', 'bgColor', 'linkBoardId', 'customAudioUrl'] as const) {
    if (body[k] !== undefined) (changes as Record<string, unknown>)[k] = body[k]
  }
  if (changes.linkBoardId && !await ownsBoard(user.id, changes.linkBoardId)) return c.json({ error: 'Forbidden' }, 403)
  if (!Object.keys(changes).length) return c.json(cell)
  await db.update(cells).set(changes).where(eq(cells.id, id))
  const [updated] = await db.select().from(cells).where(eq(cells.id, id))
  return c.json(updated)
})
