import { User } from '@/types'

// Mock users for MVP
// In production, this would be a database with hashed passwords
export interface StoredUser extends User {
  password: string // In real app, this would be hashed
}

export const mockUsers: StoredUser[] = [
  {
    id: 'user-1',
    email: 'kafe@example.com',
    password: 'kafe123',
    name: 'Ahmet Yılmaz',
    role: 'cafe',
    companyName: 'Kahve Durağı',
    phone: '0532 111 22 33',
    city: 'İstanbul',
    createdAt: '2024-01-01',
  },
  {
    id: 'user-2',
    email: 'vendor@example.com',
    password: 'vendor123',
    name: 'Mehmet Demir',
    role: 'vendor',
    companyName: 'Kahve Dünyası',
    phone: '0533 222 33 44',
    city: 'İstanbul',
    vendorId: 'kahve-dunyasi',
    createdAt: '2024-01-01',
  },
  {
    id: 'user-3',
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    createdAt: '2024-01-01',
  },
]

const USERS_STORAGE_KEY = 'kafe-market-users'

// Load users from localStorage (for registered users)
function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as StoredUser[]
    }
  } catch (error) {
    console.error('Failed to load users:', error)
  }
  return []
}

// Save users to localStorage
function saveStoredUsers(users: StoredUser[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  } catch (error) {
    console.error('Failed to save users:', error)
  }
}

// Get all users (mock + stored)
export function getAllUsers(): StoredUser[] {
  return [...mockUsers, ...getStoredUsers()]
}

// Find user by email
export function findUserByEmail(email: string): StoredUser | undefined {
  return getAllUsers().find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  )
}

// Find user by ID
export function findUserById(id: string): StoredUser | undefined {
  return getAllUsers().find((u) => u.id === id)
}

// Authenticate user
export function authenticateUser(
  email: string,
  password: string
): User | null {
  const user = findUserByEmail(email)
  if (user && user.password === password) {
    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

// Register new user
export function registerUser(
  data: Omit<StoredUser, 'id' | 'createdAt'>
): User | null {
  // Check if email already exists
  if (findUserByEmail(data.email)) {
    return null
  }

  const newUser: StoredUser = {
    ...data,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  const storedUsers = getStoredUsers()
  storedUsers.push(newUser)
  saveStoredUsers(storedUsers)

  // Return user without password
  const { password: _, ...userWithoutPassword } = newUser
  return userWithoutPassword
}
