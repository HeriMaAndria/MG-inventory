'use client'

/**
 * PAGE PARAMÈTRES SYSTÈME (ADMIN)
 */

import { useState } from 'react'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ProtectedPage from '@/components/ProtectedPage'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    company_name: 'MG Inventory',
    email: 'contact@mg-inventory.com',
    phone: '+261 34 00 000 00',
    address: 'Antananarivo, Madagascar',
    default_margin: '15',
    low_stock_threshold: '10',
  })

  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    // Simuler sauvegarde
    await new Promise(resolve => setTimeout(resolve, 500))
    
    localStorage.setItem('mg_settings', JSON.stringify(settings))
    setSaving(false)
    setSuccess(true)

    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <ProtectedPage allowedRoles={['admin']}>
      <div className="min-h-screen bg-dark-bg">
        <header className="glass-container mx-4 mt-4">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <h1 className="text-3xl font-bold text-text-primary">⚙️ Paramètres Système</h1>
            <p className="text-sm text-text-secondary mt-1">Configuration de l'application</p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <form onSubmit={handleSave} className="space-y-6">
            {/* Informations entreprise */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de l'entreprise</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  name="company_name"
                  label="Nom de l'entreprise"
                  value={settings.company_name}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="email"
                  type="email"
                  label="Email"
                  value={settings.email}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="phone"
                  label="Téléphone"
                  value={settings.phone}
                  onChange={handleChange}
                />
                <div>
                  <label className="label-dark">Adresse</label>
                  <input
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    className="input-dark"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Paramètres commerciaux */}
            <Card>
              <CardHeader>
                <CardTitle>Paramètres commerciaux</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  name="default_margin"
                  type="number"
                  label="Marge par défaut (%)"
                  value={settings.default_margin}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  step="0.1"
                />
                <Input
                  name="low_stock_threshold"
                  type="number"
                  label="Seuil alerte stock faible"
                  value={settings.low_stock_threshold}
                  onChange={handleChange}
                  min="0"
                />
              </CardContent>
            </Card>

            {/* Actions dangereuses */}
            <Card>
              <CardHeader>
                <CardTitle>Actions avancées</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      if (confirm('Exporter toutes les données ?')) {
                        const data = {
                          products: localStorage.getItem('mg_products'),
                          clients: localStorage.getItem('mg_clients'),
                          invoices: localStorage.getItem('mg_invoices'),
                          orders: localStorage.getItem('mg_orders'),
                        }
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = `backup-${new Date().toISOString()}.json`
                        a.click()
                      }
                    }}
                  >
                    💾 Exporter les données
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => {
                      if (confirm('⚠️ ATTENTION ! Cela supprimera TOUTES les données. Continuer ?')) {
                        localStorage.clear()
                        window.location.reload()
                      }
                    }}
                  >
                    🗑️ Réinitialiser toutes les données
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Bouton sauvegarder */}
            <div className="flex gap-4">
              <Button
                type="submit"
                isLoading={saving}
                className="flex-1"
              >
                💾 Enregistrer les paramètres
              </Button>
            </div>

            {success && (
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg text-center">
                ✅ Paramètres enregistrés avec succès
              </div>
            )}
          </form>
        </main>
      </div>
    </ProtectedPage>
  )
}
