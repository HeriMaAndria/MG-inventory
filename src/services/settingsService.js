import { supabase, getCurrentUser } from './supabase'

export const SettingsService = {
  /**
   * Récupère les paramètres de l'utilisateur
   */
  async getUserSettings() {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Pas de paramètre, créer les defaults
        return this.createUserSettings({})
      }
      throw error
    }

    return data
  },

  /**
   * Crée les paramètres utilisateur
   */
  async createUserSettings(settingsData = {}) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('user_settings')
      .insert({
        user_id: user.id,
        company_name: settingsData.company_name || '',
        company_activity: settingsData.company_activity || '',
        company_address: settingsData.company_address || '',
        company_stat: settingsData.company_stat || '',
        company_nif: settingsData.company_nif || '',
        company_phone: settingsData.company_phone || ''
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Met à jour les paramètres utilisateur
   */
  async updateUserSettings(updates) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('user_settings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupère les paramètres du profil
   */
  async getProfileSettings() {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error
    return data
  },

  /**
   * Met à jour les paramètres du profil
   */
  async updateProfileSettings(updates) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
