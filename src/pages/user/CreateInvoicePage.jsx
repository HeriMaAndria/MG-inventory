import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function CreateInvoicePage() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [formData, setFormData] = useState({
    type: 'devis',
    client: { name: '', phone: '', address: '' },
    date: new Date().toISOString().split('T')[0],
    items: [],
    fees: 0,
    notes: '',
  })
  const [currentItem, setCurrentItem] = useState({
    details: '',
    designation: '',
    quantity: 1,
    unitPrice: 0,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleAddItem = () => {
    if (!currentItem.designation || !currentItem.unitPrice) {
      setError('Remplissez la désignation et le prix')
      return
    }

    const item = {
      ...currentItem,
      id: Date.now(),
      amount: currentItem.quantity * currentItem.unitPrice,
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, item]
    }))

    setCurrentItem({
      details: '',
      designation: '',
      quantity: 1,
      unitPrice: 0,
    })
    setError('')
  }

  const handleRemoveItem = (id) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  const calculateTotal = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0)
    return subtotal + formData.fees
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      if (!formData.client.name) {
        throw new Error('Le nom du client est obligatoire')
      }
      if (formData.items.length === 0) {
        throw new Error('Ajoutez au moins un article')
      }

      setSuccess('Facture créée en brouillon!')
      setTimeout(() => {
        navigate('/invoices')
      }, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const total = calculateTotal()

  return (
    <div className="create-invoice-page">
      <style>{`
        .create-invoice-page {
          padding: 2rem;
          max-width: 1000px;
        }

        .page-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 2rem;
        }

        .form-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 2rem;
          margin-bottom: 1.5rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .form-section:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--accent);
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid var(--border-light);
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          margin-bottom: 0.5rem;
          color: var(--text-primary);
          font-weight: 500;
          font-size: 0.95rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
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
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
        }

        .items-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-light);
        }

        .add-item-btn {
          padding: 0.75rem 1.5rem;
          background-color: var(--accent);
          color: #000;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
          align-self: flex-start;
        }

        .add-item-btn:hover {
          background-color: var(--accent-light);
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1.5rem;
        }

        .items-table thead {
          background-color: var(--bg-tertiary);
        }

        .items-table th {
          padding: 0.75rem;
          text-align: left;
          font-weight: 600;
          color: var(--accent);
          border-bottom: 2px solid var(--border-light);
          font-size: 0.9rem;
        }

        .items-table td {
          padding: 0.75rem;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-primary);
        }

        .items-table tbody tr:hover {
          background-color: var(--bg-tertiary);
        }

        .remove-btn {
          padding: 0.4rem 0.8rem;
          background-color: var(--error);
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: var(--transition-fast);
        }

        .remove-btn:hover {
          opacity: 0.9;
        }

        .totals-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.5rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid var(--border-light);
        }

        .total-row {
          display: flex;
          gap: 2rem;
          font-size: 1.1rem;
        }

        .total-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .total-amount {
          font-weight: 700;
          color: var(--accent);
          min-width: 150px;
          text-align: right;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          flex-wrap: wrap;
        }

        .submit-btn {
          padding: 0.75rem 2rem;
          background-color: var(--accent);
          color: #000;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .submit-btn:hover {
          background-color: var(--accent-light);
        }

        .submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cancel-btn {
          padding: 0.75rem 2rem;
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border-light);
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .cancel-btn:hover {
          background-color: var(--border-light);
        }

        .error-message {
          background-color: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--error);
          border-radius: 6px;
          padding: 1rem;
          color: var(--error);
          margin-bottom: 1.5rem;
        }

        .success-message {
          background-color: rgba(16, 185, 129, 0.1);
          border: 1px solid var(--success);
          border-radius: 6px;
          padding: 1rem;
          color: var(--success);
          margin-bottom: 1.5rem;
        }

        @media (max-width: 768px) {
          .create-invoice-page {
            padding: 1rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .submit-btn,
          .cancel-btn {
            width: 100%;
          }

          .totals-section {
            align-items: flex-start;
          }
        }
      `}</style>

      <h1 className="page-title">Créer une Facture</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        {/* Type et date */}
        <div className="form-card">
          <div className="form-section">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type de document</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="devis">Devis</option>
                  <option value="facture">Facture</option>
                  <option value="avoir">Facture d'avoir</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client */}
        <div className="form-card">
          <div className="form-section">
            <h2 className="section-title">Informations Client</h2>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nom du client *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.client.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    client: { ...formData.client, name: e.target.value }
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.client.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    client: { ...formData.client, phone: e.target.value }
                  })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Adresse</label>
              <textarea
                className="form-textarea"
                value={formData.client.address}
                onChange={(e) => setFormData({
                  ...formData,
                  client: { ...formData.client, address: e.target.value }
                })}
                rows="3"
              />
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="form-card">
          <div className="form-section">
            <h2 className="section-title">Articles</h2>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Détails (optionnel)</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentItem.details}
                  onChange={(e) => setCurrentItem({ ...currentItem, details: e.target.value })}
                  placeholder="Ex: En rupture à cause de..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Désignation *</label>
                <input
                  type="text"
                  className="form-input"
                  value={currentItem.designation}
                  onChange={(e) => setCurrentItem({ ...currentItem, designation: e.target.value })}
                  placeholder="Nom du produit"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quantité</label>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) => setCurrentItem({ ...currentItem, quantity: parseFloat(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Prix unitaire *</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  step="0.01"
                  value={currentItem.unitPrice}
                  onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: parseFloat(e.target.value) })}
                />
              </div>
            </div>

            <button type="button" className="add-item-btn" onClick={handleAddItem}>
              + Ajouter l'article
            </button>

            {formData.items.length > 0 && (
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Détails</th>
                    <th>Désignation</th>
                    <th>Quantité</th>
                    <th>Prix Unit.</th>
                    <th>Montant</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map(item => (
                    <tr key={item.id}>
                      <td>{item.details}</td>
                      <td>{item.designation}</td>
                      <td>{item.quantity}</td>
                      <td>{item.unitPrice.toLocaleString('fr-FR')} Ar</td>
                      <td>{item.amount.toLocaleString('fr-FR')} Ar</td>
                      <td>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          Retirer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="items-section">
              <h2 className="section-title">Frais supplémentaires</h2>

              <div className="form-group">
                <label className="form-label">Frais / Autres (optionnel)</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  step="0.01"
                  value={formData.fees}
                  onChange={(e) => setFormData({ ...formData, fees: parseFloat(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="form-card">
          <div className="form-section">
            <h2 className="section-title">Notes</h2>
            <textarea
              className="form-textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows="4"
              placeholder="Ajouter des notes optionnelles..."
            />
          </div>
        </div>

        {/* Totaux */}
        <div className="form-card">
          <div className="totals-section">
            <div className="total-row">
              <span className="total-label">Sous-total:</span>
              <span className="total-amount">
                {(total - formData.fees).toLocaleString('fr-FR')} Ar
              </span>
            </div>
            {formData.fees > 0 && (
              <div className="total-row">
                <span className="total-label">Frais:</span>
                <span className="total-amount">
                  {formData.fees.toLocaleString('fr-FR')} Ar
                </span>
              </div>
            )}
            <div className="total-row" style={{ fontSize: '1.25rem', marginTop: '1rem' }}>
              <span className="total-label">Total:</span>
              <span className="total-amount">
                {total.toLocaleString('fr-FR')} Ar
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? 'Création...' : 'Créer la facture'}
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/invoices')}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
