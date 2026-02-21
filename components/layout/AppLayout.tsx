'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const pathname = usePathname()

  // Pages sans layout (login, register, etc.)
  const publicPages = ['/login', '/register', '/forgot-password', '/']
  const isPublicPage = publicPages.includes(pathname)

  if (isPublicPage) {
    return <>{children}</>
  }

  // Pages avec layout complet
  return (
    <div className="flex min-h-screen bg-dark-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
