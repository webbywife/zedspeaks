import type { MiddlewareHandler } from 'hono'
import { readSession } from '../lib/session.js'
import type { AppEnv } from '../lib/types.js'

export const requireAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const result = await readSession(c)
  if (!result) return c.json({ error: 'Unauthorized' }, 401)
  if (!result.user.isActive) return c.json({ error: 'Account disabled' }, 403)
  c.set('user', result.user)
  c.set('session', result.session)
  await next()
}

export const requireAdmin: MiddlewareHandler<AppEnv> = async (c, next) => {
  const result = await readSession(c)
  if (!result) return c.json({ error: 'Unauthorized' }, 401)
  if (!result.user.isActive) return c.json({ error: 'Account disabled' }, 403)
  if (result.user.role !== 'admin') return c.json({ error: 'Forbidden' }, 403)
  c.set('user', result.user)
  c.set('session', result.session)
  await next()
}
