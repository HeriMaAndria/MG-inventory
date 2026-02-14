'use client'

/**
 * FORMULAIRE DEVIS/FACTURE
 */

import { useState, useEffect } from 'react'
import { invoiceService, clientService, productService } from '@/lib/services'
import type { Client, Product } from '@/lib/types/models'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface InvoiceFormProps {
  revendeurId: string
  onSuccess: () => void
  onCancel: () => void
}

interface InvoiceItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
}

export default function InvoiceForm({ revendeurId, onSuccess, onCancel }: InvoiceFormProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [items, setItems] = useState<InvoiceItem[]>([])
  const [margePercentage, setMargePercentage] = useState(15)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [clientsRes, productsRes] = await Promise.all([
      clientService.getAll(revendeurId),
      productService.getAll(),
    ])
    setClients(clientsRes.data || [])
    setProducts(productsRes.data || [])
  }

  const addItem = () => {
    setItems([...items, { product_id: '', product_name: '', quantity: 1, unit_price: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items]
    if (field === 'product_id') {
      const product = products.find(p => p.id === value)
      if (product) {
        newItems[index] = {
          ...newItems[index],
          product_id: value,
          product_name: product.name,
          unit_price: product.price,
        }
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value }
    }
    setItems(newItems)
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  }

  const calculateMarge = () => {
    return (calculateSubtotal() * margePercentage) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateMarge()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!selectedClient) {
        throw new Error('Sélectionnez un client')
      }
      if (items.length === 0) {
        throw new Error('Ajoutez au moins un produit')
      }
      if (items.some(item => !item.product_id || item.quantity <= 0)) {
        throw new Error('Vérifiez tous les produits')
      }

      const client = clients.find(c => c.id === selectedClient)
      const result = await invoiceService.create({
        revendeur_id: revendeurId,
        client_id: selectedClient,
        client_name: client?.name,
        items: items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        })),
        marge_percentage: margePercentage,
        notes: notes || undefined,
      })

      if (result.error) {
        throw new Error(result.error)
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client */}
      <div>
        <label className="label-dark">Client *</label>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          required
          className="input-dark"
        >
          <option value="">Sélectionner un client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>{client.name}</option>
          ))}
        </select>
      </div>

      {/* Produits */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label-dark">Produits *</label>
          <Button type="button" onClick={addItem} size="sm">+ Ajouter</Button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="elevated-container p-4 space-y-3">
              <div className="flex gap-2">
                <select
                  value={item.product_id}
                  onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                  className="input-dark flex-1"
                  required
                >
                  <option value="">Sélectionner produit</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {formatPrice(product.price)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-400 hover:text-red-300 px-3"
                >
                  🗑️
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  label="Quantité"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                  min="1"
                  required
                />
                <div>
                  <label className="label-dark">Total ligne</label>
                  <div className="input-dark bg-dark-elevated">
                    {formatPrice(item.quantity * item.unit_price)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marge */}
      <Input
        type="number"
        label="Marge (%)"
        value={margePercentage}
        onChange={(e) => setMargePercentage(parseFloat(e.target.value))}
        min="0"
        max="100"
        step="0.1"
        required
      />

      {/* Récapitulatif */}
      <div className="elevated-container p-4 space-y-2">
        <div className="flex justify-between text-text-secondary">
          <span>Sous-total :</span>
          <span>{formatPrice(calculateSubtotal())}</span>
        </div>
        <div className="flex justify-between text-accent-yellow">
          <span>Marge ({margePercentage}%) :</span>
          <span>{formatPrice(calculateMarge())}</span>
        </div>
        <div className="divider-dark"></div>
        <div className="flex justify-between text-xl font-bold text-text-primary">
          <span>Total :</span>
          <span>{formatPrice(calculateTotal())}</span>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="label-dark">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="input-dark"
          placeholder="Notes additionnelles..."
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" onClick={onCancel} variant="secondary" className="flex-1">
          Annuler
        </Button>
        <Button type="submit" isLoading={loading} className="flex-1">
          Créer le devis
        </Button>
      </div>
    </form>
  )
}
