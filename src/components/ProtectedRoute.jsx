import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Navbar from './Layout/Navbar'
import Sidebar from './Layout/Sidebar'

export default function ProtectedRoute({ children }) {
  const { user, loading, profile } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--accent)'
      }}>
        <div>Chargement...</div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div>
      <Navbar />
      <div className="layout-wrapper">
        {profile?.role === 'admin' ? (
          <>
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </>
        ) : (
          <>
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </>
        )}
      </div>
      <style>{`
        .layout-wrapper {
          display: flex;
          margin-top: 60px;
          min-height: calc(100vh - 60px);
        }

        .main-content {
          flex: 1;
          margin-left: 260px;
          padding: 2rem;
          background-color: var(--bg-primary);
          overflow-y: auto;
          transition: margin-left 0.3s ease;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
