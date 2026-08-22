import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  city?: string
  country?: string
  avatarUrl?: string
  bio?: string
  role: 'USER' | 'ADMIN'
  authProvider?: 'EMAIL_PASSWORD' | 'GOOGLE' | 'BOTH'
  needsPasswordSetup?: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  googleAuth: (googleData: { email: string; firstName?: string; lastName?: string; avatarUrl?: string }) => Promise<User>
  checkProvider: (email: string) => Promise<{ exists: boolean; provider: string | null; hasPassword: boolean; message?: string; actionRequired?: string }>
  linkPassword: (password: string, confirmPassword: string) => Promise<void>
  logout: () => void
  updateProfile: (profileData: Partial<User>) => Promise<void>
  loginAsDemo: (type: 'traveler' | 'admin' | 'google') => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('globetrotter_user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('globetrotter_token'))
  const [loading, setLoading] = useState(false)

  // Sync token and user in storage
  const setAuthData = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('globetrotter_token', newToken)
    localStorage.setItem('globetrotter_user', JSON.stringify(newUser))
    localStorage.setItem('globetrotter_user_profile', JSON.stringify(newUser))
  }

  const checkProvider = async (email: string) => {
    return await api.auth.checkProvider(email)
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const data = await api.auth.login(email, password)
      setAuthData(data.token, data.user)
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData: any) => {
    setLoading(true)
    try {
      const data = await api.auth.register(userData)
      setAuthData(data.token, data.user)
    } finally {
      setLoading(false)
    }
  }

  const googleAuth = async (googleData: { email: string; firstName?: string; lastName?: string; avatarUrl?: string }) => {
    setLoading(true)
    try {
      const data = await api.auth.googleAuth(googleData)
      setAuthData(data.token, data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  const linkPassword = async (password: string, confirmPassword: string) => {
    setLoading(true)
    try {
      const res = await api.auth.linkPassword(password, confirmPassword)
      if (user) {
        const updated = { ...user, authProvider: 'BOTH' as const, needsPasswordSetup: false }
        setUser(updated)
        localStorage.setItem('globetrotter_user', JSON.stringify(updated))
      }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const res = await api.auth.updateProfile(profileData)
      const updated = res.user || { ...user, ...profileData }
      setUser(updated)
      localStorage.setItem('globetrotter_user', JSON.stringify(updated))
      localStorage.setItem('globetrotter_user_profile', JSON.stringify(updated))
    } catch (e) {
      if (user) {
        const updated = { ...user, ...profileData } as User
        setUser(updated)
        localStorage.setItem('globetrotter_user', JSON.stringify(updated))
        localStorage.setItem('globetrotter_user_profile', JSON.stringify(updated))
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('globetrotter_token')
    localStorage.removeItem('globetrotter_user')
  }

  // 1-Click Demo Shortcut for fast evaluation
  const loginAsDemo = async (type: 'traveler' | 'admin' | 'google') => {
    if (type === 'traveler') {
      await login('traveler@globetrotter.com', 'password123')
    } else if (type === 'admin') {
      await login('admin@globetrotter.com', 'admin123')
    } else if (type === 'google') {
      await googleAuth({
        email: 'rahul@gmail.com',
        firstName: 'Rahul',
        lastName: 'Sharma',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        googleAuth,
        checkProvider,
        linkPassword,
        logout,
        updateProfile,
        loginAsDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
