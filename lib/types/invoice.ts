/**
 * TYPES MIS À JOUR - MARGE AUTOMATIQUE
 */

export type InvoiceType = 'devis' | 'facture' | 'proforma' | 'bon_commande'
export type InvoiceStatus = 'en_attente' | 'validée' | 'payée' | 'annulée'

export interface InvoiceItem {
  product_id: string
  product_name: string
  
  // Prix (2 colonnes)
  prix_catalogue: number      // Prix base entreprise (fixé par gérant)
  prix_vente: number          // Prix négocié par revendeur avec client
  
  quantity: number
  unit: string
  
  // Totaux calculés
  total_catalogue: number     // prix_catalogue × quantity
  total_vente: number         // prix_vente × quantity
  
  // Marge calculée automatiquement
  marge_unitaire: number      // prix_vente - prix_catalogue
  marge_total: number         // marge_unitaire × quantity
}

export interface Invoice {
  id: string
  reference: string
  type: InvoiceType
  status: InvoiceStatus
  
  // Acteurs
  revendeur_id: string
  revendeur_name: string
  client_id: string
  client_name: string
  
  // Articles
  items: InvoiceItem[]
  
  // Totaux
  subtotal_catalogue: number  // Somme total_catalogue (prix base)
  subtotal_vente: number      // Somme total_vente (prix final)
  
  // Marge (calculée automatiquement)
  marge_total: number         // subtotal_vente - subtotal_catalogue
  marge_percentage: number    // (marge_total / subtotal_catalogue) × 100
  
  total: number               // = subtotal_vente
  
  // Informations revendeur (pour devis uniquement)
  revendeur_info?: {
    name: string
    email: string
    phone: string
    address: string
  }
  
  // Si converti depuis devis
  origine_devis_ref?: string
  
  // Dates
  created_at: string
  validated_at?: string
  paid_at?: string
  
  // Notes
  notes?: string
}

// Helpers de calcul
export function calculateInvoiceItem(item: Omit<InvoiceItem, 'total_catalogue' | 'total_vente' | 'marge_unitaire' | 'marge_total'>): InvoiceItem {
  const total_catalogue = item.prix_catalogue * item.quantity
  const total_vente = item.prix_vente * item.quantity
  const marge_unitaire = item.prix_vente - item.prix_catalogue
  const marge_total = marge_unitaire * item.quantity
  
  return {
    ...item,
    total_catalogue,
    total_vente,
    marge_unitaire,
    marge_total,
  }
}

export function calculateInvoiceTotals(items: InvoiceItem[]): {
  subtotal_catalogue: number
  subtotal_vente: number
  marge_total: number
  marge_percentage: number
  total: number
} {
  const subtotal_catalogue = items.reduce((sum, item) => sum + item.total_catalogue, 0)
  const subtotal_vente = items.reduce((sum, item) => sum + item.total_vente, 0)
  const marge_total = subtotal_vente - subtotal_catalogue
  const marge_percentage = subtotal_catalogue > 0 ? (marge_total / subtotal_catalogue) * 100 : 0
  
  return {
    subtotal_catalogue,
    subtotal_vente,
    marge_total,
    marge_percentage,
    total: subtotal_vente,
  }
}
