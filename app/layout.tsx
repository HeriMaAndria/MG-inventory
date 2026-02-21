import type { Metadata } from 'next'
import './globals.css'
import AppLayout from '@/components/layout/AppLayout'

export const metadata: Metadata = {
  title: 'MG Inventory',
  description: 'Système de gestion commerciale',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  )
}
