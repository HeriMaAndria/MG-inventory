import { supabase, getCurrentUser } from './supabase'

/**
 * Service pour gérer les factures
 * Différencie les actions revendeur vs admin
 */
export const InvoiceService = {
  /**
   * Crée une facture en brouillon (Revendeur)
   */
  async createDraft(invoiceData) {
    const user = await getCurrentUser()

    // Générer le numéro de brouillon
    const draftNumber = await this.generateDraftNumber(user.id)

    const { data, error } = await supabase
      .from('invoices')
      .insert({
        user_id: user.id,
        draft_number: draftNumber,
        type: invoiceData.type || 'commande',
        status: 'draft',
        date: invoiceData.date || new Date().toISOString().split('T')[0],
        client_data: invoiceData.client_data,
        items: invoiceData.items || [],
        total: invoiceData.total || 0,
        notes: invoiceData.notes || '',
        submitted_for_validation: false,
        is_frozen: false
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Met à jour une facture brouillon (Revendeur)
   */
  async updateDraft(invoiceId, updates) {
    const user = await getCurrentUser()

    // Vérifier que c'est bien une facture de l'utilisateur
    const { data: invoice, error: checkError } = await supabase
      .from('invoices')
      .select('status, is_frozen')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .single()

    if (checkError) throw new Error('Facture non trouvée')
    if (invoice.status !== 'draft') throw new Error('Seules les factures en brouillon peuvent être modifiées')
    if (invoice.is_frozen) throw new Error('Cette facture est verrouillée')

    const { data, error } = await supabase
      .from('invoices')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Supprime une facture brouillon (Revendeur)
   */
  async deleteDraft(invoiceId) {
    const user = await getCurrentUser()

    const { error: checkError } = await supabase
      .from('invoices')
      .select('id')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .single()

    if (checkError) throw new Error('Impossible de supprimer cette facture')

    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', invoiceId)

    if (error) throw error
  },

  /**
   * Soumet une facture pour validation (Revendeur)
   */
  async submitForValidation(invoiceId) {
    const user = await getCurrentUser()

    // Vérifier que c'est une facture de l'utilisateur en brouillon
    const { error: checkError } = await supabase
      .from('invoices')
      .select('id')
      .eq('id', invoiceId)
      .eq('user_id', user.id)
      .eq('status', 'draft')
      .single()

    if (checkError) throw new Error('Facture introuvable ou déjà soumise')

    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: 'pending',
        submitted_for_validation: true,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupère les factures de l'utilisateur (Revendeur)
   */
  async getMyInvoices(filter = 'all') {
    const user = await getCurrentUser()

    let query = supabase
      .from('invoices')
      .select('*')
      .eq('user_id', user.id)

    if (filter === 'drafts') {
      query = query.eq('status', 'draft')
    } else if (filter === 'pending') {
      query = query.eq('status', 'pending')
    } else if (filter === 'confirmed') {
      query = query.in('status', ['confirmed', 'sent', 'paid', 'delivered', 'returned'])
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Récupère une facture spécifique (vérification d'accès)
   */
  async getInvoice(invoiceId) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        user:profiles(id, company_name, responsible_number)
      `)
      .eq('id', invoiceId)
      .single()

    if (error) throw error

    // Vérifier l'accès (propriétaire ou admin)
    if (data.user_id !== user.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role !== 'admin') {
        throw new Error('Accès refusé')
      }
    }

    return data
  },

  // ============ FONCTIONS ADMIN ============

  /**
   * Récupère les factures en attente de validation (Admin)
   */
  async getPendingInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        user:profiles(id, company_name, responsible_number, phone)
      `)
      .eq('status', 'pending')
      .order('submitted_at', { ascending: true })

    if (error) throw error
    return data
  },

  /**
   * Récupère toutes les factures (Admin)
   */
  async getAllInvoices(filter = 'all') {
    let query = supabase
      .from('invoices')
      .select(`
        *,
        user:profiles(id, company_name)
      `)

    if (filter === 'pending') {
      query = query.eq('status', 'pending')
    } else if (filter === 'confirmed') {
      query = query.eq('status', 'confirmed')
    }

    const { data, error } = await query
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  /**
   * Confirme une facture (Admin)
   */
  async confirmInvoice(invoiceId, comment = '') {
    const user = await getCurrentUser()
    const officialNumber = await this.getNextOfficialNumber()

    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: 'confirmed',
        official_number: officialNumber,
        confirmed_at: new Date().toISOString(),
        confirmed_by: user.id,
        is_frozen: true,
        validation_comment: comment,
        updated_at: new Date().toISOString()
      })
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) throw error

    // Enregistrer dans l'historique
    await supabase.from('invoice_history').insert({
      invoice_id: invoiceId,
      changed_by: user.id,
      old_status: 'pending',
      new_status: 'confirmed',
      comment: comment
    })

    return data
  },

  /**
   * Refuse une facture (Admin)
   */
  async rejectInvoice(invoiceId, reason) {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: 'draft',
        submitted_for_validation: false,
        validation_comment: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) throw error

    // Enregistrer dans l'historique
    await supabase.from('invoice_history').insert({
      invoice_id: invoiceId,
      changed_by: user.id,
      old_status: 'pending',
      new_status: 'draft',
      comment: reason
    })

    return data
  },

  /**
   * Change le statut d'une facture (Admin)
   */
  async updateInvoiceStatus(invoiceId, newStatus, comment = '') {
    const user = await getCurrentUser()

    const { data: invoice } = await supabase
      .from('invoices')
      .select('status')
      .eq('id', invoiceId)
      .single()

    const { data, error } = await supabase
      .from('invoices')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', invoiceId)
      .select()
      .single()

    if (error) throw error

    // Enregistrer dans l'historique
    await supabase.from('invoice_history').insert({
      invoice_id: invoiceId,
      changed_by: user.id,
      old_status: invoice.status,
      new_status: newStatus,
      comment: comment
    })

    return data
  },

  /**
   * Récupère l'historique des changements de statut
   */
  async getInvoiceHistory(invoiceId) {
    const { data, error } = await supabase
      .from('invoice_history')
      .select(`
        *,
        changed_by_user:profiles(company_name)
      `)
      .eq('invoice_id', invoiceId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  },

  // ============ UTILITAIRES ============

  /**
   * Génère le prochain numéro de facture officiel
   */
  async getNextOfficialNumber() {
    const { data, error } = await supabase.rpc('get_next_invoice_number')
    if (error) throw error
    return data
  },

  /**
   * Génère un numéro de brouillon local
   */
  async generateDraftNumber(userId) {
    const year = new Date().getFullYear()
    
    // Récupérer le nombre de factures brouillon cette année pour cet utilisateur
    const { data, error } = await supabase
      .from('invoices')
      .select('id', { count: 'exact' })
      .eq('user_id', userId)
      .like('draft_number', `BRO-${year}-%`)

    if (error) throw error
    const count = data?.length || 0
    const number = String(count + 1).padStart(3, '0')
    const shortUserId = userId.substring(0, 8)

    return `BRO-${shortUserId}-${year}-${number}`
  },

  /**
   * Exporte les données pour téléchargement
   */
  async exportInvoiceAsPDF(invoiceId) {
    const invoice = await this.getInvoice(invoiceId)
    // La logique de génération PDF sera dans le composant
    return invoice
  },

  /**
   * Statistiques pour le dashboard
   */
  async getDashboardStats() {
    const user = await getCurrentUser()
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    // Total du mois
    const { data: monthInvoices } = await supabase
      .from('invoices')
      .select('total')
      .eq('user_id', user.id)
      .eq('status', 'confirmed')
      .gte('date', `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`)

    const monthTotal = monthInvoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0

    // Nombre de factures confirmées
    const { data: allInvoices, count: totalConfirmed } = await supabase
      .from('invoices')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('status', 'confirmed')

    // Nombre de brouillons
    const { count: totalDrafts } = await supabase
      .from('invoices')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .eq('status', 'draft')

    return {
      monthTotal,
      totalConfirmed: totalConfirmed || 0,
      totalDrafts: totalDrafts || 0
    }
  }
}
