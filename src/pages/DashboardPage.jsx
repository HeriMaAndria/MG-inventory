import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DB } from '../services/database'
import { formatNumber } from '../utils/formatters'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ monthTotal: 0, totalInvoices: 0, lastClient: '-' })
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [stock, setStock] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setStats(DB.getStats())
    setInvoices(DB.getInvoices())
    setClients(DB.getClients())
    setStock(DB.getStock())
  }

  const deleteInvoice = (id) => {
    if (confirm('Supprimer cette facture ?')) {
      DB.deleteInvoice(id)
      loadData()
      alert('✅ Facture supprimée')
    }
  }

  return (
    <div className="container">
      <h1>📊 Tableau de Bord</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', margin: '30px 0' }}>
        <div className="card">
          <div style={{ fontSize: '2em' }}>💰</div>
          <div>Total du mois</div>
          <div style={{ fontSize: '1.5em', color: 'var(--accent)', fontWeight: 'bold' }}>
            {formatNumber(stats.monthTotal)} Ar
          </div>
        </div>
        
        <div className="card">
          <div style={{ fontSize: '2em' }}>📄</div>
          <div>Factures créées</div>
          <div style={{ fontSize: '1.5em', color: 'var(--accent)', fontWeight: 'bold' }}>
            {stats.totalInvoices}
          </div>
        </div>
        
        <div className="card">
          <div style={{ fontSize: '2em' }}>👤</div>
          <div>Total clients</div>
          <div style={{ fontSize: '1.5em', color: 'var(--accent)', fontWeight: 'bold' }}>
            {clients.length}
          </div>
        </div>
        
        <div className="card">
          <div style={{ fontSize: '2em' }}>📦</div>
          <div>Articles en stock</div>
          <div style={{ fontSize: '1.5em', color: 'var(--accent)', fontWeight: 'bold' }}>
            {stock.length}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
        <button className="btn btn-primary" onClick={() => navigate('/create')}>
          ➕ Nouvelle Facture
        </button>
      </div>

      <div className="card">
        <h2>📋 Toutes les factures</h2>
        {invoices.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Aucune facture. Créez votre première facture !
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>N° Facture</th>
                <th>Date</th>
                <th>Client</th>
                <th>Montant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(invoice => (
                <tr key={invoice.id}>
                  <td><strong>{invoice.number}</strong></td>
                  <td>{new Date(invoice.date).toLocaleDateString('fr-FR')}</td>
                  <td>{invoice.client.name}</td>
                  <td><strong>{formatNumber(invoice.total)} Ar</strong></td>
                  <td>
                    <button className="btn btn-primary" style={{ padding: '6px 12px', marginRight: '5px' }} onClick={() => navigate(`/preview/${invoice.id}`)}>👁️</button>
                    <button className="btn btn-secondary" style={{ padding: '6px 12px', marginRight: '5px' }} onClick={() => navigate(`/create?id=${invoice.id}`)}>✏️</button>
                    <button className="btn btn-danger" style={{ padding: '6px 12px' }} onClick={() => deleteInvoice(invoice.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
