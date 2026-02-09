import { useState, useEffect } from 'react'
import { DB } from '../services/database'
import { formatNumber } from '../utils/formatters'

export default function StockPage() {
  const [stock, setStock] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    unit: 'pièce',
    unitPrice: '',
    quantity: '',
    minQuantity: ''
  })

  useEffect(() => {
    loadStock()
  }, [])

  const loadStock = () => {
    const data = DB.getStock()
    setStock(data.sort((a, b) => a.name.localeCompare(b.name)))
  }

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        name: item.name,
        unit: item.unit,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        minQuantity: item.minQuantity || ''
      })
    } else {
      setEditingItem(null)
      setFormData({
        name: '',
        unit: 'pièce',
        unitPrice: '',
        quantity: '',
        minQuantity: ''
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({
      name: '',
      unit: 'pièce',
      unitPrice: '',
      quantity: '',
      minQuantity: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('❌ Le nom de l\'article est obligatoire')
      return
    }

    const itemData = {
      ...formData,
      unitPrice: parseFloat(formData.unitPrice) || 0,
      quantity: parseFloat(formData.quantity) || 0,
      minQuantity: parseFloat(formData.minQuantity) || 0
    }

    if (editingItem) {
      DB.updateStockItem(editingItem.id, itemData)
      alert('✅ Article modifié avec succès')
    } else {
      DB.addStockItem(itemData)
      alert('✅ Article ajouté au stock')
    }
    loadStock()
    closeModal()
  }

  const deleteItem = (id, name) => {
    if (confirm(`Supprimer l'article "${name}" du stock ?`)) {
      DB.deleteStockItem(id)
      loadStock()
      alert('✅ Article supprimé')
    }
  }

  const filteredStock = stock.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.unit.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const lowStockItems = stock.filter(item => 
    item.minQuantity > 0 && item.quantity <= item.minQuantity
  )

  const totalValue = stock.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)

  return (
    <div className="container">
      <h1>📦 Gestion du Stock</h1>

      {lowStockItems.length > 0 && (
        <div className="card" style={{ background: '#3a1a1a', borderColor: '#c62828', marginBottom: '20px' }}>
          <h3 style={{ color: '#ff5252' }}>⚠️ Alerte Stock Bas ({lowStockItems.length})</h3>
          <div style={{ marginTop: '10px' }}>
            {lowStockItems.map(item => (
              <div key={item.id} style={{ padding: '5px 0', borderBottom: '1px solid #444' }}>
                <strong>{item.name}</strong> : {item.quantity} {item.unit} (minimum : {item.minQuantity})
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
        <div className="card" style={{ padding: '15px' }}>
          <div style={{ fontSize: '1.5em' }}>📦</div>
          <div style={{ fontSize: '0.9em', color: '#999' }}>Articles en stock</div>
          <div style={{ fontSize: '1.8em', color: 'var(--accent)', fontWeight: 'bold' }}>
            {stock.length}
          </div>
        </div>
        <div className="card" style={{ padding: '15px' }}>
          <div style={{ fontSize: '1.5em' }}>💰</div>
          <div style={{ fontSize: '0.9em', color: '#999' }}>Valeur totale</div>
          <div style={{ fontSize: '1.8em', color: 'var(--accent)', fontWeight: 'bold' }}>
            {formatNumber(totalValue)} Ar
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={() => openModal()}>
          ➕ Nouvel Article
        </button>
        <input
          type="text"
          placeholder="🔍 Rechercher un article..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: '1', minWidth: '250px' }}
        />
      </div>

      <div className="card">
        <h2>📋 Inventaire ({filteredStock.length})</h2>
        {filteredStock.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {searchTerm ? 'Aucun article trouvé' : 'Aucun article en stock. Ajoutez votre premier article !'}
          </p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Article</th>
                <th>Unité</th>
                <th>Prix unitaire</th>
                <th>Quantité</th>
                <th>Valeur</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStock.map(item => {
                const isLowStock = item.minQuantity > 0 && item.quantity <= item.minQuantity
                return (
                  <tr key={item.id} style={isLowStock ? { background: '#2a1a1a' } : {}}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.unit}</td>
                    <td>{formatNumber(item.unitPrice)} Ar</td>
                    <td>
                      <strong style={{ color: isLowStock ? '#ff5252' : 'inherit' }}>
                        {item.quantity}
                      </strong>
                      {item.minQuantity > 0 && (
                        <span style={{ fontSize: '0.85em', color: '#999', marginLeft: '5px' }}>
                          (min: {item.minQuantity})
                        </span>
                      )}
                    </td>
                    <td><strong>{formatNumber(item.quantity * item.unitPrice)} Ar</strong></td>
                    <td>
                      {isLowStock ? (
                        <span style={{ color: '#ff5252', fontWeight: 'bold' }}>⚠️ Bas</span>
                      ) : (
                        <span style={{ color: '#4caf50' }}>✓ OK</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '6px 12px', marginRight: '5px' }}
                        onClick={() => openModal(item)}
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ padding: '6px 12px' }}
                        onClick={() => deleteItem(item.id, item.name)}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          overflow: 'auto'
        }}>
          <div className="card" style={{ width: '90%', maxWidth: '500px', margin: '20px' }}>
            <h2>{editingItem ? '✏️ Modifier l\'article' : '➕ Nouvel article'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Nom de l'article <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Ciment, Sable, etc."
                  required
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Unité
                </label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                >
                  <option value="pièce">Pièce</option>
                  <option value="kg">Kilogramme (kg)</option>
                  <option value="m">Mètre (m)</option>
                  <option value="m²">Mètre carré (m²)</option>
                  <option value="m³">Mètre cube (m³)</option>
                  <option value="litre">Litre</option>
                  <option value="sac">Sac</option>
                  <option value="paquet">Paquet</option>
                  <option value="boîte">Boîte</option>
                  <option value="carton">Carton</option>
                </select>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Prix unitaire (Ar)
                </label>
                <input
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  placeholder="0"
                  step="0.01"
                  min="0"
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Quantité
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="0"
                  step="0.01"
                  min="0"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                  Quantité minimale (alerte stock bas)
                </label>
                <input
                  type="number"
                  value={formData.minQuantity}
                  onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })}
                  placeholder="0"
                  step="0.01"
                  min="0"
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingItem ? '💾 Modifier' : '➕ Ajouter'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeModal}
                  style={{ flex: 1 }}
                >
                  ❌ Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
