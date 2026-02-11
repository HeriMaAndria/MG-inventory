/**
 * COMPOSANTS DE LOADING
 * 
 * Composants réutilisables pour afficher des états de chargement
 * partout dans l'application
 */

// 1. SPINNER SIMPLE
export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin`}></div>
  )
}

// 2. LOADING BUTTON (bouton avec spinner intégré)
export function LoadingButton({
  loading,
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}: {
  loading: boolean
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  className?: string
}) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`
        relative px-4 py-2 rounded-lg font-medium transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {/* Spinner qui apparaît pendant le loading */}
      {loading && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Spinner size="sm" />
        </span>
      )}
      
      {/* Texte qui devient invisible pendant le loading */}
      <span className={loading ? 'invisible' : ''}>
        {children}
      </span>
    </button>
  )
}

// 3. SKELETON LOADER (pour les cartes/contenus)
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-3 flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  )
}

// 4. FULL PAGE LOADER
export function PageLoader({ message = 'Chargement...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  )
}

// 5. INLINE LOADER (pour les listes)
export function InlineLoader({ text = 'Chargement...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <Spinner size="md" />
      <span className="ml-3 text-gray-600">{text}</span>
    </div>
  )
}

// 6. DOTS LOADER (style différent)
export function DotsLoader() {
  return (
    <div className="flex space-x-2">
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
    </div>
  )
}

// 7. PROGRESS BAR
export function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      ></div>
    </div>
  )
}
