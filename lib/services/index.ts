/**
 * SERVICES - POINT D'ENTRÉE
 * 
 * Ce fichier expose les services utilisés dans l'application
 * Pour changer de backend, il suffit de changer les imports ici
 */

import { mockProductService } from './implementations/mockProductService'
// Plus tard :
// import { supabaseProductService } from './implementations/supabaseProductService'

// Export des services actifs
export const productService = mockProductService
// Quand tu passes à Supabase :
// export const productService = supabaseProductService

// À ajouter plus tard :
// export const clientService = mockClientService
// export const invoiceService = mockInvoiceService
// export const orderService = mockOrderService
// export const statsService = mockStatsService
