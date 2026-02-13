// Database Types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Enums
export type UserRole = 'admin' | 'manager' | 'user';

export type InvoiceStatus =
  | 'draft'
  | 'pending_validation'
  | 'validated'
  | 'delivered'
  | 'cancelled';

export type InvoiceType = 'quote' | 'invoice' | 'delivery';

export type UnitType = 'piece' | 'meter' | 'sachet' | 'kilo' | 'unit';

export type NotificationType =
  | 'invoice_created'
  | 'invoice_validated'
  | 'invoice_rejected'
  | 'stock_low'
  | 'stock_critical';

export type ActivityType =
  | 'invoice_created'
  | 'invoice_updated'
  | 'invoice_deleted'
  | 'invoice_validated'
  | 'invoice_rejected'
  | 'product_created'
  | 'product_updated'
  | 'product_deleted'
  | 'stock_updated';

// User
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  seller_reference?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  user_id: string;
  total_invoices: number;
  total_revenue: number;
  total_margin: number;
  avg_margin_percentage: number;
  invoices_this_month: number;
  revenue_this_month: number;
  updated_at: string;
}

// Product
export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string;
  unit_type: UnitType;
  conversion_ratio?: number; // For detail/gros conversion
  purchase_price: number;
  manager_sale_price: number;
  stock_quantity: number;
  stock_alert_threshold: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  reference: string;
  description?: string;
  category?: string;
  base_unit: UnitType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
}

// Client
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ClientStats {
  client_id: string;
  total_invoices: number;
  total_revenue: number;
  last_invoice_date?: string;
  updated_at: string;
}

// Invoice
export interface InvoiceItem {
  id: string;
  invoice_id: string;
  product_variant_id: string;
  product_name: string;
  variant_name: string;
  quantity: number;
  unit_type: UnitType;
  unit_price: number;
  discount_percentage: number;
  discount_amount: number;
  subtotal: number;
  notes?: string;
  // Nested data for display
  product_variant?: ProductVariant;
}

export interface Invoice {
  id: string;
  invoice_number?: string; // Generated on validation
  invoice_type: InvoiceType;
  status: InvoiceStatus;
  created_by: string;
  validated_by?: string;
  client_id: string;
  invoice_date: string;
  due_date?: string;
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  tax_amount: number;
  total_amount: number;
  margin_amount: number;
  margin_percentage: number;
  notes?: string;
  internal_notes?: string;
  seller_reference?: string;
  created_at: string;
  updated_at: string;
  validated_at?: string;
  // Nested relationships
  items?: InvoiceItem[];
  client?: Client;
  created_by_user?: User;
  validated_by_user?: User;
}

// Notification
export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  metadata?: Json;
  created_at: string;
  read_at?: string;
}

// Activity Log
export interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: ActivityType;
  entity_type: string;
  entity_id: string;
  description: string;
  metadata?: Json;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
  // Nested
  user?: User;
}

// Dashboard KPIs
export interface DashboardKPIs {
  total_revenue: number;
  total_margin: number;
  pending_invoices: number;
  low_stock_products: number;
  critical_stock_products: number;
  invoices_today: number;
  revenue_today: number;
  active_users: number;
}

export interface UserDashboardKPIs {
  invoices_today: number;
  revenue_today: number;
  margin_today: number;
  invoices_this_month: number;
  revenue_this_month: number;
  margin_this_month: number;
  pending_invoices: number;
  low_stock_count: number;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form types
export interface CreateInvoiceForm {
  client_id: string;
  invoice_type: InvoiceType;
  invoice_date: string;
  due_date?: string;
  items: CreateInvoiceItemForm[];
  discount_amount: number;
  delivery_fee: number;
  notes?: string;
  internal_notes?: string;
}

export interface CreateInvoiceItemForm {
  product_variant_id: string;
  quantity: number;
  unit_price: number;
  discount_percentage: number;
  notes?: string;
}

export interface CreateProductForm {
  name: string;
  reference: string;
  description?: string;
  category?: string;
  base_unit: UnitType;
  variants: CreateProductVariantForm[];
}

export interface CreateProductVariantForm {
  name: string;
  sku: string;
  unit_type: UnitType;
  conversion_ratio?: number;
  purchase_price: number;
  manager_sale_price: number;
  stock_quantity: number;
  stock_alert_threshold: number;
}

export interface UpdateStockForm {
  variant_id: string;
  quantity: number;
  operation: 'add' | 'subtract' | 'set';
  reason?: string;
}

// Filters
export interface InvoiceFilters {
  status?: InvoiceStatus[];
  type?: InvoiceType[];
  client_id?: string;
  created_by?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface ProductFilters {
  category?: string;
  is_active?: boolean;
  low_stock?: boolean;
  search?: string;
}

// Offline sync types
export interface OfflineAction {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: 'invoice' | 'product' | 'client';
  payload: any;
  timestamp: number;
  status: 'pending' | 'synced' | 'failed';
  retry_count: number;
}

export interface SyncStatus {
  is_online: boolean;
  pending_actions: number;
  last_sync: Date | null;
  sync_in_progress: boolean;
}
