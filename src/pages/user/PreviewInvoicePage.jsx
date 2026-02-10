import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'

export default function PreviewInvoicePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [fullscreen, setFullscreen] = useState(false)
  const [invoice, setInvoice] = useState(null)

  useEffect(() => {
    setInvoice({
      id: id || 'DRAFT-001',
      type: 'devis',
      draftNumber: 'BRO-REF123-2025-001',
      date: new Date().toLocaleDateString('fr-FR'),
      client: { name: 'Client Example', phone: '034 XX XX XX', address: 'Tana' },
      items: [
        { details: '', designation: 'Produit A', quantity: 5, unitPrice: 7000, amount: 35000 },
        { details: 'En stock', designation: 'Produit B', quantity: 3, unitPrice: 2500, amount: 7500 },
      ],
      subtotal: 42500,
      fees: 0,
      total: 42500,
      notes: 'Merci pour votre confiance',
    })
  }, [id])

  if (!invoice) return <div>Chargement...</div>

  const invoiceContent = (
    <div className="invoice-page" style={{ width: '210mm', height: '297mm', margin: '0 auto', padding: '15mm', background: 'white', color: '#000', fontFamily: 'Arial, sans-serif', fontSize: '8pt', lineHeight: 1.4 }}>
      {/* En-tête */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10mm', marginBottom: '8mm', paddingBottom: '5mm', borderBottom: '2px solid #000' }}>
        {/* Gauche - Entreprise */}
        <div>
          <h1 style={{ fontSize: '14pt', margin: '0 0 3mm 0', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {profile?.companyName || 'ENTREPRISE'}
          </h1>
          <div style={{ fontSize: '8pt', lineHeight: 1.6 }}>
            <div>Activité: Commerce</div>
            <div>Adresse: {profile?.address || 'Votre adresse'}</div>
            <div style={{ marginTop: '2mm' }}>
              <div>NIF: {profile?.nif || 'XXXXX'}</div>
              <div>STAT: {profile?.stat || 'XXXXX'}</div>
            </div>
            <div style={{ marginTop: '2mm' }}>Tél: {profile?.phone || '034 XX XX XX'}</div>
            <div>Responsable: {profile?.responsibleNumber || 'REF123'}</div>
          </div>
        </div>

        {/* Droite - Facture & Client */}
        <div>
          <div style={{ background: '#f5f5f5', padding: '4mm', marginBottom: '4mm', border: '1px solid #000' }}>
            <div style={{ fontWeight: 'bold', fontSize: '12pt', marginBottom: '2mm' }}>
              {invoice.type === 'facture' ? 'FACTURE' : 'FACTURE PROFORMA'}
            </div>
            <div style={{ fontSize: '8pt' }}>
              <div><strong>N°:</strong> {invoice.draftNumber}</div>
              <div><strong>Date:</strong> {invoice.date}</div>
              <div><strong>Responsable:</strong> {profile?.responsibleNumber || 'REF123'}</div>
            </div>
          </div>

          <div style={{ background: '#f5f5f5', padding: '4mm', border: '1px solid #000' }}>
            <div style={{ fontWeight: 'bold', fontSize: '9pt', marginBottom: '2mm' }}>CLIENT</div>
            <div style={{ fontSize: '8pt' }}>
              <div>{invoice.client.name}</div>
              <div>Tél: {invoice.client.phone}</div>
              <div>{invoice.client.address}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tableau articles */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '5mm', fontSize: '8pt' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ border: '1px solid #000', padding: '2mm', textAlign: 'left', fontWeight: 'bold', fontSize: '9pt', textTransform: 'uppercase', width: '15%' }}>DÉTAILS</th>
            <th style={{ border: '1px solid #000', padding: '2mm', textAlign: 'left', fontWeight: 'bold', fontSize: '9pt', textTransform: 'uppercase', width: '35%' }}>DÉSIGNATION</th>
            <th style={{ border: '1px solid #000', padding: '2mm', textAlign: 'left', fontWeight: 'bold', fontSize: '9pt', textTransform: 'uppercase', width: '12%' }}>QTÉ</th>
            <th style={{ border: '1px solid #000', padding: '2mm', textAlign: 'left', fontWeight: 'bold', fontSize: '9pt', textTransform: 'uppercase', width: '15%' }}>P.U (Ar)</th>
            <th style={{ border: '1px solid #000', padding: '2mm', textAlign: 'left', fontWeight: 'bold', fontSize: '9pt', textTransform: 'uppercase', width: '18%' }}>MT (Ar)</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #000', padding: '2mm', verticalAlign: 'top' }}>{item.details}</td>
              <td style={{ border: '1px solid #000', padding: '2mm', verticalAlign: 'top' }}>{item.designation}</td>
              <td style={{ border: '1px solid #000', padding: '2mm', textAlign: 'center' }}>{item.quantity}</td>
              <td style={{ border: '1px solid #000', padding: '2mm', textAlign: 'right' }}>{item.unitPrice.toLocaleString('fr-FR')}</td>
              <td style={{ border: '1px solid #000', padding: '2mm', textAlign: 'right' }}>{item.amount.toLocaleString('fr-FR')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totaux */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5mm', paddingBottom: '5mm', borderBottom: '2px solid #000' }}>
        <div style={{ width: '200px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8pt', marginBottom: '2mm' }}>
            <span>Sous-total:</span>
            <span>{invoice.subtotal.toLocaleString('fr-FR')} Ar</span>
          </div>
          {invoice.fees > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8pt', marginBottom: '2mm' }}>
              <span>Frais:</span>
              <span>{invoice.fees.toLocaleString('fr-FR')} Ar</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', fontWeight: 'bold', marginBottom: '2mm' }}>
            <span>Total:</span>
            <span>{invoice.total.toLocaleString('fr-FR')} Ar</span>
          </div>
        </div>
      </div>

      {/* Montant en lettres */}
      <div style={{ background: '#f5f5f5', padding: '3mm', border: '1px solid #000', marginBottom: '5mm', fontSize: '8pt', minHeight: '15mm' }}>
        <strong>Montant en lettres:</strong> Quarante-deux mille cinq cents ariary
      </div>

      {/* Signature */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10mm', marginTop: '10mm', paddingTop: '10mm', borderTop: '1px solid #000' }}>
        <div style={{ textAlign: 'center', fontSize: '8pt' }}>
          <div style={{ borderTop: '1px solid #000', marginTop: '20mm', marginBottom: '2mm', height: '30mm' }}></div>
          <strong style={{ fontSize: '7pt', textTransform: 'uppercase' }}>Signature du client</strong>
        </div>
        <div style={{ textAlign: 'center', fontSize: '8pt' }}>
          <div style={{ borderTop: '1px solid #000', marginTop: '20mm', marginBottom: '2mm', height: '30mm' }}></div>
          <strong style={{ fontSize: '7pt', textTransform: 'uppercase' }}>Cachet/Signature</strong>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '10mm', textAlign: 'center', fontSize: '7pt', color: '#666' }}>
        Merci de votre confiance
      </div>
    </div>
  )

  return (
    <div className="preview-invoice-page">
      <style>{`
        .preview-invoice-page {
          background-color: var(--bg-primary);
          padding: ${fullscreen ? '0' : '2rem'};
        }

        .preview-header {
          display: ${fullscreen ? 'none' : 'flex'};
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
          background-color: var(--bg-secondary);
          padding: 1rem;
          border-radius: 8px;
          border: 1px solid var(--border-light);
          z-index: 10;
        }

        .preview-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .preview-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          background-color: var(--accent);
          color: #000;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn:hover {
          background-color: var(--accent-light);
        }

        .btn-secondary {
          background-color: var(--bg-tertiary);
          color: var(--text-primary);
          border: 1px solid var(--border-light);
        }

        .btn-secondary:hover {
          background-color: var(--border-light);
        }

        .invoice-container {
          ${fullscreen ? 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; overflow: auto; z-index: 999;' : 'margin: 0 auto;'}
        }

        @media print {
          .preview-header {
            display: none !important;
          }

          body {
            background: white;
            margin: 0;
            padding: 0;
          }

          .preview-invoice-page {
            padding: 0;
          }

          .invoice-container {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .preview-header {
            flex-direction: column;
            align-items: stretch;
          }

          .preview-buttons {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }
      `}</style>

      <div className="preview-header">
        <h1 className="preview-title">Aperçu Facture</h1>
        <div className="preview-buttons">
          <button className="btn" onClick={() => window.print()}>
            Imprimer
          </button>
          <button className="btn btn-secondary" onClick={() => setFullscreen(!fullscreen)}>
            {fullscreen ? 'Quitter plein écran' : 'Plein écran'}
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/invoices')}>
            Retour
          </button>
        </div>
      </div>

      <div className="invoice-container">
        {invoiceContent}
      </div>
    </div>
  )
}
