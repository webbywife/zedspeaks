import { Settings, Lock } from 'lucide-react'
import { useBoardStore } from '../../store/boardStore'
import { PHOTO_CREDITS } from '../../data/photoCredits'

/** Parent corner: settings (layout, voice) and how to keep the child inside the app. */
export function MeTab() {
  const setOpen = useBoardStore((s) => s.setVoiceSettingsOpen)
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
      <button onClick={() => setOpen(true)} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 text-left">
        <Settings className="text-slate-700" />
        <div>
          <p className="font-bold text-slate-900">Settings</p>
          <p className="text-sm text-slate-500">Layout, voice, speed and volume</p>
        </div>
      </button>
      <div className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Lock className="text-slate-700" size={20} />
          <p className="font-bold text-slate-900">Keep ZedSpeaks open</p>
        </div>
        <p className="text-sm text-slate-600"><b>iPhone / iPad:</b> Settings → Accessibility → Guided Access → On. Open ZedSpeaks, triple-click the side button, tap Start.</p>
        <p className="text-sm text-slate-600"><b>Android:</b> Settings → Security → App pinning → On. Open recent apps, tap the ZedSpeaks icon, tap Pin.</p>
      </div>
      <p className="text-xs text-slate-400 text-center">Photos you add stay on this device.</p>
      {Object.keys(PHOTO_CREDITS).length > 0 && (
        <details className="p-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-600">
          <summary className="font-bold text-slate-900 cursor-pointer">Photo credits</summary>
          <p className="pt-2">
            Starter photos provided by{' '}
            <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 underline">Pexels</a>.
          </p>
          <ul className="pt-2 flex flex-col gap-1">
            {Object.entries(PHOTO_CREDITS).map(([id, c]) => (
              <li key={id}>
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline">{id}</a>{' '}by{' '}
                <a href={c.photographerUrl} target="_blank" rel="noopener noreferrer" className="underline">{c.photographer}</a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
