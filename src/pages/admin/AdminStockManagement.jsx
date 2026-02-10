import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'

export default function AdminStockManagement() {
  const [stock, setStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadStock()
  }, [])

  const loadStock = async () => {
    try {
      setLoading(true)
      const { data, error: err } = await supabase
        .from('stock')
        .select('*')
        .order('created_at', { ascending: false })

      if (err) throw err
      setStock(data || [])
      setError('')
    } catch (err) {
      setError('Erreur lors du chargement du stock')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-stock">
      <style>{`
        .admin-stock {
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

        .stock-table {
          width: 100%;
          border-collapse: collapse;
          background-color: var(--bg-secondary);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .stock-table thead {
          background-color: var(--bg-tertiary);
          border-bottom: 2px solid var(--border-light);
        }

        .stock-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--accent);
          font-size: 0.9rem;
        }

        .stock-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .stock-table tbody tr:hover {
          background-color: var(--bg-tertiary);
        }

        .category-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background-color: var(--bg-tertiary);
          color: var(--accent);
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .margin-badge {
          color: var(--success);
          font-weight: 600;
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
          .admin-stock {
            padding: 1rem;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .stock-table {
            font-size: 0.85rem;
          }

          .stock-table th,
          .stock-table td {
            padding: 0.75rem;
          }
        }
      `}</style>

      <h1 className="page-title">Gestion du Stock Global</h1>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Chargement...</div>
      ) : stock.length === 0 ? (
        <div className="empty-state">
          <p>Aucun article en stock</p>
        </div>
      ) : (
        <table className="stock-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>P. Achat</th>
              <th>P. Vente</th>
              <th>Quantité</th>
              <th>Unité</th>
              <th>Créé le</th>
            </tr>
          </thead>
          <tbody>
            {stock.map(item => (
              <tr key={item.id}>
                <td><strong>{item.name}</strong></td>
                <td><span className="category-badge">{item.category}</span></td>
                <td>{item.purchasePrice?.toLocaleString('fr-FR')} Ar</td>
                <td>{item.salePrice?.toLocaleString('fr-FR')} Ar</td>
                <td>{item.quantity}</td>
                <td>{item.unit}</td>
                <td>{new Date(item.created_at).toLocaleDateString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
