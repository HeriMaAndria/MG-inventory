'use client'

/**
 * GRAPHIQUE TOP PRODUITS (BAR CHART)
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface TopProductsChartProps {
  data: Array<{
    name: string
    sales: number
  }>
}

export default function TopProductsChart({ data }: TopProductsChartProps) {
  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#333" />
          <XAxis 
            dataKey="name" 
            stroke="#999"
            style={{ fontSize: '11px' }}
            angle={-20}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#999"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1a1a1a', 
              border: '1px solid #333',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value: number) => [value, 'Ventes']}
          />
          <Legend />
          <Bar 
            dataKey="sales" 
            fill="#FDB022" 
            name="Quantité vendue"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
