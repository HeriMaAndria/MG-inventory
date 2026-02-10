import { supabase, getCurrentUser } from './supabase'

export const ClientService = {
  /**
   * Récupère tous les clients de l'utilisateur
   */
  async getClients() {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('name')

    if (error) throw error
    return data
  },

  /**
   * Récupère un client spécifique
   */
  async getClient(clientId) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Ajoute un nouveau client
   */
  async addClient(clientData) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        name: clientData.name,
        phone: clientData.phone || '',
        address: clientData.address || '',
        total_purchases: 0,
        last_purchase_date: null
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Met à jour un client
   */
  async updateClient(clientId, updates) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('clients')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', clientId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Supprime un client
   */
  async deleteClient(clientId) {
    const user = await getCurrentUser()

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId)
      .eq('user_id', user.id)

    if (error) throw error
  },

  /**
   * Crée ou met à jour un client via facture
   */
  async createOrUpdateFromInvoice(clientData) {
    const user = await getCurrentUser()

    // Chercher un client existant avec le même nom
    const { data: existing } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .ilike('name', clientData.name)
      .single()

    if (existing) {
      // Mettre à jour
      return this.updateClient(existing.id, {
        phone: clientData.phone || existing.phone,
        address: clientData.address || existing.address,
        last_purchase_date: new Date().toISOString(),
        total_purchases: (existing.total_purchases || 0) + 1
      })
    } else {
      // Créer nouveau
      return this.addClient({
        name: clientData.name,
        phone: clientData.phone || '',
        address: clientData.address || ''
      })
    }
  },

  /**
   * Récupère les clients les plus actifs
   */
  async getTopClients(limit = 10) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .order('total_purchases', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data
  },

  /**
   * Recherche des clients
   */
  async searchClients(searchTerm) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('user_id', user.id)
      .or(`name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,address.ilike.%${searchTerm}%`)
      .order('name')

    if (error) throw error
    return data
  }
}
