import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { authRouter } from './routes/auth.js'
import { adminRouter } from './routes/admin.js'
import { profilesRouter } from './routes/profiles.js'
import { feedbackRouter } from './routes/feedback.js'
import { boardsRouter } from './routes/boards.js'
import { cellsRouter } from './routes/cells.js'
import { symbolsRouter } from './routes/symbols.js'

const app = new Hono()

app.use('*', logger())
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
app.route('/boards', boardsRouter)
app.route('/cells', cellsRouter)
app.route('/symbols', symbolsRouter)

// 404
app.notFound((c) => c.json({ error: 'Not found' }, 404))

const port = Number(process.env.PORT ?? 3001)
console.log(`ZedSpeaks API running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })

export default app
