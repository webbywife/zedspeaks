import { createBrowserRouter } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { PendingPage } from './pages/PendingPage'
import { AdminPage } from './pages/AdminPage'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import App from './App'

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/pending', element: <PendingPage /> },
  {
    path: '/board',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute adminOnly>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
])
