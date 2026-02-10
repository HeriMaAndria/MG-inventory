import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'

export default function AdminReports() {
  const [period, setPeriod] = useState('month')
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStats()
  }, [period])

  const getDateRange = () => {
    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3)
        break
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setMonth(now.getMonth() - 1)
    }

    return startDate.toISOString()
  }

  const loadStats = async () => {
    try {
      setLoading(true)
      setError('')

      const startDate = getDateRange()

      // Récupérer toutes les factures de la période
      const { data: invoices, error: invoicesErr } = await supabase
        .from('invoices')
        .select(`
          *,
          profiles:userId (
            companyName
          )
        `)
        .gte('created_at', startDate)

      if (invoicesErr) throw invoicesErr

      // Calculer les statistiques
      const totalInvoices = invoices?.length || 0
      const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0
      const averageInvoice = totalInvoices > 0 ? totalRevenue / totalInvoices : 0

      // Grouper par statut
      const pendingInvoices = invoices?.filter(inv => inv.status === 'pending') || []
      const paidInvoices = invoices?.filter(inv => inv.status === 'paid') || []
      const deliveredInvoices = invoices?.filter(inv => inv.status === 'delivered') || []

      const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0)
      const paidAmount = paidInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0)
      const deliveredAmount = deliveredInvoices.reduce((sum, inv) => sum + (inv.total || 0), 0)

      // Trouver le meilleur client (par montant total)
      const clientStats = {}
      invoices?.forEach(inv => {
        const client = inv.clientName
        if (!clientStats[client]) {
          clientStats[client] = 0
        }
        clientStats[client] += inv.total || 0
      })

      const topClient = Object.keys(clientStats).length > 0
        ? Object.entries(clientStats).sort((a, b) => b[1] - a[1])[0][0]
        : 'N/A'

      // Trouver le meilleur revendeur (par nombre de factures)
      const revendeurStats = {}
      invoices?.forEach(inv => {
        const revendeur = inv.profiles?.companyName || 'Inconnu'
        if (!revendeurStats[revendeur]) {
          revendeurStats[revendeur] = { count: 0, total: 0 }
        }
        revendeurStats[revendeur].count += 1
        revendeurStats[revendeur].total += inv.total || 0
      })

      const topRevendeur = Object.keys(revendeurStats).length > 0
        ? Object.entries(revendeurStats).sort((a, b) => b[1].total - a[1].total)[0][0]
        : 'N/A'

      setStats({
        totalInvoices,
        totalRevenue,
        averageInvoice,
        topClient,
        topRevendeur,
        pendingAmount,
        paidAmount,
        deliveredAmount,
      })
    } catch (err) {
      setError('Erreur lors du chargement des statistiques')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-reports">
      <style>{`
        .admin-reports {
          padding: 2rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .period-select {
          padding: 0.75rem 1rem;
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          color: var(--text-primary);
          cursor: pointer;
          font-weight: 500;
        }

        .period-select:focus {
          outline: none;
          border-color: var(--accent);
        }

        .alert-error {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          border-radius: 6px;
          padding: 1rem;
          color: var(--error);
          margin-bottom: 1rem;
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
          font-size: 2rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .chart-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .chart-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }

        .chart-bar {
          margin-bottom: 1rem;
        }

        .bar-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .bar-label-name {
          color: var(--text-primary);
          font-weight: 500;
        }

        .bar-label-value {
          color: var(--accent);
          font-weight: 600;
        }

        .bar {
          width: 100%;
          height: 20px;
          background-color: var(--bg-tertiary);
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--accent) 0%, var(--accent-light) 100%);
          width: 0%;
          transition: width 0.5s ease;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          background-color: var(--bg-secondary);
          border-radius: 8px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .admin-reports {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .period-select {
            width: 100%;
          }

          .stats-grid,
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Rapports</h1>
        <select className="period-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="quarter">Ce trimestre</option>
          <option value="year">Cette année</option>
        </select>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">
          <p>Chargement...</p>
        </div>
      ) : stats ? (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📋</div>
              <div className="stat-value">{stats.totalInvoices}</div>
              <div className="stat-label">Factures créées</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-value">{(stats.totalRevenue / 1000000).toFixed(1)}M</div>
              <div className="stat-label">Revenu total</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{(stats.averageInvoice / 1000).toFixed(1)}K</div>
              <div className="stat-label">Facture moyenne</div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">✓</div>
              <div className="stat-value">{(stats.paidAmount / 1000000).toFixed(1)}M</div>
              <div className="stat-label">Montant payé</div>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">Répartition par statut</h3>

              <div className="chart-bar">
                <div className="bar-label">
                  <span className="bar-label-name">Payées</span>
                  <span className="bar-label-value">{(stats.paidAmount / 1000000).toFixed(1)}M Ar</span>
                </div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${stats.totalRevenue > 0 ? (stats.paidAmount / stats.totalRevenue) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="chart-bar">
                <div className="bar-label">
                  <span className="bar-label-name">Livrées</span>
                  <span className="bar-label-value">{(stats.deliveredAmount / 1000000).toFixed(1)}M Ar</span>
                </div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${stats.totalRevenue > 0 ? (stats.deliveredAmount / stats.totalRevenue) * 100 : 0}%` }}></div>
                </div>
              </div>

              <div className="chart-bar">
                <div className="bar-label">
                  <span className="bar-label-name">En attente</span>
                  <span className="bar-label-value">{(stats.pendingAmount / 1000000).toFixed(1)}M Ar</span>
                </div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${stats.totalRevenue > 0 ? (stats.pendingAmount / stats.totalRevenue) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Top Clients & Revendeurs</h3>

              <div style={{ marginBottom: '1.5rem' }}>
                <h4 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '0.95rem' }}>Meilleur Client</h4>
                <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                  {stats.topClient}
                </div>
              </div>

              <div>
                <h4 style={{ color: 'var(--accent)', marginBottom: '1rem', fontSize: '0.95rem' }}>Meilleur Revendeur</h4>
                <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
                  {stats.topRevendeur}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>Aucune donnée disponible pour cette période</p>
        </div>
      )}
    </div>
  )
}
