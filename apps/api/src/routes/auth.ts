import { Hono } from 'hono'
import { getCookie } from 'hono/cookie'
import { Argon2id } from 'oslo/password'
import { db } from '../db'
import { users } from '../db/schema'
import { lucia } from '../lib/auth'
import { eq } from 'drizzle-orm'
import type { AppEnv } from '../lib/types'

export const authRouter = new Hono<AppEnv>()

const argon = new Argon2id()

// POST /auth/login
authRouter.post('/login', async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>()

  if (!email || !password) {
    return c.json({ error: 'Email and password required' }, 400)
  }

  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase()))

  if (!user || !user.passwordHash) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  if (!user.isActive || !user.approvedAt) {
    return c.json({ error: 'Account not yet approved' }, 403)
  }

  const valid = await argon.verify(user.passwordHash, password)
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const session = await lucia.createSession(user.id, {})
  c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize())

  return c.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

// POST /auth/logout
authRouter.post('/logout', async (c) => {
  const sessionId = getCookie(c, lucia.sessionCookieName)
  if (sessionId) await lucia.invalidateSession(sessionId)
  c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize())
  return c.json({ ok: true })
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

// POST /auth/set-password  — used after magic-link approval (Phase 4)
authRouter.post('/set-password', async (c) => {
  const { token, password } = await c.req.json<{ token: string; password: string }>()

  if (!token || password.length < 8) {
    return c.json({ error: 'Invalid request' }, 400)
  }

  // Phase 4: validate magic-link token, look up user, set password
  void token
  const passwordHash = await argon.hash(password)
  void passwordHash

  return c.json({ ok: true })
})
