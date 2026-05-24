import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useAuthCheck } from '../../hooks/useAuth'

interface Props {
  children: React.ReactNode
  adminOnly?: boolean
}

export function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { user, checked } = useAuthStore()
  const navigate = useNavigate()
  useAuthCheck()

  useEffect(() => {
    if (!checked) return
    if (!user) { navigate('/login', { replace: true }); return }
    if (adminOnly && user.role !== 'admin') navigate('/board', { replace: true })
  }, [checked, user, adminOnly, navigate])

  if (!checked) {
    return (
      <div className="flex items-center justify-center h-dvh bg-slate-100">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null
  if (adminOnly && user.role !== 'admin') return null

  return <>{children}</>
}
