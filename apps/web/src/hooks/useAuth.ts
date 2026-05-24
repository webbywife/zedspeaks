import { useEffect } from 'react'
import { useAuthStore, type AuthUser } from '../store/authStore'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export function useAuthCheck() {
  const { checked, setUser, setChecked } = useAuthStore()

  useEffect(() => {
    if (checked) return
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => { setUser(data.user ?? null); setChecked() })
      .catch(() => setChecked())
  }, [checked, setUser, setChecked])
}

export async function requestPin(email: string) {
  const r = await fetch(`${API}/auth/request-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error ?? 'Failed to send code')
}

export async function verifyPin(
  email: string,
  pin: string,
  name?: string,
  relation?: string,
): Promise<{ status: 'ok' | 'pending'; user?: AuthUser }> {
  const r = await fetch(`${API}/auth/verify-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, pin, name, relation }),
  })
  const data = await r.json()
  if (!r.ok) throw new Error(data.error ?? 'Invalid code')
  return data
}

export async function logout() {
  await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
}
