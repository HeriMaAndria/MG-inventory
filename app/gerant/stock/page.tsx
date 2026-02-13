'use client'

/**
 * PAGE GESTION DU STOCK
 * 
 * Cette page utilise UNIQUEMENT les services
 * Elle ne sait PAS si c'est mock ou Supabase
 */

import { useState, useEffect } from 'react'
import { productService } from '@/lib/services'
import type { Product, ProductCategory } from '@/lib/types/models'
import ProductTable from '@/components/tables/ProductTable'
import ProductForm from '@/components/forms/ProductForm'
import Modal from '@/components/ui/Modal'
import Card from '@/components/ui/Card'
import ProtectedPage from '@/components/ProtectedPage'

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | ''>('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  const loadProducts = async () => {
    setLoading(true)
    setError('')

    const { data, error: err } = await productService.getAll({
      search: searchTerm || undefined,
      category: categoryFilter || undefined,
    })

    if (err) {
      setError(err)
    } else {
      setProducts(data || [])
    }

    setLoading(false)
  }

  useEffect(() => {
    loadProducts()
  }, [searchTerm, categoryFilter])

  const handleAdd = () => {
    setEditingProduct(null)
    setModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    const { error: err } = await productService.delete(id)
    if (err) {
      alert(`Erreur: ${err}`)
    } else {
      loadProducts()
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingProduct(null)
  }

  const handleSuccess = () => {
    handleCloseModal()
    loadProducts()
  }

  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
  const lowStock = products.filter(p => p.quantity < 10).length

  return (
    <ProtectedPage allowedRoles={['gerant', 'admin']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-text-primary">📦 Gestion du Stock</h1>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Total produits</p>
                  <p className="text-3xl font-bold text-text-primary">{totalProducts}</p>
                </div>
                <div className="text-4xl">📦</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Valeur totale</p>
                  <p className="text-2xl font-bold text-text-primary">
                    {new Intl.NumberFormat('fr-FR').format(totalValue)} Ar
                  </p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Stock faible (&lt;10)</p>
                  <p className="text-3xl font-bold text-red-600">{lowStock}</p>
                </div>
                <div className="text-4xl">⚠️</div>
              </div>
            </Card>
          </div>

          {/* Barre d'actions */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Rechercher par nom ou référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-dark w-full"
                />
              </div>

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

              <button
                onClick={handleAdd}
                className="btn-primary whitespace-nowrap"
              >
                ➕ Ajouter un produit
              </button>
            </div>
          </Card>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Chargement...</p>
            </div>
          ) : (
            <ProductTable
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </main>

        <Modal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          title={editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
        >
          <ProductForm
            product={editingProduct || undefined}
            onSuccess={handleSuccess}
            onCancel={handleCloseModal}
          />
        </Modal>
      </div>
    </ProtectedPage>
  )
}
