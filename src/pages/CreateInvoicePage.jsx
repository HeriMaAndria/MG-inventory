import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DB } from '../services/database'
import { formatNumber } from '../utils/formatters'

export default function CreateInvoicePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('id')

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
    stockReferenceId: '',
    purchasePrice: null,
    description: '',
    detailLines: [{ quantity: '', length: '', unit: 'm' }],
    totalQuantity: '',
    unit: 'm',
    unitPrice: ''
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
        stockReferenceId: stockId,
        purchasePrice: item.purchasePrice || null,
        description: item.name,
        unit: item.purchaseUnit || 'pièce',
        unitPrice: item.unitPrice?.toString() || ''
      })
    } else {
      // Réinitialiser si aucun article sélectionné
      setCurrentItem({
        ...currentItem,
        stockReferenceId: '',
        purchasePrice: null
      })
    }
  }

  const addDetailLine = () => {
    setCurrentItem({
      ...currentItem,
      detailLines: [...currentItem.detailLines, { quantity: '', length: '', unit: 'm' }]
    })
  }

  const removeDetailLine = (index) => {
    const newLines = currentItem.detailLines.filter((_, i) => i !== index)
    setCurrentItem({
      ...currentItem,
      detailLines: newLines.length > 0 ? newLines : [{ quantity: '', length: '', unit: 'm' }]
    })
  }

  const updateDetailLine = (index, field, value) => {
    const newLines = [...currentItem.detailLines]
    newLines[index] = { ...newLines[index], [field]: value }
    setCurrentItem({
      ...currentItem,
      detailLines: newLines
    })
  }

  const calculateLineTotal = (line) => {
    const qty = parseFloat(line.quantity) || 1
    const len = parseFloat(line.length) || 1
    return qty * len
  }

  const calculateTotalFromLines = () => {
    if (currentItem.detailLines.length === 0) return 0
    return currentItem.detailLines.reduce((sum, line) => {
      // Si au moins un champ est rempli
      if (line.quantity || line.length) {
        return sum + calculateLineTotal(line)
      }
      return sum
    }, 0)
  }

  const calculateMargin = () => {
    if (!currentItem.purchasePrice || !currentItem.unitPrice) {
      return null
    }

    const totalFromLines = calculateTotalFromLines()
    const quantity = totalFromLines > 0 ? totalFromLines : parseFloat(currentItem.totalQuantity) || 0

    if (quantity === 0) return null

    const unitPrice = parseFloat(currentItem.unitPrice)
    const purchasePrice = parseFloat(currentItem.purchasePrice)

    const purchaseCost = quantity * purchasePrice
    const saleTotal = quantity * unitPrice
    const margin = saleTotal - purchaseCost
    const marginPercent = (margin / purchaseCost) * 100

    return {
      purchaseCost,
      saleTotal,
      margin,
      marginPercent
    }
  }

  const addItem = () => {
    if (!currentItem.description.trim()) {
      alert('❌ Veuillez saisir une désignation')
      return
    }

    // Calculer la quantité totale depuis les lignes de détails
    const totalFromLines = calculateTotalFromLines()
    const finalQuantity = totalFromLines > 0 ? totalFromLines : parseFloat(currentItem.totalQuantity) || 0

    if (finalQuantity === 0) {
      alert('❌ Veuillez saisir la quantité totale ou au moins une ligne de détails')
      return
    }

    if (!currentItem.unitPrice) {
      alert('❌ Veuillez saisir le prix unitaire')
      return
    }

    const unitPrice = parseFloat(currentItem.unitPrice)

    // Formater les lignes de détails pour l'affichage
    const formattedLines = currentItem.detailLines
      .filter(line => line.quantity || line.length) // Garder seulement les lignes avec au moins un champ rempli
      .map(line => {
        const qty = parseFloat(line.quantity) || 1
        const len = parseFloat(line.length) || 1
        const total = qty * len
        return {
          quantity: qty,
          length: len,
          unit: line.unit || 'm',
          total: total,
          display: `${qty} feuilles × ${len}${line.unit || 'm'} = ${total}${line.unit || 'm'}`
        }
      })

    const newItem = {
      id: Date.now(),
      stockReferenceId: currentItem.stockReferenceId || null,
      purchasePrice: currentItem.purchasePrice,
      description: currentItem.description,
      detailLines: formattedLines,
      quantity: finalQuantity,
      unit: currentItem.unit,
      unitPrice,
      total: finalQuantity * unitPrice
    }

    // Calculer la marge si applicable
    if (currentItem.purchasePrice) {
      const marginData = calculateMargin()
      if (marginData) {
        newItem.purchaseCost = finalQuantity * currentItem.purchasePrice
        newItem.margin = newItem.total - newItem.purchaseCost
        newItem.marginPercent = (newItem.margin / newItem.purchaseCost) * 100
      }
    }

    setFormData({
      ...formData,
      items: [...formData.items, newItem]
    })

    // Réinitialiser le formulaire
    setCurrentItem({
      stockReferenceId: '',
      purchasePrice: null,
      description: '',
      detailLines: [{ quantity: '', length: '', unit: 'm' }],
      totalQuantity: '',
      unit: 'm',
      unitPrice: ''
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
  const marginInfo = calculateMargin()

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
          <h2>📦 Ajouter un Article</h2>
          
          {stock.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                💡 Référence stock (optionnel - pour calculer la marge)
              </label>
              <select
                value={currentItem.stockReferenceId}
                onChange={(e) => selectStockItem(e.target.value)}
              >
                <option value="">-- Article libre (sans référence) --</option>
                {stock.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} - {formatNumber(item.purchasePrice || 0)} Ar/{item.purchaseUnit}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
              📋 Désignation (libellé facture) <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="text"
              value={currentItem.description}
              onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
              placeholder="Ex: TÔLE BAC 0.30 ROUGE (Pré-laqué)"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
              📏 Détails / Lignes (optionnel)
            </label>
            <div style={{ background: '#1a1a1a', padding: '15px', borderRadius: '5px', border: '1px solid #333' }}>
              {currentItem.detailLines.map((line, index) => {
                const lineTotal = calculateLineTotal(line)
                const hasValues = line.quantity || line.length
                
                return (
                  <div key={index} style={{ marginBottom: '15px', padding: '10px', background: '#2a2a2a', borderRadius: '5px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px auto', gap: '10px', alignItems: 'center' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#999' }}>
                          Nombre
                        </label>
                        <input
                          type="number"
                          value={line.quantity}
                          onChange={(e) => updateDetailLine(index, 'quantity', e.target.value)}
                          placeholder="12"
                          step="0.01"
                          min="0"
                          style={{ width: '100%' }}
                        />
                      </div>
                      
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#999' }}>
                          Taille
                        </label>
                        <input
                          type="number"
                          value={line.length}
                          onChange={(e) => updateDetailLine(index, 'length', e.target.value)}
                          placeholder="2.5"
                          step="0.01"
                          min="0"
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9em', color: '#999' }}>
                          Unité
                        </label>
                        <select
                          value={line.unit}
                          onChange={(e) => updateDetailLine(index, 'unit', e.target.value)}
                          style={{ width: '100%' }}
                        >
                          <option value="m">m</option>
                          <option value="cm">cm</option>
                          <option value="mm">mm</option>
                        </select>
                      </div>

                      <div style={{ paddingTop: '20px' }}>
                        {currentItem.detailLines.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => removeDetailLine(index)}
                            style={{ padding: '8px 15px' }}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {hasValues && (
                      <div style={{ 
                        marginTop: '8px', 
                        padding: '8px', 
                        background: '#1a1a1a',
                        borderRadius: '3px',
                        fontSize: '0.9em',
                        color: '#4caf50'
                      }}>
                        Aperçu: {parseFloat(line.quantity) || 1} feuilles × {parseFloat(line.length) || 1}{line.unit} = {lineTotal}{line.unit}
                      </div>
                    )}
                  </div>
                )
              })}
              
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addDetailLine}
                style={{ padding: '8px 15px', fontSize: '0.9em', marginTop: '10px' }}
              >
                + Ajouter une ligne
              </button>

              {calculateTotalFromLines() > 0 && (
                <div style={{ 
                  marginTop: '15px', 
                  padding: '12px', 
                  background: '#2a4a2a',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  color: '#4caf50'
                }}>
                  Total calculé depuis les lignes: {calculateTotalFromLines()} {currentItem.unit}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Quantité totale {calculateTotalFromLines() === 0 && <span style={{ color: 'red' }}>*</span>}
              </label>
              <input
                type="number"
                value={currentItem.totalQuantity}
                onChange={(e) => setCurrentItem({ ...currentItem, totalQuantity: e.target.value })}
                placeholder={calculateTotalFromLines() > 0 ? `Auto: ${calculateTotalFromLines()}` : "0"}
                step="0.01"
                min="0"
                disabled={calculateTotalFromLines() > 0}
                style={{ 
                  background: calculateTotalFromLines() > 0 ? '#2a2a2a' : '#1a1a1a',
                  cursor: calculateTotalFromLines() > 0 ? 'not-allowed' : 'text'
                }}
              />
              <small style={{ color: '#999', fontSize: '0.85em' }}>
                {calculateTotalFromLines() > 0 
                  ? 'Calculé automatiquement depuis les lignes' 
                  : 'Ou remplir les lignes de détails ci-dessus'
                }
              </small>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Unité</label>
              <select
                value={currentItem.unit}
                onChange={(e) => setCurrentItem({ ...currentItem, unit: e.target.value })}
              >
                <option value="m">m</option>
                <option value="pièce">pièce</option>
                <option value="kg">kg</option>
                <option value="m²">m²</option>
                <option value="m³">m³</option>
                <option value="litre">litre</option>
                <option value="sac">sac</option>
                <option value="paquet">paquet</option>
                <option value="sachet">sachet</option>
                <option value="forfait">forfait</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                Prix unitaire (Ar) <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="number"
                value={currentItem.unitPrice}
                onChange={(e) => setCurrentItem({ ...currentItem, unitPrice: e.target.value })}
                placeholder="0"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          {marginInfo && (
            <div style={{ 
              background: marginInfo.marginPercent >= 20 ? '#d4edda' : marginInfo.marginPercent >= 10 ? '#fff3cd' : '#f8d7da',
              border: `1px solid ${marginInfo.marginPercent >= 20 ? '#28a745' : marginInfo.marginPercent >= 10 ? '#ffc107' : '#dc3545'}`,
              color: marginInfo.marginPercent >= 20 ? '#155724' : marginInfo.marginPercent >= 10 ? '#856404' : '#721c24',
              padding: '12px 15px',
              borderRadius: '5px',
              marginBottom: '15px',
              fontSize: '0.95em'
            }}>
              <strong>📊 Calcul de marge :</strong>
              <div style={{ marginTop: '5px' }}>
                Coût d'achat: {formatNumber(marginInfo.purchaseCost)} Ar | 
                Prix de vente: {formatNumber(marginInfo.saleTotal)} Ar | 
                Marge: {formatNumber(marginInfo.margin)} Ar ({marginInfo.marginPercent.toFixed(1)}%)
                {marginInfo.marginPercent < 10 && ' ⚠️ Marge faible'}
                {marginInfo.marginPercent >= 20 && ' ✅ Bonne marge'}
              </div>
            </div>
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={addItem}
            style={{ width: '100%', padding: '12px' }}
          >
            ✅ Ajouter à la facture
          </button>
        </div>

        {formData.items.length > 0 && (
          <div className="card">
            <h2>📋 Articles ajoutés ({formData.items.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Désignation</th>
                  <th style={{ width: '100px' }}>Quantité</th>
                  <th style={{ width: '120px' }}>P.U</th>
                  <th style={{ width: '140px' }}>Total</th>
                  <th style={{ width: '80px' }}></th>
                </tr>
              </thead>
              <tbody>
                {formData.items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ fontWeight: 'bold' }}>{item.description}</div>
                      {item.detailLines && item.detailLines.length > 0 && (
                        <div style={{ fontSize: '0.9em', color: '#999', marginTop: '5px' }}>
                          {item.detailLines.map((line, idx) => (
                            <div key={idx}>• {line.display}</div>
                          ))}
                        </div>
                      )}
                      {item.marginPercent !== undefined && (
                        <div style={{ 
                          fontSize: '0.85em', 
                          marginTop: '5px',
                          color: item.marginPercent >= 20 ? '#4caf50' : item.marginPercent >= 10 ? '#ff9800' : '#f44336'
                        }}>
                          Marge: {item.marginPercent.toFixed(1)}%
                        </div>
                      )}
                    </td>
                    <td>{item.quantity} {item.unit}</td>
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
                  <td colSpan="3" style={{ textAlign: 'right' }}>TOTAL</td>
                  <td colSpan="2" style={{ color: 'var(--accent)', fontSize: '1.2em' }}>
                    {formatNumber(total)} Ar
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

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
