import { useAuth } from '../../hooks/useAuth.js'

export default function DashboardPage() {
  const { user, profile } = useAuth()

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>
        Dashboard
      </h1>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Bienvenue, {profile?.companyName || user?.email}</h2>
        </div>
        <div className="card-body">
          <p>Votre tableau de bord est en cours de construction...</p>
          <div style={{ marginTop: '1rem' }}>
            <span className="badge badge-primary">Rôle: {profile?.role || 'user'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
