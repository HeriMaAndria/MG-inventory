import { useState, useEffect, useCallback } from 'react'
import { InvoiceService } from '../services/invoiceService'

export function useInvoices(filter = 'all') {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await InvoiceService.getMyInvoices(filter)
      setInvoices(data || [])
    } catch (err) {
      console.error('Erreur lors du chargement des factures:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    loadInvoices()

    // Réaltime subscription
    const subscription = supabase
      .channel('invoices-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'invoices' },
        () => loadInvoices()
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [filter, loadInvoices])

  return {
    invoices,
    loading,
    error,
    refresh: loadInvoices
  }
}

export function usePendingInvoices() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await InvoiceService.getPendingInvoices()
      setInvoices(data || [])
    } catch (err) {
      console.error('Erreur:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInvoices()

    // Realtime
    const subscription = supabase
      .channel('pending-invoices-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'invoices' },
        () => loadInvoices()
      )
      .subscribe()

    return () => subscription.unsubscribe()
  }, [loadInvoices])

  return {
    invoices,
    loading,
    error,
    refresh: loadInvoices
  }
}
