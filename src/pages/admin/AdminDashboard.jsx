import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    pendingValidation: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)

      // Compter toutes les factures
      const { count: invoicesCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact' })

      // Compter factures en attente
      const { count: pendingCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .eq('status', 'pending')

      // Compter utilisateurs
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact' })

      // Calculer revenu total
      const { data: invoices } = await supabase
        .from('invoices')
        .select('total')
        .eq('status', 'paid')

      const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0

      setStats({
        totalInvoices: invoicesCount || 0,
        pendingValidation: pendingCount || 0,
        totalUsers: usersCount || 0,
        totalRevenue: totalRevenue,
      })
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-dashboard">
      <style>{`
        .admin-dashboard {
          padding: 2rem;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .dashboard-subtitle {
          color: var(--text-secondary);
          font-size: 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 1.5rem;
          transition: var(--transition);
        }

        .stat-card:hover {
          border-color: var(--accent);
          box-shadow: 0 8px 16px rgba(255, 215, 0, 0.1);
        }

        .stat-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .section {
          margin-bottom: 3rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid var(--border-light);
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .action-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          transition: var(--transition);
          text-decoration: none;
          color: var(--text-primary);
        }

        .action-card:hover {
          background-color: var(--bg-tertiary);
          border-color: var(--accent);
          color: var(--accent);
        }

        .action-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .action-text {
          font-weight: 600;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 1rem;
          }

          .dashboard-title {
            font-size: 1.5rem;
          }

          .stats-grid,
          .actions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-header">
        <h1 className="dashboard-title">Tableau de bord Admin</h1>
        <p className="dashboard-subtitle">Gestion globale du système</p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>
          Chargement...
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-value">{stats.totalInvoices}</div>
              <div className="stat-label">Factures totales</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-value">{stats.pendingValidation}</div>
              <div className="stat-label">En attente de validation</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-value">{stats.totalUsers}</div>
              <div className="stat-label">Revendeurs actifs</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-value">{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
              <div className="stat-label">Revenu total</div>
            </div>
          </div>

          <div className="section">
            <h2 className="section-title">Actions rapides</h2>
            <div className="actions-grid">
              <Link to="/admin/pending" className="action-card">
                <div className="action-icon">✓</div>
                <div className="action-text">Valider factures</div>
              </Link>

              <Link to="/admin/invoices" className="action-card">
                <div className="action-icon">📋</div>
                <div className="action-text">Toutes les factures</div>
              </Link>

              <Link to="/admin/stock" className="action-card">
                <div className="action-icon">📦</div>
                <div className="action-text">Gestion stock</div>
              </Link>

              <Link to="/admin/users" className="action-card">
                <div className="action-icon">👥</div>
                <div className="action-text">Utilisateurs</div>
              </Link>

              <Link to="/admin/reports" className="action-card">
                <div className="action-icon">📊</div>
                <div className="action-text">Rapports</div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
