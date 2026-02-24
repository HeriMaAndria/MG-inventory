/**
 * GÉNÉRATEUR FACTURE PDF - FORMAT A3
 * Utilise jsPDF + autoTable
 */

import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Invoice } from '@/lib/types/invoice'
import { generateQRCode } from '../image/qrcodeGenerator'

export async function generateFacturePDF(invoice: Invoice): Promise<jsPDF> {
  // Format A3 : 297 x 420 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a3',
  })

  const pageWidth = 297
  const pageHeight = 420

  // Couleurs
  const primaryColor: [number, number, number] = [253, 176, 34] // Jaune accent
  const darkBg: [number, number, number] = [26, 26, 26]
  const textColor: [number, number, number] = [255, 255, 255]

  // === EN-TÊTE ===
  doc.setFillColor(...darkBg)
  doc.rect(0, 0, pageWidth, 60, 'F')

  // Logo/Icône
  doc.setFontSize(40)
  doc.text('🧱', 20, 35)

  // Nom entreprise
  doc.setTextColor(...textColor)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('MG INVENTORY', 45, 30)

  // Adresse entreprise
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Antananarivo, Madagascar', 45, 40)
  doc.text('contact@mg-inventory.com', 45, 47)
  doc.text('+261 34 00 000 00', 45, 54)

  // Type document
  doc.setFillColor(...primaryColor)
  doc.rect(pageWidth - 90, 10, 80, 20, 'F')
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(invoice.status === 'validée' ? 'FACTURE' : 'DEVIS', pageWidth - 50, 23, { align: 'center' })

  // === INFORMATIONS FACTURE ===
  doc.setTextColor(0, 0, 0)
  let y = 80

  // Gauche : Client
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('CLIENT', 20, y)
  
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  y += 8
  doc.text(invoice.client_name || 'N/A', 20, y)
  y += 6
  doc.text(`Revendeur: ${invoice.revendeur_name}`, 20, y)

  // Droite : Détails facture
  y = 80
  const rightX = pageWidth - 20

  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.text(`N° ${invoice.reference}`, rightX, y, { align: 'right' })
  y += 7
  
  doc.setFont('helvetica', 'normal')
  doc.text(`Date: ${new Date(invoice.created_at).toLocaleDateString('fr-FR')}`, rightX, y, { align: 'right' })
  
  if (invoice.validated_at) {
    y += 7
    doc.text(`Validée: ${new Date(invoice.validated_at).toLocaleDateString('fr-FR')}`, rightX, y, { align: 'right' })
  }

  // === TABLEAU ARTICLES ===
  y = 120

  const tableData = invoice.items.map(item => [
    item.product_name,
    item.quantity.toString(),
    formatPrice(item.prix_vente),
    formatPrice(item.total_vente),
  ])

  autoTable(doc, {
    startY: y,
    head: [['Produit', 'Quantité', 'Prix unitaire', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [0, 0, 0],
      fontSize: 13,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 11,
      textColor: [0, 0, 0],
    },
    columnStyles: {
      0: { cellWidth: 140 },
      1: { cellWidth: 40, halign: 'center' },
      2: { cellWidth: 50, halign: 'right' },
      3: { cellWidth: 50, halign: 'right' },
    },
    margin: { left: 20, right: 20 },
  })

  // === TOTAUX ===
  // @ts-ignore
  y = doc.lastAutoTable.finalY + 15

  const totalsX = pageWidth - 20
  const labelX = pageWidth - 100

  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')

  // Sous-total
  doc.text('Sous-total HT:', labelX, y, { align: 'right' })
  doc.text(formatPrice(invoice.subtotal_catalogue), totalsX, y, { align: 'right' })
  y += 8

  // Marge
  doc.text(`Marge (${invoice.marge_percentage}%):`, labelX, y, { align: 'right' })
  doc.text(formatPrice(invoice.marge_total), totalsX, y, { align: 'right' })
  y += 10

  // Total
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(...primaryColor)
  doc.rect(labelX - 10, y - 7, totalsX - labelX + 10, 12, 'F')
  doc.setTextColor(0, 0, 0)
  doc.text('TOTAL TTC:', labelX, y, { align: 'right' })
  doc.text(formatPrice(invoice.total), totalsX, y, { align: 'right' })

  // === QR CODE ===
  try {
    const qrCodeDataUrl = await generateQRCode(invoice.reference)
    doc.addImage(qrCodeDataUrl, 'PNG', 20, y - 20, 40, 40)
    
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('Scanner pour vérifier', 40, y + 25, { align: 'center' })
  } catch (error) {
    console.error('Erreur génération QR code:', error)
  }

  // === NOTES ===
  if (invoice.notes) {
    y += 50
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Notes:', 20, y)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const splitNotes = doc.splitTextToSize(invoice.notes, pageWidth - 40)
    doc.text(splitNotes, 20, y + 6)
    y += splitNotes.length * 5
  }

  // === PIED DE PAGE ===
  y = pageHeight - 30

  doc.setFillColor(240, 240, 240)
  doc.rect(0, y, pageWidth, 30, 'F')

  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.setFont('helvetica', 'normal')

  const footerText = [
    'MG Inventory - Matériaux de Construction',
    'RCS Antananarivo - SIRET: XXX XXX XXX',
    'TVA: FR XX XXX XXX XXX',
  ]

  y += 8
  footerText.forEach((line, i) => {
    doc.text(line, pageWidth / 2, y + (i * 5), { align: 'center' })
  })

  return doc
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price) + ' Ar'
}
