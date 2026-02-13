import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { OfflineAction } from '@/types';

interface InventoryDB extends DBSchema {
  offlineActions: {
    key: string;
    value: OfflineAction;
    indexes: { 'by-status': string; 'by-timestamp': number };
  };
  cachedInvoices: {
    key: string;
    value: any;
    indexes: { 'by-timestamp': number };
  };
  cachedProducts: {
    key: string;
    value: any;
    indexes: { 'by-timestamp': number };
  };
}

let dbInstance: IDBPDatabase<InventoryDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<InventoryDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<InventoryDB>('mg-inventory-db', 1, {
    upgrade(db) {
      // Offline actions store
      if (!db.objectStoreNames.contains('offlineActions')) {
        const actionStore = db.createObjectStore('offlineActions', { keyPath: 'id' });
        actionStore.createIndex('by-status', 'status');
        actionStore.createIndex('by-timestamp', 'timestamp');
      }

      // Cached invoices
      if (!db.objectStoreNames.contains('cachedInvoices')) {
        const invoiceStore = db.createObjectStore('cachedInvoices', { keyPath: 'id' });
        invoiceStore.createIndex('by-timestamp', 'cached_at');
      }

      // Cached products
      if (!db.objectStoreNames.contains('cachedProducts')) {
        const productStore = db.createObjectStore('cachedProducts', { keyPath: 'id' });
        productStore.createIndex('by-timestamp', 'cached_at');
      }
    },
  });

  return dbInstance;
}

// Offline Actions
export async function addOfflineAction(action: Omit<OfflineAction, 'id'>): Promise<string> {
  const db = await getDB();
  const id = `${action.type}-${action.entity}-${Date.now()}-${Math.random()}`;
  const fullAction: OfflineAction = {
    ...action,
    id,
    status: 'pending',
    retry_count: 0,
  };
  await db.add('offlineActions', fullAction);
  return id;
}

export async function getPendingActions(): Promise<OfflineAction[]> {
  const db = await getDB();
  return db.getAllFromIndex('offlineActions', 'by-status', 'pending');
}

export async function updateActionStatus(
  id: string,
  status: 'synced' | 'failed',
  retryCount?: number
): Promise<void> {
  const db = await getDB();
  const action = await db.get('offlineActions', id);
  if (!action) return;

  action.status = status;
  if (retryCount !== undefined) {
    action.retry_count = retryCount;
  }
  await db.put('offlineActions', action);
}

export async function deleteAction(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('offlineActions', id);
}

export async function clearSyncedActions(): Promise<void> {
  const db = await getDB();
  const actions = await db.getAll('offlineActions');
  const tx = db.transaction('offlineActions', 'readwrite');
  
  for (const action of actions) {
    if (action.status === 'synced') {
      await tx.store.delete(action.id);
    }
  }
  
  await tx.done;
}

// Cache management
export async function cacheInvoice(invoice: any): Promise<void> {
  const db = await getDB();
  await db.put('cachedInvoices', { ...invoice, cached_at: Date.now() });
}

export async function getCachedInvoice(id: string): Promise<any | null> {
  const db = await getDB();
  return (await db.get('cachedInvoices', id)) || null;
}

export async function cacheProduct(product: any): Promise<void> {
  const db = await getDB();
  await db.put('cachedProducts', { ...product, cached_at: Date.now() });
}

export async function getCachedProducts(): Promise<any[]> {
  const db = await getDB();
  return db.getAll('cachedProducts');
}

export async function clearCache(): Promise<void> {
  const db = await getDB();
  await db.clear('cachedInvoices');
  await db.clear('cachedProducts');
}
