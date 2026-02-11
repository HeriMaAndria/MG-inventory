'use client'

/**
 * COMPOSANT TABLEAU PRODUITS
 */

import { useState } from 'react'
import { deleteProduct } from '@/lib/actions/products'
import type { Product } from '@/lib/types/product'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onRefresh: () => void
}

export default function ProductTable({ products, onEdit, onRefresh }: ProductTableProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const CategoryBadge = ({ category }: { category: string }) => {
    const colors = {
      'tôles': 'bg-blue-100 text-blue-800',
      'accessoires': 'bg-green-100 text-green-800',
      'panne C': 'bg-purple-100 text-purple-800',
      'autres': 'bg-gray-100 text-gray-800',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[category as keyof typeof colors] || colors.autres}`}>
        {category}
      </span>
    )
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Voulez-vous vraiment supprimer "${name}" ?`)) {
      return
    }

    setDeletingId(id)
    const result = await deleteProduct(id)
    setDeletingId(null)

    if (result.error) {
      alert(`Erreur: ${result.error}`)
    } else {
      onRefresh()
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500">Aucun produit trouvé</p>
        <p className="text-sm text-gray-400 mt-1">Ajoutez votre premier produit pour commencer</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Couleur</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Catégorie</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unité</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantité</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date achat</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {product.reference || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  {product.description && (
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                      {product.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {product.couleur || '-'}
                </td>
                <td className="px-4 py-3 text-sm">
                  <CategoryBadge category={product.category} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {product.unit}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  <span className={product.quantity === 0 ? 'text-red-600 font-medium' : product.quantity < 10 ? 'text-orange-600 font-medium' : ''}>
                    {product.quantity}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {formatDate(product.purchase_date)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingId === product.id}
                      className="text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                      title="Supprimer"
                    >
                      {deletingId === product.id ? '⏳' : '🗑️'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
