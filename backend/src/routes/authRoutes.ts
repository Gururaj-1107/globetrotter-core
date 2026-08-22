import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { generateToken, authenticateToken, AuthRequest } from '../middleware/authMiddleware'

const router = Router()
const prisma = new PrismaClient()

// In-memory fallback / cache store
export interface UserRecord {
  id: string
  email: string
  passwordHash?: string
  authProvider: 'EMAIL_PASSWORD' | 'GOOGLE' | 'BOTH'
  googleId?: string
  firstName: string
  lastName: string
  phoneNumber?: string
  city?: string
  country?: string
  avatarUrl?: string
  bio?: string
  role: 'USER' | 'ADMIN'
  createdAt: string
}

export let USERS: UserRecord[] = [
  {
    id: 'usr-demo-wanderer',
    email: 'traveler@globetrotter.com',
    passwordHash: bcrypt.hashSync('password123', 10),
    authProvider: 'EMAIL_PASSWORD',
    firstName: 'Alex',
    lastName: 'Rivers',
    phoneNumber: '+1 555-019-2834',
    city: 'San Francisco',
    country: 'USA',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    bio: 'Passionate globetrotter, mountain hiker, and cultural explorer seeking authentic local experiences.',
    role: 'USER',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-demo-admin',
    email: 'admin@globetrotter.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    authProvider: 'EMAIL_PASSWORD',
    firstName: 'Clara',
    lastName: 'Martin',
    phoneNumber: '+1 555-432-8765',
    city: 'London',
    country: 'UK',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    bio: 'GlobeTrotter Lead Operations & City Curator.',
    role: 'ADMIN',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr-google-demo',
    email: 'rahul@gmail.com',
    authProvider: 'GOOGLE',
    googleId: 'google-oauth-1092837461',
    firstName: 'Rahul',
    lastName: 'Sharma',
    phoneNumber: '+91 98765 43210',
    city: 'Mumbai',
    country: 'India',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    bio: 'Exploring Asia and Europe one city at a time.',
    role: 'USER',
    createdAt: new Date().toISOString()
  }
]

// 1. Check Auth Provider for an email (Edge Case Step 1)
router.post('/check-provider', async (req: Request, res: Response) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email is required' })
  }

  const normalizedEmail = email.trim().toLowerCase()

  try {
    // Try PostgreSQL via Prisma
    const dbUser = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (dbUser) {
      if (dbUser.authProvider === 'GOOGLE' && !dbUser.passwordHash) {
        return res.json({
          exists: true,
          provider: 'GOOGLE',
          hasPassword: false,
          message: 'This account was created using Google Sign-In.',
          actionRequired: 'CONTINUE_WITH_GOOGLE',
          user: {
            email: dbUser.email,
            firstName: dbUser.firstName,
            avatarUrl: dbUser.avatarUrl
          }
        })
      }

      return res.json({
        exists: true,
        provider: dbUser.authProvider,
        hasPassword: !!dbUser.passwordHash,
        actionRequired: 'ENTER_PASSWORD'
      })
    }
  } catch (e) {
    // Prisma fallback to local array
  }

  const user = USERS.find(u => u.email.toLowerCase() === normalizedEmail)

  if (!user) {
    return res.json({
      exists: false,
      provider: null,
      message: 'Account not found. You can sign up.'
    })
  }

  if (user.authProvider === 'GOOGLE' && !user.passwordHash) {
    return res.json({
      exists: true,
      provider: 'GOOGLE',
      hasPassword: false,
      message: 'This account was created using Google Sign-In.',
      actionRequired: 'CONTINUE_WITH_GOOGLE',
      user: {
        email: user.email,
        firstName: user.firstName,
        avatarUrl: user.avatarUrl
      }
    })
  }

  return res.json({
    exists: true,
    provider: user.authProvider,
    hasPassword: true,
    actionRequired: 'ENTER_PASSWORD'
  })
})

// 2. Google Authentication (Login or Auto-Signup)
router.post('/google-auth', async (req: Request, res: Response) => {
  const { email, googleId, firstName, lastName, avatarUrl } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email is required for Google Sign-In' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  let user: any = null

  try {
    // Try PostgreSQL via Prisma
    let dbUser = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          email: normalizedEmail,
          googleId: googleId || `google-${Date.now()}`,
          authProvider: 'GOOGLE',
          firstName: firstName || email.split('@')[0],
          lastName: lastName || '',
          avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          bio: 'GlobeTrotter explorer signed up with Google.',
          role: 'USER'
        }
      })
    } else if (!dbUser.googleId) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { googleId: googleId || `google-${Date.now()}`, authProvider: 'BOTH' }
      })
    }
    user = dbUser
  } catch (e) {
    // Fallback to in-memory store
    let memUser = USERS.find(u => u.email.toLowerCase() === normalizedEmail)
    if (!memUser) {
      memUser = {
        id: `usr-g-${Date.now()}`,
        email: normalizedEmail,
        googleId: googleId || `google-${Date.now()}`,
        authProvider: 'GOOGLE',
        firstName: firstName || email.split('@')[0],
        lastName: lastName || '',
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        bio: 'GlobeTrotter explorer signed up with Google.',
        role: 'USER',
        createdAt: new Date().toISOString()
      }
      USERS.push(memUser)
    } else if (!memUser.googleId) {
      memUser.googleId = googleId || `google-${Date.now()}`
      memUser.authProvider = 'BOTH'
    }
    user = memUser
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName
  })

  return res.json({
    message: 'Google authentication successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      city: user.city,
      country: user.country,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      role: user.role,
      authProvider: user.authProvider,
      needsPasswordSetup: user.authProvider === 'GOOGLE' && !user.passwordHash
    }
  })
})

// 3. Link Password to an existing Google account (Edge Case Step 2)
router.post('/link-password', authenticateToken, async (req: AuthRequest, res: Response) => {
  const { password, confirmPassword } = req.body
  const userId = req.user?.id

  if (!password || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' })
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: { passwordHash, authProvider: 'BOTH' }
    })
    return res.json({
      success: true,
      message: 'Password successfully created and linked to your account.',
      user: {
        id: updated.id,
        email: updated.email,
        authProvider: updated.authProvider
      }
    })
  } catch (e) {
    // Fallback
    const memUser = USERS.find(u => u.id === userId)
    if (memUser) {
      memUser.passwordHash = passwordHash
      memUser.authProvider = 'BOTH'
      return res.json({
        success: true,
        message: 'Password successfully created and linked to your account.',
        user: { id: memUser.id, email: memUser.email, authProvider: memUser.authProvider }
      })
    }
    return res.status(404).json({ error: 'User not found' })
  }
})

// 4. Standard Email + Password Login
router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  let user: any = null

  try {
    user = await prisma.user.findUnique({ where: { email: normalizedEmail } })
  } catch (e) {
    user = USERS.find(u => u.email.toLowerCase() === normalizedEmail)
  }

  if (!user) {
    user = USERS.find(u => u.email.toLowerCase() === normalizedEmail)
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  if (user.authProvider === 'GOOGLE' && !user.passwordHash) {
    return res.status(400).json({
      error: 'This account was created using Google Sign-In. Please sign in with Google.',
      code: 'GOOGLE_SIGN_IN_ONLY',
      provider: 'GOOGLE'
    })
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash || '')
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName
  })

  return res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      city: user.city,
      country: user.country,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      role: user.role,
      authProvider: user.authProvider
    }
  })
})

// 5. User Registration (All Wireframe Fields)
router.post('/register', async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone, city, country, bio, avatarUrl } = req.body

  if (!email || !password || !firstName) {
    return res.status(400).json({ error: 'First name, email, and password are required' })
  }

  const normalizedEmail = email.trim().toLowerCase()
  const passwordHash = await bcrypt.hash(password, 10)
  let newUser: any = null

  try {
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' })
    }

    newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        authProvider: 'EMAIL_PASSWORD',
        firstName: firstName.trim(),
        lastName: (lastName || '').trim(),
        phoneNumber: phone || '',
        city: city || '',
        country: country || '',
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        bio: bio || '',
        role: 'USER'
      }
    })
  } catch (e) {
    // Memory fallback
    const existingMem = USERS.find(u => u.email.toLowerCase() === normalizedEmail)
    if (existingMem) {
      return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' })
    }

    newUser = {
      id: `usr-${Date.now()}`,
      email: normalizedEmail,
      passwordHash,
      authProvider: 'EMAIL_PASSWORD',
      firstName: firstName.trim(),
      lastName: (lastName || '').trim(),
      phoneNumber: phone || '',
      city: city || '',
      country: country || '',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      bio: bio || '',
      role: 'USER',
      createdAt: new Date().toISOString()
    }
    USERS.push(newUser)
  }

  const token = generateToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
    firstName: newUser.firstName,
    lastName: newUser.lastName
  })

  return res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      phoneNumber: newUser.phoneNumber,
      city: newUser.city,
      country: newUser.country,
      avatarUrl: newUser.avatarUrl,
      bio: newUser.bio,
      role: newUser.role,
      authProvider: newUser.authProvider
    }
  })
})

// 6. Get Current User Profile (Me)
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id
  let user: any = null

  try {
    user = await prisma.user.findUnique({ where: { id: userId } })
  } catch (e) {
    user = USERS.find(u => u.id === userId)
  }

  if (!user) {
    user = USERS.find(u => u.id === userId)
  }

  if (!user) {
    return res.status(404).json({ error: 'User profile not found' })
  }

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      city: user.city,
      country: user.country,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      role: user.role,
      authProvider: user.authProvider
    }
  })
})

// 7. Update Profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id
  const { firstName, lastName, phoneNumber, city, country, bio, avatarUrl } = req.body

  try {
    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(firstName ? { firstName } : {}),
        ...(lastName !== undefined ? { lastName } : {}),
        ...(phoneNumber !== undefined ? { phoneNumber } : {}),
        ...(city !== undefined ? { city } : {}),
        ...(country !== undefined ? { country } : {}),
        ...(bio !== undefined ? { bio } : {}),
        ...(avatarUrl ? { avatarUrl } : {})
      }
    })

    return res.json({
      message: 'Profile updated successfully',
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        phoneNumber: updated.phoneNumber,
        city: updated.city,
        country: updated.country,
        avatarUrl: updated.avatarUrl,
        bio: updated.bio,
        role: updated.role,
        authProvider: updated.authProvider
      }
    })
  } catch (e) {
    const user = USERS.find(u => u.id === userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    if (firstName) user.firstName = firstName
    if (lastName !== undefined) user.lastName = lastName
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber
    if (city !== undefined) user.city = city
    if (country !== undefined) user.country = country
    if (bio !== undefined) user.bio = bio
    if (avatarUrl) user.avatarUrl = avatarUrl

    return res.json({
      message: 'Profile updated successfully',
      user
    })
  }
})

export default router
