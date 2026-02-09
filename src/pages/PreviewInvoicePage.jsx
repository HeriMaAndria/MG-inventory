import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DB } from '../services/database'
import { formatNumber, numberToWords } from '../utils/formatters'
import '../styles/invoice.css'

export default function PreviewInvoicePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)
  const [settings] = useState(DB.getSettings())

  useEffect(() => {
    const data = DB.getInvoiceById(id)
    if (!data) {
      alert('❌ Facture introuvable')
      navigate('/')
    } else {
      setInvoice(data)
    }
  }, [id, navigate])

  const handlePrint = () => {
    window.print()
  }

  if (!invoice) {
    return (
      <div className="container">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <div>
      <div className="no-print" style={{ background: 'var(--bg-secondary)', padding: '15px', borderBottom: '2px solid var(--accent)' }}>
        <div className="container" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={handlePrint}>
            🖨️ Imprimer
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(`/create?id=${id}`)}>
            ✏️ Modifier
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>
            ← Retour
          </button>
        </div>
      </div>

      <div className="invoice-container">
        <div className="invoice-preview">
          {/* EN-TÊTE ENTREPRISE */}
          <div className="invoice-header">
            {/* Décommenter si vous avez un logo */}
            {/* <img src="/logo.png" alt="Logo" className="invoice-company-logo" /> */}
            
            <h1 className="invoice-company-name">
              {settings.companyName || 'ENTREPRISE'}
            </h1>
            
            <div className="invoice-company-info">
              {settings.companyActivity && <div>{settings.companyActivity}</div>}
              {settings.companyAddress && <div>{settings.companyAddress}</div>}
              
              <div style={{ marginTop: '8px' }}>
                {settings.companyStat && <span>STAT: {settings.companyStat}</span>}
                {settings.companyNif && <span style={{ marginLeft: '20px' }}>NIF: {settings.companyNif}</span>}
              </div>
              
              {settings.companyPhone && <div style={{ marginTop: '5px' }}>Tél: {settings.companyPhone}</div>}
            </div>
          </div>

          {/* TITRE */}
          <h2 className="invoice-title">FACTURE</h2>

          {/* INFORMATIONS FACTURE & CLIENT */}
          <div className="invoice-info-section">
            <div className="invoice-info-block">
              <strong>Facture</strong>
              <div><strong>N°:</strong> {invoice.number}</div>
              <div><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString('fr-FR')}</div>
            </div>

            <div className="invoice-info-block">
              <strong>Client</strong>
              <div>{invoice.client.name}</div>
              {invoice.client.phone && <div>Tél: {invoice.client.phone}</div>}
              {invoice.client.address && <div>{invoice.client.address}</div>}
            </div>
          </div>

          {/* TABLEAU DES ARTICLES */}
          <table className="invoice-table">
            <thead>
              <tr>
                <th>DÉSIGNATION</th>
                <th className="text-center" style={{ width: '100px' }}>UNITÉ</th>
                <th className="text-right" style={{ width: '100px' }}>QTÉ</th>
                <th className="text-right" style={{ width: '120px' }}>P.U (Ar)</th>
                <th className="text-right" style={{ width: '140px' }}>MONTANT (Ar)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="invoice-item-description">
                      {item.description}
                    </div>
                    {item.detailLines && item.detailLines.length > 0 && (
                      <ul className="invoice-item-details">
                        {item.detailLines.map((line, idx) => (
                          <li key={idx}>{line.text}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="text-center">{item.unit}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">{formatNumber(item.unitPrice)}</td>
                  <td className="text-right"><strong>{formatNumber(item.total)}</strong></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" className="text-right">
                  <strong>TOTAL</strong>
                </td>
                <td className="text-right">
                  <span className="invoice-total-amount">
                    {formatNumber(invoice.total)}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>

          {/* MONTANT EN LETTRES */}
          <div className="invoice-amount-words">
            <strong>Arrêté la présente facture à la somme de :</strong>
            <div>{numberToWords(invoice.total)}</div>
          </div>

          {/* NOTES */}
          {invoice.notes && (
            <div className="invoice-notes">
              <strong>Notes :</strong>
              <div>{invoice.notes}</div>
            </div>
          )}

          {/* SIGNATURES */}
          <div className="invoice-signatures">
            <div className="invoice-signature-block">
              <div className="invoice-signature-title">Le Client</div>
              <div className="invoice-signature-line">Signature</div>
            </div>
            <div className="invoice-signature-block">
              <div className="invoice-signature-title">Le Fournisseur</div>
              <div className="invoice-signature-line">Signature et cachet</div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="invoice-footer">
            Facture générée le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>
    </div>
  )
}
