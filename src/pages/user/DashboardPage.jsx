import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { InvoiceService } from '../../services/invoiceService'
import '../../styles/dashboard.css'

export default function DashboardPage() {
  const { profile, isAdmin } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const data = await InvoiceService.getDashboardStats()
      setStats(data)
    } catch (err) {
      console.error('Erreur:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Chargement du tableau de bord...</div>
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Tableau de Bord</h1>
        <p>Bienvenue, {profile?.company_name || profile?.id}</p>
      </div>

      {isAdmin ? (
        <AdminDashboard stats={stats} />
      ) : (
        <RevendeurDashboard stats={stats} />
      )}
    </div>
  )
}

function RevendeurDashboard({ stats }) {
  return (
    <div className="dashboard-content">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Ce mois</h3>
          <p className="stat-value">{stats?.monthTotal.toFixed(2)} Ar</p>
          <small>Total confirmé</small>
        </div>

        <div className="stat-card">
          <h3>Factures</h3>
          <p className="stat-value">{stats?.totalConfirmed}</p>
          <small>Confirmées</small>
        </div>

        <div className="stat-card">
          <h3>Brouillons</h3>
          <p className="stat-value">{stats?.totalDrafts}</p>
          <small>En attente</small>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/create" className="btn btn-primary">
          Créer une facture
        </Link>
        <Link to="/my-invoices" className="btn btn-secondary">
          Mes factures
        </Link>
        <Link to="/stock" className="btn btn-secondary">
          Gestion du stock
        </Link>
      </div>
    </div>
  )
}

function AdminDashboard({ stats }) {
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    InvoiceService.getPendingInvoices().then((data) => {
      setPendingCount(data?.length || 0)
    })
  }, [])

  return (
    <div className="dashboard-content">
      <div className="admin-alert">
        <strong>⚠️ {pendingCount} facture(s) en attente de validation</strong>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Validation</h3>
          <p className="stat-value">{pendingCount}</p>
          <small>En attente</small>
        </div>
      </div>

      <div className="quick-actions">
        <Link to="/admin/pending" className="btn btn-primary">
          Valider les factures
        </Link>
        <Link to="/admin/all-invoices" className="btn btn-secondary">
          Toutes les factures
        </Link>
        <Link to="/admin/users" className="btn btn-secondary">
          Gestion des utilisateurs
        </Link>
      </div>
    </div>
  )
}
