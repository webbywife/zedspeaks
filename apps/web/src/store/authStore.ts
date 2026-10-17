import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'aac_user' | 'caregiver' | 'therapist' | 'admin'
}

interface AuthStore {
  user: AuthUser | null
  checked: boolean
  setUser: (user: AuthUser | null) => void
  setChecked: () => void
}

// The last signed-in user is remembered on this device, so the board still opens offline.
// Only the server saying "signed out" (or signing out here) clears it.
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      checked: false,
      setUser: (user) => set({ user }),
      setChecked: () => set({ checked: true }),
    }),
    { name: 'zedspeaks-auth', partialize: (s) => ({ user: s.user }) }
  )
)
