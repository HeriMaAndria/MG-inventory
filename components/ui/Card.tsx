/**
 * COMPOSANT CARD
 * Conteneur avec effet glass
 */

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function Card({ children, className = '', hover = false, glow = false }: CardProps) {
  return (
    <div className={`
      glass-container p-6
      ${hover ? 'hover:border-dark-border-light hover:scale-[1.02]' : ''}
      ${glow ? 'glow-yellow' : ''}
      transition-all duration-200
      ${className}
    `}>
      {children}
    </div>
  )
}

/**
 * CARD HEADER
 */
export function CardHeader({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

/**
 * CARD TITLE
 */
export function CardTitle({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <h3 className={`text-xl font-bold text-text-primary ${className}`}>
      {children}
    </h3>
  )
}

/**
 * CARD DESCRIPTION
 */
export function CardDescription({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <p className={`text-sm text-text-secondary mt-1 ${className}`}>
      {children}
    </p>
  )
}

/**
 * CARD CONTENT
 */
export function CardContent({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

/**
 * CARD FOOTER
 */
export function CardFooter({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`mt-6 pt-4 border-t border-dark-border ${className}`}>
      {children}
    </div>
  )
}
