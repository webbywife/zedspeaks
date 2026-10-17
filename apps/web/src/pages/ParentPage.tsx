import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, LogOut, Pencil, Shield, Trash2 } from 'lucide-react'
import { getAvatarPhoto, setAvatarPhoto, useProfileStore, type ChildProfile } from '../store/profileStore'
import { useAuthStore } from '../store/authStore'
import { logout } from '../hooks/useAuth'
import { Avatar } from '../components/profile/Avatar'
import { ProfileForm } from '../components/profile/ProfileForm'

/** Parent corner: manage children, privacy, sign out. Reached by holding the button on the start screen. */
export function ParentPage() {
  const { profiles, load, update, remove } = useProfileStore()
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [editing, setEditing] = useState<ChildProfile | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => { load() }, [load])

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="px-4 py-3 bg-blue-900 flex items-center gap-3">
        <button onClick={() => navigate('/start')} aria-label="Back" className="text-white"><ArrowLeft size={22} /></button>
        <h1 className="text-lg font-black text-white">Parent corner</h1>
      </header>

      <main className="max-w-2xl mx-auto p-4 flex flex-col gap-4">
        <section className="bg-white rounded-3xl border border-slate-200 p-4">
          <h2 className="font-black text-slate-900 pb-3">Children</h2>
          {editing ? (
            <ProfileForm submitLabel="Save" onCancel={() => setEditing(null)}
              initial={{ name: editing.name, avatar: editing.avatar, photo: getAvatarPhoto(editing.id) }}
              onSubmit={async (v) => {
                await update(editing.id, { name: v.name, avatar: v.avatar })
                if (v.photo) setAvatarPhoto(editing.id, v.photo)
                setEditing(null)
              }} />
          ) : (
            <ul className="flex flex-col divide-y divide-slate-100">
              {profiles.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <Avatar profile={p} size={48} />
                  <span className="flex-1 font-bold text-slate-900">{p.name}</span>
                  {confirmDelete === p.id ? (
                    <>
                      <button onClick={() => setConfirmDelete(null)} className="px-3 h-10 rounded-xl bg-slate-100 text-sm font-bold">Keep</button>
                      <button onClick={async () => { await remove(p.id); setConfirmDelete(null) }}
                        className="px-3 h-10 rounded-xl bg-red-600 text-white text-sm font-bold">Delete</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditing(p)} aria-label={`Edit ${p.name}`} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"><Pencil size={18} /></button>
                      <button onClick={() => setConfirmDelete(p.id)} aria-label={`Delete ${p.name}`} className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"><Trash2 size={18} /></button>
                    </>
                  )}
                </li>
              ))}
              {!profiles.length && <li className="py-3 text-slate-500">No children yet. Add one on the start screen.</li>}
            </ul>
          )}
        </section>

        <section className="bg-white rounded-3xl border border-slate-200 p-4 text-sm text-slate-600 flex gap-3">
          <Shield className="shrink-0 text-blue-700" size={20} />
          <p>
            We keep only each child's nickname and picture choice on our server. Photos you take stay on this device.
            Deleting a child removes their profile from our server. No ads, and we never sell data.
          </p>
        </section>

        <div className="flex flex-wrap gap-2">
          {user?.role === 'admin' && (
            <Link to="/admin" className="px-4 h-12 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 flex items-center">Admin</Link>
          )}
          <button onClick={async () => { await logout(); navigate('/login') }}
            className="px-4 h-12 rounded-xl bg-white border border-slate-300 font-bold text-slate-700 flex items-center gap-2">
            <LogOut size={18} /> Sign out
          </button>
        </div>
      </main>
    </div>
  )
}
