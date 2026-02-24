'use client'

/**
 * BOUTON EXPORT FACTURE
 * PDF, PNG, ou Impression
 */

import { useState } from 'react'
import type { Invoice } from '@/lib/types/models'
import { generateFacturePDF } from '@/lib/export/pdf/facturePDF'
import { exportFactureToPNG } from '@/lib/export/image/facturePNG'
import { printFacture } from '@/lib/export/pdf/printFacture'
import Button from '@/components/ui/Button'

interface ExportFactureButtonProps {
  invoice: Invoice
  type: 'pdf' | 'png' | 'print' | 'menu'
  label?: string
  className?: string
}

export default function ExportFactureButton({
  invoice,
  type,
  label,
  className = '',
}: ExportFactureButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const handleExportPDF = async () => {
    setLoading(true)
    try {
      const pdf = await generateFacturePDF(invoice)
      pdf.save(`facture-${invoice.reference}.pdf`)
    } catch (error: any) {
      alert('Erreur export PDF: ' + error.message)
    } finally {
      setLoading(false)
      setShowMenu(false)
    }
  }

  const handleExportPNG = async () => {
    setLoading(true)
    try {
      await exportFactureToPNG(invoice)
    } catch (error: any) {
      alert('Erreur export PNG: ' + error.message)
    } finally {
      setLoading(false)
      setShowMenu(false)
    }
  }

  const handlePrint = async () => {
    setLoading(true)
    try {
      await printFacture(invoice)
    } catch (error: any) {
      alert('Erreur impression: ' + error.message)
    } finally {
      setLoading(false)
      setShowMenu(false)
    }
  }

  // Menu déroulant
  if (type === 'menu') {
    return (
      <div className="relative">
        <Button
          onClick={() => setShowMenu(!showMenu)}
          isLoading={loading}
          className={className}
        >
          {label || '📤 Exporter'}
        </Button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-lg shadow-lg z-50">
            <button
              onClick={handleExportPDF}
              className="w-full px-4 py-3 text-left hover:bg-dark-elevated transition-colors text-text-primary border-b border-dark-border"
            >
              📄 PDF (A3)
            </button>
            <button
              onClick={handleExportPNG}
              className="w-full px-4 py-3 text-left hover:bg-dark-elevated transition-colors text-text-primary border-b border-dark-border"
            >
              🖼️ PNG
            </button>
            <button
              onClick={handlePrint}
              className="w-full px-4 py-3 text-left hover:bg-dark-elevated transition-colors text-text-primary"
            >
              🖨️ Imprimer
            </button>
          </div>
        )}

        {/* Backdrop pour fermer le menu */}
        {showMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
        )}
      </div>
    )
  }

  // Bouton simple
  const handlers = {
    pdf: handleExportPDF,
    png: handleExportPNG,
    print: handlePrint,
  }

  const labels = {
    pdf: '📄 PDF',
    png: '🖼️ PNG',
    print: '🖨️ Imprimer',
  }

  return (
    <Button
      onClick={handlers[type]}
      isLoading={loading}
      className={className}
    >
      {label || labels[type]}
    </Button>
  )
}
