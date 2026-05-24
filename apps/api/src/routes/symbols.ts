import { Hono } from 'hono'

export const symbolsRouter = new Hono()

const ARASAAC_BASE = 'https://api.arasaac.org/v1'

// GET /symbols/search?q=eat&lang=en
// Proxies ARASAAC search so the client avoids CORS and results get cached server-side
symbolsRouter.get('/search', async (c) => {
  const q = c.req.query('q')?.trim()
  const lang = c.req.query('lang') ?? 'en'

  if (!q || q.length < 2) return c.json({ error: 'Query too short' }, 400)

  const upstream = await fetch(`${ARASAAC_BASE}/pictograms/${lang}/search/${encodeURIComponent(q)}`)

  if (!upstream.ok) {
    return c.json({ error: 'ARASAAC search failed' }, 502)
  }

  const data = (await upstream.json()) as Array<{
    _id: number
    keywords: Array<{ keyword: string }>
  }>

  // Shape the response for the board builder
  const results = data.slice(0, 30).map((item) => ({
    id: item._id,
    label: item.keywords[0]?.keyword ?? String(item._id),
    imageUrl: `https://static.arasaac.org/pictograms/${item._id}/${item._id}_300.png`,
  }))

  // Cache 24h in CDN / browser
  c.header('Cache-Control', 'public, max-age=86400')
  return c.json(results)
})

// GET /symbols/:id/image — redirect to ARASAAC static (cacheable)
symbolsRouter.get('/:id/image', (c) => {
  const id = c.req.param('id')
  if (!/^\d+$/.test(id)) return c.json({ error: 'Invalid id' }, 400)
  c.header('Cache-Control', 'public, max-age=2592000')  // 30d
  return c.redirect(`https://static.arasaac.org/pictograms/${id}/${id}_300.png`, 301)
})
