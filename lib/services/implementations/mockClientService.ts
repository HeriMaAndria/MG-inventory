/**
 * MOCK CLIENT SERVICE
 * Gestion des clients des revendeurs
 */

import type { IClientService } from '../contracts'
import type {
  Client,
  CreateClientInput,
  UpdateClientInput,
  ApiResponse,
} from '@/lib/types/models'

const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    revendeur_id: 'revendeur-1',
    name: 'Client A - Construction',
    email: 'client.a@email.com',
    phone: '034 12 345 67',
    address: 'Lot ABC Antananarivo',
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z',
  },
  {
    id: '2',
    revendeur_id: 'revendeur-1',
    name: 'Client B - Entreprise BTP',
    email: 'contact@clientb.com',
    phone: '033 98 765 43',
    address: 'Zone industrielle Ankorondrano',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
  {
    id: '3',
    revendeur_id: 'revendeur-1',
    name: 'Client C - Particulier',
    email: null,
    phone: '032 55 123 45',
    address: null,
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-01T10:00:00Z',
  },
]

const STORAGE_KEY = 'mg_clients'
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const loadClients = (): Client[] => {
  if (typeof window === 'undefined') return MOCK_CLIENTS
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_CLIENTS))
    return MOCK_CLIENTS
  }
  try {
    return JSON.parse(stored)
  } catch {
    return MOCK_CLIENTS
  }
}

const saveClients = (clients: Client[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
}

export const mockClientService: IClientService = {
  async getAll(revendeurId: string): Promise<ApiResponse<Client[]>> {
    await delay(300)
    try {
      const clients = loadClients().filter(c => c.revendeur_id === revendeurId)
      return { data: clients, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async getById(id: string): Promise<ApiResponse<Client>> {
    await delay(200)
    try {
      const clients = loadClients()
      const client = clients.find(c => c.id === id)
      if (!client) {
        return { data: null, error: 'Client non trouvé' }
      }
      return { data: client, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async create(data: CreateClientInput): Promise<ApiResponse<Client>> {
    await delay(400)
    try {
      const clients = loadClients()
      const newClient: Client = {
        id: Date.now().toString(),
        revendeur_id: data.revendeur_id,
        name: data.name,
        email: data.email || null,
        phone: data.phone || null,
        address: data.address || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      clients.push(newClient)
      saveClients(clients)
      return { data: newClient, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async update(data: UpdateClientInput): Promise<ApiResponse<Client>> {
    await delay(400)
    try {
      const clients = loadClients()
      const index = clients.findIndex(c => c.id === data.id)
      if (index === -1) {
        return { data: null, error: 'Client non trouvé' }
      }
      const updated: Client = {
        ...clients[index],
        ...data,
        updated_at: new Date().toISOString(),
      }
      clients[index] = updated
      saveClients(clients)
      return { data: updated, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300)
    try {
      const clients = loadClients()
      const filtered = clients.filter(c => c.id !== id)
      if (filtered.length === clients.length) {
        return { data: null, error: 'Client non trouvé' }
      }
      saveClients(filtered)
      return { data: undefined, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },
}
