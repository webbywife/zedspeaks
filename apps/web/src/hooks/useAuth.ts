import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'

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

export async function logout() {
  await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' })
}
