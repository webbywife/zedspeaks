import { useState } from 'react'
import { Camera } from 'lucide-react'
import { captureAndResize } from '../../hooks/useCustomSymbols'
import { AVATAR_PICS, picUrl } from './Avatar'

export interface ProfileFormValue { name: string; avatar: string | null; photo: string | null }

/** Nickname + avatar (a drawing, or a photo that stays on this device). */
export function ProfileForm({ initial, submitLabel, onSubmit, onCancel }: {
  initial?: ProfileFormValue
  submitLabel: string
  onSubmit: (v: ProfileFormValue) => Promise<void>
  onCancel: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [avatar, setAvatar] = useState<string | null>(initial?.avatar ?? `pic:${AVATAR_PICS[0]}`)
  const [photo, setPhoto] = useState<string | null>(initial?.photo ?? null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const takePhoto = async (file?: File) => {
    if (!file) return
    setPhoto(await captureAndResize(file, 200))
    setAvatar('photo')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('Please enter a nickname'); return }
    setBusy(true); setError('')
    try { await onSubmit({ name: name.trim(), avatar, photo: avatar === 'photo' ? photo : null }) }
    catch (err) { setError(err instanceof Error ? err.message : 'Something went wrong') }
    finally { setBusy(false) }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-sm font-bold text-slate-700">Nickname</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} autoFocus
          placeholder="e.g. Zed" className="h-12 px-4 rounded-xl border border-slate-300 text-lg font-semibold" />
        <span className="text-xs text-slate-500">A first name or nickname is enough. No full names needed.</span>
      </label>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-slate-700">Picture</span>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          <label className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center gap-1 text-xs font-semibold cursor-pointer overflow-hidden ${
            avatar === 'photo' ? 'border-pink-600 bg-pink-50' : 'border-dashed border-slate-300 text-slate-500'}`}>
            {photo ? <img src={photo} alt="" className="w-full h-full object-cover" /> : <><Camera size={22} /> Photo</>}
            <input type="file" accept="image/*" capture="user" className="hidden" onChange={(e) => takePhoto(e.target.files?.[0])} />
          </label>
          {AVATAR_PICS.map((p) => (
            <button type="button" key={p} onClick={() => setAvatar(`pic:${p}`)} aria-label={p.replace(/-/g, ' ')}
              className={`aspect-square rounded-2xl border-2 bg-white p-1.5 ${avatar === `pic:${p}` ? 'border-pink-600' : 'border-slate-200'}`}>
              <img src={picUrl(p)} alt="" className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500">A photo stays on this device only. It is never uploaded.</span>
      </div>

      {error && <p className="text-sm text-red-600 font-semibold">{error}</p>}
      <div className="flex gap-2">
        <button type="button" onClick={onCancel} className="flex-1 h-12 rounded-xl bg-slate-100 font-bold text-slate-700">Cancel</button>
        <button disabled={busy} className="flex-1 h-12 rounded-xl bg-pink-600 text-white font-bold disabled:opacity-50">{busy ? 'Saving…' : submitLabel}</button>
      </div>
    </form>
  )
}
