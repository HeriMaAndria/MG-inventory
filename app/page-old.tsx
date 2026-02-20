import Link from 'next/link'
import Card, { CardContent } from '@/components/ui/Card'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark-bg relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-dark"></div>
      
      {/* Hero Section */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-slide-up">
          {/* Logo */}
          <div className="inline-block p-8 bg-accent-yellow/10 rounded-3xl border border-accent-yellow/20 glow-yellow">
            <span className="text-8xl">🧱</span>
          </div>

          {/* Titre principal */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold text-text-primary">
              MG Inventory
            </h1>
            <p className="text-xl md:text-2xl text-accent-yellow font-semibold">
              Système de gestion commerciale
            </p>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Gérez efficacement votre stock, vos clients, vos revendeurs et vos factures 
              dans une plateforme centralisée et professionnelle.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/login">
              <button className="btn-primary text-lg px-8 py-4 w-full sm:w-auto">
                Se connecter
              </button>
            </Link>
            <Link href="#features">
              <button className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
                En savoir plus
              </button>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-accent-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-text-primary mb-16">
            Fonctionnalités principales
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card hover>
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-6xl">📦</div>
                <h3 className="text-xl font-bold text-text-primary">Gestion du Stock</h3>
                <p className="text-text-secondary">
                  Suivez vos produits, quantités et prix en temps réel. 
                  Alertes stock bas et historique complet.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card hover>
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-6xl">👥</div>
                <h3 className="text-xl font-bold text-text-primary">Clients & Revendeurs</h3>
                <p className="text-text-secondary">
                  Gérez vos clients et revendeurs avec leurs marges personnalisées. 
                  Suivi des commandes et paiements.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card hover>
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-6xl">🧾</div>
                <h3 className="text-xl font-bold text-text-primary">Facturation</h3>
                <p className="text-text-secondary">
                  Créez, suivez et validez vos factures. 
                  Génération PDF et suivi des paiements.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card hover>
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-6xl">📊</div>
                <h3 className="text-xl font-bold text-text-primary">Statistiques</h3>
                <p className="text-text-secondary">
                  Tableaux de bord détaillés avec ventes, bénéfices et performances.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card hover>
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-6xl">🔐</div>
                <h3 className="text-xl font-bold text-text-primary">Gestion des Rôles</h3>
                <p className="text-text-secondary">
                  Admins, gérants et revendeurs avec permissions adaptées à chaque niveau.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card hover>
              <CardContent className="p-8 text-center space-y-4">
                <div className="text-6xl">🔍</div>
                <h3 className="text-xl font-bold text-text-primary">Recherche & Filtres</h3>
                <p className="text-text-secondary">
                  Recherche avancée, filtres multiples et exports pour analyses approfondies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="elevated-container p-12 space-y-6">
            <h2 className="text-3xl font-bold text-text-primary">
              Prêt à optimiser votre gestion ?
            </h2>
            <p className="text-text-secondary text-lg">
              Connectez-vous dès maintenant et découvrez toutes les fonctionnalités.
            </p>
            <Link href="/login">
              <button className="btn-primary text-lg px-10 py-4">
                Accéder à l'application →
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 border-t border-dark-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-text-muted text-sm">
            © 2025 MG Inventory - Gestion commerciale professionnelle
          </p>
        </div>
      </footer>
    </div>
  )
}
