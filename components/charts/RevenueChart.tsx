'use client'

/**
 * GRAPHIQUE ÉVOLUTION CHIFFRE D'AFFAIRES
 * Utilise recharts
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface RevenueChartProps {
  data: Array<{
    month: string
    revenue: number
  }>
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { 
      notation: 'compact',
      compactDisplay: 'short' 
    }).format(value) + ' Ar'
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="month" 
            stroke="#999"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#999"
            style={{ fontSize: '12px' }}
            tickFormatter={formatPrice}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a1a', 
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number | string) => [formatPrice(Number(value)), 'CA']}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#FDB022" 
            strokeWidth={3}
            name="Chiffre d'affaires"
            dot={{ fill: '#FDB022', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
