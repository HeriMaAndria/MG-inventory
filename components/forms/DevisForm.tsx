'use client'

/**
 * FORMULAIRE DEVIS
 * Avec prix catalogue ET prix vente (marge calculée auto)
 */

import { useState, useEffect } from 'react'
import { productService, clientService } from '@/lib/services'
import { invoiceService } from '@/lib/services' // ✅ Fix: invoiceServiceV2 n'existe pas → import depuis l'index
import { getCurrentUser } from '@/lib/auth/mockAuth'
import type { Product, Client } from '@/lib/types/models'
import type { InvoiceItem } from '@/lib/types/invoice'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Card from '@/components/ui/Card'

interface DevisFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function DevisForm({ onSuccess, onCancel }: DevisFormProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [user] = useState(getCurrentUser())

  const [formData, setFormData] = useState({
    client_id: '',
    notes: '',
  })

  const [items, setItems] = useState<Omit<InvoiceItem, 'total_catalogue' | 'total_vente' | 'marge_unitaire' | 'marge_total'>[]>([
    {
      product_id: '',
      product_name: '',
      prix_catalogue: 0,
      prix_vente: 0,
      quantity: 1,
      unit: 'unité',
    },
  ])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    // ✅ Fix: getAll() requiert un revendeurId → on le récupère du user courant
    const revendeurId = user?.id || 'revendeur-1'
    const [productsRes, clientsRes] = await Promise.all([
      productService.getAll(),
      clientService.getAll(revendeurId),
    ])
    setProducts(productsRes.data || [])
    setClients(clientsRes.data || [])
  }

  const handleProductChange = (index: number, productId: string) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      product_id: product.id,
      product_name: product.name,
      prix_catalogue: product.price,
      prix_vente: product.price,
      unit: product.unit,
    }
    setItems(newItems)
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    }
    setItems(newItems)
  }

  const addItem = () => {
    setItems([
      ...items,
      {
        product_id: '',
        product_name: '',
        prix_catalogue: 0,
        prix_vente: 0,
        quantity: 1,
        unit: 'unité',
      },
    ])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const calculatePreview = () => {
    let totalCatalogue = 0
    let totalVente = 0

    items.forEach(item => {
      if (item.product_id) {
        totalCatalogue += item.prix_catalogue * item.quantity
        totalVente += item.prix_vente * item.quantity
      }
    })

    const marge = totalVente - totalCatalogue
    const margePercentage = totalCatalogue > 0 ? (marge / totalCatalogue) * 100 : 0

    return { totalCatalogue, totalVente, marge, margePercentage }
  }

  const preview = calculatePreview()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.client_id) {
      alert('Veuillez sélectionner un client')
      return
    }

    const validItems = items.filter(item => item.product_id && item.quantity > 0)
    if (validItems.length === 0) {
      alert('Veuillez ajouter au moins un article')
      return
    }

    if (!user) {
      alert('Utilisateur non connecté')
      return
    }

    setLoading(true)

    const client = clients.find(c => c.id === formData.client_id)

    const { data, error } = await invoiceService.createDevis({
      client_id: formData.client_id,
      client_name: client?.name || 'Client',
      items: validItems,
      notes: formData.notes,
      revendeur_info: {
        name: user.name,
        email: user.email,
        phone: '+261 34 00 000 00',
        address: 'Antananarivo, Madagascar',
      },
    })

    setLoading(false)

    if (error) {
      alert('Erreur: ' + error)
      return
    }

    alert('Devis créé avec succès !')
    onSuccess?.()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Client</h3>
        <select
          value={formData.client_id}
          onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
          className="w-full px-4 py-2 bg-dark-elevated border border-dark-border rounded-lg text-text-primary"
          required
        >
          <option value="">Sélectionner un client</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.name} - {client.email}
            </option>
          ))}
        </select>
      </Card>

      {/* Articles */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-text-primary">Articles</h3>
          <Button type="button" onClick={addItem} size="sm">
            + Ajouter
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="p-4 bg-dark-elevated rounded-lg space-y-3">
              {/* Produit */}
              <select
                value={item.product_id}
                onChange={(e) => handleProductChange(index, e.target.value)}
                className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary"
                required
              >
                <option value="">Sélectionner un produit</option>
                {products.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatPrice(product.price)} / {product.unit}
                  </option>
                ))}
              </select>

              {item.product_id && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {/* Prix catalogue (lecture seule) */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Prix catalogue</label>
                    <input
                      type="number"
                      value={item.prix_catalogue}
                      disabled
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-muted cursor-not-allowed"
                    />
                  </div>

                  {/* Prix vente (modifiable) */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">
                      Prix vente <span className="text-accent-yellow">*</span>
                    </label>
                    <input
                      type="number"
                      value={item.prix_vente}
                      onChange={(e) => handleItemChange(index, 'prix_vente', Number(e.target.value))}
                      className="w-full px-4 py-2 bg-dark-bg border border-accent-yellow rounded-lg text-text-primary"
                      required
                      min={item.prix_catalogue}
                    />
                  </div>

                  {/* Quantité */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Quantité</label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                      className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-text-primary"
                      required
                      min={1}
                    />
                  </div>

                  {/* Total */}
                  <div>
                    <label className="block text-sm text-text-secondary mb-1">Total</label>
                    <div className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-accent-yellow font-bold">
                      {formatPrice(item.prix_vente * item.quantity)}
                    </div>
                  </div>
                </div>
              )}

              {/* Marge preview */}
              {item.product_id && item.prix_vente > item.prix_catalogue && (
                <div className="text-sm text-green-400">
                  ✅ Marge unitaire: +{formatPrice(item.prix_vente - item.prix_catalogue)}&nbsp;
                  ({((item.prix_vente - item.prix_catalogue) / item.prix_catalogue * 100).toFixed(1)}%)
                </div>
              )}

              {/* Supprimer */}
              {items.length > 1 && (
                <Button type="button" onClick={() => removeItem(index)} variant="danger" size="sm">
                  🗑️ Supprimer
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Totaux preview */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Récapitulatif</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-text-secondary">
            <span>Total catalogue (base):</span>
            <span>{formatPrice(preview.totalCatalogue)}</span>
          </div>
          <div className="flex justify-between text-green-400">
            <span>Marge totale:</span>
            <span>+{formatPrice(preview.marge)} ({preview.margePercentage.toFixed(1)}%)</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-accent-yellow border-t border-dark-border pt-2">
            <span>Total vente:</span>
            <span>{formatPrice(preview.totalVente)}</span>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Notes (optionnel)</h3>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full px-4 py-2 bg-dark-elevated border border-dark-border rounded-lg text-text-primary"
          rows={3}
          placeholder="Conditions particulières, remarques..."
        />
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button type="submit" isLoading={loading} className="flex-1">
          ✅ Créer le devis
        </Button>
        {onCancel && (
          <Button type="button" onClick={onCancel} variant="secondary">
            Annuler
          </Button>
        )}
      </div>
    </form>
  )
}
