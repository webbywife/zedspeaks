import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '../lib/api'

/** A child who uses ZedSpeaks. The server keeps only a nickname and an avatar choice. */
export interface ChildProfile {
  id: string
  name: string
  /** "pic:<drawing>" or "photo" (photo kept on this device only) */
  avatar: string | null
}

interface ServerProfile { id: string; name: string; avatarUrl: string | null }
const fromServer = (p: ServerProfile): ChildProfile => ({ id: p.id, name: p.name, avatar: p.avatarUrl })

interface ProfileStore {
  profiles: ChildProfile[]
  activeId: string | null
  loaded: boolean
  error: string | null
  load: () => Promise<void>
  add: (name: string, avatar: string | null) => Promise<ChildProfile>
  update: (id: string, changes: { name?: string; avatar?: string | null }) => Promise<void>
  remove: (id: string) => Promise<void>
  select: (id: string | null) => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeId: null,
      loaded: false,
      error: null,
      // Offline: keep the cached list so the child can still pick their board
      load: async () => {
        try {
          const list = (await api<ServerProfile[]>('/profiles')).map(fromServer)
          const activeId = list.some((p) => p.id === get().activeId) ? get().activeId : null
          set({ profiles: list, activeId, loaded: true, error: null })
        } catch (e) {
          set({ loaded: true, error: e instanceof Error ? e.message : 'Offline' })
        }
      },
      add: async (name, avatar) => {
        const p = fromServer(await api<ServerProfile>('/profiles', { method: 'POST', body: { name, avatar } }))
        set((s) => ({ profiles: [...s.profiles, p] }))
        return p
      },
      update: async (id, changes) => {
        const p = fromServer(await api<ServerProfile>(`/profiles/${id}`, { method: 'PATCH', body: changes }))
        set((s) => ({ profiles: s.profiles.map((x) => (x.id === id ? p : x)) }))
      },
      remove: async (id) => {
        await api(`/profiles/${id}`, { method: 'DELETE' })
        set((s) => ({ profiles: s.profiles.filter((x) => x.id !== id), activeId: s.activeId === id ? null : s.activeId }))
        try { localStorage.removeItem(photoKey(id)) } catch { /* ignore */ }
      },
      select: (id) => set({ activeId: id }),
    }),
    { name: 'zedspeaks-profiles', partialize: (s) => ({ profiles: s.profiles, activeId: s.activeId }) }
  )
)

export const useActiveProfile = () =>
  useProfileStore((s) => s.profiles.find((p) => p.id === s.activeId) ?? null)

/** Items saved before profiles existed belong to the first child */
export function ownsItem(itemProfileId: string | undefined, activeId: string | null, firstId: string | undefined) {
  if (!activeId) return true // no child chosen: show everything saved on this device
  return itemProfileId ? itemProfileId === activeId : activeId === firstId
}

// A child's photo avatar never leaves the device
export const photoKey = (id: string) => `zedspeaks-avatar-${id}`
export function getAvatarPhoto(id: string): string | null {
  try { return localStorage.getItem(photoKey(id)) } catch { return null }
}
export function setAvatarPhoto(id: string, dataUrl: string) {
  try { localStorage.setItem(photoKey(id), dataUrl) } catch { /* storage full or blocked */ }
}
