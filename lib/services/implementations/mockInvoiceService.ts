/**
 * SERVICE INVOICE MIS À JOUR
 * Avec calcul automatique des marges
 */

import type { Invoice, InvoiceItem, InvoiceType, InvoiceStatus } from '@/lib/types/invoice'
import { calculateInvoiceItem, calculateInvoiceTotals } from '@/lib/types/invoice'
import { getCurrentUser } from '@/lib/auth/mockAuth'

const STORAGE_KEY = 'mg_invoices'
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock data initial
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
  // Créer devis (revendeur)
  async createDevis(data: {
    client_id: string
    client_name: string
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
      if (!user) {
        return { data: null, error: 'Non authentifié' }
      }

      // Calculer items avec marges
      const calculatedItems = data.items.map(calculateInvoiceItem)
      
      // Calculer totaux
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

  // Convertir devis → facture (gérant)
  async convertDevisToFacture(
    devisId: string,
    type: 'facture' | 'proforma' | 'bon_commande'
  ): Promise<{ data: Invoice | null; error: string | null }> {
    await delay(300)
    try {
      const invoices = loadInvoices()
      const devis = invoices.find(i => i.id === devisId)
      
      if (!devis) {
        return { data: null, error: 'Devis non trouvé' }
      }

      if (devis.type !== 'devis') {
        return { data: null, error: 'Ce document n\'est pas un devis' }
      }

      // Créer facture en gardant les mêmes items (marge déjà calculée)
      const facture: Invoice = {
        ...devis,
        id: `fact-${Date.now()}`,
        reference: `FACT-${String(Date.now()).slice(-6)}`,
        type: type,
        status: 'validée',
        revendeur_info: undefined, // Retirer infos revendeur
        origine_devis_ref: devis.reference,
        validated_at: new Date().toISOString(),
      }

      invoices.push(facture)
      
      // Marquer le devis comme converti (optionnel)
      devis.status = 'validée'
      devis.notes = (devis.notes || '') + `\n[Converti en ${type} ${facture.reference}]`
      
      saveInvoices(invoices)

      return { data: facture, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  // Lire tous
  async getAll(): Promise<{ data: Invoice[] | null; error: string | null }> {
    await delay(200)
    try {
      const invoices = loadInvoices()
      return { data: invoices, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  // Lire par ID
  async getById(id: string): Promise<{ data: Invoice | null; error: string | null }> {
    await delay(200)
    try {
      const invoices = loadInvoices()
      const invoice = invoices.find(i => i.id === id)
      if (!invoice) {
        return { data: null, error: 'Document non trouvé' }
      }
      return { data: invoice, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  // Mettre à jour
  async update(id: string, data: Partial<Invoice>): Promise<{ data: Invoice | null; error: string | null }> {
    await delay(300)
    try {
      const invoices = loadInvoices()
      const index = invoices.findIndex(i => i.id === id)
      
      if (index === -1) {
        return { data: null, error: 'Document non trouvé' }
      }

      // Si les items changent, recalculer
      if (data.items) {
        const calculatedItems = data.items.map(calculateInvoiceItem)
        const totals = calculateInvoiceTotals(calculatedItems)
        
        invoices[index] = {
          ...invoices[index],
          ...data,
          items: calculatedItems,
          ...totals,
        }
      } else {
        invoices[index] = {
          ...invoices[index],
          ...data,
        }
      }

      saveInvoices(invoices)
      return { data: invoices[index], error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  // Valider
  async validate(id: string): Promise<{ data: Invoice | null; error: string | null }> {
    return this.update(id, {
      status: 'validée',
      validated_at: new Date().toISOString(),
    })
  },

  // Marquer comme payée
  async markAsPaid(id: string): Promise<{ data: Invoice | null; error: string | null }> {
    return this.update(id, {
      status: 'payée',
      paid_at: new Date().toISOString(),
    })
  },

  // Supprimer
  async delete(id: string): Promise<{ data: boolean; error: string | null }> {
    await delay(300)
    try {
      const invoices = loadInvoices()
      const filtered = invoices.filter(i => i.id !== id)
      saveInvoices(filtered)
      return { data: true, error: null }
    } catch (err: any) {
      return { data: false, error: err.message }
    }
  },
}
