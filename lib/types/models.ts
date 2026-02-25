/**
 * MODÈLES DE DONNÉES - MG INVENTORY
 */

// ============================================
// TYPES DE BASE
// ============================================

export type UserRole = 'admin' | 'gerant' | 'revendeur'
export type ProductCategory = 'tôles' | 'accessoires' | 'panne C' | 'autres'
export type OrderStatus = 'en_attente' | 'validée' | 'refusée' | 'commandée' | 'livrée' | 'payée' | 'retournée'

// ============================================
// USER & AUTH
// ============================================

export interface User {
  id: string
  email: string
  role: UserRole
  full_name: string
  created_at: string
}

// ============================================
// PRODUCTS
// ============================================

export interface Product {
  id: string
  reference: string | null
  name: string
  description: string | null
  couleur: string | null
  category: ProductCategory
  unit: string
  price: number
  quantity: number
  purchase_date: string | null
  created_at: string
  updated_at: string
}

export interface CreateProductInput {
  reference?: string
  name: string
  description?: string
  couleur?: string
  category: ProductCategory
  unit: string
  price: number
  quantity: number
  purchase_date?: string
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string
}

export interface ProductFilters {
  search?: string
  category?: ProductCategory
  couleur?: string
  minQuantity?: number
  maxQuantity?: number
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

export type {
  Invoice,
  InvoiceItem,
  InvoiceType,
  InvoiceStatus,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  InvoiceFilters
} from './invoice'

// ============================================
// ORDERS
// ============================================

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
  updated_at: string
  validated_at: string | null
  delivered_at: string | null
  paid_at: string | null
}

export interface CreateOrderInput {
  revendeur_id: string
  items: {
    product_id: string
    quantity: number
    unit_price: number
  }[]
  notes?: string
}

export interface UpdateOrderInput extends Partial<CreateOrderInput> {
  id: string
  status?: OrderStatus
}

export interface OrderFilters {
  search?: string
  revendeur_id?: string
  status?: OrderStatus
  date_from?: string
  date_to?: string
}

// ============================================
// STATISTICS
// ============================================

export interface DashboardStats {
  total_products: number
  total_stock_value: number
  low_stock_count: number
  pending_orders: number
  total_revenue_month: number
  total_orders_month: number
}

export interface RevendeurStats {
  total_clients: number
  total_revenue_month: number
  pending_quotes: number
  total_orders_month: number
  top_clients: {
    name: string
    total: number
    orders_count: number
  }[]
  top_products: {
    name: string
    sales_count: number
  }[]
}

// ============================================
// API RESPONSES
// ============================================

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  per_page: number
  total_pages: number
}
