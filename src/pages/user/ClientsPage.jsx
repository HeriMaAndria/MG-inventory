import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'

export default function ClientsPage() {
  const { user } = useAuth()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    notes: '',
  })

  useEffect(() => {
    setLoading(false)
    setClients([
      { id: 1, name: 'Client A', phone: '034 XX XX XX', address: 'Tana', email: 'client@example.com', totalPurchases: 5, lastPurchase: '2025-02-05' },
      { id: 2, name: 'Client B', phone: '032 XX XX XX', address: 'Antsirabe', email: '', totalPurchases: 3, lastPurchase: '2025-01-20' },
    ])
  }, [])

  const handleAddClick = () => {
    setEditingId(null)
    setFormData({ name: '', phone: '', address: '', email: '', notes: '' })
    setShowForm(true)
  }

  const handleEditClick = (client) => {
    setEditingId(client.id)
    setFormData(client)
    setShowForm(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingId) {
      setClients(clients.map(client => client.id === editingId ? { ...client, ...formData } : client))
    } else {
      setClients([...clients, { ...formData, id: Date.now(), totalPurchases: 0, lastPurchase: null }])
    }
    setShowForm(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr?')) {
      setClients(clients.filter(client => client.id !== id))
    }
  }

  return (
    <div className="clients-page">
      <style>{`
        .clients-page {
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

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.95rem;
          font-family: inherit;
          transition: var(--transition-fast);
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
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

        .clients-table {
          width: 100%;
          border-collapse: collapse;
          background-color: var(--bg-secondary);
          border-radius: 8px;
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .clients-table thead {
          background-color: var(--bg-tertiary);
          border-bottom: 2px solid var(--border-light);
        }

        .clients-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--accent);
          font-size: 0.9rem;
        }

        .clients-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .clients-table tbody tr:hover {
          background-color: var(--bg-tertiary);
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
          .clients-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: stretch;
          }

          .add-btn {
            width: 100%;
          }

          .clients-table {
            font-size: 0.85rem;
          }

          .clients-table th,
          .clients-table td {
            padding: 0.75rem;
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
        <h1 className="page-title">Gestion des Clients</h1>
        <button className="add-btn" onClick={handleAddClick}>
          + Ajouter un client
        </button>
      </div>

      {loading ? (
        <div className="empty-state">
          <div className="empty-text">Chargement...</div>
        </div>
      ) : clients.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <div className="empty-text">Aucun client</div>
          <button className="add-btn" onClick={handleAddClick}>
            Ajouter le premier client
          </button>
        </div>
      ) : (
        <table className="clients-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Achats</th>
              <th>Dernier Achat</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td><strong>{client.name}</strong></td>
                <td>{client.phone}</td>
                <td>{client.address}</td>
                <td>{client.totalPurchases}</td>
                <td>{client.lastPurchase ? new Date(client.lastPurchase).toLocaleDateString('fr-FR') : '-'}</td>
                <td className="actions-cell">
                  <button className="action-btn" onClick={() => handleEditClick(client)}>
                    Modifier
                  </button>
                  <button className="action-btn danger" onClick={() => handleDelete(client.id)}>
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
            {editingId ? 'Modifier le client' : 'Ajouter un client'}
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

            <div className="form-group">
              <label className="form-label">Téléphone</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Adresse</label>
              <textarea
                className="form-textarea"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="3"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="2"
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
