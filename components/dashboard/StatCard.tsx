/**
 * COMPOSANT STAT CARD
 * Carte de statistique réutilisable pour les dashboards
 */

interface StatCardProps {
  title: string
  value: string | number
  icon: string
  trend?: {
    value: string
    positive: boolean
  }
  subtitle?: string
}

export default function StatCard({ title, value, icon, trend, subtitle }: StatCardProps) {
  return (
    <div className="card-dark group hover:glow-yellow cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold text-text-primary">{value}</p>
          
          {subtitle && (
            <p className="text-xs text-text-muted mt-1">{subtitle}</p>
          )}
          
          {trend && (
            <div className={`text-xs mt-2 flex items-center gap-1 ${
              trend.positive ? 'text-green-400' : 'text-red-400'
            }`}>
              <span>{trend.positive ? '↗' : '↘'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        
        <div className="text-5xl opacity-80 group-hover:scale-110 transition-transform">
          {icon}
        </div>
      </div>
    </div>
  )
}
