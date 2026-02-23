'use client'

/**
 * PAGE GESTION REVENDEURS (GÉRANT)
 * Liste, stats, activer/désactiver
 */

import { useState, useEffect } from 'react'
import { mockRevendeurService, type Revendeur, type RevendeurStats } from '@/lib/services/implementations/mockRevendeurService'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProtectedPage from '@/components/ProtectedPage'

export default function RevendeursPage() {
  const [revendeurs, setRevendeurs] = useState<Revendeur[]>([])
  const [stats, setStats] = useState<Record<string, RevendeurStats>>({})
  const [loading, setLoading] = useState(true)
  const [loadingStats, setLoadingStats] = useState<Record<string, boolean>>({})

  const loadRevendeurs = async () => {
    setLoading(true)
    const { data } = await mockRevendeurService.getAll()
    setRevendeurs(data || [])
    setLoading(false)

    // Charger les stats pour chaque revendeur
    if (data) {
      data.forEach(async (revendeur) => {
        setLoadingStats(prev => ({ ...prev, [revendeur.id]: true }))
        const { data: revendeurStats } = await mockRevendeurService.getStats(revendeur.id)
        if (revendeurStats) {
          setStats(prev => ({ ...prev, [revendeur.id]: revendeurStats }))
        }
        setLoadingStats(prev => ({ ...prev, [revendeur.id]: false }))
      })
    }
  }

  useEffect(() => {
    loadRevendeurs()
  }, [])

  const handleToggleActive = async (id: string) => {
    await mockRevendeurService.toggleActive(id)
    loadRevendeurs()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const globalStats = {
    total: revendeurs.length,
    active: revendeurs.filter(r => r.active).length,
    inactive: revendeurs.filter(r => !r.active).length,
    totalRevenue: Object.values(stats).reduce((sum, s) => sum + s.total_revenue, 0),
  }

  return (
    <ProtectedPage allowedRoles={['gerant', 'admin']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-text-primary">👥 Gestion des Revendeurs</h1>
            <p className="text-sm text-text-secondary mt-1">Partenaires commerciaux</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          {/* Stats globales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Total</p>
                  <p className="text-3xl font-bold text-text-primary">{globalStats.total}</p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Actifs</p>
                  <p className="text-3xl font-bold text-green-400">{globalStats.active}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Inactifs</p>
                  <p className="text-3xl font-bold text-red-400">{globalStats.inactive}</p>
                </div>
                <div className="text-4xl">🔒</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">CA Total</p>
                  <p className="text-xl font-bold text-accent-yellow">
                    {formatPrice(globalStats.totalRevenue)}
                  </p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </Card>
          </div>

          {/* Liste revendeurs */}
          {loading ? (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Chargement...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {revendeurs.map((revendeur) => {
                const revendeurStats = stats[revendeur.id]
                const isLoadingStats = loadingStats[revendeur.id]

                return (
                  <Card key={revendeur.id} className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Infos revendeur */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-accent-yellow flex items-center justify-center text-dark-bg font-bold text-xl">
                            {revendeur.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-text-primary">{revendeur.name}</h3>
                            <p className="text-text-secondary text-sm">{revendeur.email}</p>
                          </div>
                          <span className={`badge ml-auto ${revendeur.active ? 'badge-green' : 'badge-red'}`}>
                            {revendeur.active ? 'Actif' : 'Inactif'}
                          </span>
                        </div>

                        <div className="space-y-1 text-sm">
                          <p className="text-text-muted">📞 {revendeur.phone}</p>
                          <p className="text-text-muted">📍 {revendeur.address}</p>
                          <p className="text-text-muted">📅 Inscrit le {formatDate(revendeur.created_at)}</p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex-1">
                        {isLoadingStats ? (
                          <div className="text-center py-4">
                            <p className="text-text-muted text-sm">Chargement stats...</p>
                          </div>
                        ) : revendeurStats ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-dark-elevated p-3 rounded-lg">
                              <p className="text-xs text-text-muted">Clients</p>
                              <p className="text-2xl font-bold text-text-primary">{revendeurStats.total_clients}</p>
                            </div>
                            <div className="bg-dark-elevated p-3 rounded-lg">
                              <p className="text-xs text-text-muted">Commandes</p>
                              <p className="text-2xl font-bold text-text-primary">{revendeurStats.total_orders}</p>
                            </div>
                            <div className="bg-dark-elevated p-3 rounded-lg">
                              <p className="text-xs text-text-muted">CA Total</p>
                              <p className="text-lg font-bold text-accent-yellow">
                                {formatPrice(revendeurStats.total_revenue)}
                              </p>
                            </div>
                            <div className="bg-dark-elevated p-3 rounded-lg">
                              <p className="text-xs text-text-muted">En attente</p>
                              <p className="text-2xl font-bold text-yellow-400">{revendeurStats.pending_orders}</p>
                            </div>
                          </div>
                        ) : null}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 justify-center">
                        <Button
                          onClick={() => handleToggleActive(revendeur.id)}
                          variant={revendeur.active ? 'danger' : 'primary'}
                          size="sm"
                        >
                          {revendeur.active ? '🔒 Désactiver' : '✅ Activer'}
                        </Button>
                        <Button
                          onClick={() => alert('Voir historique (à implémenter)')}
                          variant="secondary"
                          size="sm"
                        >
                          📊 Historique
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {!loading && revendeurs.length === 0 && (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Aucun revendeur</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedPage>
  )
}
