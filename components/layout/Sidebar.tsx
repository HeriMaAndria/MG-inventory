'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth/mockAuth'

interface MenuItem {
  icon: string
  label: string
  href: string
  roles: ('admin' | 'gerant' | 'revendeur')[]
}

const menuItems: MenuItem[] = [
  // Admin
  { icon: '📊', label: 'Dashboard', href: '/admin', roles: ['admin'] },
  { icon: '👥', label: 'Utilisateurs', href: '/admin/users', roles: ['admin'] },
  { icon: '⚙️', label: 'Paramètres', href: '/admin/settings', roles: ['admin'] },
  
  // Gérant
  { icon: '📊', label: 'Dashboard', href: '/gerant', roles: ['gerant'] },
  { icon: '📦', label: 'Stock', href: '/gerant/stock', roles: ['gerant'] },
  { icon: '🛒', label: 'Commandes', href: '/gerant/commandes', roles: ['gerant'] },
  { icon: '🧾', label: 'Factures', href: '/gerant/factures', roles: ['gerant'] },
  { icon: '👥', label: 'Revendeurs', href: '/gerant/revendeurs', roles: ['gerant'] },
  
  // Revendeur
  { icon: '📊', label: 'Dashboard', href: '/revendeur', roles: ['revendeur'] },
  { icon: '📚', label: 'Catalogue', href: '/revendeur/catalogue', roles: ['revendeur'] },
  { icon: '👥', label: 'Mes Clients', href: '/revendeur/clients', roles: ['revendeur'] },
  { icon: '📝', label: 'Mes Devis', href: '/revendeur/devis', roles: ['revendeur'] },
  { icon: '🛒', label: 'Mes Commandes', href: '/revendeur/commandes', roles: ['revendeur'] },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  const [user, setUser] = useState<ReturnType<typeof getCurrentUser>>(null)

  // Charger l'utilisateur côté client uniquement
  useEffect(() => {
    setIsClient(true)
    setUser(getCurrentUser())
  }, [])

  // Ne rien afficher tant qu'on n'est pas côté client
  if (!isClient || !user) {
    return null
  }

  // Filtrer les items selon le rôle
  const visibleItems = menuItems.filter(item => item.roles.includes(user.role))

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className={`fixed left-0 top-0 h-screen bg-dark-surface border-r border-dark-border transition-all duration-300 z-40 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-dark-border flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧱</span>
                <span className="font-bold text-text-primary">MG Inventory</span>
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-dark-elevated rounded-lg transition-colors"
            >
              {collapsed ? '→' : '←'}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {visibleItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-accent-yellow text-dark-bg font-semibold'
                        : 'text-text-secondary hover:bg-dark-elevated hover:text-text-primary'
                    }`}
                    title={collapsed ? item.label : ''}
                  >
                    <span className="text-xl">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* User Info */}
          <div className="p-4 border-t border-dark-border">
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-accent-yellow flex items-center justify-center text-dark-bg font-bold">
                {user.name.charAt(0)}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                  <p className="text-xs text-text-muted truncate">{user.role}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer pour compenser la sidebar */}
      <div className={`${collapsed ? 'w-20' : 'w-64'} flex-shrink-0`} />
    </>
  )
}
