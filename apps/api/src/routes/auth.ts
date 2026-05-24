import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { createHash } from 'crypto'
import { db } from '../db'
import { users, emailPins, accessRequests } from '../db/schema'
import { lucia } from '../lib/auth'
import { eq, and, isNull, gt } from 'drizzle-orm'
import { sendPinEmail, sendAdminNotificationEmail } from '../lib/email'
import type { AppEnv } from '../lib/types'

export const authRouter = new Hono<AppEnv>()

function hashPin(pin: string) {
  return createHash('sha256').update(pin).digest('hex')
}

// POST /auth/request-pin
authRouter.post('/request-pin', async (c) => {
  const { email } = await c.req.json<{ email: string }>()
  if (!email?.includes('@')) return c.json({ error: 'Valid email required' }, 400)

  const normalizedEmail = email.toLowerCase().trim()
  const pin = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

  await db.delete(emailPins).where(eq(emailPins.email, normalizedEmail))
  await db.insert(emailPins).values({
    id: crypto.randomUUID(),
    email: normalizedEmail,
    pinHash: hashPin(pin),
    expiresAt,
  })

  await sendPinEmail(normalizedEmail, pin)
  return c.json({ ok: true })
})

// POST /auth/verify-pin
authRouter.post('/verify-pin', async (c) => {
  const { email, pin, name, relation } = await c.req.json<{
    email: string
    pin: string
    name?: string
    relation?: string
  }>()

  if (!email || !pin) return c.json({ error: 'Email and pin required' }, 400)

  const normalizedEmail = email.toLowerCase().trim()
  const now = new Date()

  const [record] = await db
    .select()
    .from(emailPins)
    .where(
      and(
        eq(emailPins.email, normalizedEmail),
        eq(emailPins.pinHash, hashPin(pin)),
        isNull(emailPins.usedAt),
        gt(emailPins.expiresAt, now),
      )
    )

  if (!record) return c.json({ error: 'Invalid or expired code' }, 401)

  await db.update(emailPins).set({ usedAt: now }).where(eq(emailPins.id, record.id))

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
  const isAdmin = normalizedEmail === adminEmail
  const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173'

  let [user] = await db.select().from(users).where(eq(users.email, normalizedEmail))

  if (!user) {
    const displayName = name?.trim() || normalizedEmail.split('@')[0]
    const userRelation = relation?.trim() || 'Parent/Caregiver'

    await db.insert(users).values({
      id: crypto.randomUUID(),
      email: normalizedEmail,
      name: displayName,
      role: isAdmin ? 'admin' : 'caregiver',
      approvedAt: isAdmin ? now : null,
      isActive: true,
    })

    if (!isAdmin) {
      await db.insert(accessRequests).values({
        id: crypto.randomUUID(),
        email: normalizedEmail,
        applicantName: displayName,
        relation: userRelation,
        reason: 'Requested access via ZedSpeaks website',
        status: 'pending',
      })

      if (adminEmail) {
        sendAdminNotificationEmail(adminEmail, displayName, normalizedEmail, userRelation, frontendUrl).catch(console.error)
      }

      return c.json({ status: 'pending' })
    }

    ;[user] = await db.select().from(users).where(eq(users.email, normalizedEmail))
  }

  if (!user.approvedAt) return c.json({ status: 'pending' })

  const session = await lucia.createSession(user.id, {})
  c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize())
  return c.json({
    status: 'ok',
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  })
})

// GET /auth/me
authRouter.get('/me', async (c) => {
  const sessionId = getCookie(c, lucia.sessionCookieName)
  if (!sessionId) return c.json({ user: null })

  const { session, user } = await lucia.validateSession(sessionId)
  if (!session) return c.json({ user: null })

  if (session.fresh) {
    c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize())
  }

  return c.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

// POST /auth/logout
authRouter.post('/logout', async (c) => {
  const sessionId = getCookie(c, lucia.sessionCookieName)
  if (sessionId) await lucia.invalidateSession(sessionId)
  c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize())
  return c.json({ ok: true })
})
