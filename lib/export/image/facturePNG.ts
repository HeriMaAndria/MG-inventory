/**
 * EXPORT FACTURE EN PNG
 * Génère d'abord le PDF puis le convertit en PNG
 */

import { generateFacturePDF } from '../pdf/facturePDF'
import type { Invoice } from '@/lib/types/invoice'

export async function exportFactureToPNG(invoice: Invoice): Promise<void> {
  try {
    // Générer le PDF
    const pdf = await generateFacturePDF(invoice)
    
    // Convertir en PNG (page 1 uniquement)
    const canvas = await pdfToCanvas(pdf)
    
    // Télécharger
    const link = document.createElement('a')
    link.download = `facture-${invoice.reference}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('Erreur export PNG:', error)
    throw error
  }
}

async function pdfToCanvas(pdf: any): Promise<HTMLCanvasElement> {
  // Obtenir la première page comme image
  const imgData = pdf.output('dataurlstring')
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      // A3 en pixels (300 DPI)
      canvas.width = 3508  // 297mm * 300/25.4
      canvas.height = 4961 // 420mm * 300/25.4
      
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context non disponible'))
        return
      }
      
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      resolve(canvas)
    }
    img.onerror = reject
    img.src = imgData
  })
}
