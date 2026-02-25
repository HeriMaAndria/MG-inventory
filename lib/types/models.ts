/**
 * MODÈLES DE DONNÉES - MG INVENTORY
 * 
 * Ces types définissent la structure exacte des données
 * Compatible avec Supabase ou toute autre base SQL
 */

// ============================================
// TYPES DE BASE
// ============================================

export type UserRole = 'admin' | 'gerant' | 'revendeur'
export type ProductCategory = 'tôles' | 'accessoires' | 'panne C' | 'autres'
export type InvoiceStatus = 'brouillon' | 'en_attente' | 'validée' | 'payée' | 'annulée'
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
  unit: string // m², kg, pièce, sac, etc.
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
// INVOICES (FACTURES)
// ============================================

export interface InvoiceItem {
  product_id: string
  product_name: string // Dénormalisé pour affichage
  quantity: number
  unit_price: number
  total: number
}

export interface Invoice {
  id: string
  reference: string // INV-001, INV-002, etc.
  revendeur_id: string
  revendeur_name: string // Dénormalisé
  client_id: string | null
  client_name: string | null // Dénormalisé
  items: InvoiceItem[]
  subtotal: number // Somme des items
  marge_percentage: number // Marge du revendeur
  marge_amount: number // Montant de la marge
  total: number // Subtotal + marge
  status: InvoiceStatus
  notes: string | null
  created_at: string
  updated_at: string
  validated_at: string | null
  paid_at: string | null
}

export interface CreateInvoiceInput {
  revendeur_id: string
  client_id?: string
  client_name?: string
  items: {
    product_id: string
    quantity: number
    unit_price: number
  }[]
  marge_percentage: number
  notes?: string
}

export interface UpdateInvoiceInput extends Partial<CreateInvoiceInput> {
  id: string
  status?: InvoiceStatus
}

export interface InvoiceFilters {
  search?: string // Recherche par référence ou client
  revendeur_id?: string
  status?: InvoiceStatus
  date_from?: string
  date_to?: string
}

// ============================================
// ORDERS (COMMANDES)
// ============================================

export interface Order {
  id: string
  reference: string // CMD-001, CMD-002, etc.
  revendeur_id: string
  revendeur_name: string
  items: InvoiceItem[] // Même structure que facture
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
// STOCK MOVEMENTS (MOUVEMENTS DE STOCK)
// ============================================

export interface StockMovement {
  id: string
  product_id: string
  product_name: string
  type: 'entrée' | 'sortie' | 'ajustement'
  quantity: number // Positif pour entrée, négatif pour sortie
  reason: string // "Achat", "Vente", "Retour", "Inventaire", etc.
  user_id: string
  user_name: string
  created_at: string
}

export interface CreateStockMovementInput {
  product_id: string
  type: 'entrée' | 'sortie' | 'ajustement'
  quantity: number
  reason: string
  user_id: string
}

// ============================================
// STATISTICS (POUR DASHBOARDS)
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
