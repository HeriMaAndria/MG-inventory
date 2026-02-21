'use client'

import { useRouter } from 'next/navigation'
import { getCurrentUser, logout } from '@/lib/auth/mockAuth'

export default function Navbar() {
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) return null

  return (
    <nav className="h-16 bg-dark-surface border-b border-dark-border px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Breadcrumb / Title (optionnel) */}
      <div className="text-text-secondary text-sm">
        {/* Tu peux ajouter des breadcrumbs ici */}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications (optionnel) */}
        <button className="p-2 hover:bg-dark-elevated rounded-lg transition-colors relative">
          <span className="text-xl">🔔</span>
          {/* Badge notif */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-text-primary">{user.name}</p>
            <p className="text-xs text-text-muted capitalize">{user.role}</p>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors text-sm font-medium"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  )
}
