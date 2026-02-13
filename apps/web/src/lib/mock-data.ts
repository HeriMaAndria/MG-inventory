import type {
  User,
  Product,
  ProductVariant,
  Client,
  Invoice,
  InvoiceItem,
  Notification,
  ActivityLog,
  DashboardKPIs,
  UserDashboardKPIs,
} from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@mg-inventory.com',
    full_name: 'Admin User',
    role: 'admin',
    seller_reference: 'ADM-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'manager@mg-inventory.com',
    full_name: 'Manager User',
    role: 'manager',
    seller_reference: 'MGR-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'user@mg-inventory.com',
    full_name: 'John Doe',
    role: 'user',
    seller_reference: 'USR-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Products with Variants
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Câble Électrique',
    reference: 'CAB-ELEC-001',
    description: 'Câble électrique multi-usage',
    category: 'Électricité',
    base_unit: 'meter',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Ciment',
    reference: 'CIM-001',
    description: 'Ciment Portland 42.5',
    category: 'Construction',
    base_unit: 'sachet',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Vis',
    reference: 'VIS-001',
    description: 'Vis à bois diverses',
    category: 'Quincaillerie',
    base_unit: 'piece',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockProductVariants: ProductVariant[] = [
  {
    id: 'var-1',
    product_id: 'prod-1',
    name: 'Câble 2.5mm²',
    sku: 'CAB-2.5MM',
    unit_type: 'meter',
    conversion_ratio: 100, // Rouleau de 100m
    purchase_price: 150000,
    manager_sale_price: 200000,
    stock_quantity: 500,
    stock_alert_threshold: 100,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'var-2',
    product_id: 'prod-1',
    name: 'Câble 4mm²',
    sku: 'CAB-4MM',
    unit_type: 'meter',
    conversion_ratio: 100,
    purchase_price: 250000,
    manager_sale_price: 320000,
    stock_quantity: 300,
    stock_alert_threshold: 50,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'var-3',
    product_id: 'prod-2',
    name: 'Ciment 50kg',
    sku: 'CIM-50KG',
    unit_type: 'sachet',
    purchase_price: 32000,
    manager_sale_price: 40000,
    stock_quantity: 80,
    stock_alert_threshold: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'var-4',
    product_id: 'prod-3',
    name: 'Vis 4x40mm',
    sku: 'VIS-4X40',
    unit_type: 'piece',
    conversion_ratio: 100, // Boîte de 100
    purchase_price: 8000,
    manager_sale_price: 12000,
    stock_quantity: 50,
    stock_alert_threshold: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Construction Rakoto',
    email: 'rakoto@construction.mg',
    phone: '+261 34 12 345 67',
    address: 'Lot II M 45 Bis',
    city: 'Antananarivo',
    postal_code: '101',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'client-2',
    name: 'Électricité Rabe',
    email: 'rabe@elec.mg',
    phone: '+261 33 98 765 43',
    address: 'Route Digue',
    city: 'Antananarivo',
    postal_code: '101',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'client-3',
    name: 'Quincaillerie Mamitiana',
    email: 'contact@mamitiana.mg',
    phone: '+261 32 11 222 33',
    address: 'Analakely',
    city: 'Antananarivo',
    postal_code: '101',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Mock Invoices
export const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoice_number: 'FAC-2025-0001',
    invoice_type: 'invoice',
    status: 'validated',
    created_by: '3',
    validated_by: '2',
    client_id: 'client-1',
    invoice_date: new Date().toISOString(),
    subtotal: 400000,
    discount_amount: 0,
    delivery_fee: 20000,
    tax_amount: 0,
    total_amount: 420000,
    margin_amount: 100000,
    margin_percentage: 25,
    seller_reference: 'USR-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    validated_at: new Date().toISOString(),
  },
  {
    id: 'inv-2',
    invoice_number: null,
    invoice_type: 'quote',
    status: 'pending_validation',
    created_by: '3',
    client_id: 'client-2',
    invoice_date: new Date().toISOString(),
    subtotal: 320000,
    discount_amount: 20000,
    delivery_fee: 15000,
    tax_amount: 0,
    total_amount: 315000,
    margin_amount: 70000,
    margin_percentage: 22,
    seller_reference: 'USR-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'inv-3',
    invoice_number: null,
    invoice_type: 'invoice',
    status: 'draft',
    created_by: '3',
    client_id: 'client-3',
    invoice_date: new Date().toISOString(),
    subtotal: 120000,
    discount_amount: 0,
    delivery_fee: 10000,
    tax_amount: 0,
    total_amount: 130000,
    margin_amount: 40000,
    margin_percentage: 33,
    seller_reference: 'USR-001',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockInvoiceItems: InvoiceItem[] = [
  {
    id: 'item-1',
    invoice_id: 'inv-1',
    product_variant_id: 'var-1',
    product_name: 'Câble Électrique',
    variant_name: 'Câble 2.5mm²',
    quantity: 200,
    unit_type: 'meter',
    unit_price: 2000,
    discount_percentage: 0,
    discount_amount: 0,
    subtotal: 400000,
  },
  {
    id: 'item-2',
    invoice_id: 'inv-2',
    product_variant_id: 'var-2',
    product_name: 'Câble Électrique',
    variant_name: 'Câble 4mm²',
    quantity: 100,
    unit_type: 'meter',
    unit_price: 3200,
    discount_percentage: 0,
    discount_amount: 0,
    subtotal: 320000,
  },
  {
    id: 'item-3',
    invoice_id: 'inv-3',
    product_variant_id: 'var-3',
    product_name: 'Ciment',
    variant_name: 'Ciment 50kg',
    quantity: 3,
    unit_type: 'sachet',
    unit_price: 40000,
    discount_percentage: 0,
    discount_amount: 0,
    subtotal: 120000,
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    user_id: '2',
    type: 'invoice_created',
    title: 'Nouvelle facture',
    message: 'John Doe a créé un devis en attente de validation',
    is_read: false,
    action_url: '/invoices/inv-2',
    created_at: new Date().toISOString(),
  },
  {
    id: 'notif-2',
    user_id: '2',
    type: 'stock_low',
    title: 'Stock faible',
    message: 'Le stock de Vis 4x40mm est en dessous du seuil',
    is_read: false,
    action_url: '/products/prod-3',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'notif-3',
    user_id: '3',
    type: 'invoice_validated',
    title: 'Facture validée',
    message: 'Votre facture FAC-2025-0001 a été validée',
    is_read: true,
    action_url: '/invoices/inv-1',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    read_at: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Mock Activity Logs
export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'log-1',
    user_id: '3',
    activity_type: 'invoice_created',
    entity_type: 'invoice',
    entity_id: 'inv-2',
    description: 'Création du devis DEV-2025-0002',
    created_at: new Date().toISOString(),
  },
  {
    id: 'log-2',
    user_id: '2',
    activity_type: 'invoice_validated',
    entity_type: 'invoice',
    entity_id: 'inv-1',
    description: 'Validation de la facture FAC-2025-0001',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'log-3',
    user_id: '3',
    activity_type: 'product_updated',
    entity_type: 'product',
    entity_id: 'prod-1',
    description: 'Mise à jour du stock de Câble Électrique',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Mock Dashboard KPIs
export const mockDashboardKPIs: DashboardKPIs = {
  total_revenue: 1580000,
  total_margin: 380000,
  pending_invoices: 3,
  low_stock_products: 1,
  critical_stock_products: 0,
  invoices_today: 2,
  revenue_today: 420000,
  active_users: 5,
};

export const mockUserDashboardKPIs: UserDashboardKPIs = {
  invoices_today: 1,
  revenue_today: 420000,
  margin_today: 100000,
  invoices_this_month: 12,
  revenue_this_month: 3200000,
  margin_this_month: 780000,
  pending_invoices: 1,
  low_stock_count: 1,
};

// Helper to simulate async operations
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  // Auth
  login: async (email: string, password: string) => {
    await delay(800);
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password') {
      throw new Error('Invalid credentials');
    }
    return { user, session: { access_token: 'mock-token' } };
  },

  // Users
  getUser: async (id: string) => {
    await delay(300);
    return mockUsers.find(u => u.id === id) || null;
  },

  // Products
  getProducts: async () => {
    await delay(500);
    return mockProducts.map(p => ({
      ...p,
      variants: mockProductVariants.filter(v => v.product_id === p.id),
    }));
  },

  getProduct: async (id: string) => {
    await delay(300);
    const product = mockProducts.find(p => p.id === id);
    if (!product) return null;
    return {
      ...product,
      variants: mockProductVariants.filter(v => v.product_id === id),
    };
  },

  // Clients
  getClients: async () => {
    await delay(400);
    return mockClients;
  },

  // Invoices
  getInvoices: async () => {
    await delay(600);
    return mockInvoices.map(inv => ({
      ...inv,
      items: mockInvoiceItems.filter(item => item.invoice_id === inv.id),
      client: mockClients.find(c => c.id === inv.client_id),
      created_by_user: mockUsers.find(u => u.id === inv.created_by),
      validated_by_user: inv.validated_by
        ? mockUsers.find(u => u.id === inv.validated_by)
        : undefined,
    }));
  },

  getInvoice: async (id: string) => {
    await delay(300);
    const invoice = mockInvoices.find(inv => inv.id === id);
    if (!invoice) return null;
    return {
      ...invoice,
      items: mockInvoiceItems.filter(item => item.invoice_id === id),
      client: mockClients.find(c => c.id === invoice.client_id),
      created_by_user: mockUsers.find(u => u.id === invoice.created_by),
      validated_by_user: invoice.validated_by
        ? mockUsers.find(u => u.id === invoice.validated_by)
        : undefined,
    };
  },

  // Notifications
  getNotifications: async (userId: string) => {
    await delay(300);
    return mockNotifications.filter(n => n.user_id === userId);
  },

  // Activity Logs
  getActivityLogs: async () => {
    await delay(400);
    return mockActivityLogs.map(log => ({
      ...log,
      user: mockUsers.find(u => u.id === log.user_id),
    }));
  },

  // Dashboard
  getDashboardKPIs: async () => {
    await delay(500);
    return mockDashboardKPIs;
  },

  getUserDashboardKPIs: async (userId: string) => {
    await delay(500);
    return mockUserDashboardKPIs;
  },
};
