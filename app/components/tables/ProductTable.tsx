'use client'

/**
 * TABLEAU PRODUITS
 */

import type { Product } from '@/lib/types/models'

interface ProductTableProps {
  products: Product[]
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const CategoryBadge = ({ category }: { category: string }) => {
    const colors: Record<string, string> = {
      'tôles': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'accessoires': 'bg-green-500/20 text-green-400 border-green-500/30',
      'panne C': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'autres': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    }
    return (
      <span className={`badge ${colors[category] || colors.autres}`}>
        {category}
      </span>
    )
  }

  const handleDelete = (product: Product) => {
    if (confirm(`Voulez-vous vraiment supprimer "${product.name}" ?`)) {
      onDelete(product.id)
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 glass-container">
        <p className="text-text-secondary">Aucun produit trouvé</p>
        <p className="text-sm text-text-muted mt-1">Ajoutez votre premier produit pour commencer</p>
      </div>
    )
  }

  return (
    <div className="glass-container overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-dark-elevated border-b border-dark-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Référence</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Couleur</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Catégorie</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Unité</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Prix</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Quantité</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Date achat</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-border">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-dark-elevated/50 transition-colors">
                <td className="px-4 py-3 text-sm text-text-primary font-medium">
                  {product.reference || '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-text-primary">{product.name}</div>
                  {product.description && (
                    <div className="text-xs text-text-muted mt-1 truncate max-w-xs">
                      {product.description}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {product.couleur || '-'}
                </td>
                <td className="px-4 py-3 text-sm">
                  <CategoryBadge category={product.category} />
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">
                  {product.unit}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-text-primary">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={
                    product.quantity === 0 ? 'text-red-400 font-medium' :
                    product.quantity < 10 ? 'text-orange-400 font-medium' :
                    'text-text-primary'
                  }>
                    {product.quantity}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-muted">
                  {formatDate(product.purchase_date)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(product)}
                      className="text-accent-yellow hover:text-accent-yellow-light font-medium transition-colors"
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(product)}
                      className="text-red-400 hover:text-red-300 font-medium transition-colors"
                      title="Supprimer"
                    >
                      🗑️
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
