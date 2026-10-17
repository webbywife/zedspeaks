// Small fetch helper for the ZedSpeaks API (session cookie, JSON in and out).
// On zedspeaks.io the API lives on the SAME address, at /api (nginx passes it to the API server).
// Same-origin means sign-in cookies are ordinary first-party cookies that every browser keeps,
// and there is no cross-site (CORS) step that privacy settings or installed-app windows can block.
function apiBase(): string {
  const host = typeof window !== 'undefined' ? window.location.hostname : ''
  if (host === 'zedspeaks.io' || host.endsWith('.zedspeaks.io')) return `${window.location.origin}/api`
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
