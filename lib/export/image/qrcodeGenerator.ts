/**
 * GÉNÉRATEUR QR CODE
 * Pour factures et devis
 */

import QRCode from 'qrcode'

export async function generateQRCode(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    })
    return dataUrl
  } catch (error) {
    console.error('Erreur génération QR code:', error)
    throw error
  }
}

export async function generateQRCodeBuffer(text: string): Promise<Buffer> {
  try {
    const buffer = await QRCode.toBuffer(text, {
      width: 200,
      margin: 1,
    })
    return buffer
  } catch (error) {
    console.error('Erreur génération QR code buffer:', error)
    throw error
  }
}
