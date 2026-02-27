/**
 * CONTRATS DE SERVICES - COMPLET
 */

import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  Client,
  CreateClientInput,
  UpdateClientInput,
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrderFilters,
  DashboardStats,
  RevendeurStats,
  ApiResponse,
} from '../../types/models'

import type {
  Invoice,
  InvoiceItem,
} from '../../types/invoice'

// ============================================
// INVOICE SERVICE - TOUTES LES MÉTHODES
// ============================================

export interface UpdateInvoiceInput {
  id: string
  items?: Omit<InvoiceItem, 'total_catalogue' | 'total_vente' | 'marge_unitaire' | 'marge_total'>[]
  notes?: string
  status?: Invoice['status']
}

export interface IInvoiceService {
  getAll(): Promise<{ data: Invoice[] | null; error: string | null }>
  getById(id: string): Promise<{ data: Invoice | null; error: string | null }>
  validate(id: string): Promise<{ data: Invoice | null; error: string | null }>
  markAsPaid(id: string): Promise<{ data: Invoice | null; error: string | null }>
  delete(id: string): Promise<{ data: void | null; error: string | null }>
  update(data: UpdateInvoiceInput): Promise<{ data: Invoice | null; error: string | null }>
}

// ============================================
// PRODUCT SERVICE
// ============================================

export interface IProductService {
  getAll(filters?: ProductFilters): Promise<ApiResponse<Product[]>>
  getById(id: string): Promise<ApiResponse<Product>>
  create(data: CreateProductInput): Promise<ApiResponse<Product>>
  update(data: UpdateProductInput): Promise<ApiResponse<Product>>
  delete(id: string): Promise<ApiResponse<void>>
  updateQuantity(id: string, quantityChange: number): Promise<ApiResponse<Product>>
}

// ============================================
// CLIENT SERVICE
// ============================================

export interface IClientService {
  getAll(revendeurId: string): Promise<ApiResponse<Client[]>>
  getById(id: string): Promise<ApiResponse<Client>>
  create(data: CreateClientInput): Promise<ApiResponse<Client>>
  update(data: UpdateClientInput): Promise<ApiResponse<Client>>
  delete(id: string): Promise<ApiResponse<void>>
}

// ============================================
// ORDER SERVICE
// ============================================

export interface IOrderService {
  getAll(filters?: OrderFilters): Promise<ApiResponse<Order[]>>
  getById(id: string): Promise<ApiResponse<Order>>
  create(data: CreateOrderInput): Promise<ApiResponse<Order>>
  update(data: UpdateOrderInput): Promise<ApiResponse<Order>>
  delete(id: string): Promise<ApiResponse<void>>
  updateStatus(id: string, status: Order['status']): Promise<ApiResponse<Order>>
}

// ============================================
// STATS SERVICE
// ============================================

export interface IStatsService {
  getDashboardStats(): Promise<ApiResponse<DashboardStats>>
  getRevendeurStats(revendeurId: string): Promise<ApiResponse<RevendeurStats>>
}
