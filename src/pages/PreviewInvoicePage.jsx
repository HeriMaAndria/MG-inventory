import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DB } from '../services/database'
import { formatNumber, numberToWords } from '../utils/formatters'

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

      <div className="container" style={{ maxWidth: '800px', padding: '40px 20px' }}>
        <div className="invoice-preview" style={{
          background: 'white',
          color: '#000',
          padding: '40px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #000', paddingBottom: '20px' }}>
            <h1 style={{ fontSize: '2em', margin: '0 0 10px 0', color: '#000' }}>
              {settings.companyName || 'ENTREPRISE'}
            </h1>
            <div style={{ fontSize: '0.95em', color: '#333' }}>
              {settings.companyActivity && <div>{settings.companyActivity}</div>}
              {settings.companyAddress && <div>{settings.companyAddress}</div>}
              <div style={{ marginTop: '5px' }}>
                {settings.companyStat && <span>STAT: {settings.companyStat}</span>}
                {settings.companyNif && <span style={{ marginLeft: '15px' }}>NIF: {settings.companyNif}</span>}
              </div>
              {settings.companyPhone && <div>Tél: {settings.companyPhone}</div>}
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '1.5em', color: '#000', marginBottom: '15px', textAlign: 'center' }}>
              FACTURE
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>N° Facture:</strong> {invoice.number}
                </div>
                <div>
                  <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>CLIENT:</div>
                <div>{invoice.client.name}</div>
                {invoice.client.phone && <div>Tél: {invoice.client.phone}</div>}
                {invoice.client.address && <div>{invoice.client.address}</div>}
              </div>
            </div>
          </div>

          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            marginBottom: '30px',
            border: '1px solid #000'
          }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ 
                  border: '1px solid #000', 
                  padding: '10px', 
                  textAlign: 'left',
                  color: '#000'
                }}>
                  DÉSIGNATION
                </th>
                <th style={{ 
                  border: '1px solid #000', 
                  padding: '10px', 
                  textAlign: 'center',
                  color: '#000',
                  width: '80px'
                }}>
                  UNITÉ
                </th>
                <th style={{ 
                  border: '1px solid #000', 
                  padding: '10px', 
                  textAlign: 'right',
                  color: '#000',
                  width: '100px'
                }}>
                  QTÉ
                </th>
                <th style={{ 
                  border: '1px solid #000', 
                  padding: '10px', 
                  textAlign: 'right',
                  color: '#000',
                  width: '120px'
                }}>
                  P.U (Ar)
                </th>
                <th style={{ 
                  border: '1px solid #000', 
                  padding: '10px', 
                  textAlign: 'right',
                  color: '#000',
                  width: '140px'
                }}>
                  MONTANT (Ar)
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #000', padding: '8px', color: '#000' }}>
                    {item.description}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', color: '#000' }}>
                    {item.unit}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', color: '#000' }}>
                    {item.quantity}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', color: '#000' }}>
                    {formatNumber(item.unitPrice)}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'right', color: '#000' }}>
                    {formatNumber(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="4" style={{ 
                  border: '1px solid #000', 
                  padding: '12px', 
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '1.1em',
                  background: '#f0f0f0',
                  color: '#000'
                }}>
                  TOTAL
                </td>
                <td style={{ 
                  border: '1px solid #000', 
                  padding: '12px', 
                  textAlign: 'right',
                  fontWeight: 'bold',
                  fontSize: '1.2em',
                  background: '#e0e0e0',
                  color: '#000'
                }}>
                  {formatNumber(invoice.total)}
                </td>
              </tr>
            </tfoot>
          </table>

          <div style={{ 
            background: '#f9f9f9', 
            padding: '15px', 
            borderRadius: '5px',
            marginBottom: '30px',
            border: '1px solid #ddd'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#000' }}>
              Arrêté la présente facture à la somme de :
            </div>
            <div style={{ fontSize: '1.05em', fontStyle: 'italic', color: '#333' }}>
              {numberToWords(invoice.total)}
            </div>
          </div>

          {invoice.notes && (
            <div style={{ marginBottom: '30px' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#000' }}>Notes:</div>
              <div style={{ whiteSpace: 'pre-wrap', color: '#333', fontSize: '0.95em' }}>
                {invoice.notes}
              </div>
            </div>
          )}

          <div style={{ 
            marginTop: '50px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '40px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '60px', color: '#000' }}>
                Le Client
              </div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '5px', color: '#000' }}>
                Signature
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '60px', color: '#000' }}>
                Le Fournisseur
              </div>
              <div style={{ borderTop: '1px solid #000', paddingTop: '5px', color: '#000' }}>
                Signature et cachet
              </div>
            </div>
          </div>

          <div style={{ 
            marginTop: '40px',
            paddingTop: '20px',
            borderTop: '1px solid #ddd',
            fontSize: '0.85em',
            textAlign: 'center',
            color: '#666'
          }}>
            Facture générée le {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR')}
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body {
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
          .navbar {
            display: none !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .invoice-preview {
            box-shadow: none !important;
            border-radius: 0 !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  )
}
