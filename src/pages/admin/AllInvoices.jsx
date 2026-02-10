import { useState, useEffect } from 'react'

export default function AllInvoices() {
  const [invoices, setInvoices] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setInvoices([
      { id: 1, officialNumber: 'FACT-2025-001', revendeur: 'Boutique A', client: 'Client A', date: '2025-02-10', total: 42500, status: 'confirmed' },
      { id: 2, officialNumber: 'FACT-2025-002', revendeur: 'Boutique B', client: 'Client B', date: '2025-02-09', total: 15000, status: 'paid' },
      { id: 3, officialNumber: 'FACT-2025-003', revendeur: 'Boutique A', client: 'Client C', date: '2025-02-08', total: 28000, status: 'sent' },
      { id: 4, draftNumber: 'BRO-REF004-2025-004', revendeur: 'Boutique C', client: 'Client D', date: '2025-02-07', total: 35000, status: 'pending' },
    ])
  }, [])

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

  const handleStatusChange = (id, newStatus) => {
    setInvoices(invoices.map(inv =>
      inv.id === id ? { ...inv, status: newStatus } : inv
    ))
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

      {filteredInvoices.length === 0 ? (
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
                <td>{invoice.revendeur}</td>
                <td>{invoice.client}</td>
                <td>{new Date(invoice.date).toLocaleDateString('fr-FR')}</td>
                <td>{invoice.total.toLocaleString('fr-FR')} Ar</td>
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
