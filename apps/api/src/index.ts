import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { authRouter } from './routes/auth'
import { profilesRouter } from './routes/profiles'
import { boardsRouter } from './routes/boards'
import { cellsRouter } from './routes/cells'
import { symbolsRouter } from './routes/symbols'

const app = new Hono()

app.use('*', logger())
app.use('*', secureHeaders())
app.use(
  '*',
  cors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
    allowHeaders: ['Content-Type'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })
)

// Health check
app.get('/health', (c) => c.json({ ok: true, service: 'zedspeaks-api' }))

// Routes
app.route('/auth', authRouter)
app.route('/profiles', profilesRouter)
app.route('/boards', boardsRouter)
app.route('/cells', cellsRouter)
app.route('/symbols', symbolsRouter)

// 404
app.notFound((c) => c.json({ error: 'Not found' }, 404))

const port = Number(process.env.PORT ?? 3001)
console.log(`ZedSpeaks API running on http://localhost:${port}`)

serve({ fetch: app.fetch, port })

export default app
