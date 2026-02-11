'use client'

/**
 * COMPOSANT FORMULAIRE PRODUIT
 */

import { useState } from 'react'
import { createProduct, updateProduct } from '@/lib/actions/products'
import type { Product, ProductCategory } from '@/lib/types/product'

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
        setError('Le nom du produit est requis')
        setLoading(false)
        return
      }

      if (!formData.unit.trim()) {
        setError('L\'unité de mesure est requise')
        setLoading(false)
        return
      }

      if (!formData.price || parseFloat(formData.price) <= 0) {
        setError('Le prix doit être supérieur à 0')
        setLoading(false)
        return
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
        ? await updateProduct({ id: product.id, ...productData })
        : await createProduct(productData)

      if (result.error) {
        setError(result.error)
      } else {
        onSuccess()
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Référence (optionnel) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Référence (optionnel)
        </label>
        <input
          type="text"
          name="reference"
          value={formData.reference}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="TOL-001"
        />
      </div>

      {/* Nom */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom du produit *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Tôle ondulée 2m"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Description du produit..."
        />
      </div>

      {/* Couleur (optionnel) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Couleur (optionnel)
        </label>
        <input
          type="text"
          name="couleur"
          value={formData.couleur}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Gris, Noir, Rouge..."
        />
      </div>

      {/* Catégorie */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Catégorie *
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="tôles">Tôles</option>
          <option value="accessoires">Accessoires</option>
          <option value="panne C">Panne C</option>
          <option value="autres">Autres</option>
        </select>
      </div>

      {/* Unité de mesure */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Unité de mesure *
        </label>
        <input
          type="text"
          name="unit"
          value={formData.unit}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="m², kg, pièce, sac, boîte..."
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
      </div>

      {/* Prix et Quantité */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prix (Ar) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="15000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantité *
          </label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="50"
          />
        </div>
      </div>

      {/* Date d'achat */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date d'achat
        </label>
        <input
          type="date"
          name="purchase_date"
          value={formData.purchase_date}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Enregistrement...' : isEdit ? 'Modifier' : 'Créer'}
        </button>
      </div>
    </form>
  )
}
