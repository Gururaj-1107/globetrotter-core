import React, { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'
import { 
  signInWithGoogle, 
  loginWithEmail, 
  registerWithEmail, 
  getEmailProviders, 
  linkPasswordToGoogleUser, 
  logoutFirebase,
  isFirebaseConfigured 
} from '../config/firebase'

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
  firebaseUid?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  isFirebaseLive: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  googleAuth: (googleData?: { email?: string; firstName?: string; lastName?: string; avatarUrl?: string }) => Promise<User>
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
  const isFirebaseLive = isFirebaseConfigured()

  const setAuthData = (newToken: string, newUser: User) => {
    setToken(newToken)
    setUser(newUser)
    localStorage.setItem('globetrotter_token', newToken)
    localStorage.setItem('globetrotter_user', JSON.stringify(newUser))
    localStorage.setItem('globetrotter_user_profile', JSON.stringify(newUser))
  }

  // 1. Check Auth Provider (Firebase + Backend Database check)
  const checkProvider = async (email: string) => {
    if (isFirebaseLive) {
      try {
        const methods = await getEmailProviders(email)
        if (methods.includes('google.com') && !methods.includes('password')) {
          return {
            exists: true,
            provider: 'GOOGLE',
            hasPassword: false,
            message: 'This account was created using Google Sign-In.',
            actionRequired: 'CONTINUE_WITH_GOOGLE'
          }
        } else if (methods.includes('password')) {
          return {
            exists: true,
            provider: methods.includes('google.com') ? 'BOTH' : 'EMAIL_PASSWORD',
            hasPassword: true,
            actionRequired: 'ENTER_PASSWORD'
          }
        }
      } catch (e) {
        // Fallback to backend API check
      }
    }
    return await api.auth.checkProvider(email)
  }

  // 2. Email + Password Login
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      if (isFirebaseLive) {
        try {
          await loginWithEmail(email, password)
        } catch (fbErr: any) {
          console.warn('Firebase login notice:', fbErr.message)
        }
      }
      const data = await api.auth.login(email, password)
      setAuthData(data.token, data.user)
    } finally {
      setLoading(false)
    }
  }

  // 3. Email + Password Registration
  const register = async (userData: any) => {
    setLoading(true)
    try {
      if (isFirebaseLive) {
        try {
          await registerWithEmail(userData.email, userData.password, `${userData.firstName} ${userData.lastName || ''}`)
        } catch (fbErr: any) {
          console.warn('Firebase registration notice:', fbErr.message)
        }
      }
      const data = await api.auth.register(userData)
      setAuthData(data.token, data.user)
    } finally {
      setLoading(false)
    }
  }

  // 4. Google Sign-In (Real Firebase Popup or passed payload)
  const googleAuth = async (googleData?: { email?: string; firstName?: string; lastName?: string; avatarUrl?: string }) => {
    setLoading(true)
    try {
      let email = googleData?.email
      let firstName = googleData?.firstName
      let lastName = googleData?.lastName
      let avatarUrl = googleData?.avatarUrl
      let googleUid: string | undefined

      if (isFirebaseLive && !googleData?.email) {
        // Trigger real Firebase Google Popup window
        const fbResult = await signInWithGoogle()
        const fbUser = fbResult.user
        email = fbUser.email || undefined
        const nameParts = (fbUser.displayName || 'Google Traveler').split(' ')
        firstName = nameParts[0]
        lastName = nameParts.slice(1).join(' ')
        avatarUrl = fbUser.photoURL || undefined
        googleUid = fbUser.uid
      } else if (!email) {
        email = 'rahul@gmail.com'
      }

      if (!email) {
        throw new Error('No email found from Google account.')
      }

      const data = await api.auth.googleAuth({
        email,
        firstName: firstName || email.split('@')[0],
        lastName: lastName || '',
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        googleId: googleUid
      })

      setAuthData(data.token, data.user)
      return data.user
    } finally {
      setLoading(false)
    }
  }

  // 5. Link Password to Google Account
  const linkPassword = async (password: string, confirmPassword: string) => {
    setLoading(true)
    try {
      if (isFirebaseLive && user?.email) {
        try {
          await linkPasswordToGoogleUser(user.email, password)
        } catch (fbErr: any) {
          console.warn('Firebase link password notice:', fbErr.message)
        }
      }
      await api.auth.linkPassword(password, confirmPassword)
      if (user) {
        const updated = { ...user, authProvider: 'BOTH' as const, needsPasswordSetup: false }
        setUser(updated)
        localStorage.setItem('globetrotter_user', JSON.stringify(updated))
      }
    } finally {
      setLoading(false)
    }
  }

  // 6. Update Profile
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

  // 7. Sign Out
  const logout = () => {
    if (isFirebaseLive) {
      logoutFirebase().catch(() => {})
    }
    setUser(null)
    setToken(null)
    localStorage.removeItem('globetrotter_token')
    localStorage.removeItem('globetrotter_user')
  }

  // 1-Click Demo Shortcut
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
        isFirebaseLive,
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
