import { supabase } from './supabase'

export const InvoiceService = {
  async createInvoice(invoiceData) {
    const { data, error } = await supabase
      .from('invoices')
      .insert([invoiceData])
      .select()
    if (error) throw error
    return data[0]
  },

  async getMyInvoices(userId) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
    if (error) throw error
    return data
  },

  async getInvoice(id) {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  },

  async updateInvoice(id, updates) {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
    if (error) throw error
    return data[0]
  },

  async deleteInvoice(id) {
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  async submitForValidation(id) {
    return this.updateInvoice(id, { status: 'pending', submittedAt: new Date().toISOString() })
  },

  async confirmInvoice(id, officialNumber) {
    return this.updateInvoice(id, { 
      status: 'confirmed', 
      officialNumber,
      confirmedAt: new Date().toISOString()
    })
  }
}
