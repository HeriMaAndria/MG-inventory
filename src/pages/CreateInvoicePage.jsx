import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DB } from '../services/database'
import { formatNumber } from '../utils/formatters'

export default function CreateInvoicePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')

  const [settings] = useState(DB.getSettings())
  const [clients, setClients] = useState([])
  const [stock, setStock] = useState([])
  
  const [formData, setFormData] = useState({
    number: '',
    date: new Date().toISOString().split('T')[0],
    client: {
      name: '',
      phone: '',
      address: ''
    },
    items: [],
    notes: ''
  })

  const [currentItem, setCurrentItem] = useState({
    description: '',
    unit: 'pièce',
    quantity: '',
    unitPrice: '',
    selectedStockId: ''
  })

  useEffect(() => {
    loadData()
    if (editId) {
      loadInvoice(editId)
    } else {
      setFormData(prev => ({ ...prev, number: DB.getNextInvoiceNumber() }))
    }
  }, [editId])

  const loadData = () => {
    setClients(DB.getClients())
    setStock(DB.getStock())
  }

  const loadInvoice = (id) => {
    const invoice = DB.getInvoiceById(id)
    if (invoice) {
      setFormData({
        number: invoice.number,
        date: invoice.date,
        client: invoice.client,
        items: invoice.items,
        notes: invoice.notes || ''
      })
    }
  }

  const selectClient = (clientId) => {
    const client = clients.find(c => c.id === clientId)
    if (client) {
      setFormData({
        ...formData,
        client: {
          name: client.name,
          phone: client.phone || '',
          address: client.address || ''
        }
      })
    }
  }

  const selectStockItem = (stockId) => {
    const item = stock.find(s => s.id === stockId)
    if (item) {
      setCurrentItem({
        ...currentItem,
        description: item.name,
        unit: item.unit,
        unitPrice: item.unitPrice.toString(),
        selectedStockId: stockId
      })
    }
  }

  const addItem = () => {
    if (!currentItem.description || !currentItem.quantity || !currentItem.unitPrice) {
      alert('❌ Veuillez remplir tous les champs de l\'article')
      return
    }

    const quantity = parseFloat(currentItem.quantity)
    const unitPrice = parseFloat(currentItem.unitPrice)

    const newItem = {
      id: Date.now(),
      description: currentItem.description,
      unit: currentItem.unit,
      quantity,
      unitPrice,
      total: quantity * unitPrice
    }

    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    })

    setCurrentItem({
      description: '',
      unit: 'pièce',
      quantity: '',
      unitPrice: '',
      selectedStockId: ''
    })
  }

  const removeItem = (id) => {
    setFormData({
      ...formData,
      items: formData.items.filter(item => item.id !== id)
    })
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!formData.client.name) {
      alert('❌ Veuillez saisir un client')
      return
    }

    if (formData.items.length === 0) {
      alert('❌ Veuillez ajouter au moins un article')
      return
    }

    const invoice = {
      ...formData,
      total: calculateTotal()
    }

    if (editId) {
      DB.updateInvoice(editId, invoice)
      alert('✅ Facture modifiée avec succès')
    } else {
      const savedInvoice = DB.addInvoice(invoice)
      alert('✅ Facture créée avec succès')
      navigate(`/preview/${savedInvoice.id}`)
      return
    }

    navigate('/')
  }

  const total = calculateTotal()

  return (
    <div className="container">
      <h1>{editId ? '✏️ Modifier la Facture' : '✏️ Nouvelle Facture'}</h1>

      <form onSubmit={handleSubmit}>
        <div className="card">
          <h2>📋 Informations de la facture</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                N° Facture
              </label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2>👤 Informations Client</h2>
          
          {clients.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Sélectionner un client existant
              </label>
              <select
                onChange={(e) => e.target.value && selectClient(e.target.value)}
                value=""
              >
                <option value="">-- Choisir un client --</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} {client.phone ? `(${client.phone})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Nom <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.client.name}
                onChange={(e) => setFormData({
                  ...formData,
                  client: { ...formData.client, name: e.target.value }
                })}
                placeholder="Nom du client"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.client.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  client: { ...formData.client, phone: e.target.value }
                })}
                placeholder="0XX XX XXX XX"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Adresse
              </label>
              <textarea
                value={formData.client.address}
                onChange={(e) => setFormData({
                  ...formData,
                  client: { ...formData.client, address: e.target.value }
                })}
                placeholder="Adresse du client"
                rows="2"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <h2>📦 Articles</h2>
          
          {stock.length > 0 && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Sélectionner depuis le stock
              </label>
              <select
                value={currentItem.selectedStockId}
                onChange={(e) => selectStockItem(e.target.value)}
              >
                <option value="">-- Choisir un article --</option>
                {stock.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({formatNumber(item.unitPrice)} Ar/{item.unit})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '10px', alignItems: 'end', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Description</label>
              <input
                type="text"
                value={currentItem.description}
                onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                placeholder="Description de l'article"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Unité</label>
              <select
                value={currentItem.unit}
                onChange={(e) => setCurrentItem({ ...currentItem, unit: e.target.value })}
              >
                <option value="pièce">Pièce</option>
                <option value="kg">kg</option>
                <option value="m">m</option>
                <option value="m²">m²</option>
                <option value="m³">m³</option>
                <option value="litre">litre</option>
                <option value="sac">sac</option>
                <option value="paquet">paquet</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Quantité</label>
              <input
                type="number"
                value={currentItem.quantity}
                onChange={(e) => setCurrentItem({ ...currentItem, quantity: e.target.value })}
                placeholder="0"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>P.U (Ar)</label>
              <input
                type="number"
                value={currentItem.unitPrice}
                onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: e.target.value })}
                placeholder="0"
                step="0.01"
                min="0"
              />
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={addItem}
              style={{ padding: '10px 20px' }}
            >
              ➕
            </button>
          </div>

          {formData.items.length > 0 && (
            <div style={{ marginTop: '20px' }}>
              <table>
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Unité</th>
                    <th>Quantité</th>
                    <th>P.U</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map(item => (
                    <tr key={item.id}>
                      <td>{item.description}</td>
                      <td>{item.unit}</td>
                      <td>{item.quantity}</td>
                      <td>{formatNumber(item.unitPrice)} Ar</td>
                      <td><strong>{formatNumber(item.total)} Ar</strong></td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeItem(item.id)}
                          style={{ padding: '6px 12px' }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background: '#3a3a3a', fontWeight: 'bold' }}>
                    <td colSpan="4" style={{ textAlign: 'right' }}>TOTAL</td>
                    <td colSpan="2" style={{ color: 'var(--accent)', fontSize: '1.2em' }}>
                      {formatNumber(total)} Ar
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h2>📝 Notes</h2>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Notes additionnelles (optionnel)"
            rows="3"
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
            {editId ? '💾 Modifier la facture' : '✅ Créer la facture'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{ flex: 1 }}
          >
            ❌ Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
