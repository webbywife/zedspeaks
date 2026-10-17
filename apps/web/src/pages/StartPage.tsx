import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Plus } from 'lucide-react'
import { setAvatarPhoto, useProfileStore } from '../store/profileStore'
import { Avatar } from '../components/profile/Avatar'
import { HoldButton } from '../components/profile/HoldButton'
import { ProfileForm } from '../components/profile/ProfileForm'

/** First screen after signing in: pick who is talking, or open the parent corner. */
export function StartPage() {
  const { profiles, loaded, load, add, select } = useProfileStore()
  const navigate = useNavigate()
  const [adding, setAdding] = useState(false)

  useEffect(() => { load() }, [load])

  const open = (id: string) => { select(id); navigate('/board') }
  const firstTime = loaded && profiles.length === 0

  return (
    <div className="min-h-dvh bg-slate-50 flex flex-col">
      <header className="px-4 py-3 bg-white border-b border-gray-100">
        <h1 className="text-xl font-black text-pink-600">ZedSpeaks</h1>
      </header>

      <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 flex flex-col gap-8">
        {adding || firstTime ? (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
            <h2 className="text-xl font-black text-slate-900">{firstTime ? 'Welcome! Who will use ZedSpeaks?' : 'Add a child'}</h2>
            <p className="text-sm text-slate-600 pb-4">Each child gets their own board, words and photos.</p>
            <ProfileForm submitLabel="Add" onCancel={() => setAdding(false)}
              onSubmit={async (v) => {
                const p = await add(v.name, v.avatar)
                if (v.photo) setAvatarPhoto(p.id, v.photo)
                setAdding(false)
              }} />
          </section>
        ) : (
          <>
            <h2 className="text-2xl font-black text-slate-900 text-center">Who's talking today?</h2>
            <div className="flex flex-wrap justify-center gap-6">
              {profiles.map((p) => (
                <motion.button key={p.id} whileTap={{ scale: 0.94 }} onClick={() => open(p.id)}
                  className="flex flex-col items-center gap-2 w-32">
                  <Avatar profile={p} size={112} />
                  <span className="text-lg font-bold text-slate-900 truncate max-w-full">{p.name}</span>
                </motion.button>
              ))}
              <button onClick={() => setAdding(true)} className="flex flex-col items-center gap-2 w-32 text-slate-500">
                <span className="w-28 h-28 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center"><Plus size={32} /></span>
                <span className="font-semibold">Add a child</span>
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="p-4 flex justify-center">
        <HoldButton onHold={() => navigate('/parent')} className="px-5 h-12 rounded-xl bg-white border border-slate-300 font-bold text-slate-700">
          <Lock size={16} /> Parent corner <span className="text-xs font-medium text-slate-400">(hold)</span>
        </HoldButton>
      </footer>
    </div>
  )
}
