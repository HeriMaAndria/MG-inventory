'use client'

import { useState } from 'react'
import { mockUserService, type UserAccount } from '@/lib/services/implementations/mockUserService'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface UserFormProps {
  user?: UserAccount
  onSuccess: () => void
  onCancel: () => void
}

export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: (user?.role || 'revendeur') as 'admin' | 'gerant' | 'revendeur',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (!formData.email.trim()) {
        throw new Error('L\'email est requis')
      }
      if (!user && !formData.password) {
        throw new Error('Le mot de passe est requis')
      }

      const result = user
        ? await mockUserService.update({
            id: user.id,
            name: formData.name.trim(),
            email: formData.email.trim(),
            role: formData.role,
          })
        : await mockUserService.create({
            name: formData.name.trim(),
            email: formData.email.trim(),
            role: formData.role,
            password: formData.password,
          })

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
        label="Nom complet"
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
        required
      />

      <div>
        <label className="label-dark">Rôle *</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
          className="input-dark"
        >
          <option value="revendeur">Revendeur</option>
          <option value="gerant">Gérant</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {!user && (
        <Input
          name="password"
          type="password"
          label="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />
      )}

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
          {user ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}
