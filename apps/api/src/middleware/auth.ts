import type { MiddlewareHandler } from 'hono'
import { getCookie } from 'hono/cookie'
import { lucia } from '../lib/auth'
import type { AppEnv } from '../lib/types'

export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const sessionId = getCookie(c, lucia.sessionCookieName)

  if (!sessionId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const { session, user } = await lucia.validateSession(sessionId)

  if (!session) {
    c.header('Set-Cookie', lucia.createBlankSessionCookie().serialize())
    return c.json({ error: 'Unauthorized' }, 401)
  }

  if (session.fresh) {
    c.header('Set-Cookie', lucia.createSessionCookie(session.id).serialize())
  }

  c.set('user', user)
  c.set('session', session)
  await next()
}

export const requireAdmin: MiddlewareHandler<AppEnv> = async (c, next) => {
  const sessionId = getCookie(c, lucia.sessionCookieName)
  if (!sessionId) return c.json({ error: 'Unauthorized' }, 401)

  const { session, user } = await lucia.validateSession(sessionId)
  if (!session) return c.json({ error: 'Unauthorized' }, 401)
  if (user.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)

  c.set('user', user)
  c.set('session', session)
  await next()
}
