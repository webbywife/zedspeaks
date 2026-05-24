import { Hono } from 'hono'
import { db } from '../db'
import { users, accessRequests } from '../db/schema'
import { eq } from 'drizzle-orm'
import { requireAdmin } from '../middleware/auth'
import { sendApprovalEmail } from '../lib/email'
import type { AppEnv } from '../lib/types'

export const adminRouter = new Hono<AppEnv>()

adminRouter.use('*', requireAdmin)

// GET /admin/requests
adminRouter.get('/requests', async (c) => {
  const requests = await db
    .select()
    .from(accessRequests)
    .orderBy(accessRequests.createdAt)
  return c.json({ requests })
})

// POST /admin/requests/:id/approve
adminRouter.post('/requests/:id/approve', async (c) => {
  const { id } = c.req.param()
  const admin = c.get('user')
  const now = new Date()

  const [request] = await db.select().from(accessRequests).where(eq(accessRequests.id, id))
  if (!request) return c.json({ error: 'Not found' }, 404)

  await db.update(accessRequests)
    .set({ status: 'approved', reviewedAt: now, reviewedBy: admin.id })
    .where(eq(accessRequests.id, id))

  await db.update(users).set({ approvedAt: now }).where(eq(users.email, request.email))

  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173'
  sendApprovalEmail(request.email, request.applicantName, frontendUrl).catch(console.error)

  return c.json({ ok: true })
})

// POST /admin/requests/:id/deny
adminRouter.post('/requests/:id/deny', async (c) => {
  const { id } = c.req.param()
  const admin = c.get('user')

  await db.update(accessRequests)
    .set({ status: 'denied', reviewedAt: new Date(), reviewedBy: admin.id })
    .where(eq(accessRequests.id, id))

  return c.json({ ok: true })
})
