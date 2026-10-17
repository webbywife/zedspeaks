// Sign-in sessions, replacing the retired Lucia library with the pattern its authors recommend.
// - The browser holds a random token in an httpOnly cookie.
// - The database stores only a SHA-256 hash of that token, so a database leak can't be used to sign in.
// - Sessions last 30 days and are extended automatically when used in their last 15 days.
import { createHash, randomBytes } from 'node:crypto'
import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { eq } from 'drizzle-orm'
import { db } from '../db/index.js'
import { sessions, users } from '../db/schema.js'

export const SESSION_COOKIE = 'zs_session'
const DAY = 24 * 60 * 60 * 1000
const LIFETIME = 30 * DAY
const RENEW_WITHIN = 15 * DAY

export interface SessionUser {
  id: string
  email: string
  name: string
  role: 'aac_user' | 'caregiver' | 'therapist' | 'admin'
  isActive: boolean
}

export interface Session {
  id: string
  userId: string
  expiresAt: Date
}

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

/** Starts a session for the user and sets the cookie */
export async function startSession(c: Context, userId: string): Promise<void> {
  const token = randomBytes(32).toString('base64url')
  const expiresAt = new Date(Date.now() + LIFETIME)
  await db.insert(sessions).values({ id: hashToken(token), userId, expiresAt })
  setSessionCookie(c, token, expiresAt)
}

/** The signed-in user for this request, or null. Renews the session when it's close to expiring. */
export async function readSession(c: Context): Promise<{ session: Session; user: SessionUser } | null> {
  const token = getCookie(c, SESSION_COOKIE)
  if (!token) return null
  const id = hashToken(token)
  const [row] = await db
    .select({ session: sessions, user: { id: users.id, email: users.email, name: users.name, role: users.role, isActive: users.isActive } })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, id))
  if (!row) {
    clearSessionCookie(c)
    return null
  }
  const session: Session = { id: row.session.id, userId: row.session.userId, expiresAt: row.session.expiresAt }
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, id))
    clearSessionCookie(c)
    return null
  }
  if (session.expiresAt.getTime() - Date.now() < RENEW_WITHIN) {
    session.expiresAt = new Date(Date.now() + LIFETIME)
    await db.update(sessions).set({ expiresAt: session.expiresAt }).where(eq(sessions.id, id))
    setSessionCookie(c, token, session.expiresAt)
  }
  return { session, user: { ...row.user, isActive: !!row.user.isActive } }
}

/** Signs this browser out */
export async function endSession(c: Context): Promise<void> {
  const token = getCookie(c, SESSION_COOKIE)
  if (token) await db.delete(sessions).where(eq(sessions.id, hashToken(token)))
  clearSessionCookie(c)
}

/** Signs a user out everywhere (e.g. when an admin disables the account) */
export async function endAllSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId))
}

function setSessionCookie(c: Context, token: string, expiresAt: Date) {
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
    path: '/',
    expires: expiresAt,
  })
}

function clearSessionCookie(c: Context) {
  deleteCookie(c, SESSION_COOKIE, { path: '/', secure: process.env.NODE_ENV === 'production' })
}
