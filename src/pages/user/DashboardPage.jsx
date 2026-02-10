import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState({
    totalInvoices: 0,
    pendingInvoices: 0,
    totalClients: 0,
    lowStockItems: 0,
  })

  useEffect(() => {
    setStats({
      totalInvoices: 12,
      pendingInvoices: 3,
      totalClients: 24,
      lowStockItems: 5,
    })
  }, [])

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container {
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
          font-size: 2rem;
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

        .dashboard-section {
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

        .action-btn {
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

        .action-btn:hover {
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
          .dashboard-container {
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
        <h1 className="dashboard-title">Tableau de bord</h1>
        <p className="dashboard-subtitle">Bienvenue, {profile?.companyName}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{stats.totalInvoices}</div>
          <div className="stat-label">Factures créées</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{stats.pendingInvoices}</div>
          <div className="stat-label">En attente de validation</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats.totalClients}</div>
          <div className="stat-label">Clients</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats.lowStockItems}</div>
          <div className="stat-label">Articles en faible stock</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2 className="section-title">Actions rapides</h2>
        <div className="actions-grid">
          <Link to="/invoices/create" className="action-btn">
            <div className="action-icon">+</div>
            <div className="action-text">Créer une facture</div>
          </Link>

          <Link to="/clients" className="action-btn">
            <div className="action-icon">👥</div>
            <div className="action-text">Ajouter un client</div>
          </Link>

          <Link to="/stock" className="action-btn">
            <div className="action-icon">📦</div>
            <div className="action-text">Gérer le stock</div>
          </Link>

          <Link to="/invoices" className="action-btn">
            <div className="action-icon">📋</div>
            <div className="action-text">Voir les factures</div>
          </Link>
        </div>
      </div>
    </div>
  )
}
