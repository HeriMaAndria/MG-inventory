'use client'

/**
 * PAGE CATALOGUE PRODUITS (REVENDEUR)
 * Vue lecture seule du stock disponible
 */

import { useState, useEffect } from 'react'
import { productService } from '@/lib/services'
import type { Product, ProductCategory } from '@/lib/types/models'
import Card from '@/components/ui/Card'
import ProtectedPage from '@/components/ProtectedPage'

export default function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | ''>('')

  const loadProducts = async () => {
    setLoading(true)
    const { data } = await productService.getAll({
      search: searchTerm || undefined,
      category: categoryFilter || undefined,
    })
    setProducts(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [searchTerm, categoryFilter])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  const CategoryBadge = ({ category }: { category: string }) => {
    const colors: Record<string, string> = {
      'tôles': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'accessoires': 'bg-green-500/20 text-green-400 border-green-500/30',
      'panne C': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'autres': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    }
    return <span className={`badge ${colors[category] || colors.autres}`}>{category}</span>
  }

  return (
    <ProtectedPage allowedRoles={['revendeur']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-text-primary">📦 Catalogue Produits</h1>
            <p className="text-sm text-text-secondary mt-1">Consultez les produits disponibles</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          {/* Filtres */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-dark flex-1"
              />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as ProductCategory | '')}
                className="input-dark"
              >
                <option value="">Toutes catégories</option>
                <option value="tôles">Tôles</option>
                <option value="accessoires">Accessoires</option>
                <option value="panne C">Panne C</option>
                <option value="autres">Autres</option>
              </select>
            </div>
          </Card>

          {/* Grille produits */}
          {loading ? (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Chargement...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id} hover className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-text-primary">{product.name}</h3>
                        {product.reference && (
                          <p className="text-xs text-text-muted">{product.reference}</p>
                        )}
                      </div>
                      <CategoryBadge category={product.category} />
                    </div>

                    {product.description && (
                      <p className="text-sm text-text-secondary line-clamp-2">{product.description}</p>
                    )}

                    <div className="space-y-2">
                      {product.couleur && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-text-muted">Couleur:</span>
                          <span className="text-text-primary">{product.couleur}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-text-muted">Unité:</span>
                        <span className="text-text-primary">{product.unit}</span>
                      </div>
                    </div>

                    <div className="divider-dark"></div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-text-muted">Prix unitaire</p>
                        <p className="text-2xl font-bold text-accent-yellow">{formatPrice(product.price)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-text-muted">En stock</p>
                        <p className={`text-xl font-bold ${
                          product.quantity === 0 ? 'text-red-400' :
                          product.quantity < 10 ? 'text-orange-400' :
                          'text-green-400'
                        }`}>
                          {product.quantity} {product.unit}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Aucun produit trouvé</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedPage>
  )
}
