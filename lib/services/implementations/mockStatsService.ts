/**
 * MOCK STATS SERVICE
 * Statistiques et rapports
 */

import type { IStatsService } from '../contracts'
import type { DashboardStats, RevendeurStats, ApiResponse } from '@/lib/types/models'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockStatsService: IStatsService = {
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    await delay(300)
    try {
      const stats: DashboardStats = {
        total_products: 234,
        total_stock_value: 15234000,
        low_stock_count: 8,
        pending_orders: 12,
        total_revenue_month: 2450000,
        total_orders_month: 45,
      }
      return { data: stats, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async getRevendeurStats(revendeurId: string): Promise<ApiResponse<RevendeurStats>> {
    await delay(300)
    try {
      const stats: RevendeurStats = {
        total_clients: 28,
        total_revenue_month: 1200000,
        pending_quotes: 12,
        total_orders_month: 45,
        top_clients: [
          { name: 'Client A - Construction', total: 520000, orders_count: 8 },
          { name: 'Client B - Entreprise BTP', total: 385000, orders_count: 5 },
          { name: 'Client C - Particulier', total: 290000, orders_count: 4 },
        ],
        top_products: [
          { name: 'Tôle ondulée 2m', sales_count: 45 },
          { name: 'Panne C 80x40', sales_count: 32 },
          { name: 'Vis autoperceuse 5mm', sales_count: 28 },
        ],
      }
      return { data: stats, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },
}
