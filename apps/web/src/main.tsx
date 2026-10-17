import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
// Font served from our own site (no Google Fonts request, nothing shared with third parties)
import '@fontsource-variable/plus-jakarta-sans'
import './index.css'
import { router } from './router'
import { registerSW } from 'virtual:pwa-register'

// Keep the installed app current on its own: no hard refresh needed on the child's phone.
// A new version installs in the background and the page reloads into it; we also check hourly
// and whenever the app comes back to the front.
const updateSW = registerSW({
  immediate: true,
  onRegisteredSW(_url, reg) {
    if (!reg) return
    const check = () => { if (navigator.onLine) reg.update().catch(() => {}) }
    setInterval(check, 60 * 60 * 1000)
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') check() })
  },
  onNeedRefresh() { updateSW(true) },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
