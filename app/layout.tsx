import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MG Inventory - Gestion Commerciale',
  description: 'Système de gestion pour matériaux de construction',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
