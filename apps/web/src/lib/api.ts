// Small fetch helper for the ZedSpeaks API (session cookie, JSON in and out).
// Each web address uses the API on the same domain, so one build serves zedspeaks.io and the
// old zed.abarentos.com during the move (session cookies stay same-site).
function apiBase(): string {
  const host = typeof window !== 'undefined' ? window.location.hostname : ''
  if (host === 'zedspeaks.io' || host.endsWith('.zedspeaks.io')) return 'https://api.zedspeaks.io'
  return import.meta.env.VITE_API_URL ?? 'http://localhost:3001'
}

export const API = apiBase()

export async function api<T>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const r = await fetch(`${API}${path}`, {
    method: init.method ?? 'GET',
    credentials: 'include',
    headers: init.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error((data as { error?: string }).error ?? 'Something went wrong')
  return data as T
}
