/**
 * TYPES TYPESCRIPT - PRODUITS
 * 
 * Définit la structure des données produits
 */

export type ProductCategory = 'tôles' | 'accessoires' | 'panne C' | 'autres'

export interface Product {
  id: string
  reference: string | null
  name: string
  description: string | null
  couleur: string | null
  category: ProductCategory
  unit: string // Unité de mesure (m², kg, pièce, sac, etc.)
  price: number
  quantity: number
  purchase_date: string | null // Format: YYYY-MM-DD
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
  couleur?: string
}
