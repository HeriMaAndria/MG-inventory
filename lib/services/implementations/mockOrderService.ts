/**
 * MOCK ORDER SERVICE
 * Gestion des commandes
 */

import type { IOrderService } from '../contracts'
import type {
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrderFilters,
  ApiResponse,
} from '@/lib/types/models'

const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    reference: 'CMD-001',
    revendeur_id: 'revendeur-1',
    revendeur_name: 'Revendeur Test',
    items: [
      {
        product_id: '1',
        product_name: 'Tôle ondulée 2m',
        quantity: 15,
        unit_price: 15000,
        total: 225000,
      },
    ],
    total: 225000,
    status: 'en_attente',
    notes: null,
    created_at: '2025-02-12T10:00:00Z',
    updated_at: '2025-02-12T10:00:00Z',
    validated_at: null,
    delivered_at: null,
    paid_at: null,
  },
  {
    id: '2',
    reference: 'CMD-002',
    revendeur_id: 'revendeur-1',
    revendeur_name: 'Revendeur Test',
    items: [
      {
        product_id: '2',
        product_name: 'Vis autoperceuse 5mm',
        quantity: 10,
        unit_price: 2500,
        total: 25000,
      },
      {
        product_id: '3',
        product_name: 'Panne C 80x40',
        quantity: 8,
        unit_price: 8000,
        total: 64000,
      },
    ],
    total: 89000,
    status: 'validée',
    notes: 'Livraison express',
    created_at: '2025-02-10T10:00:00Z',
    updated_at: '2025-02-11T14:00:00Z',
    validated_at: '2025-02-11T14:00:00Z',
    delivered_at: null,
    paid_at: null,
  },
  {
    id: '3',
    reference: 'CMD-003',
    revendeur_id: 'revendeur-1',
    revendeur_name: 'Revendeur Test',
    items: [
      {
        product_id: '1',
        product_name: 'Tôle ondulée 2m',
        quantity: 25,
        unit_price: 15000,
        total: 375000,
      },
    ],
    total: 375000,
    status: 'livrée',
    notes: null,
    created_at: '2025-02-08T10:00:00Z',
    updated_at: '2025-02-09T16:00:00Z',
    validated_at: '2025-02-08T15:00:00Z',
    delivered_at: '2025-02-09T16:00:00Z',
    paid_at: null,
  },
]

const STORAGE_KEY = 'mg_orders'
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const loadOrders = (): Order[] => {
  if (typeof window === 'undefined') return MOCK_ORDERS
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ORDERS))
    return MOCK_ORDERS
  }
  try {
    return JSON.parse(stored)
  } catch {
    return MOCK_ORDERS
  }
}

const saveOrders = (orders: Order[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export const mockOrderService: IOrderService = {
  async getAll(filters?: OrderFilters): Promise<ApiResponse<Order[]>> {
    await delay(300)
    try {
      let orders = loadOrders()
      
      if (filters?.revendeur_id) {
        orders = orders.filter(o => o.revendeur_id === filters.revendeur_id)
      }
      
      if (filters?.status) {
        orders = orders.filter(o => o.status === filters.status)
      }
      
      if (filters?.search) {
        const search = filters.search.toLowerCase()
        orders = orders.filter(o =>
          o.reference.toLowerCase().includes(search) ||
          o.revendeur_name.toLowerCase().includes(search)
        )
      }
      
      if (filters?.date_from) {
        orders = orders.filter(o => o.created_at >= filters.date_from!)
      }
      
      if (filters?.date_to) {
        orders = orders.filter(o => o.created_at <= filters.date_to!)
      }
      
      return { data: orders, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async getById(id: string): Promise<ApiResponse<Order>> {
    await delay(200)
    try {
      const orders = loadOrders()
      const order = orders.find(o => o.id === id)
      if (!order) {
        return { data: null, error: 'Commande non trouvée' }
      }
      return { data: order, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async create(data: CreateOrderInput): Promise<ApiResponse<Order>> {
    await delay(400)
    try {
      const orders = loadOrders()
      
      const total = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
      
      const newOrder: Order = {
        id: Date.now().toString(),
        reference: `CMD-${String(orders.length + 1).padStart(3, '0')}`,
        revendeur_id: data.revendeur_id,
        revendeur_name: 'Revendeur Test',
        items: data.items.map(item => ({
          ...item,
          product_name: `Produit ${item.product_id}`,
          total: item.quantity * item.unit_price,
        })),
        total,
        status: 'en_attente',
        notes: data.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        validated_at: null,
        delivered_at: null,
        paid_at: null,
      }
      
      orders.push(newOrder)
      saveOrders(orders)
      return { data: newOrder, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async update(data: UpdateOrderInput): Promise<ApiResponse<Order>> {
    await delay(400)
    try {
      const orders = loadOrders()
      const index = orders.findIndex(o => o.id === data.id)
      if (index === -1) {
        return { data: null, error: 'Commande non trouvée' }
      }
      
      const updated: Order = {
        ...orders[index],
        ...data,
        updated_at: new Date().toISOString(),
      }
      
      if (data.items) {
        const total = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
        updated.total = total
      }
      
      orders[index] = updated
      saveOrders(orders)
      return { data: updated, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300)
    try {
      const orders = loadOrders()
      const filtered = orders.filter(o => o.id !== id)
      if (filtered.length === orders.length) {
        return { data: null, error: 'Commande non trouvée' }
      }
      saveOrders(filtered)
      return { data: undefined, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async updateStatus(id: string, status: Order['status']): Promise<ApiResponse<Order>> {
    await delay(300)
    try {
      const orders = loadOrders()
      const order = orders.find(o => o.id === id)
      if (!order) {
        return { data: null, error: 'Commande non trouvée' }
      }
      
      order.status = status
      order.updated_at = new Date().toISOString()
      
      if (status === 'validée' && !order.validated_at) {
        order.validated_at = new Date().toISOString()
      }
      if (status === 'livrée' && !order.delivered_at) {
        order.delivered_at = new Date().toISOString()
      }
      if (status === 'payée' && !order.paid_at) {
        order.paid_at = new Date().toISOString()
      }
      
      saveOrders(orders)
      return { data: order, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },
}
