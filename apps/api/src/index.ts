import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { authRouter } from './routes/auth.js'
import { adminRouter } from './routes/admin.js'
import { profilesRouter } from './routes/profiles.js'
import { feedbackRouter } from './routes/feedback.js'
import { ttsRouter } from './routes/tts.js'
import { inquiriesRouter } from './routes/inquiries.js'
import { boardsRouter } from './routes/boards.js'
import { cellsRouter } from './routes/cells.js'

const app = new Hono()

// Log method, path, status and time only: never query strings (OAuth codes) or bodies
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  console.log(`${c.req.method} ${c.req.path} ${c.res.status} ${Date.now() - start}ms`)
})
// Kill switch: MAINTENANCE=1 in the environment pauses the API (health check still answers)
app.use('*', async (c, next) => {
  if (process.env.MAINTENANCE === '1' && c.req.path !== '/health') {
    return c.json({ error: 'ZedSpeaks is paused for maintenance. Please try again soon.' }, 503)
  }
  await next()
})
app.use('*', secureHeaders())
app.use(
  '*',
  cors({
    // FRONTEND_URL may list several sites, comma-separated (e.g. during a domain move)
    origin: (process.env.FRONTEND_URL ?? 'http://localhost:5173').split(',').map((u) => u.trim()),
    credentials: true,
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
)

// Health check
app.get('/health', (c) => c.json({ ok: true, service: 'zedspeaks-api' }))

// Routes
app.route('/auth', authRouter)
app.route('/admin', adminRouter)
app.route('/profiles', profilesRouter)
app.route('/feedback', feedbackRouter)
app.route('/tts', ttsRouter)
app.route('/inquiries', inquiriesRouter)
app.route('/boards', boardsRouter)
app.route('/cells', cellsRouter)

// 404
app.notFound((c) => c.json({ error: 'Not found' }, 404))

const port = Number(process.env.PORT ?? 3001)
console.log(`ZedSpeaks API running on http://localhost:${port}`)

// Listen on this server only; nginx is the public entrance
serve({ fetch: app.fetch, port, hostname: process.env.HOST ?? '127.0.0.1' })

export default app
