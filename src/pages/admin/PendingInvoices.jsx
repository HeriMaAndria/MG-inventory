import { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'

export default function PendingInvoices() {
  const [invoices, setInvoices] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadPendingInvoices()
  }, [])

  const loadPendingInvoices = async () => {
    try {
      setLoading(true)
      setError('')

      const { data, error: err } = await supabase
        .from('invoices')
        .select(`
          *,
          profiles:userId (
            companyName
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

      if (err) throw err
      setInvoices(data || [])
    } catch (err) {
      setError('Erreur lors du chargement des factures')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    try {
      const { error: err } = await supabase
        .from('invoices')
        .update({ 
          status: 'approved',
          adminComment: comment,
          approvedAt: new Date().toISOString()
        })
        .eq('id', id)

      if (err) throw err

      alert('Facture validée!')
      setComment('')
      loadPendingInvoices()
      setSelectedId(null)
    } catch (err) {
      alert('Erreur lors de la validation')
      console.error(err)
    }
  }

  const handleReject = async (id) => {
    if (!comment.trim()) {
      alert('Veuillez ajouter un commentaire pour justifier le rejet')
      return
    }

    try {
      const { error: err } = await supabase
        .from('invoices')
        .update({ 
          status: 'rejected',
          adminComment: comment,
          rejectedAt: new Date().toISOString()
        })
        .eq('id', id)

      if (err) throw err

      alert('Facture rejetée!')
      setComment('')
      loadPendingInvoices()
      setSelectedId(null)
    } catch (err) {
      alert('Erreur lors du rejet')
      console.error(err)
    }
  }

  const selected = invoices.find(inv => inv.id === selectedId)

  return (
    <div className="pending-invoices">
      <style>{`
        .pending-invoices {
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

        .invoices-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .invoice-card {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 1.5rem;
          cursor: pointer;
          transition: var(--transition);
        }

        .invoice-card:hover {
          border-color: var(--accent);
          box-shadow: 0 8px 16px rgba(255, 215, 0, 0.1);
        }

        .invoice-card.selected {
          border-color: var(--accent);
          background-color: var(--bg-tertiary);
        }

        .invoice-number {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--accent);
          margin-bottom: 0.5rem;
        }

        .invoice-info {
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 0.25rem;
        }

        .invoice-total {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--accent);
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid var(--border-light);
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
          padding: 1rem;
        }

        .modal.show {
          display: flex;
        }

        .modal-content {
          background-color: var(--bg-secondary);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 2rem;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 1.5rem;
        }

        .details-table {
          width: 100%;
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .details-row {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 1rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .details-row:last-child {
          border-bottom: none;
        }

        .details-label {
          color: var(--text-secondary);
          font-weight: 500;
        }

        .details-value {
          color: var(--text-primary);
        }

        .items-section {
          margin: 1.5rem 0;
          padding: 1rem 0;
          border-top: 1px solid var(--border-light);
          border-bottom: 1px solid var(--border-light);
        }

        .items-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.85rem;
        }

        .items-table th {
          background-color: var(--bg-tertiary);
          padding: 0.5rem;
          text-align: left;
          border-bottom: 1px solid var(--border-light);
          font-weight: 600;
        }

        .items-table td {
          padding: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: var(--text-primary);
        }

        .form-textarea {
          width: 100%;
          padding: 0.75rem;
          background-color: var(--bg-input);
          border: 1px solid var(--border-color);
          border-radius: 6px;
          color: var(--text-primary);
          font-size: 0.9rem;
          font-family: inherit;
          resize: vertical;
        }

        .form-textarea:focus {
          outline: none;
          border-color: var(--accent);
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

        .btn-approve {
          background-color: var(--success);
          color: white;
        }

        .btn-approve:hover {
          opacity: 0.9;
        }

        .btn-reject {
          background-color: var(--error);
          color: white;
        }

        .btn-reject:hover {
          opacity: 0.9;
        }

        .btn-close {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border-light);
        }

        .btn-close:hover {
          background-color: var(--border-light);
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          background-color: var(--bg-secondary);
          border-radius: 8px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .pending-invoices {
            padding: 1rem;
          }

          .invoices-list {
            grid-template-columns: 1fr;
          }

          .modal-content {
            max-width: 90%;
          }

          .details-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <h1 className="page-title">Factures en Attente de Validation</h1>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="empty-state">
          <p>Chargement...</p>
        </div>
      ) : invoices.length === 0 ? (
        <div className="empty-state">
          <p>Aucune facture en attente de validation</p>
        </div>
      ) : (
        <>
          <div className="invoices-list">
            {invoices.map(invoice => (
              <div
                key={invoice.id}
                className={`invoice-card ${selectedId === invoice.id ? 'selected' : ''}`}
                onClick={() => setSelectedId(invoice.id)}
              >
                <div className="invoice-number">{invoice.invoiceNumber || invoice.draftNumber}</div>
                <div className="invoice-info">Client: {invoice.clientName}</div>
                <div className="invoice-info">Revendeur: {invoice.profiles?.companyName || 'N/A'}</div>
                <div className="invoice-info">Date: {new Date(invoice.date).toLocaleDateString('fr-FR')}</div>
                <div className="invoice-total">{invoice.total?.toLocaleString('fr-FR')} Ar</div>
              </div>
            ))}
          </div>

          <div className={`modal ${selectedId ? 'show' : ''}`} onClick={() => setSelectedId(null)}>
            {selected && (
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal-title">Détails de la Facture</h2>

                <div className="details-table">
                  <div className="details-row">
                    <span className="details-label">Numéro:</span>
                    <span className="details-value">{selected.invoiceNumber || selected.draftNumber}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Client:</span>
                    <span className="details-value">{selected.clientName}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Revendeur:</span>
                    <span className="details-value">{selected.profiles?.companyName || 'N/A'}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Date:</span>
                    <span className="details-value">{new Date(selected.date).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="details-row">
                    <span className="details-label">Total:</span>
                    <span className="details-value">{selected.total?.toLocaleString('fr-FR')} Ar</span>
                  </div>
                </div>

                <div className="items-section">
                  <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: '600' }}>Articles</h3>
                  <table className="items-table">
                    <thead>
                      <tr>
                        <th>Désignation</th>
                        <th>Quantité</th>
                        <th>P.U</th>
                        <th>Montant</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selected.items || []).map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.designation}</td>
                          <td>{item.quantity}</td>
                          <td>{item.unitPrice?.toLocaleString('fr-FR')} Ar</td>
                          <td>{item.amount?.toLocaleString('fr-FR')} Ar</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="form-group">
                  <label className="form-label">Commentaire</label>
                  <textarea
                    className="form-textarea"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Ajouter un commentaire optionnel..."
                    rows="3"
                  />
                </div>

                <div className="modal-buttons">
                  <button className="btn btn-approve" onClick={() => handleApprove(selected.id)}>
                    Valider
                  </button>
                  <button className="btn btn-reject" onClick={() => handleReject(selected.id)}>
                    Rejeter
                  </button>
                  <button className="btn btn-close" onClick={() => setSelectedId(null)}>
                    Fermer
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
