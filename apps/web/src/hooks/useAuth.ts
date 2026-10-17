import { API } from '../lib/api'
import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore'


export function useAuthCheck() {
  const { checked, setUser, setChecked } = useAuthStore()

  useEffect(() => {
    if (checked) return
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`status ${r.status}`))))
      .then((data) => { setUser(data.user ?? null); setChecked() })
      // Offline or server hiccup: keep the remembered user so the child isn't locked out
      .catch(() => setChecked())
  }, [checked, setUser, setChecked])
}

export async function logout() {
  useAuthStore.getState().setUser(null)
  await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {})
}
