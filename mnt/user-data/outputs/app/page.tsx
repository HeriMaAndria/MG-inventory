export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🧱 MG Inventory
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Système de gestion commerciale
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-md">
          <p className="text-sm text-gray-700">
            ✅ Déploiement réussi sur Vercel<br/>
            ⏳ Prochaine étape : Configuration de l'authentification
          </p>
        </div>
      </div>
    </main>
  )
}
