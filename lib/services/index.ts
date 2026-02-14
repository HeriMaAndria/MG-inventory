/**
 * SERVICES - POINT D'ENTRÉE
 * 
 * Pour changer de backend, il suffit de changer les imports ici
 */

import { mockProductService } from './implementations/mockProductService'
import { mockClientService } from './implementations/mockClientService'
import { mockInvoiceService } from './implementations/mockInvoiceService'
import { mockOrderService } from './implementations/mockOrderService'
import { mockStatsService } from './implementations/mockStatsService'

// Export des services actifs (Mock)
export const productService = mockProductService
export const clientService = mockClientService
export const invoiceService = mockInvoiceService
export const orderService = mockOrderService
export const statsService = mockStatsService

// Quand tu passes à Supabase :
// import { supabaseProductService } from './implementations/supabaseProductService'
// import { supabaseClientService } from './implementations/supabaseClientService'
// ...
// export const productService = supabaseProductService
// export const clientService = supabaseClientService
// ...
