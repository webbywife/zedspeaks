import { create } from 'zustand'

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

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  checked: false,
  setUser: (user) => set({ user }),
  setChecked: () => set({ checked: true }),
}))
