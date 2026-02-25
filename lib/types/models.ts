/**
 * TYPES DE DONNÉES PRINCIPAUX
 * 
 * Note: Invoice est maintenant dans invoice.ts pour supporter
 * le système de marge automatique (2 prix par produit)
 */

// ============================================
// TYPES DE BASE
// ============================================

export type UserRole = 'admin' | 'gerant' | 'revendeur'

// ============================================
// PRODUITS
// ============================================

export interface Product {
  id: string
  reference: string // REF-001, REF-002, etc.
  name: string
  description: string | null
  category: string
  color: string | null
  unit: string // m², kg, pièce, etc.
  price: number // Prix de base (catalogue entreprise)
  stock: number
  stock_min: number
  created_at: string
  updated_at: string
}
export type ProductCategory = 'tôle' | 'bardage' | 'accessoires' | 'visserie' | 'autre'
export interface CreateProductInput {
  reference: string
  name: string
  description?: string
  category: string
  color?: string
  unit: string
  price: number
  stock: number
  stock_min: number
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string
}

// ============================================
// CLIENTS
// ============================================

export interface Client {
  id: string
  revendeur_id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export interface CreateClientInput {
  revendeur_id: string
  name: string
  email?: string
  phone?: string
  address?: string
}

export interface UpdateClientInput extends Partial<CreateClientInput> {
  id: string
}

// ============================================
// INVOICES - RE-EXPORT depuis invoice.ts
// ============================================

// ✅ Source unique de vérité pour éviter les doublons
export type {
  Invoice,
  InvoiceItem,
  InvoiceType,
  InvoiceStatus
} from './invoice'

// ============================================
// COMMANDES
// ============================================

export type OrderStatus = 'en_attente' | 'validée' | 'refusée' | 'commandée' | 'livrée' | 'payée' | 'retournée'

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  total: number
}

export interface Order {
  id: string
  reference: string
  revendeur_id: string
  revendeur_name: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  notes: string | null
  created_at: string
  validated_at: string | null
  delivered_at: string | null
  paid_at: string | null
}

export interface CreateOrderInput {
  revendeur_id: string
  items: Omit<OrderItem, 'product_name'>[]
  notes?: string
}

// ============================================
// UTILISATEURS
// ============================================

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  active: boolean
  created_at: string
}

export interface CreateUserInput {
  email: string
  password: string
  name: string
  role: UserRole
}

export interface UpdateUserInput {
  id: string
  name?: string
  role?: UserRole
  active?: boolean
}

// ============================================
// STATISTIQUES
// ============================================

export interface DashboardStats {
  total_products: number
  total_clients: number
  total_orders: number
  total_revenue: number
  pending_orders: number
  low_stock_products: number
}

export interface RevenueByMonth {
  month: string
  revenue: number
}

export interface TopProduct {
  product_id: string
  product_name: string
  quantity_sold: number
  revenue: number
}
