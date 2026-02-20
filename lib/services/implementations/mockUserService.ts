/**
 * MOCK USER SERVICE
 * Gestion des utilisateurs (Admin uniquement)
 */

export interface UserAccount {
  id: string
  email: string
  role: 'admin' | 'gerant' | 'revendeur'
  name: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserInput {
  email: string
  password: string
  role: 'admin' | 'gerant' | 'revendeur'
  name: string
}

export interface UpdateUserInput {
  id: string
  email?: string
  role?: 'admin' | 'gerant' | 'revendeur'
  name?: string
  active?: boolean
}

export interface ApiResponse<T> {
  data: T | null
  error: string | null
}

const MOCK_USERS: UserAccount[] = [
  {
    id: 'admin-1',
    email: 'admin@mg.com',
    role: 'admin',
    name: 'Admin Test',
    active: true,
    created_at: '2025-01-01T10:00:00Z',
    updated_at: '2025-01-01T10:00:00Z',
  },
  {
    id: 'gerant-1',
    email: 'gerant@mg.com',
    role: 'gerant',
    name: 'Gérant Test',
    active: true,
    created_at: '2025-01-05T10:00:00Z',
    updated_at: '2025-01-05T10:00:00Z',
  },
  {
    id: 'revendeur-1',
    email: 'revendeur@mg.com',
    role: 'revendeur',
    name: 'Revendeur Test',
    active: true,
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-10T10:00:00Z',
  },
  {
    id: 'revendeur-2',
    email: 'revendeur2@mg.com',
    role: 'revendeur',
    name: 'Revendeur 2',
    active: true,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
  },
]

const STORAGE_KEY = 'mg_users'
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const loadUsers = (): UserAccount[] => {
  if (typeof window === 'undefined') return MOCK_USERS
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_USERS))
    return MOCK_USERS
  }
  try {
    return JSON.parse(stored)
  } catch {
    return MOCK_USERS
  }
}

const saveUsers = (users: UserAccount[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export const mockUserService = {
  async getAll(): Promise<ApiResponse<UserAccount[]>> {
    await delay(300)
    try {
      const users = loadUsers()
      return { data: users, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async getById(id: string): Promise<ApiResponse<UserAccount>> {
    await delay(200)
    try {
      const users = loadUsers()
      const user = users.find(u => u.id === id)
      if (!user) {
        return { data: null, error: 'Utilisateur non trouvé' }
      }
      return { data: user, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async create(data: CreateUserInput): Promise<ApiResponse<UserAccount>> {
    await delay(400)
    try {
      const users = loadUsers()
      
      // Vérifier si l'email existe déjà
      if (users.find(u => u.email === data.email)) {
        return { data: null, error: 'Cet email est déjà utilisé' }
      }
      
      const newUser: UserAccount = {
        id: Date.now().toString(),
        email: data.email,
        role: data.role,
        name: data.name,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      users.push(newUser)
      saveUsers(users)
      return { data: newUser, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async update(data: UpdateUserInput): Promise<ApiResponse<UserAccount>> {
    await delay(400)
    try {
      const users = loadUsers()
      const index = users.findIndex(u => u.id === data.id)
      if (index === -1) {
        return { data: null, error: 'Utilisateur non trouvé' }
      }
      
      const updated: UserAccount = {
        ...users[index],
        ...data,
        updated_at: new Date().toISOString(),
      }
      
      users[index] = updated
      saveUsers(users)
      return { data: updated, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    await delay(300)
    try {
      const users = loadUsers()
      const filtered = users.filter(u => u.id !== id)
      if (filtered.length === users.length) {
        return { data: null, error: 'Utilisateur non trouvé' }
      }
      saveUsers(filtered)
      return { data: undefined, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },

  async toggleActive(id: string): Promise<ApiResponse<UserAccount>> {
    await delay(300)
    try {
      const users = loadUsers()
      const user = users.find(u => u.id === id)
      if (!user) {
        return { data: null, error: 'Utilisateur non trouvé' }
      }
      
      user.active = !user.active
      user.updated_at = new Date().toISOString()
      saveUsers(users)
      return { data: user, error: null }
    } catch (err: any) {
      return { data: null, error: err.message }
    }
  },
}
