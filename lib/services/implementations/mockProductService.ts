/**
 * MOCK PRODUCT SERVICE
 * 
 * Implémentation en localStorage qui respecte le contrat IProductService
 * Simule un backend réel avec délais réseau
 */

import type { IProductService } from '../contracts'
import type {
  Product,
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  ApiResponse,
} from '@/lib/types/models'

// Données de test
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    reference: 'TOL-001',
    name: 'Tôle ondulée 2m',
    description: 'Tôle galvanisée ondulée résistante',
    couleur: 'Gris',
    category: 'tôles',
    unit: 'm²',
    price: 15000,
    quantity: 50,
    purchase_date: '2025-01-15',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    reference: 'ACC-002',
    name: 'Vis autoperceuse 5mm',
    description: 'Boîte de 100 vis galvanisées',
    couleur: null,
    category: 'accessoires',
    unit: 'boîte',
    price: 2500,
    quantity: 200,
    purchase_date: '2025-01-20',
    created_at: '2025-01-20T10:00:00Z',
    updated_at: '2025-01-20T10:00:00Z',
  },
  {
    id: '3',
    reference: 'PAN-003',
    name: 'Panne C 80x40',
    description: 'Panne en acier galvanisé 3m',
    couleur: 'Noir',
    category: 'panne C',
    unit: 'pièce',
    price: 8000,
    quantity: 30,
    purchase_date: '2025-02-01',
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-01T10:00:00Z',
  },
  {
    id: '4',
    reference: null,
    name: 'Équerre de fixation',
    description: 'Lot de 10 équerres galvanisées',
    couleur: null,
    category: 'accessoires',
    unit: 'lot',
    price: 1500,
    quantity: 5, // Stock faible
    purchase_date: '2025-02-05',
    created_at: '2025-02-05T10:00:00Z',
    updated_at: '2025-02-05T10:00:00Z',
  },
]

const STORAGE_KEY = 'mg_products'

// Helpers
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const loadProducts = (): Product[] => {
  if (typeof window === 'undefined') return MOCK_PRODUCTS
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_PRODUCTS))
    return MOCK_PRODUCTS
  }
  
  try {
    return JSON.parse(stored)
  } catch {
    return MOCK_PRODUCTS
  }
}

const saveProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products))
}

// Service implémentation
export const mockProductService: IProductService = {
  async getAll(filters?: ProductFilters): Promise<ApiResponse<Product[]>> {
    await delay(300) // Simule latence réseau
    
    try {
      let products = loadProducts()
      
      // Applique les filtres
      if (filters?.search) {
        const search = filters.search.toLowerCase()
        products = products.filter(p =>
          p.name.toLowerCase().includes(search) ||
          p.reference?.toLowerCase().includes(search)
        )
      }
      
      if (filters?.category) {
        products = products.filter(p => p.category === filters.category)
      }
      
      if (filters?.couleur) {
        products = products.filter(p => p.couleur === filters.couleur)
      }
      
      if (filters?.minQuantity !== undefined) {
        products = products.filter(p => p.quantity >= filters.minQuantity!)
      }
      
      if (filters?.maxQuantity !== undefined) {
        products = products.filter(p => p.quantity <= filters.maxQuantity!)
      }
      
      return { data: products, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async getById(id: string): Promise<ApiResponse<Product>> {
    await delay(200)
    
    try {
      const products = loadProducts()
      const product = products.find(p => p.id === id)
      
      if (!product) {
        return { data: null, error: 'Produit non trouvé' }
      }
      
      return { data: product, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async create(data: CreateProductInput): Promise<ApiResponse<Product>> {
    await delay(400)
    
    try {
      const products = loadProducts()
      
      const newProduct: Product = {
        id: Date.now().toString(),
        reference: data.reference || null,
        name: data.name,
        description: data.description || null,
        couleur: data.couleur || null,
        category: data.category,
        unit: data.unit,
        price: data.price,
        quantity: data.quantity,
        purchase_date: data.purchase_date || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      products.push(newProduct)
      saveProducts(products)
      
      return { data: newProduct, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async update(data: UpdateProductInput): Promise<ApiResponse<Product>> {
    await delay(400)
    
    try {
      const products = loadProducts()
      const index = products.findIndex(p => p.id === data.id)
      
      if (index === -1) {
        return { data: null, error: 'Produit non trouvé' }
      }
      
      const updated: Product = {
        ...products[index],
        ...data,
        updated_at: new Date().toISOString(),
      }
      
      products[index] = updated
      saveProducts(products)
      
      return { data: updated, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300)
    
    try {
      const products = loadProducts()
      const filtered = products.filter(p => p.id !== id)
      
      if (filtered.length === products.length) {
        return { data: null, error: 'Produit non trouvé' }
      }
      
      saveProducts(filtered)
      return { data: undefined, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async updateQuantity(id: string, quantityChange: number): Promise<ApiResponse<Product>> {
    await delay(300)
    
    try {
      const products = loadProducts()
      const product = products.find(p => p.id === id)
      
      if (!product) {
        return { data: null, error: 'Produit non trouvé' }
      }
      
      const newQuantity = product.quantity + quantityChange
      
      if (newQuantity < 0) {
        return { data: null, error: 'Quantité insuffisante en stock' }
      }
      
      product.quantity = newQuantity
      product.updated_at = new Date().toISOString()
      
      saveProducts(products)
      
      return { data: product, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },
}
