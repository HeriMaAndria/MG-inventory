'use client'

/**
 * PAGE ACCÈS REFUSÉ
 * Utilisée par ProtectedPage quand l'utilisateur n'a pas le bon rôle
 */

import Link from 'next/link'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'

export default function AccessDeniedPage() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Accès refusé
        </h1>
        
        <p className="text-text-secondary mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        
        <div className="space-y-3">
          <Link href="/" className="block">
            <Button className="w-full">
              Retour à l'accueil
            </Button>
          </Link>
          
          <Link href="/login" className="block">
            <Button variant="secondary" className="w-full">
              Se reconnecter
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
