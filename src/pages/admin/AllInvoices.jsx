import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'

export default function AllInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  // Charger toutes les factures depuis Supabase (Admin)
  useEffect(() => {
    loadInvoices()
  }, [])

  const loadInvoices = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('invoices')
        .select('*')
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

  const statusLabels = {
    draft: 'Brouillon',
    pending: 'En attente',
    confirmed: 'Confirmée',
    sent: 'Envoyée',
    paid: 'Payée',
    delivered: 'Livrée',
    cancelled: 'Annulée',
    returned: 'Retournée'
  }

  const statusColors = {
    draft: '#757575',
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    sent: '#3b82f6',
    paid: '#10b981',
    delivered: '#10b981',
    cancelled: '#ef4444',
    returned: '#ef4444'
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const { error: err } = await supabase
        .from('invoices')
        .update({ status: newStatus })
        .eq('id', id)

      if (err) throw err
      loadInvoices()
    } catch (err) {
      setError('Erreur lors de la mise à jour')
      console.error(err)
    }
  }

  return (
    <div className="all-invoices">
      <style>{`
        .all-invoices {
          padding: 2rem;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2rem;
        }

        .alert-error {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          border-radius: 6px;
          padding: 1rem;
          color: var(--error);
          margin-bottom: 1rem;
        }

        .filters {
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

        .status-select {
          padding: 0.5rem;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          color: var(--text-primary);
          cursor: pointer;
          font-weight: 500;
          font-size: 0.85rem;
        }

        .status-select:focus {
          outline: none;
          border-color: var(--accent);
        }

        .status-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          color: white;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          background-color: var(--bg-secondary);
          border-radius: 8px;
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .all-invoices {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .invoices-table {
            font-size: 0.85rem;
          }

          .invoices-table th,
          .invoices-table td {
            padding: 0.75rem;
          }

          .status-select {
            font-size: 0.75rem;
          }
        }
      `}</style>

      <h1 className="page-title">Toutes les Factures</h1>

      {error && <div className="alert-error">{error}</div>}

      <div className="filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Toutes ({invoices.length})
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
        <button
          className={`filter-btn ${filter === 'paid' ? 'active' : ''}`}
          onClick={() => setFilter('paid')}
        >
          Payées
        </button>
      </div>

      {loading ? (
        <div className="empty-state">Chargement...</div>
      ) : filteredInvoices.length === 0 ? (
        <div className="empty-state">
          <p>Aucune facture trouvée</p>
        </div>
      ) : (
        <table className="invoices-table">
          <thead>
            <tr>
              <th>Numéro</th>
              <th>Revendeur</th>
              <th>Client</th>
              <th>Date</th>
              <th>Total</th>
              <th>Statut</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map(invoice => (
              <tr key={invoice.id}>
                <td><strong>{invoice.officialNumber || invoice.draftNumber}</strong></td>
                <td>{invoice.referenceNumber || '-'}</td>
                <td>{invoice.client?.name}</td>
                <td>{new Date(invoice.date).toLocaleDateString('fr-FR')}</td>
                <td>{invoice.total?.toLocaleString('fr-FR')} Ar</td>
                <td>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: statusColors[invoice.status] }}
                  >
                    {statusLabels[invoice.status]}
                  </span>
                </td>
                <td>
                  <select
                    className="status-select"
                    value={invoice.status}
                    onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
