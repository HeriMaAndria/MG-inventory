/**
 * CONTRATS DE SERVICES
 * 
 * Ces interfaces définissent les méthodes que TOUS les services doivent implémenter
 * Que ce soit mock, Supabase, API Laravel, etc.
 */

import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  Client,
  CreateClientInput,
  UpdateClientInput,
  Invoice,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  InvoiceFilters,
  Order,
  CreateOrderInput,
  UpdateOrderInput,
  OrderFilters,
  StockMovement,
  CreateStockMovementInput,
  DashboardStats,
  RevendeurStats,
  ApiResponse,
} from '@/lib/types/models'

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
// INVOICE SERVICE
// ============================================

export interface IInvoiceService {
  getAll(filters?: InvoiceFilters): Promise<ApiResponse<Invoice[]>>
  getById(id: string): Promise<ApiResponse<Invoice>>
  create(data: CreateInvoiceInput): Promise<ApiResponse<Invoice>>
  update(data: UpdateInvoiceInput): Promise<ApiResponse<Invoice>>
  delete(id: string): Promise<ApiResponse<void>>
  validate(id: string): Promise<ApiResponse<Invoice>>
  markAsPaid(id: string): Promise<ApiResponse<Invoice>>
  generatePDF(id: string): Promise<ApiResponse<Blob>>
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
// STOCK MOVEMENT SERVICE
// ============================================

export interface IStockMovementService {
  getAll(productId?: string): Promise<ApiResponse<StockMovement[]>>
  create(data: CreateStockMovementInput): Promise<ApiResponse<StockMovement>>
}

// ============================================
// STATS SERVICE
// ============================================

export interface IStatsService {
  getDashboardStats(): Promise<ApiResponse<DashboardStats>>
  getRevendeurStats(revendeurId: string): Promise<ApiResponse<RevendeurStats>>
}
