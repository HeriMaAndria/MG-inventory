/**
 * PAGE DE CHARGEMENT - DARK MODE VERT
 * 
 * Version personnalisée avec :
 * - Animations fluides et modernes
 * - Thème sombre élégant
 * - Couleur verte
 * - Logo animé
 * 
 * CORRECTION: Suppression de styled-jsx pour compatibilité Server Component
 */

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Effet de glow animé en arrière-plan */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="text-center relative z-10">
        {/* Conteneur du spinner avec effet de profondeur */}
        <div className="relative mb-8">
          {/* Cercle externe tournant - sens horaire */}
          <div className="relative h-32 w-32 mx-auto">
            {/* Anneau externe */}
            <div className="absolute inset-0 rounded-full border-4 border-gray-700/50"></div>
            
            {/* Anneau qui tourne - principal */}
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 border-r-green-500 animate-spin"></div>
            
            {/* Anneau qui tourne - secondaire (plus lent) */}
            <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-emerald-500 border-l-emerald-500 animate-[spin_2s_linear_infinite]"></div>
            
            {/* Cercle intérieur avec gradient */}
            <div className="absolute inset-6 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center shadow-inner">
              {/* Logo avec animation de pulsation */}
              <div className="text-5xl animate-pulse">
                🧱
              </div>
            </div>
            
            {/* Effet de lueur autour */}
            <div className="absolute inset-0 rounded-full bg-green-500/20 blur-xl animate-pulse"></div>
          </div>

          {/* Particules orbitales */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-emerald-400 rounded-full animate-ping delay-500"></div>
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-2 h-2 bg-green-300 rounded-full animate-ping delay-1000"></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 bg-emerald-300 rounded-full animate-ping delay-[1500ms]"></div>
        </div>

        {/* Texte avec effet de dégradé */}
        <h2 className="text-2xl font-bold mb-3">
          <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-500 bg-clip-text text-transparent">
            MG Inventory
          </span>
        </h2>
        
        <p className="text-gray-400 text-lg mb-6">
          Chargement en cours...
        </p>

        {/* Barre de progression animée */}
        <div className="w-64 mx-auto">
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            {/* Animation avec Tailwind au lieu de styled-jsx */}
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-[loading-bar_1.5s_ease-in-out_infinite]"></div>
          </div>
        </div>

        {/* Points animés */}
        <div className="flex justify-center space-x-3 mt-6">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce shadow-lg shadow-green-500/50"></div>
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce shadow-lg shadow-emerald-500/50 delay-100"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce shadow-lg shadow-green-400/50 delay-200"></div>
        </div>

        {/* Message secondaire */}
        <p className="text-gray-600 text-sm mt-8">
          Préparation de votre espace de travail
        </p>
      </div>

      {/* Animations de fond - grille */}
      <div 
        className="absolute inset-0 overflow-hidden pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(34, 197, 94, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(34, 197, 94, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      ></div>
    </div>
  )
}
