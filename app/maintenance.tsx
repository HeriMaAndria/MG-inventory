/**
 * PAGE DE MAINTENANCE
 * Thème sombre (#0a0a0a) + Jaune (#fbbf24)
 */

export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] px-4 relative overflow-hidden">
      {/* Effet de glow en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#fbbf24]/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="max-w-3xl w-full text-center relative z-10">
        {/* Icône de maintenance animée */}
        <div className="mb-8 relative">
          <div className="relative h-32 w-32 mx-auto">
            {/* Cercle externe pulsant */}
            <div className="absolute inset-0 bg-[#fbbf24]/20 rounded-full animate-ping"></div>
            
            {/* Conteneur icône */}
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-[#fbbf24]/50 rounded-full p-8 shadow-2xl shadow-[#fbbf24]/20">
              <svg className="w-16 h-16 text-[#fbbf24] animate-[spin_3s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Carte principale */}
        <div className="bg-[#1a1a1a]/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-800/50 p-8 mb-6">
          {/* Titre avec dégradé */}
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent">
              Maintenance en cours
            </span>
          </h1>
          
          <p className="text-gray-400 text-xl mb-8">
            Nous améliorons MG Inventory pour vous offrir une meilleure expérience
          </p>

          {/* Info détaillée */}
          <div className="bg-[#0a0a0a]/50 border border-[#fbbf24]/20 rounded-xl p-6 mb-6">
            <div className="grid md:grid-cols-3 gap-6 text-left">
              {/* Durée estimée */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-[#fbbf24]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-1">Durée estimée</p>
                  <p className="text-xs text-gray-500">Environ 2 heures</p>
                </div>
              </div>

              {/* Statut */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-[#fbbf24]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-1">Statut</p>
                  <p className="text-xs text-gray-500">En cours...</p>
                </div>
              </div>

              {/* Type */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-[#fbbf24]/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-300 mb-1">Type</p>
                  <p className="text-xs text-gray-500">Mise à jour planifiée</p>
                </div>
              </div>
            </div>
          </div>

          {/* Nouveautés */}
          <div className="bg-[#0a0a0a]/30 border border-[#fbbf24]/10 rounded-xl p-6 text-left">
            <p className="text-sm font-semibold text-[#fbbf24] mb-3">Ce qui arrive :</p>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="flex items-start">
                <span className="text-[#fbbf24] mr-2">✓</span>
                <span>Amélioration des performances</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#fbbf24] mr-2">✓</span>
                <span>Nouvelles fonctionnalités d'inventaire</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#fbbf24] mr-2">✓</span>
                <span>Corrections de bugs et optimisations</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#fbbf24] mr-2">✓</span>
                <span>Interface utilisateur améliorée</span>
              </li>
            </ul>
          </div>

          {/* Barre de progression */}
          <div className="mt-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Progression</span>
              <span className="text-[#fbbf24]">En cours...</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] rounded-full animate-[loading-bar_2s_ease-in-out_infinite]"></div>
            </div>
          </div>
        </div>

        {/* Contact support */}
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p>Questions ? Contactez <span className="text-[#fbbf24]">support@mg-inventory.com</span></p>
        </div>
      </div>

      {/* Grille animée en arrière-plan */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(251, 191, 36, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(251, 191, 36, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
    </div>
  )
}
