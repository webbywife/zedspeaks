import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { PendingPage } from './pages/PendingPage'
import { PrivacyPage } from './pages/PrivacyPage'
import { SupportPage } from './pages/SupportPage'
import { ResearchPage } from './pages/ResearchPage'
import { AdminPage } from './pages/AdminPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import App from './App'
import { ErrorPage, ServerHandoff } from './pages/ServerHandoff'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage />, errorElement: <ErrorPage /> },
  // An old offline copy answered an /api/... address: hand it to the server
  { path: '/api/*', element: <ServerHandoff /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/pending', element: <PendingPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  { path: '/support', element: <SupportPage /> },
  { path: '/research', element: <ResearchPage /> },
  // Signing in goes straight to the board (the child-picker step was removed, 17 Oct 2026)
  { path: '/start', element: <Navigate to="/board" replace /> },
  { path: '/parent', element: <Navigate to="/board" replace /> },
  {
    path: '/board',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  // Local development only: see the board without signing in (not in production builds)
  ...(import.meta.env.DEV ? [{ path: '/preview', element: <App requireProfile={false} /> }] : []),
  { path: '*', element: <ErrorPage /> },
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
])
