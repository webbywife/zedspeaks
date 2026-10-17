import { Hono } from 'hono'
import { db } from '../db/index.js'
import { users, accessRequests, feedback, inquiries } from '../db/schema.js'
import { desc, eq, gte, sql } from 'drizzle-orm'
import { requireAdmin } from '../middleware/auth.js'
import { sendApprovalEmail } from '../lib/email.js'
import type { AppEnv } from '../lib/types.js'

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

  const frontendUrl = (process.env.FRONTEND_URL ?? 'http://localhost:5173').split(',')[0].trim()
  sendApprovalEmail(request.email, frontendUrl).catch(console.error)

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

// ── Dashboard ─────────────────────────────────────────────────────────────────
// Counts only, from data we already keep (no tracking of what children do in the app).

// GET /admin/stats
adminRouter.get('/stats', async (c) => {
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const [totals] = await db
    .select({
      accounts: sql<number>`count(*)`,
      approved: sql<number>`sum(${users.approvedAt} is not null)`,
      waiting: sql<number>`sum(${users.approvedAt} is null)`,
      google: sql<number>`sum(${users.passwordHash} is null)`,
    })
    .from(users)
  const day = sql<string>`date(${users.createdAt})`
  const perDay = await db
    .select({ day, count: sql<number>`count(*)` })
    .from(users)
    .where(gte(users.createdAt, since))
    .groupBy(day)
    .orderBy(day)
  const [fb] = await db
    .select({ count: sql<number>`count(*)`, average: sql<number | null>`avg(${feedback.rating})` })
    .from(feedback)
  const n = (v: unknown) => Number(v ?? 0)
  return c.json({
    accounts: n(totals.accounts),
    approved: n(totals.approved),
    waiting: n(totals.waiting),
    google: n(totals.google),
    email: n(totals.accounts) - n(totals.google),
    signupsLast30Days: perDay.map((d) => ({ day: String(d.day), count: n(d.count) })),
    feedbackCount: n(fb.count),
    averageRating: fb.average == null ? null : Math.round(Number(fb.average) * 10) / 10,
  })
})

// GET /admin/feedback
adminRouter.get('/feedback', async (c) => {
  const items = await db.select().from(feedback).orderBy(desc(feedback.createdAt)).limit(200)
  return c.json({ items })
})

// DELETE /admin/feedback/:id
adminRouter.delete('/feedback/:id', async (c) => {
  await db.delete(feedback).where(eq(feedback.id, c.req.param('id')))
  return c.json({ ok: true })
})

// GET /admin/inquiries
adminRouter.get('/inquiries', async (c) => {
  const items = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(200)
  return c.json({ items })
})

// DELETE /admin/inquiries/:id
adminRouter.delete('/inquiries/:id', async (c) => {
  await db.delete(inquiries).where(eq(inquiries.id, c.req.param('id')))
  return c.json({ ok: true })
})
