'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { User, UserRole } from '@/types'
import {
  authenticateUser,
  registerUser,
  findUserById,
} from '@/lib/data/users'

const AUTH_STORAGE_KEY = 'kafe-market-auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  hasRole: (roles: UserRole | UserRole[]) => boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  role: UserRole
  companyName?: string
  phone?: string
  city?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const { userId } = JSON.parse(stored)
        const foundUser = findUserById(userId)
        if (foundUser) {
          const { password: _, ...userWithoutPassword } = foundUser
          setUser(userWithoutPassword)
        }
      }
    } catch (error) {
      console.error('Failed to load auth state:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save auth state to localStorage
  const saveAuthState = useCallback((userId: string | null) => {
    if (userId) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ userId }))
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }, [])

  const login = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const authenticatedUser = authenticateUser(email, password)

        if (authenticatedUser) {
          setUser(authenticatedUser)
          saveAuthState(authenticatedUser.id)
          return { success: true }
        }

        return { success: false, error: 'E-posta veya şifre hatalı' }
      } catch (error) {
        console.error('Login error:', error)
        return { success: false, error: 'Giriş yapılırken bir hata oluştu' }
      }
    },
    [saveAuthState]
  )

  const register = useCallback(
    async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
      try {
        const newUser = registerUser({
          email: data.email,
          password: data.password,
          name: data.name,
          role: data.role,
          companyName: data.companyName,
          phone: data.phone,
          city: data.city,
        })

        if (newUser) {
          setUser(newUser)
          saveAuthState(newUser.id)
          return { success: true }
        }

        return { success: false, error: 'Bu e-posta adresi zaten kullanımda' }
      } catch (error) {
        console.error('Register error:', error)
        return { success: false, error: 'Kayıt olurken bir hata oluştu' }
      }
    },
    [saveAuthState]
  )

  const logout = useCallback(() => {
    setUser(null)
    saveAuthState(null)
    router.push('/')
  }, [router, saveAuthState])

  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!user) return false
      const roleArray = Array.isArray(roles) ? roles : [roles]
      return roleArray.includes(user.role)
    },
    [user]
  )

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
