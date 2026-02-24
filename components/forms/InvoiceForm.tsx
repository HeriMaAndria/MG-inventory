'use client'

/**
 * FORMULAIRE DEVIS/FACTURE
 */

import { useState, useEffect } from 'react'
import { invoiceService, clientService, productService } from '@/lib/services'
import { getCurrentUser } from '@/lib/auth/mockAuth'
import type { Client, Product } from '@/lib/types/models'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface InvoiceFormProps {
  revendeurId: string
  onSuccess: () => void
  onCancel: () => void
}

// ✅ Fix: champs alignés avec InvoiceItem de invoice.ts (prix_catalogue + prix_vente)
interface LocalItem {
  product_id: string
  product_name: string
  quantity: number
  prix_catalogue: number
  prix_vente: number
  unit: string
}

export default function InvoiceForm({ revendeurId, onSuccess, onCancel }: InvoiceFormProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedClient, setSelectedClient] = useState('')
  const [items, setItems] = useState<LocalItem[]>([])
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
    setItems([...items, {
      product_id: '',
      product_name: '',
      quantity: 1,
      prix_catalogue: 0,
      prix_vente: 0,
      unit: 'unité',
    }])
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
          // ✅ Fix: initialiser les deux prix au prix catalogue du produit
          prix_catalogue: product.price,
          prix_vente: product.price,
          unit: product.unit,
        }
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value }
    }
    setItems(newItems)
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.prix_vente), 0)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!selectedClient) throw new Error('Sélectionnez un client')
      if (items.length === 0) throw new Error('Ajoutez au moins un produit')
      if (items.some(item => !item.product_id || item.quantity <= 0)) {
        throw new Error('Vérifiez tous les produits')
      }

      const user = getCurrentUser()
      const client = clients.find(c => c.id === selectedClient)

      // ✅ Fix: utiliser createDevis() à la place de create() qui n'existe pas
      const result = await invoiceService.createDevis({
        client_id: selectedClient,
        client_name: client?.name || 'Client',
        items: items.map(item => ({
          product_id: item.product_id,
          product_name: item.product_name,
          prix_catalogue: item.prix_catalogue,
          prix_vente: item.prix_vente,
          quantity: item.quantity,
          unit: item.unit,
        })),
        notes: notes || undefined,
        revendeur_info: {
          name: user?.name || 'Revendeur',
          email: user?.email || '',
          phone: '+261 34 00 000 00',
          address: 'Antananarivo, Madagascar',
        },
      })

      if (result.error) throw new Error(result.error)

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
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

              {item.product_id && (
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    type="number"
                    label="Prix vente"
                    value={item.prix_vente}
                    onChange={(e) => updateItem(index, 'prix_vente', parseFloat(e.target.value))}
                    min={item.prix_catalogue}
                    step="0.01"
                    required
                  />
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
                      {formatPrice(item.quantity * item.prix_vente)}
                    </div>
                  </div>
                  {item.prix_vente > item.prix_catalogue && (
                    <div>
                      <label className="label-dark">Marge</label>
                      <div className="input-dark bg-dark-elevated text-green-400">
                        +{formatPrice((item.prix_vente - item.prix_catalogue) * item.quantity)}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Récapitulatif */}
      {items.length > 0 && (
        <div className="elevated-container p-4 space-y-2">
          <div className="flex justify-between text-xl font-bold text-text-primary">
            <span>Total :</span>
            <span>{formatPrice(calculateSubtotal())}</span>
          </div>
        </div>
      )}

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
