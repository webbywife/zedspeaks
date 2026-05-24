import { Settings, Camera, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useBoardStore } from '../../store/boardStore'
import { useAuthStore } from '../../store/authStore'
import { logout } from '../../hooks/useAuth'
import { ZedMascot } from '../mascot/ZedMascot'

interface HeaderProps {
  onCameraOpen: () => void
}

export function Header({ onCameraOpen }: HeaderProps) {
  const setOpen = useBoardStore((s) => s.setVoiceSettingsOpen)
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    setUser(null)
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between px-3 py-2 bg-blue-900 text-white shrink-0">
      {/* Zed mascot + app name */}
      <div className="flex items-center gap-3 min-w-0">
        <ZedMascot size="md" />
        <div className="hidden sm:block min-w-0">
          <span className="text-lg font-black tracking-tight leading-none">
            Zed<span className="text-blue-300">Speaks</span>
          </span>
          <p className="text-[10px] text-blue-400 font-medium leading-none mt-0.5">
            Communication Board
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onCameraOpen}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-blue-200 hover:bg-blue-800 active:bg-blue-700 transition-colors"
          aria-label="Add a photo"
        >
          <Camera size={20} />
        </button>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-blue-200 hover:bg-blue-800 active:bg-blue-700 transition-colors"
          aria-label="Voice settings"
        >
          <Settings size={20} />
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center w-9 h-9 rounded-xl text-blue-200 hover:bg-blue-800 active:bg-blue-700 transition-colors"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
