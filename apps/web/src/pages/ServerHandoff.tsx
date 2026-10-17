import { useEffect } from 'react'

/**
 * Safety net: an older offline copy of the app may answer /api/... pages itself (e.g. Google sign-in).
 * If that happens, step aside: remove the old offline copy and load the address from the server.
 */
export function ServerHandoff() {
  // Try once per address; if the server itself sends the app here, show a message instead of looping
  const key = `zs-handoff:${window.location.pathname}`
  const tried = (() => { try { return Date.now() - Number(sessionStorage.getItem(key) ?? 0) < 15000 } catch { return true } })()
  useEffect(() => {
    if (tried) return
    try { sessionStorage.setItem(key, String(Date.now())) } catch { /* ignore */ }
    const go = () => window.location.replace(window.location.href)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations()
        .then((regs) => Promise.all(regs.map((r) => r.unregister())))
        .finally(go)
    } else go()
  }, [tried, key])
  if (tried) return <ErrorPage />
  return <Friendly title="One moment…" text="Connecting you to ZedSpeaks." />
}

/** Shown instead of the developer error page */
export function ErrorPage() {
  return (
    <Friendly title="Something went wrong" text="Please go back to the home page and try again.">
      <a href="/" className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-pink-600 text-white font-bold">Go to ZedSpeaks</a>
    </Friendly>
  )
}

function Friendly({ title, text, children }: { title: string; text: string; children?: React.ReactNode }) {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center text-center px-6 bg-slate-50">
      <img src="/assets/characters/boy/happy.webp" alt="" className="w-20 h-20 rounded-full object-cover mb-4" />
      <h1 className="text-xl font-black text-slate-900">{title}</h1>
      <p className="text-slate-600 mt-1">{text}</p>
      {children}
    </div>
  )
}
