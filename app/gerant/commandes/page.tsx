'use client'

/**
 * PAGE GESTION COMMANDES (GÉRANT)
 * Validation et suivi des commandes revendeurs
 */

import { useState, useEffect } from 'react'
import { orderService } from '@/lib/services'
import type { Order, OrderStatus } from '@/lib/types/models'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProtectedPage from '@/components/ProtectedPage'

export default function GerantCommandesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('')

  const loadOrders = async () => {
    setLoading(true)
    const { data } = await orderService.getAll({
      status: statusFilter || undefined,
    })
    setOrders(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadOrders()
  }, [statusFilter])

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    await orderService.updateStatus(id, status)
    loadOrders()
  }

  const stats = {
    total: orders.length,
    en_attente: orders.filter(o => o.status === 'en_attente').length,
    validee: orders.filter(o => o.status === 'validée').length,
    livree: orders.filter(o => o.status === 'livrée').length,
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const StatusBadge = ({ status }: { status: OrderStatus }) => {
    const colors: Record<string, string> = {
      'en_attente': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'validée': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'refusée': 'bg-red-500/20 text-red-400 border-red-500/30',
      'commandée': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'livrée': 'bg-green-500/20 text-green-400 border-green-500/30',
      'payée': 'bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30',
    }
    return <span className={`badge ${colors[status]}`}>{status}</span>
  }

  return (
    <ProtectedPage allowedRoles={['gerant', 'admin']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-text-primary">🛒 Gestion des Commandes</h1>
            <p className="text-sm text-text-secondary mt-1">Valider et suivre les commandes</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Total</p>
                  <p className="text-3xl font-bold text-text-primary">{stats.total}</p>
                </div>
                <div className="text-4xl">📦</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">En attente</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.en_attente}</p>
                </div>
                <div className="text-4xl">⏳</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Validées</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.validee}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Livrées</p>
                  <p className="text-3xl font-bold text-green-400">{stats.livree}</p>
                </div>
                <div className="text-4xl">🚚</div>
              </div>
            </Card>
          </div>

          {/* Filtres */}
          <Card className="p-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
              className="input-dark"
            >
              <option value="">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="validée">Validée</option>
              <option value="refusée">Refusée</option>
              <option value="livrée">Livrée</option>
              <option value="payée">Payée</option>
            </select>
          </Card>

          {/* Liste commandes */}
          {loading ? (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Chargement...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-text-primary">{order.reference}</h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-text-secondary text-sm">
                        Revendeur : <span className="text-text-primary">{order.revendeur_name}</span>
                      </p>
                      <p className="text-text-muted text-sm">
                        Date : {formatDate(order.created_at)}
                      </p>
                      <p className="text-text-muted text-sm">
                        Articles : {order.items.length}
                      </p>
                      <p className="text-2xl font-bold text-accent-yellow mt-2">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {order.status === 'en_attente' && (
                        <>
                          <Button
                            onClick={() => handleUpdateStatus(order.id, 'validée')}
                            size="sm"
                          >
                            ✅ Valider
                          </Button>
                          <Button
                            onClick={() => handleUpdateStatus(order.id, 'refusée')}
                            variant="danger"
                            size="sm"
                          >
                            ❌ Refuser
                          </Button>
                        </>
                      )}
                      {order.status === 'validée' && (
                        <Button
                          onClick={() => handleUpdateStatus(order.id, 'livrée')}
                          size="sm"
                        >
                          🚚 Marquer livrée
                        </Button>
                      )}
                      {order.status === 'livrée' && (
                        <Button
                          onClick={() => handleUpdateStatus(order.id, 'payée')}
                          size="sm"
                        >
                          💰 Marquer payée
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Détails items */}
                  <div className="mt-4 pt-4 border-t border-dark-border">
                    <p className="text-sm font-semibold text-text-secondary mb-2">Détails :</p>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="text-sm text-text-muted flex justify-between">
                          <span>{item.product_name} x{item.quantity}</span>
                          <span>{formatPrice(item.total)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Aucune commande</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedPage>
  )
}
