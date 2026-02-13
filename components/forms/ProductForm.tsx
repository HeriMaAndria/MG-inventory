'use client'

/**
 * FORMULAIRE PRODUIT
 * 
 * Utilise productService pour créer/modifier
 * Ne sait PAS d'où viennent les données
 */

import { useState } from 'react'
import { productService } from '@/lib/services'
import type { Product, ProductCategory } from '@/lib/types/models'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface ProductFormProps {
  product?: Product
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const isEdit = !!product

  const [formData, setFormData] = useState({
    reference: product?.reference || '',
    name: product?.name || '',
    description: product?.description || '',
    couleur: product?.couleur || '',
    category: (product?.category || 'autres') as ProductCategory,
    unit: product?.unit || '',
    price: product?.price?.toString() || '',
    quantity: product?.quantity?.toString() || '0',
    purchase_date: product?.purchase_date || '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.name.trim()) {
        throw new Error('Le nom du produit est requis')
      }

      if (!formData.unit.trim()) {
        throw new Error('L\'unité de mesure est requise')
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        throw new Error('Le prix doit être supérieur à 0')
      }

      const productData = {
        reference: formData.reference.trim() || undefined,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        couleur: formData.couleur.trim() || undefined,
        category: formData.category,
        unit: formData.unit.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity) || 0,
        purchase_date: formData.purchase_date || undefined,
      }

      const result = isEdit
        ? await productService.update({ id: product.id, ...productData })
        : await productService.create(productData)

      if (result.error) {
        throw new Error(result.error)
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="reference"
        label="Référence (optionnel)"
        placeholder="TOL-001"
        value={formData.reference}
        onChange={handleChange}
      />

      <Input
        type="text"
        name="name"
        label="Nom du produit"
        placeholder="Tôle ondulée 2m"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <div>
        <label className="label-dark">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="input-dark"
          placeholder="Description du produit..."
        />
      </div>

      <Input
        type="text"
        name="couleur"
        label="Couleur (optionnel)"
        placeholder="Gris, Noir, Rouge..."
        value={formData.couleur}
        onChange={handleChange}
      />

      <div>
        <label className="label-dark">Catégorie *</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="input-dark"
        >
          <option value="tôles">Tôles</option>
          <option value="accessoires">Accessoires</option>
          <option value="panne C">Panne C</option>
          <option value="autres">Autres</option>
        </select>
      </div>

      <Input
        type="text"
        name="unit"
        label="Unité de mesure"
        placeholder="m², kg, pièce, sac, boîte..."
        value={formData.unit}
        onChange={handleChange}
        required
        list="unit-suggestions"
      />
      <datalist id="unit-suggestions">
        <option value="m²" />
        <option value="kg" />
        <option value="pièce" />
        <option value="sac" />
        <option value="boîte" />
        <option value="lot" />
        <option value="m" />
        <option value="litre" />
      </datalist>

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          name="price"
          label="Prix (Ar)"
          placeholder="15000"
          value={formData.price}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
        />

        <Input
          type="number"
          name="quantity"
          label="Quantité"
          placeholder="50"
          value={formData.quantity}
          onChange={handleChange}
          required
          min="0"
        />
      </div>

      <Input
        type="date"
        name="purchase_date"
        label="Date d'achat"
        value={formData.purchase_date}
        onChange={handleChange}
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          disabled={loading}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className="flex-1"
        >
          {isEdit ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}
