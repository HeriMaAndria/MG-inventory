'use server'

/**
 * SERVER ACTIONS - GESTION DES PRODUITS
 */

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Product, CreateProductInput, UpdateProductInput, ProductFilters } from '@/lib/types/product'

/**
 * Récupère tous les produits avec filtres optionnels
 */
export async function getProducts(filters?: ProductFilters): Promise<{ data: Product[] | null; error: string | null }> {
  try {
    const supabase = await createClient()

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    // Filtre par recherche (nom ou référence)
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,reference.ilike.%${filters.search}%`)
    }

    // Filtre par catégorie
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    // Filtre par couleur
    if (filters?.couleur) {
      query = query.eq('couleur', filters.couleur)
    }

    const { data, error } = await query

    if (error) {
      console.error('Erreur récupération produits:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err: any) {
    console.error('Erreur getProducts:', err)
    return { data: null, error: err.message }
  }
}

/**
 * Récupère un produit par son ID
 */
export async function getProductById(id: string): Promise<{ data: Product | null; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erreur récupération produit:', error)
      return { data: null, error: error.message }
    }

    return { data, error: null }
  } catch (err: any) {
    console.error('Erreur getProductById:', err)
    return { data: null, error: err.message }
  }
}

/**
 * Crée un nouveau produit
 */
export async function createProduct(input: CreateProductInput): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('products')
      .insert([input])

    if (error) {
      console.error('Erreur création produit:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/gerant/stock')

    return { success: true, error: null }
  } catch (err: any) {
    console.error('Erreur createProduct:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Met à jour un produit existant
 */
export async function updateProduct(input: UpdateProductInput): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { id, ...updateData } = input

    const { error } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', id)

    if (error) {
      console.error('Erreur mise à jour produit:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/gerant/stock')

    return { success: true, error: null }
  } catch (err: any) {
    console.error('Erreur updateProduct:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Supprime un produit
 */
export async function deleteProduct(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erreur suppression produit:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/gerant/stock')

    return { success: true, error: null }
  } catch (err: any) {
    console.error('Erreur deleteProduct:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Met à jour la quantité d'un produit
 */
export async function updateProductQuantity(
  id: string,
  quantityChange: number
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = await createClient()

    const { data: product, error: fetchError } = await supabase
      .from('products')
      .select('quantity')
      .eq('id', id)
      .single()

    if (fetchError || !product) {
      return { success: false, error: 'Produit non trouvé' }
    }

    const newQuantity = product.quantity + quantityChange

    if (newQuantity < 0) {
      return { success: false, error: 'Quantité insuffisante en stock' }
    }

    const { error } = await supabase
      .from('products')
      .update({ quantity: newQuantity })
      .eq('id', id)

    if (error) {
      console.error('Erreur mise à jour quantité:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/gerant/stock')

    return { success: true, error: null }
  } catch (err: any) {
    console.error('Erreur updateProductQuantity:', err)
    return { success: false, error: err.message }
  }
}
