import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.js'

export default function StockPage() {
  const { user } = useAuth()
  const [stock, setStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    reference: '',
    category: '',
    purchasePrice: 0,
    salePrice: 0,
    quantity: 0,
    minQuantity: 0,
    unit: 'pièce',
  })

  useEffect(() => {
    setLoading(false)
    setStock([
      { id: 1, name: 'Produit A', reference: 'REF001', category: 'Electronique', purchasePrice: 5000, salePrice: 7000, quantity: 50, minQuantity: 5, unit: 'pièce' },
      { id: 2, name: 'Produit B', reference: 'REF002', category: 'Vêtements', purchasePrice: 2000, salePrice: 4000, quantity: 3, minQuantity: 10, unit: 'pièce' },
    ])
  }, [])

  const handleAddClick = () => {
    setEditingId(null)
    setFormData({
      name: '',
      reference: '',
      category: '',
      purchasePrice: 0,
      salePrice: 0,
      quantity: 0,
      minQuantity: 0,
      unit: 'pièce',
    })
    setShowForm(true)
  }

  const handleEditClick = (item) => {
    setEditingId(item.id)
    setFormData(item)
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setStock(stock.map(item => item.id === editingId ? { ...formData, id: editingId } : item))
    } else {
      setStock([...stock, { ...formData, id: Date.now() }])
    }
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr?')) {
      setStock(stock.filter(item => item.id !== id))
    }
  }

  const lowStockItems = stock.filter(item => item.quantity <= item.minQuantity)

  return (
    <div className="stock-page">
      <style>{`
        .stock-page {
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

        .add-btn {
          padding: 0.75rem 1.5rem;
          background-color: var(--accent);
          color: #000;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .add-btn:hover {
          background-color: var(--accent-light);
        }

        .alerts {
          margin-bottom: 2rem;
        }

        .alert-low-stock {
          background-color: rgba(245, 158, 11, 0.1);
          border: 1px solid var(--warning);
          border-radius: 6px;
          padding: 1rem;
          color: var(--warning);
          margin-bottom: 1rem;
        }

        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          align-items: center;
          justify-content: center;
        }

        .modal.show {
          display: flex;
        }

        .modal-content {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border-light);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-weight: 500;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.95rem;
          transition: var(--transition-fast);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .modal-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .btn {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-submit {
          background-color: var(--accent);
          color: #000;
        }

        .btn-submit:hover {
          background-color: var(--accent-light);
        }

        .btn-cancel {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border-light);
        }

        .btn-cancel:hover {
          background-color: var(--border-light);
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

        .stock-table tbody tr.low-stock {
          background-color: rgba(245, 158, 11, 0.1);
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

        .quantity {
          font-weight: 600;
        }

        .quantity.low {
          color: var(--warning);
        }

        .actions-cell {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.4rem 0.8rem;
          background-color: var(--bg-tertiary);
          color: var(--text-secondary);
          border: none;
          border-radius: 4px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .action-btn:hover {
          background-color: var(--accent);
          color: #000;
        }

        .action-btn.danger:hover {
          background-color: var(--error);
          color: white;
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
          .stock-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .add-btn {
            width: 100%;
          }

          .stock-table {
            font-size: 0.85rem;
          }

          .stock-table th,
          .stock-table td {
            padding: 0.75rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .modal-content {
            width: 95%;
          }

          .actions-cell {
            flex-direction: column;
          }

          .action-btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="page-header">
        <h1 className="page-title">Gestion du Stock</h1>
        <button className="add-btn" onClick={handleAddClick}>
          + Ajouter un article
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div className="alerts">
          <div className="alert-low-stock">
            {lowStockItems.length} article(s) en faible stock
          </div>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <div className="empty-text">Chargement...</div>
        </div>
      ) : stock.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <div className="empty-text">Aucun article en stock</div>
          <button className="add-btn" onClick={handleAddClick}>
            Ajouter le premier article
          </button>
        </div>
      ) : (
        <table className="stock-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Référence</th>
              <th>Prix Achat</th>
              <th>Prix Vente</th>
              <th>Quantité</th>
              <th>Min</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stock.map(item => (
              <tr key={item.id} className={item.quantity <= item.minQuantity ? 'low-stock' : ''}>
                <td><strong>{item.name}</strong></td>
                <td><span className="category-badge">{item.category}</span></td>
                <td>{item.reference}</td>
                <td>{item.purchasePrice.toLocaleString('fr-FR')} Ar</td>
                <td>{item.salePrice.toLocaleString('fr-FR')} Ar</td>
                <td className={`quantity ${item.quantity <= item.minQuantity ? 'low' : ''}`}>
                  {item.quantity} {item.unit}
                </td>
                <td>{item.minQuantity}</td>
                <td className="actions-cell">
                  <button className="action-btn" onClick={() => handleEditClick(item)}>
                    Modifier
                  </button>
                  <button className="action-btn danger" onClick={() => handleDelete(item.id)}>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className={`modal ${showForm ? 'show' : ''}`} onClick={() => setShowForm(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            {editingId ? 'Modifier un article' : 'Ajouter un article'}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Référence</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Catégorie</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Prix Achat</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.purchasePrice}
                  onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prix Vente</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.salePrice}
                  onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Quantité</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quantité Min</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({ ...formData, minQuantity: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Unité</label>
              <input
                type="text"
                className="form-input"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>

            <div className="modal-buttons">
              <button type="submit" className="btn btn-submit">
                {editingId ? 'Modifier' : 'Ajouter'}
              </button>
              <button type="button" className="btn btn-cancel" onClick={() => setShowForm(false)}>
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
