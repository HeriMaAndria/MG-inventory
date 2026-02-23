/**
 * MOCK REVENDEUR SERVICE
 * Gestion des revendeurs (Gérant uniquement)
 */

export interface Revendeur {
  id: string
  name: string
  email: string
  phone: string
  address: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface RevendeurStats {
  total_clients: number
  total_revenue: number
  total_orders: number
  pending_orders: number
  last_order_date: string | null
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

const MOCK_REVENDEURS: Revendeur[] = [
  {
    id: 'revendeur-1',
    name: 'Revendeur Test',
    email: 'revendeur@mg.com',
    phone: '+261 34 00 000 01',
    address: 'Antananarivo, Madagascar',
    active: true,
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'revendeur-2',
    name: 'Revendeur 2',
    email: 'revendeur2@mg.com',
    phone: '+261 34 00 000 02',
    address: 'Toamasina, Madagascar',
    active: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: 'revendeur-3',
    name: 'Revendeur 3',
    email: 'revendeur3@mg.com',
    phone: '+261 34 00 000 03',
    address: 'Fianarantsoa, Madagascar',
    active: false,
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-05T10:00:00Z',
  },
]

const STORAGE_KEY = 'mg_revendeurs'
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const loadRevendeurs = (): Revendeur[] => {
  if (typeof window === 'undefined') return MOCK_REVENDEURS
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_REVENDEURS))
    return MOCK_REVENDEURS
  }
  try {
    return JSON.parse(stored)
  } catch {
    return MOCK_REVENDEURS
  }
}

const saveRevendeurs = (revendeurs: Revendeur[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(revendeurs))
}

export const mockRevendeurService = {
  async getAll(): Promise<ApiResponse<Revendeur[]>> {
    await delay(300)
    try {
      const revendeurs = loadRevendeurs()
      return { data: revendeurs, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async getById(id: string): Promise<ApiResponse<Revendeur>> {
    await delay(200)
    try {
      const revendeurs = loadRevendeurs()
      const revendeur = revendeurs.find(r => r.id === id)
      if (!revendeur) {
        return { data: null, error: 'Revendeur non trouvé' }
      }
      return { data: revendeur, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async toggleActive(id: string): Promise<ApiResponse<Revendeur>> {
    await delay(300)
    try {
      const revendeurs = loadRevendeurs()
      const revendeur = revendeurs.find(r => r.id === id)
      if (!revendeur) {
        return { data: null, error: 'Revendeur non trouvé' }
      }
      
      revendeur.active = !revendeur.active
      revendeur.updated_at = new Date().toISOString()
      saveRevendeurs(revendeurs)
      return { data: revendeur, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async getStats(revendeurId: string): Promise<ApiResponse<RevendeurStats>> {
    await delay(300)
    try {
      // Données mock - en production, calculer depuis les vraies données
      const stats: RevendeurStats = {
        total_clients: Math.floor(Math.random() * 50) + 10,
        total_revenue: Math.floor(Math.random() * 5000000) + 1000000,
        total_orders: Math.floor(Math.random() * 100) + 20,
        pending_orders: Math.floor(Math.random() * 15),
        last_order_date: new Date().toISOString(),
      }
      return { data: stats, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },
}
