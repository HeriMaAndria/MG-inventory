/**
 * SERVICE INVOICE - MARGE AUTO
 */

import type { Invoice, InvoiceItem } from '@/lib/types/invoice'
import { calculateInvoiceItem, calculateInvoiceTotals } from '@/lib/types/invoice'
import { getCurrentUser } from '@/lib/auth/mockAuth'

const STORAGE_KEY = 'mg_invoices'
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const MOCK_INVOICES: Invoice[] = []

const loadInvoices = (): Invoice[] => {
  if (typeof window === 'undefined') return MOCK_INVOICES
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_INVOICES))
    return MOCK_INVOICES
  }
  try {
    return JSON.parse(stored)
  } catch {
    return MOCK_INVOICES
  }
}

const saveInvoices = (invoices: Invoice[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
}

export const invoiceService = {
  async createDevis(data: {
    client_id: string | null
    client_name: string | null
    items: Omit<InvoiceItem, 'total_catalogue' | 'total_vente' | 'marge_unitaire' | 'marge_total'>[]
    notes?: string
    revendeur_info: {
      name: string
      email: string
      phone: string
      address: string
    }
  }): Promise<{ data: Invoice | null; error: string | null }> {
    await delay(300)
    try {
      const user = getCurrentUser()
      if (!user) return { data: null, error: 'Non authentifié' }

      const calculatedItems = data.items.map(calculateInvoiceItem)
      const totals = calculateInvoiceTotals(calculatedItems)
      
      const invoice: Invoice = {
        id: `devis-${Date.now()}`,
        reference: `${user.name.substring(0, 3).toUpperCase()}-DEVIS-${String(Date.now()).slice(-6)}`,
        type: 'devis',
        status: 'en_attente',
        revendeur_id: user.id,
        revendeur_name: user.name,
        client_id: data.client_id,
        client_name: data.client_name,
        items: calculatedItems,
        ...totals,
        revendeur_info: data.revendeur_info,
        created_at: new Date().toISOString(),
        notes: data.notes,
      }

      const invoices = loadInvoices()
      invoices.push(invoice)
      saveInvoices(invoices)

      return { data: invoice, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async convertDevisToFacture(
    devisId: string,
    type: 'facture' | 'proforma' | 'bon_commande'
  ): Promise<{ data: Invoice | null; error: string | null }> {
    await delay(300)
    try {
      const invoices = loadInvoices()
      const devis = invoices.find(i => i.id === devisId)
      
      if (!devis) return { data: null, error: 'Devis non trouvé' }
      if (devis.type !== 'devis') return { data: null, error: 'Pas un devis' }

      const facture: Invoice = {
        ...devis,
        id: `fact-${Date.now()}`,
        reference: `FACT-${String(Date.now()).slice(-6)}`,
        type: type,
        status: 'validée',
        revendeur_info: undefined,
        origine_devis_ref: devis.reference,
        validated_at: new Date().toISOString(),
      }

      invoices.push(facture)
      devis.status = 'validée'
      saveInvoices(invoices)

      return { data: facture, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async getAll(): Promise<{ data: Invoice[] | null; error: string | null }> {
    await delay(200)
    try {
      return { data: loadInvoices(), error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async getById(id: string): Promise<{ data: Invoice | null; error: string | null }> {
    await delay(200)
    try {
      const invoice = loadInvoices().find(i => i.id === id)
      return { data: invoice || null, error: invoice ? null : 'Non trouvé' }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async validate(id: string): Promise<{ data: Invoice | null; error: string | null }> {
    await delay(300)
    try {
      const invoices = loadInvoices()
      const invoice = invoices.find(i => i.id === id)
      if (!invoice) return { data: null, error: 'Non trouvé' }
      
      invoice.status = 'validée'
      invoice.validated_at = new Date().toISOString()
      saveInvoices(invoices)
      
      return { data: invoice, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async markAsPaid(id: string): Promise<{ data: Invoice | null; error: string | null }> {
    await delay(300)
    try {
      const invoices = loadInvoices()
      const invoice = invoices.find(i => i.id === id)
      if (!invoice) return { data: null, error: 'Non trouvé' }
      
      invoice.status = 'payée'
      invoice.paid_at = new Date().toISOString()
      saveInvoices(invoices)
      
      return { data: invoice, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },
}
