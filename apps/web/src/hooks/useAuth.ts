import { API } from '../lib/api'
import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'


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
