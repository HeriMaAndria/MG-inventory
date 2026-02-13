'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText, Eye } from 'lucide-react';
import { mockApi } from '@/lib/mock-data';
import { formatCurrency, formatShortDate, getStatusLabel, getStatusColor } from '@/lib/utils/format';
import type { Invoice } from '@/types';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await mockApi.getInvoices();
        setInvoices(data);
      } catch (error) {
        console.error('Error loading invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Factures</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Factures</h1>
          <p className="text-gray-500 mt-1">Gérez vos devis et factures</p>
        </div>
        <Button asChild>
          <Link href="/invoices/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle facture
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des factures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Numéro
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Client
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Montant
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Statut
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Aucune facture trouvée</p>
                    </td>
                  </tr>
                ) : (
                  invoices.map(invoice => (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">
                        {invoice.invoice_number || 'Brouillon'}
                      </td>
                      <td className="py-3 px-4 text-sm">{invoice.client?.name || '-'}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {formatShortDate(invoice.invoice_date)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {invoice.invoice_type === 'quote' ? 'Devis' : 'Facture'}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {formatCurrency(invoice.total_amount)}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            invoice.status
                          )}`}
                        >
                          {getStatusLabel(invoice.status)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/invoices/${invoice.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
