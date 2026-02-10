import { supabase, getCurrentUser } from './supabase'

export const StockService = {
  /**
   * Récupère tout le stock de l'utilisateur
   */
  async getStock() {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('stock')
      .select('*')
      .eq('user_id', user.id)
      .order('category')
      .order('name')

    if (error) throw error
    return data
  },

  /**
   * Récupère un article spécifique
   */
  async getStockItem(itemId) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('stock')
      .select('*')
      .eq('id', itemId)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Ajoute un nouvel article
   */
  async addStockItem(itemData) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('stock')
      .insert({
        user_id: user.id,
        category: itemData.category || 'Sans catégorie',
        name: itemData.name,
        reference: itemData.reference || '',
        purchase_price: itemData.purchase_price || 0,
        purchase_unit: itemData.purchase_unit || 'pièce',
        unit_price: itemData.unit_price || 0,
        quantity_available: itemData.quantity_available || 0,
        min_quantity: itemData.min_quantity || 0,
        notes: itemData.notes || ''
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Met à jour un article
   */
  async updateStockItem(itemId, updates) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('stock')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Supprime un article
   */
  async deleteStockItem(itemId) {
    const user = await getCurrentUser()

    const { error } = await supabase
      .from('stock')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id)

    if (error) throw error
  },

  /**
   * Augmente la quantité disponible
   */
  async addQuantity(itemId, quantityToAdd) {
    const item = await this.getStockItem(itemId)
    const newQuantity = item.quantity_available + quantityToAdd

    return this.updateStockItem(itemId, {
      quantity_available: newQuantity
    })
  },

  /**
   * Décrémente la quantité disponible
   */
  async removeQuantity(itemId, quantityToRemove) {
    const item = await this.getStockItem(itemId)
    const newQuantity = Math.max(0, item.quantity_available - quantityToRemove)

    return this.updateStockItem(itemId, {
      quantity_available: newQuantity
    })
  },

  /**
   * Obtient les articles à faible stock
   */
  async getLowStockItems() {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('stock')
      .select('*')
      .eq('user_id', user.id)
      .or(`quantity_available.lte.min_quantity,min_quantity.is.null`)
      .order('name')

    if (error) throw error
    return data
  },

  /**
   * Recherche des articles
   */
  async searchStock(searchTerm) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('stock')
      .select('*')
      .eq('user_id', user.id)
      .or(`name.ilike.%${searchTerm}%,reference.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
      .order('name')

    if (error) throw error
    return data
  }
}
