// Small in-memory rate limiter (resets when the API restarts, which is fine for this scale).
const hits = new Map<string, number[]>()

/** true = allowed (and counted); false = over the limit */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (recent.length >= limit) { hits.set(key, recent); return false }
  recent.push(now)
  hits.set(key, recent)
  return true
}

/** The visitor's address as passed on by nginx */
export function clientIp(header: (name: string) => string | undefined): string {
  return header('x-real-ip') ?? header('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
}
