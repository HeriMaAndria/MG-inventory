import { useState, useEffect } from 'react'

export default function AdminStockManagement() {
  const [stock, setStock] = useState([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    setStock([
      { id: 1, name: 'Produit A', category: 'Electronique', purchasePrice: 5000, proposedPrice: 6000, totalQuantity: 150, revendeurs: 3, margin: 1000 },
      { id: 2, name: 'Produit B', category: 'Vêtements', purchasePrice: 2000, proposedPrice: 2500, totalQuantity: 45, revendeurs: 2, margin: 500 },
      { id: 3, name: 'Produit C', category: 'Accessoires', purchasePrice: 1500, proposedPrice: 2000, totalQuantity: 200, revendeurs: 5, margin: 500 },
    ])
  }, [])

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
        }

        .filter-btn:hover,
        .filter-btn.active {
          background-color: var(--accent);
          color: #000;
          border-color: var(--accent);
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

      <div className="filters">
        <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
          Tous les articles ({stock.length})
        </button>
        <button className={`filter-btn ${filter === 'high' ? 'active' : ''}`} onClick={() => setFilter('high')}>
          Stock élevé
        </button>
        <button className={`filter-btn ${filter === 'low' ? 'active' : ''}`} onClick={() => setFilter('low')}>
          Stock faible
        </button>
      </div>

      <table className="stock-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>P. Achat</th>
            <th>P. Proposé</th>
            <th>Marge</th>
            <th>Quantité Totale</th>
            <th>Revendeurs</th>
          </tr>
        </thead>
        <tbody>
          {stock.map(item => (
            <tr key={item.id}>
              <td><strong>{item.name}</strong></td>
              <td><span className="category-badge">{item.category}</span></td>
              <td>{item.purchasePrice.toLocaleString('fr-FR')} Ar</td>
              <td>{item.proposedPrice.toLocaleString('fr-FR')} Ar</td>
              <td className="margin-badge">{item.margin.toLocaleString('fr-FR')} Ar</td>
              <td>{item.totalQuantity} pièces</td>
              <td>{item.revendeurs} revendeurs</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
