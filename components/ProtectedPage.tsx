'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, type User } from '@/lib/auth/mockAuth'

interface ProtectedPageProps {
  allowedRoles: ('admin' | 'gerant' | 'revendeur')[]
  children: React.ReactNode
}

export default function ProtectedPage({ allowedRoles, children }: ProtectedPageProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      router.push('/login')
      return
    }

    if (!allowedRoles.includes(currentUser.role)) {
      router.push(`/${currentUser.role}`)
      return
    }

    setUser(currentUser)
    setLoading(false)
  }, [allowedRoles, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-text-secondary">Chargement...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
