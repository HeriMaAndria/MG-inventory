import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * Protège une route pour les utilisateurs authentifiés
 */
export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

/**
 * Protège une route pour les administrateurs uniquement
 */
export function AdminRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  if (!user || profile?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

/**
 * Protège une route pour les revendeurs
 */
export function RevendeurRoute({ children }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return <div className="loading">Chargement...</div>
  }

  if (!user || profile?.role !== 'revendeur') {
    return <Navigate to="/" replace />
  }

  return children
}
