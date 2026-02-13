'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Package,
  AlertTriangle,
  DollarSign,
} from 'lucide-react';
import { useUserStore } from '@/lib/store';
import { mockApi } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/utils/format';
import type { DashboardKPIs, UserDashboardKPIs } from '@/types';

export default function DashboardPage() {
  const user = useUserStore(state => state.user);
  const [kpis, setKpis] = useState<DashboardKPIs | UserDashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadKPIs = async () => {
      try {
        if (user?.role === 'manager' || user?.role === 'admin') {
          const data = await mockApi.getDashboardKPIs();
          setKpis(data);
        } else {
          const data = await mockApi.getUserDashboardKPIs(user?.id || '');
          setKpis(data);
        }
      } catch (error) {
        console.error('Error loading KPIs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadKPIs();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const isManager = user?.role === 'manager' || user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">
          Bienvenue {user?.full_name} - {user?.seller_reference}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isManager ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Chiffre d'affaires total
                </CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency((kpis as DashboardKPIs)?.total_revenue || 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Marge: {formatCurrency((kpis as DashboardKPIs)?.total_margin || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Factures en attente
                </CardTitle>
                <FileText className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(kpis as DashboardKPIs)?.pending_invoices || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">À valider</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Stock faible
                </CardTitle>
                <Package className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(kpis as DashboardKPIs)?.low_stock_products || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Critique: {(kpis as DashboardKPIs)?.critical_stock_products || 0}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Factures aujourd'hui
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(kpis as DashboardKPIs)?.invoices_today || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency((kpis as DashboardKPIs)?.revenue_today || 0)}
                </p>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  CA aujourd'hui
                </CardTitle>
                <DollarSign className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency((kpis as UserDashboardKPIs)?.revenue_today || 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Marge: {formatCurrency((kpis as UserDashboardKPIs)?.margin_today || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Factures aujourd'hui
                </CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(kpis as UserDashboardKPIs)?.invoices_today || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">Ce mois: {(kpis as UserDashboardKPIs)?.invoices_this_month || 0}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  CA ce mois
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency((kpis as UserDashboardKPIs)?.revenue_this_month || 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Marge: {formatCurrency((kpis as UserDashboardKPIs)?.margin_this_month || 0)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  Stock faible
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(kpis as UserDashboardKPIs)?.low_stock_count || 0}
                </div>
                <p className="text-xs text-gray-500 mt-1">Produits</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Recent activity placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">Les dernières activités apparaîtront ici.</p>
        </CardContent>
      </Card>
    </div>
  );
}
