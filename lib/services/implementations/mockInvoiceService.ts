/**
 * MOCK INVOICE SERVICE
 * Gestion des factures/devis
 */

import type { IInvoiceService } from '../contracts'
import type {
  Invoice,
  CreateInvoiceInput,
  UpdateInvoiceInput,
  InvoiceFilters,
  ApiResponse,
  InvoiceItem,
} from '@/lib/types/models'

const MOCK_INVOICES: Invoice[] = [
  {
    id: '1',
    reference: 'DEV-001',
    revendeur_id: 'revendeur-1',
    revendeur_name: 'Revendeur Test',
    client_id: '1',
    client_name: 'Client A - Construction',
    items: [
      {
        product_id: '1',
        product_name: 'Tôle ondulée 2m',
        quantity: 10,
        unit_price: 15000,
        total: 150000,
      },
      {
        product_id: '2',
        product_name: 'Vis autoperceuse 5mm',
        quantity: 5,
        unit_price: 2500,
        total: 12500,
      },
    ],
    subtotal: 162500,
    marge_percentage: 15,
    marge_amount: 24375,
    total: 186875,
    status: 'en_attente',
    notes: null,
    created_at: '2025-02-10T10:00:00Z',
    updated_at: '2025-02-10T10:00:00Z',
    validated_at: null,
    paid_at: null,
  },
  {
    id: '2',
    reference: 'FAC-002',
    revendeur_id: 'revendeur-1',
    revendeur_name: 'Revendeur Test',
    client_id: '2',
    client_name: 'Client B - Entreprise BTP',
    items: [
      {
        product_id: '3',
        product_name: 'Panne C 80x40',
        quantity: 20,
        unit_price: 8000,
        total: 160000,
      },
    ],
    subtotal: 160000,
    marge_percentage: 18,
    marge_amount: 28800,
    total: 188800,
    status: 'validée',
    notes: 'Livraison urgente',
    created_at: '2025-02-12T10:00:00Z',
    updated_at: '2025-02-12T14:00:00Z',
    validated_at: '2025-02-12T14:00:00Z',
    paid_at: null,
  },
]

const STORAGE_KEY = 'mg_invoices'
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

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

export const mockInvoiceService: IInvoiceService = {
  async getAll(filters?: InvoiceFilters): Promise<ApiResponse<Invoice[]>> {
    await delay(300)
    try {
      let invoices = loadInvoices()
      
      if (filters?.revendeur_id) {
        invoices = invoices.filter(i => i.revendeur_id === filters.revendeur_id)
      }
      
      if (filters?.status) {
        invoices = invoices.filter(i => i.status === filters.status)
      }
      
      if (filters?.search) {
        const search = filters.search.toLowerCase()
        invoices = invoices.filter(i =>
          i.reference.toLowerCase().includes(search) ||
          i.client_name?.toLowerCase().includes(search)
        )
      }
      
      return { data: invoices, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async getById(id: string): Promise<ApiResponse<Invoice>> {
    await delay(200)
    try {
      const invoices = loadInvoices()
      const invoice = invoices.find(i => i.id === id)
      if (!invoice) {
        return { data: null, error: 'Facture non trouvée' }
      }
      return { data: invoice, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async create(data: CreateInvoiceInput): Promise<ApiResponse<Invoice>> {
    await delay(400)
    try {
      const invoices = loadInvoices()
      
      // Calculer le subtotal
      const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
      const marge_amount = (subtotal * data.marge_percentage) / 100
      const total = subtotal + marge_amount
      
      // Créer les items complets avec product_name et total
      const completeItems: InvoiceItem[] = data.items.map(item => ({
        product_id: item.product_id,
        product_name: `Produit ${item.product_id}`, // À remplacer par le vrai nom en production
        quantity: item.quantity,
        unit_price: item.unit_price,
        total: item.quantity * item.unit_price,
      }))
      
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        reference: `DEV-${String(invoices.length + 1).padStart(3, '0')}`,
        revendeur_id: data.revendeur_id,
        revendeur_name: 'Revendeur Test', // À remplacer par le vrai nom
        client_id: data.client_id || null,
        client_name: data.client_name || null,
        items: completeItems,
        subtotal,
        marge_percentage: data.marge_percentage,
        marge_amount,
        total,
        status: 'brouillon',
        notes: data.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        validated_at: null,
        paid_at: null,
      }
      
      invoices.push(newInvoice)
      saveInvoices(invoices)
      return { data: newInvoice, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async update(data: UpdateInvoiceInput): Promise<ApiResponse<Invoice>> {
    await delay(400)
    try {
      const invoices = loadInvoices()
      const index = invoices.findIndex(i => i.id === data.id)
      if (index === -1) {
        return { data: null, error: 'Facture non trouvée' }
      }
      
      // Copier l'invoice existante
      const updated: Invoice = {
        ...invoices[index],
        updated_at: new Date().toISOString(),
      }
      
      // Mettre à jour les champs simples
      if (data.status !== undefined) {
        updated.status = data.status
      }
      if (data.notes !== undefined) {
        updated.notes = data.notes || null
      }
      if (data.client_id !== undefined) {
        updated.client_id = data.client_id || null
      }
      if (data.client_name !== undefined) {
        updated.client_name = data.client_name || null
      }
      
      // Si les items ou la marge changent, recalculer tout
      if (data.items || data.marge_percentage !== undefined) {
        // Utiliser les nouveaux items ou garder les anciens
        const itemsToUse = data.items ? data.items : updated.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
        }))
        
        // Créer les items complets
        const completeItems: InvoiceItem[] = itemsToUse.map(item => ({
          product_id: item.product_id,
          product_name: `Produit ${item.product_id}`, // À remplacer
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.quantity * item.unit_price,
        }))
        
        // Recalculer les totaux
        const subtotal = completeItems.reduce((sum, item) => sum + item.total, 0)
        const marge_percentage = data.marge_percentage !== undefined ? data.marge_percentage : updated.marge_percentage
        const marge_amount = (subtotal * marge_percentage) / 100
        const total = subtotal + marge_amount
        
        updated.items = completeItems
        updated.subtotal = subtotal
        updated.marge_percentage = marge_percentage
        updated.marge_amount = marge_amount
        updated.total = total
      }
      
      invoices[index] = updated
      saveInvoices(invoices)
      return { data: updated, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300)
    try {
      const invoices = loadInvoices()
      const filtered = invoices.filter(i => i.id !== id)
      if (filtered.length === invoices.length) {
        return { data: null, error: 'Facture non trouvée' }
      }
      saveInvoices(filtered)
      return { data: undefined, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async validate(id: string): Promise<ApiResponse<Invoice>> {
    await delay(300)
    try {
      const invoices = loadInvoices()
      const invoice = invoices.find(i => i.id === id)
      if (!invoice) {
        return { data: null, error: 'Facture non trouvée' }
      }
      invoice.status = 'validée'
      invoice.validated_at = new Date().toISOString()
      invoice.updated_at = new Date().toISOString()
      saveInvoices(invoices)
      return { data: invoice, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async markAsPaid(id: string): Promise<ApiResponse<Invoice>> {
    await delay(300)
    try {
      const invoices = loadInvoices()
      const invoice = invoices.find(i => i.id === id)
      if (!invoice) {
        return { data: null, error: 'Facture non trouvée' }
      }
      invoice.status = 'payée'
      invoice.paid_at = new Date().toISOString()
      invoice.updated_at = new Date().toISOString()
      saveInvoices(invoices)
      return { data: invoice, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async generatePDF(id: string): Promise<ApiResponse<Blob>> {
    await delay(500)
    // Mock PDF generation
    return { data: null, error: 'Génération PDF non implémentée en mode mock' }
  },
}
