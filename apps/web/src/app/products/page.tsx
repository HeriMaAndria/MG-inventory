'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, AlertTriangle } from 'lucide-react';
import { mockApi } from '@/lib/mock-data';
import { formatCurrency, getUnitLabel } from '@/lib/utils/format';
import type { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await mockApi.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Produits</h1>
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
          <h1 className="text-3xl font-bold">Produits</h1>
          <p className="text-gray-500 mt-1">Gérez votre catalogue de produits</p>
        </div>
        <Button asChild>
          <Link href="/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">Aucun produit trouvé</p>
            </CardContent>
          </Card>
        ) : (
          products.map(product => (
            <Card key={product.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{product.name}</CardTitle>
                    <p className="text-sm text-gray-500 mt-1">Ref: {product.reference}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {product.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.variants?.map(variant => {
                    const isLowStock = variant.stock_quantity <= variant.stock_alert_threshold;
                    return (
                      <div
                        key={variant.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{variant.name}</p>
                            {isLowStock && (
                              <AlertTriangle className="h-4 w-4 text-orange-600" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">SKU: {variant.sku}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-sm font-medium">
                            Prix: {formatCurrency(variant.manager_sale_price)} /{' '}
                            {getUnitLabel(variant.unit_type)}
                          </p>
                          <p className={`text-sm ${isLowStock ? 'text-orange-600 font-medium' : 'text-gray-600'}`}>
                            Stock: {variant.stock_quantity} {getUnitLabel(variant.unit_type)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
