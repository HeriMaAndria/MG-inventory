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
  search?: string // Recherche par nom ou référence
  category?: ProductCategory
  min_price?: number
  max_price?: number
  in_stock?: boolean // Filtre produits en stock uniquement
}

// ============================================
// CLIENTS
// ============================================

export interface Client {
  id: string
  revendeur_id: string // Lien vers le revendeur propriétaire
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

export interface ClientFilters {
  search?: string // Recherche par nom, email ou téléphone
  revendeur_id?: string
}

// ============================================
// INVOICES - RE-EXPORT DEPUIS invoice.ts
// ============================================

/**
 * Les types Invoice sont maintenant dans invoice.ts
 * pour supporter le système de marge automatique avec 2 prix
 */
export type {
  Invoice,
  InvoiceItem,
  InvoiceType,
  InvoiceStatus
} from './invoice'

// ============================================
// ORDERS (COMMANDES)
// ============================================

export interface OrderItem {
  product_id: string
  product_name: string // Dénormalisé
  quantity: number
  unit_price: number
  total: number
}

export interface Order {
  id: string
  reference: string
  revendeur_id: string
  revendeur_name: string // Dénormalisé
  items: OrderItem[]
  total: number
  status: OrderStatus
  notes: string | null
  created_at: string
  validated_at: string | null
  refused_at: string | null
  ordered_at: string | null
  delivered_at: string | null
  paid_at: string | null
  returned_at: string | null
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
  search?: string // Recherche par référence
  revendeur_id?: string
  status?: OrderStatus
  date_from?: string
  date_to?: string
}

// ============================================
// STATS
// ============================================

export interface DashboardStats {
  total_products: number
  total_clients: number
  total_orders: number
  total_invoices: number
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

export interface TopClient {
  client_id: string
  client_name: string
  total_orders: number
  total_revenue: number
}
