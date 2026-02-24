'use client'

/**
 * PAGE FACTURES GÉRANT
 * Avec boutons export PDF/PNG/Impression
 */

import { useState, useEffect } from 'react'
import { invoiceService } from '@/lib/services' // ✅ Fix: import depuis l'index, pas depuis l'implémentation directe
import type { Invoice } from '@/lib/types/models'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ProtectedPage from '@/components/ProtectedPage'
import ExportFactureButton from '@/components/export/ExportFactureButton'

export default function FacturesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)

  const loadInvoices = async () => {
    setLoading(true)
    const { data } = await invoiceService.getAll()
    setInvoices(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadInvoices()
  }, [])

  const handleValidate = async (id: string) => {
    await invoiceService.validate(id)
    loadInvoices()
  }

  const handleMarkAsPaid = async (id: string) => {
    await invoiceService.markAsPaid(id)
    loadInvoices()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const stats = {
    total: invoices.length,
    enAttente: invoices.filter(i => i.status === 'en_attente').length,
    validee: invoices.filter(i => i.status === 'validée').length,
    payee: invoices.filter(i => i.status === 'payée').length,
    montantTotal: invoices.reduce((sum, i) => sum + i.total, 0),
  }

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      en_attente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      validée: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      payée: 'bg-green-500/20 text-green-400 border-green-500/30',
      annulée: 'bg-red-500/20 text-red-400 border-red-500/30',
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || ''}`}>
        {status.replace('_', ' ')}
      </span>
    )
  }

  return (
    <ProtectedPage allowedRoles={['gerant', 'admin']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-text-primary">🧾 Gestion des Factures</h1>
            <p className="text-sm text-text-secondary mt-1">Validation et suivi des paiements</p>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Total</p>
                  <p className="text-3xl font-bold text-text-primary">{stats.total}</p>
                </div>
                <div className="text-4xl">🧾</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">En attente</p>
                  <p className="text-3xl font-bold text-yellow-400">{stats.enAttente}</p>
                </div>
                <div className="text-4xl">⏳</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Validée</p>
                  <p className="text-3xl font-bold text-blue-400">{stats.validee}</p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Payée</p>
                  <p className="text-3xl font-bold text-green-400">{stats.payee}</p>
                </div>
                <div className="text-4xl">💰</div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">Montant total</p>
                  <p className="text-xl font-bold text-accent-yellow">{formatPrice(stats.montantTotal)}</p>
                </div>
                <div className="text-4xl">💵</div>
              </div>
            </Card>
          </div>

          {/* Liste factures */}
          {loading ? (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Chargement...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <Card key={invoice.id} className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Infos facture */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-text-primary">{invoice.reference}</h3>
                        <StatusBadge status={invoice.status} />
                      </div>

                      <div className="space-y-1 text-sm">
                        <p className="text-text-secondary">
                          👤 Client: <span className="text-text-primary">{invoice.client_name}</span>
                        </p>
                        <p className="text-text-secondary">
                          🏢 Revendeur: <span className="text-text-primary">{invoice.revendeur_name}</span>
                        </p>
                        <p className="text-text-secondary">
                          📅 Créée: <span className="text-text-primary">{formatDate(invoice.created_at)}</span>
                        </p>
                        {invoice.validated_at && (
                          <p className="text-text-secondary">
                            ✅ Validée: <span className="text-text-primary">{formatDate(invoice.validated_at)}</span>
                          </p>
                        )}
                        {invoice.paid_at && (
                          <p className="text-text-secondary">
                            💰 Payée: <span className="text-text-primary">{formatDate(invoice.paid_at)}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Montants */}
                    <div className="lg:w-64">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Sous-total HT:</span>
                          <span className="text-text-primary font-medium">{formatPrice(invoice.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-text-secondary">Marge ({invoice.marge_percentage}%):</span>
                          <span className="text-text-primary font-medium">{formatPrice(invoice.marge_amount)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-dark-border">
                          <span className="text-text-primary font-bold">Total TTC:</span>
                          <span className="text-accent-yellow font-bold text-lg">{formatPrice(invoice.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:w-48">
                      {/* Export */}
                      <ExportFactureButton
                        invoice={invoice}
                        type="menu"
                        label="📤 Exporter"
                        className="w-full"
                      />

                      {/* Actions selon statut */}
                      {invoice.status === 'en_attente' && (
                        <Button
                          onClick={() => handleValidate(invoice.id)}
                          variant="primary"
                          size="sm"
                          className="w-full"
                        >
                          ✅ Valider
                        </Button>
                      )}

                      {invoice.status === 'validée' && (
                        <Button
                          onClick={() => handleMarkAsPaid(invoice.id)}
                          variant="primary"
                          size="sm"
                          className="w-full"
                        >
                          💰 Marquer payée
                        </Button>
                      )}

                      <Button
                        onClick={() => setSelectedInvoice(invoice)}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        👁️ Détails
                      </Button>
                    </div>
                  </div>

                  {/* Items (expandable) */}
                  {selectedInvoice?.id === invoice.id && (
                    <div className="mt-4 pt-4 border-t border-dark-border">
                      <h4 className="font-bold text-text-primary mb-3">Articles:</h4>
                      <div className="space-y-2">
                        {invoice.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center p-3 bg-dark-elevated rounded-lg"
                          >
                            <div>
                              <p className="text-text-primary font-medium">{item.product_name}</p>
                              <p className="text-text-muted text-sm">
                                {item.quantity} x {formatPrice(item.unit_price)}
                              </p>
                            </div>
                            <span className="text-text-primary font-bold">{formatPrice(item.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {!loading && invoices.length === 0 && (
            <div className="text-center py-12 glass-container">
              <p className="text-text-secondary">Aucune facture</p>
            </div>
          )}
        </main>
      </div>
    </ProtectedPage>
  )
}
