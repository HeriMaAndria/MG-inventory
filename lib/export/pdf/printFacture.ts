/**
 * IMPRESSION FACTURE
 * Ouvre le dialogue d'impression du navigateur
 */

import { generateFacturePDF } from '../pdf/facturePDF'
import type { Invoice } from '@/lib/types/models'

export async function printFacture(invoice: Invoice): Promise<void> {
  try {
    // Générer le PDF
    const pdf = await generateFacturePDF(invoice)
    
    // Ouvrir dans une nouvelle fenêtre pour impression
    const blob = pdf.output('blob')
    const url = URL.createObjectURL(blob)
    
    // Créer iframe caché
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = url
    
    document.body.appendChild(iframe)
    
    // Attendre chargement puis imprimer
    iframe.onload = () => {
      iframe.contentWindow?.print()
      
      // Nettoyer après impression
      setTimeout(() => {
        document.body.removeChild(iframe)
        URL.revokeObjectURL(url)
      }, 100)
    }
  } catch (error) {
    console.error('Erreur impression:', error)
    throw error
  }
}
