'use client'

/**
 * PAGE CONVERSION DEVIS → FACTURE
 * Gérant uniquement
 */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { invoiceService } from '@/lib/services/implementations/invoiceServiceV2'
import type { Invoice } from '@/lib/types/invoice'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProtectedPage from '@/components/ProtectedPage'

export default function ConversionPage() {
  const router = useRouter()
  const [devis, setDevis] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [converting, setConverting] = useState<string | null>(null)

  useEffect(() => {
    loadDevis()
  }, [])

  const loadDevis = async () => {
    setLoading(true)
    const { data } = await invoiceService.getAll()
    // Filtrer seulement les devis non encore convertis
    const devisOnly = (data || []).filter(i => 
      i.type === 'devis' && i.status === 'en_attente'
    )
    setDevis(devisOnly)
    setLoading(false)
  }

  const handleConvert = async (devisId: string, type: 'facture' | 'proforma' | 'bon_commande') => {
    if (!confirm(`Confirmer la conversion en ${type} ?`)) return

    setConverting(devisId)
    const { data, error } = await invoiceService.convertDevisToFacture(devisId, type)
    setConverting(null)

    if (error) {
      alert('Erreur: ' + error)
      return
    }

    alert(`${type} créée avec succès !`)
    loadDevis() // Recharger
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  return (
    <ProtectedPage allowedRoles={['gerant', 'admin']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-text-primary">🔄 Conversion Devis → Facture</h1>
            <p className="text-sm text-text-secondary mt-1">
              Transformer les devis des revendeurs en factures officielles
            </p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">Chargement...</p>
            </div>
          ) : devis.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-text-secondary">Aucun devis en attente de conversion</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {devis.map((item) => (
                <Card key={item.id} className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Infos devis */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-text-primary">{item.reference}</h3>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full text-xs font-medium">
                          Devis en attente
                        </span>
                      </div>

                      <div className="space-y-1 text-sm mb-4">
                        <p className="text-text-secondary">
                          🏢 Revendeur: <span className="text-text-primary font-medium">{item.revendeur_name}</span>
                        </p>
                        <p className="text-text-secondary">
                          👤 Client: <span className="text-text-primary font-medium">{item.client_name}</span>
                        </p>
                        <p className="text-text-secondary">
                          📅 Créé le: <span className="text-text-primary">{formatDate(item.created_at)}</span>
                        </p>
                        {item.revendeur_info && (
                          <>
                            <p className="text-text-muted text-xs mt-2">Contact revendeur:</p>
                            <p className="text-text-muted text-xs">📧 {item.revendeur_info.email}</p>
                            <p className="text-text-muted text-xs">📞 {item.revendeur_info.phone}</p>
                          </>
                        )}
                      </div>

                      {/* Articles */}
                      <div className="bg-dark-elevated p-4 rounded-lg">
                        <h4 className="text-sm font-bold text-text-primary mb-2">Articles ({item.items.length}):</h4>
                        <div className="space-y-1">
                          {item.items.slice(0, 3).map((article, idx) => (
                            <div key={idx} className="text-xs text-text-secondary flex justify-between">
                              <span>• {article.product_name} x{article.quantity}</span>
                              <span className="text-text-primary">{formatPrice(article.total_vente)}</span>
                            </div>
                          ))}
                          {item.items.length > 3 && (
                            <p className="text-xs text-text-muted">+ {item.items.length - 3} autres...</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Montants */}
                    <div className="lg:w-80">
                      <div className="bg-dark-elevated p-4 rounded-lg space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Prix catalogue:</span>
                          <span className="text-text-primary">{formatPrice(item.subtotal_catalogue)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-400">Marge ({item.marge_percentage.toFixed(1)}%):</span>
                          <span className="text-green-400 font-bold">+{formatPrice(item.marge_total)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-dark-border">
                          <span className="text-text-primary font-bold">Total vente:</span>
                          <span className="text-accent-yellow font-bold text-lg">{formatPrice(item.total)}</span>
                        </div>
                      </div>

                      {/* Actions conversion */}
                      <div className="mt-4 space-y-2">
                        <p className="text-xs text-text-muted mb-2">Convertir en:</p>
                        
                        <Button
                          onClick={() => handleConvert(item.id, 'facture')}
                          isLoading={converting === item.id}
                          variant="primary"
                          size="sm"
                          className="w-full"
                        >
                          📄 Facture
                        </Button>

                        <Button
                          onClick={() => handleConvert(item.id, 'proforma')}
                          isLoading={converting === item.id}
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          📋 Proforma
                        </Button>

                        <Button
                          onClick={() => handleConvert(item.id, 'bon_commande')}
                          isLoading={converting === item.id}
                          variant="secondary"
                          size="sm"
                          className="w-full"
                        >
                          📦 Bon de commande
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Note si présente */}
                  {item.notes && (
                    <div className="mt-4 pt-4 border-t border-dark-border">
                      <p className="text-xs text-text-muted">Note:</p>
                      <p className="text-sm text-text-secondary mt-1">{item.notes}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedPage>
  )
}
