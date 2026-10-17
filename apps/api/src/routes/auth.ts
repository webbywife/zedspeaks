import { Hono } from 'hono'
import { getCookie, setCookie } from 'hono/cookie'
import { Google, generateCodeVerifier, generateState } from 'arctic'
import { db } from '../db/index.js'
import { users, accessRequests } from '../db/schema.js'
import { endSession, readSession, startSession } from '../lib/session.js'
import { hashPassword, verifyPassword } from '../lib/password.js'
import { eq, or } from 'drizzle-orm'
import { sendAdminNotificationEmail } from '../lib/email.js'
import type { AppEnv } from '../lib/types.js'

export const authRouter = new Hono<AppEnv>()


function google() {
  return new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${process.env.API_URL}/auth/google/callback`,
  )
}

// ── Email / password ──────────────────────────────────────────────────────────

// POST /auth/register
authRouter.post('/register', async (c) => {
  const { email, password, name, username, relation } = await c.req.json<{
    email: string
    password: string
    name: string
    username: string
    relation?: string
  }>()

  if (!email?.includes('@')) return c.json({ error: 'Valid email required' }, 400)
  if (!password || password.length < 8) return c.json({ error: 'Password must be at least 8 characters' }, 400)
  if (!name?.trim()) return c.json({ error: 'Name is required' }, 400)
  if (!username?.trim()) return c.json({ error: 'Username is required' }, 400)
  if (!/^[a-z0-9_]{3,20}$/.test(username.toLowerCase())) {
    return c.json({ error: 'Username must be 3–20 characters: letters, numbers, underscores only' }, 400)
  }

  const normalizedEmail = email.toLowerCase().trim()
  const normalizedUsername = username.toLowerCase().trim()
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()
  const isAdmin = normalizedEmail === adminEmail

  const [existing] = await db
    .select()
    .from(users)
    .where(or(eq(users.email, normalizedEmail), eq(users.username, normalizedUsername)))

  if (existing) {
    const field = existing.email === normalizedEmail ? 'email' : 'username'
    return c.json({ error: `That ${field} is already taken` }, 409)
  }

  const passwordHash = await hashPassword(password)
  const now = new Date()

  await db.insert(users).values({
    id: crypto.randomUUID(),
    email: normalizedEmail,
    username: normalizedUsername,
    passwordHash,
    name: name.trim(),
    role: isAdmin ? 'admin' : 'caregiver',
    approvedAt: isAdmin ? now : null,
    isActive: true,
  })

  if (!isAdmin) {
    const userRelation = relation?.trim() || 'Parent/Caregiver'
    await db.insert(accessRequests).values({
      id: crypto.randomUUID(),
      email: normalizedEmail,
      applicantName: name.trim(),
      relation: userRelation,
      reason: 'Signed up via ZedSpeaks',
      status: 'pending',
    })

    const frontendUrl = (process.env.FRONTEND_URL ?? 'http://localhost:5173').split(',')[0].trim()
    if (adminEmail) {
      sendAdminNotificationEmail(adminEmail, name.trim(), normalizedEmail, userRelation, frontendUrl).catch(console.error)
    }

    return c.json({ status: 'pending' })
  }

  const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail))
  await startSession(c, user.id)
  return c.json({ status: 'ok', user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

// POST /auth/login
authRouter.post('/login', async (c) => {
  const { email, password } = await c.req.json<{ email: string; password: string }>()

  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)

  const normalizedEmail = email.toLowerCase().trim()

  const [user] = await db.select().from(users).where(eq(users.email, normalizedEmail))

  if (!user || !user.passwordHash) {
    return c.json({ error: 'Invalid email or password' }, 401)
  }

  const valid = await verifyPassword(user.passwordHash, password)
  if (!valid) return c.json({ error: 'Invalid email or password' }, 401)

  if (!user.approvedAt) return c.json({ status: 'pending' }, 403)

  await startSession(c, user.id)
  return c.json({ status: 'ok', user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

// ── Google OAuth ──────────────────────────────────────────────────────────────

// GET /auth/google
authRouter.get('/google', async (c) => {
  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const url = google().createAuthorizationURL(state, codeVerifier, ['email', 'profile'])

  const cookieOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 10,
    path: '/',
    sameSite: 'Lax' as const,
  }
  setCookie(c, 'google_oauth_state', state, cookieOpts)
  setCookie(c, 'google_code_verifier', codeVerifier, cookieOpts)

  return c.redirect(url.toString())
})

// GET /auth/google/callback
authRouter.get('/google/callback', async (c) => {
  const { code, state } = c.req.query()
  const storedState = getCookie(c, 'google_oauth_state')
  const storedVerifier = getCookie(c, 'google_code_verifier')
  const frontendUrl = (process.env.FRONTEND_URL ?? 'http://localhost:5173').split(',')[0].trim()
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()

  if (!code || !state || state !== storedState || !storedVerifier) {
    return c.redirect(`${frontendUrl}/login?error=oauth_failed`)
  }

  let tokens
  try {
    tokens = await google().validateAuthorizationCode(code, storedVerifier)
  } catch {
    return c.redirect(`${frontendUrl}/login?error=oauth_failed`)
  }

  const googleUser = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${tokens.accessToken()}` },
  }).then((r) => r.json()) as { sub: string; email: string; name: string }

  const normalizedEmail = googleUser.email.toLowerCase()
  const isAdmin = normalizedEmail === adminEmail
  const now = new Date()

  let [user] = await db.select().from(users).where(eq(users.googleId, googleUser.sub))

  if (!user) {
    const [byEmail] = await db.select().from(users).where(eq(users.email, normalizedEmail))

    if (byEmail) {
      await db.update(users).set({ googleId: googleUser.sub }).where(eq(users.id, byEmail.id))
      user = byEmail
    } else {
      const id = crypto.randomUUID()
      await db.insert(users).values({
        id,
        email: normalizedEmail,
        name: googleUser.name,
        googleId: googleUser.sub,
        role: isAdmin ? 'admin' : 'caregiver',
        approvedAt: isAdmin ? now : null,
        isActive: true,
      })

      if (!isAdmin) {
        await db.insert(accessRequests).values({
          id: crypto.randomUUID(),
          email: normalizedEmail,
          applicantName: googleUser.name,
          relation: 'Parent/Caregiver',
          reason: 'Signed up via Google',
          status: 'pending',
        })
        if (adminEmail) {
          sendAdminNotificationEmail(adminEmail, googleUser.name, normalizedEmail, 'Google signup', frontendUrl).catch(console.error)
        }
        return c.redirect(`${frontendUrl}/pending`)
      }

      ;[user] = await db.select().from(users).where(eq(users.id, id))
    }
  }

  if (!user.approvedAt) return c.redirect(`${frontendUrl}/pending`)

  await startSession(c, user.id)
  return c.redirect(`${frontendUrl}/board`)
})

// ── Session ───────────────────────────────────────────────────────────────────

// GET /auth/me
authRouter.get('/me', async (c) => {
  const result = await readSession(c)
  if (!result || !result.user.isActive) return c.json({ user: null })
  const { user } = result
  return c.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } })
})

// POST /auth/logout
authRouter.post('/logout', async (c) => {
  await endSession(c)
  return c.json({ ok: true })
})
