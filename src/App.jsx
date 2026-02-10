import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.js'

// Pages publiques
import LoginPage from './pages/auth/LoginPage.jsx'
import SignupPage from './pages/auth/SignupPage.jsx'

// Pages utilisateur
import DashboardPage from './pages/user/DashboardPage.jsx'

// Composants
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute.jsx'

import './styles/main.css'

function App() {
  const { loading } = useAuth()

  if (loading) {
    return <div className="app-loading">Chargement...</div>
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Routes protégées */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Redirection par défaut */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
