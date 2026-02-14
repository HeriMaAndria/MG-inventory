'use client'

import { useState } from 'react'
import { clientService } from '@/lib/services'
import type { Client } from '@/lib/types/models'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface ClientFormProps {
  client?: Client
  revendeurId: string
  onSuccess: () => void
  onCancel: () => void
}

export default function ClientForm({ client, revendeurId, onSuccess, onCancel }: ClientFormProps) {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    email: client?.email || '',
    phone: client?.phone || '',
    address: client?.address || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!formData.name.trim()) {
        throw new Error('Le nom est requis')
      }

      const clientData = {
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
      }

      const result = client
        ? await clientService.update({ id: client.id, ...clientData })
        : await clientService.create({ revendeur_id: revendeurId, ...clientData })

      if (result.error) {
        throw new Error(result.error)
      }

      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        label="Nom du client"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <Input
        name="email"
        type="email"
        label="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <Input
        name="phone"
        label="Téléphone"
        value={formData.phone}
        onChange={handleChange}
      />

      <div>
        <label className="label-dark">Adresse</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          className="input-dark"
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" onClick={onCancel} variant="secondary" className="flex-1">
          Annuler
        </Button>
        <Button type="submit" isLoading={loading} className="flex-1">
          {client ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}
