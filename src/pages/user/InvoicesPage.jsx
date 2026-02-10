import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../services/supabase'

export default function InvoicesPage() {
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  // Charger les factures depuis Supabase
  useEffect(() => {
    loadInvoices()
  }, [user])

  const loadInvoices = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('invoices')
        .select('*')
        .eq('userId', user.id)
        .order('created_at', { ascending: false })

      if (err) throw err
      setInvoices(data || [])
      setError('')
    } catch (err) {
      setError('Erreur lors du chargement des factures')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredInvoices = filter === 'all'
    ? invoices
    : invoices.filter(inv => inv.status === filter)

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Brouillon',
      pending: 'En attente',
      confirmed: 'Confirmée',
      sent: 'Envoyée',
      paid: 'Payée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
      returned: 'Retournée'
    }
    return labels[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      draft: '#757575',
      pending: '#f59e0b',
      confirmed: '#10b981',
      sent: '#3b82f6',
      paid: '#10b981',
      delivered: '#10b981',
      cancelled: '#ef4444',
      returned: '#ef4444'
    }
    return colors[status] || '#757575'
  }

  return (
    <div className="invoices-page">
      <style>{`
        .invoices-page {
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

        .create-btn {
          padding: 0.75rem 1.5rem;
          background-color: var(--accent);
          color: #000;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: var(--transition-fast);
        }

        .create-btn:hover {
          background-color: var(--accent-light);
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          background-color: var(--bg-secondary);
          color: var(--text-secondary);
          border: 1px solid var(--border-light);
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition-fast);
          font-weight: 500;
          font-size: 0.9rem;
        }

        .filter-btn:hover,
        .filter-btn.active {
          background-color: var(--accent);
          color: #000;
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

        .invoices-table {
          width: 100%;
          border-collapse: collapse;
          background-color: var(--bg-secondary);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .invoices-table thead {
          background-color: var(--bg-tertiary);
          border-bottom: 2px solid var(--border-light);
        }

        .invoices-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--accent);
          font-size: 0.9rem;
        }

        .invoices-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .invoices-table tbody tr:hover {
          background-color: var(--bg-tertiary);
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
          color: white;
        }

        .actions-cell {
          display: flex;
          gap: 0.5rem;
        }

        .action-link {
          padding: 0.4rem 0.8rem;
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: 4px;
          font-size: 0.85rem;
          transition: var(--transition-fast);
        }

        .action-link:hover {
          background-color: var(--accent);
          color: #000;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          background-color: var(--bg-secondary);
          border-radius: 8px;
          border: 1px solid var(--border-light);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-text {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .invoices-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .create-btn {
            width: 100%;
            text-align: center;
          }

          .invoices-table {
            font-size: 0.85rem;
          }

          .invoices-table th,
          .invoices-table td {
            padding: 0.75rem;
          }

          .actions-cell {
            flex-direction: column;
          }

          .action-link {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Mes Factures</h1>
        <Link to="/invoices/create" className="create-btn">
          + Créer une facture
        </Link>
      </div>

      {error && <div className="alert-error">{error}</div>}

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Toutes ({invoices.length})
        </button>
        <button
          className={`filter-btn ${filter === 'draft' ? 'active' : ''}`}
          onClick={() => setFilter('draft')}
        >
          Brouillons
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          En attente
        </button>
        <button
          className={`filter-btn ${filter === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmées
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="empty-text">Chargement...</div>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <div className="empty-text">Aucune facture trouvée</div>
          <Link to="/invoices/create" className="create-btn">
            Créer votre première facture
          </Link>
        </div>
      ) : (
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Date</th>
              <th>Client</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id}>
                <td><strong>{invoice.officialNumber || invoice.draftNumber}</strong></td>
                <td>{new Date(invoice.date).toLocaleDateString('fr-FR')}</td>
                <td>{invoice.client?.name}</td>
                <td>{invoice.total?.toLocaleString('fr-FR')} Ar</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(invoice.status) }}
                  >
                    {getStatusLabel(invoice.status)}
                  </span>
                </td>
                <td className="actions-cell">
                  <Link to={`/invoices/${invoice.id}`} className="action-link">
                    Voir
                  </Link>
                  {invoice.status === 'draft' && (
                    <Link to={`/invoices/${invoice.id}/edit`} className="action-link">
                      Modifier
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
